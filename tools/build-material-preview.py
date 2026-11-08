# build-material-preview.py — збирає ПРЕВʼЮ сторінки статті (розділ «Матеріали»):
# один самодостатній HTML для перевірки прямо в чаті, без сайту.
# Інструмент проєкту матеріалів (не частина сайту). З 2026-10-27 превʼю за
# замовчуванням НЕ збирається (MATERIAL-BRIEF, «Перевірка») — лише на окреме
# прохання людини.
#
#   python3 tools/build-material-preview.py <стаття.html> <корінь клону сайту> [materials-data.js] [--no-img]
#
# Запускати з кореня свіжого клону репозиторію, напр.:
#   python3 tools/build-material-preview.py materialy/statti/<id>.html .
# Спільні файли беруться з <корінь>/assets/, дані — з <корінь>/data/materials-data.js
# (або з файлу, переданого третім аргументом) — тоді крихти, бейджі (рівень,
# країна, теми), примітка про джерело й «Lies weiter» будуть як на сайті.
# Результат: <стаття>-preview.html поруч із файлом статті (у репозиторій НЕ
# комітити — robots.txt його й так закриває, але йому там не місце).
#
# Що робить:
# 1. Замінює підключення ../../assets/* і ../../data/* вмістом файлів
#    (CSS у <style>, JS у <script>). Текст "</script" усередині вбудованого коду
#    екранується, інакше коментарі в спільних JS обірвали б скрипт. Якщо якесь
#    підключення не вбудовано — зупиняється з помилкою.
# 2. (з 2026-10) Вбудовує фото статті: кожне <img src="https://…"> завантажує
#    й підставляє як data:-URI (JPEG до 960 px, якщо є Pillow; інакше як є).
#    Перегляд у чаті не показує картинок зі сторонніх сайтів, тож без цього
#    у превʼю замість фото порожнє місце. Сама сторінка для сайту НЕ
#    змінюється — там фото, як і раніше, вантажаться з Wikimedia.
#    Wikimedia обмежує частоту запитів (HTTP 429): скрипт робить паузи й чекає
#    стільки, скільки просить сервер (Retry-After, до 10 хв). Завантажені
#    фото кешуються в /tmp/dmu-img-cache, тож повторне збирання не качає їх
#    знову. Не вдалося завантажити — попередження, адреса лишається як є
#    (превʼю все одно збирається). --no-img — пропустити цей крок.
import sys, re, os, io, time, base64, hashlib, urllib.request, urllib.error
args = [a for a in sys.argv[1:] if not a.startswith('--')]
NO_IMG = '--no-img' in sys.argv
page, K = args[0], args[1]
data = args[2] if len(args) > 2 else os.path.join(K, 'data', 'materials-data.js')
html = open(page, encoding='utf-8').read()
def rd(p): return open(p, encoding='utf-8').read()
def js(code): return '<script>\n' + code.replace('</script', '<\\/script') + '\n</script>'
def css(code): return '<style>\n' + code.replace('</style', '<\\/style') + '\n</style>'
files = {
  'assets/lesson-style.css':        lambda: css(rd(os.path.join(K, 'assets', 'lesson-style.css'))),
  'assets/site.css':                lambda: css(rd(os.path.join(K, 'assets', 'site.css'))),
  'assets/material-style.css':      lambda: css(rd(os.path.join(K, 'assets', 'material-style.css'))),
  'assets/site-nav.js':             lambda: js(rd(os.path.join(K, 'assets', 'site-nav.js'))),
  'assets/lesson-interactions.js':  lambda: js(rd(os.path.join(K, 'assets', 'lesson-interactions.js'))),
  'assets/material-reader.js':      lambda: js(rd(os.path.join(K, 'assets', 'material-reader.js'))),
  'data/materials-data.js':         lambda: js(rd(data)),
}
n = 0
for rel, make in files.items():
    pat = re.compile(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./' + re.escape(rel) + r'"[^>]*>(?:</script>)?')
    html, k = pat.subn(lambda m: make(), html); n += k
left = re.findall(r'<(?:link[^>]*href|script[^>]*src)="\.\./\.\./[^"]+"', html)
if left: sys.exit('Не вбудовано: ' + ', '.join(left))

# ---- 2. фото статті → data:-URI ----
UA = {'User-Agent': 'DeutschMitUns-Preview/1.0 (educational site preview)'}
CACHE = '/tmp/dmu-img-cache'
def fetch(url):
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                b = r.read(); time.sleep(1); return b, r.headers.get('Content-Type', 'image/jpeg')
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                w = min(int(e.headers.get('Retry-After') or 0) or 5 * (attempt + 1), 600)
                print('  Wikimedia просить зачекати', w, 'с…'); time.sleep(w); continue
            raise
    raise RuntimeError('забагато запитів (429)')
def to_data_uri(url):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest())
    if os.path.exists(p + '.uri'): return open(p + '.uri').read()
    raw, ctype = fetch(url)
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        if im.width > 960: im = im.resize((960, round(im.height * 960 / im.width)))
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=80, optimize=True, progressive=True)
        raw, ctype = buf.getvalue(), 'image/jpeg'
    except ImportError:
        pass
    uri = 'data:' + ctype.split(';')[0] + ';base64,' + base64.b64encode(raw).decode()
    open(p + '.uri', 'w').write(uri)
    return uri
imgs = 0
if not NO_IMG:
    for url in sorted(set(re.findall(r'<img\b[^>]*\bsrc="(https?://[^"]+)"', html))):
        try:
            html = html.replace('src="' + url + '"', 'src="' + to_data_uri(url) + '"'); imgs += 1
        except Exception as e:
            print('  УВАГА: фото не вбудовано (' + str(e) + '):', url)

banner = ('<div style="background:#B14E3E;color:#fff;font:600 13px sans-serif;padding:8px 16px;text-align:center">'
          'ПРЕВʼЮ для перевірки — не для сайту. Посилання в меню тут не працюють.</div>')
html = html.replace('<body>', '<body>\n' + banner, 1)
out = page[:-5] + '-preview.html'
open(out, 'w', encoding='utf-8').write(html)
print('OK:', out, '| вбудовано файлів:', n, '| фото:', imgs)
