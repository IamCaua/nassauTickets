# nassauTickets

Sistema de controle de atendimento por senhas para um Laboratório de Análises Clínicas, desenvolvido em grupo na UNINASSAU.

## Sobre o projeto

O nassauTickets organiza a fila de atendimento do laboratório. O cliente retira a senha em um totem, acompanha a chamada em um painel e é atendido em qualquer guichê disponível. O atendente chama o próximo da fila, inicia e encerra o atendimento, e o gestor acompanha relatórios diários e mensais.

**Objetivo:** aplicar, em um projeto real de equipe, desenvolvimento Web com React, organização de repositório, versionamento com Git/GitHub e documentação de requisitos.

### Como funciona

- **Agentes:** Sistema (AS), Atendente (AA) e Cliente (AC, anônimo, via totem).
- **Tipos de senha:** SP (prioritária), SE (retirada de exames) e SG (geral).
- **Ordem de chamada:** `SP → SE|SG → SP → SE|SG`, respeitando a prioridade quando alguma fila estiver vazia.
- **Numeração:** `YYMMDD-PPSQ` (ano, mês, dia, tipo e sequência diária de 3 dígitos).
- **Expediente:** das 7h às 17h.
- **Painel:** exibe as 5 últimas senhas chamadas.
- **Estados da senha:** EMITIDA, AGUARDANDO, CHAMADA, CHAMADA_NOVAMENTE, EM_ATENDIMENTO, ATENDIDA e NÃO_COMPARECEU.

## Tecnologias

- **Frontend:** React 19
- **Backend:** a definir pelo grupo entre Node.js 22 (Express), Java 21 (Spring Boot) ou Python 3.14 (Flask/FastAPI); a justificativa técnica da escolha será registrada aqui.
- **Banco de dados:** MySQL 8.0

## Estrutura do repositório

```
nassauTickets/
├── backend/          # API e regras de negócio
├── docs/
│   ├── branding/     # identidade visual
│   ├── mer/          # modelo entidade-relacionamento
│   ├── mockups/      # protótipos de telas
│   ├── models/uml/   # diagramas UML
│   └── requirements/ # requisitos e regras de negócio
├── frontend/         # aplicação React
├── .gitignore
├── LICENSE
└── README.md
```

## Instalação e execução

> Será detalhado conforme o frontend e o backend forem implementados.

```bash
# Frontend
cd frontend
npm install
npm run dev
```

Variáveis de ambiente devem ser configuradas em um arquivo `.env` (não versionado), seguindo um `.env.example` a ser adicionado ao projeto.

## Branches

- `main`: versão estável, recebe apenas merges vindos da `dev`.
- `dev`: branch de desenvolvimento, onde os commits são enviados primeiro.

Convenção de commits: `feat:`, `fix:`, `docs:`, `chore:`.

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
