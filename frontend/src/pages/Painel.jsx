import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';
import { usePolling } from '../hooks/usePolling.js';

function falar(texto) {
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  window.speechSynthesis.speak(fala);
}

export default function Painel() {
  const { dados, erro } = usePolling(api.painel, 2000);
  const [audioLigado, setAudioLigado] = useState(false);
  const ultimoEvento = useRef(null);

  // Fala quando surge uma chamada nova (o navegador só libera áudio após um clique).
  useEffect(() => {
    if (!dados?.evento) return;
    if (ultimoEvento.current === null) { ultimoEvento.current = dados.evento.id; return; }
    if (dados.evento.id !== ultimoEvento.current) {
      ultimoEvento.current = dados.evento.id;
      if (audioLigado) falar(dados.evento.texto);
    }
  }, [dados, audioLigado]);

  const ultimas = dados?.ultimas ?? [];
  return (
    <section>
      <h1>Painel de chamadas</h1>
      {erro && <p className="aviso" role="alert">Sistema temporariamente indisponível. Aguarde ou procure a recepção.</p>}
      {!audioLigado && <button onClick={() => setAudioLigado(true)}>Ativar áudio das chamadas</button>}
      {ultimas.length === 0 ? (
        <p>Nenhuma senha chamada ainda.</p>
      ) : (
        <ol className="lista-painel">
          {ultimas.map((s, i) => (
            <li key={s.numero} className={i === 0 ? 'destaque' : ''}>
              <span className="senha-grande">{s.numero}</span>
              <span>Guichê {s.guiche}{s.ultimaChamada ? ' · última chamada' : ''}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
