(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) api.attach(root);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';

  function clean(value, limit) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit);
  }

  function buildConfirmationCopy(lead = {}) {
    const name = clean(lead.name, 90);
    const greeting = name ? `Obrigado, ${name}.` : 'Obrigado por compartilhar o cenário da sua operação.';
    return `${greeting} A equipe ORYNEO vai analisar como sua empresa atrai, atende e acompanha oportunidades para conversar com você sobre o próximo passo que faz sentido para a realidade do negócio.`;
  }

  function attach(win) {
    const panel = win.document.getElementById('submission-success');
    if (!panel) return;
    const copy = win.document.getElementById('submission-success-copy');
    const demoNote = win.document.getElementById('submission-success-demo');

    function showSuccess(lead = {}, previewOnly = false) {
      copy.textContent = buildConfirmationCopy(lead);
      demoNote.hidden = !previewOnly;
      win.document.querySelector('.consultation-copy').hidden = true;
      win.document.getElementById('quick-panel').hidden = true;
      win.document.getElementById('detailed-panel').hidden = true;
      panel.hidden = false;
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: win.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }

    // The production webhook handler should dispatch this only after the
    // request has been persisted and acknowledged by the server.
    win.addEventListener('oryneo:webhook-accepted', (event) => showSuccess(event.detail || {}));
    win.oryneoShowSubmissionSuccess = showSuccess;

    if (new URLSearchParams(win.location.search).get('v32-preview') === 'confirmation') {
      showSuccess({ name: 'Marina' }, true);
    }
  }

  return { buildConfirmationCopy, attach };
});
