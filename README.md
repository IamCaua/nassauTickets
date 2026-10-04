# nassauTickets

Sistema de controle de atendimento por senhas para um Laboratório de Análises Clínicas, desenvolvido em grupo na disciplina de desenvolvimento Web da UNINASSAU.

## Sobre o projeto

O cliente retira a senha em um totem, acompanha a chamada em um painel e é atendido em qualquer guichê disponível. O atendente chama o próximo da fila. Na versão completa, o atendente também inicia e encerra o atendimento e o gestor acompanha relatórios diários e mensais.

**Objetivo:** aplicar, em um projeto de equipe, desenvolvimento Web com React, organização de repositório, versionamento com Git/GitHub e documentação de requisitos.

## Estado atual: primeira fase

Esta é a **primeira fase** do projeto: um protótipo só de frontend, com 3 telas ligadas pelo estado do React (Totem, Painel e Atendente). Não há backend nem banco de dados: as senhas ficam na memória da página e **são perdidas ao recarregá-la**. O sistema completo será construído na segunda fase.

## Regras de atendimento (sistema completo)

Estas regras vêm da especificação do laboratório. A primeira fase implementa só parte delas (veja Funcionalidades).

| Item | Regra |
|------|-------|
| Agentes | Sistema (AS), Atendente (AA) e Cliente (AC, anônimo, via totem) |
| Tipos de senha | SP (prioritária), SE (retirada de exames) e SG (geral) |
| Ordem de chamada | `SP → SE\|SG → SP → SE\|SG`; se uma fila estiver vazia, o sistema segue a prioridade com as demais |
| Numeração | `YYMMDD-PPSQ` (ano, mês, dia, tipo e sequência diária de 3 dígitos, reiniciada todo dia) |
| Expediente | 7h às 17h; atendimentos em andamento são concluídos e as senhas restantes são descartadas |
| Não comparecimento | após duas chamadas sem o cliente no guichê, a senha é considerada abandonada |
| Painel | exibe as 5 últimas senhas chamadas (nunca a próxima) |
| Guichês | qualquer guichê atende qualquer tipo de senha |
| Estados da senha | EMITIDA → AGUARDANDO → CHAMADA → CHAMADA_NOVAMENTE → EM_ATENDIMENTO → ATENDIDA (ou NÃO_COMPARECEU) |

## Funcionalidades

### ✅ Implementadas na primeira fase

- **Totem:** emissão de senha SP, SG ou SE, com numeração `YYMMDD-PPSQ` (sequência por tipo) e cartão com a senha emitida.
- **Painel de chamadas:** senha chamada agora com o guichê e as últimas chamadas (5 no total); nunca mostra a próxima senha.
- **Terminal do atendente:** escolha do guichê (1 a 3), fila de espera e botão "Chamar próxima".
- **Integração entre as telas:** a senha emitida no Totem aparece na fila do Atendente, e a chamada feita pelo Atendente aparece no Painel (estado compartilhado do React).
- **Interface:** cabeçalho com navegação e relógio, identidade visual própria e layout que se adapta a telas pequenas.

### 🚧 Em desenvolvimento (parcial)

- **Priorização:** hoje a ordem é simplificada (SP, depois SE, depois SG, e por chegada dentro de cada tipo). Falta a alternância completa `SP → SE|SG → SP`.
- **Numeração:** funciona no frontend, mas a sequência reinicia ao recarregar a página (falta persistência).

### ⏳ Planejadas para a segunda fase

- Backend (tecnologia ainda a decidir) e integração com o frontend.
- Banco de dados MySQL e persistência dos dados.
- Login, perfil de gestor e permissões.
- Início e encerramento do atendimento, "Chamar novamente", não comparecimento e máquina de estados completa.
- Áudio das chamadas.
- Controle de concorrência entre atendentes.
- Expediente (7h às 17h) e descarte de senhas ao fim do dia.
- Relatórios diário e mensal, auditoria e acompanhamento de desempenho.
- Comportamento do sistema em caso de falhas.

## Visão geral da arquitetura

**Primeira fase (atual):** só frontend.

```
frontend/ (React)
  App  ── guarda a fila de espera e as chamadas (estado compartilhado)
   ├── Totem      emite senhas        → adiciona na fila
   ├── Atendente  chama a próxima     → tira da fila e registra a chamada
   └── Painel     mostra as chamadas
```

