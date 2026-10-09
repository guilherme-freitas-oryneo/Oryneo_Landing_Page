# ORYNEO — versão 32

## Objetivo

Separar o telefone e o e-mail no contato rápido para impedir que ambos sejam digitados no mesmo campo e rejeitados pela validação.

## Formulário

- Nome obrigatório.
- WhatsApp com DDD obrigatório, com máscara `(00) 00000-0000` e validação de DDD/celular brasileiro.
- E-mail opcional, validado quando preenchido; domínios comuns com erro de digitação mostram sugestão de correção.
- Descrição do que a pessoa quer organizar opcional e em área de texto menor.
- Telefone e e-mail informado entram em linhas separadas na revisão e no e-mail preparado.

O fluxo de envio permanece por `mailto:`. A página não registra a solicitação automaticamente nem mostra confirmação de recebimento sem o webhook.

## Verificação

- `node --test tests/*.test.cjs` — todos os testes passaram.
- `node --check` em `quick-contact.js` e `browser.cjs` — sem erros de sintaxe.
- `git diff --check` — sem erros de whitespace.
- O navegador headless não está instalado neste ambiente; o teste visual automatizado foi atualizado, mas não pôde ser executado aqui.
