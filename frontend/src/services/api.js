// Todas as chamadas à API REST ficam aqui.
async function req(caminho, metodo = 'GET', corpo) {
  let resposta;
  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Sistema indisponível. Procure a recepção.');
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Falha na requisição.');
  return dados;
}

export const api = {
  emitirSenha: (tipo) => req('/senhas', 'POST', { tipo }),
  painel: () => req('/painel'),
  fila: () => req('/fila'),
  guiche: (n) => req(`/guiches/${n}`),
  acaoGuiche: (n, acao) => req(`/guiches/${n}/${acao}`, 'POST'),
  relatorio: () => req('/relatorio'),
  encerrarExpediente: () => req('/expediente/encerrar', 'POST'),
};
