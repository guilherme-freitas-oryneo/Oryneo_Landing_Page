# ORYNEO — corte editorial da landing

## Intenção
Fazer a proposta ser compreendida na primeira dobra e reduzir o esforço de leitura até a escolha entre conversar e contratar. A página atual tem sete capítulos, simulações redundantes e dois caminhos de formulário; o usuário autorizou cortes amplos.

## Direção
Uma landing de produto, não uma demonstração cenográfica. Hero tipográfico com promessa concreta e CTA; uma seção de três resultados operacionais sem cards ou UI fictícia; comparação compacta de Start, Growth e Scale; dúvidas comerciais essenciais; fechamento com um único caminho consultivo. A seleção de plano e complementos mantém o encaminhamento atual ao checkout.

## Abordagens
- Polir as simulações existentes: descartado; preservaria a fadiga visual.
- Recriar a experiência em framework novo: descartado; risco desnecessário para rotas e formulários.
- Recompor o HTML/CSS estático existente e preservar o módulo comercial: escolhido por manter contratos e permitir mudança editorial profunda.

## Regras
- Marca: wordmark master, Inter, Graphite `#0F1115`, Indigo `#4F6BFF`, Off White `#F8F7F4`; sem reconstrução do símbolo.
- Nenhuma alegação de resultado, cliente ou UI real sem prova. Nenhuma conversa simulada.
- Preços, capacidades, implantação, recorrência e serviços opcionais ficam íntegros e legíveis; detalhes podem ser progressivos.
- CTA contratar segue para `/Oryneo_CRM/contratar/` por `buildDirectCheckoutUrl`, com plano/ciclo/serviços e UTMs permitidos. CTA conversar segue para `/comecar/`. Nenhuma cobrança criada nesta página.
- Responsividade 320–1280 px, foco visível, sem overflow horizontal e sem seção escondida apenas por visual.

## Critérios de aceite
Hero claro sem mockup; no máximo cinco seções visíveis antes do rodapé; um único destino de formulário consultivo; preços e termos críticos presentes; todos os testes passam; QA visual desktop/mobile; publicação apenas com verificação de commit e Pages.
