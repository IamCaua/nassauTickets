import { TIPOS } from '../data/tipos.js';

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

// Regra simplificada da primeira fase: primeiro SP, depois SE, depois SG;
// dentro de cada tipo vale a ordem de chegada. A regra completa fica para a segunda fase.
export function escolherProxima(fila) {
  let escolhida = null;
  for (const senha of fila) {
    if (!escolhida || TIPOS[senha.tipo].ordem < TIPOS[escolhida.tipo].ordem) escolhida = senha;
  }
  return escolhida;
}
