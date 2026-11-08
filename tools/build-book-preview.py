# build-book-preview.py — збирає ПРЕВʼЮ сторінки розділу «Підручники»
# (сторінка модуля/розділу або хаб книжки): один самодостатній HTML для
# перевірки прямо в чаті, без сайту.
#
#   python3 tools/build-book-preview.py <сторінка.html> <корінь клону сайту> [файли даних…]
#
# Запускати з кореня свіжого клону репозиторію, напр.:
#   python3 tools/build-book-preview.py pidruchnyky/<книга>/l1-a.html .
# <корінь клону сайту> — тека, де лежать assets/ і data/ (свіжі версії з GitHub).
# (Тека з «пласкими» назвами файлів і підтекою claude/ теж підходить.)
# [файли даних…] — ОНОВЛЕНІ у цій відповіді файли, які мають перекрити
# версії з теки: pidruchnyky-data.js, слова книжки (<id книжки>.js).
# Розпізнаються за назвою файлу.
# Результат: <сторінка>-preview.html поруч зі сторінкою.
#
# Що робить:
# 1. Замінює підключення ../../assets/* і ../../data/* вмістом файлів (CSS у
#    <style>, JS у <script>). Текст "</script" усередині вбудованого коду
#    екранується. Якщо якесь підключення не вбудовано — зупиняється з
#    помилкою (тоді у сторінці змінено шлях — виправ сторінку, не скрипт).
# 2. Власне аудіо: <audio … src="audio/….mp3"> вбудовується як data:-URI,
#    якщо файл лежить поруч зі сторінкою (тека audio/). Немає файлу —
#    попередження, превʼю все одно збирається.
# 3. Червона смуга «ПРЕВʼЮ» вгорі. Превʼю не комітиться (robots.txt і так
#    закриває *-preview.html) — після перевірки видали його.
import sys, re, os, base64

args = [a for a in sys.argv[1:] if not a.startswith('--')]
if len(args) < 2:
    sys.exit('Використання: build-book-preview.py <сторінка.html> <корінь клону> [файли даних…]')
page, K = args[0], args[1]
overrides = {os.path.basename(p): p for p in args[2:]}
html = open(page, encoding='utf-8').read()
page_dir = os.path.dirname(os.path.abspath(page))

def find(rel):
    """Файл за відносним шляхом сайту: спершу перекриття, потім тека."""
    base = os.path.basename(rel)
    if base in overrides:
        return overrides[base]
    for p in (os.path.join(K, rel), os.path.join(K, base), os.path.join(K, 'claude', base)):
        if os.path.isfile(p):
            return p
    return None

def rd(p): return open(p, encoding='utf-8').read()
def js(code): return '<script>\n' + code.replace('</script', '<\\/script') + '\n</script>'
def css(code): return '<style>\n' + code.replace('</style', '<\\/style') + '\n</style>'

missing = []
def embed(m):
    rel = m.group(1)
    p = find(rel)
    if not p:
        missing.append(rel)
        return m.group(0)
    return css(rd(p)) if rel.endswith('.css') else js(rd(p))

pat = re.compile(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./((?:assets|data)/[^"]+)"[^>]*>(?:</script>)?')
html, n = pat.subn(embed, html)
if missing:
    sys.exit('Не знайдено файлів: ' + ', '.join(missing) + ' (покладіть їх у теку або передайте аргументом)')
left = re.findall(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./[^"]+"', html)
if left:
    sys.exit('Не вбудовано: ' + ', '.join(left))

# ---- 2. власне аудіо → data:-URI ----
auds = 0
live = re.sub(r'<!--.*?-->', '', html, flags=re.S)  # приклади в коментарях шаблону не рахуються
for src in sorted(set(re.findall(r'<audio\b[^>]*\bsrc="(audio/[^"]+)"', live))):
    p = os.path.join(page_dir, src)
    if os.path.isfile(p):
        uri = 'data:audio/mpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
        html = html.replace('src="' + src + '"', 'src="' + uri + '"'); auds += 1
    else:
        print('  УВАГА: аудіо не знайдено поруч зі сторінкою:', src)

banner = ('<div style="background:#B14E3E;color:#fff;font:600 13px sans-serif;padding:8px 16px;text-align:center">'
          'ПРЕВʼЮ для перевірки — не для сайту. Посилання в меню й «Далі» тут не працюють.</div>')
html = html.replace('<body>', '<body>\n' + banner, 1)
out = page[:-5] + '-preview.html'
open(out, 'w', encoding='utf-8').write(html)
print('OK:', out, '| вбудовано файлів:', n, '| аудіо:', auds)
