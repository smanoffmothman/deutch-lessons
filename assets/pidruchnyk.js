/* =================================================================
   pidruchnyk.js — розділ «Підручники» (вправи до чужих підручників,
   універсальні — для будь-якого вчителя й учня).
   Окремий файл, як material-reader.js для статей: спільні з іншими
   проєктами lesson-interactions.js / site.js / material-reader.js тут
   НЕ правляться — лише використовуються.

   Як і в lesson-interactions.js: у цьому файлі НЕ можна писати
   закривний тег script буквальним текстом (ламає вбудоване превʼю).

   Три сторінки — три функції (кожна — останнім рядком скрипту сторінки):
   1. pidruchnyky/index.html            → renderBookList()
   2. pidruchnyky/<книга>/index.html    → renderBookHub('<id книги>')
   3. pidruchnyky/<книга>/<розділ>.html → initBookUnit('<id книги>', '<id розділу>')

   Дані: data/pidruchnyky-data.js (PIDRUCHNYKY) і data/slova/<id книги>.js
   (SLOVA['<id книги>']). Прогрес учня: localStorage
   dmu:progress:kn:<книга>/<розділ> (через trackProgress).
   ================================================================= */

const KN_PROGRESS_PREFIX = 'dmu:progress:';
const KN_TYP = {
  'vpravy':       {uk: 'вправи',          icon: '✏️'},
  'chytannya':    {uk: 'читання',         icon: '📖'},
  'gramatyka':    {uk: 'граматика',       icon: '📐'},
  'povtorennya':  {uk: 'повторення',      icon: '🔁'},
  'bez-storinky': {uk: 'без онлайн-вправ', icon: ''}
};
const KN_COLORS = ['#1F5C56', '#B14E3E', '#8a5a11', '#48713F', '#123E3A', '#2E726F', '#5B5346', '#B14E3E'];

function knEsc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c])); }
function knBooks(){ return (typeof PIDRUCHNYKY !== 'undefined' && Array.isArray(PIDRUCHNYKY)) ? PIDRUCHNYKY : []; }
function knBook(id){ return knBooks().find(b => b.id === id) || null; }

/* Обхід дерева: плаский список вузлів у порядку книжки, кожен з ланцюжком
   предків (path) — щоб знати Lektion для Modul, сусідів і т. ін. */
