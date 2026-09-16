/* Finanzas Jóvenes — experiencia móvil tipo app + instalación PWA */
(function(){
  'use strict';

  function loadEditorialStyle(){
    if(document.querySelector('link[data-fj-editorial]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./editory-finan-style.css?v=1';
    link.dataset.fjEditorial='true';
    document.head.appendChild(link);
  }

  function loadNotifications(){
    if(document.querySelector('script[data-fj-notifications]')) return;
    const script=document.createElement('script');
    script.src='./notifications.js?v=1';
    script.dataset.fjNotifications='true';
    document.head.appendChild(script);
  }

  function removeGames(){
    const remove=()=>{
      const games=document.getElementById('fjGames');
      if(games) games.remove();
      document.querySelectorAll('a[data-fj-games]').forEach(el=>el.remove());
    };
    remove();
    setTimeout(remove,50);
    setTimeout(remove,300);
  }

  function addStyles(){
    if(document.getElementById('fjMobileStyles')) return;
    const s=document.createElement('style');
    s.id='fjMobileStyles';
    s.textContent=`
      .fj-mobile-nav{display:none;position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:68px!important;padding:7px!important;align-items:stretch!important;justify-content:space-around!important;gap:4px!important;background:rgba(8,17,12,.96)!important;border:1px solid rgba(57,255,136,.22)!important;border-radius:22px!important;box-shadow:0 15px 45px rgba(0,0,0,.55),0 0 25px rgba(57,255,136,.08)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;z-index:9998!important}
      .fj-mobile-nav button{flex:1!important;min-width:0!important;border:0!important;background:transparent!important;color:#8fa197!important;border-radius:16px!important;font-size:.66rem!important;font-weight:800!important;cursor:pointer!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;transition:.2s!important}
      .fj-mobile-nav button span{font-size:1.18rem!important;line-height:1!important}.fj-mobile-nav button.active{background:rgba(57,255,136,.12)!important;color:#39ff88!important}
      .fj-mobile-nav button.fj-profile-menu-item{display:none!important}.fj-mobile-nav button.fj-profile-menu-item.fj-profile-visible{display:flex!important}
      .fj-install-overlay{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:20px!important;background:rgba(0,0,0,.78)!important;backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important;z-index:99999!important;overflow:auto!important}
      .fj-install-card{width:min(430px,100%)!important;margin:auto!important;padding:32px 28px!important;border-radius:28px!important;background:linear-gradient(145deg,#13291b,#07100b)!important;border:1px solid rgba(57,255,136,.28)!important;box-shadow:0 30px 100px rgba(0,0,0,.72),0 0 45px rgba(57,255,136,.10)!important;text-align:center!important;color:#f4faf6!important;position:relative!important}
      .fj-install-logo{width:72px!important;height:72px!important;margin:0 auto 16px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:22px!important;background:rgba(57,255,136,.09)!important;border:1px solid rgba(57,255,136,.22)!important;font-size:2.2rem!important;box-shadow:0 0 30px rgba(57,255,136,.08)!important}
      .fj-install-card h2{font-size:1.8rem!important;margin:0 0 8px!important;letter-spacing:-.8px!important}.fj-install-card h2 span{color:#39ff88!important}.fj-install-card>p{color:#9eafa5!important;font-size:.94rem!important;line-height:1.6!important;margin:0 auto 23px!important;max-width:340px!important}
      .fj-install-actions{display:grid!important;gap:10px!important}.fj-install-actions button{width:100%!important;border-radius:14px!important;padding:14px 16px!important;font-size:.95rem!important;font-weight:800!important;cursor:pointer!important;transition:.2s!important}.fj-install-main{background:#39ff88!important;color:#041008!important;border:1px solid #39ff88!important}.fj-install-main:hover{transform:translateY(-2px)!important;box-shadow:0 10px 28px rgba(57,255,136,.20)!important}.fj-install-web{background:rgba(255,255,255,.035)!important;color:#dce9e1!important;border:1px solid rgba(255,255,255,.10)!important}.fj-install-web:hover{background:rgba(57,255,136,.06)!important;border-color:rgba(57,255,136,.20)!important}.fj-install-help{display:none!important;margin-top:14px!important;padding:12px!important;border-radius:12px!important;background:rgba(255,226,122,.06)!important;border:1px solid rgba(255,226,122,.16)!important;color:#ffe7a0!important;font-size:.78rem!important;line-height:1.5!important;text-align:left!important}.fj-install-help.show{display:block!important}
      @media(max-width:900px){body{padding-left:0!important;padding-bottom:92px!important}body:before{background-size:34px 34px}header{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100%!important;height:64px!important;border:0!important;border-bottom:1px solid rgba(57,255,136,.16)!important;border-radius:0!important;background:rgba(5,8,6,.88)!important;backdrop-filter:blur(18px)!important;box-shadow:0 8px 30px #0008!important;overflow:visible!important;z-index:1000!important}header:before,header:after{display:none!important}header nav{height:64px!important;padding:10px 16px!important;display:flex!important;flex-direction:row!important;justify-content:center!important;align-items:center!important}header .logo{font-size:1.05rem!important;padding:8px 13px!important;border:0!important;background:transparent!important;box-shadow:none!important}header nav>div:nth-child(2),header .nav-user{display:none!important}.fj-mobile-nav{display:flex!important}.hero{min-height:auto!important;padding:96px 18px 45px!important;display:block!important}.hero h1{font-size:clamp(2.35rem,12vw,3.5rem)!important;letter-spacing:-1.8px!important}.hero p{font-size:.98rem!important}.hero-buttons{display:grid!important;grid-template-columns:1fr 1fr!important}.hero .button{padding:13px 10px!important;text-align:center!important}.hero-visual{min-height:355px!important;margin-top:25px!important;padding:48px 8px 45px!important}.money-card{width:calc(100% - 28px)!important;max-width:390px!important;padding:21px!important;border-radius:23px!important;transform:none!important;z-index:2!important}.hero-visual .float-card{font-size:.68rem!important;line-height:1.25!important;padding:8px 10px!important;border-radius:12px!important;animation:none!important;z-index:3!important;max-width:125px!important;white-space:normal!important}.hero-visual .float-card.one{top:2px!important;right:0!important;left:auto!important}.hero-visual .float-card.two{bottom:2px!important;left:0!important;right:auto!important}section{padding:48px 15px!important}.section-title{margin-bottom:24px!important}.section-title h2{font-size:1.75rem!important}.features,.tools,.interactive,.dashboard-grid,.dash-content{grid-template-columns:1fr!important;gap:12px!important}.feature,.panel,.interactive-card{padding:20px!important;border-radius:18px!important}.expense-form{grid-template-columns:1fr!important}.dashboard{padding:20px!important;border-radius:20px!important}.dashboard-card{padding:16px!important}.cta{padding:38px 18px!important;border-radius:20px!important}footer{padding-bottom:24px!important}#fjChatbot,#fjChatbotButton{bottom:92px!important}.fj-install-card{padding:29px 22px!important;border-radius:25px!important}}
      @media(max-width:380px){.fj-mobile-nav{left:6px!important;right:6px!important;bottom:6px!important}.fj-mobile-nav button{font-size:.57rem!important}.fj-mobile-nav button span{font-size:1.08rem!important}.hero-visual{min-height:340px}.hero-visual .float-card{max-width:112px!important;font-size:.63rem!important}.fj-install-card{padding:25px 18px!important}.fj-install-logo{width:62px!important;height:62px!important;font-size:1.9rem!important}}
    `;
    document.head.appendChild(s);
  }

  function go(id){const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:'smooth',block:'start'});}

  function setupNav(){
    if(document.querySelector('.fj-mobile-nav'))return;
    const nav=document.createElement('nav');nav.className='fj-mobile-nav';nav.setAttribute('aria-label','Navegación móvil');
    const items=[['inicio','🏠','Inicio'],['herramientas','💰','Finanzas'],['panel','🎯','Metas'],['interactivo','🎯','Retos'],['perfil','👤','Perfil']];
    items.forEach(([id,icon,label])=>{const b=document.createElement('button');b.type='button';b.dataset.target=id;b.innerHTML='<span>'+icon+'</span>'+label;if(id==='perfil')b.classList.add('fj-profile-menu-item');b.addEventListener('click',()=>{if(id==='perfil'){if(typeof window.openProfile==='function')window.openProfile();else if(typeof window.openAuth==='function')window.openAuth();return;}go(id);setActive(id);});nav.appendChild(b);});
    document.body.appendChild(nav);setActive('inicio');
  }

  function setActive(id){document.querySelectorAll('.fj-mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===id));}

  function observeSections(){const ids=['inicio','herramientas','interactivo','panel'];const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);if(!('IntersectionObserver' in window))return;const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)setActive(visible.target.id);},{rootMargin:'-25% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(s=>io.observe(s));}

  function isStandalone(){return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}

  function setupInstallExperience(){
    if(isStandalone())return;
    let deferredPrompt=null;
    const overlay=document.createElement('div');overlay.className='fj-install-overlay';overlay.id='fjInstallOverlay';overlay.innerHTML='<div class="fj-install-card"><div class="fj-install-logo">💚</div><h2>Finanzas <span>Jóvenes</span></h2><p>Aprende a manejar tu dinero de forma fácil, practica con herramientas y lleva tus metas contigo.</p><div class="fj-install-actions"><button class="fj-install-main" id="fjInstallChoiceButton">📲 Instalar aplicación</button><button class="fj-install-web" id="fjContinueWeb">🌐 Continuar en la página</button></div><div class="fj-install-help" id="fjInstallHelp"></div></div>';
    document.body.appendChild(overlay);
    const closeWeb=()=>{overlay.remove();};document.getElementById('fjContinueWeb').addEventListener('click',closeWeb);
    const installBtn=document.getElementById('fjInstallChoiceButton');installBtn.addEventListener('click',async()=>{if(deferredPrompt){deferredPrompt.prompt();try{await deferredPrompt.userChoice;}catch(e){}deferredPrompt=null;overlay.remove();return;}const help=document.getElementById('fjInstallHelp');help.innerHTML='<strong>Instalación no disponible todavía.</strong><br>En Chrome/Edge, usa el botón de instalación de la barra de direcciones si aparece. En iPhone/iPad, abre Compartir y elige <strong>Añadir a pantalla de inicio</strong>.';help.classList.add('show');});
    window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;});window.addEventListener('appinstalled',()=>{overlay.remove();});
  }

  function setupPWA(){if(!document.querySelector('link[rel="manifest"]')){const link=document.createElement('link');link.rel='manifest';link.href='manifest.json';document.head.appendChild(link);}if(!document.querySelector('meta[name="theme-color"]')){const meta=document.createElement('meta');meta.name='theme-color';meta.content='#39ff88';document.head.appendChild(meta);}if(!document.querySelector('meta[name="apple-mobile-web-app-capable"]')){const meta=document.createElement('meta');meta.name='apple-mobile-web-app-capable';meta.content='yes';document.head.appendChild(meta);}if(!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')){const meta=document.createElement('meta');meta.name='apple-mobile-web-app-status-bar-style';meta.content='black-translucent';document.head.appendChild(meta);}if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

  function init(){loadEditorialStyle();addStyles();setupPWA();loadNotifications();setupNav();removeGames();setTimeout(observeSections,300);setTimeout(setupInstallExperience,0);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
