/* Finanzas Jóvenes — cargador de módulos compartidos */
(function(){
  'use strict';
  function load(src){
    const s=document.createElement('script');
    s.src=src;
    s.defer=true;
    document.head.appendChild(s);
  }
  load('profile-menu-sync.js?v=7');
  load('fix-games-menu.js?v=1');
  load('pwa.js?v=1');
})();
