# build-grammar-preview.py — збирає ПРЕВʼЮ сторінки граматичної теми
# (один самодостатній HTML для перевірки прямо в чаті, без сайту).
# Інструмент проєкту граматики (не частина сайту).
#
#   python3 tools/build-grammar-preview.py <тема.html> <корінь клону сайту> [grammar-data.js]
#
# Запускати з кореня свіжого клону репозиторію, напр.:
#   python3 tools/build-grammar-preview.py gramatyka/temy/<id>.html .
# Спільні файли беруться з <корінь>/assets/, дані — з <корінь>/data/grammar-data.js
# (або з файлу, переданого третім аргументом). Якщо в клоні grammar-data.js
# уже оновлено (з opublikovano для цієї теми), третій аргумент не потрібен —
# крихти й "Де це ще трапляється" будуть як на сайті.
# Результат: <тема>-preview.html поруч із файлом теми (у репозиторій НЕ
# комітити — він у .gitignore).
#
# Що робить: замінює підключення ../../assets/* і ../../data/* вмістом файлів
# (CSS у <style>, JS у <script>); lessons-data.js — заглушка з порожнім
# LESSONS (у превʼю уроків немає). Текст "</script" усередині вбудованого
# коду екранується, інакше коментарі в site.js / site-nav.js обірвали б
# скрипт. Якщо якесь підключення не вбудовано — зупиняється з помилкою.
import sys, re, os
page, K = sys.argv[1], sys.argv[2]
data = sys.argv[3] if len(sys.argv) > 3 else os.path.join(K, 'data', 'grammar-data.js')
html = open(page, encoding='utf-8').read()
def rd(p): return open(p, encoding='utf-8').read()
def js(code): return '<script>\n' + code.replace('</script', '<\\/script') + '\n</script>'
def css(code): return '<style>\n' + code.replace('</style', '<\\/style') + '\n</style>'
files = {
  'assets/lesson-style.css': lambda: css(rd(os.path.join(K, 'assets', 'lesson-style.css'))),
  'assets/site.css':         lambda: css(rd(os.path.join(K, 'assets', 'site.css'))),
  'assets/site-nav.js':      lambda: js(rd(os.path.join(K, 'assets', 'site-nav.js'))),
  'assets/lesson-interactions.js': lambda: js(rd(os.path.join(K, 'assets', 'lesson-interactions.js'))),
  'assets/site.js':          lambda: js(rd(os.path.join(K, 'assets', 'site.js'))),
  'data/grammar-data.js':    lambda: js(rd(data)),
  'data/lessons-data.js':    lambda: js('const LESSONS = []; // превʼю: уроків тут немає'),
}
n = 0
for rel, make in files.items():
    pat = re.compile(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./' + re.escape(rel) + r'"[^>]*>(?:</script>)?')
    html, k = pat.subn(lambda m: make(), html); n += k
left = re.findall(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./[^"]+"', html)
if left: sys.exit('Не вбудовано: ' + ', '.join(left))
banner = ('<div style="background:#B14E3E;color:#fff;font:600 13px sans-serif;padding:8px 16px;text-align:center">'
          'ПРЕВʼЮ для перевірки — не для сайту. Посилання в меню тут не працюють.</div>')
html = html.replace('<body>', '<body>\n' + banner, 1)
out = page[:-5] + '-preview.html'
open(out, 'w', encoding='utf-8').write(html)
print('OK:', out, '| вбудовано файлів:', n)
