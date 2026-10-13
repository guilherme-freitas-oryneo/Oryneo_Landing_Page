export const STEPS = ['contact', 'company', 'acquisition', 'priorities', 'commercial', 'review'];

export const ACQUISITION_CHANNELS = [
  'Indicações e parcerias',
  'Instagram e Facebook',
  'Google',
  'Prospecção ativa',
  'Portais e marketplaces',
  'Loja física e eventos',
  'Ainda não temos um canal previsível',
  'Outro canal',
];

export const GOALS = [
  'Atrair contatos com páginas e anúncios',
  'Organizar contatos e negociações no CRM',
  'Organizar retornos pelo WhatsApp',
  'Acompanhar resultados e gestão',
];

export const TEAM_SIZES = ['Somente eu', '2 a 5 pessoas', '6 a 10 pessoas', '11 a 20 pessoas', 'Mais de 20 pessoas'];

const PLANS = ['Start', 'Growth', 'Scale'];
const CYCLES = ['monthly', 'annual'];
const SERVICES = ['landing-page', 'traffic'];
const INTENTS = ['conversation', 'contract'];
const UNPREDICTABLE = 'Ainda não temos um canal previsível';

const unique = (values) => [...new Set(values)];
const digits = (value) => String(value || '').replace(/\D/g, '');
const cnpj = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

/** @param {string} value @param {number} max */
function safeValue(value, max) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
}

/** @param {URL} url @param {string} [referrer] */
export function captureAttribution(url, referrer = '') {
  const result = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = safeValue(url.searchParams.get(key), 160);
    if (value) result[key] = value;
  }
  const safeReferrer = safeValue(referrer, 500);
  if (safeReferrer) result.referrer = safeReferrer;
  result.entry_url = safeValue(url.href, 500);
  return result;
}

/** @param {URL} url */
export function parseEntryParams(url) {
  const planParam = url.searchParams.get('plan') || '';
  const cycleParam = url.searchParams.get('cycle') || '';
  const intentParam = url.searchParams.get('intent') || '';
  const rawServices = url.searchParams.getAll('services').flatMap((value) => value.split(','));
  return {
    commercial: {
      plan: PLANS.includes(planParam) ? planParam : '',
      cycle: CYCLES.includes(cycleParam) ? cycleParam : 'monthly',
      services: unique(rawServices.filter((value) => SERVICES.includes(value))),
      intent: INTENTS.includes(intentParam) ? intentParam : 'conversation',
    },
    attribution: captureAttribution(url),
  };
}

/** @param {string} current */
export function nextVisibleStep(current, _state) {
  const index = STEPS.indexOf(current);
  return index >= 0 && index < STEPS.length - 1 ? STEPS[index + 1] : null;
}

/** @param {string} step @param {Record<string, any>} state */
export function validateStep(step, state) {
  const errors = {};
  if (step === 'contact') {
    if (String(state.contact?.name || '').trim().length < 2) errors.name = 'Informe seu nome.';
    if (!validEmail(state.contact?.email)) errors.email = 'Informe um e-mail válido.';
    const phoneLength = digits(state.contact?.phone).length;
    if (phoneLength < 10 || phoneLength > 13) errors.phone = 'Informe um WhatsApp com DDD.';
    if (state.contact?.consent !== true) errors.consent = 'Autorize o contato para continuar.';
  }
  if (step === 'company') {
    if (String(state.company?.name || '').trim().length < 2) errors.name = 'Informe o nome da empresa.';
    if (state.commercial?.intent === 'contract' && cnpj(state.company?.cnpj).length !== 14) errors.cnpj = 'Informe um CNPJ válido para contratar.';
    if (state.company?.cnpj && cnpj(state.company.cnpj).length !== 14) errors.cnpj = 'Confira o CNPJ informado.';
    if (!TEAM_SIZES.includes(state.teamSize)) errors.teamSize = 'Selecione o tamanho da operação comercial.';
  }
  if (step === 'acquisition') {
    const channels = unique((state.acquisition?.channels || []).filter((value) => ACQUISITION_CHANNELS.includes(value)));
    if (!channels.length) errors.channels = 'Selecione ao menos um canal.';
    if (channels.includes(UNPREDICTABLE) && channels.length > 1) errors.channels = 'A opção sem canal previsível deve ser selecionada sozinha.';
    const primary = channels.length === 1 ? channels[0] : state.acquisition?.primary;
    if (channels.length > 1 && !primary) errors.primary = 'Indique o canal principal.';
    else if (primary && !channels.includes(primary)) errors.primary = 'Escolha como principal um canal selecionado.';
  }
  if (step === 'priorities') {
    const selected = unique((state.priorities?.goals || []).filter((value) => GOALS.includes(value)));
    if (!selected.length) errors.goals = 'Selecione ao menos uma prioridade.';
    const primary = selected.length === 1 ? selected[0] : state.priorities?.primary;
    if (selected.length > 1 && !primary) errors.primary = 'Indique a prioridade principal.';
    else if (primary && !selected.includes(primary)) errors.primary = 'Escolha como principal uma prioridade selecionada.';
  }
  if (step === 'commercial') {
    if (!INTENTS.includes(state.commercial?.intent)) errors.intent = 'Selecione como deseja avançar.';
    if (!PLANS.includes(state.commercial?.plan)) errors.plan = 'Selecione um plano.';
    if (!CYCLES.includes(state.commercial?.cycle)) errors.cycle = 'Selecione um ciclo.';
    if ((state.commercial?.services || []).some((value) => !SERVICES.includes(value))) errors.services = 'Confira os complementos selecionados.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** @param {Record<string, any>} state @param {Record<string, string>} attribution @param {string} requestId */
export function buildIntakePayload(state, attribution, requestId) {
  const channels = unique(state.acquisition.channels);
  const goals = unique(state.priorities.goals);
  const primaryChannel = channels.length === 1 ? channels[0] : state.acquisition.primary;
  const primaryGoal = goals.length === 1 ? goals[0] : state.priorities.primary;
  return {
    request_id: requestId,
    contact: state.contact.name.trim(),
    email: state.contact.email.trim().toLowerCase(),
    phone: state.contact.phone.trim(),
    consent: state.contact.consent === true,
    company: state.company.name.trim(),
    cnpj: cnpj(state.company.cnpj),
    intent: state.commercial.intent,
    plan: state.commercial.plan,
    cycle: state.commercial.cycle,
    services: unique(state.commercial.services),
    team_size: state.teamSize,
    acquisition_channel: primaryChannel,
    acquisition_channels: channels,
    primary_acquisition_channel: primaryChannel,
    goals,
    primary_goal: primaryGoal,
    attribution,
    summary: `Solicitação de ${state.contact.name.trim()} para ${state.company.name.trim()}.`,
  };
}
