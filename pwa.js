/* Finanzas Jóvenes — experiencia de app instalable */
(function(){
  'use strict';

  function setupManifest(){
    if(!document.querySelector('link[rel="manifest"]')){
      const link=document.createElement('link');
      link.rel='manifest';
      link.href='manifest.json';
      document.head.appendChild(link);
    }
    if(!document.querySelector('meta[name="theme-color"]')){
      const meta=document.createElement('meta');
      meta.name='theme-color';
      meta.content='#050806';
      document.head.appendChild(meta);
    }
    const apple=document.createElement('meta');
    apple.name='apple-mobile-web-app-capable';
    apple.content='yes';
    document.head.appendChild(apple);
    const status=document.createElement('meta');
    status.name='apple-mobile-web-app-status-bar-style';
    status.content='black-translucent';
    document.head.appendChild(status);
  }

  function setupInstallButton(){
    let deferredPrompt=null;
    window.addEventListener('beforeinstallprompt', event=>{
      event.preventDefault();
      deferredPrompt=event;
      let btn=document.getElementById('fjInstallApp');
      if(!btn){
        btn=document.createElement('button');
        btn.id='fjInstallApp';
        btn.textContent='📲 Instalar app';
        btn.style.cssText='position:fixed;right:18px;bottom:94px;z-index:9998;border:1px solid #39ff88;background:#10271a;color:#39ff88;border-radius:14px;padding:11px 15px;font-weight:900;box-shadow:0 10px 28px #0009;cursor:pointer';
        btn.onclick=async()=>{
          if(!deferredPrompt)return;
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          deferredPrompt=null;
          btn.remove();
        };
        document.body.appendChild(btn);
      }
    });
    window.addEventListener('appinstalled',()=>document.getElementById('fjInstallApp')?.remove());
  }

  function registerSW(){
    if(!('serviceWorker' in navigator)) return;
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('FJ PWA:',err)));
  }

  function init(){
    setupManifest();
    setupInstallButton();
    registerSW();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
