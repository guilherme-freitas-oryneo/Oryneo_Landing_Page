import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const lead = readFileSync(new URL('../comecar/index.html', import.meta.url), 'utf8');

test('primeira dobra identifica o CRM e mantém conversa como ação principal', () => {
  const hero = home.match(/<section class="intro"[\s\S]*?<\/section>/)?.[0] || '';
  const title = hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  assert.match(title, /CRM|WhatsApp/i);
  assert.match(hero, /class="hero-contact-cta"[^>]*href="\.\/comecar\/\?cycle=monthly&amp;intent=conversation"/);
  assert.match(home, /class="nav-talk"[^>]*href="\.\/comecar\/\?cycle=monthly&amp;intent=conversation"/);
});

test('landing apresenta oferta curta e o CRM em notebook e celular sem legenda intrusiva', () => {
  const visibleSections = [...home.matchAll(/<section class="(intro|value|plans|buying-guide|closing)"/g)].map((match) => match[1]);
  assert.deepEqual(visibleSections, ['intro', 'value', 'plans', 'buying-guide', 'closing']);
  assert.doesNotMatch(home, /class="hero-demo"|class="browser-figure"|class="laptop-scene"/);
  assert.doesNotMatch(home, /class="acquisition-tab"|class="operation-tab"/);
  assert.doesNotMatch(home, /class="consultation"|id="quick-form"|id="cnpj-form"/);
  assert.match(home, /<figure class="product-scene"/);
  assert.match(home, /crm-capture-desktop-sanitized\.png/);
  assert.match(home, /crm-capture-mobile-sanitized\.png/);
  assert.match(home, /<aside class="crm-future-menu">/);
  assert.match(home, /EM EVOLUÇÃO/);
  assert.doesNotMatch(home, /Interface ilustrativa com dados fictícios/);
  assert.match(home, /class="device-laptop"/);
  assert.match(home, /class="device-phone"/);
  assert.match(home, /id="solucoes"/);
  assert.match(home, /class="closing-cta"[^>]*href="\.\/comecar\/\?cycle=monthly&amp;intent=conversation"/);
});

test('os três botões contratar continuam ligados à seleção de plano', () => {
  for (const plan of ['Start', 'Growth', 'Scale']) {
    assert.match(home, new RegExp(`<button class="plan-cta"[^>]*data-plan-action="${plan}"[^>]*data-intent="contract"`));
  }
});

test('comparação rápida mostra capacidade sem perder o detalhamento', () => {
  const visibleCapacity = { Start: ['5 usuários', '1.500', '300 min'], Growth: ['10 usuários', '5.000', '700 min'], Scale: ['20 usuários', '10.000', '1.200 min'] };
  for (const [plan, values] of Object.entries(visibleCapacity)) {
    const card = home.match(new RegExp(`<article class="plan-option" data-plan="${plan}"[\\s\\S]*?<\\/article>`))?.[0] || '';
    const quickList = card.match(/<ul class="plan-features">([\s\S]*?)<\/ul>/)?.[1] || '';
    assert.equal((quickList.match(/<li>/g) || []).length, 3, `${plan}: três dados decisivos`);
    values.forEach((value) => assert.ok(quickList.includes(value), `${plan}: ${value}`));
    assert.match(card, /<details class="plan-inclusions">/);
  }
});

test('a jornada de conversa usa a marca oficial e explicita que não cobra', () => {
  assert.match(lead, /oryneo-wordmark-mono-reverse\.png/);
  assert.match(lead, /oryneo-symbol-official\.svg/);
  assert.match(lead, /class="header-plans" href="\.\.\/#planos"/);
  assert.match(lead, /sem cobrança/i);
  assert.match(lead, /Nenhuma cobrança acontece nesta página/);
});
