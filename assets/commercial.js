(function (root) {
  const plans = Object.freeze({
    Start: { monthly: 74990, setup: 98990, users: 5, storageGb: 20, aiReplies: 1500, audioMinutes: 300 },
    Growth: { monthly: 109990, setup: 138990, users: 10, storageGb: 50, aiReplies: 5000, audioMinutes: 700 },
    Scale: { monthly: 147990, setup: 184990, users: 20, storageGb: 100, aiReplies: 10000, audioMinutes: 1200 }
  });
  const services = Object.freeze({
    'landing-page': { label: 'Landing page de conversão', amount: 88990, billing: 'one_time' },
    traffic: { label: 'Gestão de tráfego pago', amount: 98990, billing: 'monthly', minimumMonths: 3 }
  });
  const commercialValues = Object.freeze({
    plans: Object.freeze(['Start', 'Growth', 'Scale']),
    cycles: Object.freeze(['monthly', 'annual']),
    intents: Object.freeze(['conversation', 'contract']),
    services: Object.freeze(['landing-page', 'traffic']),
    attribution: Object.freeze(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'])
  });

  function quote(plan, cycle) {
    if (!Object.hasOwn(plans, plan)) throw new Error('Plano desconhecido');
    if (cycle !== 'monthly' && cycle !== 'annual') throw new Error('Ciclo desconhecido');
    const { monthly, setup, users, storageGb, aiReplies, audioMinutes } = plans[plan];
    const periodCharge = cycle === 'annual' ? monthly * 12 * 9 / 10 : monthly;
    return {
      plan, cycle,
      monthlyEquivalent: cycle === 'annual' ? periodCharge / 12 : monthly,
      periodCharge, setup, firstCharge: setup + periodCharge,
      savings: cycle === 'annual' ? monthly * 12 - periodCharge : 0,
      users, storageGb, aiReplies, audioMinutes
    };
  }

  function brl(cents) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
  }

  function orderQuote(plan, cycle, selectedServices = []) {
    const planQuote = quote(plan, cycle);
    const serviceLines = selectedServices.map((key) => {
      if (!Object.hasOwn(services, key)) throw new Error('Serviço desconhecido');
      const service = services[key];
      return {
        key,
        ...service,
        minimumCommitment: service.amount * (service.minimumMonths || 1),
        upfrontCharge: service.amount * (service.minimumMonths || 1)
      };
    });
    const servicesFirstCharge = serviceLines.reduce((total, service) => total + service.upfrontCharge, 0);
    return {
      ...planQuote,
      planFirstCharge: planQuote.firstCharge,
      servicesFirstCharge,
      firstCharge: planQuote.firstCharge + servicesFirstCharge,
      serviceLines
    };
  }

  function safeQueryValue(value) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 160);
  }

  function queryValue(source, key) {
    if (!source) return '';
    if (typeof source.get === 'function') return source.get(key) || '';
    if (source.searchParams && typeof source.searchParams.get === 'function') return source.searchParams.get(key) || '';
    return source[key] || '';
  }

  function buildCommercialUrl(choice = {}, attribution = {}) {
    const params = new URLSearchParams();
    if (commercialValues.plans.includes(choice.plan)) params.set('plan', choice.plan);
    if (commercialValues.cycles.includes(choice.cycle)) params.set('cycle', choice.cycle);
    const selectedServices = Array.isArray(choice.serviceKeys)
      ? choice.serviceKeys
      : (Array.isArray(choice.services) ? choice.services : []);
    [...new Set(selectedServices)]
      .filter((service) => commercialValues.services.includes(service))
      .forEach((service) => params.append('services', service));
    if (commercialValues.intents.includes(choice.intent)) params.set('intent', choice.intent);
    commercialValues.attribution.forEach((key) => {
      const value = safeQueryValue(queryValue(attribution, key));
      if (value) params.set(key, value);
    });
    const query = params.toString();
    return `./comecar/${query ? `?${query}` : ''}`;
  }

  const api = { quote, orderQuote, brl, buildCommercialUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OryneoPricing = api;
})(typeof window !== 'undefined' ? window : globalThis);
