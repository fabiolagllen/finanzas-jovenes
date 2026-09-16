/* Finanzas Jóvenes — ÚNICO menú compartido para toda la aplicación */
(function(){
  'use strict';

  const ITEMS=[
    {id:'inicio',icon:'🏠',label:'Inicio',href:'./index.html'},
    {id:'aprende',icon:'📚',label:'Aprende',href:'./index.html#aprende'},
    {id:'herramientas',icon:'💰',label:'Finanzas',href:'./index.html#herramientas'},
    {id:'panel',icon:'📊',label:'Mi panel',href:'./index.html#panel'},
    {id:'perfil',icon:'👤',label:'Perfil',href:'./profile.html'},
    {id:'pagos',icon:'🔔',label:'Recordatorios',href:'./index.html#pagos'}
  ];

  function currentId(){
    const path=location.pathname.toLowerCase();
    if(path.endsWith('/profile.html') || path.endsWith('/profile')) return 'perfil';
    const hash=location.hash.toLowerCase();
    if(hash==='#aprende') return 'aprende';
    if(hash==='#herramientas') return 'herramientas';
    if(hash==='#panel') return 'panel';
    if(hash==='#pagos') return 'pagos';
    return 'inicio';
  }

  function navigate(href){
    const url=new URL(href,location.href);
    const samePage=url.pathname===location.pathname;
    if(samePage && url.hash){
      if(location.hash!==url.hash) location.hash=url.hash;
      else document.getElementById(url.hash.slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});
      setActive();
      return;
    }
    if(samePage && !url.hash){
      window.scrollTo({top:0,behavior:'smooth'});
      history.replaceState(null,'',url.pathname);
      setActive();
      return;
    }
    location.href=href;
  }

  function styles(){
    if(document.getElementById('fjSharedDesktopMenu')) return;
    const s=document.createElement('style');
    s.id='fjSharedDesktopMenu';
    s.textContent=`
      body{padding-left:274px!important}
      body>header{position:fixed!important;left:22px!important;top:22px!important;bottom:22px!important;width:226px!important;z-index:9997!important;background:linear-gradient(180deg,rgba(17,34,24,.96),rgba(6,13,9,.94))!important;border:1px solid rgba(57,255,136,.24)!important;border-radius:32px!important;backdrop-filter:blur(22px)!important;box-shadow:0 24px 75px rgba(0,0,0,.58),0 0 48px rgba(57,255,136,.10),inset 0 1px rgba(255,255,255,.035)!important;overflow:hidden!important}
      body>header nav{height:100%!important;padding:25px 16px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:25px!important;position:relative!important;z-index:1!important}
      body>header .fj-shared-logo{font-size:1.25rem!important;font-weight:900!important;padding:13px!important;border:1px solid rgba(57,255,136,.14)!important;border-radius:18px!important;background:rgba(57,255,136,.055)!important;letter-spacing:-.5px!important}
      body>header .fj-shared-logo span{color:#39ff88!important}
      body>header .fj-menu-links{display:flex!important;flex-direction:column!important;gap:8px!important}
      body>header .fj-menu-links a{display:flex!important;align-items:center!important;color:#cbd7d0!important;text-decoration:none!important;margin:0!important;padding:12px 13px!important;border-radius:15px!important;font-size:.91rem!important;font-weight:700!important;transition:.22s!important;border:1px solid rgba(255,255,255,.025)!important;background:rgba(255,255,255,.018)!important;box-shadow:0 5px 14px rgba(0,0,0,.10)!important}
      body>header .fj-menu-links a:hover,body>header .fj-menu-links a.active{color:#39ff88!important;background:rgba(57,255,136,.105)!important;border-color:rgba(57,255,136,.20)!important}
      body>header .fj-menu-user{display:flex!important;flex-direction:column!important;gap:9px!important;margin-top:auto!important;padding-top:18px!important}
      body>header .fj-menu-user button{width:100%!important;border:0!important;background:rgba(23,37,29,.92)!important;color:#39ff88!important;padding:10px 15px!important;border-radius:15px!important;font-weight:800!important;cursor:pointer!important;border:1px solid #355440!important}
      .fj-mobile-nav{display:none!important}
      #pagos{scroll-margin-top:30px}
      .fj-reminders{max-width:1180px;margin:auto;padding:0 24px 72px}
      .fj-reminder-card{background:linear-gradient(145deg,#112017,#08100b);border:1px solid #31503d;border-radius:27px;padding:28px;box-shadow:0 0 50px rgba(57,255,136,.06)}
      .fj-reminder-card h2{margin:0 0 7px;font-size:2rem}.fj-reminder-card>p{color:#9eafa5;margin:0 0 20px}.fj-reminder-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fj-reminder{padding:16px;background:#0a110d;border:1px solid #294034;border-radius:15px}.fj-reminder strong{display:block;color:#39ff88;margin-bottom:4px}.fj-reminder span{display:block;color:#9eafa5;font-size:.88rem}.fj-reminder-action{margin-top:14px;display:flex;gap:9px;flex-wrap:wrap}.fj-reminder-action button{border:1px solid #39ff88;background:#39ff88;color:#041008;border-radius:11px;padding:10px 14px;font-weight:800;cursor:pointer}.fj-reminder-action button.secondary{background:#0a120d;color:#dce9e1;border-color:#294034}
      @media(max-width:900px){
        body{padding-left:0!important;padding-bottom:94px!important}
        body>header{display:none!important}
        .fj-mobile-nav{display:flex!important;position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:68px!important;padding:7px!important;align-items:stretch!important;justify-content:space-around!important;gap:4px!important;background:rgba(8,17,12,.96)!important;border:1px solid rgba(57,255,136,.22)!important;border-radius:22px!important;box-shadow:0 15px 45px rgba(0,0,0,.55),0 0 25px rgba(57,255,136,.08)!important;backdrop-filter:blur(18px)!important;z-index:9998!important}
        .fj-mobile-nav button{flex:1!important;min-width:0!important;border:0!important;background:transparent!important;color:#8fa197!important;border-radius:16px!important;font-size:.66rem!important;font-weight:800!important;cursor:pointer!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;line-height:1.15!important}
        .fj-mobile-nav button span{font-size:1.18rem!important}.fj-mobile-nav button.active{background:rgba(57,255,136,.12)!important;color:#39ff88!important}
        .fj-reminders{padding:0 12px 40px}.fj-reminder-card{padding:18px 14px;border-radius:18px}.fj-reminder-card h2{font-size:1.35rem}.fj-reminder-card>p{font-size:.78rem;line-height:1.45}.fj-reminder-grid{grid-template-columns:1fr;gap:8px}.fj-reminder{padding:12px}.fj-reminder span{font-size:.75rem}.fj-reminder-action button{width:100%;font-size:.78rem}
      }
    `;
    document.head.appendChild(s);
  }

  function setActive(){
    const id=currentId();
    document.querySelectorAll('[data-menu-id]').forEach(el=>el.classList.toggle('active',el.dataset.menuId===id));
    document.querySelectorAll('.fj-mobile-nav [data-target]').forEach(el=>el.classList.toggle('active',el.dataset.target===id));
  }

  function authClient(){
    if(window.supabaseClient?.auth) return window.supabaseClient;
    if(window.supabase?.createClient){
      try{
        window.__fjSharedSupabase=window.__fjSharedSupabase||window.supabase.createClient('https://pgfgmxeqisrwkrwtvbum.supabase.co','sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh');
        return window.__fjSharedSupabase;
      }catch(e){}
    }
    return null;
  }

  function authAction(){
    const path=location.pathname.toLowerCase();
    if(window.supabaseClient?.auth?.signOut || window.__fjSharedSupabase?.auth?.signOut){
      const client=window.supabaseClient||window.__fjSharedSupabase;
      client.auth.signOut().then(()=>{
        if(path.endsWith('/profile.html')||path.endsWith('/profile')) location.href='./index.html';
      });
      return;
    }
    if(window.logout){window.logout();return}
    location.href='./index.html';
  }

  function loginAction(){
    if(typeof window.openAuth==='function'){window.openAuth('login');return}
    sessionStorage.setItem('fj_open_login','1');
    location.href='./index.html';
  }

  function updateAuthButton(session){
    const button=document.querySelector('.fj-menu-user button');
    if(!button)return;
    const logged=!!session;
    button.textContent=logged?'Cerrar sesión 🚪':'Iniciar sesión 🔐';
    button.onclick=logged?authAction:loginAction;
    button.setAttribute('aria-label',logged?'Cerrar sesión':'Iniciar sesión');
  }

  async function syncAuth(){
    const client=authClient();
    if(!client?.auth){updateAuthButton(null);return}
    try{
      const {data}=await client.auth.getSession();
      updateAuthButton(data?.session||null);
      client.auth.onAuthStateChange((_event,session)=>updateAuthButton(session));
    }catch(e){updateAuthButton(null)}
  }

  function ensureReminders(){
    if(location.pathname.toLowerCase().endsWith('/profile.html')||location.pathname.toLowerCase().endsWith('/profile'))return;
    if(document.getElementById('pagos'))return;
    const main=document.querySelector('main');
    if(!main)return;
    const section=document.createElement('section');
    section.id='pagos';
    section.className='fj-reminders';
    section.innerHTML=`<div class="fj-reminder-card"><h2>🔔 Mis recordatorios</h2><p>Ten presentes tus pagos y revisiones para mantener tus finanzas organizadas.</p><div class="fj-reminder-grid"><div class="fj-reminder"><strong>📅 Revisa tus gastos</strong><span>Haz una revisión al menos una vez por semana.</span></div><div class="fj-reminder"><strong>💰 Revisa tus metas</strong><span>Comprueba cuánto llevas ahorrado y qué te falta.</span></div><div class="fj-reminder"><strong>🧾 Registra tus pagos</strong><span>Anota cada gasto importante para no perder el control.</span></div><div class="fj-reminder"><strong>🔎 Revisa antes de comprar</strong><span>Piensa si la compra está dentro de tu presupuesto.</span></div></div><div class="fj-reminder-action"><button type="button" onclick="navigateToSection('herramientas')">Ir a Finanzas</button><button type="button" class="secondary" onclick="navigateToSection('panel')">Ver mi panel</button></div></div>`;
    const cta=main.querySelector('.cta')?.closest('section');
    if(cta)main.insertBefore(section,cta);else main.appendChild(section);
  }

  window.navigateToSection=function(id){navigate('./index.html#'+id)};

  function build(){
    styles();
    document.querySelectorAll('.fj-mobile-nav').forEach((el,i)=>{if(i>0)el.remove()});
    let header=document.body.querySelector(':scope>header');
    if(!header){header=document.createElement('header');document.body.prepend(header)}
    let nav=header.querySelector('nav');
    if(!nav){nav=document.createElement('nav');header.replaceChildren(nav)}
    const logo=document.createElement('div');logo.className='fj-shared-logo';logo.innerHTML='Finanzas<span>Jóvenes</span>';
    const links=document.createElement('div');links.className='fj-menu-links';
    ITEMS.forEach(item=>{const a=document.createElement('a');a.href=item.href;a.dataset.menuId=item.id;a.textContent=item.icon+' '+item.label;a.addEventListener('click',e=>{const url=new URL(item.href,location.href);if(url.pathname===location.pathname){e.preventDefault();navigate(item.href)}});links.appendChild(a)});
    const user=document.createElement('div');user.className='fj-menu-user';
    const auth=document.createElement('button');auth.type='button';user.appendChild(auth);nav.replaceChildren(logo,links,user);
    let mobile=document.querySelector('.fj-mobile-nav');
    if(!mobile){mobile=document.createElement('nav');mobile.className='fj-mobile-nav';mobile.setAttribute('aria-label','Navegación móvil');document.body.appendChild(mobile)}
    mobile.replaceChildren();ITEMS.forEach(item=>{const b=document.createElement('button');b.type='button';b.dataset.target=item.id;b.innerHTML='<span>'+item.icon+'</span>'+item.label;b.addEventListener('click',()=>navigate(item.href));mobile.appendChild(b)});
    setActive();updateAuthButton(null);ensureReminders();syncAuth();
  }

  function start(){
    build();
    window.addEventListener('hashchange',()=>{setActive();ensureReminders()});
    const observer=new MutationObserver(()=>{
      const header=document.body.querySelector(':scope>header');
      const links=header?.querySelector('.fj-menu-links');
      const mobile=document.querySelector('.fj-mobile-nav');
      if(!links||!mobile||links.children.length!==ITEMS.length)build();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();