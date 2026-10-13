# ORYNEO — Landing Page

## Conteúdo

- `index.html`: página principal.
- `comecar/`: formulário comercial progressivo em seis etapas.
- `assets/`: marcas e recursos visuais e scripts da página.
- `privacidade.html`: informações sobre o uso de dados no formulário.
- `robots.txt` e `sitemap.xml`: indexação para o domínio `oryneo.com.br`.
- `CHANGELOG.md` e `docs/`: histórico e notas de release.

## Fluxo comercial

Os CTAs da página principal levam a `./comecar/` com apenas plano, ciclo, intenção, complementos e UTMs permitidos. Valores exibidos na página nunca são enviados como fonte de preço.

O preenchimento é mantido temporariamente na sessão do navegador. O lead só é criado depois da revisão final e da confirmação positiva da Edge Function `lead-intake` no Supabase. Tentativas da mesma submissão reutilizam um `request_id` para evitar duplicidade.

## Validação

O workflow `.github/workflows/ci-landing-v2.yml` verifica a sintaxe dos scripts, os contratos comerciais, a página progressiva e o transporte de leads com `node --test tests/*.test.mjs`.

## Arquivos do site

Os arquivos estáticos estão na raiz do repositório, prontos para hospedagem estática.
