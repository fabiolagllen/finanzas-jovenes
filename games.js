/* Finanzas Jóvenes — Centro de juegos */
(function(){
  'use strict';
  if(document.getElementById('fjGames')) return;

  const style=document.createElement('style');
  style.textContent=`
    .fj-games-wrap{max-width:1180px;margin:auto;padding:72px 24px}
    .fj-games-title{text-align:center;margin-bottom:32px}
    .fj-games-title h2{font-size:2.1rem;margin-bottom:6px}.fj-games-title p{color:#9eafa5}
    .fj-games-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .fj-game{background:linear-gradient(145deg,#152219,#101912);border:1px solid #294034;border-radius:21px;padding:24px;box-shadow:0 12px 35px #0004;transition:.25s;position:relative;overflow:hidden}
    .fj-game:hover{transform:translateY(-5px);border-color:#3e6a4c}.fj-game-icon{font-size:2.3rem;margin-bottom:8px}.fj-game h3{margin-bottom:5px}.fj-game-desc{color:#9eafa5;font-size:.9rem;min-height:50px}
    .fj-game-tag{display:inline-block;margin:10px 0 12px;padding:4px 9px;border-radius:999px;background:#0d2517;border:1px solid #28553a;color:#39ff88;font-size:.72rem;font-weight:800}
    .fj-game-btn{border:0;background:#39ff88;color:#041008;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer}.fj-game-btn.alt{background:#132019;color:#39ff88;border:1px solid #355440}
    .fj-game-area{display:none;margin-top:16px;padding-top:16px;border-top:1px solid #294034}.fj-game-area.show{display:block}
    .fj-score{color:#39ff88;font-weight:900;margin-bottom:8px}.fj-question{font-weight:800;margin-bottom:10px}.fj-options{display:grid;gap:8px}.fj-option{width:100%;padding:10px;border:1px solid #294034;background:#0a110d;color:#dce9e1;border-radius:11px;text-align:left;cursor:pointer}.fj-option:hover{border-color:#39ff88}.fj-option.good{border-color:#39ff88;background:#0c2918}.fj-option.bad{border-color:#ff6978;background:#291214}
    .fj-budget-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.fj-budget-row input{width:100%;padding:10px;border:1px solid #2d4235;border-radius:10px;background:#09100c;color:#f4faf6;outline:none}.fj-budget-result{margin-top:10px;min-height:42px;padding:10px;border-radius:10px;background:#0d2116;color:#baffcf;font-size:.88rem}
    .fj-coin-game{text-align:center}.fj-coins{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;min-height:110px;padding:10px}.fj-coin{width:46px;height:46px;border:0;border-radius:50%;background:#b5ff63;color:#07100b;font-size:20px;cursor:pointer;box-shadow:0 0 16px rgba(181,255,99,.18)}
    @media(max-width:900px){.fj-games-grid{grid-template-columns:1fr}.fj-games-wrap{padding:55px 20px}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.id='juegos';
  section.className='fj-games-wrap';
  section.innerHTML=`
    <div class="fj-games-title"><h2>🎮 Centro de juegos</h2><p>Aprende sobre dinero tomando decisiones, resolviendo retos y jugando.</p></div>
    <div class="fj-games-grid">
      <article class="fj-game">
        <div class="fj-game-icon">🧠</div><h3>¿Necesidad o deseo?</h3>
        <p class="fj-game-desc">Clasifica compras y aprende a pensar antes de gastar.</p><span class="fj-game-tag">Fácil · 5 preguntas</span><br><button class="fj-game-btn" onclick="fjNeedStart()">Jugar</button>
        <div id="fjNeedArea" class="fj-game-area"><div class="fj-score" id="fjNeedScore">0 / 5</div><div class="fj-question" id="fjNeedQ"></div><div class="fj-options" id="fjNeedOptions"></div></div>
      </article>
      <article class="fj-game">
        <div class="fj-game-icon">💰</div><h3>Elige tu mejor presupuesto</h3>
        <p class="fj-game-desc">Reparte un ingreso entre gastos, ahorro y gustos sin quedarte en negativo.</p><span class="fj-game-tag">Intermedio · decisiones</span><br><button class="fj-game-btn" onclick="fjBudgetStart()">Jugar</button>
        <div id="fjBudgetArea" class="fj-game-area"><div class="fj-score" id="fjBudgetScore"></div><div class="fj-question">Tienes Q1,000. ¿Cuánto quieres destinar?</div><div class="fj-budget-row"><input id="fjNeeds" type="number" min="0" placeholder="Necesidades"><input id="fjSave" type="number" min="0" placeholder="Ahorro"></div><input id="fjWants" type="number" min="0" placeholder="Gustos" style="width:100%;margin-top:8px;padding:10px;border:1px solid #2d4235;border-radius:10px;background:#09100c;color:#f4faf6"><button class="fj-game-btn" style="margin-top:9px" onclick="fjBudgetCheck()">Comprobar</button><div class="fj-budget-result" id="fjBudgetResult">La suma debe ser Q1,000 o menos.</div></div>
      </article>
      <article class="fj-game">
        <div class="fj-game-icon">🪙</div><h3>Atrapa el ahorro</h3>
        <p class="fj-game-desc">Haz clic en las monedas antes de que termine el tiempo y suma puntos.</p><span class="fj-game-tag">Rápido · 15 segundos</span><br><button class="fj-game-btn" onclick="fjCoinStart()">Jugar</button>
        <div id="fjCoinArea" class="fj-game-area fj-coin-game"><div class="fj-score" id="fjCoinScore">Puntos: 0 · Tiempo: 15</div><div class="fj-coins" id="fjCoins"></div></div>
      </article>
    </div>`;

  const panel=document.getElementById('panel');
  if(panel) panel.parentNode.insertBefore(section,panel); else document.querySelector('main')?.appendChild(section);

  const nav=document.querySelector('header nav > div:nth-child(2)');
  if(nav && !nav.querySelector('a[href="#juegos"]')){
    const link=document.createElement('a');link.href='#juegos';link.textContent='🎮 Juegos';
    const retos=nav.querySelector('a[href="#interactivo"]');
    retos ? nav.insertBefore(link,retos) : nav.appendChild(link);
  }

  const logo=document.querySelector('.logo');
  if(logo){logo.style.textAlign='center';logo.style.paddingLeft='7px';logo.style.paddingRight='7px';logo.style.fontSize='1.13rem';logo.style.whiteSpace='nowrap';}

  const needQuestions=[
    ['Comprar comida para almorzar','Necesidad'],['Comprar una camiseta porque está de moda','Deseo'],['Pagar el transporte para llegar a clases','Necesidad'],['Comprar otro accesorio aunque ya tienes uno','Deseo'],['Comprar un cuaderno que necesitas para estudiar','Necesidad']
  ];
  let needIndex=0,needScore=0,needLocked=false;
  window.fjNeedStart=function(){needIndex=0;needScore=0;document.getElementById('fjNeedArea').classList.add('show');fjNeedPaint();};
  function fjNeedPaint(){const q=needQuestions[needIndex];document.getElementById('fjNeedScore').textContent=needScore+' / 5';document.getElementById('fjNeedQ').textContent=q[0];document.getElementById('fjNeedOptions').innerHTML=['Necesidad','Deseo'].map(x=>`<button class="fj-option" onclick="fjNeedAnswer(this,'${x}')">${x}</button>`).join('');needLocked=false;}
  window.fjNeedAnswer=function(btn,value){if(needLocked)return;needLocked=true;const correct=needQuestions[needIndex][1]===value;btn.classList.add(correct?'good':'bad');if(correct)needScore++;document.getElementById('fjNeedScore').textContent=needScore+' / 5';setTimeout(()=>{needIndex++;if(needIndex<needQuestions.length)fjNeedPaint();else{document.getElementById('fjNeedQ').textContent=needScore>=4?'🎉 ¡Excelente! Ya distingues mejor necesidades y deseos.':'💡 Buen intento. Recuerda pensar si realmente lo necesitas antes de gastar.';document.getElementById('fjNeedOptions').innerHTML='<button class="fj-game-btn alt" onclick="fjNeedStart()">Jugar de nuevo</button>'; }},550);};

  window.fjBudgetStart=function(){document.getElementById('fjBudgetArea').classList.add('show');document.getElementById('fjBudgetScore').textContent='Meta: usa Q1,000 de forma equilibrada.';document.getElementById('fjBudgetResult').textContent='Prueba una distribución que incluya necesidades y algo de ahorro.';};
  window.fjBudgetCheck=function(){const n=Number(document.getElementById('fjNeeds').value)||0,s=Number(document.getElementById('fjSave').value)||0,w=Number(document.getElementById('fjWants').value)||0,total=n+s+w,r=document.getElementById('fjBudgetResult');if(total>1000){r.textContent='⚠️ Te pasaste de Q1,000. Reduce alguna categoría.';return}if(s<100){r.textContent='💡 Vas bien, pero intenta reservar al menos una pequeña cantidad para ahorrar.';return}if(n<400){r.textContent='🔎 Revisa si tus necesidades están cubiertas antes de aumentar los gustos.';return}r.textContent='🎉 ¡Buen presupuesto! Cubres necesidades, incluyes ahorro y dejas espacio para gustos.';};

  let coinTimer=null,coinScore=0,coinTime=15;
  window.fjCoinStart=function(){clearInterval(coinTimer);coinScore=0;coinTime=15;document.getElementById('fjCoinArea').classList.add('show');fjCoinRender();coinTimer=setInterval(()=>{coinTime--;fjCoinRender();if(coinTime<=0){clearInterval(coinTimer);document.getElementById('fjCoins').innerHTML='<strong>⏰ Tiempo terminado</strong><br><button class="fj-game-btn alt" onclick="fjCoinStart()">Jugar de nuevo</button>';document.getElementById('fjCoinScore').textContent='Puntuación final: '+coinScore; }},1000);};
  function fjCoinRender(){document.getElementById('fjCoinScore').textContent='Puntos: '+coinScore+' · Tiempo: '+coinTime;const box=document.getElementById('fjCoins');box.innerHTML='';if(coinTime<=0)return;for(let i=0;i<Math.min(7,3+Math.floor(Math.random()*5));i++){const b=document.createElement('button');b.className='fj-coin';b.textContent='Q';b.onclick=()=>{coinScore++;b.remove();document.getElementById('fjCoinScore').textContent='Puntos: '+coinScore+' · Tiempo: '+coinTime;};box.appendChild(b);}}
})();
