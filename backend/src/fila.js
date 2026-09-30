// Regras de negócio do nassauTickets (protótipo com dados em memória).
// Node executa este código em uma única thread: cada função abaixo roda por
// inteiro antes da próxima requisição, então dois atendentes nunca recebem a
// mesma senha. Com MySQL, o equivalente é uma transação com SELECT ... FOR UPDATE.

const TIPOS = ['SP', 'SE', 'SG'];
const NOMES = { SP: 'prioritária', SE: 'de exames', SG: 'geral' };
const TOTAL_GUICHES = 3;

class ErroNegocio extends Error {
  constructor(mensagem, status = 400) {
    super(mensagem);
    this.status = status;
  }
}

const estado = {};

function reiniciar() {
  estado.senhas = [];
  estado.contadores = {}; // { '260930SP': 3 }
  estado.proximoTurno = 'SP'; // 'SP' ou 'OUTRO' (SE|SG)
  estado.seq = 0; // contador de eventos de chamada
  estado.evento = null; // última chamada, usada pelo painel (áudio)
  estado.guiches = {};
  for (let n = 1; n <= TOTAL_GUICHES; n++) estado.guiches[n] = { numero: n, atual: null };
}
reiniciar();

const pad = (n, t) => String(n).padStart(t, '0');

function setEstado(senha, novo, quando = new Date()) {
  senha.estado = novo;
  senha.historico.push({ estado: novo, em: quando.toISOString() });
}

// ---------- emissão ----------
function emitir(tipo, quando = new Date()) {
  if (!TIPOS.includes(tipo)) throw new ErroNegocio('Tipo de senha inválido. Use SP, SE ou SG.');
  const prefixo = pad(quando.getFullYear() % 100, 2) + pad(quando.getMonth() + 1, 2) + pad(quando.getDate(), 2);
  const chave = prefixo + tipo;
  estado.contadores[chave] = (estado.contadores[chave] || 0) + 1; // reinicia todo dia
  const senha = {
    numero: `${prefixo}-${tipo}${pad(estado.contadores[chave], 3)}`,
    tipo,
    estado: 'EMITIDA',
    emitidaEm: quando.toISOString(),
    chamadas: 0,
    primeiraChamadaEm: null,
    segundaChamadaEm: null,
    inicioEm: null,
    fimEm: null,
    guiche: null,
    ultimaChamadaSeq: 0,
    descartada: false,
    historico: [{ estado: 'EMITIDA', em: quando.toISOString() }],
  };
  setEstado(senha, 'AGUARDANDO', quando);
  estado.senhas.push(senha);
  return senha;
}

// ---------- priorização: SP -> (SE|SG) -> SP -> (SE|SG) ----------
function escolherProxima() {
  const ordem = estado.proximoTurno === 'SP' ? ['SP', 'SE', 'SG'] : ['SE', 'SG', 'SP'];
  for (const tipo of ordem) {
    const achada = estado.senhas.find((s) => s.tipo === tipo && s.estado === 'AGUARDANDO' && !s.descartada);
    if (achada) return achada; // FIFO dentro do mesmo tipo
  }
  return null;
}

function textoChamada(senha, ultima) {
  const sequencia = senha.numero.slice(-3).split('').join(' ');
  return `${ultima ? 'Última chamada. ' : ''}Senha ${NOMES[senha.tipo]}, ${senha.tipo.split('').join(' ')} ${sequencia}. Guichê ${senha.guiche}.`;
}

function registrarChamada(senha, ultima) {
  estado.seq += 1;
  senha.ultimaChamadaSeq = estado.seq;
  estado.evento = { id: estado.seq, senha: senha.numero, texto: textoChamada(senha, ultima) };
}

function pegarGuiche(n) {
  const g = estado.guiches[n];
  if (!g) throw new ErroNegocio('Guichê inexistente.', 404);
  return g;
}

function pegarAtual(n, estadosValidos, msg) {
  const g = pegarGuiche(n);
  if (!g.atual || !estadosValidos.includes(g.atual.estado)) throw new ErroNegocio(msg, 409);
  return g;
}

// ---------- ações do atendente ----------
function chamar(n, quando = new Date()) {
  const g = pegarGuiche(n);
  if (g.atual) throw new ErroNegocio('Este guichê ainda tem um atendimento em andamento.', 409);
  const senha = escolherProxima();
  if (!senha) throw new ErroNegocio('Não há senhas aguardando.', 404);
  senha.guiche = Number(n);
  senha.chamadas = 1;
  senha.primeiraChamadaEm = quando.toISOString();
  setEstado(senha, 'CHAMADA', quando);
  g.atual = senha;
  estado.proximoTurno = senha.tipo === 'SP' ? 'OUTRO' : 'SP';
  registrarChamada(senha, false);
  return senha;
}

