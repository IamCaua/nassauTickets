import { useEffect, useState } from 'react';
import Cabecalho from './components/Cabecalho.jsx';
import Totem from './pages/Totem.jsx';
import Painel from './pages/Painel.jsx';
import { criarSenha } from './utils/senhas.js';

const TELAS_VALIDAS = ['totem', 'painel', 'atendente'];

// A tela atual vem do endereço (#totem, #painel ou #atendente).
const telaDoEndereco = () => {
  const id = window.location.hash.replace('#', '');
  return TELAS_VALIDAS.includes(id) ? id : 'totem';
};

export default function App() {
  const [tela, setTela] = useState(telaDoEndereco());

  // Estado compartilhado entre as telas (só em memória, sem backend).
  const [fila, setFila] = useState([]); // senhas aguardando atendimento
  const [emitidas, setEmitidas] = useState({ SP: 0, SE: 0, SG: 0 }); // quantas já foram emitidas de cada tipo
  const [ultimaEmitida, setUltimaEmitida] = useState(null);
  const [chamadas, setChamadas] = useState([]); // senhas já chamadas, a mais recente primeiro

  useEffect(() => {
    const aoMudar = () => setTela(telaDoEndereco());
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  function emitirSenha(tipo) {
    const senha = criarSenha(tipo, emitidas[tipo] + 1);
    setEmitidas({ ...emitidas, [tipo]: emitidas[tipo] + 1 });
    setFila([...fila, senha]);
    setUltimaEmitida(senha);
  }

  return (
    <>
      <Cabecalho telaAtual={tela} />
      <main>
        {tela === 'totem' && <Totem ultimaEmitida={ultimaEmitida} totalNaFila={fila.length} onEmitir={emitirSenha} />}
        {tela === 'painel' && <Painel chamadas={chamadas} />}
        {tela === 'atendente' && (
          <section className="cartao">
            <h1>{tela}</h1>
            <p>Tela em construção.</p>
          </section>
        )}
      </main>
      <footer className="rodape">Primeira fase · protótipo sem backend, os dados ficam só nesta página</footer>
    </>
  );
}
