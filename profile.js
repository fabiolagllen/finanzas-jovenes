/* Finanzas Jóvenes — navegación al perfil independiente */
(function(){
  'use strict';
  const SUPABASE_URL='https://pgfgmxeqisrwkrwtvbum.supabase.co';
  const SUPABASE_KEY='sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';
  let db=null;
  async function getDb(){if(db)return db;if(window.supabase&&typeof window.supabase.createClient==='function')db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);return db;}
  function updateProfileMenu(session){const btn=document.querySelector('.fj-mobile-nav button[data-target="perfil"]');if(btn)btn.classList.toggle('fj-profile-visible',!!session);}
  async function init(){
    const c=await getDb();
    if(!c){updateProfileMenu(null);return;}
    const {data:{session}}=await c.auth.getSession();
    updateProfileMenu(session);
    c.auth.onAuthStateChange((_event,newSession)=>updateProfileMenu(newSession));
    document.addEventListener('click',e=>{const btn=e.target.closest?.('.fj-mobile-nav button[data-target="perfil"]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();window.location.href='./perfil.html';},true);
  }
  window.openProfile=function(){window.location.href='./perfil.html';};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
