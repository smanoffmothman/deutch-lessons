/* =================================================================
   material-reader.js — логіка сторінок розділу «Матеріали» (статті)
   Підключай ПІСЛЯ lesson-interactions.js (користується його функціями:
   setTotal / markDone / isScored / isLocked / buildOrder / wireBlanks /
   shuffleArray / trackProgress) і ПІСЛЯ data/materials-data.js.

   Окремий файл, щоб НЕ чіпати спільний з уроками й граматикою
   lesson-interactions.js: проєктам уроків і граматики цей файл не
   потрібен. Стилі — assets/material-style.css.

   Як і в lesson-interactions.js: у цьому файлі НЕ можна писати
   закривний тег script буквальним текстом (ламає вбудоване превʼю).

   ЩО ТУТ Є
   1. Переклад слова по тапу/кліку (span.gl у тексті) + ★ «запам'ятати»
   2. Панель над текстом: розмір шрифту, «показати всі переклади»
   3. «Текст під рукою»: кнопка 📄 на вкладках з вправами відкриває
      статтю збоку (на телефоні — знизу)
   4. Вкладка Wörter: список усіх перекладених слів + картки
   5. Нові типи вправ: buildRF, buildMatch, buildSequence
   6. initMaterialPage(id) — останній рядок скрипту сторінки
   ================================================================= */

const MAT_STARS_PREFIX = 'dmu:mat-stars:';
const MAT_FONT_KEY = 'dmu:mat-font';
const MAT_FONT_STEPS = [16, 17.5, 19, 21];
const MAT_WPM = 110; // слів за хвилину — темп уважного читання іноземною
const mat = {id: null, stars: new Set(), pop: null, popFor: null, drawer: null, fontStep: 1};

function matEsc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c])); }
function matLs(key, val){
  try {
    if(val === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, val);
  } catch(_) { return null; }
}

/* ---------- 1. Слова з перекладом у тексті ----------
   Розмітка в тексті статті:
     <span class="gl" data-uk="приказка" data-lemma="der Spruch, -ü-e">Spruch</span>
   - data-uk     — переклад українською В ЦЬОМУ контексті (обов'язково);
   - data-lemma  — словникова форма (іменник з артиклем і множиною,
                   дієслово в інфінітиві з формами); якщо немає —
                   показується саме слово з тексту;
   - data-note   — (необов'язково) коротка примітка: «розм.», «тут: …»;
   - data-key    — (необов'язково) ключове слово: показується у вкладці
                   «Vor dem Lesen» у блоці #matKeyWords.
   Одне й те саме слово в тексті можна позначати кілька разів — у списку
   Wörter воно буде один раз (за data-lemma, інакше за самим словом). */
function glKey(el){ return (el.dataset.lemma || el.textContent).replace(/\s+/g, ' ').trim(); }
function glWords(){
  const seen = new Map();
  document.querySelectorAll('#matText .gl').forEach(el => {
    const k = glKey(el);
    if(!seen.has(k)) seen.set(k, {key: k, uk: el.dataset.uk || '', note: el.dataset.note || '', isKey: el.hasAttribute('data-key')});
    else if(el.hasAttribute('data-key')) seen.get(k).isKey = true;
  });
  return Array.from(seen.values());
}
function loadStars(){
  mat.stars = new Set();
  try { (JSON.parse(matLs(MAT_STARS_PREFIX + mat.id)) || []).forEach(k => mat.stars.add(k)); } catch(_) {}
}
function saveStars(){ matLs(MAT_STARS_PREFIX + mat.id, JSON.stringify(Array.from(mat.stars))); }
function toggleStar(k){
  if(mat.stars.has(k)) mat.stars.delete(k); else mat.stars.add(k);
  saveStars();
  document.querySelectorAll('.gl').forEach(el => el.classList.toggle('is-starred', mat.stars.has(glKey(el))));
  renderWords();
}

