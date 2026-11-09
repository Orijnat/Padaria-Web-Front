# Padaria-Web

Sistema web da padaria, feito com [Next.js](https://nextjs.org). O front (telas) e o
back-end (rotas em `src/app/api`) ficam no mesmo projeto.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

- **Fazer um Pedido** → portal do cliente: entrar ou criar conta.
- **Área Administrativa** → só contas do tipo `funcionario`. Na primeira vez é criado
  o administrador `admin@padaria.com` com a senha `admin1234`. Para mudar, use as
  variáveis `ADMIN_EMAIL` e `ADMIN_SENHA`.

### Variáveis de ambiente (`.env.local`)

| Variável              | Obrigatória      | Para que serve                                         |
| --------------------- | ---------------- | ------------------------------------------------------ |
| `JWT_SECRET`          | Sim, em produção | Segredo para assinar os tokens de login                |
| `ADMIN_SENHA`         | Sim, em produção | Senha do administrador inicial                         |
| `ADMIN_EMAIL`         | Não              | E-mail do administrador inicial (`admin@padaria.com`)  |
| `NEXT_PUBLIC_API_URL` | Não              | Endereço da API, se ela não estiver em `/api`          |

Em desenvolvimento (`npm run dev`) há valores padrão. Para `npm run build && npm start`,
defina `JWT_SECRET` e `ADMIN_SENHA`.

## Como funciona o login

1. O front chama `POST /api/auth/login` (ou `POST /api/usuarios` ao criar conta).
2. A API devolve um **token JWT**, que o front guarda no `localStorage` em `padaria-token`.
3. `src/utils/axios.js` envia o token em toda requisição (`Authorization: Bearer ...`).
4. Ao recarregar a página, o `PadariaContext` lê o token e chama `GET /api/auth/me`
   para restaurar o login.

Para chamar a API logado, importe de `@/utils/axios`:

```js
import api from '@/utils/axios';
const { data } = await api.get('/usuarios');
```

## API

Todas as rotas recebem e devolvem JSON.

### Autenticação

| Método | Rota            | Corpo                       | Resposta              |
| ------ | --------------- | --------------------------- | --------------------- |
| POST   | `/api/auth/login` | `{ email, senha, tipo? }` | `{ token, usuario }`  |
| GET    | `/api/auth/me`    | —                         | `{ usuario }`         |

Com `tipo: "funcionario"`, o login só aceita contas de funcionário (área administrativa).

### Usuários / clientes

| Método | Rota                | Quem pode                        | Descrição                                    |
| ------ | ------------------- | -------------------------------- | -------------------------------------------- |
| POST   | `/api/usuarios`     | Qualquer pessoa                  | Cadastra cliente (já devolve `token`)        |
| GET    | `/api/usuarios`     | Funcionário                      | Lista os usuários                            |
| GET    | `/api/usuarios/:id` | O próprio usuário ou funcionário | Busca um usuário                             |
| PATCH  | `/api/usuarios/:id` | O próprio usuário ou funcionário | Altera dados                                 |
| DELETE | `/api/usuarios/:id` | O próprio usuário ou funcionário | Remove o usuário                             |

Campos:

| Campo      | Obrigatório | Regras                                                      |
| ---------- | ----------- | ----------------------------------------------------------- |
| `nome`     | Sim         | Mínimo 2 letras                                             |
| `email`    | Sim         | E-mail válido e único (guardado em minúsculas)              |
| `senha`    | Sim         | Mínimo 8 caracteres, com letras e números                   |
| `telefone` | Não         | DDD + número (10 ou 11 dígitos)                             |
| `cpf`      | Não         | CPF válido                                                  |
| `tipo`     | Não         | `cliente` (padrão) ou `funcionario` — só funcionário define |

Exemplo:

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@email.com","senha":"senha1234"}'
```

Erros de validação voltam com status `400` e o detalhe por campo:

```json
{ "erro": "Dados inválidos.", "campos": { "email": "Informe um e-mail válido." } }
```

A senha nunca é devolvida pela API; ela é guardada com hash (`scrypt`).

## Onde ficam os dados

Os usuários ficam em `data/usuarios.json` (fora do git), através de
`src/lib/servidor/banco.js`. Isso funciona para rodar localmente, mas **não** em hospedagens
sem disco persistente (ex.: Vercel). Quando o projeto tiver um banco de dados, basta
reimplementar as funções desse arquivo; as rotas e telas não precisam mudar.

## Estrutura

```
src/
  app/
    page.jsx              escolha de acesso, portal do cliente e painel admin
    api/auth/             login e "quem sou eu"
    api/usuarios/         cadastro e CRUD de usuários/clientes
  components/
    admin/                telas da área administrativa
    portal/               login (cliente e admin) e portal do cliente
    ui/                   componentes reutilizáveis
  context/PadariaContext.jsx  estado do app e login
  lib/
    validacao.js          regras de validação (usadas no front e no back)
    servidor/             banco, senha e token (somente servidor)
  utils/                  axios configurado
```
