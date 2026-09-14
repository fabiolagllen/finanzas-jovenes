/* FJ — Chatbot propio de Finanzas Jóvenes
   No usa OpenAI, Gemini ni otra IA externa.
   Solo responde preguntas relacionadas con el contenido de la plataforma.
*/
(function(){
  'use strict';

  const KNOWLEDGE = [
    {
      keys:['meta','metas','objetivo','objetivos','ahorro','ahorrar'],
      answer:'🎯 Las metas de ahorro de Finanzas Jóvenes sirven para convertir algo que quieres lograr en un objetivo concreto. Puedes indicar cuánto quieres alcanzar, cuánto llevas ahorrado y ver tu progreso. Por ejemplo: ahorrar para una laptop, un curso o algo que necesites.'
    },
    {
      keys:['presupuesto','presupuestos','organizar dinero','organizar mis gastos'],
      answer:'📊 El presupuesto te ayuda a organizar el dinero que recibes y compararlo con lo que gastas. En Finanzas Jóvenes puedes usar la calculadora de presupuesto para saber cuánto te queda después de tus gastos.'
    },
    {
      keys:['calculadora','calcular presupuesto','calculadora presupuesto'],
      answer:'🧮 La calculadora de presupuesto está en la sección Herramientas. Escribe tus ingresos mensuales y tus gastos para saber cuánto dinero te queda o si tus gastos superan tus ingresos.'
    },
    {
      keys:['calculadora meta','calcular meta','cuanto ahorrar','ahorro mensual'],
      answer:'🎯 La calculadora de meta de ahorro te ayuda a saber cuánto necesitas ahorrar cada mes. Indica la cantidad que quieres alcanzar, lo que ya tienes ahorrado y en cuántos meses quieres lograrlo.'
    },
    {
      keys:['gasto','gastos','registrar gasto','registro de gastos','anotar gasto'],
      answer:'🧾 En Registro de gastos puedes anotar lo que gastas y organizarlo por categoría. Si tienes una cuenta iniciada, tus gastos pueden guardarse para consultarlos en Mi panel.'
    },
    {
      keys:['panel','mi panel','dashboard','resumen','progreso'],
      answer:'📈 Mi panel financiero muestra un resumen de tus movimientos: gastos del mes, cantidad de gastos, promedio por gasto, estado financiero, distribución por categorías y tu meta de ahorro.'
    },
    {
      keys:['reto','retos','7 dias','siete dias','desafio'],
      answer:'🔥 El reto de 7 días propone pequeños hábitos financieros. Puedes marcar actividades como anotar tus gastos, evitar una compra impulsiva, guardar una cantidad, revisar tu presupuesto y definir una meta.'
    },
    {
      keys:['quiz','mini quiz','preguntas','juego'],
      answer:'🧠 El mini quiz financiero es una actividad de la Zona interactiva. Te hace preguntas sencillas sobre hábitos y conceptos financieros para que puedas comprobar lo que has aprendido.'
    },
    {
      keys:['consejo','consejos','tip','consejo del dia','consejo diario'],
      answer:'💡 El Consejo del día muestra recomendaciones sencillas para mejorar tus hábitos financieros. Puedes pulsar “Dame otro consejo” para recibir uno diferente.'
    },
    {
      keys:['aprende','aprender','educacion financiera','finanzas'],
      answer:'📚 La sección Aprende está pensada para que los jóvenes conozcan conceptos básicos de finanzas de una manera sencilla. Incluye ahorro inteligente, presupuesto y metas financieras.'
    },
    {
      keys:['herramientas','que puedo hacer','funciones','funcionalidades'],
      answer:'🛠️ En Herramientas encontrarás calculadora de presupuesto, calculadora de metas de ahorro, registro de gastos y Consejo del día. También tienes actividades interactivas como el mini quiz y el reto de 7 días.'
    },
    {
      keys:['cuenta','iniciar sesion','iniciar sesión','registrarme','crear cuenta','login'],
      answer:'👤 Puedes crear una cuenta o iniciar sesión desde el menú de Finanzas Jóvenes. La cuenta permite guardar tus datos financieros y consultar tu progreso en Mi panel.'
    },
    {
      keys:['que es finanzas jovenes','qué es finanzas jóvenes','finanzas jovenes','finanzas jóvenes','pagina','página','plataforma'],
      answer:'💚 Finanzas Jóvenes es una plataforma pensada para jóvenes que quieren aprender a manejar mejor su dinero. Incluye herramientas, metas, registro de gastos, consejos y actividades para practicar.'
    }
  ];

  const normalize = text => String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9ñ\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  function findAnswer(question){
    const q=normalize(question);
    if(!q) return 'Escribe una pregunta y te ayudaré con Finanzas Jóvenes. 💚';

    const greetings=['hola','holi','buenas','hey','buenos dias','buenas tardes','buenas noches'];
    if(greetings.some(x=>q===x || q.startsWith(x+' '))) return '¡Hola! 👋 Soy FJ, el asistente de Finanzas Jóvenes. Puedo explicarte las funciones y herramientas de esta plataforma. Por ejemplo, puedes preguntarme “¿para qué sirven las metas?”';

    let best=null;
    let bestScore=0;
    for(const item of KNOWLEDGE){
      let score=0;
      for(const key of item.keys){
        const k=normalize(key);
        if(q.includes(k)) score += k.length >= 8 ? 3 : 2;
      }
      if(score>bestScore){bestScore=score;best=item;}
    }
    if(best && bestScore>=2) return best.answer;

    return '🤖 Esa pregunta no está dentro de lo que conozco todavía. Soy el asistente de Finanzas Jóvenes y solo puedo ayudarte con las funciones, herramientas, actividades y conceptos relacionados con esta plataforma. Prueba preguntarme, por ejemplo: “¿para qué sirven las metas?”, “¿cómo funciona el reto de 7 días?” o “¿qué puedo hacer en Mi panel?”';
  }

  function inject(){
    if(document.getElementById('fjChatbot')) return;

    const style=document.createElement('style');
    style.textContent=`
      #fjChatbot{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Arial,sans-serif}
      #fjChatButton{width:62px;height:62px;border:1px solid rgba(57,255,136,.5);border-radius:50%;background:linear-gradient(145deg,#173b25,#08120c);color:#39ff88;cursor:pointer;font-size:27px;box-shadow:0 12px 35px #000b,0 0 25px rgba(57,255,136,.2);transition:.2s}
      #fjChatButton:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 16px 40px #000c,0 0 32px rgba(57,255,136,.3)}
      #fjChatPanel{position:absolute;right:0;bottom:75px;width:360px;max-width:calc(100vw - 30px);height:500px;background:linear-gradient(145deg,#101c14,#07100b);border:1px solid #31503d;border-radius:22px;box-shadow:0 25px 80px #000c,0 0 35px rgba(57,255,136,.08);overflow:hidden;display:none;flex-direction:column}
      #fjChatPanel.show{display:flex}
      .fj-chat-head{padding:16px 17px;background:#0c1911;border-bottom:1px solid #294034;display:flex;align-items:center;justify-content:space-between}
      .fj-chat-title{font-weight:900;color:#f4faf6}.fj-chat-title span{color:#39ff88}.fj-chat-sub{font-size:.72rem;color:#8fa197;margin-top:2px}
      .fj-chat-close{border:0;background:none;color:#91a198;font-size:20px;cursor:pointer}
      #fjChatMessages{flex:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
      .fj-msg{max-width:86%;padding:10px 12px;border-radius:14px;font-size:.88rem;line-height:1.45;white-space:pre-wrap}
      .fj-msg.bot{align-self:flex-start;background:#0e2116;border:1px solid #28553a;color:#caffd8;border-bottom-left-radius:5px}
      .fj-msg.user{align-self:flex-end;background:#39ff88;color:#041008;border-bottom-right-radius:5px;font-weight:700}
      .fj-quick{display:flex;gap:6px;overflow-x:auto;padding:0 12px 10px}
      .fj-quick button{white-space:nowrap;border:1px solid #294034;background:#0a130d;color:#aaffc5;border-radius:999px;padding:7px 10px;cursor:pointer;font-size:.72rem}
      .fj-quick button:hover{border-color:#39ff88}
      .fj-chat-form{display:flex;gap:7px;padding:11px;border-top:1px solid #294034;background:#09110c}
      #fjChatInput{min-width:0;flex:1;padding:10px 11px;border:1px solid #294034;border-radius:12px;background:#050b07;color:#f4faf6;outline:none}
      #fjChatInput:focus{border-color:#39ff88}
      #fjChatSend{border:0;background:#39ff88;color:#041008;border-radius:12px;padding:0 14px;font-weight:900;cursor:pointer}
      @media(max-width:600px){#fjChatbot{right:14px;bottom:14px}#fjChatPanel{right:-4px;bottom:72px;width:min(360px,calc(100vw - 28px));height:70vh;max-height:520px}}
    `;
    document.head.appendChild(style);

    const root=document.createElement('div');
    root.id='fjChatbot';
    root.innerHTML=`
      <div id="fjChatPanel" aria-label="Chat de Finanzas Jóvenes">
        <div class="fj-chat-head">
          <div><div class="fj-chat-title">🤖 <span>FJ</span> · Asistente</div><div class="fj-chat-sub">Solo sobre Finanzas Jóvenes</div></div>
          <button class="fj-chat-close" id="fjChatClose" aria-label="Cerrar">×</button>
        </div>
        <div id="fjChatMessages"></div>
        <div class="fj-quick">
          <button data-q="¿Para qué sirven las metas de ahorro?">🎯 Metas</button>
          <button data-q="¿Qué puedo hacer en Mi panel?">📊 Mi panel</button>
          <button data-q="¿Cómo funciona el reto de 7 días?">🔥 Reto</button>
          <button data-q="¿Para qué sirve el presupuesto?">💰 Presupuesto</button>
        </div>
        <form class="fj-chat-form" id="fjChatForm">
          <input id="fjChatInput" maxlength="300" autocomplete="off" placeholder="Pregunta sobre la página...">
          <button id="fjChatSend" type="submit">➤</button>
        </form>
      </div>
      <button id="fjChatButton" aria-label="Abrir asistente">🤖</button>
    `;
    document.body.appendChild(root);

    const panel=document.getElementById('fjChatPanel');
    const messages=document.getElementById('fjChatMessages');
    const input=document.getElementById('fjChatInput');

    function addMessage(text,type){
      const el=document.createElement('div');
      el.className='fj-msg '+type;
      el.textContent=text;
      messages.appendChild(el);
      messages.scrollTop=messages.scrollHeight;
    }

    function ask(text){
      const q=String(text||'').trim();
      if(!q)return;
      addMessage(q,'user');
      input.value='';
      setTimeout(()=>addMessage(findAnswer(q),'bot'),180);
    }

    document.getElementById('fjChatButton').onclick=()=>{
      panel.classList.toggle('show');
      if(panel.classList.contains('show')) input.focus();
    };
    document.getElementById('fjChatClose').onclick=()=>panel.classList.remove('show');
    document.getElementById('fjChatForm').onsubmit=e=>{e.preventDefault();ask(input.value)};
    root.querySelectorAll('.fj-quick button').forEach(btn=>btn.onclick=()=>ask(btn.dataset.q));

    addMessage('¡Hola! 👋 Soy FJ. Puedo ayudarte a entender las funciones y herramientas de Finanzas Jóvenes. ¿Qué quieres saber?','bot');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',inject);
  else inject();
})();
