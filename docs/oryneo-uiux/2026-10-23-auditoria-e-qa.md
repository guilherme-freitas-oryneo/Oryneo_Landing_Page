# Auditoria visual e QA — landing ORYNEO

Data: 23/10/2026. Base de comparação: `bc10649173fecff7ada5c54f31d2e143bf050cf9` (`main` antes desta revisão). Escopo: `index.html`, jornada `/comecar/`, passagem para `/contratar/` e apresentação da marca; nenhuma regra de preço, consentimento, submissão ou pagamento foi alterada.

## Referências de mercado

- [Kommo](https://www.kommo.com/br/): conversa/mensageria como porta de entrada do CRM. A ORYNEO mantém esse foco, mas usa demonstração de responsável e próxima ação em vez de replicar a estética do concorrente.
- [RD Station](https://www.rdstation.com/): separação explícita de produtos, planos e demonstração. A ORYNEO explica aquisição, atendimento e acompanhamento como uma sequência única, sem menu de portfólio extenso.
- [Pipedrive](https://www.pipedrive.com/pt): CRM e funil apresentados de forma concreta. A ORYNEO dá prioridade ao WhatsApp e à rastreabilidade do contato; não promete resultados sem prova.
- [HubSpot CRM](https://www.hubspot.com/products/crm): benefícios e caminhos de entrada reconhecíveis. A ORYNEO diferencia conversa consultiva de contratação direta, mantendo os preços acessíveis.

Benchmark é de padrões de clareza e estrutura, não de identidade visual, números de conversão ou alegações competitivas.

## Diagnóstico e resposta

| Achado no baseline | Risco para a jornada | Resposta implementada |
| --- | --- | --- |
| H1 genérico e header sem ação de conversa | Visitante demora a entender produto e próximo passo | H1 nomeia CRM/WhatsApp; CTA consultivo também no header; planos continuam à vista |
| Pausas verticais excessivas e seção de planos com realce azulado/cartões | Leitura fragmentada, preços com aparência promocional genérica | Ritmo reduzido, percurso escuro conciso, planos em colunas com divisórias discretas e sem “plano favorito” inventado |
| Marca em SVG reconstruído e símbolo divergente | Desvio do manual | PNG e SVG oficiais conferidos por SHA-256 contra manifesto; reverso oficial mantido em fundo escuro |
| Texto muito pequeno em detalhes de interface | Esforço de leitura no celular | Aumentadas legendas e notas funcionais quando cabível; hierarquia tipográfica revista em 390/320 px |
| Formulário `/comecar/` em cartão escuro, marca d’água e microcopy espaçada | Sensação de template separado do restante do site | Composição editorial em duas colunas, sem caixa flutuante e sem marca d’água; progresso e campos preservados |
| Escolha entre conversar e contratar pouco explícita | Confusão sobre pagamento e compromisso | CTAs e FAQ explicam os dois caminhos; `/comecar/` declara ausência de cobrança; `/contratar/` continua a revisão segura |

Não foram inseridos depoimentos, logos de clientes, métricas ou garantias sem evidência. Exemplos de CRM continuam rotulados como ilustrativos.

## QA executado

- Inspeção visual real no navegador local: desktop 1440×900; celulares 390×844 e 320×720. Hero, aquisição, operação, preços, rodapé e `/comecar/` examinados. Em 320 px, `documentElement.scrollWidth === clientWidth` na landing e no formulário, depois de corrigido `min-width` antigo no formulário.
- Navegação real: botão Start mensal chega a `Oryneo_CRM/contratar/?plan=Start&cycle=monthly&intent=contract`, onde o plano e o valor correto aparecem. Nenhum pedido/pagamento foi iniciado.
- UI interativa: mensal → anual altera Start de R$ 749,90/mês para R$ 674,91/mês com total de R$ 8.098,92 a cada 12 meses; aba “Conversão” revela conteúdo correspondente; formulário `/comecar/` valida nome vazio e avança ao contato com nome preenchido. Nenhuma solicitação foi enviada.
- Testes automatizados: `node --test tests/*.test.mjs` — 37/37; `git diff --check` — sem problemas. Cobrem catálogo, parâmetros, validação, transporte de lead com mocks, rotas de CTAs e estrutura do formulário.
- Backends Stripe/Supabase não foram alterados. A verificação de integração foi contratual e de navegação até a tela de revisão; não houve cobrança real nem escrita de lead de teste.

## Limites de evidência

Esta é uma avaliação heurística, não um experimento de conversão. Não há dados de funil/analytics ou usuários para comprovar aumento de receita. O fluxo de pagamento foi inspecionado até a revisão, não transacionado. A responsividade foi examinada nos três tamanhos acima; outros navegadores/dispositivos não foram exaustivamente testados.
