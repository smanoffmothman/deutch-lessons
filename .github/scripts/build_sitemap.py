#!/usr/bin/env python3
"""Збирає sitemap.xml з усіх HTML-сторінок репозиторію.

Запускається GitHub Action'ом (.github/workflows/sitemap.yml) після
кожного push у main — вручну нічого робити не треба. Нова сторінка (урок,
тема, стаття) потрапляє в карту сама, щойно її файл з'являється на GitHub.

Не потрапляють: шаблони (*-template.html), превʼю (*-preview.html) і все,
що в прихованих папках. Дата lastmod — дата останнього коміту файлу.
"""
import os, subprocess
from xml.sax.saxutils import escape

BASE = 'https://deutschheft.com.ua/'

def lastmod(path):
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', path],
                             capture_output=True, text=True, check=True).stdout.strip()
        return out or None
    except Exception:
        return None

pages = []
for dirpath, dirnames, filenames in os.walk('.'):
    dirnames[:] = sorted(d for d in dirnames if not d.startswith('.'))
    for name in sorted(filenames):
        if not name.endswith('.html'):
            continue
        if name.endswith('-template.html') or name.endswith('-preview.html'):
            continue
        rel = os.path.relpath(os.path.join(dirpath, name), '.').replace(os.sep, '/')
        url = BASE if rel == 'index.html' else BASE + rel
        pages.append((url, lastmod(rel)))

pages.sort(key=lambda p: (p[0] != BASE, p[0]))
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for url, mod in pages:
    lines.append('  <url><loc>' + escape(url) + '</loc>'
                 + ('<lastmod>' + mod + '</lastmod>' if mod else '') + '</url>')
lines.append('</urlset>')
with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print(len(pages), 'pages')
