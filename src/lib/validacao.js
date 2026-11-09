// Validação dos dados de usuário. Usada pela API e pelos formulários.

export const TIPOS_USUARIO = ["cliente", "funcionario"];

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function somenteDigitos(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

export function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(d[tamanho])) return false;
  }
  return true;
}

export function validarSenha(senha) {
  if (typeof senha !== "string" || senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }
  if (!/[a-zA-Z]/.test(senha) || !/[0-9]/.test(senha)) {
    return "A senha deve ter letras e números.";
  }
  return null;
}

/**
 * Valida e normaliza os dados de um usuário.
 * Com `parcial: true` (edição) só valida os campos enviados.
 * Retorna { dados, erros } — `erros` é null quando está tudo certo.
 */
export function validarUsuario(entrada, { parcial = false } = {}) {
  const erros = {};
  const dados = {};
  const veio = (campo) => entrada?.[campo] !== undefined;
  const obrigatorio = (campo) => !parcial || veio(campo);

  if (obrigatorio("nome")) {
    const nome = String(entrada?.nome ?? "").trim();
    if (nome.length < 2) erros.nome = "Informe o nome (mínimo 2 letras).";
    else dados.nome = nome;
  }

  if (obrigatorio("email")) {
    const email = String(entrada?.email ?? "").trim().toLowerCase();
    if (!REGEX_EMAIL.test(email)) erros.email = "Informe um e-mail válido.";
    else dados.email = email;
  }

  if (obrigatorio("senha")) {
    const erroSenha = validarSenha(entrada?.senha);
    if (erroSenha) erros.senha = erroSenha;
    else dados.senha = entrada.senha;
  }

  if (veio("telefone")) {
    const telefone = somenteDigitos(entrada.telefone);
    if (telefone && (telefone.length < 10 || telefone.length > 11)) {
      erros.telefone = "Telefone deve ter DDD + número (10 ou 11 dígitos).";
    } else {
      dados.telefone = telefone || null;
    }
  }

  if (veio("cpf")) {
    const cpf = somenteDigitos(entrada.cpf);
    if (cpf && !cpfValido(cpf)) erros.cpf = "CPF inválido.";
    else dados.cpf = cpf || null;
  }

  if (veio("tipo")) {
    if (!TIPOS_USUARIO.includes(entrada.tipo)) {
      erros.tipo = `Tipo deve ser: ${TIPOS_USUARIO.join(" ou ")}.`;
    } else {
      dados.tipo = entrada.tipo;
    }
  }

  return { dados, erros: Object.keys(erros).length ? erros : null };
}
