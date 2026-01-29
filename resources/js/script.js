    // ======= Simple SPA with localStorage persistence =======
    const CREDENTIALS = {login:'employee', password:'turbo123'}; // сотрудник: employee / turbo123
    const LS_KEY = 'turbo_orders_v1';
    const LS_USER = 'turbo_user_logged';

    // Seed sample orders if none
    function seedOrders(){
      const sample=[
        {id:'ZA543468865', fio:'Иванов Иван Иванович', datetime:'2025-04-12T14:38', contact:'+79999999999', status:'new', thumbs:5, code:'#A543468865'},
        {id:'ZA543468866', fio:'Петров Петр Петрович', datetime:'2025-03-05T11:02', contact:'+79998887766', status:'work', thumbs:5, code:'#A543468866'},
        {id:'ZA543468867', fio:'Сидоров Сидор Сидорович', datetime:'2025-01-20T09:15', contact:'+79990001122', status:'done', thumbs:5, code:'#A543468867'}
      ];
      if(!localStorage.getItem(LS_KEY)){
        localStorage.setItem(LS_KEY, JSON.stringify(sample));
      }
    }

    seedOrders();

    // ======= Helpers =======
    function saveOrders(arr){ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
    function loadOrders(){ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    function isLogged(){ return !!localStorage.getItem(LS_USER); }

    // ======= Router render =======
    const app = document.getElementById('app');

    function render(){
      if(!isLogged()){ renderLogin(); } else { renderDashboard(); }
    }

    // ======= Login =======
    function renderLogin(){
      app.innerHTML = `
      <div class="login-wrap">
        <div class="login">
          <h2>Turbo Detailing — Вход для сотрудников</h2>
          <div class="field"><label>Логин</label><input id="login_login" placeholder="логин"></div>
          <div class="field"><label>Пароль</label><input id="login_pass" type="password" placeholder="пароль"></div>
          <div style="display:flex;gap:8px;align-items:center"><button id="login_btn" class="add-btn">Войти</button><div id="login_err" class="err"></div></div>
          <p style="margin-top:12px;color:#666">Демо учётная запись: <b>employee</b> / <b>turbo123</b></p>
        </div>
      </div>
      `;
      document.getElementById('login_btn').addEventListener('click', ()=>{
        const l = document.getElementById('login_login').value.trim();
        const p = document.getElementById('login_pass').value;
        const err = document.getElementById('login_err');
        if(l===CREDENTIALS.login && p===CREDENTIALS.password){
          localStorage.setItem(LS_USER, l);
          render();
        } else {
          err.textContent='Неверный логин или пароль';
        }
      });
    }

    // ======= Dashboard =======
    function renderDashboard(){
      const orders = loadOrders();
      app.innerHTML = `
      <div class="container">
        <header>
          <div style="flex:1">
            <div class="search">
              <input id="search_input" placeholder="Поиск по ФИО, коду, номеру...">
              <div class="filter">
                <button id="filter_btn" class="icon-btn">Ф</button>
                <div id="filter_panel" class="filter-panel">
                  <label>Сортировка</label>
                  <select id="sort_select"><option value="newest">От новых к старым</option><option value="oldest">От старых к новым</option></select>
                  <div style="height:8px"></div>
                  <label>Диапазон дат</label>
                  <div style="display:flex;gap:8px"><input id="date_from" type="date"><input id="date_to" type="date"></div>
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <div class="account-panel">
              <div id="account_btn" class="icon-btn">👤</div>
              <div id="account_menu" class="account-menu">
                <div style="padding:8px">Аккаунт: <b>${localStorage.getItem(LS_USER)}</b></div>
                <hr style="border:none;height:1px;background:#222;margin:6px 0">
                <button id="logout_btn" class="btn-logout">Выйти</button>
              </div>
            </div>
          </div>
        </header>

        <div class="controls">
          <button id="add_order" class="add-btn">Добавить заявку</button>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
            <label style="color:#fff">Фильтр статуса:</label>
            <select id="status_filter"><option value="all">Все</option><option value="new">Новая</option><option value="work">В работе</option><option value="done">Завершена</option></select>
          </div>
        </div>

        <div id="orders_list" class="orders"></div>
        <footer>Turbo Detailing — панель сотрудников. Заказы сохраняются в localStorage браузера.</footer>
      </div>
      `;

      // init interactions
      document.getElementById('filter_btn').addEventListener('click', ()=>{document.getElementById('filter_panel').classList.toggle('show')});
      document.getElementById('account_btn').addEventListener('click', ()=>{document.getElementById('account_menu').classList.toggle('show')});
      document.getElementById('logout_btn').addEventListener('click', ()=>{ localStorage.removeItem(LS_USER); render(); });
      document.getElementById('add_order').addEventListener('click', showAddModal);

      // search / filters
      document.getElementById('search_input').addEventListener('input', renderOrders);
      document.getElementById('sort_select').addEventListener('change', renderOrders);
      document.getElementById('date_from').addEventListener('change', renderOrders);
      document.getElementById('date_to').addEventListener('change', renderOrders);
      document.getElementById('status_filter').addEventListener('change', renderOrders);

      renderOrders();
    }

    function renderOrders(){
      const root = document.getElementById('orders_list');
      const q = document.getElementById('search_input').value.trim().toLowerCase();
      const sort = document.getElementById('sort_select').value;
      const df = document.getElementById('date_from').value;
      const dt = document.getElementById('date_to').value;
      const statusFilter = document.getElementById('status_filter').value;

      let orders = loadOrders();

      // Filter by status
      if(statusFilter!=='all') orders = orders.filter(o=>o.status===statusFilter);

      // Search by fields on card
      if(q){
        orders = orders.filter(o=>{
          return (o.fio||'').toLowerCase().includes(q) || (o.id||'').toLowerCase().includes(q) || (o.contact||'').toLowerCase().includes(q) || (o.code||'').toLowerCase().includes(q);
        });
      }

      // Date range filter
      if(df){ const from = new Date(df+'T00:00:00'); orders = orders.filter(o=> new Date(o.datetime) >= from); }
      if(dt){ const to = new Date(dt+'T23:59:59'); orders = orders.filter(o=> new Date(o.datetime) <= to); }

      // Sort
      orders.sort((a,b)=>{
        const da = new Date(a.datetime).getTime(); const db = new Date(b.datetime).getTime();
        return sort==='newest' ? db - da : da - db;
      });

      if(orders.length===0){ root.innerHTML='<div style="color:#fff;padding:20px">Заявки не найдены</div>'; return; }

      root.innerHTML='';
      orders.forEach(o=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <div class="top">
            <div>
              <div class="meta">Заявка <b>${o.id}</b> <span style="margin-left:12px">${formatDateTime(o.datetime)}</span></div>
              <div class="meta">ФИО: <b>${o.fio}</b></div>
              <div class="meta">Контакт: <b>${o.contact}</b></div>
            </div>
            <div style="text-align:right">
              <div class="status ${o.status==='new'?'new':o.status==='work'?'work':'done'}">${statusText(o.status)}</div>
            </div>
          </div>
          <div class="thumbs">
            ${thumbsHtml(o.thumbs)}
            <div class="badge">+${Math.max(0,o.thumbs-4)}</div>
          </div>
          <div class="card-actions">
            <select data-id="${o.id}" class="status-select">
              <option value="new" ${o.status==='new'?'selected':''}>Новая</option>
              <option value="work" ${o.status==='work'?'selected':''}>В работе</option>
              <option value="done" ${o.status==='done'?'selected':''}>Завершена</option>
            </select>
            <button class="accept" data-id="${o.id}">Принять заявку</button>
            <button class="reject" data-id="${o.id}">Отклонить</button>
          </div>
        `;
        root.appendChild(card);
      });

      // attach actions
      document.querySelectorAll('.status-select').forEach(s=>{
        s.addEventListener('change', (e)=>{
          const id = e.target.dataset.id; const val = e.target.value; changeStatus(id,val);
        });
      });
      document.querySelectorAll('.accept').forEach(b=>b.addEventListener('click', (e)=>{ changeStatus(e.target.dataset.id,'work'); }));
      document.querySelectorAll('.reject').forEach(b=>b.addEventListener('click', (e)=>{ changeStatus(e.target.dataset.id,'done'); }));
    }

    function formatDateTime(dt){ const d=new Date(dt); return d.toLocaleString('ru-RU'); }
    function statusText(s){ if(s==='new') return 'Новая'; if(s==='work') return 'В работе'; return 'Завершена'; }
    function thumbsHtml(n){ let html=''; const show = Math.min(n,4); for(let i=0;i<show;i++){ html += '<div class="thumb">📷</div>'; } if(show===0) html='<div style="color:#999">нет фото</div>'; return html; }

    function changeStatus(id, status){
      const orders = loadOrders();
      const idx = orders.findIndex(o=>o.id===id);
      if(idx>=0){ orders[idx].status = status; saveOrders(orders); renderOrders(); }
    }

    // ===== Add order modal (simple) =====
    function showAddModal(){
      const modal = document.createElement('div');
      Object.assign(modal.style,{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.6)'});
      modal.innerHTML = `
        <div style="background:#fff;padding:16px;border-radius:8px;min-width:320px">
          <h3>Новая заявка</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <input id="new_fio" placeholder="ФИО">
            <input id="new_contact" placeholder="Контакт">
            <input id="new_code" placeholder="Код заявки (например ZA123)">
            <input id="new_date" type="datetime-local" value="${new Date().toISOString().slice(0,16)}">
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
              <button id="cancel_new">Отмена</button>
              <button id="create_new" class="add-btn">Создать</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#cancel_new').addEventListener('click', ()=>modal.remove());
      modal.querySelector('#create_new').addEventListener('click', ()=>{
        const fio = modal.querySelector('#new_fio').value.trim();
        const contact = modal.querySelector('#new_contact').value.trim();
        const code = modal.querySelector('#new_code').value.trim() || ('ZA'+Math.floor(Math.random()*900000+100000));
        const date = modal.querySelector('#new_date').value;
        if(!fio || !contact){ alert('Пожалуйста, заполните ФИО и контакт'); return; }
        const orders = loadOrders();
        orders.unshift({id:code, fio, contact, datetime:date||new Date().toISOString(), status:'new', thumbs:0, code});
        saveOrders(orders); modal.remove(); renderOrders();
      });
    }

    // initial render
    render();

