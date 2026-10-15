#!/usr/bin/env python3
"""Вписує в уроки, теми граматики й статті блок пошукових тегів.

Запускається GitHub Action'ом (.github/workflows/sitemap.yml) після кожного
push у main, ПЕРЕД збиранням sitemap.xml. Вручну нічого робити не треба.

У кожну сторінку lessons/klas-*/…, gramatyka/temy/<id>.html і
materialy/statti/<id>.html (крім *-template.html / *-preview.html) перед
</head> ставиться блок між маркерами <!-- seo: … --> і <!-- /seo -->:
опис для пошуку, canonical і картка посилання (Open Graph). Дані беруться з
data/lessons-data.js, data/grammar-data.js, data/materials-data.js — тому
досить заповнити opys у data-файлі, у сторінці нічого писати не треба.
Блок щоразу переписується повністю; вміст поза маркерами не змінюється.
Сторінки оболонки (index.html розділів) робот не чіпає — там теги вручну.
"""
import json, os, re, subprocess, sys
from html import escape

BASE = 'https://deutschheft.com.ua/'
OG_DEFAULT = BASE + 'og-image.png'
START = '<!-- seo: цей блок оновлює робот (.github/scripts/build_seo.py) з data/*.js — вручну не редагувати -->'
END = '<!-- /seo -->'
BLOCK_RE = re.compile(r'[ \t]*<!-- seo:.*?<!-- /seo -->\n?', re.S)

NODE = r'''
const fs = require('fs'), vm = require('vm');
const out = {};
for (const [f, name] of [['lessons-data', 'LESSONS'], ['grammar-data', 'GRAMMAR'], ['materials-data', 'MATERIALS']]) {
  try {
    const c = {}; vm.createContext(c);
    vm.runInContext(fs.readFileSync('data/' + f + '.js', 'utf8') + '\n;this.__x = ' + name + ';', c);
    out[name] = c.__x;
  } catch (e) { out[name] = []; console.error('data/' + f + '.js: ' + e.message); }
}
process.stdout.write(JSON.stringify(out));
'''

def load_data():
    r = subprocess.run(['node', '-e', NODE], capture_output=True, text=True)
    if r.stderr:
        sys.stderr.write(r.stderr)
    return json.loads(r.stdout)

def clip(s, n=200):
    s = ' '.join((s or '').split())
    return s if len(s) <= n else s[:n - 1].rstrip(' ,.;:—-') + '…'

def page_title(html):
    m = re.search(r'<title>(.*?)</title>', html, re.S)
    return ' '.join(m.group(1).split()) if m else 'DeutschHeft'

def first_image(html):
    m = re.search(r'<article\b.*?<img\b[^>]*\bsrc="(https://[^"]+)"', html, re.S) \
        or re.search(r'<img\b[^>]*\bsrc="(https://[^"]+)"', html)
    return m.group(1) if m else None

def block(url, title, desc, og_type, image, has_own_desc):
    a = lambda s: escape(s, quote=True)
    lines = [START]
    if desc and not has_own_desc:
        lines.append('<meta name="description" content="%s">' % a(desc))
    lines += [
        '<link rel="canonical" href="%s">' % a(url),
        '<meta property="og:type" content="%s">' % og_type,
        '<meta property="og:site_name" content="DeutschHeft">',
        '<meta property="og:locale" content="uk_UA">',
        '<meta property="og:title" content="%s">' % a(title),
    ]
    if desc:
        lines.append('<meta property="og:description" content="%s">' % a(desc))
    lines += [
        '<meta property="og:url" content="%s">' % a(url),
        '<meta property="og:image" content="%s">' % a(image or OG_DEFAULT),
    ]
    if not image:
        lines += ['<meta property="og:image:width" content="1200">',
                  '<meta property="og:image:height" content="630">']
    lines += ['<meta name="twitter:card" content="summary_large_image">', END]
    return '\n'.join(lines) + '\n'

def main():
    d = load_data()
    info = {}
    for l in d.get('LESSONS', []):
        if l.get('file'):
            info['lessons/' + l['file']] = ('article', clip(l.get('opys')))
    for g in d.get('GRAMMAR', []):
        uk, tema = g.get('uk', ''), g.get('tema', '')
        desc = (uk + (' (' + tema + ')' if tema else '') +
                ': пояснення українською з таблицями й прикладами та вправи з перевіркою.') if uk else ''
        info['gramatyka/temy/' + g['id'] + '.html'] = ('article', clip(desc))
    for m in d.get('MATERIALS', []):
        if m.get('typ') == 'stattya' and m.get('file'):
            desc = clip(m.get('opys')) + (' Рівень ' + m['riven'] + '.' if m.get('riven') else '')
            info['materialy/' + m['file']] = ('article', desc.strip())

    roots = [('lessons', True), ('gramatyka/temy', False), ('materialy/statti', False)]
    changed = total = 0
    for root, recursive in roots:
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            if not recursive:
                dirnames[:] = []
            for name in sorted(filenames):
                if not name.endswith('.html') or name.endswith('-template.html') or name.endswith('-preview.html'):
                    continue
                rel = os.path.join(dirpath, name).replace(os.sep, '/')
                if rel.startswith('lessons/') and rel.count('/') < 2:
                    continue  # у корені lessons/ лише шаблон
                with open(rel, encoding='utf-8') as f:
                    html = f.read()
                if '</head>' not in html:
                    continue
                total += 1
                og_type, desc = info.get(rel, ('article', ''))
                bare = BLOCK_RE.sub('', html)
                has_own = re.search(r'<meta\s+name="description"', bare) is not None
                image = first_image(bare) if rel.startswith('materialy/') else None
                new = bare.replace('</head>', block(BASE + rel, page_title(bare), desc, og_type, image, has_own) + '</head>', 1)
                if new != html:
                    with open(rel, 'w', encoding='utf-8') as f:
                        f.write(new)
                    changed += 1
    print('seo: %d сторінок, оновлено %d' % (total, changed))

main()
