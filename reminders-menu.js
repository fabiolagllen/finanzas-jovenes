/* Finanzas Jóvenes — Centro de recordatorios */
(function(){
'use strict';

/* Este módulo puede ser cargado por más de un archivo. Nunca debe inicializarse dos veces. */
if(window.__fjRemindersBooted || window.__fjRemindersStarting) return;
window.__fjRemindersStarting=true;

const $=(s,r=document)=>r.querySelector(s);
let items=[];
let formState={id:null};

function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
function money(v){return 'Q '+Number(v||0).toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2})}
function parseDate(v){return new Date(String(v||'')+'T00:00:00')}
function dateText(v){return parseDate(v).toLocaleDateString('es-GT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
function relative(v){const d=parseDate(v),today=parseDate(new Date().toISOString().slice(0,10)),diff=Math.round((d-today)/86400000);if(diff===0)return 'Hoy';if(diff===1)return 'Mañana';if(diff===-1)return 'Ayer';if(diff>1&&diff<8)return 'En '+diff+' días';if(diff<0)return 'Vencido';return 'Próximo'}
function client(){return window.supabaseClient||null}
async function session(){const c=client();if(!c)return null;try{const {data}=await c.auth.getSession();return data?.session||null}catch(e){console.error(e);return null}}

function styles(){
 if(document.getElementById('fjReminderStyles'))return;
 const s=document.createElement('style');s.id='fjReminderStyles';
 s.textContent=`#pagos.fj-reminders-section{scroll-margin-top:25px}.fj-reminders-app{margin-top:16px;padding:28px;border:1px solid #E6D7DD;border-radius:26px;background:#FFFFFF;box-shadow:0 18px 50px rgba(122,31,61,.10)}.fj-reminders-header{display:flex;gap:16px;align-items:center;padding-bottom:22px}.fj-reminders-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;background:#F6EAF0;border:1px solid #CFAFBA;font-size:27px}.fj-reminders-header h3{margin:0;color:#292929;font-size:1.65rem}.fj-reminders-header p{margin:4px 0 0;color:#6F6870;font-size:.92rem}.fj-reminder-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}.fj-reminder-stat{padding:16px;border-radius:16px;background:#FFFAF9;border:1px solid #E6D7DD}.fj-reminder-stat span{display:block;color:#82948a;font-size:.76rem}.fj-reminder-stat strong{display:block;color:#7A1F3D;font-size:1.5rem;margin-top:2px}.fj-reminder-main{display:grid;grid-template-columns:.9fr 1.1fr;gap:18px}.fj-reminder-card,.fj-reminder-list-wrap{padding:20px;border-radius:19px;background:#FFFFFF;border:1px solid #E6D7DD}.fj-reminder-card h4,.fj-reminder-list-wrap h4{margin:0 0 5px;color:#292929;font-size:1.05rem}.fj-reminder-help{color:#718278;font-size:.8rem;margin-bottom:15px}.fj-reminder-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.fj-reminder-card label{display:grid;gap:6px;color:#554D53;font-size:.78rem;font-weight:700}.fj-reminder-card label.full{grid-column:1/-1}.fj-reminder-card label span{color:#718278;font-weight:400}.fj-reminder-card input,.fj-reminder-card select{box-sizing:border-box;width:100%;border:1px solid #E6D7DD;background:#FFFAF9;color:#292929;border-radius:11px;padding:11px;font:inherit;outline:0}.fj-reminder-card input:focus,.fj-reminder-card select:focus{border-color:#7A1F3D;box-shadow:0 0 0 3px rgba(122,31,61,.08)}.fj-reminder-save{margin-top:13px;width:100%;border:0;border-radius:11px;padding:12px 17px;background:#7A1F3D;color:#FFFFFF;font-weight:800;cursor:pointer}.fj-reminder-save:disabled{opacity:.6;cursor:wait}.fj-reminder-message{margin-top:12px;padding:10px 12px;border-radius:10px;font-size:.83rem;display:none}.fj-reminder-message.show{display:block}.fj-reminder-message.error{background:#FFF0F0;color:#ffaaa8;border:1px solid #E4B2B2}.fj-reminder-message.success{background:#F6EAF0;color:#54152B;border:1px solid #CFAFBA}.fj-reminder-filter{display:flex;gap:7px;margin:12px 0 14px;flex-wrap:wrap}.fj-reminder-filter button{border:1px solid #E6D7DD;background:#FFFFFF;color:#6F6870;border-radius:999px;padding:7px 11px;cursor:pointer;font-size:.75rem}.fj-reminder-filter button.active{background:#F6EAF0;color:#7A1F3D;border-color:#7A1F3D}.fj-reminder-list{display:grid;gap:9px;max-height:520px;overflow:auto;padding-right:2px}.fj-reminder-item{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;padding:14px;border:1px solid #E6D7DD;border-radius:15px;background:#FFFAF9}.fj-reminder-item.is-paid{opacity:.52}.fj-reminder-item.is-paid .fj-reminder-title{text-decoration:line-through}.fj-reminder-check{width:35px;height:35px;border:1px solid #D8BEC8;background:#F6EAF0;color:#7A1F3D;border-radius:50%;font-size:1rem;cursor:pointer}.fj-reminder-info{min-width:0}.fj-reminder-title{display:block;color:#292929;font-weight:800;overflow-wrap:anywhere}.fj-reminder-date{display:block;color:#6F6870;font-size:.76rem;margin-top:3px}.fj-reminder-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.fj-reminder-badge{display:inline-block;padding:3px 7px;border-radius:999px;background:#F6EAF0;color:#54152B;border:1px solid #CFAFBA;font-size:.68rem}.fj-reminder-badge.warning{background:#2a2010;color:#ffe27a;border-color:#66552b}.fj-reminder-badge.danger{background:#FFF0F0;color:#ffaaa8;border-color:#E4B2B2}.fj-reminder-actions{display:flex;gap:5px}.fj-reminder-actions button{border:1px solid #E6D7DD;background:#FFFFFF;color:#6F6870;border-radius:8px;padding:7px 8px;cursor:pointer;font-size:.72rem}.fj-reminder-actions .delete:hover{color:#ff6978;border-color:#E4B2B2}.fj-reminder-empty{padding:30px 15px;text-align:center;border:1px dashed #E6D7DD;border-radius:14px;color:#7f9187}.fj-reminder-empty b{display:block;color:#554D53;margin-bottom:4px;font-size:.95rem}.fj-reminder-empty span{font-size:.8rem}.fj-editing{border-color:#7A1F3D!important;box-shadow:0 0 0 2px rgba(57,255,136,.06)}@media(max-width:900px){.fj-reminders-app{padding:18px 12px}.fj-reminder-stats{grid-template-columns:1fr 1fr}.fj-reminder-stat:last-child{grid-column:1/-1}.fj-reminder-main{grid-template-columns:1fr}.fj-reminder-grid{grid-template-columns:1fr}.fj-reminder-card label.full{grid-column:auto}.fj-reminder-actions{flex-direction:column}.fj-reminder-actions button{padding:6px}.fj-reminders-header h3{font-size:1.35rem}}`;
 s.textContent+=".fj-reminder-quick{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:0 0 20px}.fj-quick-card{display:flex;align-items:center;gap:12px;text-align:left;border:1px solid #E6D7DD;background:#FFFAF9;border-radius:17px;padding:15px 16px;color:#292929;cursor:pointer;transition:.2s}.fj-quick-card:hover{transform:translateY(-2px);border-color:#7A1F3D;box-shadow:0 8px 24px rgba(122,31,61,.08)}.fj-quick-card>b{width:42px;height:42px;display:grid;place-items:center;background:#F6EAF0;border-radius:13px;font-size:21px}.fj-quick-card span{flex:1}.fj-quick-card strong,.fj-quick-card small{display:block}.fj-quick-card small{margin-top:3px;color:#6F6870;font-size:.74rem}.fj-quick-card i{font-style:normal;color:#7A1F3D;font-size:1.35rem}.fj-list-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.fj-list-head h4{margin-bottom:2px}.fj-list-head>div>span{color:#6F6870;font-size:.72rem}@media(max-width:900px){.fj-reminder-quick{grid-template-columns:1fr}.fj-list-head{display:block}.fj-list-head .fj-reminder-filter{margin-top:10px}}"; document.head.appendChild(s);
}

function getSection(){return document.getElementById('pagos')}
function mount(){
 const section=getSection();
 if(!section)return false;
 section.classList.add('fj-reminders-section');
 let mount=document.getElementById('fjRemindersMount');
 if(mount)return true;
 /* No reemplazamos el contenido del panel. Solo ocultamos el marcador antiguo y creamos nuestro propio contenedor. */
 const old=$('#remindersContent',section);
 if(old)old.style.display='none';
 const oldTitle=section.querySelector(':scope > h3');
 const oldText=oldTitle?.nextElementSibling;
 if(oldTitle)oldTitle.style.display='none';
 if(oldText&&oldText!==old)oldText.style.display='none';
 mount=document.createElement('div');mount.id='fjRemindersMount';section.appendChild(mount);
 mount.innerHTML=`<div class="fj-reminders-app"><div class="fj-reminders-header"><div class="fj-reminders-icon">🔔</div><div><h3>Recordatorios</h3><p>Organiza tus pagos y fechas importantes para que nada se te pase.</p></div></div><div class="fj-reminder-stats"><div class="fj-reminder-stat"><span>📌 Pendientes</span><strong id="fjStatPending">0</strong></div><div class="fj-reminder-stat"><span>⏰ Próximos</span><strong id="fjStatNext">0</strong></div><div class="fj-reminder-stat"><span>✅ Completados</span><strong id="fjStatDone">0</strong></div></div><div class="fj-reminder-quick"><button type="button" class="fj-quick-card" data-quick="pago"><b>💳</b><span><strong>Nuevo pago</strong><small>Agrega monto, fecha y aviso.</small></span><i>＋</i></button><button type="button" class="fj-quick-card" data-quick="importante"><b>📅</b><span><strong>Fecha importante</strong><small>Cumpleaños, trámites y más.</small></span><i>＋</i></button></div><div class="fj-reminder-main"><div class="fj-reminder-card" id="fjReminderEditor"><h4 id="fjReminderFormTitle">➕ Nuevo recordatorio</h4><p class="fj-reminder-help">Crea un aviso para un pago, tarea o fecha importante.</p><form id="fjReminderForm"><div class="fj-reminder-grid"><label class="full">¿Qué quieres recordar?<input id="fjReminderTitle" maxlength="100" placeholder="Ej. Pagar internet" required></label><label>Tipo<select id="fjReminderType"><option value="pago">💳 Pago</option><option value="importante">📅 Fecha importante</option></select></label><label>Monto <span>opcional</span><input id="fjReminderAmount" type="number" min="0" step="0.01" placeholder="Q 0.00"></label><label>Fecha<input id="fjReminderDate" type="date" required></label><label>Hora <span>opcional</span><input id="fjReminderTime" type="time"></label><label>Recordarme <span>antes</span><select id="fjReminderDays"><option value="0">El mismo día</option><option value="1" selected>1 día antes</option><option value="2">2 días antes</option><option value="3">3 días antes</option><option value="7">1 semana antes</option><option value="14">2 semanas antes</option></select></label></div><button class="fj-reminder-save" id="fjReminderSave" type="submit">🔔 Guardar recordatorio</button><button type="button" id="fjReminderCancel" style="display:none;width:100%;margin-top:7px;border:1px solid #E6D7DD;background:transparent;color:#6F6870;border-radius:11px;padding:10px;cursor:pointer">Cancelar edición</button><div id="fjReminderMessage" class="fj-reminder-message"></div></form></div><div class="fj-reminder-list-wrap"><div class="fj-list-head"><div><h4>📋 Mis recordatorios</h4><span>Todo lo que tienes pendiente, en un solo lugar.</span></div><div class="fj-reminder-filter"><button type="button" class="active" data-filter="pending">Pendientes</button><button type="button" data-filter="all">Todos</button><button type="button" data-filter="done">Completados</button></div><div id="fjReminderList" class="fj-reminder-list"></div></div></div></div></div>`;
 mount.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>{const type=$('#fjReminderType');if(type)type.value=b.dataset.quick;const title=$('#fjReminderTitle');if(title){title.placeholder=b.dataset.quick==='pago'?'Ej. Pagar internet':'Ej. Cumpleaños de mamá';title.focus()}$('#fjReminderEditor')?.scrollIntoView({behavior:'smooth',block:'center'})});const form=$('#fjReminderForm');if(form)form.addEventListener('submit',save);
 const date=$('#fjReminderDate');if(date)date.min=new Date().toISOString().slice(0,10);
 const cancel=$('#fjReminderCancel');if(cancel)cancel.onclick=cancelEdit;
 mount.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{mount.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderList(b.dataset.filter)});
 return true;
}
function message(text,type){const el=$('#fjReminderMessage');if(!el)return;el.textContent=text;el.className='fj-reminder-message show '+type;setTimeout(()=>{el.className='fj-reminder-message'},3500)}

