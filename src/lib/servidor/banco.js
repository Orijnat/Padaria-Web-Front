// Armazenamento simples de usuários em um arquivo JSON.
//
// Serve para desenvolvimento e para a disciplina: os dados ficam em
// `data/usuarios.json` (ignorado pelo git). Para produção, troque as funções
// deste arquivo por chamadas a um banco de dados de verdade — o resto do
// código só usa as funções exportadas aqui.
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ARQUIVO = path.join(process.cwd(), "data", "usuarios.json");

// Fila para que duas escritas simultâneas não sobrescrevam uma à outra.
let fila = Promise.resolve();

function emSerie(tarefa) {
  const resultado = fila.then(tarefa);
  fila = resultado.catch(() => {});
  return resultado;
}

async function lerTodos() {
  try {
    const conteudo = await fs.readFile(ARQUIVO, "utf8");
    return JSON.parse(conteudo);
  } catch (erro) {
    if (erro.code === "ENOENT") return [];
    throw erro;
  }
}

async function gravarTodos(usuarios) {
  await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
  const temporario = `${ARQUIVO}.tmp`;
  await fs.writeFile(temporario, JSON.stringify(usuarios, null, 2));
  await fs.rename(temporario, ARQUIVO);
}

export class EmailJaCadastradoError extends Error {
  constructor() {
    super("Já existe um usuário com este e-mail.");
  }
}

export async function listarUsuarios() {
  return lerTodos();
}

export async function buscarUsuarioPorId(id) {
  const usuarios = await lerTodos();
  return usuarios.find((u) => u.id === id) ?? null;
}

export async function buscarUsuarioPorEmail(email) {
  const usuarios = await lerTodos();
  return usuarios.find((u) => u.email === email) ?? null;
}

export async function contarUsuarios() {
  return (await lerTodos()).length;
}

export function criarUsuario(dados) {
  return emSerie(async () => {
    const usuarios = await lerTodos();
    if (usuarios.some((u) => u.email === dados.email)) {
      throw new EmailJaCadastradoError();
    }
    const agora = new Date().toISOString();
    const usuario = {
      id: randomUUID(),
      ...dados,
      criadoEm: agora,
      atualizadoEm: agora,
    };
    usuarios.push(usuario);
    await gravarTodos(usuarios);
    return usuario;
  });
}

export function atualizarUsuario(id, alteracoes) {
  return emSerie(async () => {
    const usuarios = await lerTodos();
    const indice = usuarios.findIndex((u) => u.id === id);
    if (indice === -1) return null;
    if (
      alteracoes.email &&
      usuarios.some((u) => u.email === alteracoes.email && u.id !== id)
    ) {
      throw new EmailJaCadastradoError();
    }
    const atualizado = {
      ...usuarios[indice],
      ...alteracoes,
      id,
      atualizadoEm: new Date().toISOString(),
    };
    usuarios[indice] = atualizado;
    await gravarTodos(usuarios);
    return atualizado;
  });
}

export function removerUsuario(id) {
  return emSerie(async () => {
    const usuarios = await lerTodos();
    const restantes = usuarios.filter((u) => u.id !== id);
    if (restantes.length === usuarios.length) return false;
    await gravarTodos(restantes);
    return true;
  });
}

// Cria o administrador inicial se ainda não existir nenhum funcionário,
// para alguém conseguir entrar na área administrativa.
// E-mail/senha vêm de ADMIN_EMAIL/ADMIN_SENHA; em desenvolvimento há padrões.
export function garantirAdminInicial(gerarHashSenha) {
  return emSerie(async () => {
    const usuarios = await lerTodos();
    if (usuarios.some((u) => u.tipo === "funcionario")) return;

    const producao = process.env.NODE_ENV === "production";
    const email = (process.env.ADMIN_EMAIL || "admin@padaria.com").toLowerCase();
    const senha = process.env.ADMIN_SENHA || (producao ? null : "admin1234");
    if (!senha || usuarios.some((u) => u.email === email)) return;

    const agora = new Date().toISOString();
    usuarios.push({
      id: randomUUID(),
      nome: "Administrador",
      email,
      telefone: null,
      cpf: null,
      tipo: "funcionario",
      senhaHash: await gerarHashSenha(senha),
      criadoEm: agora,
      atualizadoEm: agora,
    });
    await gravarTodos(usuarios);
  });
}

// Remove campos sensíveis antes de devolver o usuário na API.
export function usuarioPublico(usuario) {
  if (!usuario) return null;
  const { senhaHash, ...publico } = usuario;
  return publico;
}