function buildPop(){
  const pop = document.createElement('div');
  pop.className = 'gl-pop';
  pop.setAttribute('role', 'dialog');
  pop.hidden = true;
  pop.innerHTML = '<div class="gl-pop-de"></div><div class="gl-pop-uk"></div><div class="gl-pop-note"></div>'
    + '<button type="button" class="gl-pop-star" aria-pressed="false"></button>';
  pop.querySelector('.gl-pop-star').addEventListener('click', e => {
    e.stopPropagation();
    if(!mat.popFor) return;
    toggleStar(glKey(mat.popFor));
    syncPopStar();
  });
  document.body.appendChild(pop);
  mat.pop = pop;
  return pop;
}
function syncPopStar(){
  const b = mat.pop.querySelector('.gl-pop-star');
  const on = mat.popFor && mat.stars.has(glKey(mat.popFor));
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
  b.textContent = on ? '★ У моїх словах' : '☆ Запам\'ятати';
}
function openPop(el){
  const pop = mat.pop || buildPop();
  if(mat.popFor) mat.popFor.classList.remove('is-open');
  mat.popFor = el;
  el.classList.add('is-open');
  pop.querySelector('.gl-pop-de').textContent = el.dataset.lemma || el.textContent.trim();
  pop.querySelector('.gl-pop-uk').textContent = el.dataset.uk || '—';
  const note = pop.querySelector('.gl-pop-note');
  note.textContent = el.dataset.note || '';
  note.hidden = !el.dataset.note;
  syncPopStar();
  pop.hidden = false;
  // позиція: під словом, якщо місця мало — над ним; не виходити за краї екрана
  const r = el.getBoundingClientRect();
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = r.left + r.width / 2 - pw / 2;
  left = Math.max(8, Math.min(left, document.documentElement.clientWidth - pw - 8));
  let top = r.bottom + 8;
  pop.classList.remove('above');
  if(top + ph > window.innerHeight - 8 && r.top - ph - 8 > 8){ top = r.top - ph - 8; pop.classList.add('above'); }
  pop.style.left = (left + window.scrollX) + 'px';
  pop.style.top = (top + window.scrollY) + 'px';
}
function closePop(){
  if(!mat.pop || mat.pop.hidden) return;
  mat.pop.hidden = true;
  if(mat.popFor) mat.popFor.classList.remove('is-open');
  mat.popFor = null;
}
function initGlosses(){
  document.querySelectorAll('.gl').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    if(mat.stars.has(glKey(el))) el.classList.add('is-starred');
  });
  // делегування: працює і в тексті, і в його копії в шухляді
  document.addEventListener('click', e => {
    const gl = e.target.closest && e.target.closest('.gl');
    if(gl){ if(gl === mat.popFor) closePop(); else openPop(gl); return; }
    if(mat.pop && !mat.pop.contains(e.target)) closePop();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closePop(); return; }
    const gl = e.target.closest && e.target.closest('.gl');
    if(gl && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); gl === mat.popFor ? closePop() : openPop(gl); }
  });
  window.addEventListener('resize', closePop);
}

