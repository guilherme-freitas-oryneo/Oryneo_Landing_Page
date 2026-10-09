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

  const api = { quote, orderQuote, brl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OryneoPricing = api;
})(typeof window !== 'undefined' ? window : globalThis);
