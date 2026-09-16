/* FJ — Chatbot propio de Finanzas Jóvenes
   Responde sobre la plataforma, educación financiera básica y situaciones cotidianas relacionadas con el dinero.
   Puede ampliar su base mediante respuestas aprobadas guardadas en Supabase.
*/
(function(){
  'use strict';

  const SUPABASE_URL='https://pgfgmxeqisrwkrwtvbum.supabase.co';
  const SUPABASE_KEY='sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';
  let db=null;

  const KNOWLEDGE = [
    {keys:['meta','metas','objetivo','objetivos','ahorro','ahorrar'],answer:'🎯 Las metas de ahorro convierten algo que quieres lograr en un objetivo concreto. Define cuánto necesitas, cuánto tienes y en cuánto tiempo quieres alcanzarlo. Puedes usar la calculadora de metas de Finanzas Jóvenes para estimar cuánto ahorrar cada mes.'},
    {keys:['moto','motocicleta','comprar una moto','comprarme una moto','carro','auto','vehiculo','vehículo'],answer:'🏍️ Puedes convertir una moto, carro u otro vehículo en una meta de ahorro. Define el monto que necesitas, el tiempo disponible y cuánto puedes ahorrar periódicamente.'},
    {keys:['laptop','computadora','telefono','teléfono','celular','curso','viaje'],answer:'🎯 Si quieres comprar una laptop, teléfono, pagar un curso, hacer un viaje u otra cosa, puedes convertirlo en una meta financiera. Define el costo, el plazo y una cantidad de ahorro periódica.'},
    {keys:['presupuesto','presupuestos','organizar dinero','organizar mis gastos','planificar dinero'],answer:'📊 Un presupuesto es un plan para organizar el dinero que recibes y decidir cuánto puedes destinar a gastos, ahorro y metas. En Finanzas Jóvenes puedes usar la calculadora de presupuesto para practicarlo.'},
    {keys:['calculadora','calcular presupuesto','calculadora presupuesto'],answer:'🧮 La calculadora de presupuesto está en Herramientas. Puedes ingresar tus ingresos y gastos para conocer cuánto dinero te queda y detectar si estás gastando más de lo que recibes.'},
    {keys:['calculadora meta','calcular meta','cuanto ahorrar','cuánto ahorrar','ahorro mensual'],answer:'🎯 La calculadora de meta de ahorro te ayuda a estimar cuánto necesitas ahorrar cada mes. Indica la cantidad que quieres alcanzar, lo que ya tienes ahorrado y el tiempo que tienes para lograrlo.'},
    {keys:['gasto','gastos','registrar gasto','registro de gastos','anotar gasto'],answer:'🧾 Registrar tus gastos te permite saber en qué estás utilizando tu dinero. Puedes clasificarlos por categoría y revisar después cuáles consumen más de tu presupuesto.'},
    {keys:['panel','mi panel','dashboard','resumen','progreso'],answer:'📈 Mi panel financiero muestra un resumen de tus movimientos: gastos del mes, cantidad de gastos, promedio, estado financiero, categorías y progreso de tu meta de ahorro.'},
    {keys:['reto','retos','7 dias','siete dias','desafio'],answer:'🔥 El reto de 7 días propone pequeños hábitos financieros, como registrar gastos, evitar compras impulsivas, ahorrar una cantidad, revisar el presupuesto y definir una meta.'},
    {keys:['quiz','mini quiz','preguntas','juego'],answer:'🧠 El mini quiz financiero está en la Zona interactiva. Sirve para comprobar tus conocimientos sobre hábitos y conceptos financieros de forma sencilla.'},
    {keys:['consejo','consejos','tip','consejo del dia','consejo diario'],answer:'💡 El Consejo del día muestra recomendaciones sencillas para mejorar tus hábitos financieros. Puedes pedir otro consejo para continuar aprendiendo.'},
    {keys:['aprende','aprender','educacion financiera','educación financiera','finanzas'],answer:'📚 La sección Aprende está pensada para jóvenes que quieren conocer conceptos básicos de finanzas de forma sencilla, como ahorro, presupuesto y metas financieras.'},
    {keys:['herramientas','que puedo hacer','funciones','funcionalidades'],answer:'🛠️ En Finanzas Jóvenes encontrarás calculadora de presupuesto, calculadora de metas, registro de gastos, consejos, mini quiz, reto de 7 días y Mi panel.'},
    {keys:['cuenta','iniciar sesion','iniciar sesión','registrarme','crear cuenta','login'],answer:'👤 Puedes crear una cuenta o iniciar sesión desde el menú. La cuenta permite guardar información financiera y consultar tu progreso en Mi panel.'},
    {keys:['que es finanzas jovenes','qué es finanzas jóvenes','finanzas jovenes','finanzas jóvenes','pagina','página','plataforma'],answer:'💚 Finanzas Jóvenes es una plataforma para jóvenes que quieren aprender a manejar mejor su dinero. Combina educación financiera, herramientas, metas, registro de gastos y actividades interactivas.'},
    {keys:['que es ahorrar','qué es ahorrar','ahorro','importancia ahorrar','porque ahorrar','por que ahorrar'],answer:'💰 Ahorrar significa reservar una parte del dinero disponible para utilizarla después. Puede ayudarte a alcanzar metas, prepararte para gastos futuros y tener mayor control sobre tu dinero.'},
    {keys:['como ahorrar','cómo ahorrar','formas de ahorrar','tips para ahorrar','consejos para ahorrar'],answer:'💡 Para ahorrar puedes definir una meta, registrar tus gastos, diferenciar necesidades de deseos, establecer una cantidad periódica y revisar tu presupuesto. Lo importante es que la cantidad sea realista para tu situación.'},
    {keys:['ahorro emergencia','fondo emergencia','emergencias','imprevisto','imprevistos'],answer:'🛟 Un fondo para emergencias es dinero reservado para situaciones inesperadas, como una reparación o un gasto necesario. La cantidad y el objetivo pueden variar según cada persona.'},
    {keys:['necesidad','necesidades','deseo','deseos','necesidades y deseos'],answer:'🧠 Una necesidad es algo importante para vivir o cumplir una obligación, mientras que un deseo es algo que quieres pero puede esperar. Distinguirlos ayuda a tomar mejores decisiones con el dinero.'},
    {keys:['compra impulsiva','compras impulsivas','gastar de mas','gastar de más'],answer:'🛑 Una compra impulsiva ocurre cuando compras algo sin haberlo planificado. Puedes intentar esperar un tiempo, revisar tu presupuesto y preguntarte si realmente lo necesitas antes de gastar.'},
    {keys:['ingreso','ingresos','ganar dinero','dinero que recibo','salario','sueldo'],answer:'💵 Un ingreso es dinero que recibes, por ejemplo por un trabajo, una actividad o una fuente permitida. Para organizar tus finanzas conviene conocer cuánto recibes y con qué frecuencia.'},
    {keys:['deuda','deudas','endeudarse','prestamo','préstamo'],answer:'📌 Una deuda es una cantidad de dinero que debes pagar a otra persona o entidad. Antes de asumir una deuda conviene conocer cuánto tendrás que pagar, durante cuánto tiempo y si realmente puedes cumplir con los pagos.'},
    {keys:['credito','crédito','tarjeta de credito','tarjeta de crédito'],answer:'💳 El crédito permite utilizar dinero prestado y devolverlo según condiciones establecidas. Es importante revisar intereses, comisiones, fechas de pago y el costo total antes de aceptar un crédito.'},
    {keys:['interes','interés','intereses'],answer:'📈 El interés es una cantidad que puede cobrarse por utilizar dinero prestado o generarse sobre ciertos ahorros o inversiones. Su cálculo depende de las condiciones del producto financiero.'},
    {keys:['inflacion','inflación','suben los precios','precios'],answer:'📊 La inflación es un aumento general de los precios con el tiempo. Cuando los precios suben, la misma cantidad de dinero puede comprar menos que antes.'},
    {keys:['banco','bancos','cuenta bancaria','cuenta de ahorro'],answer:'🏦 Una cuenta bancaria puede servir para guardar dinero, recibir pagos y realizar operaciones. Antes de elegir una cuenta conviene revisar sus condiciones, costos y características.'},
    {keys:['seguridad financiera','seguridad','estafa','estafas','fraude','fraudes','scam','estafado'],answer:'🔐 Para cuidar tu dinero, evita compartir contraseñas, códigos de seguridad o datos bancarios con personas desconocidas. Desconfía de promesas de dinero fácil y verifica siempre quién solicita información o pagos.'},
    {keys:['inversion','inversión','invertir','inversiones'],answer:'📚 Invertir significa colocar dinero buscando obtener un rendimiento, pero siempre existe algún nivel de riesgo. Antes de invertir conviene aprender, entender el producto y no comprometer dinero que necesitas para gastos importantes.'},
    {keys:['interes compuesto','interés compuesto'],answer:'🧮 El interés compuesto ocurre cuando los rendimientos obtenidos se suman al dinero inicial y posteriormente también pueden generar rendimientos. Por eso el tiempo puede ser importante en ciertos productos financieros.'},
    {keys:['precio','costo','coste','comparar precios','comprar barato'],answer:'🛒 Antes de comprar puedes comparar precios, revisar si el producto realmente es necesario y considerar el impacto que tendrá en tu presupuesto y tus metas.'},
    {keys:['plan financiero','planificar','planificacion','planificación','organizar mis finanzas'],answer:'🗓️ Un plan financiero básico puede incluir conocer tus ingresos, registrar gastos, establecer un presupuesto, crear metas de ahorro y revisar periódicamente tu progreso.'},
    {keys:['dinero','manejar dinero','administrar dinero','administrar mi dinero','finanzas personales'],answer:'💚 Manejar bien el dinero consiste en conocer tus ingresos y gastos, organizar un presupuesto, ahorrar para objetivos y tomar decisiones de compra de forma consciente.'},
    {keys:['como hacer presupuesto','cómo hacer presupuesto','hacer un presupuesto'],answer:'📊 Para hacer un presupuesto, primero anota tus ingresos. Después registra tus gastos, sepáralos por categorías y compara el total con lo que recibes. Finalmente decide cuánto puedes destinar al ahorro y a tus metas.'},
    {keys:['cuanto debo ahorrar','cuánto debo ahorrar','porcentaje ahorrar'],answer:'💰 No existe una cantidad única que funcione para todos. Depende de tus ingresos, gastos y metas. Lo mejor es establecer una cantidad realista que puedas mantener y revisarla con tu presupuesto.'},

    // Situaciones cotidianas: permiten hacer preguntas más naturales.
    {keys:['me alcanza','me alcanzara','me alcanzará','alcanzar el dinero'],answer:'💡 Podemos revisarlo juntos. Dime cuánto dinero tienes o recibes, qué gastos debes cubrir y qué quieres comprar o ahorrar. Con esos datos podemos organizar un presupuesto sencillo.'},
    {keys:['quiero comprar','quiero comprarme','me quiero comprar','puedo comprar','deberia comprar','debería comprar'],answer:'🛒 Antes de comprar, revisa tres cosas: cuánto tienes disponible, qué gastos importantes vienen y si la compra afecta alguna meta de ahorro. Si quieres, dime el precio y cuánto dinero tienes disponible y te ayudo a analizarlo.'},
    {keys:['no puedo ahorrar','no logro ahorrar','no me alcanza','me cuesta ahorrar','dificil ahorrar','difícil ahorrar'],answer:'💚 No pasa nada si todavía te cuesta ahorrar. Empieza revisando en qué se va tu dinero, identifica un gasto que puedas reducir y establece una cantidad pequeña y realista para ahorrar periódicamente.'},
    {keys:['gasto mucho','gasto demasiado','estoy gastando','como dejar de gastar','cómo dejar de gastar'],answer:'🧾 Primero registra tus gastos durante varios días. Después sepáralos entre necesidades y deseos y revisa cuáles podrías reducir. Así tendrás información real antes de hacer cambios.'},
    {keys:['quiero ahorrar para','ahorrar para','meta para comprar','juntar dinero para'],answer:'🎯 ¡Perfecto! Convierte eso en una meta. Dime qué quieres conseguir, cuánto cuesta aproximadamente y en cuánto tiempo te gustaría lograrlo, y podemos calcular una cantidad de ahorro periódica.'},
    {keys:['me prestaron','prestar dinero','me pidieron dinero','prestarle dinero'],answer:'🤝 Antes de prestar dinero, piensa si puedes permitirte no disponer de esa cantidad durante un tiempo y deja claros los acuerdos. También es importante no comprometer dinero que necesitas para tus gastos.'},
    {keys:['trabajo','trabajar','primer sueldo','primer salario','mi primer pago'],answer:'💵 Cuando recibas un pago, puedes dividirlo en categorías: gastos necesarios, ahorro y metas, dejando también una cantidad para gastos personales. La proporción depende de tu situación.'},
    {keys:['mes','fin de mes','final de mes','semana','quincena'],answer:'🗓️ Una buena práctica es revisar tus ingresos y gastos por períodos, por ejemplo semanalmente, quincenalmente o al final de cada mes. Así puedes detectar a tiempo si estás gastando más de lo planeado.'},
    {keys:['familia','amigos','compartir gastos','gasto compartido'],answer:'🤝 Cuando compartas un gasto, acuerden desde el principio cuánto corresponde a cada persona y cuándo se realizará el pago. Llevar un registro evita confusiones.'},
    {keys:['escuela','colegio','universidad','estudiante','estudiantes','clases'],answer:'🎓 Como estudiante puedes empezar con algo sencillo: registrar tus gastos diarios, separar dinero para transporte o materiales, establecer una pequeña meta de ahorro y revisar tu presupuesto cada semana.'}
  ];

  const normalize = text => String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ\s]/g,' ').replace(/\s+/g,' ').trim();

  function addDynamicKnowledge(rows){
    for(const row of rows || []){
      if(!row || row.active===false || !row.answer) continue;
      KNOWLEDGE.push({keys:Array.isArray(row.keywords)?row.keywords:[row.question],answer:row.answer});
    }
  }

  async function initDatabase(){
    try{
      if(!window.supabase || typeof window.supabase.createClient!=='function') return;
      db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const {data,error}=await db.from('chatbot_knowledge').select('question,keywords,answer,active').eq('active',true).limit(200);
      if(!error) addDynamicKnowledge(data);
    }catch(e){ console.warn('FJ: no se pudo cargar la base de conocimiento.',e); }
  }

  async function saveUnknownQuestion(question){
    if(!db) return;
    try{
      const normalized=normalize(question);
      const {data}=await db.from('chatbot_questions').select('id').eq('normalized_question',normalized).eq('status','pendiente').limit(1);
      if(data && data.length) return;
      await db.from('chatbot_questions').insert({question:question.slice(0,500),normalized_question:normalized,category:'sin_respuesta',status:'pendiente'});
    }catch(e){ console.warn('FJ: no se pudo guardar la pregunta.',e); }
  }

  function findAnswer(question){
    const q=normalize(question);
    if(!q) return {answer:'Escribe una pregunta y te ayudaré. 💚',known:true};

    const greetings=['hola','holi','buenas','hey','buenos dias','buenas tardes','buenas noches','que tal','qué tal'];
    if(greetings.some(x=>q===normalize(x) || q.startsWith(normalize(x)+' '))) return {answer:'¡Hola! 👋 Soy FJ, el asistente de Finanzas Jóvenes. Puedes preguntarme de forma natural sobre dinero, ahorro, compras, presupuesto, gastos, metas, deudas, crédito, estudios o sobre cómo usar la plataforma.',known:true};

    const thanks=['gracias','muchas gracias','te agradezco','gracias fj'];
    if(thanks.some(x=>q===normalize(x) || q.includes(normalize(x)))) return {answer:'¡Con gusto! 💚 Si quieres, puedes hacerme otra pregunta o contarme una situación y la revisamos juntos.',known:true};

    const goodbye=['adios','adiós','bye','nos vemos','hasta luego'];
    if(goodbye.some(x=>q===normalize(x) || q.startsWith(normalize(x)+' '))) return {answer:'¡Nos vemos! 👋 Cuando quieras puedes volver a preguntarme algo.',known:true};

    let best=null,bestScore=0;
    const words=new Set(q.split(' ').filter(w=>w.length>=3));
    for(const item of KNOWLEDGE){
      let score=0;
      for(const key of item.keys){
        const k=normalize(key);
        if(!k) continue;
        if(q.includes(k)) score += k.split(' ').length>1 ? 5 : 2;
        else if(k.length>=5 && words.has(k)) score += 2;
      }
      if(score>bestScore){bestScore=score;best=item;}
    }
    if(best && bestScore>=2) return {answer:best.answer,known:true};

    // Respuestas abiertas por intención, aunque la frase no coincida exactamente con una palabra clave.
    const hasAny=(arr)=>arr.some(x=>q.includes(x));
    if(hasAny(['cuanto tengo','cuanto recibo','cuanto gano','cuanto dinero']) && hasAny(['gasto','gastare','necesito','puedo'])) return {answer:'💡 Puedo ayudarte a organizar esos números. Dime cuánto dinero recibes o tienes disponible, cuáles son tus gastos y qué quieres conseguir. No necesitas darme datos personales.',known:true};
    if(hasAny(['como puedo','como hago','que hago','qué hago','ayudame','ayúdame']) && hasAny(['dinero','gasto','ahorro','comprar','compra','meta','deuda','presupuesto'])) return {answer:'💚 Claro. Cuéntame un poco más de tu situación: qué quieres lograr, cuánto dinero tienes disponible y qué gastos debes cubrir. Con eso puedo orientarte con pasos sencillos.',known:true};
    if(hasAny(['es bueno','es malo','conviene','vale la pena','me recomiendas']) && hasAny(['comprar','gastar','ahorrar','deuda','prestamo','préstamo','credito','crédito'])) return {answer:'🤔 Depende de tus ingresos, gastos, objetivo y condiciones. Si me cuentas qué estás pensando hacer y los datos básicos de la situación, puedo explicarte los aspectos que conviene revisar antes de decidir.',known:true};

    return {answer:'🤖 No necesito que escribas una pregunta exacta. Puedes contarme una situación con tus propias palabras, por ejemplo: “me dan Q500 al mes y quiero ahorrar para una laptop”, “gasto mucho en comida” o “quiero saber si me alcanza para algo”. 💚 Si aun así no entiendo la pregunta, la guardaré para ampliar mi conocimiento.',known:false};
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
      .fj-chat-form{display:flex;gap:7px;padding:11px;border-top:1px solid #294034;background:#09110c}
      #fjChatInput{min-width:0;flex:1;padding:10px 11px;border:1px solid #294034;border-radius:12px;background:#050b07;color:#f4faf6;outline:none}
      #fjChatInput:focus{border-color:#39ff88}
      #fjChatSend{border:0;background:#39ff88;color:#041008;border-radius:12px;padding:0 14px;font-weight:900;cursor:pointer}
      @media(max-width:600px){#fjChatbot{right:14px;bottom:88px}#fjChatPanel{right:-4px;bottom:72px;width:min(360px,calc(100vw - 28px));height:70vh;max-height:520px}}
    `;
    document.head.appendChild(style);
    const root=document.createElement('div');root.id='fjChatbot';
    root.innerHTML=`
      <div id="fjChatPanel" aria-label="Chat de Finanzas Jóvenes">
        <div class="fj-chat-head"><div><div class="fj-chat-title">🤖 <span>FJ</span> · Asistente</div><div class="fj-chat-sub">Finanzas Jóvenes · Educación financiera</div></div><button class="fj-chat-close" id="fjChatClose" aria-label="Cerrar">×</button></div>
        <div id="fjChatMessages"></div>
        <form class="fj-chat-form" id="fjChatForm"><input id="fjChatInput" maxlength="500" autocomplete="off" placeholder="Cuéntame tu pregunta o situación..."><button id="fjChatSend" type="submit">➤</button></form>
      </div>
      <button id="fjChatButton" aria-label="Abrir asistente">🤖</button>
    `;
    document.body.appendChild(root);
    const panel=document.getElementById('fjChatPanel'),messages=document.getElementById('fjChatMessages'),input=document.getElementById('fjChatInput');
    function addMessage(text,type){const el=document.createElement('div');el.className='fj-msg '+type;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;}
    async function ask(text){const q=String(text||'').trim();if(!q)return;addMessage(q,'user');input.value='';const result=findAnswer(q);setTimeout(()=>addMessage(result.answer,'bot'),180);if(!result.known) await saveUnknownQuestion(q);}
    document.getElementById('fjChatButton').onclick=()=>{panel.classList.toggle('show');if(panel.classList.contains('show'))input.focus();};
    document.getElementById('fjChatClose').onclick=()=>panel.classList.remove('show');
    document.getElementById('fjChatForm').onsubmit=e=>{e.preventDefault();ask(input.value)};
    addMessage('¡Hola! 👋 Soy FJ. Puedes preguntarme con tus propias palabras sobre dinero, ahorro, gastos, compras, metas, presupuesto o sobre la plataforma.','bot');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{initDatabase();inject();}); else {initDatabase();inject();}
})();
