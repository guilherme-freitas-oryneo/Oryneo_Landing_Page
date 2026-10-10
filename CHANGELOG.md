# Landing page ORYNEO

## Versão 32 — 09/10/2026

- No contato rápido, telefone/WhatsApp com DDD e máscara brasileira passou a ser obrigatório; validação confere celular móvel e DDD.
- E-mail virou campo separado e opcional, com validação de formato e sugestão de correção para domínios conhecidos com erro de digitação.
- Contexto da operação ficou opcional e menor; telefone e e-mail informado aparecem em campos próprios na revisão.
- O envio continua abrindo o aplicativo de e-mail do visitante; nenhum recebimento automático foi prometido.

## Versão 31 — 09/10/2026

- Planos reposicionados por resultado e escopo de implantação: Start organiza o atendimento; Growth acrescenta desenho de cadência comercial ajustada ao funil; Scale inclui desenho de fluxos entre equipes, etapas e funis.
- Automações essenciais permanecem no Start; as diferenças Growth/Scale são serviços de configuração e desenho operacional, sem afirmar capacidades de software não comprovadas.
- Removidas das descrições de Growth e Scale as referências vagas a “mais arquivos”; capacidade de equipe, funis, IA e transcrição continua discriminada nos planos.
- Valores, ciclos de cobrança, seleções do formulário e cálculos comerciais preservados.

## Versão 30 — 09/10/2026

- Mantidos os respiros e a divisão visual da V29; sem alteração de estrutura ou espaçamento.
- Removidos os limites em GB da linha de capacidade do resumo selecionado e da solicitação preparada; limites de IA e transcrição continuam claros.
- Adicionado estado final personalizado para exibir após confirmação do recebimento pelo webhook.
- A confirmação só é acionada pelo evento `oryneo:webhook-accepted`; o modo `?v30-preview=confirmation` demonstra a tela sem enviar dados.
- Mantido o envio atual por e-mail. Webhook e persistência de solicitações ainda não estão conectados.

## Versão 29 — 09/10/2026

- A hierarquia visual passou a separar a jornada, a demonstração do CRM e os planos por capítulos com fundos contrastantes e mais espaço vertical.
- CTA direto para conversa no primeiro bloco, usando o fluxo de contato já existente.
- Removidos do rodapé dos planos os detalhes de contabilização de franquias; os limites permanecem nos cards, e regras de consumo ficam para os termos.
- Descrição para busca/compartilhamento alinhada à oferta; canonical, Open Graph URL, `robots.txt` e sitemap apontam para `oryneo.com.br`.
- Nenhum depoimento ou indicador de resultado foi inventado; publicação ainda depende de provas reais, domínio canônico e confirmação do canal de envio dos contatos.

## Versão 28 — 09/10/2026

- Seções principais ganharam alternância de superfícies, mais espaço vertical e títulos com hierarquia mais forte.
- Percurso de três etapas ficou mais claro e as listas de aquisição e planos perderam micro marcadores decorativos.
- Ajustes responsivos para manter o ritmo e a leitura em telas menores.
- Conteúdo, valores, serviços, marca e interações comerciais preservados.
- Preview local para revisão; nenhuma publicação foi feita.

## Versão 24 — 09/10/2026

- Conversa rápida separada da solicitação completa, com revisão e envio explícito pelo aplicativo de e-mail.
- CNPJ numérico e alfanumérico com validação de dígitos; preenchimento manual disponível, inclusive quando a consulta externa falha.
- Franquias à vista nos planos, recursos comuns expansíveis, dúvidas comerciais e aviso de privacidade acessível.
- Percurso simplificado; demonstração do CRM legível também no desktop, sem texto miniaturizado sobre foto.
- Corrigidos os transbordamentos do cabeçalho, complementos e revisão em 320px.
- Preços, desconto anual, franquias e cobrança trimestral do tráfego preservados.
- Verificação: 18 testes unitários/conteúdo; 24 combinações comerciais no navegador; seis larguras de 320 a 1440px; fluxos rápido, completo, consulta simulada e alternativa manual.
- Esta entrega é o preview para aprovação. Produção na Hostinger e integrações seguem a etapa posterior documentada em docs/RELEASE_V24.md.

## Versão 23 — 08/10/2026

