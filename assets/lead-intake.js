(() => {
  const endpoint='https://ucikrafwfzamxvweuvgk.supabase.co/functions/v1/lead-intake';
  const anon='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaWtyYWZ3ZnphbXh2d2V1dmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NzYwNTksImV4cCI6MjEwNzE1MjA1OX0.xWdmQnv9bIUh2Sc0AAzArtiD94-BQ5z6ZUp78YhNSGo';
  const ids=new Map();
  window.OryneoLeadIntake={async send(payload,button,feedback){
    if(button.disabled)return;
    button.disabled=true;button.setAttribute('aria-busy','true');
    const previous=button.textContent;button.textContent='Enviando solicitação…';feedback.textContent='';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
    try{
      const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload))))).map(b=>b.toString(16).padStart(2,'0')).join('');
      let id=ids.get(fingerprint);
      try{id=id||sessionStorage.getItem('oryneo-request-'+fingerprint)}catch{}
      id=id||crypto.randomUUID();ids.set(fingerprint,id);
      try{sessionStorage.setItem('oryneo-request-'+fingerprint,id)}catch{}
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+anon,apikey:anon},body:JSON.stringify({...payload,request_id:id,website:document.getElementById('oryneo-website')?.value||''}),signal:controller.signal});
      const result=await response.json();
      if(!response.ok||result.ok!==true)throw new Error(result.error||'Não foi possível enviar agora.');
      feedback.textContent='Solicitação recebida pela equipe ORYNEO.';
      window.dispatchEvent(new CustomEvent('oryneo:webhook-accepted',{detail:{name:payload.contact}}));
      button.textContent='Solicitação enviada ✓';
    }catch(error){
      feedback.textContent=(error.name==='AbortError'?'O envio demorou mais que o esperado.':error.message)+' Seus dados foram mantidos. Tente enviar novamente.';
      button.disabled=false;button.textContent=previous;
    }finally{clearTimeout(timeout);button.removeAttribute('aria-busy')}
  }};
})();
