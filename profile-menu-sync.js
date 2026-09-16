/* Finanzas Jóvenes — menú compartido del perfil */
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
  function buildDesktop(){
    const nav=document.querySelector('header nav');
    if(!nav)return;
    const logo=nav.querySelector('.logo')||Object.assign(document.createElement('div'),{className:'logo'});
    logo.innerHTML='Finanzas<span>Jóvenes</span>';
    const links=document.createElement('div');
    ITEMS.forEach(item=>{
      const a=document.createElement('a');
      a.href=item.href;
      a.dataset.menuId=item.id;
      a.textContent=item.icon+' '+item.label;
      if(item.id==='perfil')a.classList.add('active');
      links.appendChild(a);
    });
    const user=document.createElement('div');
    user.className='nav-user';
    const button=document.createElement('button');
    button.className='nav-button secondary';
    button.type='button';
    button.id='profileMenuLogout';
    button.textContent='Cerrar sesión 🚪';
    button.addEventListener('click',()=>window.logoutPage?.());
    user.appendChild(button);
    nav.replaceChildren(logo,links,user);
  }
  function buildMobile(){
    let nav=document.querySelector('.fj-mobile-nav');
    if(!nav){nav=document.createElement('nav');nav.className='fj-mobile-nav';nav.setAttribute('aria-label','Navegación móvil');document.body.appendChild(nav);}
    nav.replaceChildren();
    ITEMS.forEach(item=>{
      const a=document.createElement('a');
      a.href=item.href;
      a.dataset.menuId=item.id;
      a.className=item.id==='perfil'?'active':'';
      a.innerHTML='<span>'+item.icon+'</span>'+item.label;
      nav.appendChild(a);
    });
  }
  function init(){buildDesktop();buildMobile();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();