- Hero reconstruída como conversa e acompanhamento no CRM, com Marina, Ana e a próxima ação coerentes com a demonstração existente.
- Removidas foto de celular, sobreposição da tela e transparências nas bordas.
- CTA principal passa a “Veja como funciona”, levando ao percurso comercial.
- Composição responsiva legível, com exemplo fictício identificado e sem dependência de imagem para os textos.
- Conteúdo posterior à hero e lógica comercial preservados.

## Versão 22 — 08/10/2026

- Imagem da hero deixa de parecer um quadro: removidas sombra e bordas arredondadas; as extremidades se misturam ao fundo da página.
- Legenda passa a acompanhar a composição com alinhamento à esquerda e menor peso visual.
- Conversa, posicionamento do telefone, conteúdo comercial e cálculos permanecem preservados.

## Versão 21 — 08/10/2026

- Hero substituída por uma cena fotográfica integrada ao ambiente, com telefone frontal e mão enquadrada de forma natural.
- Tela de WhatsApp reposicionada para acompanhar os limites reais do aparelho; removida a foto isolada em fundo branco que deixava o conjunto com aparência de recorte.
- Teste de conteúdo passou a conferir a nova imagem e o alinhamento da tela sobre o telefone.
- Plano, preços, complementos e cálculos comerciais preservados.

## Versão 20 — 08/10/2026

- Símbolo da Meta corrigido para não cortar o traço e alinhado ao tamanho do Google Ads.
- Demonstração da operação passa a usar um único notebook, com o registro do CRM acompanhando as três etapas selecionadas.
- Em telas menores, a interface vira uma visualização legível do CRM, com cabeçalho e contexto preservados.
- Celular da hero recebe um deslocamento controlado para integrar a mão à composição, sem criar um painel vazio.
- Texto visível simplificado: removidos termos como “Headline”, “Copy”, “UTM”, “canonical”, “Core Web Vitals”, “pipeline”, “cadência”, “briefing” e “homologação”. Termos relevantes de busca permanecem nos metadados.
- Preços, políticas, franquias, ciclos, cálculo da primeira cobrança, seleção de complementos e fluxo de e-mail preservados.


## Versão 18 — 08/10/2026

- Atendimento com IA no WhatsApp passa a apresentar a transcrição automática de áudios recebidos como parte do mesmo fluxo, sem criar um serviço adicional.
- Franquias preservadas em 1.500/5.000/10.000 respostas com IA e 300/700/1.200 minutos de áudio transcrito por mês.
- Removida a mensagem de indefinição sobre franquia comercial; automações, mensagens configuradas, tarifas externas e excedentes ganham redação objetiva.
- Título, descrição e metadados sociais passam a nomear CRM com WhatsApp, automação comercial e gestão de leads.
- Preços, ciclos, implantação, complementos e cálculos da primeira cobrança permanecem inalterados.

## Versão 17 — 08/10/2026

- A gestão de tráfego continua apresentada pelo equivalente de R$ 989,90/mês, com cobrança trimestral de R$ 2.969,70.
- Ao selecionar tráfego, a primeira cobrança passa a somar o trimestre completo, em vez de apenas uma mensalidade.
- Revisão e resumo final explicitam o valor trimestral; a verba de mídia continua separada.

## Versão 16 — 08/10/2026

- Preços aprovados dos complementos incorporados: landing page por R$ 889,90 em pagamento único e gestão de tráfego por R$ 989,90/mês.
- Gestão de tráfego explicita contratação mínima de 3 meses, compromisso de R$ 2.969,70 e verba de mídia paga separadamente.
- A primeira cobrança estimada passa a reagir às marcações e soma plano, implantação, landing page e o primeiro mês da gestão de tráfego, conforme a configuração.
- O resumo final do formulário replica valores, recorrência e política de cada complemento.

## Versão 15 — 08/10/2026

- A revisão passa a reagir visualmente à seleção dos complementos e lista landing page e gestão de tráfego individualmente, cada um com a indicação “Sob proposta”.
- O valor numérico foi renomeado para “Plano + implantação”, evitando tratá-lo como total da contratação quando há serviços ainda sem preço fechado.
- Contador de complementos, orientação dinâmica e aviso de composição do valor tornam a configuração selecionada explícita antes do formulário.

## Versão 14 — 08/10/2026

