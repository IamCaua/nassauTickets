import { useEffect, useState } from 'react';
import Totem from './pages/Totem.jsx';
import Painel from './pages/Painel.jsx';
import Atendente from './pages/Atendente.jsx';
import Relatorio from './pages/Relatorio.jsx';

const TELAS = {
  totem: { titulo: 'Totem', componente: Totem },
  painel: { titulo: 'Painel', componente: Painel },
  atendente: { titulo: 'Atendente', componente: Atendente },
  relatorio: { titulo: 'Gestor', componente: Relatorio },
};

const telaDoHash = () => (window.location.hash.replace('#', '') in TELAS ? window.location.hash.replace('#', '') : 'totem');

export default function App() {
  const [tela, setTela] = useState(telaDoHash());

  useEffect(() => {
    const aoMudar = () => setTela(telaDoHash());
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  const Tela = TELAS[tela].componente;
  return (
    <>
      <nav className="menu" aria-label="Telas do sistema">
        <strong>nassauTickets</strong>
        {Object.entries(TELAS).map(([chave, t]) => (
          <a key={chave} href={`#${chave}`} aria-current={chave === tela ? 'page' : undefined}>
            {t.titulo}
          </a>
        ))}
      </nav>
      <main>
        <Tela />
      </main>
    </>
  );
}
