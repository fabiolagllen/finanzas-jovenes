/* Finanzas Jóvenes — experiencia móvil tipo app */
(function(){
  'use strict';

  function addStyles(){
    if(document.getElementById('fjMobileStyles')) return;
    const s=document.createElement('style');
    s.id='fjMobileStyles';
    s.textContent=`
      .fj-mobile-nav{display:none}
      @media(max-width:900px){
        body{padding-left:0!important;padding-bottom:86px!important}
        body:before{background-size:34px 34px}
        header{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100%!important;height:64px!important;border:0!important;border-bottom:1px solid rgba(57,255,136,.16)!important;border-radius:0!important;background:rgba(5,8,6,.88)!important;backdrop-filter:blur(18px)!important;box-shadow:0 8px 30px #0008!important;overflow:visible!important;z-index:1000!important}
        header:before,header:after{display:none!important}
        header nav{height:64px!important;padding:10px 16px!important;display:flex!important;flex-direction:row!important;justify-content:center!important;align-items:center!important}
        header .logo{font-size:1.05rem!important;padding:8px 13px!important;border:0!important;background:transparent!important;box-shadow:none!important}
        header nav>div:nth-child(2),header .nav-user{display:none!important}
        .hero{min-height:auto!important;padding:96px 18px 45px!important;display:block!important}
        .hero h1{font-size:clamp(2.35rem,12vw,3.5rem)!important;letter-spacing:-1.8px!important}
        .hero p{font-size:.98rem!important}
        .hero-buttons{display:grid!important;grid-template-columns:1fr 1fr!important}
        .hero .button{padding:13px 10px!important;text-align:center!important}
        .hero-visual{min-height:350px!important;margin-top:25px!important}
        .float-card{font-size:.72rem!important;padding:9px 11px!important}
        .float-card.one{right:-2px!important}.float-card.two{left:-2px!important}
        .money-card{padding:21px!important;border-radius:23px!important;transform:none!important}
        section{padding:48px 15px!important}
        .section-title{margin-bottom:24px!important}.section-title h2{font-size:1.75rem!important}
        .features,.tools,.interactive,.dashboard-grid,.dash-content{grid-template-columns:1fr!important;gap:12px!important}
        .feature,.panel,.interactive-card{padding:20px!important;border-radius:18px!important}
        .expense-form{grid-template-columns:1fr!important}
        .dashboard{padding:20px!important;border-radius:20px!important}
        .dashboard-card{padding:16px!important}
        .cta{padding:38px 18px!important;border-radius:20px!important}
        footer{padding-bottom:24px!important}
        .fj-mobile-nav{position:fixed;display:grid;grid-template-columns:repeat(5,1fr);left:10px;right:10px;bottom:10px;height:66px;padding:5px;background:rgba(8,15,11,.96);border:1px solid rgba(57,255,136,.2);border-radius:20px;box-shadow:0 12px 35px #000b,0 0 28px rgba(57,255,136,.07);backdrop-filter:blur(18px);z-index:1100;padding-bottom:max(5px,env(safe-area-inset-bottom))}
        .fj-mobile-nav button{border:0;background:transparent;color:#809087;border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:700 .62rem Arial,sans-serif;min-width:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
        .fj-mobile-nav button span{font-size:1.2rem;line-height:1.15}.fj-mobile-nav button.active{color:#39ff88;background:rgba(57,255,136,.09)}
        #fjInstallApp{bottom:91px!important;right:18px!important}
        #fjGames{scroll-margin-top:75px!important}
        #fjGames .fj-games-wrap{padding-bottom:20px!important}
        #fjGames+.dashboard{margin-top:0}
        #fjChatbot,#fjChatbotButton{bottom:88px!important}
      }
      @media(max-width:380px){.fj-mobile-nav{left:6px;right:6px}.fj-mobile-nav button{font-size:.57rem}.fj-mobile-nav button span{font-size:1.08rem}}
    `;
    document.head.appendChild(s);
  }

  function go(id){
    const el=document.getElementById(id);if(!el)return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function setupNav(){
    if(document.querySelector('.fj-mobile-nav'))return;
    const nav=document.createElement('nav');
    nav.className='fj-mobile-nav';
    nav.setAttribute('aria-label','Navegación móvil');
    const items=[
      ['inicio','🏠','Inicio'],
      ['herramientas','💰','Finanzas'],
      ['panel','🎯','Metas'],
      ['fjGames','🎮','Juegos'],
      ['perfil','👤','Perfil']
    ];
    items.forEach(([id,icon,label],i)=>{
      const b=document.createElement('button');
      b.type='button';b.dataset.target=id;
      b.innerHTML='<span>'+icon+'</span>'+label;
      b.addEventListener('click',()=>{
        if(id==='perfil'){
          if(typeof window.openAuth==='function') window.openAuth();
          else go('panel');
          return;
        }
        go(id);setActive(id);
      });
      nav.appendChild(b);
    });
    document.body.appendChild(nav);
    setActive('inicio');
  }

  function setActive(id){
    document.querySelectorAll('.fj-mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  }

  function observeSections(){
    const ids=['inicio','herramientas','panel','fjGames'];
    const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
    if(!('IntersectionObserver' in window))return;
    const io=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible)setActive(visible.target.id);
    },{rootMargin:'-25% 0px -55% 0px',threshold:[.05,.2,.5]});
    sections.forEach(s=>io.observe(s));
  }

  function setupPWA(){
    if(!document.querySelector('link[rel="manifest"]')){
      const link=document.createElement('link');link.rel='manifest';link.href='manifest.json';document.head.appendChild(link);
    }
    if(!document.querySelector('meta[name="theme-color"]')){
      const meta=document.createElement('meta');meta.name='theme-color';meta.content='#050806';document.head.appendChild(meta);
    }
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  function init(){addStyles();setupPWA();setupNav();setTimeout(observeSections,300)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
