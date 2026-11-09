// Hash de senha com scrypt (nativo do Node, sem dependência extra).
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const TAMANHO_CHAVE = 64;

export async function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const chave = await scryptAsync(senha, sal, TAMANHO_CHAVE);
  return `scrypt:${sal}:${chave.toString("hex")}`;
}

export async function verificarSenha(senha, hashSalvo) {
  const [algoritmo, sal, chaveHex] = String(hashSalvo).split(":");
  if (algoritmo !== "scrypt" || !sal || !chaveHex) return false;
  const esperada = Buffer.from(chaveHex, "hex");
  const recebida = await scryptAsync(senha, sal, esperada.length);
  return timingSafeEqual(esperada, recebida);
}

// Hash usado quando o e-mail não existe, para o login levar o mesmo tempo
// e não revelar quais e-mails estão cadastrados.
let hashFalso;
export async function verificarSenhaFalsa(senha) {
  hashFalso ??= await gerarHashSenha("senha-que-nunca-confere");
  await verificarSenha(senha, hashFalso);
  return false;
}
