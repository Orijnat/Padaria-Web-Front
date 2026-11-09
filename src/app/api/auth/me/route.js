// GET /api/auth/me -> usuário dono do token enviado
import { usuarioPublico } from "@/lib/servidor/banco";
import { erro, json } from "@/lib/servidor/http";
import { usuarioAutenticado } from "@/lib/servidor/token";

export async function GET() {
  const usuario = await usuarioAutenticado();
  if (!usuario) return erro("Não autenticado.", 401);
  return json({ usuario: usuarioPublico(usuario) });
}
