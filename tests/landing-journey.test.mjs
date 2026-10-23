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

test('os três botões contratar continuam ligados à seleção de plano', () => {
  for (const plan of ['Start', 'Growth', 'Scale']) {
    assert.match(home, new RegExp(`<button class="plan-cta"[^>]*data-plan-action="${plan}"[^>]*data-intent="contract"`));
  }
});

test('a jornada de conversa usa a marca oficial e explicita que não cobra', () => {
  assert.match(lead, /oryneo-wordmark-mono-reverse\.png/);
  assert.match(lead, /oryneo-symbol-official\.svg/);
  assert.match(lead, /class="header-plans" href="\.\.\/#planos"/);
  assert.match(lead, /sem cobrança/i);
  assert.match(lead, /Nenhuma cobrança acontece nesta página/);
});
