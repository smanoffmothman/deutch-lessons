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
     // active: 'klasy' | 'glosariy' | 'gramatyka' | 'materialy' | null
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
   ================================================================= */

var NAV_MENU_CSS = `
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

  const links = [
    {key: 'klasy',     label: 'Уроки',     href: root + 'klasy/index.html'},
    {key: 'glosariy',  label: 'Глосарій',  href: root + 'glosariy/index.html'},
    {key: 'gramatyka', label: 'Граматика', href: root + 'gramatyka/index.html'},
    {key: 'materialy', label: 'Матеріали', href: root + 'materialy/index.html'}
  ];

  const linksHtml = links.map(l =>
    '<a class="nav-link' + (l.key === active ? ' active' : '') + '" href="' + l.href + '"'
    + (l.key === active ? ' aria-current="page"' : '') + '>' + l.label + '</a>'
  ).join('');

  const el = document.getElementById(containerId);
  if(!el) return;
  injectNavMenuCss();

  const menuId = containerId + 'Menu';
  el.outerHTML = '<nav class="site-nav" id="' + containerId + '" aria-label="Розділи сайту">'
    + '<a class="brand" href="' + root + 'index.html">DeutschHeft</a>'
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
