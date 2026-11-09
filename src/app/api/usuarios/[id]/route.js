// GET    /api/usuarios/:id -> dados do usuário
// PATCH  /api/usuarios/:id -> altera dados (o próprio usuário ou funcionário)
// DELETE /api/usuarios/:id -> remove (o próprio usuário ou funcionário)
import {
  EmailJaCadastradoError,
  atualizarUsuario,
  buscarUsuarioPorId,
  removerUsuario,
  usuarioPublico,
} from "@/lib/servidor/banco";
import { erro, json, lerCorpoJson } from "@/lib/servidor/http";
import { gerarHashSenha } from "@/lib/servidor/senha";
import { usuarioAutenticado } from "@/lib/servidor/token";
import { validarUsuario } from "@/lib/validacao";

async function autorizar(id) {
  const logado = await usuarioAutenticado();
  if (!logado) return { resposta: erro("Faça login para continuar.", 401) };
  if (logado.id !== id && logado.tipo !== "funcionario") {
    return { resposta: erro("Acesso negado.", 403) };
  }
  return { logado };
}

export async function GET(_request, { params }) {
  const { id } = await params;
  const { resposta } = await autorizar(id);
  if (resposta) return resposta;

  const usuario = await buscarUsuarioPorId(id);
  if (!usuario) return erro("Usuário não encontrado.", 404);
  return json({ usuario: usuarioPublico(usuario) });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { logado, resposta } = await autorizar(id);
  if (resposta) return resposta;

  const corpo = await lerCorpoJson(request);
  if (!corpo) return erro("Envie os dados em JSON.", 400);

  const { dados, erros } = validarUsuario(corpo, { parcial: true });
  if (erros) return erro("Dados inválidos.", 400, { campos: erros });

  if (dados.tipo && logado.tipo !== "funcionario") {
    return erro("Somente funcionários podem alterar o tipo.", 403);
  }

  const { senha, ...alteracoes } = dados;
  if (senha) alteracoes.senhaHash = await gerarHashSenha(senha);

  try {
    const usuario = await atualizarUsuario(id, alteracoes);
    if (!usuario) return erro("Usuário não encontrado.", 404);
    return json({ usuario: usuarioPublico(usuario) });
  } catch (e) {
    if (e instanceof EmailJaCadastradoError) {
      return erro(e.message, 409, { campos: { email: e.message } });
    }
    throw e;
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const { resposta } = await autorizar(id);
  if (resposta) return resposta;

  const removido = await removerUsuario(id);
  if (!removido) return erro("Usuário não encontrado.", 404);
  return new Response(null, { status: 204 });
}
