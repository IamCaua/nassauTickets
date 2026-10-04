import { useEffect, useState } from 'react';

const TELAS = [
  { id: 'totem', titulo: 'Totem' },
  { id: 'painel', titulo: 'Painel' },
  { id: 'atendente', titulo: 'Atendente' },
];

export default function Cabecalho({ telaAtual }) {
  const [agora, setAgora] = useState(new Date());

  // Atualiza o relógio do cabeçalho a cada segundo.
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="cabecalho">
      <div className="cabecalho-topo">
        <div className="marca">
          <svg className="marca-icone" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" fill="currentColor" />
          </svg>
          <div>
            <strong className="marca-nome">nassauTickets</strong>
            <span className="marca-sub">Laboratório de Análises Clínicas</span>
          </div>
        </div>
        <time className="relogio" dateTime={agora.toISOString()}>
          {agora.toLocaleDateString('pt-BR')} · {agora.toLocaleTimeString('pt-BR')}
        </time>
      </div>
      <nav className="menu" aria-label="Telas do sistema">
        {TELAS.map((t) => (
          <a key={t.id} href={`#${t.id}`} aria-current={t.id === telaAtual ? 'page' : undefined}>
            {t.titulo}
          </a>
        ))}
      </nav>
    </header>
  );
}
