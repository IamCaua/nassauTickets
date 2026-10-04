import SenhaTag from '../components/SenhaTag.jsx';
import { formatarHora } from '../utils/senhas.js';

const TOTAL_NO_PAINEL = 5; // senha atual + histórico = 5 últimas chamadas

// "chamadas" vem do App, com a mais recente primeiro. Nunca mostra a próxima senha.
export default function Painel({ chamadas }) {
  const atual = chamadas[0];
  const anteriores = chamadas.slice(1, TOTAL_NO_PAINEL);

  return (
    <section>
      <h1>Painel de chamadas</h1>

      {atual ? (
        <div key={atual.numero} className={`cartao painel-atual borda-${atual.tipo}`} aria-live="polite">
          <p className="painel-rotulo">Chamando agora</p>
          <p className="painel-senha">{atual.numero}</p>
          <p className="painel-guiche">
            Guichê <strong>{atual.guiche}</strong> <SenhaTag tipo={atual.tipo} />
          </p>
        </div>
      ) : (
        <div className="cartao painel-vazio">
          <p>Nenhuma senha chamada ainda.</p>
          <p className="senha-detalhe">As chamadas aparecem aqui assim que o atendente chamar a próxima senha.</p>
        </div>
      )}

      {anteriores.length > 0 && (
        <>
          <h2 className="titulo-secao">Últimas chamadas</h2>
          <ol className="historico">
            {anteriores.map((c) => (
              <li key={c.numero + c.chamadaEm} className="historico-item">
                <SenhaTag tipo={c.tipo} />
                <span className="historico-senha">{c.numero}</span>
                <span className="historico-guiche">Guichê {c.guiche}</span>
                <span className="historico-hora">{formatarHora(c.chamadaEm)}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
