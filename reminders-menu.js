/* Finanzas Jóvenes — orden y nombre del menú de recordatorios */
(function(){
  'use strict';

  function fixMenu(){
    const desktop=document.querySelector('header nav > div:nth-child(2)');
    if(desktop){
      const reminder=desktop.querySelector('a[href="#pagos"], .fj-desktop-payments');
      const profile=desktop.querySelector('a.fj-desktop-profile, a[href="./profile.html"]');
      if(reminder){
        reminder.innerHTML='🔔 Recordatorios';
        reminder.setAttribute('aria-label','Recordatorios');
        desktop.appendChild(reminder);
      }
      if(profile){
        /* Perfil queda antes de Recordatorios */
        desktop.appendChild(profile);
        if(reminder)desktop.appendChild(reminder);
      }
    }

    const mobile=document.querySelector('.fj-mobile-nav');
    if(mobile){
      const reminder=mobile.querySelector('button[data-target="pagos"]');
      const profile=mobile.querySelector('button[data-target="perfil"]');
      if(reminder){
        reminder.innerHTML='<span>🔔</span>Recordatorios';
        reminder.setAttribute('aria-label','Recordatorios');
        mobile.appendChild(reminder);
      }
      if(profile){
        mobile.appendChild(profile);
        if(reminder)mobile.appendChild(reminder);
      }
    }

    const hero=document.querySelector('.hero-buttons a[href="#pagos"]');
    if(hero)hero.textContent='Ver mis recordatorios 🔔';

    const section=document.querySelector('#pagos h2');
    if(section)section.textContent='🔔 Mis recordatorios';
  }

  function start(){
    fixMenu();
    let tries=0;
    const timer=setInterval(()=>{
      fixMenu();
      tries++;
      if(tries>30)clearInterval(timer);
    },250);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
