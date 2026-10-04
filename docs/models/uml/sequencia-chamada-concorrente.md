# Sequência: dois atendentes chamando ao mesmo tempo

```mermaid
sequenceDiagram
    participant A1 as Atendente (guichê 1)
    participant A2 as Atendente (guichê 2)
    participant API as Backend
    participant DB as MySQL
    participant P as Painel

    A1->>API: POST /guiches/1/chamar
    A2->>API: POST /guiches/2/chamar
    API->>DB: BEGIN; SELECT ... FOR UPDATE (requisição 1)
    Note over API,DB: requisição 2 espera o bloqueio
    DB-->>API: senha SP001
    API->>DB: UPDATE estado = CHAMADA; COMMIT
    API-->>A1: senha SP001
    API->>DB: BEGIN; SELECT ... FOR UPDATE (requisição 2)
    DB-->>API: senha SG001
    API-->>A2: senha SG001
    P->>API: GET /painel (a cada 2 s)
    API-->>P: últimas 5 senhas + evento de áudio
```
