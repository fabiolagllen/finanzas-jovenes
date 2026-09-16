/* Finanzas Jóvenes — pagos y recordatorios */
(function(){
  'use strict';
  const SUPABASE_URL='https://pgfgmxeqisrwkrwtvbum.supabase.co';
  const SUPABASE_KEY='sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';
  let db=null,currentUser=null;

  function getDb(){
    if(db)return db;
    if(window.supabase&&typeof window.supabase.createClient==='function')db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    return db;
  }
  async function getUser(){const c=getDb();if(!c)return null;try{const {data}=await c.auth.getUser();return data?.user||null}catch(e){return null}}
  function money(n){return 'Q '+Number(n||0).toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function escapeHtml(t){return String(t??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function formatDate(v){try{return new Date(v+'T00:00:00').toLocaleDateString('es-GT',{day:'numeric',month:'short',year:'numeric'})}catch(e){return v}}
  function daysUntil(v){const a=new Date();a.setHours(0,0,0,0);const b=new Date(v+'T00:00:00');return Math.round((b-a)/86400000)}

  function styles(){
    if(document.getElementById('fjPaymentsStyle'))return;
    const s=document.createElement('style');s.id='fjPaymentsStyle';s.textContent=`
#pagos .payments-shell{background:linear-gradient(145deg,rgba(15,29,20,.98),rgba(5,12,8,.99));border:1px solid rgba(57,255,136,.16);border-radius:30px;padding:34px;box-shadow:0 28px 85px rgba(0,0,0,.42)}
.payments-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:24px}.payments-head h2{font-size:2.25rem;letter-spacing:-1px}.payments-head p{color:#87968e;max-width:650px;margin-top:5px}.payment-permission{padding:14px 16px;border-radius:14px;background:rgba(57,255,136,.045);border:1px solid rgba(57,255,136,.14);color:#b9d8c4;font-size:.82rem;margin-bottom:18px}.payment-permission button{margin-top:10px}.payment-grid{display:grid;grid-template-columns:.78fr 1.22fr;gap:16px}.payment-form,.payment-list{background:rgba(255,255,255,.018);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:22px}.payment-form h3,.payment-list h3{margin-bottom:5px}.payment-form p,.payment-list>p{color:#87968e;font-size:.86rem;margin-bottom:14px}.payment-form .button{margin-top:16px;width:100%}.payment-list{min-width:0}.payment-item{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.16);border-radius:15px;margin-top:9px}.payment-item.soon{border-color:rgba(255,226,122,.25)}.payment-item.today{border-color:rgba(255,105,120,.3)}.payment-main{min-width:0}.payment-title{font-weight:800}.payment-meta{font-size:.78rem;color:#87968e;margin-top:3px}.payment-amount{color:#39ff88;font-weight:900;white-space:nowrap}.payment-actions{display:flex;align-items:center;gap:7px}.payment-actions button{border:1px solid rgba(255,255,255,.08);background:transparent;color:#9fb0a6;border-radius:9px;padding:7px 9px;cursor:pointer}.payment-actions .pay{color:#39ff88;border-color:rgba(57,255,136,.2)}.payment-empty{padding:35px 10px;text-align:center;color:#87968e}.payment-status{margin-top:12px;font-size:.78rem;color:#87968e}.payment-status.good{color:#8fffb5}.payment-status.warn{color:#ffcf91}
@media(max-width:900px){#pagos{padding:42px 14px!important}#pagos .payments-shell{padding:18px 12px!important;border-radius:20px!important}.payments-head{display:block;margin-bottom:17px}.payments-head h2{font-size:1.45rem}.payments-head p{font-size:.78rem;line-height:1.45}.payment-grid{grid-template-columns:1fr!important;gap:10px}.payment-form,.payment-list{padding:15px 12px!important;border-radius:15px}.payment-form h3,.payment-list h3{font-size:1rem}.payment-form p,.payment-list>p{font-size:.74rem}.payment-item{padding:11px 9px;gap:8px}.payment-title{font-size:.8rem}.payment-meta{font-size:.66rem}.payment-amount{font-size:.82rem}.payment-actions button{font-size:.67rem;padding:6px 7px}.payment-actions{flex-wrap:wrap;justify-content:flex-end}.payment-permission{font-size:.73rem;padding:11px}.payment-form .input{font-size:16px!important;min-height:44px}.payment-form .button{font-size:.8rem;padding:10px}}
`;
    document.head.appendChild(s);
  }

  function build(){
    if(document.getElementById('pagos'))return;
    styles();
    const panel=document.getElementById('panel');
    if(!panel||!panel.parentNode)return;
    const sec=document.createElement('section');sec.id='pagos';
    sec.innerHTML=`<div class="payments-shell"><div class="payments-head"><div><h2>🔔 Mis pagos</h2><p>Registra pagos que tengas pendientes y recibe un aviso cuando se acerque la fecha. Por ejemplo: colegio, internet, transporte o una mensualidad.</p></div></div><div id="paymentPermission" class="payment-permission" style="display:none"></div><div class="payment-grid"><div class="payment-form"><h3>➕ Agregar pago</h3><p>Indica qué debes pagar, cuánto y cuándo.</p><label for="paymentTitle">Nombre del pago</label><input class="input" id="paymentTitle" placeholder="Ej. Colegio"><label for="paymentAmount">Monto (Q)</label><input class="input" id="paymentAmount" type="number" min="0.01" step="0.01" placeholder="Ej. 450"><label for="paymentDate">Fecha de pago</label><input class="input" id="paymentDate" type="date"><label for="paymentReminder">Avisarme</label><select class="input" id="paymentReminder"><option value="0">El mismo día</option><option value="1" selected>1 día antes</option><option value="2">2 días antes</option><option value="3">3 días antes</option><option value="7">7 días antes</option></select><button class="button" id="savePayment">Guardar pago 🔔</button><div id="paymentFormStatus" class="payment-status"></div></div><div class="payment-list"><h3>📅 Próximos pagos</h3><p>Los pagos pendientes aparecerán aquí.</p><div id="paymentList"><div class="payment-empty">Cargando...</div></div></div></div></div>`;
    panel.parentNode.insertBefore(sec,panel);
    document.getElementById('savePayment').addEventListener('click',savePayment);
    document.getElementById('paymentDate').min=new Date().toISOString().slice(0,10);
    document.getElementById('paymentDate').value=new Date(Date.now()+86400000).toISOString().slice(0,10);
  }

  async function ensurePushSubscription(){
    const u=currentUser||await getUser();
    if(!u)return {ok:false,message:'Inicia sesión para activar los avisos.'};
    if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))return {ok:false,message:'Tu navegador no admite notificaciones push.'};
    if(Notification.permission==='denied')return {ok:false,message:'Las notificaciones están bloqueadas en el navegador.'};
    try{
      const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
      if(permission!=='granted')return {ok:false,message:'No se concedió permiso para las notificaciones.'};
      const registration=await navigator.serviceWorker.ready;
      let subscription=await registration.pushManager.getSubscription();
      if(!subscription){
        const {data,error}=await db.functions.invoke('notification-config');
        if(error||!data?.publicKey)throw new Error('No se pudo obtener la configuración de avisos.');
        const key=base64ToUint8(data.publicKey);
        subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
      }
      const json=subscription.toJSON();
      const {error}=await db.from('push_subscriptions').upsert({user_id:u.id,endpoint:json.endpoint,p256dh:json.keys?.p256dh,auth:json.keys?.auth,user_agent:navigator.userAgent},{onConflict:'endpoint'});
      if(error)throw error;
      return {ok:true,message:'Avisos activados. Te recordaremos tus próximos pagos.'};
    }catch(e){return {ok:false,message:e.message||'No se pudieron activar los avisos.'}}
  }
  function base64ToUint8(base64){const pad='='.repeat((4-base64.length%4)%4),raw=atob((base64+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))}

  async function setupPermission(){
    const box=document.getElementById('paymentPermission');if(!box)return;
    const u=currentUser||await getUser();if(!u){box.style.display='block';box.innerHTML='🔐 <strong>Inicia sesión</strong> para guardar tus pagos y recibir recordatorios.';return;}
    if(!('Notification'in window)||Notification.permission!=='granted'){
      box.style.display='block';box.innerHTML='🔔 <strong>Activa los avisos de pagos.</strong><br>Así podremos avisarte cuando se acerque una fecha importante.<br><button class="button" id="enablePaymentPush">Activar avisos</button>';
      document.getElementById('enablePaymentPush').addEventListener('click',async()=>{const r=await ensurePushSubscription();box.innerHTML=r.ok?'✅ '+r.message:'⚠️ '+r.message;if(!r.ok)box.querySelector('button')?.remove()});
    }else{box.style.display='block';box.innerHTML='✅ Los avisos de pagos están activos en este dispositivo.'}
  }

  async function savePayment(){
    const status=document.getElementById('paymentFormStatus'),u=currentUser||await getUser();if(!u){status.textContent='Inicia sesión primero.';status.className='payment-status warn';return}
    const title=document.getElementById('paymentTitle').value.trim(),amount=Number(document.getElementById('paymentAmount').value),due=document.getElementById('paymentDate').value,days=Number(document.getElementById('paymentReminder').value);
    if(!title||amount<=0||!due){status.textContent='Completa todos los campos con datos válidos.';status.className='payment-status warn';return}
    const btn=document.getElementById('savePayment');btn.disabled=true;btn.textContent='Guardando...';
    const {error}=await db.from('payment_reminders').insert({user_id:u.id,title,amount,due_date:due,remind_days_before:days});
    if(error){status.textContent='No se pudo guardar: '+error.message;status.className='payment-status warn';btn.disabled=false;btn.textContent='Guardar pago 🔔';return}
    document.getElementById('paymentTitle').value='';document.getElementById('paymentAmount').value='';status.textContent='✅ Pago guardado. Se revisará automáticamente la fecha del aviso.';status.className='payment-status good';btn.disabled=false;btn.textContent='Guardar pago 🔔';await loadPayments();
    const push=await ensurePushSubscription();if(!push.ok)setupPermission();
  }

  async function loadPayments(){
    const list=document.getElementById('paymentList');if(!list)return;currentUser=await getUser();if(!currentUser){list.innerHTML='<div class="payment-empty">Inicia sesión para ver tus pagos.</div>';return}
    const {data,error}=await db.from('payment_reminders').select('id,title,amount,due_date,remind_days_before,paid').eq('user_id',currentUser.id).eq('paid',false).order('due_date',{ascending:true});
    if(error){list.innerHTML='<div class="payment-empty">No se pudieron cargar los pagos.</div>';return}
    if(!data?.length){list.innerHTML='<div class="payment-empty">✨ No tienes pagos pendientes.</div>';return}
    list.innerHTML=data.map(p=>{const d=daysUntil(p.due_date),cl=d===0?'today':d<=3?'soon':'';const when=d<0?'Vencido':d===0?'Hoy':d===1?'Mañana':`En ${d} días`;return `<div class="payment-item ${cl}"><div class="payment-main"><div class="payment-title">${escapeHtml(p.title)}</div><div class="payment-meta">${formatDate(p.due_date)} · ${when} · aviso ${p.remind_days_before===0?'el mismo día':p.remind_days_before+' día(s) antes'}</div></div><div class="payment-amount">${money(p.amount)}</div><div class="payment-actions"><button class="pay" data-pay="${p.id}">Pagado</button><button data-del="${p.id}">Eliminar</button></div></div>`}).join('');
    list.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>markPaid(b.dataset.pay));list.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>deletePayment(b.dataset.del));
  }
  async function markPaid(id){const u=currentUser||await getUser();if(!u)return;await db.from('payment_reminders').update({paid:true}).eq('id',id).eq('user_id',u.id);await loadPayments()}
  async function deletePayment(id){const u=currentUser||await getUser();if(!u)return;await db.from('payment_reminders').delete().eq('id',id).eq('user_id',u.id);await loadPayments()}

  async function init(){db=getDb();if(!db)return;build();currentUser=await getUser();await loadPayments();await setupPermission();db.auth.onAuthStateChange(async(_e,session)=>{currentUser=session?.user||null;await loadPayments();await setupPermission()});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();