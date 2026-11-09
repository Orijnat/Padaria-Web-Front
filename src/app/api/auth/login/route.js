// POST /api/auth/login  { email, senha, tipo? } -> { token, usuario }
// Com `tipo: "funcionario"` só aceita contas de funcionário (área administrativa).
import {
  buscarUsuarioPorEmail,
  garantirAdminInicial,
  usuarioPublico,
} from "@/lib/servidor/banco";
import { erro, json, lerCorpoJson } from "@/lib/servidor/http";
import {
  gerarHashSenha,
  verificarSenha,
  verificarSenhaFalsa,
} from "@/lib/servidor/senha";
import { gerarToken } from "@/lib/servidor/token";

export async function POST(request) {
  const corpo = await lerCorpoJson(request);
  const email = String(corpo?.email ?? "").trim().toLowerCase();
  const senha = typeof corpo?.senha === "string" ? corpo.senha : "";
  if (!email || !senha) return erro("Informe e-mail e senha.", 400);

  await garantirAdminInicial(gerarHashSenha);

  const usuario = await buscarUsuarioPorEmail(email);
  const senhaConfere = usuario
    ? await verificarSenha(senha, usuario.senhaHash)
    : await verificarSenhaFalsa(senha);
  if (!senhaConfere) return erro("E-mail ou senha incorretos.", 401);

  if (corpo.tipo === "funcionario" && usuario.tipo !== "funcionario") {
    return erro("Esta conta não tem acesso à área administrativa.", 403);
  }

  return json({ token: gerarToken(usuario), usuario: usuarioPublico(usuario) });
}
