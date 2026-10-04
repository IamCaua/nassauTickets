import SenhaTag from '../components/SenhaTag.jsx';
import { TIPOS, ORDEM_TOTEM } from '../data/tipos.js';
import { formatarHora } from '../utils/senhas.js';

export default function Totem({ ultimaEmitida, totalNaFila, onEmitir }) {
  return (
    <section>
      <h1>Retire sua senha</h1>
      <p className="subtitulo">Escolha o tipo de atendimento. Aguardando atendimento agora: {totalNaFila}.</p>

      <div className="totem-opcoes">
        {ORDEM_TOTEM.map((sigla) => (
          <button key={sigla} className={`opcao opcao-${sigla}`} onClick={() => onEmitir(sigla)}>
            <span className="opcao-sigla">{sigla}</span>
            <span className="opcao-nome">{TIPOS[sigla].nome}</span>
            <span className="opcao-descricao">{TIPOS[sigla].descricao}</span>
          </button>
        ))}
      </div>

      {ultimaEmitida && (
        <div className={`cartao senha-emitida borda-${ultimaEmitida.tipo}`} aria-live="polite">
          <div className="senha-emitida-topo">
            <span>Sua senha</span>
            <SenhaTag tipo={ultimaEmitida.tipo} />
          </div>
          <p className="senha-numero">{ultimaEmitida.numero}</p>
          <p className="senha-detalhe">
            Emitida às {formatarHora(ultimaEmitida.emitidaEm)} · Aguarde ser chamado no painel
          </p>
        </div>
      )}
    </section>
  );
}
