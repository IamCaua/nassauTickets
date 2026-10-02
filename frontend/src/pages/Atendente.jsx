import { useState } from 'react';
import { api } from '../services/api.js';
import { usePolling } from '../hooks/usePolling.js';

export default function Atendente() {
  const [numero, setNumero] = useState(1);
  const [mensagem, setMensagem] = useState(null);
  const [tick, setTick] = useState(0); // força nova leitura após uma ação

  const { dados: guiche, erro } = usePolling(() => api.guiche(numero), 2000, [numero, tick]);
  const { dados: fila } = usePolling(api.fila, 2000);

  const atual = guiche?.atual;
  const estado = atual?.estado;

  async function executar(acao) {
    setMensagem(null);
    try {
      await api.acaoGuiche(numero, acao);
    } catch (e) {
      setMensagem(e.message);
    }
    setTick((t) => t + 1);
  }

  return (
    <section>
      <h1>Terminal do atendente</h1>
      {erro && <p className="aviso" role="alert">{erro}</p>}

      <label>
        Guichê{' '}
        <select value={numero} onChange={(e) => setNumero(Number(e.target.value))}>
          {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      <p>Na fila: SP {fila?.SP ?? '-'} · SE {fila?.SE ?? '-'} · SG {fila?.SG ?? '-'}</p>

      <div className="cartao centro">
        {atual ? (
          <>
            <p className="senha-grande">{atual.numero}</p>
            <p>Estado: {estado}</p>
          </>
        ) : (
          <p>Guichê livre</p>
        )}
      </div>

      {mensagem && <p className="aviso" role="alert">{mensagem}</p>}

      <div className="acoes">
        <button disabled={!!atual} onClick={() => executar('chamar')}>Chamar próxima</button>
        <button disabled={estado !== 'CHAMADA'} onClick={() => executar('chamar-novamente')}>Chamar novamente</button>
        <button disabled={estado !== 'CHAMADA' && estado !== 'CHAMADA_NOVAMENTE'} onClick={() => executar('iniciar')}>Iniciar atendimento</button>
        <button disabled={estado !== 'EM_ATENDIMENTO'} onClick={() => executar('finalizar')}>Finalizar atendimento</button>
        <button disabled={estado !== 'CHAMADA_NOVAMENTE'} onClick={() => executar('nao-compareceu')}>Não compareceu</button>
      </div>
    </section>
  );
}
