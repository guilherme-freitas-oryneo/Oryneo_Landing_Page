# ORYNEO — versão 31

## Objetivo

Deixar explícito o que o cliente ganha ao avançar de plano, com diferenciação baseada em serviço de implantação e sem atribuir recursos de software que não foram comprovados.

## Planos

- **Start:** organizar o atendimento e os retornos, com automações essenciais configuradas na implantação.
- **Growth:** inclui desenho de uma cadência comercial ajustada às etapas do funil.
- **Scale:** inclui desenho de fluxos entre equipes, etapas e funis.

Os três continuam compartilhando CRM, WhatsApp, recursos gerais, automações, respostas com IA e transcrição. Capacidade de usuários, funis, IA e áudio permanece indicada em cada plano. Preços e cálculos não mudam.

## Revisão

- Removida a copy sem sustentação “mais capacidade de IA e arquivos”.
- Incluída uma frase breve explicando que muda a capacidade e a profundidade do desenho na implantação.
- Nenhuma alteração no motor de preços ou nas regras do formulário.
- Estado de confirmação da versão anterior permanece dependente de `oryneo:webhook-accepted`; o formulário ainda usa e-mail e não confirma recebimento real.

## Verificação

- `node --test tests/*.test.cjs` — todos os testes passaram.
- `git diff --check` — sem erros de whitespace.
- Revisão de strings dos três planos e dos textos responsivos.
