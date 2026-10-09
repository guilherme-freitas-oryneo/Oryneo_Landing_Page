(function(root){
  'use strict';
  const normalizeCnpj=value=>String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  function formatCnpj(value){
    const d=normalizeCnpj(value).slice(0,14);
    if(d.length<=2)return d;
    if(d.length<=5)return d.slice(0,2)+'.'+d.slice(2);
    if(d.length<=8)return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5);
    if(d.length<=12)return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5,8)+'/'+d.slice(8);
    return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5,8)+'/'+d.slice(8,12)+'-'+d.slice(12);
  }
  function validCnpj(value){
    const d=normalizeCnpj(value);
    if(!/^[A-Z0-9]{12}[0-9]{2}$/.test(d)||/^(\d)\1{13}$/.test(d))return false;
    const check=length=>{
      let sum=0,weight=length-7;
      for(let i=0;i<length;i++){sum+=(d.charCodeAt(i)-48)*weight--;if(weight<2)weight=9;}
      const remainder=sum%11;
      return Number(d[length])===(remainder<2?0:11-remainder);
    };
    return check(12)&&check(13);
  }
  const api={normalizeCnpj,formatCnpj,validCnpj};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OryneoCompany=api;
})(typeof window!=='undefined'?window:globalThis);
