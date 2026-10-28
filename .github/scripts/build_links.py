#!/usr/bin/env python3
"""Вписує в сторінки-списки статичний перелік посилань (для пошукових систем).

Запускається GitHub Action'ом (.github/workflows/sitemap.yml) після кожного
push у main, разом з build_seo.py і ПЕРЕД збиранням sitemap.xml. Вручну
нічого робити не треба.

Навіщо: каталог уроків, зміст граматики, список статей і зміст книжки
малює JavaScript з data/*.js. У самому HTML цих сторінок посилань на уроки,
теми й статті немає — Google бачить їх лише після виконання JS (пізніше й
рідше) або з sitemap.xml, і ставить такі сторінки в кінець черги. Тут у
контейнер, який і так заповнює JS, вписується звичайний список <a href>.

- З JS (учні, Google після рендерингу) — нічого не змінюється: render-функція
  перезаписує вміст контейнера (innerHTML / appendChild після очищення).
- Без JS або поки скрипти вантажаться — видно простий список посилань.

Блок стоїть між маркерами <!-- links: … --> і <!-- /links --> і щоразу
переписується повністю. Перший раз він вставляється в ПОРОЖНІЙ контейнер
(<div id="…"></div>); якщо контейнер не порожній і маркерів немає — сторінка
пропускається з попередженням (щоб не затерти чужу розмітку).

Посилання ставляться лише на сторінки, які є в даних, опубліковані (для
граматики й підручників — з opublikovano) і реально існують як файл.
"""
import json, os, re, subprocess, sys
from html import escape

START = '<!-- links: цей блок оновлює робот (.github/scripts/build_links.py) з data/*.js — вручну не редагувати; з JS його замінює звичайний вигляд сторінки -->'
END = '<!-- /links -->'
BLOCK_RE = re.compile(r'<!-- links:.*?<!-- /links -->', re.S)

NODE = r'''
const fs = require('fs'), vm = require('vm');
const out = {};
for (const [f, names] of [['lessons-data', ['LESSONS']], ['modules-data', ['MODULE_THEMES']],
    ['grammar-data', ['GRAMMAR_ROZDILY', 'GRAMMAR']], ['materials-data', ['MATERIALS']],
    ['pidruchnyky-data', ['PIDRUCHNYKY']]]) {
  try {
    const c = {}; vm.createContext(c);
    vm.runInContext(fs.readFileSync('data/' + f + '.js', 'utf8') + '\n;this.__x = {' +
      names.map(n => n + ': (typeof ' + n + ' !== "undefined" ? ' + n + ' : null)').join(',') + '};', c);
    Object.assign(out, c.__x);
  } catch (e) { console.error('data/' + f + '.js: ' + e.message); }
}
process.stdout.write(JSON.stringify(out));
'''

e = lambda s: escape(str(s or ''), quote=True)


def load_data():
    r = subprocess.run(['node', '-e', NODE], capture_output=True, text=True)
    if r.stderr:
        sys.stderr.write(r.stderr)
    return json.loads(r.stdout or '{}')


def exists(path):
    return os.path.isfile(path)


def ul(items):
    """items: [(href, text)] → <ul>…</ul>"""
    return '<ul>\n' + ''.join('<li><a href="%s">%s</a></li>\n' % (e(h), t) for h, t in items) + '</ul>\n'


# ---------- klasy/index.html — уроки за класами й модулями ----------
def klasy(d):
    lessons = d.get('LESSONS') or []
    themes = d.get('MODULE_THEMES') or {}
    out = []
    for klas in ['7', '8', '9']:
        ls = [l for l in lessons if str(l.get('klas')) == klas and l.get('file') and exists('lessons/' + l['file'])]
        if not ls:
            continue
        out.append('<h2>%s клас</h2>\n' % klas)
        mods = []
        for l in ls:
            if l.get('modul') not in mods:
                mods.append(l.get('modul'))
        for m in sorted(mods, key=lambda x: str(x)):
            tema = (themes.get(klas) or {}).get(m) or ''
            out.append('<h3>Модуль %s%s</h3>\n' % (e(m), (' · ' + e(tema)) if tema else ''))
            items = []
            for l in ls:
                if l.get('modul') != m:
                    continue
                items.append(('../lessons/' + l['file'],
                              'Урок %s. %s' % (e(l.get('lektion')), e(l.get('nazva')))))
            out.append(ul(items))
    return ''.join(out)


