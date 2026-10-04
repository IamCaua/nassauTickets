# Requisitos do nassauTickets

Sistema de controle de atendimento por senhas para um Laboratório de Análises Clínicas.

**Agentes:** AS (Agente Sistema), AA (Agente Atendente), AC (Agente Cliente, anônimo).
**Perfis:** Atendente e Gestor (o gestor é o atendente com perfil adicional).

## Escopo da primeira fase

A primeira fase entrega um protótipo só de frontend (React, com os dados no estado local, sem backend nem banco de dados). Os requisitos abaixo descrevem o sistema completo; a tabela mostra o que a primeira fase cobre.

| Requisito | Primeira fase |
|-----------|---------------|
| RF01 Emitir senha pelo totem | Implementado |
| RF02 Numeração `YYMMDD-PPSQ` | Implementado no frontend, sem persistência (a sequência reinicia ao recarregar a página) |
| RF03 Chamar próxima senha | Simplificado: ordem SP, SE, SG e, dentro de cada tipo, ordem de chegada (a regra completa RN02 fica para a segunda fase) |
| RF08 Painel das últimas chamadas | Implementado (senha atual, guichê e histórico, sem áudio) |
| RF04, RF05, RF06, RF07, RF09 a RF15 | Segunda fase |

## 1. Requisitos funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | O cliente deve emitir uma senha SP, SG ou SE pelo totem, sem se identificar. | Alta |
| RF02 | O sistema deve numerar as senhas no formato `YYMMDD-PPSQ`, com sequência de 3 dígitos por tipo, reiniciada todo dia. | Alta |
| RF03 | O atendente deve chamar a próxima senha em um guichê, respeitando a priorização (RN02). | Alta |
| RF04 | O atendente deve poder chamar novamente a senha (no máximo uma vez), com áudio precedido de "Última chamada". | Alta |
| RF05 | O atendente deve iniciar o atendimento quando o cliente chegar ao guichê. | Alta |
| RF06 | O atendente deve finalizar o atendimento. | Alta |
| RF07 | Após duas chamadas sem comparecimento, a senha deve passar ao estado NÃO_COMPARECEU e o guichê deve ficar livre. | Alta |
| RF08 | O painel deve exibir as 5 últimas senhas chamadas, com o guichê, e nunca a próxima senha. | Alta |
| RF09 | O painel deve reproduzir áudio a cada chamada, informando prioridade, senha e guichê. | Média |
| RF10 | O sistema deve controlar o estado de cada senha conforme a máquina de estados (RN06). | Alta |
| RF11 | O atendente deve fazer login; o gestor tem acesso adicional a cadastros e relatórios. | Alta |
| RF12 | O gestor deve consultar relatórios diário e mensal: senhas emitidas e atendidas (geral e por tipo), detalhamento, tempo médio e auditoria. | Alta |
| RF13 | O sistema deve descartar as senhas restantes ao fim do expediente (17h). | Média |
| RF14 | O sistema deve permitir acompanhar o desempenho dos atendimentos (tempo médio por tipo, fila atual, senhas por hora). | Média |
| RF15 | O gestor deve cadastrar atendentes e guichês. | Baixa |

## 2. Requisitos não funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF01 | Segurança | Senhas de usuários armazenadas com hash (bcrypt); autenticação por token (JWT) com expiração; rotas do atendente e do gestor protegidas por perfil. |
| RNF02 | Segurança | Comunicação por HTTPS; validação de todas as entradas na API; proteção contra SQL Injection (consultas parametrizadas). |
| RNF03 | Disponibilidade | Disponibilidade de 99% no horário de expediente (7h às 17h). |
| RNF04 | Disponibilidade | Se o backend ou o banco falhar, o totem mostra "Sistema indisponível, procure a recepção", e o painel mantém a última lista exibida com um aviso. O frontend tenta reconectar automaticamente. |
| RNF05 | Disponibilidade | Backup diário do banco de dados; restauração documentada. Senhas emitidas ficam persistidas para retomar a fila após a queda. |
| RNF06 | Auditoria | Todo evento de chamada, início e fim de atendimento fica registrado com atendente, guichê e horário, sem possibilidade de edição. |
| RNF07 | Desempenho | Emissão de senha e chamada em até 1 segundo, com até 5 atendentes simultâneos. O painel atualiza em até 3 segundos. |
| RNF08 | Concorrência | A escolha da próxima senha deve ser atômica: dois atendentes nunca recebem a mesma senha (transação com `SELECT ... FOR UPDATE`, ou operação atômica no protótipo). |
| RNF09 | LGPD | O cliente é anônimo: o sistema não coleta dados pessoais dele. Dados dos atendentes (nome, login) são usados só para a finalidade do sistema, com acesso restrito. |
| RNF10 | Acessibilidade | Conformidade com a Lei Brasileira de Inclusão (Lei 13.146/2015) e WCAG 2.1 AA: contraste adequado, navegação por teclado, rótulos para leitores de tela, áudio como alternativa ao painel visual e fonte grande no totem. |
| RNF11 | Usabilidade | O totem deve ser usável sem treinamento, com no máximo um toque para emitir a senha. |
| RNF12 | Manutenibilidade | Frontend em React 19. Backend e banco de dados serão definidos na segunda fase, entre as opções aceitas pelo laboratório (Node.js 22 com Express, Java 21 com Spring Boot ou Python 3.14 com Flask/FastAPI; MySQL 8.0). Código versionado em Git com branches `main` e `dev`. |

## 3. Regras de negócio

