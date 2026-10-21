/* =================================================================
   site-nav.js — спільний хедер і хлібні крихти для УСІХ сторінок,
   включно з уроками. Змінюєш навігацію тут ОДИН раз — підхоплюється
   всюди, бо кожна сторінка лише викликає функцію, а не тримає свою
   копію HTML.

   Підключення (у <head> або перед </body>, не важливо):
   <div id="siteNav"></div>
   <script src="ШЛЯХ/assets/site-nav.js"></script>
   <script>
     renderSiteNav('siteNav', { root: '../../../', active: null });
     // active: 'klasy' | 'glosariy' | 'gramatyka' | 'materialy' | 'pidruchnyky' | null
     // root: відносний шлях НАЗАД до кореня сайту (де лежить index.html)
   </script>

   Хлібні крихти (опційно, переважно для сторінок уроків):
   <div id="crumbs"></div>
   <script>
     renderCrumbs('crumbs', [
       {label: 'Головна', href: root + 'index.html'},
       {label: 'Уроки',   href: root + 'klasy/index.html'},
       {label: 'Клас 7'}, // без href — просто текстовий крок
       {label: 'Урок 1: Familienferien'} // останній — без href, це поточна сторінка
     ]);
   </script>

   Вузький екран (≤760px, з 2026-10): замість пунктів у два рядки —
   один рядок «DeutschHeft · [☰ Меню]», пункти розгортаються
   списком під хедером. Стилі ЦЬОГО меню вбудовані нижче (NAV_MENU_CSS),
   а не в site.css: так правка навігації — завжди один файл, і вона
   працює на будь-якій сторінці, навіть зі старою копією site.css.
   Базовий вигляд хедера (.site-nav, .brand, .nav-link) — як і раніше
   в site.css.

   Статистика відвідувань (з 2026-10-16): лічильник GoatCounter
   підключає renderSiteNav сам (ensureStats нижче) — у сторінки й
   шаблони його НЕ вписувати. Рахує лише на справжньому домені
   deutschheft.com.ua, без шаблонів і превʼю. Деталі — CHANGELOG,
   «Статистика відвідувань: GoatCounter».
   ================================================================= */

var NAV_MENU_CSS = `
.brand-heft{ color:#DE9E3B; }
.site-nav{ position:relative; z-index:40; }
.site-nav .nav-menu{ display:flex; align-items:center; gap:22px; flex-wrap:wrap; }
.site-nav .nav-toggle{ display:none; }
@media (max-width:760px){
  .site-nav{ padding:10px 16px; gap:12px; flex-wrap:nowrap; }
  .site-nav .brand{ font-size:17px; white-space:nowrap; }
  .site-nav .nav-toggle{
    display:inline-flex; align-items:center; gap:7px; flex:none;
    font:700 14px var(--sans, sans-serif); color:#F5EFDE; cursor:pointer;
    background:rgba(245,239,222,.10); border:1px solid rgba(245,239,222,.28);
    border-radius:9px; padding:7px 12px;
  }
  .site-nav .nav-toggle:hover{ background:rgba(245,239,222,.18); }
  .site-nav .nav-toggle:focus-visible{ outline:2px solid var(--mustard, #DE9E3B); outline-offset:2px; }
  .site-nav .nav-toggle svg{ width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; }
  .site-nav .nav-toggle .x{ display:none; }
  .site-nav.is-open .nav-toggle .bars{ display:none; }
  .site-nav.is-open .nav-toggle .x{ display:inline; }

  .site-nav .nav-menu{
    display:none; position:absolute; left:0; right:0; top:100%;
    flex-direction:column; align-items:stretch; gap:0;
    background:var(--teal-deep, #123E3A);
    border-top:1px solid rgba(245,239,222,.15);
    padding:6px 0 10px;
    border-radius:0 0 16px 16px; border-bottom:2px solid var(--mustard, #DE9E3B);
    box-shadow:0 14px 26px rgba(0,0,0,.25);
  }
  .site-nav.is-open .nav-menu{ display:flex; }
  .site-nav .nav-menu a.nav-link{
    font-size:16px; padding:13px 20px; border-bottom:none;
    border-left:3px solid transparent;
  }
  .site-nav .nav-menu a.nav-link:hover{ background:rgba(245,239,222,.06); }
  .site-nav .nav-menu a.nav-link.active{ border-left-color:var(--mustard, #DE9E3B); background:rgba(245,239,222,.08); }
}
`;

/* Іконка сайту для сторінок, у яких її немає в <head> (старі уроки, теми,
   статті): додається тут, тож правити самі сторінки не треба. Сторінки
   оболонки мають власні <link rel="icon"> — для них нічого не відбувається.
   Файли favicon.ico / favicon.svg / apple-touch-icon.png лежать у корені. */
function ensureFavicon(root){
  if(document.querySelector('link[rel~="icon"]')) return;
  const head = document.head || document.documentElement;
  [['icon', root + 'favicon.ico', null, 'any'],
   ['icon', root + 'favicon.svg', 'image/svg+xml', null],
   ['apple-touch-icon', root + 'apple-touch-icon.png', null, null]].forEach(a => {
    const l = document.createElement('link');
    l.rel = a[0]; l.href = a[1];
    if(a[2]) l.type = a[2];
    if(a[3]) l.setAttribute('sizes', a[3]);
    head.appendChild(l);
  });
}

