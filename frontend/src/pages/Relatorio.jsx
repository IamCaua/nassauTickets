import { api } from '../services/api.js';
import { usePolling } from '../hooks/usePolling.js';

const hora = (iso) => (iso ? new Date(iso).toLocaleTimeString('pt-BR') : '');

export default function Relatorio() {
  const { dados: r, erro } = usePolling(api.relatorio, 5000);

  async function encerrar() {
    if (window.confirm('Encerrar o expediente e descartar as senhas na fila?')) await api.encerrarExpediente();
  }

  if (erro && !r) return <p className="aviso" role="alert">{erro}</p>;
  if (!r) return <p>Carregando…</p>;

  return (
    <section>
      <h1>Relatório do dia</h1>
      <table>
        <thead><tr><th>Tipo</th><th>Emitidas</th><th>Atendidas</th><th>Tempo médio (min)</th></tr></thead>
        <tbody>
          {['SP', 'SE', 'SG'].map((t) => (
            <tr key={t}>
              <td>{t}</td><td>{r.emitidasPorTipo[t]}</td><td>{r.atendidasPorTipo[t]}</td><td>{r.tempoMedioMin[t] ?? '-'}</td>
            </tr>
          ))}
          <tr><th>Total</th><th>{r.emitidas}</th><th>{r.atendidas}</th><th></th></tr>
        </tbody>
      </table>

      <h2>Senhas</h2>
      <table>
        <thead><tr><th>Senha</th><th>Estado</th><th>Emissão</th><th>Atendimento</th><th>Guichê</th></tr></thead>
        <tbody>
          {r.detalhado.map((s) => (
            <tr key={s.numero}>
              <td>{s.numero}</td><td>{s.estado}</td><td>{hora(s.emitidaEm)}</td><td>{hora(s.atendidaEm)}</td><td>{s.guiche ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Auditoria</h2>
      <table>
        <thead><tr><th>Guichê</th><th>Senha</th><th>1ª chamada</th><th>2ª chamada</th><th>Início</th><th>Fim</th></tr></thead>
        <tbody>
          {r.auditoria.map((a) => (
            <tr key={a.senha}>
              <td>{a.guiche}</td><td>{a.senha}</td><td>{hora(a.primeiraChamadaEm)}</td><td>{hora(a.segundaChamadaEm)}</td><td>{hora(a.inicioEm)}</td><td>{hora(a.fimEm)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={encerrar}>Encerrar expediente</button>
    </section>
  );
}
