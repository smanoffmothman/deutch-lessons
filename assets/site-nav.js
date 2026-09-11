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
   ================================================================= */

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
    '<a class="nav-link' + (l.key === active ? ' active' : '') + '" href="' + l.href + '">' + l.label + '</a>'
  ).join('');

  const el = document.getElementById(containerId);
  if(!el) return;
  el.outerHTML = '<nav class="site-nav">'
    + '<a class="brand" href="' + root + 'index.html">Deutsch mit uns</a>'
    + '<a class="nav-link' + (active === null ? ' active' : '') + '" href="' + root + 'index.html">Головна</a>'
    + linksHtml
    + '</nav>';
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
