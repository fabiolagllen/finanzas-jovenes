/* FinanJoven — controles extra para juegos */
(function(){
'use strict';

function init(){
  const btn=document.querySelector('#fjGames .fj-game:first-child .fj-game-btn');
  const board=document.getElementById('fjCartBoard');
  const area=document.getElementById('fjCartArea');
  const cart=document.getElementById('fjCart');
  if(!btn||!board||!area||!cart){setTimeout(init,250);return;}
  if(window.__fjCartControlsReady)return;
  window.__fjCartControlsReady=true;

  let timer=null,spawnTimer=null,fallTimers=new Set();
  let running=false,paused=false,score=0,time=30,x=50;
  let keyHandler=null;

  const rand=(min,max)=>Math.random()*(max-min)+min;
  const scoreEl=()=>document.getElementById('fjCartScore');
  const timeEl=()=>document.getElementById('fjCartTime');
  const setButton=(label,mode)=>{
    btn.textContent=label;
    btn.dataset.state=mode;
    btn.classList.toggle('is-paused',mode==='paused');
  };
  const moveTo=v=>{x=Math.max(7,Math.min(93,v));cart.style.left=x+'%';};
  const clearFalling=()=>{fallTimers.forEach(id=>clearInterval(id));fallTimers.clear();};
  const clearGameTimers=()=>{clearInterval(timer);clearInterval(spawnTimer);timer=null;spawnTimer=null;clearFalling();};
  const cleanup=()=>{clearGameTimers();board.querySelectorAll('.fj-target').forEach(e=>e.remove());if(keyHandler)document.removeEventListener('keydown',keyHandler);keyHandler=null;running=false;paused=false;board.classList.remove('is-paused');};

  const award=async points=>{
    if(!points||!window.supabaseClient)return;
    try{
      const {data:{session}}=await window.supabaseClient.auth.getSession();
      if(!session)return;
      const {data:old}=await window.supabaseClient.from('game_progress').select('points,games_played,games_won').eq('user_id',session.user.id).maybeSingle();
      const total=(old?.points||0)+points;
      const played=(old?.games_played||0)+1;
      const won=(old?.games_won||0)+1;
      await window.supabaseClient.from('game_progress').upsert({user_id:session.user.id,points:total,games_played:played,games_won:won,updated_at:new Date().toISOString()},{onConflict:'user_id'});
      const wanted=[];
      if(played>=1)wanted.push('first_game');
      if(total>=50)wanted.push('fifty_points');
      if(played>=3)wanted.push('three_games');
      if(total>=150)wanted.push('organized');
      if(total>=300)wanted.push('expert');
      const {data:earned}=await window.supabaseClient.from('game_badges').select('badge_key').eq('user_id',session.user.id);
      const have=new Set((earned||[]).map(v=>v.badge_key));
      for(const key of wanted)if(!have.has(key))await window.supabaseClient.from('game_badges').insert({user_id:session.user.id,badge_key:key});
      document.dispatchEvent(new CustomEvent('fj:games-progress-updated'));
    }catch(e){console.warn(e)}
  };

  const finish=()=>{
    const points=score>=120?15:score>=70?10:score>=30?5:0;
    cleanup();
    setButton('↻ Jugar de nuevo','finished');
    if(time<=0)timeEl().textContent='⏱️ 0';
    award(points);
  };

  const spawn=()=>{
    if(!running||paused)return;
    const good=Math.random()>.3;
    const b=document.createElement('button');
    b.className='fj-target '+(good?'fj-bill-target':'fj-bad-target');
    b.type='button';b.textContent=good?'💵':'🧾';
    b.style.left=rand(8,92)+'%';b.style.top='42px';board.appendChild(b);
    let y=42;
    const fall=setInterval(()=>{
      if(!b.isConnected){clearInterval(fall);fallTimers.delete(fall);return;}
      if(paused)return;
      y+=7;b.style.top=y+'px';
      const br=b.getBoundingClientRect(),cr=cart.getBoundingClientRect();
      if(br.bottom>=cr.top&&br.left<cr.right&&br.right>cr.left){
        clearInterval(fall);fallTimers.delete(fall);
        score=Math.max(0,score+(good?10:-10));
        scoreEl().textContent='💰 '+score;b.remove();return;
      }
      if(y>285){clearInterval(fall);fallTimers.delete(fall);b.remove();}
    },70);
    fallTimers.add(fall);
  };

  const start=()=>{
    cleanup();score=0;time=30;x=50;running=true;paused=false;
    area.classList.add('show');moveTo(50);board.querySelectorAll('.fj-target').forEach(e=>e.remove());
    scoreEl().textContent='💰 0';timeEl().textContent='⏱️ 30';setButton('⏸ Pausar','running');
    const pointer=e=>{if(paused)return;const r=board.getBoundingClientRect();moveTo(((e.clientX-r.left)/r.width)*100)};
    board.onpointermove=pointer;
    keyHandler=e=>{if(paused)return;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')moveTo(x-7);if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')moveTo(x+7)};
    document.addEventListener('keydown',keyHandler);
    spawn();spawnTimer=setInterval(spawn,560);
    timer=setInterval(()=>{if(paused)return;time--;timeEl().textContent='⏱️ '+time;if(time<=0)finish();},1000);
  };

  const togglePause=()=>{
    if(!running){start();return;}
    paused=!paused;
    if(paused){
      setButton('▶ Reanudar','paused');
      board.classList.add('is-paused');
    }else{
      setButton('⏸ Pausar','running');
      board.classList.remove('is-paused');
    }
  };

  window.fjCartStart=togglePause;
  btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();togglePause();},{capture:true});

  const style=document.createElement('style');
  style.textContent=`
    #fjGames .fj-game:first-child .fj-game-btn{transition:.2s ease}
    #fjGames .fj-game:first-child .fj-game-btn.is-paused{background:#b5ff63;box-shadow:0 0 0 1px rgba(181,255,99,.18),0 8px 22px rgba(181,255,99,.08)}
    #fjGames .fj-game:first-child .fj-game-btn[data-state="finished"]{background:#39ff88}
    #fjGames #fjCartBoard.is-paused:after{content:'⏸ JUEGO PAUSADO';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(3,8,5,.58);backdrop-filter:blur(2px);color:#b5ff63;font-weight:900;font-size:1rem;letter-spacing:.7px;z-index:20}
    #fjGames #fjCartBoard.is-paused .fj-target{opacity:.8}
  `;
  document.head.appendChild(style);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
