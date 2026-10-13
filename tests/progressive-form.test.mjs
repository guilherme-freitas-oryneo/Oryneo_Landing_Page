import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const load = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('página contém as seis etapas, progresso e regiões acessíveis', async () => {
  const html = await load('../comecar/index.html');
  assert.equal((html.match(/data-step="(contact|company|acquisition|priorities|commercial|review)"/g) || []).length, 6);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /id="form-status"[^>]*role="status"/);
  assert.equal((html.match(/class="step-title" tabindex="-1"/g) || []).length, 6);
  assert.match(html, /href="\.\.\/privacidade\.html"/);
  assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/);
});

test('identidade usa somente o wordmark monocromático também na marca d’água', async () => {
  const [html, css] = await Promise.all([load('../comecar/index.html'), load('../comecar/form.css')]);
  assert.match(html, /oryneo-wordmark-mono-reverse\.png/);
  assert.match(html, /class="brand-watermark"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /oryneo-(?:y|symbol)\.svg/);
  assert.match(css, /\.brand-watermark[\s\S]*opacity:\s*\.04/);
  assert.match(css, /\.brand-watermark[\s\S]*pointer-events:\s*none/);
  await access(new URL('../assets/oryneo-wordmark-mono-reverse.png', import.meta.url));
});

test('layout prevê foco, movimento reduzido e telas estreitas', async () => {
  const [css, script] = await Promise.all([load('../comecar/form.css'), load('../comecar/form.js')]);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.step-title:focus[\s\S]*outline:\s*none/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*360px\)/);
  assert.match(script, /\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(script, /oryneo_progressive_intake_v1/);
  assert.match(script, /sessionStorage\.removeItem/);
});

test('nenhum envio parcial acontece antes da revisão', async () => {
  const script = await load('../comecar/form.js');
  const sendIndex = script.indexOf('OryneoLeadIntake.send');
  const reviewIndex = script.indexOf("case 'review'");
  assert.ok(reviewIndex >= 0);
  assert.ok(sendIndex > reviewIndex);
});
