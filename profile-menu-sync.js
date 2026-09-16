/* Finanzas Jóvenes — menú idéntico al de Inicio en Perfil */
(function(){
  'use strict';

  /*
   * Inicio ya tiene la navegación principal en mobile-app.js.
   * En Perfil reutilizamos esa misma lógica en lugar de mantener
   * una segunda versión del menú.
   */
  function loadMainNavigation(){
    if(document.querySelector('script[data-fj-main-navigation]')) return;
    const script=document.createElement('script');
    script.src='./mobile-app.js?v=10';
    script.dataset.fjMainNavigation='true';
    document.head.appendChild(script);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',loadMainNavigation,{once:true});
  }else{
    loadMainNavigation();
  }
})();
