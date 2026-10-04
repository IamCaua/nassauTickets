const pad = (n, tamanho) => String(n).padStart(tamanho, '0');

// Monta uma senha no formato YYMMDD-PPSQ (ano, mês, dia, tipo e sequência de 3 dígitos).
export function criarSenha(tipo, sequencia, data = new Date()) {
  const prefixo = pad(data.getFullYear() % 100, 2) + pad(data.getMonth() + 1, 2) + pad(data.getDate(), 2);
  return {
    numero: `${prefixo}-${tipo}${pad(sequencia, 3)}`,
    tipo,
    emitidaEm: data.toISOString(),
  };
}

export const formatarHora = (iso) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
