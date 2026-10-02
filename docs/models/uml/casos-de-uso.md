# Diagrama de casos de uso

```mermaid
flowchart LR
    C([Cliente])
    A([Atendente])
    G([Gestor])
    S([Sistema])

    subgraph nassauTickets
        UC01(UC01 Emitir senha)
        UC07(UC07 Acompanhar painel)
        UC09(UC09 Fazer login)
        UC02(UC02 Chamar próxima senha)
        UC03(UC03 Chamar novamente)
        UC04(UC04 Iniciar atendimento)
        UC05(UC05 Finalizar atendimento)
        UC06(UC06 Registrar não comparecimento)
        UC08(UC08 Consultar relatórios)
        UC10(UC10 Encerrar expediente)
    end

    C --- UC01
    C --- UC07
    A --- UC09
    A --- UC02
    A --- UC03
    A --- UC04
    A --- UC05
    A --- UC06
    G --- UC09
    G --- UC08
    G -.->|também é| A
    S --- UC10
```