**Segunda fase (planejada):** frontend, backend e banco de dados, com a tecnologia do backend ainda a definir.

```
React ── API REST (JSON) ── Backend ── MySQL 8.0
```

## Tecnologias

| Camada | Tecnologia | Situação |
|--------|-----------|----------|
| Frontend | React 19 com Vite | em uso |
| Backend | a definir | segunda fase |
| Banco de dados | MySQL 8.0 | segunda fase |
| Versionamento | Git e GitHub | em uso |

### Backend: decisão pendente

O backend fica para a segunda fase. O grupo deve escolher uma das opções aceitas pelo laboratório: Node.js 22 LTS com Express, Java 21 com Spring Boot ou Python 3.14 com Flask/FastAPI. Depois da escolha, registrar aqui:

- tecnologia escolhida;
- justificativa técnica;
- ajustes necessários no `.gitignore`, que hoje cobre apenas Node.js (Java e Python precisam de regras próprias, como `target/` ou `__pycache__/`).

## Estrutura do repositório

```
nassauTickets/
├── backend/          # reservado para a segunda fase (hoje só um README)
├── docs/
│   ├── branding/     # identidade visual
│   ├── mer/          # modelo entidade-relacionamento
│   ├── mockups/      # protótipos das telas
│   ├── models/uml/   # diagramas UML
│   └── requirements/ # requisitos e regras de negócio
├── frontend/         # aplicação React
│   └── src/
│       ├── components/   # Cabecalho e SenhaTag
│       ├── data/         # tipos de senha
│       ├── pages/        # Totem, Painel e Atendente
│       └── utils/        # criação de senha e escolha da próxima
├── .gitignore
├── LICENSE
└── README.md
```

Todas as pastas já têm arquivos, então não há `.gitkeep`.

## Como executar

**Pré-requisitos:** Git e Node.js 22 LTS.

```bash
git clone https://github.com/Nunes-source/nassauTickets.git
cd nassauTickets/frontend
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

**Como usar:** na tela **Totem**, escolha SP, SG ou SE para emitir senhas. Em **Atendente**, escolha o guichê e clique em "Chamar próxima". Em **Painel**, veja as chamadas. As três telas ficam na mesma página do navegador (abas no cabeçalho); se você recarregar, os dados são zerados.

Não há backend nem configuração extra nesta fase.

## Documentação

Os artefatos ficam em `docs/`. Eles descrevem o sistema completo; o que a primeira fase cobre está marcado em `docs/requirements/requisitos.md`.

| Pasta | Conteúdo | Situação |
|-------|----------|----------|
| [`docs/requirements/`](docs/requirements/requisitos.md) | requisitos funcionais e não funcionais, regras de negócio, casos de uso, estratégia de falhas | ✅ escrito, com o escopo da primeira fase marcado |
| [`docs/models/uml/`](docs/models/uml) | casos de uso, máquina de estados e sequência da chamada concorrente | ✅ escrito (a máquina de estados e a sequência valem para a segunda fase) |
| [`docs/mer/`](docs/mer/mer.md) | modelo entidade-relacionamento e `schema.sql` | 🚧 preparado para a segunda fase, ainda não usado pelo sistema |
| [`docs/mockups/`](docs/mockups/telas.md) | protótipos do Totem, do Painel e do Atendente | ✅ escrito |
| [`docs/branding/`](docs/branding/identidade-visual.md) | cores, contraste e tipografia | ✅ escrito |

## Branches e commits

- `main`: versão estável; recebe apenas merges vindos da `dev`.
- `dev`: branch de desenvolvimento; todo código é enviado primeiro para ela.

A primeira fase foi desenvolvida na `dev` e integrada à `main` por merge, sem reescrever o histórico anterior.

Commits pequenos e objetivos, com prefixo: `feat:`, `fix:`, `docs:` e `chore:`.

```
chore: cria estrutura inicial de diretórios do projeto
feat: implementa fila de atendimento
fix: corrige regra de prioridade
docs: adiciona requisitos do sistema
```

## Membros

| Nome | Matrícula | Papel |
|------|-----------|-------|
| Guilherme Nunes | 01840418 | Scrum Master |
| Emanuel Lima | 01719420 | Documentador |
| Gabriel Luann | 01654299 | Testador |
| Jose Diego | 01827097 | Documentador |
| Heitor Correia | 01841124 | Desenvolvedor |
| Cauan Andrade | 01821096 | Testador |

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
