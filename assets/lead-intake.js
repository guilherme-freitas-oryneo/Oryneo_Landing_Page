(function attachLeadIntake(root, factory) {
  const api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.OryneoLeadIntake = { ...api, send: api.createBrowserSender() };
}(typeof window === 'undefined' ? null : window, (root) => {
  'use strict';

  const DEFAULT_ENDPOINT = 'https://ucikrafwfzamxvweuvgk.supabase.co/functions/v1/lead-intake';
  const PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaWtyYWZ3ZnphbXh2d2V1dmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NzYwNTksImV4cCI6MjEwNzE1MjA1OX0.xWdmQnv9bIUh2Sc0AAzArtiD94-BQ5z6ZUp78YhNSGo';
  const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  class LeadIntakeError extends Error {
    constructor(code, message, status = 0) {
      super(message);
      this.name = 'LeadIntakeError';
      this.code = code;
      this.status = status;
    }
  }

  function storageFrom(config) {
    if (config.storage) return config.storage;
    try { return root?.sessionStorage || null; } catch { return null; }
  }

  function randomUuid(config) {
    const generator = config.randomUUID || globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
    if (generator) return generator();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
      const value = Math.floor(Math.random() * 16);
      return (token === 'x' ? value : (value & 3) | 8).toString(16);
    });
  }

  function fingerprintInput(payload) {
    const { request_id: _requestId, website: _website, ...identity } = payload;
    return JSON.stringify(identity);
  }

  async function fingerprint(payload) {
    const source = fingerprintInput(payload);
    const subtle = globalThis.crypto?.subtle;
    if (subtle) {
      const bytes = new TextEncoder().encode(source);
      const digest = new Uint8Array(await subtle.digest('SHA-256', bytes));
      return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `fallback-${(hash >>> 0).toString(16)}`;
  }

  function classifyResponse(status) {
    if (status === 400) return new LeadIntakeError('invalid', 'Revise os dados informados e tente novamente.', status);
    if (status === 422) return new LeadIntakeError('cnpj_not_found', 'Não encontramos esse CNPJ. Confira os números e tente novamente.', status);
    if (status === 429) return new LeadIntakeError('rate_limited', 'Recebemos muitas tentativas em sequência. Aguarde um instante.', status);
    if (status >= 500) return new LeadIntakeError('unavailable', 'Nosso canal de envio está temporariamente indisponível.', status);
    return new LeadIntakeError('rejected', 'Não foi possível confirmar o envio agora.', status);
  }

  function createLeadTransport(config = {}) {
    const endpoint = config.endpoint || DEFAULT_ENDPOINT;
    const anonKey = config.anonKey || PUBLIC_ANON_KEY;
    const timeoutMs = config.timeoutMs ?? 20000;
    const storage = storageFrom(config);
    const requestIds = new Map();
    const inFlight = new Map();

    return async function sendLead(payload, fetchImpl = globalThis.fetch) {
      if (!payload || typeof payload !== 'object') throw new TypeError('Payload do lead ausente.');
      if (typeof fetchImpl !== 'function') throw new TypeError('Transporte HTTP indisponível.');

      const identify = config.fingerprint || fingerprint;
      const key = await identify(payload);
      if (inFlight.has(key)) return inFlight.get(key);

      const storageKey = `oryneo-request-${key}`;
      let storedId = null;
      try { storedId = storage?.getItem(storageKey); } catch { storedId = null; }
      const suppliedId = REQUEST_ID_PATTERN.test(String(payload.request_id || '')) ? payload.request_id : null;
      const requestId = requestIds.get(key) || storedId || suppliedId || randomUuid(config);
      requestIds.set(key, requestId);
      try { storage?.setItem(storageKey, requestId); } catch { /* sessionStorage pode estar bloqueado */ }

      const controller = new AbortController();
      let timeoutHandle;
      const timeout = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          controller.abort();
          reject(new LeadIntakeError('timeout', 'O envio demorou mais que o esperado.'));
        }, timeoutMs);
      });

      const execute = async () => {
        try {
          const request = fetchImpl(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${anonKey}`,
              apikey: anonKey,
            },
            body: JSON.stringify({ ...payload, request_id: requestId }),
            signal: controller.signal,
          });
          const response = await Promise.race([request, timeout]);
          let result = {};
          try { result = await response.json(); } catch { result = {}; }
          if (!response.ok || result.ok !== true) throw classifyResponse(response.status);
          return { ok: true };
        } catch (error) {
          if (error instanceof LeadIntakeError) throw error;
          if (error?.name === 'AbortError') throw new LeadIntakeError('timeout', 'O envio demorou mais que o esperado.');
          throw new LeadIntakeError('network', 'Não foi possível alcançar o canal de envio.');
        } finally {
          clearTimeout(timeoutHandle);
        }
      };

      const pending = execute().finally(() => inFlight.delete(key));
      inFlight.set(key, pending);
      return pending;
    };
  }

  const sendLead = createLeadTransport();

  function createBrowserSender() {
    return async function send(payload, button, feedback) {
      if (!button || !feedback || button.disabled) return;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      const previous = button.textContent;
      button.textContent = 'Enviando solicitação…';
      feedback.textContent = '';
      try {
        const website = root?.document?.getElementById('oryneo-website')?.value || '';
        const result = await sendLead({ ...payload, website });
        feedback.textContent = 'Solicitação recebida pela equipe ORYNEO.';
        button.textContent = 'Solicitação enviada ✓';
        root?.dispatchEvent(new CustomEvent('oryneo:webhook-accepted', { detail: { name: payload.contact } }));
        return result;
      } catch (error) {
        const message = error instanceof LeadIntakeError ? error.message : 'Não foi possível confirmar o envio agora.';
        feedback.textContent = `${message} Seus dados foram mantidos. Tente enviar novamente.`;
        button.disabled = false;
        button.textContent = previous;
        return undefined;
      } finally {
        button.removeAttribute('aria-busy');
      }
    };
  }

  return { LeadIntakeError, createLeadTransport, createBrowserSender, sendLead };
}));