/* ---------- 2. Панель над текстом ---------- */
function applyFont(){
  document.documentElement.style.setProperty('--mat-fs', MAT_FONT_STEPS[mat.fontStep] + 'px');
  document.querySelectorAll('.mat-tools .mt-font').forEach(b => {
    b.disabled = (b.dataset.d === '-1' && mat.fontStep === 0) || (b.dataset.d === '1' && mat.fontStep === MAT_FONT_STEPS.length - 1);
  });
}
function buildTools(){
  const text = document.getElementById('matText');
  if(!text) return;
  const saved = parseInt(matLs(MAT_FONT_KEY), 10);
  if(!isNaN(saved) && saved >= 0 && saved < MAT_FONT_STEPS.length) mat.fontStep = saved;
  const bar = document.createElement('div');
  bar.className = 'mat-tools';
  bar.innerHTML = '<span class="mt-hint">Натисни на <span class="gl-sample">підкреслене</span> слово — побачиш переклад.</span>'
    + '<span class="mt-btns">'
    + '<button type="button" class="mt-btn mt-font" data-d="-1" aria-label="Менший шрифт">A−</button>'
    + '<button type="button" class="mt-btn mt-font" data-d="1" aria-label="Більший шрифт">A+</button>'
    + '<button type="button" class="mt-btn mt-all" aria-pressed="false">Усі переклади</button>'
    + '</span>';
  text.parentNode.insertBefore(bar, text);
  bar.querySelectorAll('.mt-font').forEach(b => b.addEventListener('click', () => {
    mat.fontStep = Math.max(0, Math.min(MAT_FONT_STEPS.length - 1, mat.fontStep + (+b.dataset.d)));
    matLs(MAT_FONT_KEY, String(mat.fontStep));
    applyFont();
  }));
  bar.querySelector('.mt-all').addEventListener('click', e => {
    const on = !text.classList.contains('show-uk');
    document.querySelectorAll('.mat-text').forEach(t => t.classList.toggle('show-uk', on));
    e.currentTarget.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  applyFont();
}

/* ---------- 3. Текст під рукою (шухляда) ----------
   На вкладках з вправами (усі, крім Vor dem Lesen, Text, Wörter і Fertig!)
   праворуч унизу кнопка «📄 Text». Вона відкриває копію статті: на
   широкому екрані — панель праворуч (вправу видно поруч), на телефоні —
   шторка знизу. Позиція прокрутки в шухляді зберігається між відкриттями.
   Переклад слів працює і в копії. Ховати кнопку на вкладці:
   data-no-text-fab на її section.panel. */
const MAT_NO_FAB = /^panel-(start|text|woerter|ende)$/;
function buildDrawer(){
  const text = document.getElementById('matText');
  if(!text) return;
  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'text-fab'; fab.hidden = true;
  fab.innerHTML = '<span aria-hidden="true">📄</span> Text';
  fab.setAttribute('aria-label', 'Показати текст статті');
  const dr = document.createElement('aside');
  dr.className = 'text-drawer'; dr.hidden = true;
  dr.setAttribute('aria-label', 'Текст статті');
  const title = (document.querySelector('.hero h1') || {}).textContent || 'Text';
  dr.innerHTML = '<div class="td-head"><span class="td-grip" aria-hidden="true"></span><b>' + matEsc(title) + '</b>'
    + '<button type="button" class="td-close" aria-label="Закрити">✕</button></div><div class="td-body"></div>';
  const copy = text.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  copy.querySelectorAll('audio, .player, script').forEach(n => n.remove());
  dr.querySelector('.td-body').appendChild(copy);
  const back = document.createElement('div');
  back.className = 'td-backdrop'; back.hidden = true;
  document.body.appendChild(back); document.body.appendChild(dr); document.body.appendChild(fab);
  mat.drawer = {fab: fab, dr: dr, back: back};

  const open = () => { dr.hidden = false; back.hidden = false; document.body.classList.add('drawer-open'); fab.setAttribute('aria-expanded', 'true'); closePop(); };
  const close = () => { dr.hidden = true; back.hidden = true; document.body.classList.remove('drawer-open'); fab.setAttribute('aria-expanded', 'false'); closePop(); };
  fab.addEventListener('click', () => dr.hidden ? open() : close());
  dr.querySelector('.td-close').addEventListener('click', close);
  back.addEventListener('click', close);
  dr.querySelector('.td-body').addEventListener('scroll', closePop, {passive: true});
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !dr.hidden) close(); });

  const sync = () => {
    const active = document.querySelector('.panel.active');
    const show = active && !MAT_NO_FAB.test(active.id) && !active.hasAttribute('data-no-text-fab');
    fab.hidden = !show;
    if(!show && !dr.hidden) close();
  };
  const mo = new MutationObserver(sync);
  document.querySelectorAll('.panel').forEach(p => mo.observe(p, {attributes: true, attributeFilter: ['class']}));
  sync();
}

/* ---------- 4. Вкладка Wörter: список + картки ----------
   HTML у вкладці: <div id="matWords"></div> — решту малює скрипт.
   Слова беруться з тексту (span.gl), у порядку появи. ★ — «мої слова»,
   зберігаються в браузері учня (localStorage, окремо для кожної статті).
   Картки — для самоперевірки, у бал і в звіт НЕ йдуть. */
