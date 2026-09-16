/* Finanzas Jóvenes — menú idéntico al de Inicio */
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

  function addExactMobileStyles(){
    if(document.getElementById('fjSharedMenuStyles')) return;
    const style=document.createElement('style');
    style.id='fjSharedMenuStyles';
    style.textContent=`
      .fj-mobile-nav{display:none;position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:68px!important;padding:7px!important;align-items:stretch!important;justify-content:space-around!important;gap:4px!important;background:rgba(8,17,12,.96)!important;border:1px solid rgba(57,255,136,.22)!important;border-radius:22px!important;box-shadow:0 15px 45px rgba(0,0,0,.55),0 0 25px rgba(57,255,136,.08)!important;backdrop-filter:blur(18px)!important;z-index:9998!important}
      .fj-mobile-nav button{flex:1!important;min-width:0!important;border:0!important;background:transparent!important;color:#8fa197!important;border-radius:16px!important;font-size:.66rem!important;font-weight:800!important;cursor:pointer!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;line-height:1.15!important}
      .fj-mobile-nav button span{font-size:1.18rem!important}.fj-mobile-nav button.active{background:rgba(57,255,136,.12)!important;color:#39ff88!important}
      .fj-desktop-profile,.fj-desktop-payments{display:flex!important}
      @media(max-width:900px){body{padding-bottom:94px!important;overflow-x:hidden!important}.fj-mobile-nav{display:flex!important}}
      @media(max-width:380px){.fj-mobile-nav{left:6px!important;right:6px!important;bottom:6px!important;height:65px!important}.fj-mobile-nav button{font-size:.57rem!important}.fj-mobile-nav button span{font-size:1.05rem!important}}
      @media(min-width:901px){.fj-desktop-profile,.fj-desktop-payments{display:flex!important}}
    `;
    document.head.appendChild(style);
  }

  function buildDesktop(){
    const nav=document.querySelector('header nav');
    if(!nav)return;

    const logo=document.createElement('div');
    logo.className='logo';
    logo.innerHTML='Finanzas<span>Jóvenes</span>';

    const links=document.createElement('div');
    ITEMS.forEach(item=>{
      const a=document.createElement('a');
      a.href=item.href;
      a.dataset.menuId=item.id;
      a.className='fj-desktop-'+item.id;
      a.textContent=item.icon+' '+item.label;
      if(item.id==='perfil')a.classList.add('active');
      links.appendChild(a);
    });

    const user=document.createElement('div');
    user.className='nav-user';
    const logout=document.createElement('button');
    logout.className='nav-button secondary';
    logout.type='button';
    logout.textContent='Cerrar sesión 🚪';
    logout.addEventListener('click',()=>window.logoutPage?.());
    user.appendChild(logout);

    nav.replaceChildren(logo,links,user);
  }

  function buildMobile(){
    let nav=document.querySelector('.fj-mobile-nav');
    if(!nav){
      nav=document.createElement('nav');
      nav.className='fj-mobile-nav';
      nav.setAttribute('aria-label','Navegación móvil');
      document.body.appendChild(nav);
    }

    nav.replaceChildren();
    ITEMS.forEach(item=>{
      const button=document.createElement('button');
      button.type='button';
      button.dataset.target=item.id;
      button.innerHTML='<span>'+item.icon+'</span>'+item.label;
      if(item.id==='perfil')button.classList.add('active');
      button.addEventListener('click',()=>{ location.href=item.href; });
      nav.appendChild(button);
    });
  }

  function init(){
    addExactMobileStyles();
    buildDesktop();
    buildMobile();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
