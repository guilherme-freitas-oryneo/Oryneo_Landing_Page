import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STEPS,
  buildIntakePayload,
  captureAttribution,
  formatBrazilianPhone,
  nextVisibleStep,
  parseEntryParams,
  validateStep,
} from '../comecar/intake-model.mjs';

const state = {
  contact: { name: 'Marina Costa', email: 'marina@exemplo.com', phone: '(11) 99999-0000', consent: true },
  company: { name: 'Acme' },
  acquisition: { channels: ['Indicações e parcerias'], primary: 'Indicações e parcerias' },
  priorities: { goals: ['Organizar contatos e negociações no CRM'], primary: 'Organizar contatos e negociações no CRM' },
  commercial: { intent: 'conversation', plan: 'Growth', cycle: 'monthly', services: ['landing-page'] },
  teamSize: '2 a 5 pessoas',
};

test('mantém sete etapas lógicas em ordem previsível', () => {
  assert.deepEqual(STEPS, ['name', 'contact', 'company', 'acquisition', 'priorities', 'commercial', 'review']);
  assert.equal(nextVisibleStep('name', state), 'contact');
  assert.equal(nextVisibleStep('contact', state), 'company');
  assert.equal(nextVisibleStep('commercial', state), 'review');
  assert.equal(nextVisibleStep('review', state), null);
});

test('valida nome, contato brasileiro e consentimento somente na revisão', () => {
  assert.equal(validateStep('name', state).valid, true);
  assert.equal(validateStep('name', { ...state, contact: { ...state.contact, name: '1' } }).errors.name, 'Informe um nome válido.');
  assert.equal(validateStep('contact', state).valid, true);
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: '' } }).errors.email, 'Informe um e-mail válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@empresa..com' } }).errors.email, 'Informe um e-mail válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gmayg.com' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gemau.com' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gemau' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gmaul.com' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gmail.con' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@gmail.com.br' } }).errors.email, 'Confira o domínio do e-mail. Você quis dizer gmail.com?');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'teste@yahoo.com.br' } }).valid, true);
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, email: 'contato@oryneo.com.br' } }).valid, true);
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, phone: '(00) 99999-9999' } }).errors.phone, 'Informe um WhatsApp brasileiro válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, phone: '(11) 88888-8888' } }).errors.phone, 'Informe um WhatsApp brasileiro válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, phone: '(21) 90000-0000' } }).errors.phone, 'Informe um WhatsApp brasileiro válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, phone: '(21) 91111-1111' } }).errors.phone, 'Informe um WhatsApp brasileiro válido.');
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, phone: '(21) 98765-4321' } }).valid, true);
  assert.equal(validateStep('contact', { ...state, contact: { ...state.contact, consent: false } }).valid, true);
  assert.equal(validateStep('review', { ...state, contact: { ...state.contact, consent: false } }).errors.consent, 'Autorize o contato para enviar.');
});

test('formata WhatsApp brasileiro sem aceitar dígitos excedentes', () => {
  assert.equal(formatBrazilianPhone('21999999999'), '(21) 99999-9999');
  assert.equal(formatBrazilianPhone('21999999999123'), '(21) 99999-9999');
  assert.equal(formatBrazilianPhone('21'), '(21');
});

test('valida empresa e equipe sem solicitar CNPJ', () => {
  assert.equal(validateStep('company', state).valid, true);
  const contract = { ...state, commercial: { ...state.commercial, intent: 'contract' } };
  assert.equal(validateStep('company', contract).valid, true);
  assert.equal(validateStep('company', { ...state, company: { name: '--' } }).errors.name, 'Informe o nome da empresa.');
  assert.equal(validateStep('company', { ...state, teamSize: '' }).errors.teamSize, 'Selecione o tamanho da operação comercial.');
});

test('aplica exclusividade e prioridade aos canais', () => {
  const exclusive = { ...state, acquisition: { channels: ['Ainda não temos um canal previsível', 'Google'], primary: 'Google' } };
  assert.equal(validateStep('acquisition', exclusive).valid, false);
  const multiple = { ...state, acquisition: { channels: ['Google', 'Indicações e parcerias'], primary: '' } };
  assert.equal(validateStep('acquisition', multiple).errors.primary, 'Indique o canal principal.');
  const single = { ...state, acquisition: { channels: ['Google'], primary: '' } };
  assert.equal(validateStep('acquisition', single).valid, true);
});

test('exige objetivo principal somente quando há múltiplas prioridades', () => {
  const multiple = { ...state, priorities: { goals: ['Organizar contatos e negociações no CRM', 'Acompanhar resultados e gestão'], primary: '' } };
  assert.equal(validateStep('priorities', multiple).errors.primary, 'Indique a prioridade principal.');
  const selected = { ...multiple, priorities: { ...multiple.priorities, primary: 'Acompanhar resultados e gestão' } };
  assert.equal(validateStep('priorities', selected).valid, true);
});

test('aceita somente parâmetros comerciais permitidos e nunca lê preço', () => {
  const valid = parseEntryParams(new URL('https://oryneo.com.br/comecar/?plan=Scale&cycle=annual&services=landing-page,traffic&intent=contract&utm_source=google&price=1&total=1'));
  assert.deepEqual(valid.commercial, { plan: 'Scale', cycle: 'annual', services: ['landing-page', 'traffic'], intent: 'contract' });
  assert.equal(valid.attribution.utm_source, 'google');
  assert.equal('price' in valid.commercial, false);
  const invalid = parseEntryParams(new URL('https://oryneo.com.br/comecar/?plan=Enterprise&cycle=weekly&services=root,traffic&intent=buy'));
  assert.deepEqual(invalid.commercial, { plan: '', cycle: 'monthly', services: ['traffic'], intent: 'conversation' });
});

test('captura somente atribuição permitida e limita valores', () => {
  const result = captureAttribution(
    new URL(`https://oryneo.com.br/comecar/?utm_campaign=${'x'.repeat(200)}&utm_medium=cpc`),
    'https://google.com/',
  );
  assert.equal(result.utm_campaign.length, 160);
  assert.equal(result.utm_medium, 'cpc');
  assert.equal(result.referrer, 'https://google.com/');
  assert.equal(result.entry_url.startsWith('https://oryneo.com.br/comecar/'), true);
});

test('monta payload novo compatível com o campo legado', () => {
  const payload = buildIntakePayload(
    {
      ...state,
      acquisition: { channels: ['Indicações e parcerias', 'Instagram e Facebook', 'Indicações e parcerias'], primary: 'Indicações e parcerias' },
      priorities: { goals: ['Organizar contatos e negociações no CRM', 'Acompanhar resultados e gestão'], primary: 'Acompanhar resultados e gestão' },
    },
    { utm_source: 'google', referrer: 'https://google.com/', entry_url: 'https://oryneo.com.br/comecar/' },
    '11111111-1111-4111-8111-111111111111',
  );
  assert.deepEqual(payload.acquisition_channels, ['Indicações e parcerias', 'Instagram e Facebook']);
  assert.equal(payload.acquisition_channel, 'Indicações e parcerias');
  assert.equal(payload.primary_goal, 'Acompanhar resultados e gestão');
  assert.equal(payload.request_id, '11111111-1111-4111-8111-111111111111');
  assert.equal(payload.value_cents, undefined);
  assert.equal(payload.cnpj, undefined);
});
