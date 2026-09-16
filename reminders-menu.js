/* Finanzas Jóvenes — apartado independiente de recordatorios */
(function(){
  'use strict';
  const KEY='fj_custom_reminders';

  function getItems(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function saveItems(items){localStorage.setItem(KEY,JSON.stringify(items))}
  function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function dateText(v){return new Date(v+'T00:00:00').toLocaleDateString('es-GT',{weekday:'short',day:'numeric',month:'long',year:'numeric'})}

  function build(){
    let section=document.getElementById('pagos');
    if(!section)return;
    section.classList.add('fj-reminders-section');

    let old=section.querySelector('.fj-reminders-app');
    if(old)old.remove();

    const app=document.createElement('div');
    app.className='fj-reminders-app';
    app.innerHTML=`
      <div class="fj-reminders-header">
        <div class="fj-reminders-icon">🔔</div>
        <div><h3>Mis recordatorios</h3><p>Este es tu espacio personal para anotar pagos, fechas importantes, compras o pendientes.</p></div>
      </div>
      <div class="fj-reminder-card">
        <h4>➕ Crear un recordatorio</h4>
        <form id="fjReminderForm">
          <div class="fj-reminder-grid">
            <label>¿Qué quieres recordar?<input id="fjReminderTitle" maxlength="100" placeholder="Ej. Pagar internet o comprar un libro" required></label>
            <label>Fecha<input id="fjReminderDate" type="date" required></label>
            <label>Hora <span>opcional</span><input id="fjReminderTime" type="time"></label>
          </div>
          <label>Nota <span>opcional</span><textarea id="fjReminderNote" maxlength="250" placeholder="Agrega algún detalle si lo necesitas"></textarea></label>
          <button class="fj-reminder-save" type="submit">Guardar recordatorio</button>
        </form>
      </div>
      <div class="fj-reminder-list-wrap">
        <h4>📋 Mis pendientes</h4>
        <div id="fjReminderList"></div>
      </div>`;
    section.appendChild(app);

    app.querySelector('#fjReminderForm').addEventListener('submit',add);
    renderList();
  }

  function add(e){
    e.preventDefault();
    const title=document.getElementById('fjReminderTitle').value.trim();
    const date=document.getElementById('fjReminderDate').value;
    if(!title||!date)return;
    const items=getItems();
    items.push({id:Date.now(),title,date,time:document.getElementById('fjReminderTime').value,note:document.getElementById('fjReminderNote').value.trim(),done:false});
    saveItems(items);e.target.reset();renderList();
  }

  function renderList(){
    const list=document.getElementById('fjReminderList');if(!list)return;
    const items=getItems().sort((a,b)=>(a.date+' '+(a.time||'23:59')).localeCompare(b.date+' '+(b.time||'23:59')));
    if(!items.length){list.innerHTML='<div class="fj-reminder-empty">Todavía no tienes recordatorios. Crea el primero arriba. 🔔</div>';return}
    list.innerHTML=items.map(x=>`<article class="fj-reminder-item ${x.done?'is-done':''}">
      <button class="fj-reminder-check" data-action="toggle" data-id="${x.id}">${x.done?'✓':'○'}</button>
      <div class="fj-reminder-info"><strong>${esc(x.title)}</strong><span>📅 ${dateText(x.date)}${x.time?' · ⏰ '+esc(x.time):''}</span>${x.note?`<small>${esc(x.note)}</small>`:''}</div>
      <button class="fj-reminder-delete" data-action="delete" data-id="${x.id}">Eliminar</button>
    </article>`).join('');
    list.querySelectorAll('[data-action="toggle"]').forEach(b=>b.onclick=()=>toggle(Number(b.dataset.id)));
    list.querySelectorAll('[data-action="delete"]').forEach(b=>b.onclick=()=>remove(Number(b.dataset.id)));
  }
  function toggle(id){const a=getItems(),x=a.find(v=>v.id===id);if(x)x.done=!x.done;saveItems(a);renderList()}
  function remove(id){saveItems(getItems().filter(x=>x.id!==id));renderList()}

  function styles(){if(document.getElementById('fjReminderStyles'))return;const s=document.createElement('style');s.id='fjReminderStyles';s.textContent=`
    #pagos.fj-reminders-section{scroll-margin-top:30px}
    .fj-reminders-app{margin-top:24px;padding:26px;border:1px solid #294034;border-radius:24px;background:#07100a;box-shadow:0 12px 35px rgba(0,0,0,.18)}
    .fj-reminders-header{display:flex;gap:14px;align-items:center;padding-bottom:20px;border-bottom:1px solid #1e3025}.fj-reminders-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:#102318;font-size:25px}.fj-reminders-header h3{margin:0;color:#f4faf6;font-size:1.4rem}.fj-reminders-header p{margin:5px 0 0;color:#9eafa5;line-height:1.5;font-size:.9rem}
    .fj-reminder-card{margin-top:20px;padding:20px;border-radius:18px;background:#0b1610;border:1px solid #294034}.fj-reminder-card h4,.fj-reminder-list-wrap h4{margin:0 0 15px;color:#f4faf6;font-size:1rem}.fj-reminder-grid{display:grid;grid-template-columns:1.5fr .8fr .7fr;gap:12px}.fj-reminder-card label{display:grid;gap:7px;color:#dce9e1;font-size:.82rem;font-weight:700}.fj-reminder-card label span{color:#718278;font-weight:400}.fj-reminder-card input,.fj-reminder-card textarea{box-sizing:border-box;width:100%;border:1px solid #294034;background:#07100a;color:#fff;border-radius:11px;padding:11px;font:inherit;outline:0}.fj-reminder-card textarea{min-height:70px;resize:vertical;margin-top:12px}.fj-reminder-card input:focus,.fj-reminder-card textarea:focus{border-color:#39ff88}.fj-reminder-save{margin-top:13px;border:0;border-radius:11px;padding:11px 17px;background:#39ff88;color:#041008;font-weight:800;cursor:pointer}.fj-reminder-list-wrap{margin-top:25px}.fj-reminder-list-wrap h4{margin-bottom:10px}.fj-reminder-item{display:flex;align-items:center;gap:12px;padding:14px;margin-top:8px;border:1px solid #294034;border-radius:14px;background:#0a120d}.fj-reminder-item.is-done{opacity:.55}.fj-reminder-item.is-done strong{text-decoration:line-through}.fj-reminder-check{border:0;background:transparent;color:#39ff88;font-size:1.35rem;cursor:pointer}.fj-reminder-info{display:grid;gap:3px;min-width:0}.fj-reminder-info strong{color:#f4faf6;overflow-wrap:anywhere}.fj-reminder-info span,.fj-reminder-info small{color:#9eafa5;font-size:.78rem}.fj-reminder-delete{margin-left:auto;border:1px solid #294034;background:transparent;color:#c5d1ca;border-radius:9px;padding:7px 9px;cursor:pointer}.fj-reminder-empty{padding:20px;text-align:center;border:1px dashed #294034;border-radius:14px;color:#7f9187}
    @media(max-width:900px){.fj-reminders-app{padding:17px 12px}.fj-reminder-grid{grid-template-columns:1fr}.fj-reminder-save{width:100%}.fj-reminder-item{align-items:flex-start}.fj-reminder-delete{font-size:.75rem}}
  `;document.head.appendChild(s)}

  function start(){styles();build();let n=0;const t=setInterval(()=>{if(document.getElementById('pagos'))build();if(++n>20)clearInterval(t)},300)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
