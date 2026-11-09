// Autenticação por token JWT (HS256), enviado pelo front no cabeçalho
// `Authorization: Bearer <token>` (veja src/utils/axios.js).
// Feito com o crypto nativo do Node, sem dependência extra.
import { createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { buscarUsuarioPorId } from "@/lib/servidor/banco";

const DURACAO_SEGUNDOS = 7 * 24 * 60 * 60; // 7 dias

function segredo() {
  const valor = process.env.JWT_SECRET;
  if (valor) return valor;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Defina a variável de ambiente JWT_SECRET.");
  }
  return "segredo-de-desenvolvimento-nao-use-em-producao";
}

const base64url = (objeto) =>
  Buffer.from(JSON.stringify(objeto)).toString("base64url");

function assinar(conteudo) {
  return createHmac("sha256", segredo()).update(conteudo).digest("base64url");
}

export function gerarToken(usuario) {
  const agora = Math.floor(Date.now() / 1000);
  const conteudo = `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url({
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    iat: agora,
    exp: agora + DURACAO_SEGUNDOS,
  })}`;
  return `${conteudo}.${assinar(conteudo)}`;
}

// Devolve o conteúdo do token ({ sub, tipo, ... }) ou null se for inválido.
export function verificarToken(token) {
  if (typeof token !== "string") return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [cabecalho, corpo, assinatura] = partes;

  const esperada = Buffer.from(assinar(`${cabecalho}.${corpo}`));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length) return null;
  if (!timingSafeEqual(esperada, recebida)) return null;

  try {
    const { alg } = JSON.parse(Buffer.from(cabecalho, "base64url").toString());
    const dados = JSON.parse(Buffer.from(corpo, "base64url").toString());
    if (alg !== "HS256" || !dados?.sub) return null;
    if (Math.floor(Date.now() / 1000) >= dados.exp) return null;
    return dados;
  } catch {
    return null;
  }
}

// Usuário dono do token da requisição atual, conferido no banco
// (assim uma conta apagada ou que mudou de tipo não usa um token antigo).
// Devolve o usuário ou null.
export async function usuarioAutenticado() {
  const autorizacao = (await headers()).get("authorization") ?? "";
  const [esquema, token] = autorizacao.split(" ");
  if (esquema?.toLowerCase() !== "bearer") return null;
  const dados = verificarToken(token);
  return dados ? buscarUsuarioPorId(dados.sub) : null;
}