const wordsUi = {filter: 'all', mode: 'list', dir: 'de', deck: [], pos: 0, known: 0, again: []};
function wordsPool(){
  const all = glWords();
  return wordsUi.filter === 'star' ? all.filter(w => mat.stars.has(w.key)) : all;
}
function renderWords(){
  const box = document.getElementById('matWords');
  if(!box) return;
  const all = glWords();
  const starN = all.filter(w => mat.stars.has(w.key)).length;
  if(wordsUi.filter === 'star' && !starN) wordsUi.filter = 'all';
  const head = '<div class="mw-bar">'
    + '<button type="button" class="mt-btn mw-f" data-f="all" aria-pressed="' + (wordsUi.filter === 'all') + '">Усі · ' + all.length + '</button>'
    + '<button type="button" class="mt-btn mw-f" data-f="star" aria-pressed="' + (wordsUi.filter === 'star') + '"' + (starN ? '' : ' disabled') + '>★ Мої · ' + starN + '</button>'
    + '<span class="mw-sp"></span>'
    + (wordsUi.mode === 'list'
      ? '<button type="button" class="btn small mw-cards">Картки ▶</button>'
      : '<button type="button" class="btn small secondary mw-tolist">← Список</button>')
    + '</div>';
  if(wordsUi.mode === 'cards'){ box.innerHTML = head + '<div class="mw-cardzone"></div>'; renderCard(box.querySelector('.mw-cardzone')); }
  else {
    const pool = wordsPool();
    box.innerHTML = head + (pool.length ? '<ul class="mw-list">' + pool.map(w =>
      '<li><span class="mw-de">' + matEsc(w.key) + '</span><span class="mw-uk">' + matEsc(w.uk)
      + (w.note ? ' <span class="mw-note">(' + matEsc(w.note) + ')</span>' : '') + '</span>'
      + '<button type="button" class="mw-star" data-k="' + matEsc(w.key) + '" aria-pressed="' + mat.stars.has(w.key) + '" aria-label="Мої слова">'
      + (mat.stars.has(w.key) ? '★' : '☆') + '</button></li>').join('') + '</ul>'
      : '<p class="empty-note">У тексті ще немає слів з перекладом.</p>');
  }
  box.querySelectorAll('.mw-f').forEach(b => b.addEventListener('click', () => { wordsUi.filter = b.dataset.f; wordsUi.mode = 'list'; renderWords(); }));
  box.querySelectorAll('.mw-star').forEach(b => b.addEventListener('click', () => toggleStar(b.dataset.k)));
  const c = box.querySelector('.mw-cards');
  if(c) c.addEventListener('click', () => startCards(wordsPool()));
  const l = box.querySelector('.mw-tolist');
  if(l) l.addEventListener('click', () => { wordsUi.mode = 'list'; renderWords(); });
}
function startCards(pool){
  wordsUi.deck = shuffleArray(pool); wordsUi.pos = 0; wordsUi.known = 0; wordsUi.again = [];
  wordsUi.mode = 'cards'; renderWords();
}
function renderCard(zone){
  const d = wordsUi.deck;
  if(wordsUi.pos >= d.length){
    const again = wordsUi.again.slice();
    zone.innerHTML = '<div class="mw-done"><p class="mw-done-big">Готово!</p><p>Знаєш ' + wordsUi.known + ' з ' + d.length + '.</p>'
      + '<div class="check-bar" style="justify-content:center">'
      + (again.length ? '<button type="button" class="btn mw-again">Повторити ' + again.length + ' незнаних</button>' : '')
      + '<button type="button" class="btn secondary mw-restart">Усі ще раз</button></div></div>';
    const a = zone.querySelector('.mw-again'); if(a) a.addEventListener('click', () => startCards(again));
    zone.querySelector('.mw-restart').addEventListener('click', () => startCards(wordsPool()));
    return;
  }
  const w = d[wordsUi.pos];
  const front = wordsUi.dir === 'de' ? w.key : w.uk, back = wordsUi.dir === 'de' ? w.uk : w.key;
  zone.innerHTML = '<div class="mw-top"><span class="mw-count">' + (wordsUi.pos + 1) + ' / ' + d.length + '</span>'
    + '<button type="button" class="mt-btn mw-dir">' + (wordsUi.dir === 'de' ? 'DE → UA' : 'UA → DE') + ' ⇄</button></div>'
    + '<button type="button" class="mw-card" aria-live="polite"><span class="mw-front">' + matEsc(front) + '</span>'
    + '<span class="mw-back" hidden>' + matEsc(back) + '</span><span class="mw-tap">натисни, щоб перевернути</span></button>'
    + '<div class="check-bar mw-answer" style="justify-content:center" hidden>'
    + '<button type="button" class="btn mw-yes">Знаю ✓</button><button type="button" class="btn secondary mw-no">Ще раз ↻</button></div>';
  const card = zone.querySelector('.mw-card'), ans = zone.querySelector('.mw-answer');
  card.addEventListener('click', () => {
    const b = card.querySelector('.mw-back');
    b.hidden = !b.hidden; card.classList.toggle('flipped', !b.hidden);
    card.querySelector('.mw-tap').hidden = true; ans.hidden = false;
  });
  zone.querySelector('.mw-dir').addEventListener('click', () => { wordsUi.dir = wordsUi.dir === 'de' ? 'uk' : 'de'; renderCard(zone); });
  zone.querySelector('.mw-yes').addEventListener('click', () => { wordsUi.known++; wordsUi.pos++; renderCard(zone); });
  zone.querySelector('.mw-no').addEventListener('click', () => { wordsUi.again.push(w); wordsUi.pos++; renderCard(zone); });
}
// ключові слова у «Vor dem Lesen» (span.gl з data-key)
function renderKeyWords(){
  const box = document.getElementById('matKeyWords');
  if(!box) return;
  const keys = glWords().filter(w => w.isKey);
  if(!keys.length){ const c = box.closest('.card'); (c || box).style.display = 'none'; return; }
  box.innerHTML = keys.map(w => '<span class="kw"><b>' + matEsc(w.key) + '</b> — ' + matEsc(w.uk) + '</span>').join('');
}