function knWalk(book){
  const out = [];
  (function walk(nodes, path){
    (nodes || []).forEach(n => {
      out.push({node: n, path: path});
      if(n.dity) walk(n.dity, path.concat([n]));
    });
  })(book ? book.rozdily : [], []);
  return out;
}
function knHasPage(n){ return !!(n && n.typ && n.typ !== 'bez-storinky'); }
function knIsReady(n){ return knHasPage(n) && n.opublikovano > 0; }
function knPages(book){ return knWalk(book).filter(x => knHasPage(x.node)); }
function knNewest(book){
  let best = null;
  knWalk(book).forEach(x => { if(knIsReady(x.node) && (!best || x.node.opublikovano > best.opublikovano)) best = x.node; });
  return best;
}
function knRivenLabel(book, depth){ return (book && book.rivni && book.rivni[depth]) || ''; }
// «Lektion 1», «Modul A»; без label — лише назва рівня не пишеться
function knNodeTag(book, n, depth){
  if(!n.label) return '';
  const r = knRivenLabel(book, depth);
  return (r ? r + ' ' : '') + n.label;
}
function knPages_s(s){ return s ? 'с. ' + s : ''; }
function knAuthors(book){ return (book.avtory || []).join(', '); }
function knPlural(n, one, few, many){
  const m10 = n % 10, m100 = n % 100;
  if(m10 === 1 && m100 !== 11) return one;
  if(m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
function knProgress(bookId, unitId){
  try {
    const v = JSON.parse(localStorage.getItem(KN_PROGRESS_PREFIX + 'kn:' + bookId + '/' + unitId));
    return (v && v.total) ? v : null;
  } catch(_) { return null; }
}
function knState(bookId, n){
  if(!knHasPage(n)) return {cls: 'is-nopage', pct: 0, label: ''};
  if(!knIsReady(n)) return {cls: 'is-planned', pct: 0, label: ''};
  const p = knProgress(bookId, n.id);
  if(!p) return {cls: 'is-new', pct: 0, label: ''};
  const pct = Math.round(Math.min(1, p.best / p.total) * 100);
  return {cls: pct >= 100 ? 'is-done' : 'is-started', pct: pct, label: p.best + ' / ' + p.total};
}
function knDisclaimer(book){
  return 'Вправи й переклади створені DeutschHeft незалежно від видавництва'
    + (book && book.vydavnytstvo ? ' «' + knEsc(book.vydavnytstvo) + '»' : '')
    + ' і не є офіційними матеріалами до підручника. Назва книжки вказана, щоб легше знайти вправи до свого уроку'
    + (book && book.rik ? '; номери сторінок — за виданням ' + knEsc(book.rik) + ' р.' : '.');
}
function knBookMetaChips(book){
  const bits = [];
  if(book.klas) bits.push(book.klas);
  if(book.riven) bits.push(book.riven);
  if(book.vydavnytstvo) bits.push('«' + book.vydavnytstvo + '»' + (book.rik ? ', ' + book.rik : ''));
  return bits.map(b => '<span class="kn-chip">' + knEsc(b) + '</span>').join('');
}

/* ---------- 1. Список книжок: pidruchnyky/index.html ----------
   HTML: <div id="knSearch"></div><div class="kn-books" id="knBooks"></div> */
function renderBookList(){
  const grid = document.getElementById('knBooks');
  if(!grid) return;
  const books = knBooks();
  if(!books.length){ grid.innerHTML = '<p class="empty-note">Підручники скоро з\'являться.</p>'; return; }
  const searchBox = document.getElementById('knSearch');
  let input = null;
  if(searchBox && books.length > 4){ // пошук має сенс, коли книжок більше, ніж видно одразу
    searchBox.className = 'search-row';
    searchBox.innerHTML = '<input type="search" placeholder="Пошук: назва, автор, клас…" aria-label="Пошук підручника">';
    input = searchBox.querySelector('input');
  }
  function render(){
    const q = input ? input.value.trim().toLowerCase() : '';
    const list = books.filter(b => !q || [b.nazva, b.nazvaDe, b.nazvaKorotko, b.klas, b.riven, b.vydavnytstvo, knAuthors(b)].concat(b.aliasy || [])
      .join(' ').toLowerCase().includes(q));
    grid.innerHTML = list.length ? list.map(b => {
      const pages = knPages(b), ready = pages.filter(x => knIsReady(x.node)).length;
      return '<article class="kn-book">'
        + '<div class="kn-book-top">' + knBookMetaChips(b) + '</div>'
        + '<h3><a class="lesson-link" href="' + knEsc(b.id) + '/index.html">' + knEsc(b.nazva) + '</a></h3>'
        + (b.pidnazva ? '<p class="kn-book-sub">' + knEsc(b.pidnazva) + '</p>' : '')
        + '<p class="kn-book-authors">' + knEsc(knAuthors(b)) + '</p>'
        + '<div class="kn-book-foot"><span class="kn-book-count">'
        + (ready ? ready + ' з ' + pages.length + ' ' + knPlural(pages.length, 'розділу', 'розділів', 'розділів') + ' з вправами' : 'вправи готуються')
        + '</span><span class="open-cue">Відкрити →</span></div>'
        + '</article>';
    }).join('') : '<p class="empty-note">Нічого не знайдено — спробуй інше слово.</p>';
  }
  if(input) input.addEventListener('input', render);
  render();
}

/* ---------- 2. Хаб книжки: pidruchnyky/<книга>/index.html ----------
   HTML: #crumbs, #knMeta, #knAudio, #knSummary, #knToc, #knDisclaimer.
   Зміст малюється з дерева загально: верхній рівень — блоки (як розділи
   граматики), глибші вузли без сторінки — підзаголовки, розділи зі
   сторінкою — рядки. Назви рівнів — з book.rivni. Нова книжка з іншою
   структурою НЕ потребує змін у цьому коді. */
function renderBookHub(bookId, opts){
  opts = opts || {};
  const root = opts.root || '../../';
  const book = knBook(bookId);
  const toc = document.getElementById('knToc');
  if(!book){ if(toc) toc.innerHTML = '<p class="empty-note">Не вдалося завантажити зміст — онови сторінку.</p>'; return; }

  if(typeof renderCrumbs === 'function'){
    renderCrumbs('crumbs', [
      {label: 'Головна', href: root + 'index.html'},
      {label: 'Підручники', href: root + 'pidruchnyky/index.html'},
      {label: book.nazvaKorotko || book.nazva}
    ]);
  }
  const meta = document.getElementById('knMeta');
  if(meta) meta.innerHTML = knBookMetaChips(book) + '<span class="kn-chip">' + knEsc(knAuthors(book)) + '</span>';
  knRenderAudio(document.getElementById('knAudio'), book, null);
  const disc = document.getElementById('knDisclaimer');
  if(disc) disc.innerHTML = knDisclaimer(book);

  const newest = knNewest(book);
  const pages = knPages(book), ready = pages.filter(x => knIsReady(x.node));
  const sum = document.getElementById('knSummary');
  if(sum){
    let started = 0;
    ready.forEach(x => { if(knProgress(book.id, x.node.id)) started++; });
    sum.innerHTML = ready.length
      ? '<b>' + ready.length + '</b> з ' + pages.length + ' ' + knPlural(pages.length, 'розділу', 'розділів', 'розділів') + ' уже мають онлайн-вправи.'
        + (started ? ' Ти відкривав(-ла) ' + started + '. Прогрес зберігається в цьому браузері.' : '')
      : 'Онлайн-вправи до цієї книжки готуються — зміст уже видно нижче.';
  }
  if(!toc) return;

  function row(n, depth){
    const st = knState(book.id, n), t = KN_TYP[n.typ] || {};
    const tag = knNodeTag(book, n, depth);
    const ready = knIsReady(n);
    return '<li><' + (ready ? 'a href="' + knEsc(n.id) + '.html"' : 'div') + ' class="gram-row kn-row ' + st.cls + '">'
      + '<span class="gram-state" style="--pct:' + st.pct + '" aria-hidden="true"></span>'
      + '<span class="gram-title"><span class="de">' + (tag ? '<span class="kn-tag">' + knEsc(tag) + '</span> ' : '') + knEsc(n.nazva) + '</span>'
      + '<span class="uk">' + knEsc(knPages_s(n.storinky))
      + (n.typ && n.typ !== 'vpravy' ? ' · ' + knEsc(t.uk || n.typ) : '') + '</span></span>'
      + '<span class="gram-meta">'
      + (n === newest ? '<span class="new-badge">нове</span>' : '')
      + (st.cls === 'is-planned' ? '<span class="gram-soon">готується</span>'
         : st.label ? '<span class="gram-score">' + st.label + '</span>' : '')
      + '</span></' + (ready ? 'a' : 'div') + '></li>';
  }
  function items(nodes, depth){
    return (nodes || []).map(n => {
      let h = '';
      if(n.typ) h += row(n, depth);
      else if(n.dity) h += '<li class="kn-sub"><span class="kn-sub-h">' + knEsc([knNodeTag(book, n, depth), n.nazva].filter(Boolean).join(' · ')) + '</span>'
        + (n.storinky ? ' <span class="kn-sub-p">' + knEsc(knPages_s(n.storinky)) + '</span>' : '') + '</li>';
      if(n.dity) h += items(n.dity, depth + 1);
      return h;
    }).join('');
  }

  const jump = (book.rozdily || []).length > 3 && (book.rozdily || []).some(n => n.dity);
  let html = '';
  if(jump){
    html += '<nav class="module-jump gram-jump" aria-label="Зміст книжки">' + book.rozdily.map((n, i) => {
      const sub = knWalk({rozdily: [n]}).filter(x => knHasPage(x.node));
      const r = sub.filter(x => knIsReady(x.node)).length;
      return '<a class="jump-chip' + (r ? '' : ' is-empty') + '" style="--module-color:' + KN_COLORS[i % KN_COLORS.length] + '" href="#kn-' + knEsc(n.id) + '">'
        + '<b>' + knEsc(knNodeTag(book, n, 0) || n.nazva) + '</b><span class="n">' + r + '/' + sub.length + '</span></a>';
    }).join('') + '</nav>';
  }
  const top = book.rozdily || [];
  const grouped = top.some(n => n.dity);
  if(grouped){
    top.forEach((n, i) => {
      const sub = knWalk({rozdily: [n]}).filter(x => knHasPage(x.node));
      const r = sub.filter(x => knIsReady(x.node)).length;
      html += '<section class="gram-part kn-part" id="kn-' + knEsc(n.id) + '" style="--module-color:' + KN_COLORS[i % KN_COLORS.length] + '">'
        + '<div class="gram-part-head"><h2>' + (knNodeTag(book, n, 0) ? '<span class="kn-part-tag">' + knEsc(knNodeTag(book, n, 0)) + '</span> ' : '') + knEsc(n.nazva) + '</h2>'
        + '<span class="mod-count">' + (n.storinky ? knEsc(knPages_s(n.storinky)) + ' · ' : '') + (r ? r + ' з ' + sub.length + ' готові' : 'готується') + '</span></div>'
        + '<ul class="gram-toc">' + (n.typ ? row(n, 0) : '') + items(n.dity, 1) + '</ul></section>';
    });
  } else {
    html += '<section class="gram-part kn-part" style="--module-color:' + KN_COLORS[0] + '"><ul class="gram-toc">' + items(top, 0) + '</ul></section>';
  }
  toc.innerHTML = html;
  toc.querySelectorAll('.jump-chip').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior: 'smooth', block: 'start'}); }
  }));
}

