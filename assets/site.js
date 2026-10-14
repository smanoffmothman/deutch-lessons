/* =================================================================
   site.js — рендеринг каталогу уроків, глосарію та матеріалів
   з файлів у /data. Підключай ПІСЛЯ потрібного data-файлу:
   <script src="../data/lessons-data.js"></script>
   <script src="../assets/site.js"></script>
   ================================================================= */

const MODULE_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MODULE_COLORS = ['#1F5C56', '#B14E3E', '#DE9E3B', '#48713F', '#123E3A', '#8a5a11', '#2E726F', '#5B5346'];
function moduleColor(idx){ return MODULE_COLORS[idx % MODULE_COLORS.length]; }

// 1 урок, 2–4 уроки, 5–20 уроків, 21 урок, 22 уроки…
function lessonCountLabel(n){
  const m10 = n % 10, m100 = n % 100;
  if(m10 === 1 && m100 !== 11) return n + ' урок';
  if(m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return n + ' уроки';
  return n + ' уроків';
}

function getNewestPerKlas(lessons){
  const newest = {};
  lessons.forEach(l => { newest[l.klas] = l; }); // останній за порядком у масиві "виграє"
  return newest;
}

// Посилання з картки уроку на граматичні теми (поле gram у lessons-data.js).
// Показуються лише вже готові теми; якщо grammar-data.js не підключено — нічого.
// З 2026-10 згорнуті в один рядок «📐 Граматика · N» (<details>), щоб
// картка не роздувалась від 6–10 чипів; по кліку розгортаються.
function lessonGramChips(l, lessonFileBase){
  if(!Array.isArray(l.gram) || typeof GRAMMAR === 'undefined') return '';
  const base = lessonFileBase.replace(/lessons\/$/, '') + 'gramatyka/temy/';
  const chips = l.gram.map(id => GRAMMAR.find(t => t.id === id)).filter(t => t && t.opublikovano > 0)
    .map(t => '<a class="gram-chip" href="' + base + t.id + '.html" title="' + t.tema.replace(/"/g, '&quot;') + '">' + t.uk + '</a>');
  if(!chips.length) return '';
  return '<details class="gram-fold"><summary>📐 Граматика · ' + chips.length + '</summary>'
    + '<div class="gram-chips">' + chips.join('') + '</div></details>';
}

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
    const modTema = (typeof MODULE_THEMES !== 'undefined' && MODULE_THEMES[l.klas]) ? (MODULE_THEMES[l.klas][l.modul] || '') : '';
    const hay = (l.nazva + ' ' + l.opys + ' ' + modTema).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function renderContent(){
    contentEl.innerHTML = '';
    const q = state.query.trim();
    const pool = q
      ? LESSONS.filter(l => matchesQuery(l, q))
      : LESSONS.filter(l => l.klas === state.klas);
    const newestPerKlas = getNewestPerKlas(LESSONS); // завжди від повного списку, не від відфільтрованого

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

      // "Актуальний" модуль = модуль уроку з міткою "нове" (останній у
      // масиві LESSONS для цього класу). Лише він розгорнутий за
      // замовчуванням; під час пошуку розгорнуто все знайдене.
      const currentMod = newestPerKlas[k] ? newestPerKlas[k].modul : null;

      // Липка панель швидкого переходу між модулями (лише без пошуку)
      let jumpBar = null;
      if(!q){
        jumpBar = document.createElement('nav');
        jumpBar.className = 'module-jump';
        jumpBar.setAttribute('aria-label', 'Модулі класу ' + k);
        contentEl.appendChild(jumpBar);
      }

      MODULE_IDS.forEach((mod, idx) => {
        const items = pool.filter(l => l.klas === k && l.modul === mod)
                           .sort((a, b) => a.lektion - b.lektion);
        if(q && items.length === 0) return;
        const temaFromTable = (typeof MODULE_THEMES !== 'undefined' && MODULE_THEMES[k]) ? MODULE_THEMES[k][mod] : '';
        const tema = temaFromTable || 'Тема ще не визначена';
        const color = moduleColor(idx);
        const blockId = 'modul-' + k + '-' + mod;
        const isEmpty = items.length === 0;

        if(jumpBar){
          const chip = document.createElement(isEmpty ? 'span' : 'a');
          chip.className = 'jump-chip' + (isEmpty ? ' is-empty' : '') + (mod === currentMod ? ' is-current' : '');
          chip.style.setProperty('--module-color', color);
          chip.title = 'Модуль ' + mod + ': ' + tema;
          chip.innerHTML = '<b>' + mod + '</b><span class="n">' + items.length + '</span>';
          if(!isEmpty){
            chip.href = '#' + blockId;
            chip.addEventListener('click', e => {
              e.preventDefault();
              const target = document.getElementById(blockId);
              if(!target) return;
              target.open = true;
              target.scrollIntoView({behavior: 'smooth', block: 'start'});
            });
          }
          jumpBar.appendChild(chip);
        }

        const headInner = '<span class="mod-id">Модуль ' + mod + '</span>'
          + '<h3>' + tema + '</h3>'
          + '<span class="mod-count">' + (isEmpty ? 'ще немає уроків' : lessonCountLabel(items.length)) + '</span>';

        // Порожній модуль — один компактний рядок, розгортати нічого
        if(isEmpty){
          const section = document.createElement('section');
          section.className = 'module-block is-empty';
          section.id = blockId;
          section.style.setProperty('--module-color', color);
          section.innerHTML = '<div class="module-head">' + headInner + '</div>';
          contentEl.appendChild(section);
          return;
        }

        const details = document.createElement('details');
        details.className = 'module-block';
        details.id = blockId;
        details.style.setProperty('--module-color', color);
        details.open = q ? true : (mod === currentMod);
        details.innerHTML = '<summary class="module-head">'
          + '<span class="chev" aria-hidden="true"></span>' + headInner + '</summary>';

        const grid = document.createElement('div');
        grid.className = 'lesson-grid';
        items.forEach(l => {
          // Уся картка клікабельна (з 2026-10): посилання стоїть на назві,
          // а його ::after розтягнутий на всю картку (site.css, .lesson-link).
          // Блок «Граматика» лежить над ним і клікається окремо.
          // Опис обрізається до 3 рядків у CSS; повний — у підказці (title).
          const card = document.createElement('article');
          card.className = 'lesson-card';
          card.style.setProperty('--module-color', color);
          card.innerHTML = '<div class="lesson-num">Урок ' + l.lektion + '</div>'
            + '<h4><a class="lesson-link" href="' + lessonFileBase + l.file + '" target="_blank" rel="noopener">' + l.nazva + '</a></h4>'
            + '<p class="lesson-desc" title="' + escHtml(String(l.opys || '').replace(/<[^>]*>/g, '')) + '">' + l.opys + '</p>'
            + lessonGramChips(l, lessonFileBase)
            + '<div class="lesson-foot"><span class="open-cue" aria-hidden="true">Відкрити →</span>'
            + (l === newestPerKlas[l.klas] ? '<span class="new-badge">нове</span>' : '') + '</div>';
          grid.appendChild(card);
        });
        details.appendChild(grid);
        contentEl.appendChild(details);
      });
    });
  }

  searchEl.addEventListener('input', e => { state.query = e.target.value; renderTabs(); renderContent(); });
  renderTabs();
  renderContent();
}

