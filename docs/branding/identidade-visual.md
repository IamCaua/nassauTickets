# Identidade visual

Identidade simples e sóbria, adequada a um laboratório de análises clínicas. As cores ficam em variáveis CSS no início de `frontend/src/styles.css`.

## Nome

**nassauTickets**, com o T de "Tickets" maiúsculo.

## Cores

| Uso | Código |
|-----|--------|
| Azul principal (cabeçalho, botões) | `#0b4f8a` |
| Azul escuro (cabeçalho em degradê, destaques) | `#083a66` |
| Fundo da página | `#f3f6fa` |
| Texto | `#1c2733` |
| Texto secundário | `#4a5a6b` |
| Senha prioritária (SP) | `#b42318` (vermelho) |
| Retirada de exames (SE) | `#0e6f5c` (verde) |
| Senha geral (SG) | `#0b4f8a` (azul) |

Cada tipo de senha tem sempre a mesma cor e também a sigla escrita (SP, SE, SG), para que a cor nunca seja a única informação.

## Contraste

O nível AA da WCAG 2.1 exige 4,5:1 para texto.

| Combinação | Contraste |
|------------|-----------|
| Branco sobre azul `#0b4f8a` | 8,4:1 |
| Branco sobre vermelho `#b42318` | 6,6:1 |
| Branco sobre verde `#0e6f5c` | 6,1:1 |
| Texto `#1c2733` sobre fundo `#f3f6fa` | 14,0:1 |
| Texto secundário `#4a5a6b` sobre branco | 7,1:1 |

## Tipografia e forma

Fonte do sistema (`system-ui`). Senhas em tamanho grande e negrito, para leitura à distância no totem e no painel. Cartões brancos com cantos arredondados e sombra leve.

## Acessibilidade

- Foco visível por teclado em botões e links.
- Botões do totem grandes, fáceis de tocar.
- Layout responsivo para telas pequenas.
