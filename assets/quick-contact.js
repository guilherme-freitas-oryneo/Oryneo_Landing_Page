(() => {
  const $ = id => document.getElementById(id);
  const form = $('quick-form');
  let requestText = '';
  const ddds = new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
  function context() {
    const choice = window.oryneoCommercialChoice;
    $('quick-context').textContent = choice.plan ? 'Interesse no plano ' + choice.plan + ' · ' + (choice.cycle === 'annual' ? 'anual' : 'mensal') : 'Ainda não precisa escolher um plano.';
    if (!$('quick-review').hidden) renderSummary();
  }
  function mode(intent) {
    const quick = intent === 'conversation';
    $('quick-panel').hidden = !quick;
    $('detailed-panel').hidden = quick;
    $('consultation-title').textContent = quick ? 'Vamos entender o que você precisa.' : 'Conte um pouco sobre a sua operação.';
    $('consultation-description').textContent = quick ? 'Deixe seu contato e diga o que quer melhorar. Você confere tudo antes de enviar.' : 'Identifique sua empresa e confira os dados antes de enviar a solicitação.';
    context();
  }
  window.addEventListener('oryneo-form-mode', event => mode(event.detail));
  window.addEventListener('oryneo-choice-changed', context);
  document.querySelectorAll('[data-open-talk]').forEach(button => button.addEventListener('click', () => {
    window.oryneoCommercialChoice.intent = 'conversation';
    mode('conversation');
    $('solicitacao').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    ($('quick-review').hidden ? $('quick-name') : $('quick-review').querySelector('h3')).focus({preventScroll:true});
  }));
  function error(id, message) {
    $(id + '-error').textContent = message;
    $(id).setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits ? '(' + digits : '';
    const subscriber = digits.slice(2);
    return '(' + digits.slice(0, 2) + ') ' + subscriber.slice(0, 5) + (subscriber.length > 5 ? '-' + subscriber.slice(5) : '');
  }
  function validPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length === 11 && ddds.has(digits.slice(0, 2)) && digits[2] === '9' && !/^(\d)\1{8}$/.test(digits.slice(2));
  }
  function validEmail(value) {
    const email = value.trim();
    return !email || (/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) && !$('quick-email').validity.typeMismatch);
  }
  const emailDomainTypos = {
    'gmayl.com': 'gmail.com', 'gmyal.com': 'gmail.com', 'gmaill.com': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotamil.com': 'hotmail.com',
    'outllook.com': 'outlook.com', 'yahoi.com': 'yahoo.com', 'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com', 'yaoo.com': 'yahoo.com', 'yahoo.combr': 'yahoo.com.br',
    'yahoo.con.br': 'yahoo.com.br', 'iclod.com': 'icloud.com', 'icluod.com': 'icloud.com',
    'protton.me': 'proton.me', 'protonmai.com': 'protonmail.com'
  };
  let suggestedQuickEmail = '';
  let quickEmailAcknowledged = false;
  function hideQuickEmailSuggestion() {
    $('quick-email-suggestion').hidden = true;
    suggestedQuickEmail = '';
  }
  function checkQuickEmail() {
    const value = $('quick-email').value.trim();
    hideQuickEmailSuggestion();
    if (!validEmail(value)) return error('quick-email', 'Confira o e-mail. Exemplo: voce@empresa.com.br');
    error('quick-email', '');
    if (!value) return true;
    const [local, domain] = value.split('@');
    const correction = emailDomainTypos[domain.toLowerCase()];
    if (correction && !quickEmailAcknowledged) {
      suggestedQuickEmail = local + '@' + correction;
      $('quick-email-suggestion-text').textContent = 'Esse domínio pode ter um erro de digitação. Você quis dizer ' + suggestedQuickEmail + '?';
      $('quick-email-suggestion').hidden = false;
      return false;
    }
    return true;
  }
  ['quick-name','quick-need'].forEach(id => $(id).addEventListener('input', () => error(id, '')));
  $('quick-phone').addEventListener('input', () => {
    const input = $('quick-phone');
    input.value = formatPhone(input.value);
    error('quick-phone', '');
  });
  $('quick-email').addEventListener('input', () => {
    hideQuickEmailSuggestion();
    quickEmailAcknowledged = false;
    error('quick-email', '');
  });
  $('quick-email').addEventListener('blur', checkQuickEmail);
  $('quick-email-correct').addEventListener('click', () => {
    if (!suggestedQuickEmail) return;
    $('quick-email').value = suggestedQuickEmail;
    hideQuickEmailSuggestion();
    error('quick-email', '');
    $('quick-email').focus();
  });
  $('quick-email-keep').addEventListener('click', () => {
    quickEmailAcknowledged = true;
    hideQuickEmailSuggestion();
    $('quick-email').focus();
  });
  $('quick-consent').addEventListener('change', () => { $('quick-feedback').textContent = ''; $('quick-consent').removeAttribute('aria-invalid'); });
  function renderSummary() {
    const rows = [['Nome', $('quick-name').value.trim()], ['WhatsApp', $('quick-phone').value.trim()]];
    const email = $('quick-email').value.trim();
    const need = $('quick-need').value.trim();
    if (email) rows.push(['E-mail', email]);
    rows.push(['O que quer organizar', need || 'Prefere explicar na conversa']);
    const choice = window.oryneoCommercialChoice;
    if (choice.plan) {
      const price = window.OryneoPricing.orderQuote(choice.plan, choice.cycle, choice.serviceKeys);
      const money = window.OryneoPricing.brl;
      rows.push(['Plano de interesse', choice.plan + ' · ' + (choice.cycle === 'annual' ? 'anual' : 'mensal')], [choice.cycle === 'annual' ? 'Assinatura · 12 meses antecipados' : 'Assinatura mensal', money(price.periodCharge)], ['Implantação única', money(price.setup)]);
      price.serviceLines.forEach(service => rows.push([service.label, money(service.upfrontCharge) + (service.key === 'traffic' ? ' · por trimestre, mídia à parte' : ' · pagamento único')]));
      rows.push(['Primeira cobrança estimada', money(price.firstCharge)]);
    } else rows.push(['Plano', 'A definir na conversa']);
    requestText = rows.map(([key,value]) => key + ': ' + value).join('\n');
    $('quick-summary').replaceChildren();
    rows.forEach(([key,value]) => {
      const row = document.createElement('div'), label = document.createElement('dt'), detail = document.createElement('dd');
      label.textContent = key; detail.textContent = value; row.append(label,detail); $('quick-summary').append(row);
    });
    $('quick-send-feedback').textContent = '';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const validName = error('quick-name', $('quick-name').value.trim().length < 2 ? 'Informe seu nome.' : '');
    const validPhoneNumber = error('quick-phone', validPhone($('quick-phone').value) ? '' : 'Informe um celular válido com DDD. Ex.: (21) 99999-9999.');
    const validEmailAddress = checkQuickEmail();
    if (!validName) { $('quick-name').focus(); return; }
    if (!validPhoneNumber) { $('quick-phone').focus(); return; }
    if (!validEmailAddress) { (suggestedQuickEmail ? $('quick-email-correct') : $('quick-email')).focus(); return; }
    error('quick-need', '');
    if (!$('quick-consent').checked) { $('quick-feedback').textContent = 'Confirme que podemos entrar em contato sobre a solicitação.'; $('quick-consent').setAttribute('aria-invalid','true'); $('quick-consent').focus(); return; }
    $('quick-feedback').textContent = '';
    renderSummary(); form.hidden = true; $('quick-review').hidden = false; $('quick-review').querySelector('h3').focus();
  });
  $('quick-edit').addEventListener('click', () => { form.hidden = false; $('quick-review').hidden = true; $('quick-send-feedback').textContent = ''; $('quick-name').focus(); });
  $('quick-send').addEventListener('click', () => {
    if (!requestText) return;
    $('quick-send-feedback').textContent = 'Confira a mensagem no seu aplicativo de e-mail. Ela só será recebida após você confirmar o envio.';
    window.location.href = 'mailto:contato@oryneo.com.br?subject=' + encodeURIComponent('Quero conversar · ORYNEO') + '&body=' + encodeURIComponent('Olá, ORYNEO. Gostaria de conversar sobre minha operação.\n\n' + requestText);
  });
  $('quick-copy').addEventListener('click', async () => {
    if (!requestText) return;
    try { await navigator.clipboard.writeText(requestText); $('quick-send-feedback').textContent = 'Solicitação copiada. Envie para contato@oryneo.com.br.'; }
    catch (_) { $('quick-send-feedback').textContent = 'Não foi possível copiar automaticamente. Selecione os dados acima para copiar.'; }
  });
})();
