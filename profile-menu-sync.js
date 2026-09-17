/* Finanzas Jóvenes — menú compartido + control del apartado Recordatorios */
(function(){
  'use strict';
  if(window.__fjSharedMenuBooted || window.__fjSharedMenuStarting) return;
  window.__fjSharedMenuStarting=true;
  const ITEMS=[
    {id:'inicio',icon:'🏠',label:'Inicio',href:'#inicio'},
    {id:'aprende',icon:'📚',label:'Aprende',href:'#aprende'},
    {id:'herramientas',icon:'💰',label:'Finanzas',href:'#herramientas'},
    {id:'panel',icon:'📊',label:'Mi panel',href:'#panel'},
    {id:'pagos',icon:'🔔',label:'Recordatorios',href:'#pagos'}
  ];
  function isProfile(){const p=location.pathname.toLowerCase();return p.endsWith('/profile.html')||p.endsWith('/profile')}
  function currentId(){if(isProfile())return'inicio';const h=location.hash.toLowerCase();if(h==='#aprende')return'aprende';if(h==='#herramientas')return'herramientas';if(h==='#panel')return'panel';if(h==='#pagos')return'pagos';return'inicio'}
  function normalizeSectionOrder(){
    if(isProfile())return;
    const main=document.querySelector('body>main');
    if(!main)return;
    const sections=ITEMS.map(item=>document.getElementById(item.id)).filter(Boolean);
    if(sections.length<2)return;
    sections.forEach(section=>main.appendChild(section));
  }
  function goSection(id){if(isProfile()){location.href='./index.html#'+id;return}const target=document.getElementById(id);if(!target)return;history.pushState(null,'','#'+id);target.scrollIntoView({behavior:'smooth',block:'start'});setActive()}
  function navigate(href){const hash=(href.split('#')[1]||'').trim();if(hash){goSection(hash);return}window.scrollTo({top:0,behavior:'smooth'});history.pushState(null,'',location.pathname);setActive()}
  function loadWineTheme(){
    if(document.getElementById('fjWineTheme'))return;
    const l=document.createElement('link');l.id='fjWineTheme';l.rel='stylesheet';l.href='./theme-wine.css?v=3';document.head.appendChild(l);
  }
  function styles(){
    if(document.getElementById('fjSharedDesktopMenu'))return;
    const s=document.createElement('style');s.id='fjSharedDesktopMenu';s.textContent=`
      :root{--fj-wine:#7A1F3D;--fj-wine-dark:#54152B;--fj-wine-light:#A94B68;--fj-bg:#FFFAF9;--fj-line:#EADDE2}
      body{padding-left:274px!important;background:var(--fj-bg)!important;color:#292529!important}
      body>header{position:fixed!important;left:22px!important;top:22px!important;bottom:22px!important;width:226px!important;height:auto!important;z-index:9997!important;background:rgba(255,255,255,.97)!important;border:1px solid #EADDE2!important;border-radius:32px!important;backdrop-filter:blur(22px)!important;box-shadow:0 24px 65px rgba(84,21,43,.12),inset 0 1px rgba(255,255,255,.9)!important;overflow:hidden!important}
      body>header nav{height:100%!important;padding:25px 16px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:25px!important;position:relative!important;z-index:1!important}
      body>header .fj-shared-logo{font-size:1.25rem!important;font-weight:900!important;padding:13px!important;border:1px solid #EADDE2!important;border-radius:18px!important;background:#FFF7F9!important;color:#292529!important;letter-spacing:-.5px!important}
      body>header .fj-shared-logo span{color:#7A1F3D!important}
      body>header .fj-menu-links{display:flex!important;flex-direction:column!important;gap:8px!important}
      body>header .fj-menu-links a{display:flex!important;align-items:center!important;color:#665D63!important;text-decoration:none!important;margin:0!important;padding:12px 13px!important;border-radius:15px!important;font-size:.91rem!important;font-weight:700!important;transition:.22s!important;border:1px solid transparent!important;background:transparent!important;box-shadow:none!important}
      body>header .fj-menu-links a:hover,body>header .fj-menu-links a.active{color:#7A1F3D!important;background:#F8EEF1!important;border-color:#E4CDD5!important;box-shadow:0 7px 18px rgba(84,21,43,.06)!important}
      body>header .fj-menu-user{display:flex!important;flex-direction:column!important;gap:9px!important;margin-top:0!important;padding-top:18px!important;border-top:1px solid #F0E5E9!important}
      body>header .fj-menu-user button{width:100%!important;background:#7A1F3D!important;color:#fff!important;padding:11px 15px!important;border-radius:15px!important;font-weight:800!important;cursor:pointer!important;border:1px solid #7A1F3D!important;box-shadow:0 10px 24px rgba(122,31,61,.18)!important}
      body>header .fj-menu-user button:hover{background:#54152B!important;border-color:#54152B!important}
      body>header .fj-back-home{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;margin-top:auto!important;padding:10px 12px!important;border:1px solid #EADDE2!important;border-radius:13px!important;background:#FFFFFF!important;color:#6F6870!important;text-decoration:none!important;font-size:.82rem!important;font-weight:800!important;transition:.2s!important;flex-shrink:0!important}
      body>header .fj-back-home:hover{color:#7A1F3D!important;border-color:#CFAFBA!important;background:#F8EEF1!important}
      .fj-mobile-nav{display:none!important}
      #pagos{scroll-margin-top:30px}
      @media(max-width:900px){body{padding-left:0!important;padding-bottom:94px!important}body>header{display:none!important}.fj-mobile-nav{display:flex!important;position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:68px!important;padding:7px!important;align-items:stretch!important;justify-content:space-around!important;gap:4px!important;background:rgba(255,255,255,.98)!important;border:1px solid #EADDE2!important;border-radius:22px!important;box-shadow:0 15px 45px rgba(84,21,43,.14)!important;backdrop-filter:blur(18px)!important;z-index:9998!important}.fj-mobile-nav button{flex:1!important;min-width:0!important;border:0!important;background:transparent!important;color:#82767D!important;border-radius:16px!important;font-size:.66rem!important;font-weight:800!important;cursor:pointer!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;line-height:1.15!important}.fj-mobile-nav button span{font-size:1.18rem!important}.fj-mobile-nav button.active{background:#F8EEF1!important;color:#7A1F3D!important}}
    `;document.head.appendChild(s)
  }
  function setActive(){const id=currentId();document.querySelectorAll('[data-menu-id]').forEach(el=>el.classList.toggle('active',el.dataset.menuId===id));document.querySelectorAll('.fj-mobile-nav [data-target]').forEach(el=>el.classList.toggle('active',el.dataset.target===id))}
  function authClient(){if(window.supabaseClient?.auth)return window.supabaseClient;if(window.supabase?.createClient){try{return window.__fjSharedSupabase=window.__fjSharedSupabase||window.supabase.createClient('https://pgfgmxeqisrwkrwtvbum.supabase.co','sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh')}catch(e){}}return null}
  function authAction(){if(isProfile())return;location.href='./profile.html'}
  function loginAction(){if(typeof window.openAuth==='function'){window.openAuth('login');return}sessionStorage.setItem('fj_open_login','1');location.href='./index.html'}
  function updateAuthButton(session){const button=document.querySelector('.fj-menu-user button');if(!button)return;button.textContent=session?'Perfil 👤':'Iniciar sesión 🔐';button.onclick=session?authAction:loginAction}
  async function syncAuth(){const client=authClient();if(!client?.auth){updateAuthButton(null);return}try{const{data}=await client.auth.getSession();updateAuthButton(data?.session||null);client.auth.onAuthStateChange((_event,session)=>updateAuthButton(session))}catch(e){updateAuthButton(null)}}
  function forceRemindersHub(){if(isProfile())return;const load=()=>{const sec=document.getElementById('pagos');if(!sec)return;if(window.__fjRemindersHubBooted)delete window.__fjRemindersHubBooted;const old=document.querySelector('script[data-fj-reminders-force]');if(old)old.remove();const s=document.createElement('script');s.src='./reminders-hub.js?v=2&force='+Date.now();s.dataset.fjRemindersForce='true';document.body.appendChild(s)};setTimeout(load,900);setTimeout(load,2200)}
  window.navigateToSection=id=>goSection(id);
  function build(){
    normalizeSectionOrder();loadWineTheme();styles();
    document.querySelectorAll('.fj-mobile-nav').forEach((el,i)=>{if(i>0)el.remove()});
    let header=document.body.querySelector(':scope>header');if(!header){header=document.createElement('header');document.body.prepend(header)}
    let nav=header.querySelector('nav');if(!nav){nav=document.createElement('nav');header.appendChild(nav)}
    const logo=document.createElement('div');logo.className='fj-shared-logo';logo.innerHTML='Finanzas<span>Jóvenes</span>';
    const links=document.createElement('div');links.className='fj-menu-links';
    ITEMS.forEach(item=>{const a=document.createElement('a');a.href=item.href;a.dataset.menuId=item.id;a.textContent=item.icon+' '+item.label;a.addEventListener('click',e=>{e.preventDefault();navigate(item.href)});links.appendChild(a)});
    const user=document.createElement('div');user.className='fj-menu-user';
    const auth=document.createElement('button');auth.type='button';user.appendChild(auth);
    nav.replaceChildren(logo,links,user);
    if(isProfile()){
      const back=document.createElement('a');back.className='fj-back-home';back.href='./index.html';back.innerHTML='← Volver al inicio';nav.appendChild(back);
    }
    let mobile=document.querySelector('.fj-mobile-nav');if(!mobile){mobile=document.createElement('nav');mobile.className='fj-mobile-nav';document.body.appendChild(mobile)}
    mobile.replaceChildren();ITEMS.forEach(item=>{const b=document.createElement('button');b.type='button';b.dataset.target=item.id;b.innerHTML='<span>'+item.icon+'</span>'+item.label;b.addEventListener('click',()=>navigate(item.href));mobile.appendChild(b)});
    setActive();updateAuthButton(null);syncAuth();forceRemindersHub();window.__fjSharedMenuBooted=true;window.__fjSharedMenuStarting=false
  }
  function start(){build();window.addEventListener('hashchange',setActive);window.addEventListener('popstate',setActive);const observer=new MutationObserver(()=>{const header=document.body.querySelector(':scope>header');const links=header?.querySelector('.fj-menu-links');const mobile=document.querySelector('.fj-mobile-nav');if(!header||!links||!mobile||links.children.length!==ITEMS.length)build()});observer.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