function chamarNovamente(n, quando = new Date()) {
  const g = pegarAtual(n, ['CHAMADA'], 'Só é possível chamar novamente uma vez, logo após a primeira chamada.');
  g.atual.chamadas = 2;
  g.atual.segundaChamadaEm = quando.toISOString();
  setEstado(g.atual, 'CHAMADA_NOVAMENTE', quando);
  registrarChamada(g.atual, true);
  return g.atual;
}

function iniciar(n, quando = new Date()) {
  const g = pegarAtual(n, ['CHAMADA', 'CHAMADA_NOVAMENTE'], 'Chame uma senha antes de iniciar o atendimento.');
  g.atual.inicioEm = quando.toISOString();
  setEstado(g.atual, 'EM_ATENDIMENTO', quando);
  return g.atual;
}

function finalizar(n, quando = new Date()) {
  const g = pegarAtual(n, ['EM_ATENDIMENTO'], 'Não há atendimento em andamento neste guichê.');
  const senha = g.atual;
  senha.fimEm = quando.toISOString();
  setEstado(senha, 'ATENDIDA', quando);
  g.atual = null;
  return senha;
}

function naoCompareceu(n, quando = new Date()) {
  const g = pegarAtual(n, ['CHAMADA_NOVAMENTE'], 'O não comparecimento só vale após duas chamadas.');
  const senha = g.atual;
  senha.fimEm = quando.toISOString();
  setEstado(senha, 'NAO_COMPARECEU', quando);
  g.atual = null;
  return senha;
}

// Fim do expediente: senhas que sobraram na fila são descartadas.
function encerrarExpediente() {
  let descartadas = 0;
  for (const s of estado.senhas) {
    if (s.estado === 'AGUARDANDO' && !s.descartada) {
      s.descartada = true;
      descartadas++;
    }
  }
  return { descartadas };
}

// ---------- consultas ----------
function painel() {
  const ultimas = estado.senhas
    .filter((s) => s.ultimaChamadaSeq > 0)
    .sort((a, b) => b.ultimaChamadaSeq - a.ultimaChamadaSeq)
    .slice(0, 5)
    .map((s) => ({ numero: s.numero, tipo: s.tipo, guiche: s.guiche, ultimaChamada: s.chamadas === 2 }));
  return { ultimas, evento: estado.evento }; // a próxima senha nunca é exibida
}

function resumoFila() {
  const aguardando = { SP: 0, SE: 0, SG: 0 };
  estado.senhas.filter((s) => s.estado === 'AGUARDANDO' && !s.descartada).forEach((s) => aguardando[s.tipo]++);
  return aguardando;
}

function guiche(n) {
  return pegarGuiche(n);
}

function relatorio() {
  const por = (fn) => Object.fromEntries(TIPOS.map((t) => [t, estado.senhas.filter((s) => s.tipo === t && fn(s)).length]));
  const atendidas = estado.senhas.filter((s) => s.estado === 'ATENDIDA');
  const tempoMedioMin = Object.fromEntries(
    TIPOS.map((t) => {
      const lista = atendidas.filter((s) => s.tipo === t);
      if (!lista.length) return [t, null];
      const soma = lista.reduce((acc, s) => acc + (new Date(s.fimEm) - new Date(s.inicioEm)), 0);
      return [t, Number((soma / lista.length / 60000).toFixed(2))];
    })
  );
  return {
    emitidas: estado.senhas.length,
    atendidas: atendidas.length,
    emitidasPorTipo: por(() => true),
    atendidasPorTipo: por((s) => s.estado === 'ATENDIDA'),
    tempoMedioMin,
    detalhado: estado.senhas.map((s) => ({
      numero: s.numero,
      tipo: s.tipo,
      estado: s.descartada ? 'DESCARTADA' : s.estado,
      emitidaEm: s.emitidaEm,
      atendidaEm: s.estado === 'ATENDIDA' ? s.inicioEm : null,
      guiche: s.estado === 'ATENDIDA' ? s.guiche : null,
    })),
    auditoria: estado.senhas
      .filter((s) => s.guiche)
      .map((s) => ({
        guiche: s.guiche,
        senha: s.numero,
        primeiraChamadaEm: s.primeiraChamadaEm,
        segundaChamadaEm: s.segundaChamadaEm,
        inicioEm: s.inicioEm,
        fimEm: s.fimEm,
      })),
  };
}

module.exports = {
  ErroNegocio, reiniciar, emitir, chamar, chamarNovamente, iniciar, finalizar,
  naoCompareceu, encerrarExpediente, painel, resumoFila, guiche, relatorio,
};
