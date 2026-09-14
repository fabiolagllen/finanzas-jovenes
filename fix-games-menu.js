/* Fix Finanzas Jóvenes games navigation */
(function(){
  function fix(){
    const nav=document.querySelector('header nav > div:nth-child(2)');
    if(!nav)return;
    let link=nav.querySelector('a[data-fj-games]')||nav.querySelector('a[href="#juegos"]');
    if(!link)return;
    link.href='#fjGames';
    link.dataset.fjGames='true';
    link.textContent='🎮 Juegos';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
})();