/* ---------- 5. Нові типи вправ ---------- */

/* richtig / falsch / steht nicht im Text
     buildRF('ub2-rf', [
       {s: "In Deutschland sind die meisten Geschäfte sonntags geschlossen.", a: "r"},
       {s: "Das Gesetz gilt seit 2020.", a: "f"},
       {s: "Die Verkäuferinnen finden das Gesetz gut.", a: "n"}
     ]);
   a: "r" | "f" | "n". Варіант «steht nicht im Text» з'являється в усіх
   питаннях вправи, якщо хоч одне має a: "n" (або явно {ni: true} третім
   аргументом). Порядок кнопок завжди той самий (r · f · n) — тут
   перемішування не потрібне: варіантів однаково 2–3 на всі питання.
   Механіка й анти-чіт — як у buildQuiz: зараховується перша спроба,
   правильна відповідь не показується; режим контрольної теж діє.
   Звіт для вчителя підхоплює вправу автоматично (розмітка .quiz-q). */
const RF_LABELS = {r: 'richtig', f: 'falsch', n: 'steht nicht im Text'};
function buildRF(containerId, items, opts){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  opts = opts || {};
  const withNi = opts.ni != null ? !!opts.ni : items.some(it => it.a === 'n');
  const keys = withNi ? ['r', 'f', 'n'] : ['r', 'f'];
  const scored = isScored(containerId), locked = isLocked(containerId);
  if(scored) setTotal(items.length);
  wrap.classList.add('rf-ex');
  items.forEach((item, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-q rf-q';
    div.innerHTML = '<p class="q-text">' + (qi + 1) + '. ' + item.s + '</p><div class="quiz-opts"></div><p class="feedback"></p>';
    const optsWrap = div.querySelector('.quiz-opts'), fb = div.querySelector('.feedback');
    let firstTryDone = false;
    keys.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn rf-' + k; b.textContent = RF_LABELS[k];
      b.addEventListener('click', () => {
        if(div.dataset.solved) return;
        const ok = k === item.a;
        optsWrap.querySelectorAll('.opt-btn').forEach(x => x.classList.remove('wrong'));
        if(ok){
          b.classList.add('correct'); fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
          optsWrap.querySelectorAll('.opt-btn').forEach(x => x.disabled = true); div.dataset.solved = '1';
        } else if(locked){
          b.classList.add('wrong'); fb.textContent = 'Leider falsch ✗'; fb.className = 'feedback bad';
          optsWrap.querySelectorAll('.opt-btn').forEach(x => x.disabled = true); div.dataset.solved = '1';
        } else {
          b.classList.add('wrong'); fb.textContent = 'Nicht ganz — lies die Stelle im Text noch einmal.'; fb.className = 'feedback bad';
        }
        if(!firstTryDone){
          firstTryDone = true;
          div.dataset.first = RF_LABELS[k]; div.dataset.firstOk = ok ? '1' : '0'; // для звіту вчителю
          if(ok && scored) markDone(1);
        }
      });
      optsWrap.appendChild(b);
    });
    wrap.appendChild(div);
  });
}

