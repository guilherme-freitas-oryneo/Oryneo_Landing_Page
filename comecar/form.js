import {
  STEPS,
  buildIntakePayload,
  captureAttribution,
  formatBrazilianPhone,
  nextVisibleStep,
  parseEntryParams,
  validateStep,
} from './intake-model.mjs';

const STORAGE_KEY = 'oryneo_progressive_intake_v2';
const form = document.querySelector('#intake-form');
const steps = [...document.querySelectorAll('[data-step]')];
const status = document.querySelector('#form-status');
const progress = document.querySelector('.progress-track');
const progressFill = document.querySelector('#progress-fill');
const progressLabel = document.querySelector('#progress-label');
const progressName = document.querySelector('#progress-name');
const reviewList = document.querySelector('[data-review-list]');
const successPanel = document.querySelector('[data-success]');
const entry = parseEntryParams(new URL(window.location.href));
const attribution = captureAttribution(new URL(window.location.href), document.referrer);

const stepNames = {
  name: 'Você',
  contact: 'Contato',
  company: 'Empresa',
  acquisition: 'Aquisição',
  priorities: 'Prioridades',
  commercial: 'Configuração',
  review: 'Revisão',
};

const initialState = {
  contact: { name: '', email: '', phone: '', consent: false },
  company: { name: '' },
  acquisition: { channels: [], primary: '' },
  priorities: { goals: [], primary: '' },
  commercial: entry.commercial,
  teamSize: '',
};

function restoredState() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return initialState;
    return {
      ...initialState,
      ...saved,
      contact: { ...initialState.contact, ...saved.contact },
      company: { ...initialState.company, ...saved.company },
      acquisition: { ...initialState.acquisition, ...saved.acquisition },
      priorities: { ...initialState.priorities, ...saved.priorities },
      commercial: { ...initialState.commercial, ...saved.commercial },
    };
  } catch {
    return initialState;
  }
}

let state = restoredState();
let activeStep = 'contact';

function persist() {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* sessão indisponível */ }
}

function values(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map((input) => input.value);
}

function checked(name) {
  return form.querySelector(`[name="${name}"]:checked`)?.value || '';
}

function setValue(name, value) {
  const control = form.elements.namedItem(name);
  if (control && 'value' in control) control.value = value || '';
}

function setChecked(name, selected) {
  for (const input of form.querySelectorAll(`[name="${name}"]`)) input.checked = selected.includes(input.value);
}

function syncControls() {
  setValue('contact_name', state.contact.name);
  setValue('contact_email', state.contact.email);
  setValue('contact_phone', state.contact.phone);
  form.elements.namedItem('consent').checked = state.contact.consent;
  setValue('company_name', state.company.name);
  setValue('team_size', state.teamSize);
  setChecked('acquisition_channels', state.acquisition.channels);
  setChecked('goals', state.priorities.goals);
  setChecked('intent', [state.commercial.intent]);
  setChecked('plan', [state.commercial.plan]);
  setChecked('cycle', [state.commercial.cycle]);
  setChecked('services', state.commercial.services);
  renderPrimary('acquisition');
  renderPrimary('priorities');
}

function readStep(step) {
  switch (step) {
    case 'name':
      state.contact.name = form.elements.namedItem('contact_name').value.trim();
      break;
    case 'contact':
      state.contact.email = form.elements.namedItem('contact_email').value.trim();
      state.contact.phone = form.elements.namedItem('contact_phone').value.trim();
      break;
    case 'company':
      state.company = {
        name: form.elements.namedItem('company_name').value.trim(),
      };
      state.teamSize = form.elements.namedItem('team_size').value;
      break;
    case 'acquisition':
      state.acquisition = { channels: values('acquisition_channels'), primary: checked('acquisition_primary') };
      if (state.acquisition.channels.length === 1) state.acquisition.primary = state.acquisition.channels[0];
      break;
    case 'priorities':
      state.priorities = { goals: values('goals'), primary: checked('goal_primary') };
      if (state.priorities.goals.length === 1) state.priorities.primary = state.priorities.goals[0];
      break;
    case 'commercial':
      state.commercial = { intent: checked('intent'), plan: checked('plan'), cycle: checked('cycle'), services: values('services') };
      break;
    case 'review':
      state.contact.consent = form.elements.namedItem('consent').checked;
      persist();
      return;
  }
  persist();
}

function clearErrors(section) {
  for (const error of section.querySelectorAll('[data-error]')) error.textContent = '';
  for (const control of section.querySelectorAll('[aria-invalid="true"]')) control.removeAttribute('aria-invalid');
}

function showErrors(step, errors) {
  const section = steps.find((item) => item.dataset.step === step);
  clearErrors(section);
  for (const [key, message] of Object.entries(errors)) {
    const target = section.querySelector(`[data-error="${key}"]`);
    if (target) target.textContent = message;
    const named = {
      name: step === 'name' ? 'contact_name' : 'company_name',
      email: 'contact_email',
      phone: 'contact_phone',
      consent: 'consent',
      teamSize: 'team_size',
      channels: 'acquisition_channels',
      goals: 'goals',
      intent: 'intent',
      plan: 'plan',
      cycle: 'cycle',
      services: 'services',
      primary: step === 'acquisition' ? 'acquisition_primary' : 'goal_primary',
    }[key];
    const control = named ? section.querySelector(`[name="${named}"]`) : null;
    if (control) control.setAttribute('aria-invalid', 'true');
  }
  const first = section.querySelector('[aria-invalid="true"]');
  if (first) first.focus();
  status.textContent = 'Confira os campos indicados antes de continuar.';
}

