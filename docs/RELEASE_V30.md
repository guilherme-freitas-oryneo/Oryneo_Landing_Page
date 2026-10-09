# ORYNEO — versão 30 local

## Escopo

Prévia local para revisão, sem publicação no Site/GitHub e sem integração de webhook. A estrutura de seções e os espaçamentos da V29 foram preservados.

## Revisões e mudanças

- A mensagem de operação/consumo em parágrafos não está presente na V29. Limites de IA e transcrição seguem resumidos nos cards dos planos; as regras de contabilização permanecem fora da landing page.
- A linha de capacidade do plano escolhido não exibe mais GB. Usuários, respostas de IA e minutos de transcrição permanecem no resumo.
- Estado final proposto:

  **Solicitação recebida**

  **Agora, a conversa começa pela sua operação.**

  “Obrigado, {nome}. A equipe ORYNEO vai analisar como sua empresa atrai, atende e acompanha oportunidades para conversar com você sobre o próximo passo que faz sentido para a realidade do negócio.”

  “Vamos falar com você pelo contato informado. Não é preciso enviar novamente.”

- Em produção, `oryneo:webhook-accepted` só deve ser disparado depois que o servidor persistir a solicitação e confirmar o recebimento.
- Para demonstrar o estado sem envio: abrir a prévia com `?v30-preview=confirmation`. Ela usa nome fictício e informa que não houve envio.
- O fluxo atual permanece por e-mail e não dispara o estado de sucesso. Não afirmar recebimento até conectar e confirmar o webhook.

## Verificação

- `node --test tests/*.test.cjs` — todos os testes passaram.
- Revisão estática de CSS, semântica e JS. Os espaçamentos responsivos da V29 foram mantidos; o painel novo usa o mesmo sistema tipográfico e estados de foco.
- QA visual em Chromium não executado neste ambiente porque o binário do navegador não está instalado.