/* Зіставлення: слово ↔ значення, заголовок ↔ абзац, питання ↔ відповідь
     <div class="card" id="ub3-list"></div>      ← лише порожній контейнер
     buildMatch('ub3', [
       ["der Feiertag", "свято, вихідний день"],
       ["öffnen", "відчиняти"]
     ]);
     buildMatch('ub4', [["Wer darf sonntags verkaufen?", "Absatz 3"], …],
                {options: ["Absatz 1", "Absatz 2", "Absatz 3", "Absatz 4"]});
   - пари [ліва частина, правильна права частина];
   - ліва частина — текст рядка; права — варіанти у випадному списку
     (перемішуються самі). Якщо задано options — у списку саме вони і в
     такому порядку (зручно для «Absatz 1…N», «A/B/C»); тоді праві
     частини пар мають точно збігатися з одним із options;
   - lead: true — ліва частина довга (речення): рядок стає двоповерховим.
   Під списком сама з'являється панель Prüfen / Zurücksetzen / рахунок
   (id за домовленістю wireBlanks: ub3-check, ub3-reset, ub3-score).
   Під капотом — звичайні select.blank + wireBlanks, тож анти-чіт, режим
   контрольної і звіт для вчителя працюють як у пропусках. */
function buildMatch(key, pairs, opts){
  const list = document.getElementById(key + '-list');
  if(!list) return;
  opts = opts || {};
  const options = opts.options ? opts.options.slice() : shuffleArray(Array.from(new Set(pairs.map(p => p[1]))));
  const optHtml = '<option value="">—</option>' + options.map(o => '<option>' + matEsc(o) + '</option>').join('');
  list.classList.add('match-ex');
  if(opts.lead) list.classList.add('match-lead');
  list.innerHTML = pairs.map((p, i) => '<div class="match-row"><span class="name"><span class="num">' + (i + 1) + ')</span> ' + p[0] + '</span> '   // пробіл — щоб у звіті-PDF назва й відповідь не злипались
    + '<select class="blank" data-ans="' + matEsc(p[1]) + '">' + optHtml + '</select></div>').join('');
  if(!document.getElementById(key + '-check')){
    const bar = document.createElement('div');
    bar.className = 'check-bar';
    bar.innerHTML = '<button class="btn" type="button" id="' + key + '-check">Prüfen</button>'
      + '<button class="btn secondary" type="button" id="' + key + '-reset">Zurücksetzen</button>'
      + '<span class="score-pill" id="' + key + '-score"></span>';
    list.appendChild(bar);
  }
  wireBlanks(key);
}

/* Розстав по порядку: події статті, кроки процесу, абзаци
     buildSequence('ub5-seq', [
       "1956 tritt das Ladenschlussgesetz in Kraft.",
       "2006 dürfen die Bundesländer selbst entscheiden.",
       "Heute haben viele Supermärkte bis 22 Uhr geöffnet."
     ]);
   - масив речень У ПРАВИЛЬНОМУ порядку (перемішуються самі) — одна
     послідовність = 1 бал. Кілька послідовностей в одній вправі:
     buildSequence(id, [{steps: [...], hint: "…"}, {steps: [...]}]).
   Під капотом — buildOrder (картки стають рядками списку): клік ставить
   картку наступною, клік по поставленій повертає її назад. */
function buildSequence(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const seqs = (typeof data[0] === 'string') ? [{steps: data}] : data;
  wrap.classList.add('seq-ex');
  if(seqs.length === 1) wrap.classList.add('seq-single');
  buildOrder(containerId, seqs.map(s => ({words: s.steps, hint: s.hint, gross: true})));
}

/* ---------- 6. Сторінка статті ----------
   Останній рядок скрипту сторінки:  initMaterialPage(MAT_ID);
   - хлібні крихти Головна › Матеріали › назва;
   - бейджі в hero (#matMeta): рівень, країна, тема, обсяг і час читання
     (рахуються з тексту), джерело;
   - примітка про джерело (#matSource) і «Почитай ще» (#matRelated) —
     з materials-data.js; немає даних — картка ховається;
   - переклад слів, панель над текстом, шухляда, вкладка Wörter;
   - збереження прогресу: trackProgress('mat:' + id) (його показує сторінка
     materialy/ на картці статті). */
