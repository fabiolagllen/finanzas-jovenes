/* Finanzas Jóvenes — único controlador del apartado Recordatorios */
(function(){
'use strict';
if(window.__fjRemindersHubBooted)return;
window.__fjRemindersHubBooted=true;

function section(){return document.getElementById('pagos')}

function removeLegacyPanels(){
  const sec=section();
  if(!sec)return;
  const tools=sec.closest('.tools');
  if(!tools)return;

  tools.querySelectorAll('.panel').forEach(panel=>{
    if(panel===sec)return;
    const title=panel.querySelector('h3')?.textContent?.trim().toLowerCase()||'';
    if(title.includes('registro de gastos')||title.includes('consejo del día')||title.includes('consejo del dia')){
      panel.remove();
    }
  });

  const herramientas=document.getElementById('herramientas');
  if(herramientas){
    sec.classList.add('fj-reminders-section');
    herramientas.insertAdjacentElement('afterend',sec);
  }
}

function loadModule(){
  return new Promise(resolve=>{
    if(window.__fjRemindersBooted){resolve();return}
    const old=document.querySelector('script[data-fj-reminders-module]');
    if(old){old.addEventListener('load',resolve,{once:true});setTimeout(resolve,700);return}
    const s=document.createElement('script');
    s.src='./reminders-menu.js?v=9&force='+Date.now();
    s.dataset.fjRemindersModule='true';
    s.onload=resolve;s.onerror=resolve;
    document.body.appendChild(s);
  });
}
function styles(){
  if(document.getElementById('fjRemindersHubStyles'))return;
  const s=document.createElement('style');s.id='fjRemindersHubStyles';
  s.textContent=`
  #pagos.fj-reminders-section{max-width:1180px;margin:auto;padding:55px 24px 72px;scroll-margin-top:25px}
  .fj-hub{padding:30px;border:1px solid #E6D7DD;border-radius:27px;background:#FFFFFF;box-shadow:0 18px 50px rgba(122,31,61,.10)}
  .fj-hub-head{display:flex;align-items:center;gap:16px;margin-bottom:24px}
  .fj-hub-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;background:#F6EAF0;border:1px solid #CFAFBA;font-size:27px}
  .fj-hub-head h2{margin:0;color:#292929;font-size:2rem}
  .fj-hub-head p{margin:4px 0 0;color:#6F6870}
  .fj-hub-options{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
  .fj-hub-option{display:flex;align-items:center;gap:15px;text-align:left;width:100%;padding:20px;border:1px solid #E6D7DD;border-radius:18px;background:#FFFFFF;color:#292929;cursor:pointer;transition:.2s}
  .fj-hub-option:hover{transform:translateY(-2px);border-color:#7A1F3D;background:#F6EAF0;box-shadow:0 10px 30px rgba(122,31,61,.08)}
  .fj-hub-option .ico{font-size:1.8rem;width:42px;text-align:center}
  .fj-hub-option strong{display:block;font-size:1rem;margin-bottom:3px}
  .fj-hub-option span{display:block;color:#6F6870;font-size:.8rem;line-height:1.4}
  .fj-hub-workspace{margin-top:18px}
  .fj-hub-back{margin-bottom:10px;border:1px solid #E6D7DD;background:#FFFFFF;color:#6F6870;border-radius:10px;padding:9px 13px;cursor:pointer;font-weight:700}
  @media(max-width:900px){#pagos.fj-reminders-section{padding:42px 12px 40px}.fj-hub{padding:18px 12px;border-radius:19px}.fj-hub-head h2{font-size:1.4rem}.fj-hub-head p{font-size:.78rem}.fj-hub-options{grid-template-columns:1fr;gap:9px}.fj-hub-option{padding:15px}.fj-hub-option strong{font-size:.9rem}.fj-hub-option span{font-size:.74rem}}
  `;
  s.textContent+=".fj-hub{padding:28px!important;border:1px solid #E6D7DD!important;border-radius:26px!important;background:#FFFFFF!important;box-shadow:0 18px 50px rgba(122,31,61,.09)!important}.fj-hub-head{margin-bottom:20px!important}.fj-hub-options{grid-template-columns:repeat(2,minmax(0,1fr))!important}.fj-hub-option{min-height:118px!important;background:#FFFAF9!important;border-radius:18px!important}.fj-hub-option:hover{background:#F6EAF0!important}.fj-hub-option .ico{width:46px!important;height:46px!important;display:grid!important;place-items:center!important;border-radius:14px!important;background:#F6EAF0!important}@media(max-width:900px){.fj-hub-options{grid-template-columns:1fr!important}.fj-hub-option{min-height:92px!important}}";document.head.appendChild(s);
}
function showHub(){
  const sec=section();if(!sec)return;
  removeLegacyPanels();
  styles();
  sec.classList.add('fj-reminders-section');
  sec.innerHTML=`<div class="fj-hub"><div class="fj-hub-head"><div class="fj-hub-icon">🔔</div><div><h2>Centro de recordatorios</h2><p>¿Qué quieres hacer hoy?</p></div></div><div class="fj-hub-options"><button class="fj-hub-option" data-action="new"><span class="ico">💳</span><span><strong>Ingresar nuevo recordatorio de pago</strong><span>Agrega un pago, monto, fecha y hora para recibir un aviso.</span></span></button><button class="fj-hub-option" data-action="important"><span class="ico">📅</span><span><strong>Agregar una fecha importante</strong><span>Recuerda cumpleaños, trámites, metas u otras fechas.</span></span></button><button class="fj-hub-option" data-action="view"><span class="ico">📋</span><span><strong>Ver mis recordatorios</strong><span>Consulta tus recordatorios pendientes y completados.</span></span></button><button class="fj-hub-option" data-action="next"><span class="ico">⏰</span><span><strong>Revisar próximos recordatorios</strong><span>Mira las fechas que se acercan y organiza tus pendientes.</span></span></button></div></div><div id="fjReminderWorkspace" class="fj-hub-workspace"></div>`;
  sec.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>openOption(b.dataset.action)));
}
async function openOption(action){
  const sec=section();if(!sec)return;
  const options=sec.querySelector('.fj-hub');if(options)options.style.display='none';
  const ws=document.getElementById('fjReminderWorkspace');
  if(!ws)return;
  ws.innerHTML='<button class="fj-hub-back" type="button">← Volver a opciones</button><div id="fjReminderModuleMount"></div>';
  ws.querySelector('.fj-hub-back').onclick=()=>{location.hash='pagos';showHub()};
  const moduleMount=ws.querySelector('#fjReminderModuleMount');
  const originalSectionId=sec.id;
  moduleMount.id='pagos';
  sec.id='fjRemindersContainer';
  await loadModule();
  const mounted=document.getElementById('fjRemindersMount');
  if(mounted){
    const app=mounted.closest('.fj-reminders-app');
    if(app)moduleMount.appendChild(app);
    mounted.remove();
  }
  sec.id=originalSectionId;
  const editor=document.getElementById('fjReminderEditor');
  const list=document.getElementById('fjReminderList')?.closest('.fj-reminder-list-wrap');
  if(action==='view'||action==='next'){
    if(editor)editor.style.display='none';
    if(action==='next'){
      const pending=document.querySelector('[data-filter="pending"]');if(pending)pending.click();
    }
    list?.scrollIntoView({behavior:'smooth',block:'start'});
  }else{
    if(editor)editor.style.display='block';
    if(action==='important'){
      const title=document.getElementById('fjReminderTitle');
      const type=document.getElementById('fjReminderType');
      if(title)title.placeholder='Ej. Cumpleaños de mamá';
      if(type)type.value='importante';
    }
    editor?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}
function start(){
  const sec=section();if(!sec)return;
  showHub();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