/* Статистика відвідувань — GoatCounter (з 2026-10-16), панель:
   https://deutschheft.goatcounter.com
   Без cookies і без персональних даних, тому банер згоди не потрібен.
   Лічильник підключається тут, а не в кожній сторінці: так він працює
   на всіх уроках, темах і статтях (і старих), а шаблони не міняються.
   - Рахує ЛИШЕ на deutschheft.com.ua (і www.): превʼю в чаті, файли,
     відкриті з диска, і github.io не потрапляють у статистику.
   - Шаблони (*-template.html) і превʼю (*-preview.html) не рахуються.
   - Адреса сторінки зводиться до одного вигляду: без «index.html» і без
     «?…» (мітки месенджерів), тож /klasy/ і /klasy/index.html — одна сторінка.
   - Якщо gc.zgo.at заблоковано (шкільна мережа, блокувальник реклами) —
     візит просто не врахується, на сторінці нічого не ламається.
   - Свої візити не рахувати: один раз у кожному своєму браузері відкрити
     https://deutschheft.com.ua/#toggle-goatcounter */
var GOATCOUNTER_URL = 'https://deutschheft.goatcounter.com/count';
function ensureStats(){
  if(window.__dhStats) return;
  window.__dhStats = true;
  if(document.querySelector('script[data-goatcounter]')) return;
  if(!/(^|\.)deutschheft\.com\.ua$/i.test(location.hostname)) return;
  if(/-(template|preview)\.html$/i.test(location.pathname)) return;
  window.goatcounter = window.goatcounter || {};
  if(!window.goatcounter.path){
    window.goatcounter.path = function(p){
      p = String(p || '/').split('?')[0].split('#')[0];
      return p.replace(/(^|\/)index\.html$/i, '$1') || '/';
    };
  }
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', GOATCOUNTER_URL);
  (document.head || document.documentElement).appendChild(s);
}

/* Розділ «Підручники» (з 2026-10-22) у меню: поки false — пункту в меню
   немає, але сторінки pidruchnyky/ відкриваються за прямим посиланням
   (щоб подивитись перед запуском). Перемкнути на true, коли опубліковано
   перші розділи — і пункт з'явиться на всіх сторінках сайту одразу.
   Плитка на головній вмикається сама (home.js), без цього прапорця. */
var NAV_SHOW_PIDRUCHNYKY = false;

function injectNavMenuCss(){
  if(document.getElementById('siteNavMenuCss')) return;
  const st = document.createElement('style');
  st.id = 'siteNavMenuCss';
  st.textContent = NAV_MENU_CSS;
  (document.head || document.documentElement).appendChild(st);
}

function renderSiteNav(containerId, opts){
  opts = opts || {};
  const root = opts.root || '';
  const active = opts.active || null;
  try { ensureStats(); } catch(_) {}

  const links = [
    {key: 'klasy',     label: 'Уроки',     href: root + 'klasy/index.html'},
    {key: 'glosariy',  label: 'Глосарій',  href: root + 'glosariy/index.html'},
    {key: 'gramatyka', label: 'Граматика', href: root + 'gramatyka/index.html'},
    {key: 'materialy', label: 'Матеріали', href: root + 'materialy/index.html'}
  ];
  if(NAV_SHOW_PIDRUCHNYKY || active === 'pidruchnyky')
    links.push({key: 'pidruchnyky', label: 'Підручники', href: root + 'pidruchnyky/index.html'});

  const linksHtml = links.map(l =>
    '<a class="nav-link' + (l.key === active ? ' active' : '') + '" href="' + l.href + '"'
    + (l.key === active ? ' aria-current="page"' : '') + '>' + l.label + '</a>'
  ).join('');

  const el = document.getElementById(containerId);
  if(!el) return;
  injectNavMenuCss();
  ensureFavicon(root);

  const menuId = containerId + 'Menu';
  el.outerHTML = '<nav class="site-nav" id="' + containerId + '" aria-label="Розділи сайту">'
    + '<a class="brand" href="' + root + 'index.html">Deutsch<span class="brand-heft">Heft</span></a>'
    + '<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="' + menuId + '">'
    +   '<svg class="bars" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
    +   '<svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
    +   '<span>Меню</span>'
    + '</button>'
    + '<div class="nav-menu" id="' + menuId + '">'
    +   '<a class="nav-link' + (active === null ? ' active' : '') + '" href="' + root + 'index.html"'
    +   (active === null ? ' aria-current="page"' : '') + '>Головна</a>'
    +   linksHtml
    + '</div>'
    + '</nav>';

  // Меню на вузькому екрані: відкрити/закрити кнопкою, закрити по Esc,
  // кліку поза хедером і при розширенні вікна.
  const nav = document.getElementById(containerId);
  const btn = nav.querySelector('.nav-toggle');
  function setOpen(open){
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && nav.classList.contains('is-open')){ setOpen(false); btn.focus(); }
  });
  document.addEventListener('click', e => {
    if(nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });
  const wide = window.matchMedia('(min-width:761px)');
  const onWide = () => { if(wide.matches) setOpen(false); };
  if(wide.addEventListener) wide.addEventListener('change', onWide);
  else if(wide.addListener) wide.addListener(onWide);
}

function renderCrumbs(containerId, steps){
  const el = document.getElementById(containerId);
  if(!el) return;
  const html = steps.map((s, i) => {
    const isLast = i === steps.length - 1;
    const text = s.href && !isLast
      ? '<a href="' + s.href + '">' + s.label + '</a>'
      : '<span>' + s.label + '</span>';
    return text;
  }).join(' <span aria-hidden="true">›</span> ');
  el.className = 'crumbs';
  el.innerHTML = html;
}
