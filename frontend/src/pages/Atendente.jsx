import { useState } from 'react';
import SenhaTag from '../components/SenhaTag.jsx';
import { formatarHora, escolherProxima } from '../utils/senhas.js';

const GUICHES = [1, 2, 3];

export default function Atendente({ fila, chamadas, onChamar }) {
  const [guiche, setGuiche] = useState(1);

  const proxima = escolherProxima(fila);
  const ultimaDoGuiche = chamadas.find((c) => c.guiche === guiche);
  const porTipo = (tipo) => fila.filter((s) => s.tipo === tipo).length;

  return (
    <section>
      <h1>Terminal do atendente</h1>

      <div className="cartao atendente-barra">
        <label className="campo">
          Guichê
          <select value={guiche} onChange={(e) => setGuiche(Number(e.target.value))}>
            {GUICHES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button className="botao-primario" disabled={!proxima} onClick={() => onChamar(guiche)}>
          Chamar próxima
        </button>
      </div>

      <p className="ultima-do-guiche">
        {ultimaDoGuiche
          ? <>Última chamada do guichê {guiche}: <strong>{ultimaDoGuiche.numero}</strong> às {formatarHora(ultimaDoGuiche.chamadaEm)}</>
          : `O guichê ${guiche} ainda não fez nenhuma chamada.`}
      </p>

      <h2 className="titulo-secao">Fila de espera ({fila.length})</h2>
      <p className="resumo-fila">
        {['SP', 'SE', 'SG'].map((tipo) => (
          <span key={tipo} className="resumo-item"><SenhaTag tipo={tipo} /> {porTipo(tipo)}</span>
        ))}
      </p>

      {fila.length === 0 ? (
        <div className="cartao painel-vazio">
          <p>Nenhuma senha aguardando.</p>
          <p className="senha-detalhe">Emita uma senha na tela do Totem para ela aparecer aqui.</p>
        </div>
      ) : (
        <ul className="fila">
          {fila.map((s) => (
            <li key={s.numero} className={`fila-item${proxima && s.numero === proxima.numero ? ' fila-proxima' : ''}`}>
              <SenhaTag tipo={s.tipo} />
              <span className="historico-senha">{s.numero}</span>
              {proxima && s.numero === proxima.numero && <span className="selo-proxima">próxima</span>}
              <span className="historico-hora">{formatarHora(s.emitidaEm)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