/* ---------- Глосарій ---------- */

// Ключ для алфавітного сортування: те саме слово, що й у "de",
// але без початкового артикля (der/die/das) і без "sich" — інакше
// майже всі іменники (переважна більшість слів у глосарії) стояли б
// під однією літерою "D", а зворотні дієслова — під "S". Сам текст
// w.de при цьому НЕ змінюється, ключ рахується лише для сортування
// й для визначення літери-заголовка групи.
function glossarySortKey(de){
  let s = (de || '').trim();
  s = s.replace(/^(der|die|das)\s+/i, '');
  s = s.replace(/^sich\s+/i, '');
  s = s.toUpperCase();
  s = s.replace(/Ä/g, 'A').replace(/Ö/g, 'O').replace(/Ü/g, 'U');
  return s;
}

function renderGlossary(){
  const wordsEl = document.getElementById('glossaryList');
  const countEl = document.getElementById('glossaryCount');
  const klasSel = document.getElementById('filterKlas');
  const modSel = document.getElementById('filterModul');
  const searchEl = document.getElementById('glossarySearch');
  const indexEl = document.getElementById('letterIndex');

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
    // Завжди за абеткою (за ключем без артикля/sich), а не за порядком
    // додавання в масиві — саме це й вирішує проблему "як щось знайти".
    filtered.sort((a, b) => glossarySortKey(a.de).localeCompare(glossarySortKey(b.de), 'de'));

    countEl.textContent = filtered.length + ' слів' + (filtered.length === 1 ? 'о' : filtered.length < 5 ? 'а' : '');
    wordsEl.innerHTML = '';
    if(indexEl) indexEl.innerHTML = '';

    if(filtered.length === 0){
      wordsEl.innerHTML = '<p class="empty-note">Нічого не знайдено.</p>';
      return;
    }

    let currentLetter = null;
    const lettersPresent = [];
    filtered.forEach(w => {
      const letter = glossarySortKey(w.de).charAt(0) || '#';
      if(letter !== currentLetter){
        currentLetter = letter;
        lettersPresent.push(letter);
        const header = document.createElement('div');
        header.className = 'glossary-letter';
        header.id = 'letter-' + letter;
        header.textContent = letter;
        wordsEl.appendChild(header);
      }
      const row = document.createElement('div');
      row.className = 'glossary-row';
      row.innerHTML = '<span class="de">' + w.de + '</span>'
        + '<span>' + w.uk + '</span>'
        + '<span class="tag">Клас ' + w.klas + '</span>'
        + '<span class="tag">Модуль ' + w.modul + '</span>';
      wordsEl.appendChild(row);
    });

    if(indexEl){
      lettersPresent.forEach(l => {
        const btn = document.createElement('a');
        btn.className = 'letter-btn';
        btn.href = '#letter-' + l;
        btn.textContent = l;
        indexEl.appendChild(btn);
      });
    }
  }
  [klasSel, modSel, searchEl].forEach(el => el.addEventListener('input', render));
  render();
}