- Demonstração interativa de uma landing page em contexto: anúncio, mensagem, CTA, lead identificado, CRM e medição. Exemplos fictícios e sem promessa de posição no Google ou taxa de conversão.
- Inclusão de navegação acessível por teclado entre os painéis de copy, conversão, busca e medição; preview acompanha o tema selecionado.
- A escolha de Start, Growth ou Scale agora revela o pedido de compra: primeiro plano, depois complementos opcionais desmarcados e resumo de valores.
- Landing page e gestão de tráfego mostram escopo sob proposta e ficam explicitamente fora do total dos planos. Verba de mídia separada.
- Mensalidade, anual antecipado com 10% de desconto, implantação e capacidades existentes preservadas; formulário e aviso de prévia sem contratação preservados.

## Versão 13 — 08/10/2026

- Hero refeito em torno da pergunta operacional e de um exemplo ilustrativo de conversa em um preview de iPhone. A mesma oportunidade segue no percurso e nas demonstrações do CRM; dados fictícios estão sinalizados.
- Formulário de quatro etapas movido para depois da comparação e do resumo de escolha. Consulta de CNPJ, validações e revisão final preservadas.
- Alternância mensal/anual com 10% de desconto sobre as mensalidades no pagamento anual antecipado. Os cálculos usam centavos inteiros e distinguem valor equivalente por mês, parcela anual, implantação única e primeira cobrança prevista.
- Implantações ajustadas para R$ 989,90 / R$ 1.389,90 / R$ 1.849,90. Planos e capacidades de usuários, arquivos ativos, respostas de IA e áudio permanecem alinhados ao adendo comercial v1.5.
- Serviços complementares entram como pedido de proposta, sem preço no total. A matriz vigente não aprova uma franquia numérica de mensagens automáticas nem política de excedentes; a página não promete números ou gratuidade externa.
- Escolha de plano, ciclo e serviços chega ao resumo do formulário e atualiza a revisão se for alterada. A prévia continua sem envio, pagamento ou contratação real.

## Versão 12 — 07/10/2026

- Planos atualizados conforme o adendo comercial Master 360 v1.5: Start R$ 749,90/mês + R$ 990,00 de implantação; Growth R$ 1.099,90/mês + R$ 1.390,00; Scale R$ 1.479,90/mês + R$ 1.849,00.
- Capacidades de 20/50/100 GB de arquivos ativos, 1.500/5.000/10.000 respostas de IA e 300/700/1.200 minutos de áudio recebido interpretado por mês.
- Benefícios apresentados integralmente em cada plano, incluindo WhatsApp conectado ao CRM, cadências, IA acionada pelo fluxo e biblioteca vinculada a clientes e negociações. Scale inclui dashboard de vendas.
- Ações de contratar ou conversar em cada plano levam ao CNPJ e preservam plano, intenção e serviços escolhidos para o resumo. Navegação principal aponta para os planos.
- Prévia continua sem envio real de solicitação, pagamento ou checkout. O formulário e suas validações foram preservados.

## Versão 11 — 07/10/2026

- Decisão explícita de Guilherme: apresentar WhatsApp integrado como parte da oferta, usando a experiência em evolução na Polaris. Esta decisão substitui a restrição anterior de comunicação da landing page; não comprova migração técnica nem altera os controles de isolamento do produto.
- Demonstração ilustrativa de uma oportunidade em três momentos: recebimento, conversa no WhatsApp e negociação com retorno agendado.
- Automações mostradas como atribuição de responsável, criação de tarefa e cadência por etapa. Dados fictícios identificados na seção.
- Seção comercial acrescentada com os três planos e os dois serviços, preservando os valores e limites da consolidação Master 360 v1.4. Growth é marcado como mais indicado.
- Seleção de plano/serviço e intenção encaminha ao CNPJ; plano, serviços e intenção aparecem no resumo do formulário. A prévia informa que a solicitação não é enviada e que ainda não há checkout online.
- Navegação por toque e teclado; layout próprio para telas estreitas; sem execução automática de mensagens, CRM ou cobrança nesta prévia.
- Formulário, consulta de CNPJ e validações existentes preservados.

## Integração CRM — 2026-10-10
- Solicitação completa e contato rápido enviam diretamente ao CRM ORYNEO via Supabase Edge Function.
- Confirmação exibida somente após gravação; reenvios usam identificador estável e não duplicam oportunidades.
- Falhas mantêm os dados preenchidos; envio tem estado de carregamento e limite de espera.
- Layout, valores comerciais e audiência de hospedagem preservados.