/* Аудіо видавця: лише посилання на сторінку видавця (НЕ файл у плеєрі).
   Пріоритет — посилання саме на розділ (n.audio), інакше на книжку.
   Власне аудіо (наші тексти, синтез мовлення) — звичайний плеєр у самій
   сторінці розділу, див. rozdil-template.html. */
function knRenderAudio(box, book, n){
  if(!box) return;
  const a = (n && n.audio && n.audio.url) ? n.audio : (book && book.audio && book.audio.url ? book.audio : null);
  const card = box.closest('.kn-audio-card') || box;
  if(!a){ card.hidden = true; return; }
  const own = !!(n && n.audio && n.audio.url);
  box.innerHTML = '<span class="kn-audio-ico" aria-hidden="true">🎧</span><span>'
    + (own ? 'Аудіо видавця до цього розділу' : 'Аудіо до підручника')
    + (n && n.audio && n.audio.treky ? ' (треки ' + knEsc(n.audio.treky) + ')' : '')
    + ' — на сайті ' + (book && book.vydavnytstvo ? 'видавництва «' + knEsc(book.vydavnytstvo) + '»' : 'видавця') + ': '
    + '<a href="' + knEsc(a.url) + '" target="_blank" rel="noopener">' + knEsc(a.url.replace(/^https?:\/\//, '')) + ' ↗</a></span>';
  card.hidden = false;
}

/* ---------- 3. Сторінка розділу: pidruchnyky/<книга>/<розділ>.html ----------
   Останній рядок скрипту сторінки:  initBookUnit(KN_BOOK, KN_UNIT);
   - хлібні крихти Головна › Підручники › книжка › Lektion › розділ;
   - бейджі в hero (#knMeta): книжка, сторінки, тип, кількість слів;
   - посилання на аудіо видавця (#knAudio) і примітка (#knDisclaimer);
   - вкладка Wörter (#matWords): слова з data/slova/<книга>.js — список,
     ★ «мої слова», картки. Малює material-reader.js (renderWords) — тому
     слова кладуться в прихований блок .gl, як у статтях. Слів немає —
     вкладка Wörter ховається сама;
   - для typ "povtorennya" — слова всіх розділів того самого батька
     (Lektion), або явний список n.zbyraty: ["l1-a", "l1-b"];
   - якщо на сторінці є власний текст #matText (typ "chytannya") —
     переклад по тапу, A− A+ і «📄 Text» на вкладках з вправами, як у статтях;
   - граматика (#knGram, з n.gram) — лише готові теми; немає — картка ховається;
   - «Далі / Назад» (#knNext) — сусідні ГОТОВІ розділи книжки;
   - прогрес: trackProgress('kn:<книга>/<розділ>'). */
function knUnitWords(book, entry){
  const all = (typeof window !== 'undefined' && window.SLOVA && window.SLOVA[book.id]) || [];
  const n = entry.node;
  let ids = [n.id];
  if(n.zbyraty) ids = [].concat(n.zbyraty);
  else if(n.typ === 'povtorennya'){
    const parent = entry.path[entry.path.length - 1];
    const sibs = parent ? parent.dity : book.rozdily;
    ids = knWalk({rozdily: sibs}).map(x => x.node.id);
  }
  const set = new Set(ids);
  return all.filter(w => w && set.has(w.r));
}
function knInjectWords(words){
  // material-reader.js бере слова зі span.gl у #matText — кладемо їх туди прихованими
  let host = document.getElementById('matText');
  const wrap = document.createElement('div');
  wrap.hidden = true;
  wrap.className = 'kn-words-src';
  wrap.innerHTML = words.map(w => '<span class="gl" data-uk="' + knEsc(w.uk) + '" data-lemma="' + knEsc(w.de) + '"'
    + (w.note ? ' data-note="' + knEsc(w.note) + '"' : '') + '>' + knEsc(w.de) + '</span>').join(' ');
  if(host) host.appendChild(wrap);
  else {
    host = document.createElement('div');
    host.id = 'matText';
    host.hidden = true;
    host.setAttribute('data-kn-words', '');
    host.appendChild(wrap);
    document.body.appendChild(host);
  }
}
function initBookUnit(bookId, unitId, opts){
  opts = opts || {};
  const root = opts.root || '../../';
  const book = knBook(bookId);
  const entry = book ? knWalk(book).find(x => x.node.id === unitId) : null;
  const n = entry ? entry.node : null;
  const realText = document.querySelector('#matText:not([data-kn-words])');

  if(typeof renderCrumbs === 'function'){
    const steps = [{label: 'Головна', href: root + 'index.html'}, {label: 'Підручники', href: root + 'pidruchnyky/index.html'}];
    if(book){
      steps.push({label: book.nazvaKorotko || book.nazva, href: 'index.html'});
      entry.path.forEach((p, i) => steps.push({label: knNodeTag(book, p, i) || p.nazva, href: 'index.html#kn-' + p.id}));
      steps.push({label: [knNodeTag(book, n, entry.path.length), n.nazva].filter(Boolean).join(' · ')});
    } else steps.push({label: (document.querySelector('.hero h1') || {}).textContent || unitId});
    renderCrumbs('crumbs', steps);
  }

  const words = (book && entry) ? knUnitWords(book, entry) : [];
  const meta = document.getElementById('knMeta');
  if(meta && book && n){
    const bits = ['<a class="kn-chip kn-chip-book" href="index.html">' + knEsc(book.nazvaKorotko || book.nazva) + '</a>'];
    if(n.storinky) bits.push('<span class="kn-chip">' + knEsc(knPages_s(n.storinky)) + '</span>');
    if(n.typ && n.typ !== 'vpravy' && KN_TYP[n.typ]) bits.push('<span class="kn-chip">' + KN_TYP[n.typ].icon + ' ' + KN_TYP[n.typ].uk + '</span>');
    if(words.length) bits.push('<span class="kn-chip">' + words.length + ' ' + knPlural(words.length, 'слово', 'слова', 'слів') + '</span>');
    meta.innerHTML = bits.join('');
  }
  knRenderAudio(document.getElementById('knAudio'), book, n);
  const disc = document.getElementById('knDisclaimer');
  if(disc) disc.innerHTML = knDisclaimer(book);

  // граматика з «Граматики» сайту (лише готові теми)
  const gram = document.getElementById('knGram');
  if(gram){
    const list = (n && n.gram && typeof GRAMMAR !== 'undefined') ? [].concat(n.gram).map(id => GRAMMAR.find(t => t.id === id)).filter(t => t && t.opublikovano > 0) : [];
    const card = gram.closest('.card') || gram;
    if(list.length){
      gram.innerHTML = list.map(t => '<a class="gram-link" href="' + root + 'gramatyka/temy/' + knEsc(t.id) + '.html">'
        + '<span class="k">Grammatik</span>' + knEsc(t.tema) + (t.uk ? ' — ' + knEsc(t.uk) : '') + '</a>').join('');
    } else card.style.display = 'none';
  }

  // Далі / Назад — лише готові розділи
  const nav = document.getElementById('knNext');
  if(nav && book){
    const ready = knWalk(book).filter(x => knIsReady(x.node));
    const i = ready.findIndex(x => x.node.id === unitId);
    const link = (x, dir) => x ? '<a class="kn-nav-' + dir + '" href="' + knEsc(x.node.id) + '.html"><span class="k">' + (dir === 'next' ? 'Далі →' : '← Назад') + '</span>'
      + knEsc([knNodeTag(book, x.node, x.path.length), x.node.nazva].filter(Boolean).join(' · ')) + '</a>' : '';
    const prev = i > 0 ? ready[i - 1] : null, next = (i >= 0 && i < ready.length - 1) ? ready[i + 1] : null;
    nav.innerHTML = link(prev, 'prev') + link(next, 'next') + '<a class="kn-nav-all" href="index.html">Зміст книжки</a>';
  }

  // Wörter: material-reader.js (список, ★, картки)
  // (у тексті розділу "chytannya" слова можуть бути й самі по собі — span.gl)
  const reader = typeof renderWords === 'function';
  if(reader){ mat.id = 'kn:' + bookId + '/' + unitId; loadStars(); }
  const hasWords = reader && (words.length || (realText && realText.querySelector('.gl')));
  if(hasWords){
    if(words.length) knInjectWords(words);
    renderWords();
  } else {
    const btn = document.querySelector('.tab-btn[data-tab="woerter"]');
    const panel = document.getElementById('panel-woerter');
    if(btn) btn.remove();
    if(panel){
      const wasActive = panel.classList.contains('active');
      panel.remove();
      const first = document.querySelector('.tab-btn');
      if(wasActive && first && typeof showTab === 'function') showTab(first.dataset.tab);
    }
  }
  if(reader && realText){ initGlosses(); buildTools(); buildDrawer(); }

  if(typeof trackProgress === 'function') trackProgress('kn:' + bookId + '/' + unitId);
}
