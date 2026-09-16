/* Finanzas Jóvenes — menú único compartido para Inicio y Perfil */
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

  function styles(){
    if(document.getElementById('fjSharedDesktopMenu')) return;
    const s=document.createElement('style');
    s.id='fjSharedDesktopMenu';
    s.textContent=`
      body{padding-left:274px!important}
      header{position:fixed!important;left:22px!important;top:22px!important;bottom:22px!important;width:226px!important;z-index:20!important;background:linear-gradient(180deg,rgba(17,34,24,.96),rgba(6,13,9,.94))!important;border:1px solid rgba(57,255,136,.24)!important;border-radius:32px!important;backdrop-filter:blur(22px)!important;box-shadow:0 24px 75px rgba(0,0,0,.58),0 0 48px rgba(57,255,136,.10),inset 0 1px rgba(255,255,255,.035)!important;overflow:hidden!important}
      header nav{height:100%!important;padding:25px 16px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:25px!important;position:relative!important;z-index:1!important}
      header nav .logo{font-size:1.25rem!important;font-weight:900!important;padding:13px 13px 14px!important;border:1px solid rgba(57,255,136,.14)!important;border-radius:18px!important;background:rgba(57,255,136,.055)!important;letter-spacing:-.5px!important;box-shadow:inset 0 1px rgba(255,255,255,.025)!important}
      header nav .logo span{color:#39ff88!important}
      header nav .fj-menu-links{display:flex!important;flex-direction:column!important;gap:8px!important}
      header nav .fj-menu-links a{position:relative!important;display:flex!important;align-items:center!important;color:#cbd7d0!important;text-decoration:none!important;margin:0!important;padding:12px 13px!important;border-radius:15px!important;font-size:.91rem!important;font-weight:700!important;transition:.22s!important;border:1px solid rgba(255,255,255,.025)!important;background:rgba(255,255,255,.018)!important;box-shadow:0 5px 14px rgba(0,0,0,.10)!important}
      header nav .fj-menu-links a:hover{color:#39ff88!important;background:rgba(57,255,136,.105)!important;border-color:rgba(57,255,136,.20)!important;box-shadow:0 9px 24px rgba(0,0,0,.22),0 0 16px rgba(57,255,136,.05)!important;transform:translateX(4px)!important}
      header nav .fj-menu-links a.active{color:#39ff88!important;background:rgba(57,255,136,.105)!important;border-color:rgba(57,255,136,.20)!important}
      header nav .fj-menu-user{display:flex!important;flex-direction:column!important;gap:9px!important;margin-top:auto!important;padding-top:18px!important}
      header nav .fj-menu-user button{width:100%!important;border:0!important;background:rgba(23,37,29,.92)!important;color:#39ff88!important;padding:10px 15px!important;border-radius:15px!important;font-weight:800!important;cursor:pointer!important;border:1px solid #355440!important}
      @media(max-width:900px){
        body{padding-left:0!important;padding-bottom:94px!important}
        header{display:none!important}
        .fj-mobile-nav{display:flex!important;position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:68px!important;padding:7px!important;align-items:stretch!important;justify-content:space-around!important;gap:4px!important;background:rgba(8,17,12,.96)!important;border:1px solid rgba(57,255,136,.22)!important;border-radius:22px!important;box-shadow:0 15px 45px rgba(0,0,0,.55),0 0 25px rgba(57,255,136,.08)!important;backdrop-filter:blur(18px)!important;z-index:9998!important}
        .fj-mobile-nav button{flex:1!important;min-width:0!important;border:0!important;background:transparent!important;color:#8fa197!important;border-radius:16px!important;font-size:.66rem!important;font-weight:800!important;cursor:pointer!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;line-height:1.15!important}
        .fj-mobile-nav button span{font-size:1.18rem!important}
        .fj-mobile-nav button.active{background:rgba(57,255,136,.12)!important;color:#39ff88!important}
      }
      @media(max-width:380px){.fj-mobile-nav{left:6px!important;right:6px!important;bottom:6px!important;height:65px!important}.fj-mobile-nav button{font-size:.57rem!important}.fj-mobile-nav button span{font-size:1.05rem!important}}
    `;
    document.head.appendChild(s);
  }

  function setActive(){
    const activeId=currentId();
    document.querySelectorAll('[data-menu-id]').forEach(el=>el.classList.toggle('active',el.dataset.menuId===activeId));
    document.querySelectorAll('.fj-mobile-nav [data-target]').forEach(el=>el.classList.toggle('active',el.dataset.target===activeId));
  }

  function build(){
    styles();
    const nav=document.querySelector('header nav');
    if(nav){
      const logo=document.createElement('div');
      logo.className='logo';
      logo.innerHTML='Finanzas<span>Jóvenes</span>';

      const links=document.createElement('div');
      links.className='fj-menu-links';
      ITEMS.forEach(item=>{
        const a=document.createElement('a');
        a.href=item.href;
        a.dataset.menuId=item.id;
        a.textContent=item.icon+' '+item.label;
        links.appendChild(a);
      });

      const user=document.createElement('div');
      user.className='fj-menu-user';
      const logout=document.createElement('button');
      logout.type='button';
      logout.textContent='Cerrar sesión 🚪';
      logout.addEventListener('click',()=>window.logoutPage?.());
      user.appendChild(logout);
      nav.replaceChildren(logo,links,user);
    }

    let mobile=document.querySelector('.fj-mobile-nav');
    if(!mobile){
      mobile=document.createElement('nav');
      mobile.className='fj-mobile-nav';
      mobile.setAttribute('aria-label','Navegación móvil');
      document.body.appendChild(mobile);
    }
    mobile.replaceChildren();
    ITEMS.forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.dataset.target=item.id;
      b.innerHTML='<span>'+item.icon+'</span>'+item.label;
      b.addEventListener('click',()=>location.href=item.href);
      mobile.appendChild(b);
    });

    setActive();
    window.addEventListener('hashchange',setActive);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