function renderPrimary(kind) {
  const isAcquisition = kind === 'acquisition';
  const selected = isAcquisition ? values('acquisition_channels') : values('goals');
  const wrapper = document.querySelector(isAcquisition ? '[data-acquisition-primary]' : '[data-goal-primary]');
  const list = document.querySelector(isAcquisition ? '[data-acquisition-primary-options]' : '[data-goal-primary-options]');
  const name = isAcquisition ? 'acquisition_primary' : 'goal_primary';
  const saved = isAcquisition ? state.acquisition.primary : state.priorities.primary;
  list.replaceChildren();
  wrapper.hidden = selected.length < 2;
  if (selected.length < 2) return;
  for (const value of selected) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = value;
    input.checked = saved === value;
    label.append(input, document.createTextNode(value));
    list.append(label);
  }
}

function reviewRow(label, value, targetStep) {
  const row = document.createElement('div');
  row.className = 'review-row';
  const small = document.createElement('small');
  small.textContent = label;
  const strong = document.createElement('strong');
  strong.textContent = value || 'Não informado';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Editar';
  button.addEventListener('click', () => goTo(targetStep));
  row.append(small, strong, button);
  return row;
}

function renderReview() {
  const serviceLabels = { 'landing-page': 'Landing page de conversão', traffic: 'Gestão de tráfego pago' };
  const cycle = state.commercial.cycle === 'annual' ? 'Anual' : 'Mensal';
  const intent = state.commercial.intent === 'contract' ? 'Quero contratar' : 'Quero conversar';
  reviewList.replaceChildren(
    reviewRow('Você', state.contact.name, 'name'),
    reviewRow('Contato', `${state.contact.email} · ${state.contact.phone}`, 'contact'),
    reviewRow('Empresa', `${state.company.name} · ${state.teamSize}`, 'company'),
    reviewRow('Aquisição', `${state.acquisition.primary} · ${state.acquisition.channels.join(', ')}`, 'acquisition'),
    reviewRow('Prioridade', `${state.priorities.primary} · ${state.priorities.goals.join(', ')}`, 'priorities'),
    reviewRow('Configuração', `${intent} · ${state.commercial.plan} · ${cycle}${state.commercial.services.length ? ` · ${state.commercial.services.map((key) => serviceLabels[key]).join(' + ')}` : ''}`, 'commercial'),
  );
}

function goTo(step) {
  activeStep = step;
  const index = STEPS.indexOf(step);
  for (const section of steps) section.hidden = section.dataset.step !== step;
  progressLabel.textContent = `Etapa ${index + 1} de ${STEPS.length}`;
  progressName.textContent = stepNames[step];
  progress.setAttribute('aria-valuenow', String(index + 1));
  progressFill.style.width = `${((index + 1) / STEPS.length) * 100}%`;
  if (step === 'review') renderReview();
  const title = steps[index].querySelector('.step-title');
  title.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  status.textContent = `${stepNames[step]}, etapa ${index + 1} de ${STEPS.length}.`;
}

function firstInvalidStep() {
  for (const step of STEPS) {
    const result = validateStep(step, state);
    if (!result.valid) return { step, errors: result.errors };
  }
  return null;
}

function submitRequest() {
  const invalid = firstInvalidStep();
  if (invalid) {
    goTo(invalid.step);
    showErrors(invalid.step, invalid.errors);
    return;
  }
  const requestId = crypto.randomUUID();
  const payload = buildIntakePayload(state, attribution, requestId);
  const button = document.querySelector('#send-request');
  const feedback = document.querySelector('#request-feedback');
  if (!window.OryneoLeadIntake?.send) {
    feedback.textContent = 'O envio está indisponível neste momento. Seus dados foram mantidos.';
    return;
  }
  window.OryneoLeadIntake.send(payload, button, feedback);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  readStep(activeStep);
  if (activeStep === 'review') {
    submitRequest();
    return;
  }
  const result = validateStep(activeStep, state);
  if (!result.valid) {
    showErrors(activeStep, result.errors);
    return;
  }
  clearErrors(steps.find((item) => item.dataset.step === activeStep));
  goTo(nextVisibleStep(activeStep, state));
});

for (const button of document.querySelectorAll('[data-back]')) {
  button.addEventListener('click', () => {
    readStep(activeStep);
    const index = STEPS.indexOf(activeStep);
    if (index > 0) goTo(STEPS[index - 1]);
  });
}

form.addEventListener('change', (event) => {
  if (event.target.name === 'acquisition_channels') {
    const unpredictable = form.querySelector('[name="acquisition_channels"][value="Ainda não temos um canal previsível"]');
    if (event.target === unpredictable && event.target.checked) {
      for (const input of form.querySelectorAll('[name="acquisition_channels"]')) if (input !== unpredictable) input.checked = false;
    } else if (event.target.checked) {
      unpredictable.checked = false;
    }
    readStep('acquisition');
    renderPrimary('acquisition');
  }
  if (event.target.name === 'goals') {
    readStep('priorities');
    renderPrimary('priorities');
  }
  if (event.target.name === 'acquisition_primary') state.acquisition.primary = event.target.value;
  if (event.target.name === 'goal_primary') state.priorities.primary = event.target.value;
  persist();
});

form.elements.namedItem('contact_phone').addEventListener('input', (event) => {
  event.target.value = formatBrazilianPhone(event.target.value);
});

window.addEventListener('oryneo:webhook-accepted', () => {
  sessionStorage.removeItem(STORAGE_KEY);
  form.hidden = true;
  document.querySelector('.progress-meta').hidden = true;
  progress.hidden = true;
  successPanel.hidden = false;
  successPanel.focus({ preventScroll: true });
});

syncControls();
goTo('contact');