| ID | Regra |
|----|-------|
| RN01 | Há três tipos de senha: SP (prioritária), SE (retirada de exames) e SG (geral). Qualquer guichê atende qualquer tipo. |
| RN02 | A ordem de chamada segue `[SP] → [SE\|SG] → [SP] → [SE\|SG]`. Na vez de SP: SP, senão SE, senão SG. Na vez de SE\|SG: SE, senão SG, senão SP. Dentro de cada tipo, a ordem é de chegada. |
| RN03 | A cada chamada, a vez alterna entre SP e SE\|SG, mesmo que uma fila esteja vazia. |
| RN04 | Expediente das 7h às 17h. Atendimentos em curso são concluídos pelo atendente; as senhas restantes são descartadas. |
| RN05 | Após duas chamadas sem comparecimento do cliente, a senha é considerada abandonada (NÃO_COMPARECEU) e o sistema passa à próxima. Historicamente, cerca de 5% das senhas não são atendidas. |
| RN06 | Estados da senha: EMITIDA → AGUARDANDO → CHAMADA → CHAMADA_NOVAMENTE → EM_ATENDIMENTO → ATENDIDA. Também é possível chegar a NÃO_COMPARECEU. Veja `docs/models/uml/maquina-de-estados.md`. |
| RN07 | Tempo médio de atendimento de referência: SG 5 min (±3), SP 15 min (±5), SE 1 min em 95% dos casos e 5 min nos 5% restantes. No sistema real, o tempo é medido entre iniciar e finalizar. |
| RN08 | O painel mostra as 5 últimas senhas chamadas e nunca a próxima, pois uma nova senha pode alterar a sequência. |
| RN09 | Numeração `YYMMDD-PPSQ`: ano, mês e dia da emissão; tipo (SP, SE, SG); sequência de 3 dígitos por tipo, reiniciada diariamente. Exemplo: `260930-SP001`. |
| RN10 | Só o atendente autenticado chama, inicia e finaliza atendimentos. O gestor é único e responsável por cadastros e relatórios. |
| RN11 | Um guichê só chama nova senha quando não tem atendimento em andamento. |
| RN12 | "Chamar novamente" só é permitido uma vez por senha; a nova chamada é anunciada como "Última chamada". |

## 4. Casos de uso

| ID | Caso de uso | Ator | Fluxo principal | Fluxos alternativos |
|----|-------------|------|-----------------|---------------------|
| UC01 | Emitir senha | Cliente | 1. Escolhe o tipo no totem. 2. O sistema gera a senha (RN09) e a coloca em AGUARDANDO. 3. O totem exibe o número. | Backend indisponível: totem exibe aviso (RNF04). Fora do expediente: emissão negada. |
| UC02 | Chamar próxima senha | Atendente | 1. Clica em "Chamar próxima". 2. O sistema escolhe a senha pela RN02 e a marca CHAMADA no guichê. 3. O painel exibe e toca o áudio. | Fila vazia: mensagem informando. Guichê ocupado: ação negada. Concorrência: a segunda requisição recebe outra senha (RNF08). |
| UC03 | Chamar novamente | Atendente | 1. Clica em "Chamar novamente". 2. A senha vai para CHAMADA_NOVAMENTE. 3. O áudio toca com "Última chamada". | Já chamada duas vezes: ação negada. |
| UC04 | Iniciar atendimento | Atendente | 1. O cliente chega ao guichê. 2. O atendente clica em "Iniciar". 3. A senha vai para EM_ATENDIMENTO. | — |
| UC05 | Finalizar atendimento | Atendente | 1. Clica em "Finalizar". 2. A senha vai para ATENDIDA e o guichê fica livre. | — |
| UC06 | Registrar não comparecimento | Atendente | 1. Após a segunda chamada, o cliente não vem. 2. O atendente clica em "Não compareceu". 3. A senha vai para NÃO_COMPARECEU e o guichê fica livre. | — |
| UC07 | Acompanhar painel | Cliente | 1. Olha o painel. 2. Vê as 5 últimas senhas e o guichê. 3. Ouve a chamada. | Falha do backend: painel mantém a última lista e mostra aviso. |
| UC08 | Consultar relatórios | Gestor | 1. Faz login. 2. Escolhe o período (dia ou mês). 3. Vê quantitativos, detalhamento, tempo médio e auditoria. | Sem dados: relatório vazio. |
| UC09 | Fazer login | Atendente / Gestor | 1. Informa usuário e senha. 2. O sistema valida e abre a sessão conforme o perfil. | Credenciais inválidas: acesso negado. |
| UC10 | Encerrar expediente | Sistema / Gestor | 1. Às 17h, o sistema bloqueia novas emissões. 2. Atendimentos em curso terminam. 3. Senhas restantes são descartadas. | — |

## 5. Estratégia para falhas (recuperação de desastres)

> Esta estratégia vale para o sistema completo (segunda fase). Na primeira fase não há backend nem banco.

- **Frontend:** toda chamada à API trata falha de rede. Totem e terminal exibem mensagem clara; o painel mantém a última lista e mostra aviso, sem apagar as informações.
- **Backend fora do ar:** o frontend continua tentando reconectar (a cada 2 s) e volta ao normal sozinho.
- **Banco fora do ar:** o backend responde 503; o estado das senhas é recuperado do banco ao voltar, pois tudo é persistido.
- **Contingência:** recepção com senhas físicas numeradas, lançadas depois no sistema.
- **Backup:** dump diário do MySQL e restauração testada.

## 6. Desempenho dos atendimentos (proposta)

Indicadores: tempo médio de espera (emissão até a primeira chamada), tempo médio de atendimento por tipo, taxa de não comparecimento, senhas atendidas por guichê e por hora, e tamanho da fila em cada momento. São calculados a partir dos horários já registrados na auditoria.
