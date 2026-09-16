/* Finanzas Jóvenes — blindaje de autenticación */
(function(){
  'use strict';

  function ensure(id,tag='div'){
    let el=document.getElementById(id);
    if(el)return el;
    el=document.createElement(tag);
    el.id=id;
    if(document.body)document.body.appendChild(el);
    return el;
  }

  function ensureAuthDom(){
    ensure('authModal','div');
    ensure('authTitle','h2');
    ensure('authSubtitle','p');
    ensure('nameField','div');
    ensure('authName','input');
    ensure('authEmail','input');
    ensure('authPassword','input');
    ensure('authSubmit','button');
    ensure('modeButton','button');
    ensure('authMessage','div');
    ensure('authForm','form');
  }

  function safeOpenAuth(mode){
    ensureAuthDom();
    try{
      if(typeof window.updateAuthMode==='function')window.updateAuthMode();
    }catch(e){
      const title=document.getElementById('authTitle');
      const subtitle=document.getElementById('authSubtitle');
      const nameField=document.getElementById('nameField');
      const name=document.getElementById('authName');
      const submit=document.getElementById('authSubmit');
      const modeButton=document.getElementById('modeButton');
      if(title)title.textContent=mode==='signup'?'Crear cuenta':'Iniciar sesión';
      if(subtitle)subtitle.textContent=mode==='signup'?'Crea tu cuenta para guardar tus avances.':'Entra a tu cuenta para continuar con Finanzas Jóvenes.';
      if(nameField)nameField.style.display=mode==='signup'?'block':'none';
      if(name)name.required=mode==='signup';
      if(submit)submit.textContent=mode==='signup'?'Registrarme':'Iniciar sesión';
      if(modeButton)modeButton.textContent=mode==='signup'?'Ya tengo una cuenta':'Crear una cuenta';
    }
    const modal=document.getElementById('authModal');
    if(modal)modal.classList.add('show');
  }

  function safeCloseAuth(){
    const modal=document.getElementById('authModal');
    const msg=document.getElementById('authMessage');
    if(modal)modal.classList.remove('show');
    if(msg)msg.className='auth-message';
  }

  function safeRenderUser(session){
    const box=document.getElementById('userBox');
    const message=document.getElementById('dashboardMessage');
    const logged=!!session;
    if(box){
      box.style.display=logged?'block':'none';
      if(logged)box.textContent='👋 Hola, '+(session.user.user_metadata?.full_name||session.user.email||'');
    }
    if(message)message.textContent=logged?'Tu panel se actualiza con tus movimientos financieros de este mes.':'Inicia sesión para guardar y consultar tus datos financieros.';
  }

  function install(){
    ensureAuthDom();
    window.openAuth=safeOpenAuth;
    window.closeAuth=safeCloseAuth;
    window.renderUser=safeRenderUser;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
