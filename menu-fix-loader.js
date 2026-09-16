/* Carga los módulos globales del sitio en un orden controlado. */
(function(){
  const sharedMenu=document.createElement('script');
  sharedMenu.src='profile-menu-sync.js?v=7';
  sharedMenu.defer=true;
  document.head.appendChild(sharedMenu);

  const games=document.createElement('script');
  games.src='fix-games-menu.js';
  games.defer=true;
  document.body.appendChild(games);

  const pwa=document.createElement('script');
  pwa.src='pwa.js';
  pwa.defer=true;
  document.body.appendChild(pwa);

  const reminders=document.createElement('script');
  reminders.src='reminders-menu.js?v=2';
  reminders.defer=true;
  document.body.appendChild(reminders);
})();