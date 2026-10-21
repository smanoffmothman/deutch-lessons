/* =================================================================
   home.js — жива частина ГОЛОВНОЇ сторінки (index.html):
   лічильники в hero, «Слово дня» і блок «Нове на сайті».

   Нічого тут вручну не оновлюється: усе береться з тих самих
   data-файлів, що й решта сайту, за тими самими правилами:
     • новий урок = ОСТАННІЙ у LESSONS для свого класу;
     • нова тема граматики = найбільший opublikovano;
     • нова стаття = ОСТАННІЙ запис typ:"stattya" у MATERIALS.
   Якщо якийсь data-файл не завантажився — відповідний блок просто
   не показується, плитки розділів працюють і без JS.

   Підключення (index.html, перед </body>):
   <script src="data/lessons-data.js"></script>
   <script src="data/modules-data.js"></script>
   <script src="data/glossary-data.js"></script>
   <script src="data/grammar-data.js"></script>
   <script src="data/materials-data.js"></script>
   <script src="data/pidruchnyky-data.js"></script>
   <script src="assets/home.js"></script>

   Плитка «Підручники» (з 2026-10-22) прихована, доки в PIDRUCHNYKY немає
   жодного розділу з opublikovano; лічильник на ній — кількість таких
   розділів. У лічильники hero підручники НЕ входять (hero — про уроки
   для класів).
   ================================================================= */

