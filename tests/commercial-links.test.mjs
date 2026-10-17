import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import commercial from '../assets/commercial.js';

const { buildCommercialUrl } = commercial;

test('gera combinações de plano, intenção e ciclo para a rota progressiva', () => {
  for (const plan of ['Start', 'Growth', 'Scale']) {
    for (const intent of ['conversation', 'contract']) {
      for (const cycle of ['monthly', 'annual']) {
        const value = buildCommercialUrl({ plan, intent, cycle, serviceKeys: [] });
        const url = new URL(value, 'https://example.test/site/');
        assert.equal(url.pathname, '/site/comecar/');
        assert.equal(url.searchParams.get('plan'), plan);
        assert.equal(url.searchParams.get('intent'), intent);
        assert.equal(url.searchParams.get('cycle'), cycle);
        assert.deepEqual(url.searchParams.getAll('services'), []);
      }
    }
  }
});

test('preserva zero, um ou dois complementos permitidos sem duplicar', () => {
  const none = new URL(buildCommercialUrl({ plan: 'Start', cycle: 'monthly', intent: 'conversation' }), 'https://example.test/');
  const one = new URL(buildCommercialUrl({ plan: 'Start', cycle: 'monthly', intent: 'conversation', serviceKeys: ['traffic'] }), 'https://example.test/');
  const two = new URL(buildCommercialUrl({ plan: 'Start', cycle: 'monthly', intent: 'conversation', serviceKeys: ['traffic', 'landing-page', 'traffic'] }), 'https://example.test/');

  assert.deepEqual(none.searchParams.getAll('services'), []);
  assert.deepEqual(one.searchParams.getAll('services'), ['traffic']);
  assert.deepEqual(two.searchParams.getAll('services'), ['traffic', 'landing-page']);
});

test('carrega somente UTMs permitidos e nunca transporta preço', () => {
  const url = new URL(buildCommercialUrl(
    { plan: 'Growth', cycle: 'annual', intent: 'contract', price: '1', firstCharge: '2' },
    {
      utm_source: 'instagram',
      utm_medium: 'social',
      utm_campaign: 'founder-led',
      utm_content: 'hero',
      utm_term: 'crm',
      price: '0',
      coupon: 'FREE',
    },
  ), 'https://example.test/');

  assert.equal(url.searchParams.get('utm_source'), 'instagram');
  assert.equal(url.searchParams.get('utm_term'), 'crm');
  assert.equal(url.searchParams.has('price'), false);
  assert.equal(url.searchParams.has('firstCharge'), false);
  assert.equal(url.searchParams.has('coupon'), false);
});

test('descarta valores comerciais inválidos isoladamente', () => {
  const url = new URL(buildCommercialUrl({
    plan: 'Enterprise',
    cycle: 'weekly',
    intent: 'buy-now',
    serviceKeys: ['traffic', 'consulting'],
  }), 'https://example.test/');

  assert.equal(url.pathname, '/comecar/');
  assert.deepEqual([...url.searchParams], [['services', 'traffic']]);
});

test('todos os CTAs comerciais públicos saem do formulário legado', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const quickContact = fs.readFileSync(new URL('../assets/quick-contact.js', import.meta.url), 'utf8');
  const planActions = [...html.matchAll(/data-plan-action="(Start|Growth|Scale)" data-intent="(conversation|contract)"/g)];

  assert.equal(planActions.length, 6);
  assert.deepEqual(new Set(planActions.map((match) => `${match[1]}:${match[2]}`)).size, 6);
  assert.match(html, /class="hero-contact-cta"[^>]+data-open-talk/);
  assert.match(html, /class="operation-cta"[^>]+href="\.\/comecar\//);
  assert.match(html, /id="purchase-continue"/);
  assert.match(html, /buildCommercialUrl/);
  assert.match(quickContact, /buildCommercialUrl/);
});


test('formulário da página inicial abre a conversa quando ainda não há plano', () => {
  const quickContact = fs.readFileSync(new URL('../assets/quick-contact.js', import.meta.url), 'utf8');
  assert.match(quickContact, /mode\(window\.oryneoCommercialChoice\?\.intent \|\| 'conversation'\)/);
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /assets\/quick-contact\.js\?v=20261017-1/);
});
