# Mockups das telas (primeira fase)

Protótipos de baixa fidelidade das três telas da primeira fase. As telas reais ficam em `frontend/src/pages/`.

## Totem

O cliente escolhe o tipo de atendimento e recebe a senha.

```
┌──────────────────────────────────────────────────────────┐
│ nassauTickets · Laboratório de Análises Clínicas          │
│ [Totem]  Painel  Atendente                                │
├──────────────────────────────────────────────────────────┤
│                  Retire sua senha                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │      SP      │  │      SG      │  │      SE      │    │
│  │ Prioritário  │  │    Geral     │  │  Retirada    │    │
│  │ Idosos,      │  │ Coleta e     │  │  de exames   │    │
│  │ gestantes,   │  │ demais       │  │ Resultados   │    │
│  │ PcD          │  │ serviços     │  │ prontos      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Sua senha                      SG                  │  │
│  │ 261004-SG003                                       │  │
│  │ Emitida às 09:12 · Aguarde ser chamado no painel   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Painel de chamadas

Mostra a senha chamada agora e as últimas chamadas.

```
┌──────────────────────────────────────────────────────────┐
│ nassauTickets · Laboratório de Análises Clínicas          │
│  Totem  [Painel]  Atendente                               │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │ CHAMANDO AGORA                                     │  │
│  │              261004-SP001                          │  │
│  │              Guichê 2                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Últimas chamadas                                         │
│  │ 261004-SG001                          Guichê 1   │    │
│  │ 261004-SE001                          Guichê 3   │    │
│  │ 261004-SG002                          Guichê 2   │    │
└──────────────────────────────────────────────────────────┘
```

## Atendente

O atendente escolhe o guichê, vê a fila de espera e chama a próxima senha.

```
┌──────────────────────────────────────────────────────────┐
│ nassauTickets · Laboratório de Análises Clínicas          │
│  Totem  Painel  [Atendente]                               │
├──────────────────────────────────────────────────────────┤
│  Guichê [ 1 ▾ ]                    [ Chamar próxima ]     │
│                                                          │
│  Última chamada deste guichê: 261004-SG001                │
│                                                          │
│  Fila de espera (4)                                       │
│  │ SP  261004-SP002                    09:14         │    │
│  │ SE  261004-SE002                    09:15         │    │
│  │ SG  261004-SG004                    09:16         │    │
└──────────────────────────────────────────────────────────┘
```

O estado é compartilhado: toda senha emitida no Totem aparece na fila do Atendente, e toda chamada feita pelo Atendente aparece no Painel.
