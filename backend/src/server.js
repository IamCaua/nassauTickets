const express = require('express');
const fila = require('./fila');

const app = express();
app.use(express.json());

// Envolve cada handler: devolve JSON e converte erros de negócio em respostas HTTP.
const rota = (fn) => (req, res) => {
  try {
    res.json(fn(req));
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message });
  }
};

function dentroDoExpediente(agora = new Date()) {
  const h = agora.getHours();
  return h >= 7 && h < 17;
}

app.post('/api/senhas', rota((req) => {
  if (process.env.VALIDAR_EXPEDIENTE === 'true' && !dentroDoExpediente()) {
    throw new fila.ErroNegocio('Fora do horário de atendimento (7h às 17h).', 403);
  }
  return fila.emitir(req.body.tipo);
}));

app.get('/api/painel', rota(() => fila.painel()));
app.get('/api/fila', rota(() => fila.resumoFila()));
app.get('/api/guiches/:n', rota((req) => fila.guiche(req.params.n)));

app.post('/api/guiches/:n/chamar', rota((req) => fila.chamar(req.params.n)));
app.post('/api/guiches/:n/chamar-novamente', rota((req) => fila.chamarNovamente(req.params.n)));
app.post('/api/guiches/:n/iniciar', rota((req) => fila.iniciar(req.params.n)));
app.post('/api/guiches/:n/finalizar', rota((req) => fila.finalizar(req.params.n)));
app.post('/api/guiches/:n/nao-compareceu', rota((req) => fila.naoCompareceu(req.params.n)));

app.post('/api/expediente/encerrar', rota(() => fila.encerrarExpediente()));
app.get('/api/relatorio', rota(() => fila.relatorio()));

const PORTA = process.env.PORT || 3001;
app.listen(PORTA, () => console.log(`nassauTickets API em http://localhost:${PORTA}`));
