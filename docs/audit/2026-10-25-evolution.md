# Evolução da experiência pública — 25/10/2026

## Implementado nesta branch
- Mensagens da hero e benefícios centradas no núcleo verificado do CRM.
- Captura real ampliável por disclosure nativo, sem criar telas fictícias.
- WebP lossless com fallback PNG; comparação RGBA confirmou igualdade dos pixels.
- Capturas principais: 2.986.017 → 1.804.942 bytes (39,55% menos); não é medição de LCP.
- FAQ explica solicitação, coleta e rascunho; política distingue formulário e checkout.
- Marca oficial na privacidade; âncoras com margem; movimento reduzido e alvos de disclosure.
- QA local no GitHub Actions em 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 e 1920 px; navegação externa bloqueada. Isso não substitui revisão humana das capturas nem conformidade WCAG.

## Preservado
Preços, franquias, implantação, desconto anual, seleção de plano/ciclo e opcionais; marca e imagens originais; backend e rotas comerciais.

## Pendências que não devem ser publicadas como resolvidas
1. Matriz comercial: disponibilidade de WhatsApp integrado, IA, transcrição e automações não homologada. Os planos originais não foram unilateralmente redefinidos. Conciliar antes de publicar uma oferta revisada.
2. Domínio: proprietário informou que ainda não contratou hospedagem. DNS/canonical não alterados; escolher infraestrutura e configurar redirects/CORS antes de migração.
3. CWV: sem métricas de campo nem Lighthouse controlado.
4. Acessibilidade: faltam contraste integral, leitor de tela e revisão manual de todos os estados.
5. Identificação institucional: não inventar razão social/CNPJ/condições de suporte.
6. Formulário: manter obrigatoriedade de CNPJ até conciliar contrato backend; heurísticas de e-mail e alfanumérico exigem ajuste conjunto, não apenas frontend.
7. Checkout: PR #54 contém recuperação de CNPJ, transparência do rascunho e foco; nenhuma cobrança real é necessária para QA.

## Publicação futura
Publicar somente depois dos gates de CI e revisão visual. A mudança em main pode disparar GitHub Pages. Conferir HTML/assets e rotas após deploy. Reverter o commit de merge se houver regressão; nenhuma migração de banco acompanha esta branch. Não disparar formulários, mensagens ou pagamentos como healthcheck.
