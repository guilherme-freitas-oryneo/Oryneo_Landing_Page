import assert from 'node:assert/strict';
import test from 'node:test';

import transport from '../assets/lead-intake.js';

const { createLeadTransport } = transport;

const REQUEST_A = '11111111-1111-4111-8111-111111111111';
const REQUEST_B = '22222222-2222-4222-8222-222222222222';

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return body; },
  };
}

function payload(requestId = REQUEST_A) {
  return {
    request_id: requestId,
    contact: 'Ana Souza',
    email: 'ana@example.com',
    phone: '(11) 99999-0000',
    company: 'Acme',
    consent: true,
  };
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
}

test('envia uma vez com cabeçalhos públicos e retorna sucesso', async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    return response(200, { ok: true });
  };
  const sendLead = createLeadTransport({
    endpoint: 'https://example.test/lead-intake',
    anonKey: 'public-anon-key',
    storage: memoryStorage(),
  });

  const result = await sendLead(payload(), fetchImpl);

  assert.deepEqual(result, { ok: true });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, 'https://example.test/lead-intake');
  assert.equal(requests[0].options.headers.apikey, 'public-anon-key');
  assert.equal(requests[0].options.headers.Authorization, 'Bearer public-anon-key');
  assert.equal(JSON.parse(requests[0].options.body).request_id, REQUEST_A);
});

for (const [status, code] of [[400, 'invalid'], [422, 'cnpj_not_found'], [429, 'rate_limited'], [503, 'unavailable']]) {
  test(`classifica ${status}, mantém o payload e permite nova tentativa`, async () => {
    const original = payload();
    const snapshot = structuredClone(original);
    const sendLead = createLeadTransport({ storage: memoryStorage() });

    await assert.rejects(
      sendLead(original, async () => response(status, { error: 'mensagem interna' })),
      (error) => error.code === code && error.status === status,
    );

    assert.deepEqual(original, snapshot);
  });
}

test('aborta por timeout sem descartar os dados', async () => {
  const original = payload();
  const sendLead = createLeadTransport({ timeoutMs: 5, storage: memoryStorage() });
  const neverSettles = () => new Promise(() => {});

  await assert.rejects(sendLead(original, neverSettles), (error) => error.code === 'timeout');
  assert.equal(original.email, 'ana@example.com');
});

test('reutiliza o request_id após falha mesmo que a interface gere outro', async () => {
  const sentIds = [];
  let attempt = 0;
  const fetchImpl = async (_url, options) => {
    sentIds.push(JSON.parse(options.body).request_id);
    attempt += 1;
    return attempt === 1
      ? response(503, { error: 'offline' })
      : response(200, { ok: true });
  };
  const sendLead = createLeadTransport({
    storage: memoryStorage(),
    fingerprint: async () => 'same-submission',
  });

  await assert.rejects(sendLead(payload(REQUEST_A), fetchImpl));
  await sendLead(payload(REQUEST_B), fetchImpl);

  assert.deepEqual(sentIds, [REQUEST_A, REQUEST_A]);
});

test('dois cliques concorrentes compartilham uma única requisição em voo', async () => {
  let resolveFetch;
  let calls = 0;
  const fetchImpl = () => {
    calls += 1;
    return new Promise((resolve) => { resolveFetch = resolve; });
  };
  const sendLead = createLeadTransport({
    storage: memoryStorage(),
    fingerprint: async () => 'same-concurrent-submission',
    timeoutMs: 50,
  });

  const first = sendLead(payload(), fetchImpl);
  const second = sendLead(payload(REQUEST_B), fetchImpl);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 1);

  resolveFetch(response(200, { ok: true }));
  assert.deepEqual(await Promise.all([first, second]), [{ ok: true }, { ok: true }]);
});
