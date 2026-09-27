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
function lessonGramChips(l, lessonFileBase){
  if(!Array.isArray(l.gram) || typeof GRAMMAR === 'undefined') return '';
  const base = lessonFileBase.replace(/lessons\/$/, '') + 'gramatyka/temy/';
  const chips = l.gram.map(id => GRAMMAR.find(t => t.id === id)).filter(t => t && t.opublikovano > 0)
    .map(t => '<a class="gram-chip" href="' + base + t.id + '.html" title="' + t.tema.replace(/"/g, '&quot;') + '">' + t.uk + '</a>');
  return chips.length ? '<div class="gram-chips">' + chips.join('') + '</div>' : '';
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
          const card = document.createElement('article');
          card.className = 'lesson-card';
          card.style.setProperty('--module-color', color);
          card.innerHTML = '<div class="lesson-num">Урок ' + l.lektion + '</div>'
            + '<h4>' + l.nazva + '</h4>'
            + '<p>' + l.opys + '</p>'
            + lessonGramChips(l, lessonFileBase)
            + '<a class="open-link" href="' + lessonFileBase + l.file + '" target="_blank" rel="noopener">Відкрити</a>'
            + (l === newestPerKlas[l.klas] ? '<span class="new-badge">нове</span>' : '');
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
    wrap.innerHTML = '<p class="empty-note">Не вдалося завантажити план тем (data/grammar-data.js).</p>';
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
