# nassauTickets

Sistema de controle de atendimento por senhas para um Laboratório de Análises Clínicas, desenvolvido em grupo na disciplina de desenvolvimento Web da UNINASSAU.

## Sobre o projeto

O cliente retira a senha em um totem, acompanha a chamada em um painel e é atendido em qualquer guichê disponível. O atendente chama o próximo da fila, inicia e encerra o atendimento. O gestor acompanha os relatórios diários e mensais.

**Objetivo:** aplicar, em um projeto de equipe, desenvolvimento Web com React, organização de repositório, versionamento com Git/GitHub e documentação de requisitos.

## Regras de atendimento

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

## Funcionalidades previstas

- [ ] Emissão de senhas pelo totem (SP, SE e SG)
- [ ] Fila com priorização e controle de concorrência entre atendentes
- [ ] Painel de chamadas com as 5 últimas senhas
- [ ] Chamada com áudio (prioridade, senha e guichê) e botão "Chamar Novamente" ("Última chamada")
- [ ] Início e encerramento do atendimento pelo atendente
- [ ] Máquina de estados das senhas
- [ ] Login do atendente, com perfil adicional de gestor
- [ ] Relatórios diário e mensal (quantitativos, detalhamento, tempo médio e auditoria)
- [ ] Acompanhamento do desempenho dos atendimentos
- [ ] Comportamento do frontend e do painel em caso de falha do backend ou do banco de dados

## Visão geral da arquitetura

```
Totem / Painel / Terminal do atendente  (React, em frontend/)
                  │  API REST (JSON)
                  ▼
           Backend (em backend/)
                  │
                  ▼
             MySQL 8.0
```

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 |
| Backend | a definir (veja abaixo) |
| Banco de dados | MySQL 8.0 |
| Versionamento | Git e GitHub |

### Backend: decisão pendente

O grupo deve escolher uma das opções aceitas pelo laboratório: Node.js 22 LTS com Express, Java 21 com Spring Boot ou Python 3.14 com Flask/FastAPI. Depois da escolha, registrar aqui:

- tecnologia escolhida;
- justificativa técnica;
- ajustes necessários no `.gitignore`, que hoje cobre apenas Node.js (Java e Python precisam de regras próprias, como `target/` ou `__pycache__/`).

## Estrutura do repositório

```
nassauTickets/
├── backend/          # API e regras de negócio
├── docs/
│   ├── branding/     # identidade visual
│   ├── mer/          # modelo entidade-relacionamento
│   ├── mockups/      # protótipos das telas
│   ├── models/uml/   # diagramas UML
│   └── requirements/ # requisitos e regras de negócio
├── frontend/         # aplicação React
├── .gitignore
├── LICENSE
└── README.md
```

Os arquivos `.gitkeep` existem apenas para o Git versionar pastas vazias. Quando uma pasta receber seu primeiro arquivo, o `.gitkeep` dela deve ser removido.

## Como executar

**Pré-requisitos:** Git, Node.js 22 LTS e MySQL 8.0.

```bash
git clone https://github.com/Nunes-source/nassauTickets.git
cd nassauTickets
git checkout dev
```

**Frontend** (disponível a partir da criação do projeto React em `frontend/`):

```bash
cd frontend
npm install
npm run dev
```

**Backend:** as instruções serão adicionadas depois que a tecnologia for definida.

**Configuração:** dados de acesso ao banco e demais segredos ficam em um arquivo `.env`, que não é versionado. Ao criar o backend, o grupo deve adicionar um `.env.example` com os nomes das variáveis, sem valores reais.

## Documentação

Os artefatos ficam em `docs/`. A documentação deve contemplar segurança, disponibilidade, auditoria, desempenho, concorrência, LGPD e acessibilidade.

| Pasta | Conteúdo | Situação |
|-------|----------|----------|
| `docs/requirements/` | requisitos funcionais e não funcionais, regras de negócio, casos de uso | pendente |
| `docs/models/uml/` | diagramas UML | pendente |
| `docs/mer/` | modelo entidade-relacionamento | pendente |
| `docs/mockups/` | protótipos das telas | pendente |
| `docs/branding/` | identidade visual | pendente |

## Branches e commits

- `main`: versão estável; recebe apenas merges vindos da `dev`.
- `dev`: branch de desenvolvimento; todo código é enviado primeiro para ela.

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
