/* FinanJoven — alertas financieras + Web Push */
(function(){
  'use strict';

  const SUPABASE_URL='https://pgfgmxeqisrwkrwtvbum.supabase.co';
  const SUPABASE_KEY='sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';
  const VAPID_PUBLIC_KEY='BGyqM2bOQwPoJp9fPKVh_qoY5_q43Zk7fwPQ2LFAcD2Fb4MWt0a8SoTd-z1W33b_rmCWD8eGppMS6ClyP_GTbN4';
  const LAST_NOTICE_KEY='fjLastFinancialNotice';
  const CHECK_INTERVAL=24*60*60*1000;
  let db=null;

  function canNotify(){
    return 'Notification' in window && 'serviceWorker' in navigator && window.isSecureContext;
  }

  async function getDb(){
    if(db) return db;
    try{
      if(window.supabase && typeof window.supabase.createClient==='function'){
        db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      }
    }catch(e){ console.warn('FinanJoven: no se pudo preparar alertas.',e); }
    return db;
  }

  async function getUser(){
    const client=await getDb();
    if(!client) return null;
    try{
      const {data,error}=await client.auth.getUser();
      if(error || !data || !data.user) return null;
      return data.user;
    }catch(e){ return null; }
  }

  function monthRange(){
    const now=new Date();
    const start=new Date(now.getFullYear(),now.getMonth(),1);
    const next=new Date(now.getFullYear(),now.getMonth()+1,1);
    const iso=d=>d.toISOString().slice(0,10);
    return {start:iso(start),end:iso(next)};
  }

  async function countRows(table,userId,dateColumn){
    const client=await getDb();
    if(!client) return 0;
    try{
      let query=client.from(table).select('id',{count:'exact',head:true}).eq('user_id',userId);
      if(dateColumn){
        const r=monthRange();
        query=query.gte(dateColumn,r.start).lt(dateColumn,r.end);
      }
      const {count,error}=await query;
      if(error) return 0;
      return Number(count||0);
    }catch(e){ return 0; }
  }

  async function getFinancialStatus(userId){
    const [expenses,budgets,goals]=await Promise.all([
      countRows('expenses',userId,'expense_date'),
      countRows('budgets',userId,null),
      countRows('savings_goals',userId,null)
    ]);
    return {expenses,budgets,goals};
  }

  function shouldNotify(type){
    try{
      const saved=JSON.parse(localStorage.getItem(LAST_NOTICE_KEY)||'{}');
      return !saved[type] || Date.now()-saved[type]>CHECK_INTERVAL;
    }catch(e){ return true; }
  }

  function markNotified(type){
    try{
      const saved=JSON.parse(localStorage.getItem(LAST_NOTICE_KEY)||'{}');
      saved[type]=Date.now();
      localStorage.setItem(LAST_NOTICE_KEY,JSON.stringify(saved));
    }catch(e){}
  }

  async function showNotice(title,body,type){
    if(!canNotify() || Notification.permission!=='granted' || !shouldNotify(type)) return false;
    try{
      const registration=await navigator.serviceWorker.ready;
      await registration.showNotification(title,{body,icon:'./icon.svg',badge:'./icon.svg',tag:'finanjoven-'+type,renotify:false,data:{url:'./#panel'}});
      markNotified(type);
      return true;
    }catch(e){
      console.warn('FinanJoven: no se pudo mostrar la alerta.',e);
      return false;
    }
  }

  function urlBase64ToUint8Array(base64String){
    const padding='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
    const rawData=atob(base64);
    return Uint8Array.from([...rawData].map(char=>char.charCodeAt(0)));
  }

  async function subscribeToPush(){
    if(!canNotify() || Notification.permission!=='granted' || !('PushManager' in window)) return false;
    const user=await getUser();
    if(!user) return false;
    try{
      const registration=await navigator.serviceWorker.ready;
      let subscription=await registration.pushManager.getSubscription();
      if(!subscription){
        subscription=await registration.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }
      const json=subscription.toJSON();
      const endpoint=json.endpoint;
      const p256dh=json.keys && json.keys.p256dh;
      const auth=json.keys && json.keys.auth;
      if(!endpoint || !p256dh || !auth) return false;
      const client=await getDb();
      if(!client) return false;
      const {error}=await client.from('push_subscriptions').upsert({
        user_id:user.id,
        endpoint,
        p256dh,
        auth,
        user_agent:navigator.userAgent,
        updated_at:new Date().toISOString()
      },{onConflict:'endpoint'});
      if(error){
        console.warn('FinanJoven: no se pudo guardar la suscripción push.',error);
        return false;
      }
      return true;
    }catch(e){
      console.warn('FinanJoven: no se pudo activar Web Push.',e);
      return false;
    }
  }

  async function requestPermission(){
    if(!canNotify()) return 'unsupported';
    if(Notification.permission==='granted'){
      await subscribeToPush();
      return 'granted';
    }
    if(Notification.permission==='denied') return 'denied';
    try{
      const result=await Notification.requestPermission();
      if(result==='granted') await subscribeToPush();
      return result;
    }catch(e){return 'denied';}
  }

  function createButton(){
    if(document.getElementById('fjNotificationButton')) return;
    if(!canNotify()) return;
    const style=document.createElement('style');
    style.textContent=`#fjNotificationButton{position:fixed;right:22px;bottom:95px;z-index:9997;width:48px;height:48px;border:1px solid rgba(57,255,136,.28);border-radius:50%;background:rgba(9,18,12,.92);color:#39ff88;box-shadow:0 10px 30px #0009;cursor:pointer;font-size:21px;backdrop-filter:blur(12px);transition:.2s}#fjNotificationButton:hover{transform:translateY(-2px);border-color:rgba(57,255,136,.55);box-shadow:0 13px 35px #000b,0 0 18px rgba(57,255,136,.12)}@media(max-width:900px){#fjNotificationButton{right:17px;bottom:145px;width:46px;height:46px}}`;
    document.head.appendChild(style);
    const button=document.createElement('button');
    button.id='fjNotificationButton';
    button.type='button';
    button.title='Activar recordatorios';
    button.setAttribute('aria-label','Activar recordatorios de FinanJoven');
    button.textContent='🔔';
    button.addEventListener('click',async()=>{
      const result=await requestPermission();
      if(result==='granted'){
        button.textContent='🔔';
        button.title='Recordatorios activos';
        await checkFinancialStatus(true);
      }else if(result==='denied'){
        button.textContent='🔕';
        button.title='Notificaciones bloqueadas por el navegador';
      }
    });
    document.body.appendChild(button);
    updateButton();
  }

  function updateButton(){
    const button=document.getElementById('fjNotificationButton');
    if(!button) return;
    if(Notification.permission==='granted'){button.textContent='🔔';button.title='Recordatorios activos';}
    else if(Notification.permission==='denied'){button.textContent='🔕';button.title='Notificaciones bloqueadas por el navegador';}
    else{button.textContent='🔔';button.title='Activar recordatorios';}
  }

  async function checkFinancialStatus(force){
    if(!canNotify() || Notification.permission!=='granted') return;
    if(!force && !shouldNotify('daily-check')) return;
    const user=await getUser();
    if(!user) return;
    const status=await getFinancialStatus(user.id);
    if(status.expenses===0) await showNotice('💚 FinanJoven','Aún no has registrado gastos de este mes. Llevarlos al día te ayudará a conocer mejor en qué utilizas tu dinero.','expenses');
    else if(status.budgets===0) await showNotice('📊 FinanJoven','Todavía no tienes un presupuesto guardado. Puedes crear uno para organizar mejor tus ingresos y gastos.','budget');
    else if(status.goals===0) await showNotice('🎯 FinanJoven','Aún no tienes una meta de ahorro guardada. Crear una meta puede ayudarte a darle un objetivo a tu ahorro.','goal');
    markNotified('daily-check');
  }

  async function init(){
    if(!canNotify()) return;
    createButton();
    updateButton();
    if(Notification.permission==='granted'){
      setTimeout(()=>{subscribeToPush();checkFinancialStatus(false);},1800);
    }
  }

  window.FinanJovenNotifications={requestPermission,checkFinancialStatus,updateButton,subscribeToPush};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();