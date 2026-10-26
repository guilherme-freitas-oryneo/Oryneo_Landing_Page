# ORYNEO — Domínio comercial da landing page

## Endereço principal
- Landing page: `https://oryneo.com.br/`
- Início da jornada: `https://oryneo.com.br/comecar/`
- Variante `https://www.oryneo.com.br/`: redirecionamento canônico para o domínio sem www, após DNS e GitHub Pages configurados.

## Segurança da mudança
A branch contém um `CNAME` com `oryneo.com.br`, mas **não deve ser incorporada antes de validar o DNS no painel da Hostinger e o estado do Pages**. Publicar a mudança sem configurar DNS pode tornar o site atualmente acessível pelo github.io temporariamente inacessível.

## Ordem para ativação
1. Em `https://github.com/guilherme-freitas-oryneo/Oryneo_Landing_Page/settings/pages`, confirmar a fonte de publicação e se já há domínio personalizado em uso. **Não alterar o domínio se estiver vinculado a outro site.**
2. Conferir, na Hostinger, que os nameservers autoritativos do `oryneo.com.br` são gerenciados na zona exibida. Registrar os valores A existentes antes de alterar.
3. No GitHub Pages, em **Custom domain**, configurar `oryneo.com.br`. Se o site publicar diretamente de uma branch, o GitHub grava `CNAME` na branch de origem; se publicar por workflow, o domínio só é aplicado pela opção de Pages.
4. Na zona DNS autoritativa da Hostinger, substituir **somente registros A do host `@` conflitantes** pelos quatro registros oficiais GitHub Pages (um registro para cada endereço):
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. Para `www`, configurar um registro `CNAME` com valor `guilherme-freitas-oryneo.github.io` (sem nome de repositório), removendo apenas eventual registro *conflitante* de `www`. Preservar os registros MX, SPF, DKIM, DMARC, TXT de domínio, demais subdomínios e seus valores.
6. Conferir DNS público A em `@` e CNAME de `www`. Até 24 horas de propagação; depois confirmar `https://oryneo.com.br/`, `https://www.oryneo.com.br/` (redirecionamento), `/comecar/` e `/privacidade.html`.
7. Em GitHub Pages habilitar **Enforce HTTPS** somente quando o certificado estiver disponível; conferir redirecionamento e conteúdo. Atualizar na Meta o campo Site para `https://oryneo.com.br/` somente após ficar público, com identificação jurídica da NEXUM.
8. Não tocar em FTP, SMTP, credenciais, banco, Supabase, Stripe, checkout ou ambiente comercial; caso haja erro, reverter somente a configuração de DNS/custom domain correspondente após guardar o estado anterior.

## Documentação oficial
- GitHub Pages: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Hostinger: https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/

## Estado
- A razão social já consta na branch principal da landing e na política de privacidade.
- **Conexão DNS/Pages e validação externa ainda pendentes.** Este documento não é prova de que `oryneo.com.br` já está servindo o site.