const MAT_LAND = {DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz', LI: 'Liechtenstein', LU: 'Luxemburg', EU: 'Europa', UA: 'Ukraine'};
function matFlag(code){
  // прапорці намальовані CSS (емодзі-прапорців Windows не показує)
  return '<span class="flag flag-' + matEsc(code) + '" title="' + matEsc(MAT_LAND[code] || code) + '" aria-label="' + matEsc(MAT_LAND[code] || code) + '"></span>';
}
function matTextWords(){
  const text = document.getElementById('matText');
  if(!text) return 0;
  let s = '';
  text.querySelectorAll(':scope > p, :scope > h3, :scope > blockquote, :scope > ul, :scope > ol').forEach(n => { s += ' ' + n.textContent; });
  return (s.match(/[A-Za-zÄÖÜäöüß0-9]+(?:[-'][A-Za-zÄÖÜäöüß0-9]+)*/g) || []).length;
}
function matMinutes(words){ return Math.max(1, Math.round(words / MAT_WPM)); }
function matSourceText(m){
  const d = m && m.dzherelo;
  if(!d || !d.nazva) return '';
  return '<i>' + matEsc(d.nazva) + '</i>' + (d.nomer ? ', ' + matEsc(d.nomer) : '');
}

function initMaterialPage(id, opts){
  opts = opts || {};
  const root = opts.root || '../../';
  mat.id = id;
  const m = (typeof MATERIALS !== 'undefined') ? MATERIALS.find(x => x.id === id) : null;

  if(typeof renderCrumbs === 'function'){
    renderCrumbs('crumbs', [
      {label: 'Головна', href: root + 'index.html'},
      {label: 'Матеріали', href: root + 'materialy/index.html'},
      {label: m ? m.nazva : ((document.querySelector('.hero h1') || {}).textContent || id)}
    ]);
  }

  const words = matTextWords();
  const meta = document.getElementById('matMeta');
  if(meta){
    const bits = [];
    if(m && m.riven) bits.push('<span class="mm-chip mm-level">' + matEsc(m.riven) + '</span>');
    if(m && m.krayina) [].concat(m.krayina).forEach(c => bits.push('<span class="mm-chip">' + matFlag(c) + matEsc(MAT_LAND[c] || c) + '</span>'));
    if(m && m.temy) [].concat(m.temy).forEach(t => bits.push('<span class="mm-chip">' + matEsc(t) + '</span>'));
    if(words) bits.push('<span class="mm-chip">≈ ' + words + ' Wörter · ' + matMinutes(words) + ' хв</span>');
    meta.innerHTML = bits.join('');
  }

  const src = document.getElementById('matSource');
  if(src){
    const s = matSourceText(m);
    if(s){
      const url = m.dzherelo.url ? ' <a href="' + matEsc(m.dzherelo.url) + '" target="_blank" rel="noopener">Оригінал ↗</a>' : '';
      src.innerHTML = 'Текст адаптовано за матеріалами: ' + s + '.' + url;
    } else src.style.display = 'none';
  }

  const rel = document.getElementById('matRelated');
  if(rel){
    const tags = new Set([].concat((m && m.temy) || []));
    const others = (typeof MATERIALS !== 'undefined' ? MATERIALS : [])
      .filter(x => x.id && x.id !== id && x.typ === 'stattya' && [].concat(x.temy || []).some(t => tags.has(t)))
      .slice(-4).reverse();
    const card = rel.closest('.card') || rel;
    if(others.length){
      rel.innerHTML = others.map(x => '<a class="gram-link" href="' + matEsc((x.file || '').replace(/^statti\//, '')) + '">'
        + '<span class="k">' + matEsc(x.riven || '') + (x.temy ? ' · ' + matEsc([].concat(x.temy).join(', ')) : '') + '</span>'
        + matEsc(x.nazva) + '</a>').join('');
    } else card.style.display = 'none';
  }

  loadStars();
  initGlosses();
  buildTools();
  buildDrawer();
  renderKeyWords();
  renderWords();

  if(typeof trackProgress === 'function') trackProgress('mat:' + id);
}
