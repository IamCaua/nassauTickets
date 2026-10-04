import { TIPOS } from '../data/tipos.js';

// Etiqueta colorida com a sigla do tipo da senha (SP, SE ou SG).
export default function SenhaTag({ tipo }) {
  return (
    <span className={`tag tag-${tipo}`} title={TIPOS[tipo].nome}>
      {tipo}
    </span>
  );
}
