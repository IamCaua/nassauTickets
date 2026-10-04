import { useEffect, useState } from 'react';
import Cabecalho from './components/Cabecalho.jsx';

const TELAS_VALIDAS = ['totem', 'painel', 'atendente'];

// A tela atual vem do endereço (#totem, #painel ou #atendente).
const telaDoEndereco = () => {
  const id = window.location.hash.replace('#', '');
  return TELAS_VALIDAS.includes(id) ? id : 'totem';
};

export default function App() {
  const [tela, setTela] = useState(telaDoEndereco());

  useEffect(() => {
    const aoMudar = () => setTela(telaDoEndereco());
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  return (
    <>
      <Cabecalho telaAtual={tela} />
      <main>
        <section className="cartao">
          <h1>{tela}</h1>
          <p>Tela em construção.</p>
        </section>
      </main>
      <footer className="rodape">Primeira fase · protótipo sem backend, os dados ficam só nesta página</footer>
    </>
  );
}
