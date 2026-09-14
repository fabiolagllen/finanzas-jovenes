// Configuración pública de Supabase.
const SUPABASE_URL = 'https://pgfgmxeqisrwkrwtvbum.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* Finanzas Jóvenes - datos persistentes por usuario.
   Las tablas tienen RLS, por lo que cada usuario solo puede trabajar con sus propios datos. */
(function(){
  let currentSession = null;
  let cloudReady = false;
  let goals = [];
  let currentBudget = null;

  const today = () => new Date().toISOString().slice(0,10);
  const monthRange = () => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth()+1, 0);
    return {start:start.toISOString().slice(0,10), end:end.toISOString().slice(0,10)};
  };

  function notify(text, type='success'){
    const old = document.getElementById('dataNotice');
    if(old) old.remove();
    const el = document.createElement('div');
    el.id='dataNotice';
    el.textContent=text;
    el.style.cssText='position:fixed;right:20px;bottom:20px;z-index:200;padding:13px 17px;border-radius:13px;background:'+(type==='error'?'#351519':'#0d2a19')+';color:'+(type==='error'?'#ffb1b5':'#aaffc5')+';border:1px solid '+(type==='error'?'#693139':'#2c6542')+';box-shadow:0 12px 35px #0009;font-weight:700;max-width:360px';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3200);
  }

  function injectDataPanel(){
    if(document.getElementById('cloudDataPanel')) return;
    const dashboard = document.querySelector('.dashboard');
    if(!dashboard) return;
    const box=document.createElement('div');
    box.id='cloudDataPanel';
    box.style.cssText='margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:15px';
    box.innerHTML=`
      <div class="dashboard-card" style="grid-column:1/-1">
        <span>☁️ Tus datos están sincronizados con tu cuenta</span>
        <strong style="font-size:1rem;color:#baffcf;margin-top:5px">Gastos, metas y presupuesto se guardan en Supabase.</strong>
      </div>
      <div class="dashboard-card">
        <h3 style="margin-bottom:10px">🎯 Mi meta de ahorro</h3>
        <label for="cloudGoalName">Nombre de la meta</label>
        <input class="input" id="cloudGoalName" placeholder="Ej. Mi laptop">
        <label for="cloudGoalTarget">Cantidad objetivo (Q)</label>
        <input class="input" id="cloudGoalTarget" type="number" min="1" placeholder="Ej. 5000">
        <label for="cloudGoalCurrent">Ya tengo ahorrado (Q)</label>
        <input class="input" id="cloudGoalCurrent" type="number" min="0" value="0">
        <label for="cloudGoalDate">Fecha objetivo (opcional)</label>
        <input class="input" id="cloudGoalDate" type="date">
        <button class="button" style="margin-top:13px" onclick="saveCloudGoal()">Guardar meta 🎯</button>
        <div id="goalCloudList" style="margin-top:14px"></div>
      </div>
      <div class="dashboard-card">
        <h3 style="margin-bottom:10px">💵 Mi presupuesto mensual</h3>
        <p style="color:#9eafa5;font-size:.9rem">Guarda cuánto recibes al mes y compáralo con tus gastos registrados.</p>
        <label for="cloudBudgetIncome">Ingresos mensuales (Q)</label>
        <input class="input" id="cloudBudgetIncome" type="number" min="0" placeholder="Ej. 1500">
        <button class="button" style="margin-top:13px" onclick="saveCloudBudget()">Guardar presupuesto 💾</button>
        <div id="budgetCloudResult" class="result" style="margin-top:14px">Todavía no has guardado un presupuesto.</div>
      </div>`;
    dashboard.appendChild(box);
  }

  async function loadExpenses(){
    if(!currentSession) return;
    const {data,error}=await supabaseClient
      .from('expenses')
      .select('*')
      .eq('user_id',currentSession.user.id)
      .order('expense_date',{ascending:false})
      .order('created_at',{ascending:false});
    if(error){console.error(error);notify('No se pudieron cargar tus gastos.','error');return}
    expenses=(data||[]).map(e=>({id:e.id,name:e.description,amount:Number(e.amount),category:e.category,date:e.expense_date}));
    cloudReady=true;
    renderExpenses();
  }

  async function migrateLocalExpenses(){
    if(!currentSession) return;
    const local=JSON.parse(localStorage.getItem('fj_expenses')||'[]');
    if(!local.length) return;
    const {count,error:countError}=await supabaseClient
      .from('expenses').select('id',{count:'exact',head:true}).eq('user_id',currentSession.user.id);
    if(countError || count>0) return;
    const rows=local.filter(e=>e && e.name && Number(e.amount)>0).map(e=>({
      user_id:currentSession.user.id,
      description:String(e.name),
      amount:Number(e.amount),
      category:'Otros',
      expense_date:today()
    }));
    if(!rows.length) return;
    const {error}=await supabaseClient.from('expenses').insert(rows);
    if(!error){localStorage.removeItem('fj_expenses');notify('Tus gastos anteriores fueron guardados en tu cuenta. 💚')}
  }

  window.addExpense=async function(){
    const name=document.getElementById('expenseName').value.trim();
    const amount=Number(document.getElementById('expenseAmount').value);
    if(!name||amount<=0){alert('Escribe un gasto y un monto válido.');return}
    if(!currentSession){
      expenses.push({name,amount});
      localStorage.setItem('fj_expenses',JSON.stringify(expenses));
      document.getElementById('expenseName').value='';document.getElementById('expenseAmount').value='';renderExpenses();return;
    }
    const {data,error}=await supabaseClient.from('expenses').insert({
      user_id:currentSession.user.id,description:name,amount,category:'Otros',expense_date:today()
    }).select().single();
    if(error){console.error(error);notify('No se pudo guardar el gasto: '+error.message,'error');return}
    expenses.unshift({id:data.id,name:data.description,amount:Number(data.amount),category:data.category,date:data.expense_date});
    document.getElementById('expenseName').value='';document.getElementById('expenseAmount').value='';renderExpenses();
    notify('Gasto guardado en tu cuenta. ☁️');
  };

  window.removeExpense=async function(i){
    const item=expenses[i];
    if(!item) return;
    if(currentSession && item.id){
      const {error}=await supabaseClient.from('expenses').delete().eq('id',item.id);
      if(error){console.error(error);notify('No se pudo eliminar el gasto.','error');return}
    }
    expenses.splice(i,1);
    if(!currentSession) localStorage.setItem('fj_expenses',JSON.stringify(expenses));
    renderExpenses();
  };

  window.renderExpenses=function(){
    const list=document.getElementById('expenseList');
    if(!list)return;
    if(!expenses.length) list.innerHTML='<p style="color:#9eafa5;font-size:.9rem">Todavía no has registrado gastos.</p>';
    else list.innerHTML=expenses.map((e,i)=>`<div class="expense"><span><strong>${escapeHtml(e.name)}</strong><br><small>${money(e.amount)}${e.date?' · '+e.date:''}</small></span><button class="delete" onclick="removeExpense(${i})">Eliminar</button></div>`).join('');
    const total=expenses.reduce((s,e)=>s+Number(e.amount||0),0);
    document.getElementById('totalExpenses').textContent=money(total);
    document.getElementById('expenseCount').textContent=expenses.length;
    document.getElementById('financialStatus').textContent=expenses.length?(total>1000?'Revisa tus gastos':'Buen comienzo'):'Sin datos';
    updateBudgetResult();
  };

  async function loadGoals(){
    if(!currentSession)return;
    const {data,error}=await supabaseClient.from('savings_goals').select('*').eq('user_id',currentSession.user.id).order('created_at',{ascending:false});
    if(error){console.error(error);return}
    goals=data||[];
    renderGoals();
  }

  function renderGoals(){
    const list=document.getElementById('goalCloudList');
    if(!list)return;
    if(!goals.length){list.innerHTML='<p style="color:#9eafa5;font-size:.88rem">Todavía no tienes una meta guardada.</p>';return}
    list.innerHTML=goals.map(g=>{
      const target=Number(g.target_amount),current=Number(g.current_amount),pct=Math.min(current/target*100,100);
      return `<div style="padding:13px;background:#0a110d;border:1px solid #294034;border-radius:12px;margin-top:9px"><strong>${escapeHtml(g.name)}</strong><div style="display:flex;justify-content:space-between;color:#9eafa5;font-size:.8rem;margin:5px 0"><span>${money(current)} de ${money(target)}</span><span>${pct.toFixed(0)}%</span></div><div class="bar"><div style="width:${pct}%"></div></div>${g.target_date?`<small style="color:#9eafa5;display:block;margin-top:5px">Meta: ${g.target_date}</small>`:''}<div style="display:flex;gap:7px;margin-top:9px"><input class="input" id="addGoal_${g.id}" type="number" min="0.01" placeholder="Añadir Q" style="padding:9px"><button class="button" onclick="addToGoal('${g.id}')">Añadir</button></div></div>`;
    }).join('');
  }

  window.saveCloudGoal=async function(){
    if(!currentSession){notify('Inicia sesión para guardar una meta.','error');return}
    const name=document.getElementById('cloudGoalName').value.trim();
    const target=Number(document.getElementById('cloudGoalTarget').value);
    const current=Number(document.getElementById('cloudGoalCurrent').value||0);
    const targetDate=document.getElementById('cloudGoalDate').value||null;
    if(!name||target<=0||current<0||current>target){notify('Revisa los datos de tu meta.','error');return}
    const {data,error}=await supabaseClient.from('savings_goals').insert({user_id:currentSession.user.id,name,target_amount:target,current_amount:current,target_date:targetDate}).select().single();
    if(error){console.error(error);notify('No se pudo guardar la meta: '+error.message,'error');return}
    goals.unshift(data);renderGoals();
    document.getElementById('cloudGoalName').value='';document.getElementById('cloudGoalTarget').value='';document.getElementById('cloudGoalCurrent').value='0';document.getElementById('cloudGoalDate').value='';
    notify('Meta guardada. ¡A trabajar por ella! 🎯');
  };

  window.addToGoal=async function(id){
    const input=document.getElementById('addGoal_'+id);const amount=Number(input?.value);
    const goal=goals.find(g=>g.id===id);
    if(!goal||amount<=0){notify('Escribe una cantidad válida.','error');return}
    const next=Number(goal.current_amount)+amount;
    if(next>Number(goal.target_amount)){notify('Esa cantidad supera tu meta.','error');return}
    const {data,error}=await supabaseClient.from('savings_goals').update({current_amount:next}).eq('id',id).select().single();
    if(error){console.error(error);notify('No se pudo actualizar la meta.','error');return}
    goals=goals.map(g=>g.id===id?data:g);renderGoals();notify('¡Ahorro añadido! 💚');
  };

  async function loadBudget(){
    if(!currentSession)return;
    const {start,end}=monthRange();
    const {data,error}=await supabaseClient.from('budgets').select('*').eq('user_id',currentSession.user.id).eq('period_start',start).eq('period_end',end).order('created_at',{ascending:false}).limit(1);
    if(error){console.error(error);return}
    currentBudget=data?.[0]||null;
    const input=document.getElementById('cloudBudgetIncome');
    if(input)input.value=currentBudget?Number(currentBudget.income):'';
    updateBudgetResult();
  }

  function updateBudgetResult(){
    const r=document.getElementById('budgetCloudResult');
    if(!r)return;
    if(!currentBudget){r.textContent='Todavía no has guardado un presupuesto.';r.className='result';return}
    const income=Number(currentBudget.income),spent=expenses.reduce((s,e)=>s+Number(e.amount||0),0),left=income-spent;
    r.textContent=left>=0?`Ingresos: ${money(income)} · Gastado: ${money(spent)} · Disponible: ${money(left)}`:`Ingresos: ${money(income)} · Gastado: ${money(spent)} · Te faltan ${money(Math.abs(left))}`;
    r.className=left>=0?'result good':'result warn';
  }

  window.saveCloudBudget=async function(){
    if(!currentSession){notify('Inicia sesión para guardar tu presupuesto.','error');return}
    const income=Number(document.getElementById('cloudBudgetIncome').value);
    if(income<0||!Number.isFinite(income)){notify('Escribe un ingreso mensual válido.','error');return}
    const {start,end}=monthRange();
    if(currentBudget){
      const {data,error}=await supabaseClient.from('budgets').update({income,updated_at:new Date().toISOString()}).eq('id',currentBudget.id).select().single();
      if(error){console.error(error);notify('No se pudo actualizar el presupuesto.','error');return}
      currentBudget=data;
    }else{
      const {data,error}=await supabaseClient.from('budgets').insert({user_id:currentSession.user.id,name:'Presupuesto mensual',period_start:start,period_end:end,income}).select().single();
      if(error){console.error(error);notify('No se pudo guardar el presupuesto: '+error.message,'error');return}
      currentBudget=data;
    }
    updateBudgetResult();notify('Presupuesto guardado. 💵');
  };

  async function loadCloudData(session){
    currentSession=session;cloudReady=false;
    injectDataPanel();
    if(!session){
      currentBudget=null;goals=[];
      expenses=JSON.parse(localStorage.getItem('fj_expenses')||'[]');
      renderExpenses();
      const p=document.getElementById('cloudDataPanel');if(p)p.style.display='none';
      return;
    }
    const p=document.getElementById('cloudDataPanel');if(p)p.style.display='grid';
    await migrateLocalExpenses();
    await Promise.all([loadExpenses(),loadGoals(),loadBudget()]);
  }

  setTimeout(async()=>{
    injectDataPanel();
    const {data:{session}}=await supabaseClient.auth.getSession();
    await loadCloudData(session);
    supabaseClient.auth.onAuthStateChange(async(_event,session)=>{
      await loadCloudData(session);
    });
  },0);
})();
