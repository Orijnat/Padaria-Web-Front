// Utilidades para as Route Handlers da API.

export function json(dados, status = 200) {
  return Response.json(dados, { status });
}

export function erro(mensagem, status, extras = {}) {
  return Response.json({ erro: mensagem, ...extras }, { status });
}

export async function lerCorpoJson(request) {
  try {
    const corpo = await request.json();
    return corpo && typeof corpo === "object" && !Array.isArray(corpo)
      ? corpo
      : null;
  } catch {
    return null;
  }
}
