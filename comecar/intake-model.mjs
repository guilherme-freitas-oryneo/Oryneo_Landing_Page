export const STEPS = ['name', 'contact', 'company', 'acquisition', 'priorities', 'review'];

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
const UNPREDICTABLE = 'Ainda não temos um canal previsível';

const unique = (values) => [...new Set(values)];
const digits = (value) => String(value || '').replace(/\D/g, '');
const validEmail = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  const [local, domain, ...extra] = normalized.split('@');
  if (!local || !domain || extra.length || normalized.length > 254 || local.length > 64 || local.includes('..')) return false;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
};
const validBrazilianDdds = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47',
  '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68',
  '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87',
  '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99',
]);
const domainCorrections = new Map([
  ['gmal.com', 'gmail.com'], ['gmial.com', 'gmail.com'], ['gmai.com', 'gmail.com'], ['gmayg.com', 'gmail.com'],
  ['gemau.com', 'gmail.com'], ['gemau', 'gmail.com'], ['gmail.com.br', 'gmail.com'],
  ['hotmai.com', 'hotmail.com'], ['hotmal.com', 'hotmail.com'], ['hotmail.com.br', 'hotmail.com'],
  ['outlok.com', 'outlook.com'], ['outlook.com.br', 'outlook.com'], ['icloud.com.br', 'icloud.com'],
]);
const commonEmailDomains = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'yahoo.com', 'yahoo.com.br',
  'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com', 'uol.com.br', 'bol.com.br',
  'terra.com.br', 'globo.com', 'globomail.com', 'ig.com.br', 'zipmail.com.br', 'aol.com',
  'fastmail.com', 'zoho.com', 'mail.com', 'ymail.com',
];
const providerFamilies = [
  { brand: 'gmail', canonical: 'gmail.com' },
  { brand: 'hotmail', canonical: 'hotmail.com' },
  { brand: 'outlook', canonical: 'outlook.com' },
  { brand: 'icloud', canonical: 'icloud.com' },
  { brand: 'protonmail', canonical: 'protonmail.com' },
  { brand: 'yahoo', canonical: 'yahoo.com', brazil: 'yahoo.com.br' },
  { brand: 'uol', canonical: 'uol.com.br' },
  { brand: 'bol', canonical: 'bol.com.br' },
  { brand: 'terra', canonical: 'terra.com.br' },
  { brand: 'globo', canonical: 'globo.com' },
];

function validName(value) {
  const normalized = String(value || '').trim();
  return normalized.length >= 2
    && /^\p{L}[\p{L}\p{M}'’ -]*$/u.test(normalized)
    && (normalized.match(/\p{L}/gu) || []).length >= 2;
}

function emailSuggestion(value) {
  const domain = String(value || '').trim().toLowerCase().split('@')[1] || '';
  const direct = domainCorrections.get(domain);
  if (direct) return direct;
  if (!domain || commonEmailDomains.includes(domain)) return '';
  const providerLabel = domain.split('.')[0];
  for (const provider of providerFamilies) {
    if (damerauLevenshtein(providerLabel, provider.brand) <= 2) {
      return provider.brazil && domain.endsWith('.br') ? provider.brazil : provider.canonical;
    }
  }
  const suffixCorrections = [
    [/\.con$/, '.com'], [/\.cim$/, '.com'], [/\.vom$/, '.com'], [/\.comm$/, '.com'],
    [/\.combr$/, '.com.br'], [/\.com\.b$/, '.com.br'], [/\.com\.r$/, '.com.br'],
    [/\.cpm\.br$/, '.com.br'], [/\.con\.br$/, '.com.br'], [/\.co\.br$/, '.com.br'],
  ];
  for (const [pattern, replacement] of suffixCorrections) {
    if (pattern.test(domain)) return domain.replace(pattern, replacement);
  }
  let best = '';
  let bestDistance = 3;
  for (const candidate of commonEmailDomains) {
    const distance = damerauLevenshtein(domain, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return bestDistance <= 2 ? best : '';
}

function damerauLevenshtein(left, right) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) => [row]);
  for (let column = 0; column <= right.length; column += 1) matrix[0][column] = column;
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        matrix[row][column] = Math.min(matrix[row][column], matrix[row - 2][column - 2] + cost);
      }
    }
  }
  return matrix[left.length][right.length];
}

function validBrazilianPhone(value) {
  const normalized = digits(value);
  const subscriber = normalized.slice(3);
  return normalized.length === 11
    && validBrazilianDdds.has(normalized.slice(0, 2))
    && normalized[2] === '9'
    && !/^(\d)\1+$/.test(normalized)
    && !/^(\d)\1{7}$/.test(subscriber);
}

export function formatBrazilianPhone(value) {
  const normalized = digits(value).slice(0, 11);
  if (!normalized) return '';
  if (normalized.length < 3) return `(${normalized}`;
  if (normalized.length < 8) return `(${normalized.slice(0, 2)}) ${normalized.slice(2)}`;
  return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}${normalized.length > 7 ? `-${normalized.slice(7)}` : ''}`;
}

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
  const plan = PLANS.includes(planParam) ? planParam : '';
  const cycle = plan && CYCLES.includes(cycleParam) ? cycleParam : (plan ? 'monthly' : '');
  const intent = plan && intentParam === 'contract' ? 'contract' : 'conversation';
  return {
    commercial: {
      plan,
      cycle,
      services: plan ? unique(rawServices.filter((value) => SERVICES.includes(value))) : [],
      intent,
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
  if (step === 'name' && !validName(state.contact?.name)) errors.name = 'Informe um nome válido.';
  if (step === 'contact') {
    const suggestion = emailSuggestion(state.contact?.email);
    if (suggestion) errors.email = `Confira o domínio do e-mail. Você quis dizer ${suggestion}?`;
    else if (!validEmail(state.contact?.email)) errors.email = 'Informe um e-mail válido.';
    if (!validBrazilianPhone(state.contact?.phone)) errors.phone = 'Informe um WhatsApp brasileiro válido.';
  }
  if (step === 'company') {
    const companyName = String(state.company?.name || '').trim();
    if (companyName.length < 2 || !/[\p{L}\p{N}]/u.test(companyName)) errors.name = 'Informe o nome da empresa.';
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
  if (step === 'review' && state.commercial?.intent === 'contract' && !PLANS.includes(state.commercial?.plan)) {
    errors.commercial = 'Confira a configuração escolhida.';
  }
  if (step === 'review' && state.contact?.consent !== true) errors.consent = 'Autorize o contato para enviar.';
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
