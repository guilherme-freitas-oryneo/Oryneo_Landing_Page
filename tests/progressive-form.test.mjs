import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const load = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('página contém seis etapas, progresso e regiões acessíveis', async () => {
  const html = await load('../comecar/index.html');
  assert.equal((html.match(/data-step="(name|contact|company|acquisition|priorities|review)"/g) || []).length, 6);
  assert.doesNotMatch(html, /data-step="commercial"/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /id="form-status"[^>]*role="status"/);
  assert.equal((html.match(/class="step-title" tabindex="-1"/g) || []).length, 6);
  assert.match(html, /href="\.\.\/privacidade\.html"/);
  assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/);
});

test('configuração comercial aparece apenas como contexto compacto na revisão', async () => {
  const [html, css, script] = await Promise.all([
    load('../comecar/index.html'),
    load('../comecar/form.css'),
    load('../comecar/form.js'),
  ]);
  assert.match(html, /data-commercial-context/);
  assert.match(html, /data-commercial-editor[^>]*hidden/);
  assert.match(html, /data-commercial-empty/);
  assert.doesNotMatch(html, />Quero conversar</);
  assert.doesNotMatch(html, />Quero contratar</);
  assert.match(script, /Configuração definida no diagnóstico/);
  assert.match(css, /\.commercial-context/);
});

test('identidade usa wordmark e símbolo oficiais sem marca d’água decorativa', async () => {
  const html = await load('../comecar/index.html');
  assert.match(html, /oryneo-wordmark-mono-reverse\.png/);
  assert.match(html, /oryneo-symbol-official\.svg/);
  assert.doesNotMatch(html, /brand-watermark/);
  await access(new URL('../assets/oryneo-wordmark-mono-reverse.png', import.meta.url));
  await access(new URL('../assets/oryneo-symbol-official.svg', import.meta.url));
});

test('nome fica isolado, CNPJ substitui a empresa e consentimento fica na revisão', async () => {
  const html = await load('../comecar/index.html');
  const nameStep = html.match(/<section class="form-step" data-step="name">([\s\S]*?)<\/section>/)?.[1] || '';
  assert.equal((nameStep.match(/<input\b/g) || []).length, 1);
  assert.match(html, /name="company_cnpj"/);
  assert.doesNotMatch(html, /name="company_name"/);
  const reviewStep = html.match(/<section class="form-step" data-step="review" hidden>([\s\S]*?)<\/section>/)?.[1] || '';
  assert.match(reviewStep, /name="consent"/);
});

test('layout prevê foco, movimento reduzido e telas estreitas', async () => {
  const [css, script] = await Promise.all([load('../comecar/form.css'), load('../comecar/form.js')]);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.step-title:focus[\s\S]*outline:\s*none/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*360px\)/);
  assert.match(script, /\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(script, /oryneo_progressive_intake_v4/);
  assert.match(script, /sessionStorage\.removeItem/);
});

test('nenhum envio parcial acontece antes da revisão', async () => {
  const script = await load('../comecar/form.js');
  const sendIndex = script.indexOf('OryneoLeadIntake.send');
  const reviewIndex = script.indexOf("case 'review'");
  assert.ok(reviewIndex >= 0);
  assert.ok(sendIndex > reviewIndex);
});

test('fluxo sempre inicializa pela primeira etapa declarada', async () => {
  const [html, script] = await Promise.all([load('../comecar/index.html'), load('../comecar/form.js')]);
  assert.match(script, /goTo\(STEPS\[0\]\);\s*$/);
  assert.doesNotMatch(script, /goTo\('contact'\);\s*$/);
  assert.match(html, /src="form\.js\?v=20261013-7"/);
  assert.match(script, /from '\.\/intake-model\.mjs\?v=20261013-6'/);
});
