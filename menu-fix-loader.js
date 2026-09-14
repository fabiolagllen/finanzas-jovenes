/* Carga mejoras del sitio */
(function(){
  const games=document.createElement('script');
  games.src='fix-games-menu.js';
  document.body.appendChild(games);

  const pwa=document.createElement('script');
  pwa.src='pwa.js';
  document.body.appendChild(pwa);
})();