# ---------- gramatyka/index.html — опубліковані теми за розділами ----------
def gramatyka(d):
    rozdily = d.get('GRAMMAR_ROZDILY') or []
    topics = [g for g in (d.get('GRAMMAR') or [])
              if g.get('opublikovano') and exists('gramatyka/temy/%s.html' % g.get('id'))]
    out = []
    seen = set()
    order = [r.get('id') for r in rozdily] + sorted({g.get('rozdil') for g in topics} - {r.get('id') for r in rozdily}, key=str)
    names = {r.get('id'): r.get('nazva') for r in rozdily}
    for rid in order:
        ts = [g for g in topics if g.get('rozdil') == rid and g['id'] not in seen]
        if not ts:
            continue
        out.append('<h2>%s</h2>\n' % e(names.get(rid) or rid))
        items = []
        for g in ts:
            seen.add(g['id'])
            text = e(g.get('tema')) + ((' — ' + e(g.get('uk'))) if g.get('uk') else '')
            items.append(('temy/%s.html' % g['id'], text))
        out.append(ul(items))
    return ''.join(out)


# ---------- materialy/index.html — статті, від нових до старих ----------
def materialy(d):
    items = []
    for m in reversed(d.get('MATERIALS') or []):
        if m.get('typ') != 'stattya' or not m.get('file') or not exists('materialy/' + m['file']):
            continue
        text = e(m.get('nazva')) + ((' (' + e(m.get('riven')) + ')') if m.get('riven') else '')
        items.append((m['file'], text))
    # усередині .materials-grid — на всю ширину, щоб список не стиснувся в одну клітинку
    return '<div style="grid-column:1/-1">\n' + ul(items) + '</div>\n' if items else ''


# ---------- pidruchnyky/index.html — книжки ----------
def book_title(bk):
    return e(bk.get('nazva')) + ((' · ' + e(bk.get('klas'))) if bk.get('klas') else '') + \
        ((' · ' + e(', '.join(bk.get('avtory') or []))) if bk.get('avtory') else '')


def pidruchnyky(d):
    items = [(bk['id'] + '/index.html', book_title(bk)) for bk in (d.get('PIDRUCHNYKY') or [])
             if bk.get('id') and exists('pidruchnyky/%s/index.html' % bk['id'])]
    return ul(items) if items else ''


# ---------- pidruchnyky/<книга>/index.html — опубліковані розділи ----------
def book_hub(bk):
    rivni = bk.get('rivni') or []
    items = []

    def name(path):
        parts = []
        for depth, x in enumerate(path):
            lvl = rivni[depth] if depth < len(rivni) else ''
            lab = ((lvl + ' ') if lvl and x.get('label') else '') + (x.get('label') or '')
            parts.append((lab + ' ' if lab else '') + '«' + (x.get('nazva') or '') + '»')
        return ' · '.join(parts)

    def walk(nodes, path):
        for n in nodes or []:
            if n.get('typ') and n.get('typ') != 'bez-storinky' and n.get('opublikovano') \
                    and exists('pidruchnyky/%s/%s.html' % (bk['id'], n.get('id'))):
                items.append((n['id'] + '.html', e(name(path + [n]))))
            walk(n.get('dity'), path + [n])

    walk(bk.get('rozdily'), [])
    return ul(items) if items else ''


def put(path, cid, inner):
    """Вписати блок у контейнер з id=cid. Повертає True, якщо файл змінився."""
    if not exists(path):
        return False
    with open(path, encoding='utf-8') as f:
        html = f.read()
    blk = START + '\n' + inner + END if inner else ''
    if BLOCK_RE.search(html):
        new = BLOCK_RE.sub(lambda _: blk, html, count=1)
    else:
        if not inner:
            return False
        m = re.search(r'(<(div|main|section|nav)\b[^>]*\bid="%s"[^>]*>)(\s*)(</\2>)' % re.escape(cid), html)
        if not m:
            print('links: %s — контейнер #%s не порожній або не знайдений, пропущено' % (path, cid))
            return False
        new = html[:m.end(1)] + '\n' + blk + '\n' + html[m.start(4):]
    if new != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        return True
    return False


def main():
    d = load_data()
    jobs = [
        ('klasy/index.html', 'catalogContent', klasy(d)),
        ('gramatyka/index.html', 'grammarToc', gramatyka(d)),
        ('materialy/index.html', 'materialsGrid', materialy(d)),
        ('pidruchnyky/index.html', 'knBooks', pidruchnyky(d)),
    ]
    for bk in d.get('PIDRUCHNYKY') or []:
        if bk.get('id'):
            jobs.append(('pidruchnyky/%s/index.html' % bk['id'], 'knToc', book_hub(bk)))
    changed = 0
    for path, cid, inner in jobs:
        n = inner.count('<a href=')
        if put(path, cid, inner):
            changed += 1
        print('links: %s — %d посилань' % (path, n))
    print('links: оновлено файлів: %d' % changed)


main()