(function(){
  // data-файли оголошують const-змінні — typeof безпечний, навіть якщо файл не завантажився
  const lessons   = typeof LESSONS       !== 'undefined' ? LESSONS       : [];
  const themes    = typeof MODULE_THEMES !== 'undefined' ? MODULE_THEMES : {};
  const glossary  = typeof GLOSSARY      !== 'undefined' ? GLOSSARY      : [];
  const grammar   = typeof GRAMMAR       !== 'undefined' ? GRAMMAR       : [];
  const materials = typeof MATERIALS     !== 'undefined' ? MATERIALS     : [];
  const books     = typeof PIDRUCHNYKY   !== 'undefined' ? PIDRUCHNYKY   : [];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // 1 урок / 2 уроки / 5 уроків
  function plural(n, one, few, many){
    const m10 = n % 10, m100 = n % 100;
    if(m10 === 1 && m100 !== 11) return one;
    if(m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  const gramReady = grammar.filter(t => t && t.opublikovano > 0);
  const articles  = materials.filter(m => m && m.typ === 'stattya');

  /* ---------- Лічильники (hero + плитки) ---------- */
  const counts = {
    klasy:     lessons.length   ? [lessons.length,   plural(lessons.length, 'урок', 'уроки', 'уроків')] : null,
    glosariy:  glossary.length  ? [glossary.length,  plural(glossary.length, 'слово', 'слова', 'слів')] : null,
    gramatyka: gramReady.length ? [gramReady.length, plural(gramReady.length, 'тема', 'теми', 'тем') + ' граматики', plural(gramReady.length, 'тема', 'теми', 'тем')] : null,
    materialy: articles.length  ? [articles.length,  plural(articles.length, 'стаття', 'статті', 'статей')] : null
  };

  // розділи підручників з онлайн-вправами (будь-яка глибина дерева)
  let bookUnits = 0;
  (function walk(nodes){ (nodes || []).forEach(n => {
    if(n && n.typ && n.typ !== 'bez-storinky' && n.opublikovano > 0) bookUnits++;
    if(n && n.dity) walk(n.dity);
  }); })(books.reduce((a, b) => a.concat(b.rozdily || []), []));
  const booksTile = document.querySelector('.home-tile.t-books');
  if(booksTile && bookUnits){
    booksTile.hidden = false;
    const c = booksTile.querySelector('[data-count="pidruchnyky"]');
    if(c){ c.textContent = books.length + ' ' + plural(books.length, 'книжка', 'книжки', 'книжок') + ' · ' + bookUnits + ' ' + plural(bookUnits, 'розділ', 'розділи', 'розділів'); c.hidden = false; }
  }

  const statsEl = document.getElementById('homeStats');
  if(statsEl){
    const html = Object.keys(counts).filter(k => counts[k]).map(k =>
      '<a class="hs-item" href="' + k + '/index.html"><b>' + counts[k][0] + '</b><span>' + esc(counts[k][1]) + '</span></a>'
    ).join('');
    if(html){ statsEl.innerHTML = html; statsEl.hidden = false; }
  }
  document.querySelectorAll('[data-count]').forEach(el => {
    const c = counts[el.dataset.count];
    if(c){ el.textContent = c[0] + ' ' + (c[2] || c[1]); el.hidden = false; } // на плитці — короткий підпис
  });

  /* ---------- Слово дня ---------- */
  // Одне й те саме слово для всіх протягом дня (за датою), «Ще слово» — випадкове.
  const wordEl = document.getElementById('wordCard');
  if(wordEl && glossary.length){
    const now = new Date();
    const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 864e5);
    let idx = (day * 7919) % glossary.length; // крок-просте число: сусідні дні — слова з різних уроків

    const artClass = {der: 'art-der', die: 'art-die', das: 'art-das'};
    function showWord(i){
      const w = glossary[i];
      const raw = String(w.de || '');
      const p = raw.indexOf(' (');
      const main = p > 0 ? raw.slice(0, p) : raw;
      const extra = p > 0 ? raw.slice(p + 1) : '';
      const m = main.match(/^(der|die|das)\s+(.*)$/);
      const deHtml = m
        ? '<span class="art ' + artClass[m[1]] + '">' + m[1] + '</span> ' + esc(m[2])
        : esc(main);
      const mod = themes[w.klas] && themes[w.klas][w.modul] ? ' · ' + themes[w.klas][w.modul] : '';
      wordEl.querySelector('.wc-de').innerHTML = deHtml + (extra ? ' <small>' + esc(extra) + '</small>' : '');
      wordEl.querySelector('.wc-uk').textContent = w.uk || '';
      wordEl.querySelector('.wc-meta').textContent = 'Клас ' + w.klas + ', модуль ' + w.modul + mod;
      wordEl.classList.remove('is-open');
      wordEl.querySelector('.wc-reveal').setAttribute('aria-expanded', 'false');
    }
    wordEl.querySelector('.wc-reveal').addEventListener('click', e => {
      const open = wordEl.classList.toggle('is-open');
      e.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    wordEl.querySelector('.wc-next').addEventListener('click', () => {
      let n = idx;
      if(glossary.length > 1) while(n === idx) n = Math.floor(Math.random() * glossary.length);
      idx = n; showWord(idx);
    });
    showWord(idx);
    wordEl.hidden = false;

    // На телефоні картка стоїть ПІСЛЯ плиток розділів (інакше розділи йдуть за екран),
    // на широкому — праворуч у hero.
    const slot = document.getElementById('wordSlot');
    const heroHome = wordEl.parentNode;
    const narrow = window.matchMedia('(max-width:880px)');
    const place = () => {
      if(!slot) return;
      if(narrow.matches){ if(wordEl.parentNode !== slot) slot.appendChild(wordEl); }
      else if(wordEl.parentNode !== heroHome) heroHome.appendChild(wordEl);
    };
    place();
    if(narrow.addEventListener) narrow.addEventListener('change', place);
    else if(narrow.addListener) narrow.addListener(place);
  }

  /* ---------- Нове на сайті ---------- */
  const newsEl = document.getElementById('homeNews');
  if(!newsEl) return;
  const cols = [];
  const stamp = '<span class="new-badge">нове</span>';

  // Уроки: найновіший у кожному класі (останній у LESSONS для класу)
  if(lessons.length){
    const newest = {};
    lessons.forEach(l => { newest[l.klas] = l; });
    const rows = Object.keys(newest).sort().map(k => {
      const l = newest[k];
      const tema = themes[l.klas] && themes[l.klas][l.modul] ? themes[l.klas][l.modul] : '';
      return '<a class="hn-row" href="lessons/' + esc(l.file) + '">'
        + '<span class="hn-klas">' + esc(l.klas) + '<i>клас</i></span>'
        + '<span class="hn-txt"><b>' + esc(l.nazva) + '</b>'
        + '<small>Модуль ' + esc(l.modul) + (tema ? ' · ' + esc(tema) : '') + ' · Урок ' + esc(l.lektion) + '</small></span>'
        + '</a>';
    }).join('');
    cols.push({cls: 'hn-lessons', title: 'Уроки', sub: 'останній урок у кожному класі', rows, more: ['klasy/index.html', 'Усі уроки']});
  }

  // Граматика: 3 останні опубліковані теми
  if(gramReady.length){
    const top = gramReady.slice().sort((a, b) => b.opublikovano - a.opublikovano).slice(0, 3);
    const rows = top.map((t, i) =>
      '<a class="hn-row" href="gramatyka/temy/' + esc(t.id) + '.html">'
      + '<span class="hn-txt"><b lang="de">' + esc(t.tema) + '</b><small>' + esc(t.uk || '') + '</small></span>'
      + (i === 0 ? stamp : '')
      + '</a>'
    ).join('');
    cols.push({cls: 'hn-gram', title: 'Граматика', sub: 'нові теми', rows, more: ['gramatyka/index.html', 'Усі теми']});
  }

  // Статті: 3 останні
  if(articles.length){
    const top = articles.slice(-3).reverse();
    const rows = top.map((m, i) => {
      const flags = (m.krayina || []).map(c => '<span class="flag flag-' + esc(c) + '"></span>').join('');
      const href = 'materialy/' + (m.file || ('statti/' + m.id + '.html'));
      return '<a class="hn-row" href="' + esc(href) + '">'
        + '<span class="hn-txt"><b lang="de">' + esc(m.nazva) + '</b>'
        + '<small>' + (m.riven ? '<span class="lvl-badge">' + esc(m.riven) + '</span>' : '') + flags + '</small></span>'
        + (i === 0 ? stamp : '')
        + '</a>';
    }).join('');
    cols.push({cls: 'hn-mat', title: 'Матеріали', sub: 'нові статті', rows, more: ['materialy/index.html', 'Усі статті']});
  }

  if(!cols.length) return;
  newsEl.querySelector('.hn-grid').innerHTML = cols.map(c =>
    '<section class="hn-col ' + c.cls + '">'
    + '<header><h3>' + c.title + '</h3><span>' + c.sub + '</span></header>'
    + '<div class="hn-list">' + c.rows + '</div>'
    + '<a class="hn-more" href="' + c.more[0] + '">' + c.more[1] + ' →</a>'
    + '</section>'
  ).join('');
  newsEl.hidden = false;
})();