async function save(e){
 e.preventDefault();
 const s=await session();
 if(!s){message('Inicia sesión para guardar tus recordatorios.','error');if(window.openAuth)window.openAuth('login');return}
 const c=client();if(!c)return;
 const title=$('#fjReminderTitle').value.trim(),date=$('#fjReminderDate').value,time=$('#fjReminderTime').value,amount=Number($('#fjReminderAmount').value||0),days=Number($('#fjReminderDays').value||0),type=$('#fjReminderType').value||'pago',button=$('#fjReminderSave');
 if(!title||!date)return;
 button.disabled=true;button.textContent='Guardando...';
 const payload={title,amount:Math.max(0,amount),due_date:date,remind_days_before:Math.max(0,Math.min(days,30)),remind_time:time||null,reminder_type:type};
 let result;
 if(formState.id)result=await c.from('payment_reminders').update(payload).eq('id',formState.id).eq('user_id',s.user.id);
 else result=await c.from('payment_reminders').insert({...payload,user_id:s.user.id,paid:false});
 button.disabled=false;button.textContent=formState.id?'💾 Guardar cambios':'🔔 Guardar recordatorio';
 if(result.error){console.error(result.error);message('No se pudo guardar el recordatorio. Revisa la conexión con Supabase y la columna remind_time.','error');return}
 const wasEditing=!!formState.id;cancelEdit();message(wasEditing?'Recordatorio actualizado.':'Recordatorio guardado correctamente.','success');await load();
}
function edit(id){const x=items.find(v=>String(v.id)===String(id));if(!x)return;formState.id=x.id;$('#fjReminderTitle').value=x.title||'';$('#fjReminderAmount').value=Number(x.amount||0)||'';$('#fjReminderType').value=x.reminder_type||'pago';$('#fjReminderDate').value=x.due_date||'';$('#fjReminderTime').value=x.remind_time||'';$('#fjReminderDays').value=String(x.remind_days_before??1);$('#fjReminderFormTitle').textContent='✏️ Editar recordatorio';$('#fjReminderSave').textContent='💾 Guardar cambios';$('#fjReminderCancel').style.display='block';$('#fjReminderEditor').classList.add('fj-editing');$('#fjReminderTitle').focus()}
function cancelEdit(){formState={id:null};const f=$('#fjReminderForm');if(f)f.reset();if($('#fjReminderDate'))$('#fjReminderDate').min=new Date().toISOString().slice(0,10);if($('#fjReminderDays'))$('#fjReminderDays').value='1';if($('#fjReminderFormTitle'))$('#fjReminderFormTitle').textContent='➕ Nuevo recordatorio';if($('#fjReminderSave'))$('#fjReminderSave').textContent='🔔 Guardar recordatorio';if($('#fjReminderCancel'))$('#fjReminderCancel').style.display='none';if($('#fjReminderEditor'))$('#fjReminderEditor').classList.remove('fj-editing')}

