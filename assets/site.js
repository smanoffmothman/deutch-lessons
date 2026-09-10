/* =================================================================
   site.js — рендеринг каталогу уроків, глосарію та матеріалів
   з файлів у /data. Підключай ПІСЛЯ потрібного data-файлу:
   <script src="../data/lessons-data.js"></script>
   <script src="../assets/site.js"></script>
   ================================================================= */

const MODULE_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MODULE_COLORS = ['#1F5C56', '#B14E3E', '#DE9E3B', '#48713F', '#123E3A', '#8a5a11', '#2E726F', '#5B5346'];
function moduleColor(idx){ return MODULE_COLORS[idx % MODULE_COLORS.length]; }

/* ---------- Каталог уроків (сторінка klasy/) ---------- */
// klasList: напр. ['7','8','9']; lessonFileBase: шлях від сторінки каталогу до папки lessons/
function renderClassCatalog(klasList, lessonFileBase){
  const tabsEl = document.getElementById('classTabs');
  const contentEl = document.getElementById('catalogContent');
  const searchEl = document.getElementById('catalogSearch');
  const state = {klas: klasList[0], query: ''};

  function renderTabs(){
    tabsEl.innerHTML = '';
    klasList.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (k === state.klas && !state.query ? ' active' : '');
      btn.setAttribute('aria-selected', k === state.klas && !state.query ? 'true' : 'false');
      btn.textContent = 'Клас ' + k;
      btn.addEventListener('click', () => {
        state.klas = k; state.query = ''; searchEl.value = '';
        renderTabs(); renderContent();
      });
      tabsEl.appendChild(btn);
    });
  }

  function matchesQuery(l, q){
    const hay = (l.nazva + ' ' + l.opys + ' ' + l.tema).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function renderContent(){
    contentEl.innerHTML = '';
    const q = state.query.trim();
    const pool = q
      ? LESSONS.filter(l => matchesQuery(l, q))
      : LESSONS.filter(l => l.klas === state.klas);

    if(pool.length === 0 && q){
      contentEl.innerHTML = '<p class="empty-note">Нічого не знайдено — спробуй інше слово.</p>';
      return;
    }

    const klasyToShow = q ? [...new Set(pool.map(l => l.klas))].sort() : [state.klas];
    klasyToShow.forEach(k => {
      if(q){
        const h = document.createElement('p');
        h.style.cssText = 'font-family:var(--sans);font-size:12.5px;color:var(--ink-soft);margin:18px 0 8px;';
        h.textContent = 'Клас ' + k;
        contentEl.appendChild(h);
      }
      MODULE_IDS.forEach((mod, idx) => {
        const items = pool.filter(l => l.klas === k && l.modul === mod)
                           .sort((a, b) => a.lektion - b.lektion);
        if(q && items.length === 0) return;
        const tema = items[0] ? items[0].tema : null;
        const section = document.createElement('section');
        section.className = 'module-block';
        section.style.setProperty('--module-color', moduleColor(idx));
        section.innerHTML = '<div class="module-head">'
          + '<span class="mod-id">Модуль ' + mod + '</span>'
          + '<h3>' + (tema || 'Тема ще не визначена') + '</h3>'
          + '<span class="mod-count">' + items.length + (items.length === 1 ? ' урок' : ' уроків') + '</span>'
          + '</div>';
        const grid = document.createElement('div');
        grid.className = 'lesson-grid';
        if(items.length === 0){
          grid.innerHTML = '<p class="empty-note">Ще немає уроків у цьому модулі.</p>';
        } else {
          items.forEach(l => {
            const card = document.createElement('article');
            card.className = 'lesson-card';
            card.style.setProperty('--module-color', moduleColor(idx));
            card.innerHTML = '<div class="lesson-num">Урок ' + l.lektion + '</div>'
              + '<h4>' + l.nazva + '</h4>'
              + '<p>' + l.opys + '</p>'
              + '<a class="open-link" href="' + lessonFileBase + l.file + '" target="_blank" rel="noopener">Відкрити</a>'
              + (l.nove ? '<span class="new-badge">нове</span>' : '');
            grid.appendChild(card);
          });
        }
        section.appendChild(grid);
        contentEl.appendChild(section);
      });
    });
  }

  searchEl.addEventListener('input', e => { state.query = e.target.value; renderTabs(); renderContent(); });
  renderTabs();
  renderContent();
}

/* ---------- Глосарій ---------- */
function renderGlossary(){
  const wordsEl = document.getElementById('glossaryList');
  const countEl = document.getElementById('glossaryCount');
  const klasSel = document.getElementById('filterKlas');
  const modSel = document.getElementById('filterModul');
  const searchEl = document.getElementById('glossarySearch');

  const klasy = [...new Set(GLOSSARY.map(w => w.klas))].sort();
  klasy.forEach(k => {
    const o = document.createElement('option'); o.value = k; o.textContent = 'Клас ' + k;
    klasSel.appendChild(o);
  });
  MODULE_IDS.forEach(m => {
    const o = document.createElement('option'); o.value = m; o.textContent = 'Модуль ' + m;
    modSel.appendChild(o);
  });

  function render(){
    const k = klasSel.value, m = modSel.value, q = searchEl.value.trim().toLowerCase();
    const filtered = GLOSSARY.filter(w => {
      if(k && w.klas !== k) return false;
      if(m && w.modul !== m) return false;
      if(q && !(w.de.toLowerCase().includes(q) || w.uk.toLowerCase().includes(q))) return false;
      return true;
    });
    countEl.textContent = filtered.length + ' слів' + (filtered.length === 1 ? 'о' : filtered.length < 5 ? 'а' : '');
    wordsEl.innerHTML = '';
    if(filtered.length === 0){
      wordsEl.innerHTML = '<p class="empty-note">Нічого не знайдено.</p>';
      return;
    }
    filtered.forEach(w => {
      const row = document.createElement('div');
      row.className = 'glossary-row';
      row.innerHTML = '<span class="de">' + w.de + '</span>'
        + '<span>' + w.uk + '</span>'
        + '<span class="tag">Клас ' + w.klas + '</span>'
        + '<span class="tag">Модуль ' + w.modul + '</span>';
      wordsEl.appendChild(row);
    });
  }
  [klasSel, modSel, searchEl].forEach(el => el.addEventListener('input', render));
  render();
}

/* ---------- Матеріали (плоский список) ---------- */
function renderMaterials(){
  const wrap = document.getElementById('materialsGrid');
  if(MATERIALS.length === 0){
    wrap.innerHTML = '<p class="empty-note">Матеріалів поки немає — з\u2019являться тут, щойно додаси перший.</p>';
    return;
  }
  wrap.innerHTML = '';
  MATERIALS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = '<h4>' + m.nazva + '</h4><p>' + (m.opys || '') + '</p>'
      + '<a href="' + m.file + '" target="_blank" rel="noopener">Відкрити</a>';
    wrap.appendChild(card);
  });
}

/* ---------- Граматика (плоский список тем) ---------- */
function renderGrammar(){
  const wrap = document.getElementById('grammarGrid');
  if(typeof GRAMMAR === 'undefined' || GRAMMAR.length === 0){
    wrap.innerHTML = '<p class="empty-note">Зведення граматичних тем поки не готове — додаси, коли назбирається кілька тем.</p>';
    return;
  }
  wrap.innerHTML = '';
  GRAMMAR.forEach(g => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = '<h4>' + g.tema + '</h4><p>' + (g.opys || '') + '</p>'
      + '<a href="' + g.file + '" target="_blank" rel="noopener">Відкрити</a>';
    wrap.appendChild(card);
  });
}
