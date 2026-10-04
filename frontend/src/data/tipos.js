// Tipos de senha do laboratório. "ordem" define a prioridade de chamada (menor = primeiro).
export const TIPOS = {
  SP: { sigla: 'SP', nome: 'Prioritário', descricao: 'Idosos, gestantes e pessoas com deficiência', ordem: 1 },
  SE: { sigla: 'SE', nome: 'Retirada de exames', descricao: 'Resultados prontos para retirada', ordem: 2 },
  SG: { sigla: 'SG', nome: 'Geral', descricao: 'Coleta e demais serviços', ordem: 3 },
};

// Ordem em que os botões aparecem no totem.
export const ORDEM_TOTEM = ['SP', 'SG', 'SE'];