/* ---------- Матеріали (з 2026-10: статті для читання) ----------
   Дані: data/materials-data.js (MATERIALS + MATERIAL_TEMY).
   - Статті (typ: "stattya") — картки, найновіші зверху; останній запис у
     масиві = мітка «нове» (як в уроках). Фільтри: рівень (чипи), країна,
     тема, пошук. Показуються лише значення, які реально є в даних.
   - Прогрес учня в статті — localStorage 'dmu:progress:mat:<id>' (пише
     trackProgress у lesson-interactions.js; вмикає initMaterialPage).
   - Інші матеріали (typ: "fail" або без typ — старий формат nazva/opys/file)
     — окремим списком під статтями, без фільтрів.
   Прапорці — CSS (.flag-DE …), бо емодзі-прапорців Windows не показує. */
const MAT_LEVELS = ['A2', 'B1', 'B2', 'C1', 'C2'];
const MAT_LANDS = {DE: 'Німеччина', AT: 'Австрія', CH: 'Швейцарія', LI: 'Ліхтенштейн', LU: 'Люксембург', EU: 'Європа'};
function matIsArticle(m){ return m && m.typ === 'stattya'; }
function articleCountLabel(n){ // 1 стаття, 2–4 статті, 5+ статей, 21 стаття
  const m10 = n % 10, m100 = n % 100;
  if(m10 === 1 && m100 !== 11) return n + ' стаття';
  if(m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return n + ' статті';
  return n + ' статей';
}
function matFlagHtml(code){
  return '<span class="flag flag-' + escHtml(code) + '" title="' + escHtml(MAT_LANDS[code] || code) + '"></span>';
}

function renderMaterials(){
  const wrap = document.getElementById('materialsGrid');
  const toolbar = document.getElementById('materialsToolbar');
  const otherEl = document.getElementById('materialsOther');
  const all = (typeof MATERIALS !== 'undefined') ? MATERIALS : [];
  const articles = all.filter(matIsArticle);
  const others = all.filter(m => !matIsArticle(m));
  const newest = articles[articles.length - 1] || null;
  const state = {level: '', land: '', tema: '', q: ''};

  // інші матеріали — простий список, як було раніше
  if(otherEl){
    if(others.length){
      otherEl.innerHTML = '<h2 class="mat-section-title">Інші матеріали</h2><div class="materials-grid">'
        + others.map(m => '<div class="material-card"><h4>' + m.nazva + '</h4><p>' + (m.opys || '') + '</p>'
          + '<a href="' + m.file + '" target="_blank" rel="noopener">Відкрити</a></div>').join('') + '</div>';
    } else otherEl.innerHTML = '';
  }

  if(!articles.length){
    if(toolbar) toolbar.style.display = 'none';
    wrap.innerHTML = '<p class="empty-note">Статей поки немає — скоро з’являться.</p>';
    return;
  }

  // фільтри: лише ті значення, що реально трапляються в статтях
  const levels = MAT_LEVELS.filter(l => articles.some(a => a.riven === l));
  const lands = Object.keys(MAT_LANDS).filter(c => articles.some(a => [].concat(a.krayina || []).includes(c)));
  const temyOrder = (typeof MATERIAL_TEMY !== 'undefined') ? MATERIAL_TEMY : [];
  const temySet = new Set();
  articles.forEach(a => [].concat(a.temy || []).forEach(t => temySet.add(t)));
  const temy = temyOrder.filter(t => temySet.has(t)).concat(Array.from(temySet).filter(t => !temyOrder.includes(t)));

  if(toolbar){
    toolbar.innerHTML = '<div class="search-row"><input type="search" id="matSearch" placeholder="Пошук: назва, тема, слово…" aria-label="Пошук статей"></div>'
      + '<div class="mat-filters">'
      + '<div class="mat-levels" role="group" aria-label="Рівень">'
      + '<button type="button" class="lvl-chip" data-l="" aria-pressed="true">Усі рівні</button>'
      + levels.map(l => '<button type="button" class="lvl-chip" data-l="' + l + '" aria-pressed="false">' + l + '</button>').join('') + '</div>'
      + (lands.length > 1 ? '<select id="matLand" aria-label="Країна"><option value="">Усі країни</option>'
        + lands.map(c => '<option value="' + c + '">' + MAT_LANDS[c] + '</option>').join('') + '</select>' : '')
      + (temy.length > 1 ? '<select id="matTema" aria-label="Тема"><option value="">Усі теми</option>'
        + temy.map(t => '<option>' + escHtml(t) + '</option>').join('') + '</select>' : '')
      + '</div><p class="mat-summary" id="matSummary"></p>';
    toolbar.querySelectorAll('.lvl-chip').forEach(b => b.addEventListener('click', () => {
      state.level = b.dataset.l;
      toolbar.querySelectorAll('.lvl-chip').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      render();
    }));
    const landEl = document.getElementById('matLand'), temaEl = document.getElementById('matTema'), qEl = document.getElementById('matSearch');
    if(landEl) landEl.addEventListener('change', () => { state.land = landEl.value; render(); });
    if(temaEl) temaEl.addEventListener('change', () => { state.tema = temaEl.value; render(); });
    qEl.addEventListener('input', () => { state.q = qEl.value.trim().toLowerCase(); render(); });
  }

  function progressOf(a){
    const p = loadStoredProgress('mat:' + a.id);
    if(!p) return null;
    return {best: p.best, total: p.total, pct: Math.round(Math.min(1, p.best / p.total) * 100)};
  }

  function card(a){
    const p = progressOf(a);
    const lands = [].concat(a.krayina || []);
    const src = a.dzherelo && a.dzherelo.nazva ? a.dzherelo.nazva + (a.dzherelo.nomer ? ' ' + a.dzherelo.nomer : '') : '';
    const status = p
      ? (p.pct >= 100 ? '<span class="mat-done">✓ пройдено</span>' : '<span class="mat-prog"><span class="bar"><span style="width:' + p.pct + '%"></span></span>' + p.best + ' / ' + p.total + '</span>')
      : '<span class="open-cue" aria-hidden="true">Читати →</span>';
    return '<article class="mat-card' + (p && p.pct >= 100 ? ' is-done' : '') + '">'
      + '<div class="mat-card-top"><span class="lvl-badge">' + escHtml(a.riven || '—') + '</span>'
      + lands.map(matFlagHtml).join('')
      + (a === newest ? '<span class="new-badge">нове</span>' : '') + '</div>'
      + '<h4><a class="lesson-link" href="' + escHtml(a.file) + '">' + escHtml(a.nazva) + '</a></h4>'
      + '<p class="lesson-desc" title="' + escHtml(String(a.opys || '')) + '">' + escHtml(a.opys || '') + '</p>'
      + ([].concat(a.temy || []).length ? '<div class="mat-tags">' + [].concat(a.temy).map(t => '<span>' + escHtml(t) + '</span>').join('') + '</div>' : '')
      + '<div class="lesson-foot">' + status + (src ? '<span class="mat-src" title="Джерело">' + escHtml(src) + '</span>' : '') + '</div>'
      + '</article>';
  }

  function render(){
    const list = articles.slice().reverse().filter(a => {
      if(state.level && a.riven !== state.level) return false;
      if(state.land && ![].concat(a.krayina || []).includes(state.land)) return false;
      if(state.tema && ![].concat(a.temy || []).includes(state.tema)) return false;
      if(state.q){
        const hay = [a.nazva, a.opys, [].concat(a.temy || []).join(' '), a.dzherelo ? a.dzherelo.nazva : ''].join(' ').toLowerCase();
        if(!hay.includes(state.q)) return false;
      }
      return true;
    });
    const sum = document.getElementById('matSummary');
    if(sum){
      const done = articles.filter(a => { const p = progressOf(a); return p && p.pct >= 100; }).length;
      const filtered = list.length !== articles.length;
      sum.textContent = (filtered ? 'Знайдено: ' + articleCountLabel(list.length) + ' з ' + articles.length : articleCountLabel(articles.length))
        + (done ? ' · пройдено: ' + done : '');
    }
    wrap.innerHTML = list.length ? list.map(card).join('')
      : '<p class="empty-note">Нічого не знайдено — зміни фільтри або слово для пошуку.</p>';
  }
  wrap.classList.add('mat-grid');
  render();
}

/* =================================================================
   Граматика (з 2026-09)
   Дані: data/grammar-data.js (GRAMMAR_ROZDILY + GRAMMAR).
   Зв'язок з уроками: необов'язкове поле gram: ["id-теми", ...] у рядку
   уроку в data/lessons-data.js.
   Прогрес учня: localStorage, ключ 'dmu:progress:gram:<id>' — пише
   lesson-interactions.js (trackProgress), тут лише читаємо. Префікс
   має збігатися з PROGRESS_PREFIX у lesson-interactions.js.
   ================================================================= */
const GRAM_PROGRESS_PREFIX = 'dmu:progress:';
const GRAM_COLORS = ['#1F5C56', '#B14E3E', '#8a5a11', '#48713F', '#123E3A', '#2E726F', '#B14E3E', '#5B5346', '#1F5C56', '#48713F', '#5B5346'];

function loadStoredProgress(key){
  try {
    const v = JSON.parse(localStorage.getItem(GRAM_PROGRESS_PREFIX + key));
    return (v && v.total) ? v : null;
  } catch(_) { return null; }
}
function gramIsReady(t){ return !!(t && t.opublikovano > 0); }
function gramNewest(){
  let best = null;
  (typeof GRAMMAR !== 'undefined' ? GRAMMAR : []).forEach(t => {
    if(gramIsReady(t) && (!best || t.opublikovano > best.opublikovano)) best = t;
  });
  return best;
}
function escHtml(s){
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

/* ---------- Сторінка gramatyka/: увесь план тем, як зміст підручника ---------- */
function renderGrammar(){
  const wrap = document.getElementById('grammarToc');
  const summaryEl = document.getElementById('grammarSummary');
  const searchEl = document.getElementById('grammarSearch');
  const readyOnlyEl = document.getElementById('grammarReadyOnly');
  if(!wrap) return;
  if(typeof GRAMMAR === 'undefined' || typeof GRAMMAR_ROZDILY === 'undefined'){
    console.warn('Не завантажився data/grammar-data.js');
    wrap.innerHTML = '<p class="empty-note">Не вдалося завантажити список тем — онови сторінку.</p>';
    return;
  }
  const newest = gramNewest();

  function renderSummary(){
    if(!summaryEl) return;
    const ready = GRAMMAR.filter(gramIsReady);
    let started = 0, finished = 0;
    ready.forEach(t => {
      const p = loadStoredProgress('gram:' + t.id);
      if(p){ started++; if(p.best >= p.total) finished++; }
    });
    let html = '<span><b>' + ready.length + '</b> з ' + GRAMMAR.length + ' тем уже готові.</span>';
    if(started){
      html += ' <span>Відкрито тем: ' + started + ', пройдено повністю: ' + finished + '.</span>'
        + ' <button type="button" class="link-btn" id="grammarResetProgress">Скинути мій прогрес</button>';
    } else if(ready.length){
      html += ' <span>Твій прогрес зберігатиметься в цьому браузері.</span>';
    }
    summaryEl.innerHTML = html;
    const rb = document.getElementById('grammarResetProgress');
    if(rb) rb.addEventListener('click', () => {
      if(!confirm('Стерти збережені результати з усіх тем граматики на цьому пристрої?')) return;
      try {
        Object.keys(localStorage).filter(k => k.indexOf(GRAM_PROGRESS_PREFIX + 'gram:') === 0).forEach(k => localStorage.removeItem(k));
      } catch(_) {}
      renderSummary(); render();
    });
  }

  function matches(t, q){
    if(!q) return true;
    const hay = (t.tema + ' ' + t.uk + ' ' + (t.pidrozdily || []).join(' ')).toLowerCase();
    return hay.includes(q);
  }

  function stateOf(t){
    if(!gramIsReady(t)) return {cls: 'is-planned', label: 'готується', pct: 0};
    const p = loadStoredProgress('gram:' + t.id);
    if(!p) return {cls: 'is-new', label: '', pct: 0};
    const pct = Math.round(Math.min(1, p.best / p.total) * 100);
    if(pct >= 100) return {cls: 'is-done', label: p.best + ' / ' + p.total, pct: 100};
    return {cls: 'is-started', label: p.best + ' / ' + p.total, pct: pct};
  }

  function render(){
    const q = (searchEl ? searchEl.value : '').trim().toLowerCase();
    const readyOnly = readyOnlyEl ? readyOnlyEl.checked : false;
    wrap.innerHTML = '';

    const jump = document.createElement('nav');
    jump.className = 'module-jump gram-jump';
    jump.setAttribute('aria-label', 'Розділи граматики');
    if(!q) wrap.appendChild(jump);

    let shown = 0;
    GRAMMAR_ROZDILY.forEach((r, idx) => {
      const all = GRAMMAR.filter(t => t.rozdil === r.id);
      const items = all.filter(t => matches(t, q) && (!readyOnly || gramIsReady(t)));
      const readyCount = all.filter(gramIsReady).length;
      const color = GRAM_COLORS[idx % GRAM_COLORS.length];
      const blockId = 'rozdil-' + r.id;

      if(!q){
        const chip = document.createElement(items.length ? 'a' : 'span');
        chip.className = 'jump-chip' + (readyCount ? '' : ' is-empty');
        chip.style.setProperty('--module-color', color);
        chip.title = readyCount + ' з ' + all.length + ' тем готові';
        chip.innerHTML = '<b>' + escHtml(r.nazva) + '</b><span class="n">' + readyCount + '/' + all.length + '</span>';
        if(items.length){
          chip.href = '#' + blockId;
          chip.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(blockId);
            if(target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
          });
        }
        jump.appendChild(chip);
      }
      if(items.length === 0) return;
      shown += items.length;

      const sec = document.createElement('section');
      sec.className = 'gram-part';
      sec.id = blockId;
      sec.style.setProperty('--module-color', color);
      sec.innerHTML = '<div class="gram-part-head"><h2>' + escHtml(r.nazva) + '</h2>'
        + '<span class="mod-count">' + (readyCount ? readyCount + ' з ' + all.length + ' готові' : 'готується') + '</span></div>';

      const list = document.createElement('ul');
      list.className = 'gram-toc';
      items.forEach(t => {
        const st = stateOf(t);
        const li = document.createElement('li');
        const row = document.createElement(gramIsReady(t) ? 'a' : 'div');
        row.className = 'gram-row ' + st.cls;
        if(gramIsReady(t)) row.href = 'temy/' + t.id + '.html';
        const subs = (t.pidrozdily || []).length;
        row.innerHTML = '<span class="gram-state" style="--pct:' + st.pct + '" aria-hidden="true"></span>'
          + '<span class="gram-title"><span class="de">' + escHtml(t.tema) + '</span>'
          + '<span class="uk">' + escHtml(t.uk) + (subs > 1 ? ' <span class="subs">(' + subs + ' підрозділ' + (subs < 5 ? 'и' : 'ів') + ')</span>' : '') + '</span></span>'
          + '<span class="gram-meta">'
          + (t === newest ? '<span class="new-badge">нове</span>' : '')
          + (st.cls === 'is-planned' ? '<span class="gram-soon">готується</span>'
             : st.label ? '<span class="gram-score">' + st.label + '</span>' : '')
          + '</span>';
        li.appendChild(row);
        list.appendChild(li);
      });
      sec.appendChild(list);
      wrap.appendChild(sec);
    });

    if(shown === 0){
      const p = document.createElement('p');
      p.className = 'empty-note';
      p.textContent = q ? 'Нічого не знайдено — спробуй інше слово (німецькою чи українською).'
                        : 'Готових тем поки немає — зніми позначку «Лише готові», щоб побачити весь план.';
      wrap.appendChild(p);
    }
  }

  if(searchEl) searchEl.addEventListener('input', render);
  if(readyOnlyEl) readyOnlyEl.addEventListener('change', render);
  renderSummary();
  render();
}

/* ---------- Сторінка окремої теми: gramatyka/temy/<id>.html ----------
   Викликається ОСТАННІМ рядком скрипту теми, після всіх buildQuiz /
   wireBlanks / buildOrder / buildSort:   initGrammarPage('rektion-verben');
   Що робить:
   - хлібні крихти Головна › Граматика › розділ › тема (з grammar-data.js);
   - зміст-посилання над підрозділами у вкладці Regel (#regelToc) — з усіх
     <section class="regel-block" id="..."> і їхніх <h3>; якщо підрозділ
     один, змісту немає;
   - у вкладці Fertig!: попередній найкращий результат (#gramBest) і
     картка "Де це ще трапляється" (#gramRelated) — уроки, у яких у
     lessons-data.js є gram з цим id, і готові теми з поля dyv. Якщо
     нічого немає, картка ховається;
   - вмикає збереження прогресу: trackProgress('gram:' + id). */
function initGrammarPage(id, opts){
  opts = opts || {};
  const root = opts.root || '../../';
  const t = (typeof GRAMMAR !== 'undefined') ? GRAMMAR.find(x => x.id === id) : null;
  const r = (t && typeof GRAMMAR_ROZDILY !== 'undefined') ? GRAMMAR_ROZDILY.find(x => x.id === t.rozdil) : null;

  if(typeof renderCrumbs === 'function'){
    const steps = [{label: 'Головна', href: root + 'index.html'}, {label: 'Граматика', href: root + 'gramatyka/index.html'}];
    if(r) steps.push({label: r.nazva, href: root + 'gramatyka/index.html#rozdil-' + r.id});
    steps.push({label: t ? t.tema : id});
    renderCrumbs('crumbs', steps);
  }

  const toc = document.getElementById('regelToc');
  if(toc){
    const blocks = Array.from(document.querySelectorAll('.regel-block[id]'));
    if(blocks.length < 2) toc.remove();
    else toc.innerHTML = blocks.map(b => {
      const h = b.querySelector('h3');
      return '<li><a href="#' + b.id + '">' + escHtml(h ? h.textContent : b.id) + '</a></li>';
    }).join('');
  }

  // найкращий результат ДО цього відкриття сторінки
  const bestEl = document.getElementById('gramBest');
  const prev = loadStoredProgress('gram:' + id);
  if(bestEl){
    bestEl.textContent = prev
      ? 'Твій найкращий результат у цій темі досі: ' + prev.best + ' з ' + prev.total + '.'
      : 'Результат цієї теми збережеться в цьому браузері — наступного разу побачиш його тут і на сторінці «Граматика».';
  }

  const rel = document.getElementById('gramRelated');
  if(rel){
    const links = [];
    if(typeof LESSONS !== 'undefined'){
      LESSONS.filter(l => Array.isArray(l.gram) && l.gram.includes(id)).forEach(l => {
        links.push('<a class="gram-link" href="' + root + 'lessons/' + l.file + '">'
          + '<span class="k">' + l.klas + ' клас, модуль ' + l.modul + ', урок ' + l.lektion + '</span>'
          + escHtml(l.nazva) + '</a>');
      });
    }
    ((t && t.dyv) || []).forEach(did => {
      const d = GRAMMAR.find(x => x.id === did);
      if(gramIsReady(d)) links.push('<a class="gram-link" href="' + d.id + '.html"><span class="k">Граматика</span>' + escHtml(d.tema) + '</a>');
    });
    const card = rel.closest('.card') || rel;
    if(links.length) rel.innerHTML = links.join('');
    else card.style.display = 'none';
  }

  if(typeof trackProgress === 'function') trackProgress('gram:' + id);
}
