# commons-search.py — фото з Wikimedia Commons для статей розділу «Матеріали».
# Інструмент проєкту матеріалів (як tools/build-material-preview.py), не частина сайту.
# Правила відбору, розмітка й підписи — MATERIAL-BRIEF.md, розділ «Ілюстрації».
# Запускати з кореня клону репозиторію: python3 tools/commons-search.py …
# Робочі файли лягають у ./commons/ (у .gitignore — у репозиторій не потрапляють).
#
#   python3 tools/commons-search.py search <slot> "<запит 1>" ["<запит 2>" …] [--n 12] [--any]
#       Шукає фото (лише дані, без завантаження картинок) і друкує нумерований
#       список кандидатів: ліцензія, розмір, орієнтація, назва, автор, опис.
#       Фільтри: CC0 / суспільне надбання / CC BY / CC BY-SA, JPEG або PNG,
#       ширина від 900 px; горизонтальні — першими, вертикальні позначені ▯
#       (--any — не сортувати за орієнтацією). Результат зберігається в
#       ./commons/<slot>.json. <slot> — довільна коротка назва (kraniche, bverfg).
#       Запити — німецькою й англійською; кілька запитів в одній команді.
#
#   python3 tools/commons-search.py sheet <slot> [№ …]
#       Аркуш для перегляду ./commons/<slot>.jpg: мініатюри 330 px лише для
#       вказаних кандидатів (за замовчуванням перші 5) з номером і ліцензією.
#       Подивись його (Read) і вибери. Потрібен Pillow. Спершу відсіюй за
#       даними зі search — кожна мініатюра — це запит до Wikimedia.
#
#   python3 tools/commons-search.py figure <slot> <№> "<Підпис німецькою.>" [--narrow]
#       Друкує готовий <figure class="mat-fig"> для вставки в <article>:
#       src — мініатюра 960 px з upload.wikimedia.org, width/height, alt,
#       figcaption з автором, ліцензією й посиланням на файл.
#       --narrow — для вертикального фото (обмеження ширини 300 px).
#       Автора перевір очима: у даних Commons трапляються зайві хвости.
#
#   python3 tools/commons-search.py check <стаття.html> […]
#       Перевіряє, що кожне <img src="https://…"> у файлах відкривається (200).
#
# Wikimedia обмежує частоту запитів (HTTP 429 з Retry-After, буває до 10 хв):
# скрипт робить паузу ~1 с між запитами й чекає стільки, скільки просить
# сервер. Запити — лише по черзі, не паралельно (правила API Wikimedia).
import sys, os, re, json, time, html, urllib.request, urllib.parse, urllib.error

UA = {'User-Agent': 'DeutschMitUns-Materials/1.0 (educational site; commons-search.py)'}
API = 'https://commons.wikimedia.org/w/api.php?'
DIR = 'commons'
OK_LIC = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? \d\.\d( [a-z]{2})?)$', re.I)

def fetch(url, method='GET'):
    for attempt in range(8):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers=UA, method=method), timeout=60)
            time.sleep(1.0)
            return r
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                w = min(int(e.headers.get('Retry-After') or 0) or 5 * (attempt + 1), 600)
                print(f'  Wikimedia просить зачекати {w} с…', file=sys.stderr)
                time.sleep(w); continue
            raise
    raise RuntimeError('забагато запитів (429): ' + url)

def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s or ''))).strip()

def clean_artist(a):
    a = plain(a)
    a = re.sub(r'\s+(at|from) [A-Z][a-z]+ Wikipedia$', '', a)
    a = re.sub(r'\s*-\s*Wikimedia Commons.*$', '', a)
    return a[:80]

def upload_url(u):
    u = u.split('?')[0]
    return re.sub(r'^https://thumb\.wikimedia\.org/', 'https://upload.wikimedia.org/', u)

def search(query, n):
    params = {'action': 'query', 'format': 'json', 'maxlag': 5,
              'generator': 'search', 'gsrsearch': query + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': n,
              'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': 960}
    d = json.load(fetch(API + urllib.parse.urlencode(params)))
    out = []
    for p in sorted(d.get('query', {}).get('pages', {}).values(), key=lambda x: x.get('index', 0)):
        ii = (p.get('imageinfo') or [{}])[0]; m = ii.get('extmetadata', {})
        lic = plain(m.get('LicenseShortName', {}).get('value', ''))
        if ii.get('mime') not in ('image/jpeg', 'image/png') or not OK_LIC.match(lic) or ii.get('width', 0) < 900:
            continue
        w, h = ii['width'], ii['height']
        tw = min(960, w)
        out.append({'title': p['title'], 'page': ii['descriptionurl'],
                    'thumb': upload_url(ii.get('thumburl') or ii['url']), 'w': w, 'h': h,
                    'tw': tw, 'th': round(tw * h / w),
                    'license': lic, 'licurl': plain(m.get('LicenseUrl', {}).get('value', '')),
                    'artist': clean_artist(m.get('Artist', {}).get('value', '')),
                    'desc': plain(m.get('ImageDescription', {}).get('value', ''))[:160]})
    return out

