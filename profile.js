/* Finanzas Jóvenes — perfil del usuario */
(function(){
  'use strict';
  const SUPABASE_URL='https://pgfgmxeqisrwkrwtvbum.supabase.co';
  const SUPABASE_KEY='sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';
  let db=null;
  let currentUser=null;

  async function getDb(){
    if(db)return db;
    if(window.supabase&&typeof window.supabase.createClient==='function')db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    return db;
  }

  async function getUser(){
    const c=await getDb();
    if(!c)return null;
    try{const {data,error}=await c.auth.getUser();return error||!data?.user?null:data.user;}catch(e){return null;}
  }

  function updateProfileMenu(session){
    const btn=document.querySelector('.fj-mobile-nav button[data-target="perfil"]');
    if(!btn)return;
    btn.classList.toggle('fj-profile-visible',!!session);
  }

  function styles(){
    if(document.getElementById('fjProfileStyle'))return;
    const s=document.createElement('style');s.id='fjProfileStyle';s.textContent=`#fjProfileModal{display:none;position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.78);backdrop-filter:blur(9px);align-items:center;justify-content:center;padding:18px}#fjProfileModal.show{display:flex}.fj-profile-card{width:min(520px,100%);max-height:min(760px,92vh);overflow:auto;background:linear-gradient(145deg,#13251a,#07100b);border:1px solid rgba(57,255,136,.28);border-radius:26px;box-shadow:0 30px 100px #000c;padding:25px;color:#f4faf6;position:relative}.fj-profile-close{position:absolute;right:15px;top:12px;border:0;background:transparent;color:#9eafa5;font-size:1.5rem;cursor:pointer}.fj-profile-head{text-align:center;padding:8px 0 20px;border-bottom:1px solid #294034}.fj-profile-avatar{width:92px;height:92px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;background:#0d2116;border:2px solid #39ff88;color:#39ff88;font-size:2.4rem;font-weight:900;overflow:hidden}.fj-profile-avatar img{width:100%;height:100%;object-fit:cover}.fj-profile-head h2{font-size:1.5rem}.fj-profile-email{color:#9eafa5;font-size:.84rem;margin-top:3px;word-break:break-word}.fj-profile-form{display:grid;gap:10px;margin-top:18px}.fj-profile-form label{margin:0}.fj-profile-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.fj-profile-actions .button{flex:1;min-width:145px}.fj-profile-note{font-size:.78rem;color:#718078;margin-top:9px}.fj-profile-msg{padding:10px 12px;border-radius:10px;font-size:.84rem;display:none}.fj-profile-msg.show{display:block}.fj-profile-msg.ok{background:#0c2416;color:#8fffb5;border:1px solid #28553a}.fj-profile-msg.err{background:#2a1212;color:#ffaaa8;border:1px solid #5c2929}.fj-profile-info{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.fj-profile-info div{padding:13px;border:1px solid #294034;border-radius:14px;background:#0a110d}.fj-profile-info span{display:block;color:#9eafa5;font-size:.76rem}.fj-profile-info strong{display:block;color:#39ff88;margin-top:2px}@media(max-width:600px){#fjProfileModal{padding:10px}.fj-profile-card{border-radius:21px;padding:20px;max-height:94vh}.fj-profile-info{grid-template-columns:1fr}.fj-profile-actions{display:grid}.fj-profile-actions .button{width:100%}}`;document.head.appendChild(s);
  }

  function createModal(){
    if(document.getElementById('fjProfileModal'))return;
    styles();const m=document.createElement('div');m.id='fjProfileModal';m.innerHTML=`<div class="fj-profile-card"><button class="fj-profile-close" id="fjProfileClose" aria-label="Cerrar">×</button><div class="fj-profile-head"><div class="fj-profile-avatar" id="fjProfileAvatar">👤</div><h2 id="fjProfileTitle">Mi perfil</h2><div class="fj-profile-email" id="fjProfileEmail"></div></div><div class="fj-profile-form"><label for="fjProfileName">Nombre</label><input class="input" id="fjProfileName" maxlength="80" placeholder="Tu nombre"><label for="fjProfileNickname">Apodo</label><input class="input" id="fjProfileNickname" maxlength="30" placeholder="¿Cómo quieres que te llamemos?"><label for="fjProfileBio">Sobre mí</label><textarea class="input" id="fjProfileBio" maxlength="180" rows="3" placeholder="Escribe algo sobre ti..."></textarea></div><div class="fj-profile-msg" id="fjProfileMsg"></div><div class="fj-profile-actions"><button class="button" id="fjProfileSave">Guardar cambios 💾</button><button class="button alt" id="fjProfileLogout">Cerrar sesión 🚪</button></div><p class="fj-profile-note">Tu información del perfil se guarda en tu cuenta de Finanzas Jóvenes.</p><div class="fj-profile-info"><div><span>Cuenta</span><strong>Activa</strong></div><div><span>Privacidad</span><strong>Solo tú</strong></div></div></div>`;document.body.appendChild(m);document.getElementById('fjProfileClose').onclick=closeProfile;m.addEventListener('click',e=>{if(e.target===m)closeProfile();});document.getElementById('fjProfileSave').onclick=saveProfile;document.getElementById('fjProfileLogout').onclick=logout;
  }

  function initials(user,profile){const name=(profile?.nickname||profile?.full_name||user?.email?.split('@')[0]||'U').trim();return name.slice(0,1).toUpperCase();}

  async function openProfile(){
    createModal();const user=await getUser();if(!user){updateProfileMenu(null);if(typeof window.openAuth==='function')window.openAuth();return;}currentUser=user;const c=await getDb();let profile=null;if(c){const {data}=await c.from('profiles').select('full_name,nickname,bio,avatar_url').eq('id',user.id).maybeSingle();profile=data||null;}document.getElementById('fjProfileEmail').textContent=user.email||'';document.getElementById('fjProfileName').value=profile?.full_name||user.user_metadata?.full_name||'';document.getElementById('fjProfileNickname').value=profile?.nickname||'';document.getElementById('fjProfileBio').value=profile?.bio||'';document.getElementById('fjProfileTitle').textContent=profile?.nickname||profile?.full_name||'Mi perfil';const av=document.getElementById('fjProfileAvatar');av.innerHTML=profile?.avatar_url?`<img src="${String(profile.avatar_url).replace(/"/g,'&quot;')}" alt="Foto de perfil">`:initials(user,profile);document.getElementById('fjProfileMsg').className='fj-profile-msg';document.getElementById('fjProfileModal').classList.add('show');
  }

  function closeProfile(){document.getElementById('fjProfileModal')?.classList.remove('show');}

  async function saveProfile(){const msg=document.getElementById('fjProfileMsg');const c=await getDb();if(!currentUser||!c){msg.textContent='Tu sesión ya no está disponible. Vuelve a iniciar sesión.';msg.className='fj-profile-msg show err';return;}const full_name=document.getElementById('fjProfileName').value.trim();const nickname=document.getElementById('fjProfileNickname').value.trim();const bio=document.getElementById('fjProfileBio').value.trim();const {error}=await c.from('profiles').upsert({id:currentUser.id,full_name,nickname,bio,updated_at:new Date().toISOString()},{onConflict:'id'});if(error){console.error(error);msg.textContent='No se pudieron guardar los cambios.';msg.className='fj-profile-msg show err';return;}document.getElementById('fjProfileTitle').textContent=nickname||full_name||'Mi perfil';document.getElementById('fjProfileAvatar').textContent=(nickname||full_name||currentUser.email||'U').slice(0,1).toUpperCase();msg.textContent='Perfil actualizado correctamente. 💚';msg.className='fj-profile-msg show ok';setTimeout(()=>msg.className='fj-profile-msg',2500);}

  async function logout(){const c=await getDb();if(c)await c.auth.signOut();updateProfileMenu(null);closeProfile();if(typeof window.openAuth==='function')window.openAuth();}

  function interceptProfileButton(){document.addEventListener('click',e=>{const btn=e.target.closest?.('.fj-mobile-nav button[data-target="perfil"]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();openProfile();},true);}

  async function init(){createModal();interceptProfileButton();const c=await getDb();if(!c){updateProfileMenu(null);return;}const {data:{session}}=await c.auth.getSession();updateProfileMenu(session);c.auth.onAuthStateChange((_event,newSession)=>{updateProfileMenu(newSession);if(newSession)currentUser=newSession.user;else currentUser=null;});}
  window.openProfile=openProfile;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