async function load(){
 const list=$('#fjReminderList');if(!list)return;
 const s=await session();
 if(!s){items=[];updateStats();list.innerHTML='<div class="fj-reminder-empty"><b>🔐 Inicia sesión para usar tus recordatorios</b><span>Así podrás guardar tus fechas y consultarlas desde cualquier dispositivo.</span></div>';return}
 const c=client();if(!c)return;
 const {data,error}=await c.from('payment_reminders').select('id,title,amount,due_date,remind_days_before,remind_time,reminder_type,paid').eq('user_id',s.user.id).order('paid',{ascending:true}).order('due_date',{ascending:true});
 if(error){console.error(error);items=[];updateStats();list.innerHTML='<div class="fj-reminder-empty"><b>⚠️ No se pudieron cargar tus recordatorios</b><span>Revisa la conexión con Supabase.</span></div>';return}
 items=data||[];updateStats();renderList($('#fjRemindersMount [data-filter].active')?.dataset.filter||'pending');
}
function updateStats(){const pending=items.filter(x=>!x.paid),done=items.filter(x=>x.paid),today=parseDate(new Date().toISOString().slice(0,10)),limit=new Date(today.getTime()+7*86400000),next=pending.filter(x=>{const d=parseDate(x.due_date);return d>=today&&d<=limit});if($('#fjStatPending'))$('#fjStatPending').textContent=pending.length;if($('#fjStatNext'))$('#fjStatNext').textContent=next.length;if($('#fjStatDone'))$('#fjStatDone').textContent=done.length}
function renderList(filter='pending'){const list=$('#fjReminderList');if(!list)return;let shown=filter==='done'?items.filter(x=>x.paid):filter==='all'?items:items.filter(x=>!x.paid);shown=shown.slice().sort((a,b)=>new Date(a.due_date)-new Date(b.due_date));if(!shown.length){list.innerHTML='<div class="fj-reminder-empty"><b>'+((filter==='done')?'✅ No tienes recordatorios completados todavía':'🔔 No tienes recordatorios pendientes')+'</b><span>'+((filter==='done')?'Cuando completes uno aparecerá aquí.':'Crea uno arriba para comenzar a organizar tus fechas.')+'</span></div>';return}const today=parseDate(new Date().toISOString().slice(0,10));list.innerHTML=shown.map(x=>{const d=parseDate(x.due_date),diff=Math.round((d-today)/86400000),state=x.paid?'Completado':diff<0?'Vencido':relative(x.due_date),badge=x.paid?'':diff<0?'danger':diff<=2?'warning':'';return `<article class="fj-reminder-item ${x.paid?'is-paid':''}"><button type="button" class="fj-reminder-check" data-action="toggle" data-id="${esc(x.id)}" title="${x.paid?'Marcar pendiente':'Marcar como completado'}">${x.paid?'✓':'○'}</button><div class="fj-reminder-info"><span class="fj-reminder-title">${esc(x.title)}</span><span class="fj-reminder-date">📅 ${dateText(x.due_date)}${x.remind_time?' · ⏰ '+esc(x.remind_time):''}</span><div class="fj-reminder-badges"><span class="fj-reminder-badge ${badge}">${state}</span>${Number(x.amount)>0?'<span class="fj-reminder-badge">💰 '+money(x.amount)+'</span>':''}${!x.paid?'<span class="fj-reminder-badge">🔔 '+(Number(x.remind_days_before)||0)+' día(s) antes</span>':''}</div></div><div class="fj-reminder-actions"><button type="button" data-action="edit" data-id="${esc(x.id)}">✏️ Editar</button><button type="button" class="delete" data-action="delete" data-id="${esc(x.id)}">🗑️</button></div></article>`}).join('');list.querySelectorAll('[data-action="toggle"]').forEach(b=>b.onclick=()=>toggle(b.dataset.id));list.querySelectorAll('[data-action="delete"]').forEach(b=>b.onclick=()=>remove(b.dataset.id));list.querySelectorAll('[data-action="edit"]').forEach(b=>b.onclick=()=>edit(b.dataset.id))}
async function toggle(id){const s=await session(),c=client();if(!s||!c)return;const x=items.find(v=>String(v.id)===String(id));if(!x)return;const {error}=await c.from('payment_reminders').update({paid:!x.paid}).eq('id',id).eq('user_id',s.user.id);if(error){message('No se pudo actualizar el recordatorio.','error');return}await load()}
async function remove(id){const s=await session(),c=client();if(!s||!c)return;if(!confirm('¿Eliminar este recordatorio?'))return;const {error}=await c.from('payment_reminders').delete().eq('id',id).eq('user_id',s.user.id);if(error){message('No se pudo eliminar el recordatorio.','error');return}message('Recordatorio eliminado.','success');await load()}

function start(){
 if(window.__fjRemindersBooted)return;
 if(!mount())return;
 styles();
 window.__fjRemindersBooted=true;
 window.__fjRemindersStarting=false;
 load();
 const c=client();
 if(c&&c.auth)c.auth.onAuthStateChange(()=>setTimeout(load,0));
}

function boot(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start()}
boot();
})();
