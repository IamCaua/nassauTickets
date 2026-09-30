import { useEffect, useState } from 'react';

// Consulta a API a cada `ms` milissegundos. Se falhar, `erro` recebe a mensagem
// e a última resposta boa continua em `dados` (útil para o painel).
export function usePolling(funcao, ms = 2000, dependencias = []) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    const buscar = async () => {
      try {
        const r = await funcao();
        if (ativo) { setDados(r); setErro(null); }
      } catch (e) {
        if (ativo) setErro(e.message);
      }
    };
    buscar();
    const id = setInterval(buscar, ms);
    return () => { ativo = false; clearInterval(id); };
  }, dependencias); // eslint-disable-line react-hooks/exhaustive-deps

  return { dados, erro };
}