def load(slot):
    p = os.path.join(DIR, slot + '.json')
    if not os.path.exists(p): sys.exit(f'Немає {p} — спершу search {slot} …')
    return json.load(open(p))

def cmd_search(a):
    n = 12; anyo = False; qs = []
    i = 0
    while i < len(a):
        if a[i] == '--n': n = int(a[i + 1]); i += 2; continue
        if a[i] == '--any': anyo = True; i += 1; continue
        qs.append(a[i]); i += 1
    slot, qs = qs[0], qs[1:]
    res, seen = [], set()
    for q in qs:
        for r in search(q, n):
            if r['title'] not in seen: seen.add(r['title']); res.append(r)
    if not anyo: res.sort(key=lambda r: r['h'] > r['w'])   # горизонтальні першими
    os.makedirs(DIR, exist_ok=True)
    json.dump(res, open(os.path.join(DIR, slot + '.json'), 'w'), ensure_ascii=False, indent=1)
    if not res: print('Нічого не знайдено (з вільною ліцензією й шириною ≥ 900 px). Спробуй інші слова / мову.')
    for i, r in enumerate(res):
        o = '▯' if r['h'] > r['w'] else '▭'
        print(f"{i:2} {o} {r['license']:<16} {r['w']}×{r['h']}  {r['title'][5:]}\n     автор: {r['artist']}\n     опис: {r['desc'][:110]}")

def cmd_sheet(a):
    from PIL import Image, ImageDraw
    slot = a[0]; res = load(slot)
    idx = [int(x) for x in a[1:]] or list(range(min(5, len(res))))
    tiles = []
    for i in idx:
        r = res[i]
        u = r['thumb'].replace('/960px-', '/330px-') if '/960px-' in r['thumb'] else r['thumb']
        try:
            im = Image.open(fetch(u)).convert('RGB')
        except Exception as e:
            print('  не вдалося:', i, e, file=sys.stderr); continue
        im.thumbnail((330, 250))
        t = Image.new('RGB', (330, 272), 'white'); t.paste(im, (0, 0))
        ImageDraw.Draw(t).text((4, 255), f"{i}  {r['license']}  {r['title'][5:38]}", fill='black')
        tiles.append(t)
    if not tiles: sys.exit('Жодної мініатюри.')
    cols = min(4, len(tiles)); rows = (len(tiles) + cols - 1) // cols
    s = Image.new('RGB', (cols * 330, rows * 272), 'white')
    for k, t in enumerate(tiles): s.paste(t, ((k % cols) * 330, (k // cols) * 272))
    out = os.path.join(DIR, slot + '.jpg'); s.save(out, quality=82); print('Аркуш:', out)

def cmd_figure(a):
    narrow = '--narrow' in a; a = [x for x in a if x != '--narrow']
    slot, i, cap = a[0], int(a[1]), a[2].strip()
    r = load(slot)[i]; e = html.escape
    lic = 'gemeinfrei' if r['license'].lower() in ('public domain', 'pd') else r['license']
    licpart = f'<a href="{e(r["licurl"])}" target="_blank" rel="noopener">{e(lic)}</a>' if r['licurl'] else e(lic)
    st = ' style="max-width:300px;margin-left:auto;margin-right:auto"' if narrow else ''
    if r['h'] > r['w'] and not narrow:
        print('<!-- УВАГА: фото вертикальне — краще горизонтальне або --narrow -->')
    print(f'''<figure class="mat-fig"{st}>
  <img src="{e(r['thumb'])}" alt="{e(cap)}" width="{r['tw']}" height="{r['th']}" loading="lazy">
  <figcaption>{e(cap)} Foto: {e(r['artist'])}, {licpart}, <a href="{e(r['page'])}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption>
</figure>''')

def cmd_check(a):
    bad = 0
    for f in a:
        for u in re.findall(r'<img\b[^>]*\bsrc="(https?://[^"]+)"', open(f, encoding='utf-8').read()):
            try:
                st = fetch(html.unescape(u), 'HEAD').status
            except Exception as ex:
                st = ex
            ok = st == 200; bad += not ok
            print(('OK ' if ok else 'ПОМИЛКА ') + str(st), os.path.basename(f), u[-60:])
    print('Усе відкривається.' if not bad else f'Не відкриваються: {bad}')
    sys.exit(1 if bad else 0)

if __name__ == '__main__':
    cmds = {'search': cmd_search, 'sheet': cmd_sheet, 'figure': cmd_figure, 'check': cmd_check}
    if len(sys.argv) < 3 or sys.argv[1] not in cmds: sys.exit(__doc__ or open(__file__).read().split('import sys')[0])
    cmds[sys.argv[1]](sys.argv[2:])
