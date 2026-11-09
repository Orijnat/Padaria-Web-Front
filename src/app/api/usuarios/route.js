// POST /api/usuarios  -> cadastra um usuário (aberto ao público; vira cliente)
// GET  /api/usuarios  -> lista os usuários (somente funcionários)
import {
  EmailJaCadastradoError,
  criarUsuario,
  listarUsuarios,
  usuarioPublico,
} from "@/lib/servidor/banco";
import { erro, json, lerCorpoJson } from "@/lib/servidor/http";
import { gerarHashSenha } from "@/lib/servidor/senha";
import { gerarToken, usuarioAutenticado } from "@/lib/servidor/token";
import { validarUsuario } from "@/lib/validacao";

export async function POST(request) {
  const corpo = await lerCorpoJson(request);
  if (!corpo) return erro("Envie os dados em JSON.", 400);

  const { dados, erros } = validarUsuario(corpo);
  if (erros) return erro("Dados inválidos.", 400, { campos: erros });

  // Só funcionário pode escolher o tipo; cadastro público é sempre cliente.
  const logado = await usuarioAutenticado();
  const porFuncionario = logado?.tipo === "funcionario";
  if (dados.tipo && dados.tipo !== "cliente" && !porFuncionario) {
    return erro("Somente funcionários podem cadastrar funcionários.", 403);
  }

  const { senha, ...resto } = dados;
  try {
    const usuario = await criarUsuario({
      ...resto,
      telefone: resto.telefone ?? null,
      cpf: resto.cpf ?? null,
      tipo: resto.tipo ?? "cliente",
      senhaHash: await gerarHashSenha(senha),
    });
    // Quem se cadastrou sozinho já sai logado.
    const token = porFuncionario ? undefined : gerarToken(usuario);
    return json({ usuario: usuarioPublico(usuario), token }, 201);
  } catch (e) {
    if (e instanceof EmailJaCadastradoError) {
      return erro(e.message, 409, { campos: { email: e.message } });
    }
    throw e;
  }
}

export async function GET() {
  const logado = await usuarioAutenticado();
  if (!logado) return erro("Faça login para continuar.", 401);
  if (logado.tipo !== "funcionario") return erro("Acesso negado.", 403);

  const usuarios = await listarUsuarios();
  return json({ usuarios: usuarios.map(usuarioPublico) });
}
