/* Finanzas Jóvenes — recordatorios personalizados */
(function(){
  'use strict';
  const KEY='fj_custom_reminders';

  function getReminders(){
    try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}
  }
  function saveReminders(items){localStorage.setItem(KEY,JSON.stringify(items))}

  function render(){
    const section=document.querySelector('#pagos');
    if(!section)return;
    let box=section.querySelector('.fj-custom-reminders');
    if(!box){
      box=document.createElement('div');
      box.className='fj-custom-reminders';
      box.innerHTML=`
        <div class="fj-custom-head">
          <div><h3>📝 Mis recordatorios</h3><p>Agrega algo que quieras recordar: un pago, una fecha importante, una compra o cualquier pendiente.</p></div>
        </div>
        <form class="fj-reminder-form" id="fjReminderForm">
          <div class="fj-reminder-fields">
            <label>¿Qué quieres recordar?<input id="fjReminderTitle" type="text" maxlength="100" placeholder="Ej. Pagar internet, ahorrar Q100, comprar un libro..." required></label>
            <label>Fecha<input id="fjReminderDate" type="date" required></label>
            <label>Hora <span>(opcional)</span><input id="fjReminderTime" type="time"></label>
          </div>
          <label>Nota <span>(opcional)</span><textarea id="fjReminderNote" maxlength="250" placeholder="Escribe algún detalle..."></textarea></label>
          <button type="submit" class="fj-reminder-save">➕ Guardar recordatorio</button>
        </form>
        <div class="fj-custom-list" id="fjReminderList"></div>`;
      section.appendChild(box);
      document.getElementById('fjReminderForm').addEventListener('submit',addReminder);
    }
    renderList();
  }

  function addReminder(e){
    e.preventDefault();
    const title=document.getElementById('fjReminderTitle').value.trim();
    const date=document.getElementById('fjReminderDate').value;
    const time=document.getElementById('fjReminderTime').value;
    const note=document.getElementById('fjReminderNote').value.trim();
    if(!title||!date)return;
    const items=getReminders();
    items.push({id:Date.now(),title,date,time,note,done:false});
    items.sort((a,b)=>((a.date+' '+(a.time||'23:59')).localeCompare(b.date+' '+(b.time||'23:59'))));
    saveReminders(items);
    e.target.reset();
    renderList();
  }

  function renderList(){
    const list=document.getElementById('fjReminderList');
    if(!list)return;
    const items=getReminders();
    if(!items.length){list.innerHTML='<div class="fj-empty-reminders">Todavía no tienes recordatorios. Agrega el primero arriba. 🔔</div>';return}
    list.innerHTML=items.map(item=>`<div class="fj-custom-item ${item.done?'done':''}">
      <div class="fj-custom-check"><button type="button" data-action="toggle" data-id="${item.id}" aria-label="Marcar como ${item.done?'pendiente':'completado'}">${item.done?'✓':'○'}</button></div>
      <div class="fj-custom-content"><strong>${escapeHtml(item.title)}</strong><span>📅 ${formatDate(item.date)}${item.time?' · ⏰ '+item.time:''}</span>${item.note?'<small>'+escapeHtml(item.note)+'</small>':''}</div>
      <button type="button" class="fj-custom-delete" data-action="delete" data-id="${item.id}" aria-label="Eliminar recordatorio">🗑️</button>
    </div>`).join('');
    list.querySelectorAll('[data-action="toggle"]').forEach(b=>b.addEventListener('click',()=>toggleReminder(Number(b.dataset.id))));
    list.querySelectorAll('[data-action="delete"]').forEach(b=>b.addEventListener('click',()=>deleteReminder(Number(b.dataset.id))));
  }

  function toggleReminder(id){const items=getReminders();const item=items.find(x=>x.id===id);if(item)item.done=!item.done;saveReminders(items);renderList()}
  function deleteReminder(id){saveReminders(getReminders().filter(x=>x.id!==id));renderList()}
  function formatDate(value){const d=new Date(value+'T00:00:00');return d.toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'})}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

  function addStyles(){
    if(document.getElementById('fjCustomReminderStyles'))return;
    const s=document.createElement('style');s.id='fjCustomReminderStyles';
    s.textContent=`
      .fj-custom-reminders{margin-top:22px;padding:24px;background:rgba(7,16,10,.72);border:1px solid #294034;border-radius:22px}
      .fj-custom-head h3{margin:0 0 6px;font-size:1.35rem;color:#f4faf6}.fj-custom-head p{margin:0 0 18px;color:#9eafa5;font-size:.9rem;line-height:1.5}
      .fj-reminder-form{display:grid;gap:12px}.fj-reminder-fields{display:grid;grid-template-columns:1.5fr .75fr .65fr;gap:10px}.fj-reminder-form label{display:grid;gap:6px;color:#dce9e1;font-size:.82rem;font-weight:700}.fj-reminder-form label span{color:#7f9187;font-weight:400}
      .fj-reminder-form input,.fj-reminder-form textarea{width:100%;box-sizing:border-box;border:1px solid #294034;background:#0a120d;color:#f4faf6;border-radius:12px;padding:11px 12px;font:inherit;outline:none}.fj-reminder-form textarea{min-height:72px;resize:vertical}.fj-reminder-form input:focus,.fj-reminder-form textarea:focus{border-color:#39ff88;box-shadow:0 0 0 2px rgba(57,255,136,.08)}
      .fj-reminder-save{justify-self:start;border:1px solid #39ff88;background:#39ff88;color:#041008;border-radius:12px;padding:11px 16px;font-weight:800;cursor:pointer}.fj-custom-list{display:grid;gap:8px;margin-top:18px}.fj-custom-item{display:flex;align-items:center;gap:11px;padding:13px;background:#0a120d;border:1px solid #294034;border-radius:14px}.fj-custom-item.done{opacity:.58}.fj-custom-item.done .fj-custom-content strong{text-decoration:line-through}.fj-custom-check button,.fj-custom-delete{border:0;background:transparent;color:#39ff88;cursor:pointer;font-size:1.25rem}.fj-custom-delete{margin-left:auto;font-size:1rem}.fj-custom-content{min-width:0;display:grid;gap:3px}.fj-custom-content strong{color:#f4faf6;overflow-wrap:anywhere}.fj-custom-content span,.fj-custom-content small{color:#9eafa5;font-size:.78rem}.fj-empty-reminders{text-align:center;padding:18px;color:#7f9187;border:1px dashed #294034;border-radius:14px}
      @media(max-width:900px){.fj-custom-reminders{margin-top:15px;padding:16px 12px}.fj-reminder-fields{grid-template-columns:1fr}.fj-reminder-save{width:100%}}
    `;document.head.appendChild(s)
  }

  function fixMenu(){
    const hero=document.querySelector('.hero-buttons a[href="#pagos"]');
    if(hero)hero.textContent='Ver mis recordatorios 🔔';
    const section=document.querySelector('#pagos h2');
    if(section)section.textContent='🔔 Mis recordatorios';
  }

  function start(){
    addStyles();fixMenu();render();
    let tries=0;const timer=setInterval(()=>{fixMenu();render();tries++;if(tries>30)clearInterval(timer)},250)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
