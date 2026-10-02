// Teste rápido das regras (sem dependências): npm test
const assert = require('assert');
const fila = require('./fila');

fila.reiniciar();
const d = new Date(2026, 8, 30, 8, 0, 0);
['SG', 'SG', 'SE', 'SP', 'SP', 'SG'].forEach((t) => fila.emitir(t, d));

// numeração YYMMDD-PPSQ
assert.strictEqual(fila.relatorio().detalhado[0].numero, '260930-SG001');
assert.strictEqual(fila.relatorio().detalhado[3].numero, '260930-SP001');

// ordem esperada: SP, SE, SP, SG, SG, SG
const tipos = [];
for (let i = 0; i < 6; i++) {
  const s = fila.chamar(1);
  tipos.push(s.tipo);
  fila.iniciar(1);
  fila.finalizar(1);
}
assert.deepStrictEqual(tipos, ['SP', 'SE', 'SP', 'SG', 'SG', 'SG']);

// duas chamadas e não comparecimento
fila.emitir('SG', d);
fila.chamar(2);
assert.throws(() => fila.naoCompareceu(2)); // ainda só 1 chamada
fila.chamarNovamente(2);
assert.throws(() => fila.chamarNovamente(2)); // limite de 2 chamadas
assert.strictEqual(fila.painel().evento.texto.startsWith('Última chamada'), true);
fila.naoCompareceu(2);

// dois atendentes pedindo "ao mesmo tempo" nunca recebem a mesma senha
fila.emitir('SG', d);
fila.emitir('SG', d);
const a = fila.chamar(1);
const b = fila.chamar(2);
assert.notStrictEqual(a.numero, b.numero);

console.log('OK: todas as verificações passaram');
