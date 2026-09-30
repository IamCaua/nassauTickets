import { useState } from 'react';
import { api } from '../services/api.js';

const OPCOES = [
  { tipo: 'SP', rotulo: 'Atendimento prioritário', ajuda: 'Idosos, gestantes, PcD' },
  { tipo: 'SG', rotulo: 'Atendimento geral', ajuda: 'Coleta e demais serviços' },
  { tipo: 'SE', rotulo: 'Retirada de exames', ajuda: 'Resultados prontos' },
];

export default function Totem() {
  const [senha, setSenha] = useState(null);
  const [erro, setErro] = useState(null);

  async function emitir(tipo) {
    setErro(null);
    try {
      setSenha(await api.emitirSenha(tipo));
      setTimeout(() => setSenha(null), 8000); // volta à tela inicial
    } catch (e) {
      setErro(e.message);
    }
  }

  if (senha) {
    return (
      <section className="cartao centro" aria-live="polite">
        <p>Sua senha é</p>
        <p className="senha-grande">{senha.numero}</p>
        <p>Aguarde ser chamado no painel.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Retire sua senha</h1>
      {erro && <p className="aviso" role="alert">{erro}</p>}
      <div className="grade">
        {OPCOES.map((o) => (
          <button key={o.tipo} className="botao-grande" onClick={() => emitir(o.tipo)}>
            <span>{o.rotulo}</span>
            <small>{o.ajuda}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
