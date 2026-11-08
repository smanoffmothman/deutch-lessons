#!/usr/bin/env python3
"""
build-hotspot-maps.py — збирає карти для buildHotspot (DeutschHeft):
  assets/svg/deutschland.js  — 16 земель + міста + річки
  assets/svg/ukraine.js      — 24 області, АР Крим, Київ, Севастополь + міста + річки

Дані: Natural Earth (суспільне надбання) —
  ne_10m_admin_1_states_provinces.geojson, ne_10m_rivers_lake_centerlines.geojson
  (github.com/nvkelso/natural-earth-vector, тека geojson/).
Natural Earth за замовчуванням відносить Крим і Севастополь до RUS — тут
вони беруться в складі УКРАЇНИ (міжнародно визнані кордони).

Запуск (з кореня клону):
  python3 tools/build-hotspot-maps.py <тека з geojson> assets/svg
Потрібно: pip install shapely  (2.x з GEOS ≥ 3.12 — coverage_simplify)

Скрипт — інструмент, НЕ частина сайту: лежить у tools/ репозиторію (до
2026-11-08 — у Knowledge проєкту техпідтримки). Карти перезбираються лише
за потреби (нове місто, інша річка).
"""
import json, math, sys, os
from shapely.geometry import shape, Point, LineString, MultiLineString, Polygon, MultiPolygon
from shapely.ops import unary_union, transform
from shapely import coverage_simplify

SRC, OUT = sys.argv[1], sys.argv[2]
W = 600  # ширина viewBox

# ---------------------------------------------------------------- дані
DE_LAND = {  # name у NE → (id, de, uk)
    'Baden-Württemberg': ('baden-wuerttemberg', 'Baden-Württemberg', 'Баден-Вюртемберг'),
    'Bayern': ('bayern', 'Bayern', 'Баварія'),
    'Berlin': ('berlin', 'Berlin', 'Берлін'),
    'Brandenburg': ('brandenburg', 'Brandenburg', 'Бранденбург'),
    'Bremen': ('bremen', 'Bremen', 'Бремен'),
    'Hamburg': ('hamburg', 'Hamburg', 'Гамбург'),
    'Hessen': ('hessen', 'Hessen', 'Гессен'),
    'Mecklenburg-Vorpommern': ('mecklenburg-vorpommern', 'Mecklenburg-Vorpommern', 'Мекленбург — Передня Померанія'),
    'Niedersachsen': ('niedersachsen', 'Niedersachsen', 'Нижня Саксонія'),
    'Nordrhein-Westfalen': ('nordrhein-westfalen', 'Nordrhein-Westfalen', 'Північний Рейн — Вестфалія'),
    'Rheinland-Pfalz': ('rheinland-pfalz', 'Rheinland-Pfalz', 'Рейнланд-Пфальц'),
    'Saarland': ('saarland', 'Saarland', 'Саар'),
    'Sachsen': ('sachsen', 'Sachsen', 'Саксонія'),
    'Sachsen-Anhalt': ('sachsen-anhalt', 'Sachsen-Anhalt', 'Саксонія-Ангальт'),
    'Schleswig-Holstein': ('schleswig-holstein', 'Schleswig-Holstein', 'Шлезвіг-Гольштейн'),
    'Thüringen': ('thueringen', 'Thüringen', 'Тюрингія'),
}
DE_CITIES = [  # id, de, uk, lat, lon, столиця
    ('berlin', 'Berlin', 'Берлін', 52.520, 13.405, 1),
    ('hamburg', 'Hamburg', 'Гамбург', 53.551, 9.994, 0),
    ('muenchen', 'München', 'Мюнхен', 48.137, 11.576, 0),
    ('koeln', 'Köln', 'Кельн', 50.938, 6.960, 0),
    ('frankfurt', 'Frankfurt am Main', 'Франкфурт-на-Майні', 50.110, 8.682, 0),
    ('stuttgart', 'Stuttgart', 'Штутгарт', 48.776, 9.183, 0),
    ('duesseldorf', 'Düsseldorf', 'Дюссельдорф', 51.227, 6.774, 0),
    ('leipzig', 'Leipzig', 'Лейпциг', 51.340, 12.375, 0),
    ('dresden', 'Dresden', 'Дрезден', 51.051, 13.738, 0),
    ('hannover', 'Hannover', 'Ганновер', 52.375, 9.732, 0),
    ('bremen', 'Bremen', 'Бремен', 53.079, 8.802, 0),
    ('nuernberg', 'Nürnberg', 'Нюрнберг', 49.452, 11.077, 0),
    ('kiel', 'Kiel', 'Кіль', 54.323, 10.123, 0),
    ('luebeck', 'Lübeck', 'Любек', 53.866, 10.686, 0),
    ('rostock', 'Rostock', 'Росток', 54.092, 12.099, 0),
    ('schwerin', 'Schwerin', 'Шверін', 53.629, 11.414, 0),
    ('potsdam', 'Potsdam', 'Потсдам', 52.391, 13.065, 0),
    ('magdeburg', 'Magdeburg', 'Магдебург', 52.120, 11.628, 0),
    ('erfurt', 'Erfurt', 'Ерфурт', 50.978, 11.029, 0),
    ('mainz', 'Mainz', 'Майнц', 49.993, 8.247, 0),
    ('saarbruecken', 'Saarbrücken', 'Саарбрюккен', 49.240, 6.997, 0),
    ('heidelberg', 'Heidelberg', 'Гайдельберг', 49.399, 8.672, 0),
    ('freiburg', 'Freiburg', 'Фрайбург', 47.999, 7.842, 0),
]
DE_RIVERS = {  # id, de, uk, назви в NE
    'rhein': ('Rhein', 'Рейн', {'Rhein', 'Rhine', 'Rhin'}),
    'donau': ('Donau', 'Дунай', {'Donau', 'Danube'}),
    'elbe': ('Elbe', 'Ельба', {'Elbe'}),
    'oder': ('Oder', 'Одер', {'Oder'}),
    'weser': ('Weser', 'Везер', {'Weser'}),
    'main': ('Main', 'Майн', {'Main'}),
    'mosel': ('Mosel', 'Мозель', {'Mosel'}),
    'ems': ('Ems', 'Емс', {'Ems'}),
    'inn': ('Inn', 'Інн', {'Inn'}),
}

UA_OBL = {  # name у NE → (id, de, uk)
    'Volyn': ('oblast-wolhynien', 'Oblast Wolhynien', 'Волинська область'),
    'Rivne': ('oblast-riwne', 'Oblast Riwne', 'Рівненська область'),
    'Zhytomyr': ('oblast-schytomyr', 'Oblast Schytomyr', 'Житомирська область'),
    'Kiev': ('oblast-kyjiw', 'Oblast Kyjiw', 'Київська область'),
    'Chernihiv': ('oblast-tschernihiw', 'Oblast Tschernihiw', 'Чернігівська область'),
    'Sumy': ('oblast-sumy', 'Oblast Sumy', 'Сумська область'),
    'Kharkiv': ('oblast-charkiw', 'Oblast Charkiw', 'Харківська область'),
    "Luhans'k": ('oblast-luhansk', 'Oblast Luhansk', 'Луганська область'),
    "Donets'k": ('oblast-donezk', 'Oblast Donezk', 'Донецька область'),
    'Zaporizhzhya': ('oblast-saporischschja', 'Oblast Saporischschja', 'Запорізька область'),
    'Kherson': ('oblast-cherson', 'Oblast Cherson', 'Херсонська область'),
    'Mykolayiv': ('oblast-mykolajiw', 'Oblast Mykolajiw', 'Миколаївська область'),
    'Odessa': ('oblast-odesa', 'Oblast Odesa', 'Одеська область'),
    "Dnipropetrovs'k": ('oblast-dnipropetrowsk', 'Oblast Dnipropetrowsk', 'Дніпропетровська область'),
    'Poltava': ('oblast-poltawa', 'Oblast Poltawa', 'Полтавська область'),
    'Cherkasy': ('oblast-tscherkassy', 'Oblast Tscherkassy', 'Черкаська область'),
    'Kirovohrad': ('oblast-kirowohrad', 'Oblast Kirowohrad', 'Кіровоградська область'),
    'Vinnytsya': ('oblast-winnyzja', 'Oblast Winnyzja', 'Вінницька область'),
    "Khmel'nyts'kyy": ('oblast-chmelnyzkyj', 'Oblast Chmelnyzkyj', 'Хмельницька область'),
    "Ternopil'": ('oblast-ternopil', 'Oblast Ternopil', 'Тернопільська область'),
    "L'viv": ('oblast-lwiw', 'Oblast Lwiw', 'Львівська область'),
    "Ivano-Frankivs'k": ('oblast-iwano-frankiwsk', 'Oblast Iwano-Frankiwsk', 'Івано-Франківська область'),
    'Transcarpathia': ('oblast-transkarpatien', 'Oblast Transkarpatien', 'Закарпатська область'),
    'Chernivtsi': ('oblast-tscherniwzi', 'Oblast Tscherniwzi', 'Чернівецька область'),
    'Kiev City': ('kyjiw', 'Kyjiw', 'Київ'),
    'Crimea': ('krim', 'Autonome Republik Krim', 'Автономна Республіка Крим'),
    'Sevastopol': ('sewastopol', 'Sewastopol', 'Севастополь'),
}
UA_CITIES = [
    ('kyjiw', 'Kyjiw', 'Київ', 50.450, 30.523, 1),
    ('lwiw', 'Lwiw', 'Львів', 49.839, 24.030, 0),
    ('charkiw', 'Charkiw', 'Харків', 49.994, 36.230, 0),
    ('odesa', 'Odesa', 'Одеса', 46.482, 30.723, 0),
    ('dnipro', 'Dnipro', 'Дніпро', 48.465, 35.046, 0),
    ('saporischschja', 'Saporischschja', 'Запоріжжя', 47.838, 35.139, 0),
    ('donezk', 'Donezk', 'Донецьк', 48.015, 37.803, 0),
    ('luhansk', 'Luhansk', 'Луганськ', 48.574, 39.307, 0),
    ('mykolajiw', 'Mykolajiw', 'Миколаїв', 46.975, 31.995, 0),
    ('cherson', 'Cherson', 'Херсон', 46.636, 32.617, 0),
    ('poltawa', 'Poltawa', 'Полтава', 49.589, 34.551, 0),
    ('tschernihiw', 'Tschernihiw', 'Чернігів', 51.494, 31.289, 0),
    ('sumy', 'Sumy', 'Суми', 50.907, 34.798, 0),
    ('schytomyr', 'Schytomyr', 'Житомир', 50.254, 28.658, 0),
    ('winnyzja', 'Winnyzja', 'Вінниця', 49.233, 28.468, 0),
    ('tscherkassy', 'Tscherkassy', 'Черкаси', 49.444, 32.059, 0),
    ('kropywnyzkyj', 'Kropywnyzkyj', 'Кропивницький', 48.508, 32.262, 0),
    ('chmelnyzkyj', 'Chmelnyzkyj', 'Хмельницький', 49.422, 26.987, 0),
    ('ternopil', 'Ternopil', 'Тернопіль', 49.553, 25.594, 0),
    ('iwano-frankiwsk', 'Iwano-Frankiwsk', 'Івано-Франківськ', 48.922, 24.711, 0),
    ('tscherniwzi', 'Tscherniwzi', 'Чернівці', 48.292, 25.935, 0),
    ('uschhorod', 'Uschhorod', 'Ужгород', 48.621, 22.288, 0),
    ('riwne', 'Riwne', 'Рівне', 50.619, 26.252, 0),
    ('luzk', 'Luzk', 'Луцьк', 50.747, 25.325, 0),
    ('simferopol', 'Simferopol', 'Сімферополь', 44.952, 34.102, 0),
    ('sewastopol', 'Sewastopol', 'Севастополь', 44.616, 33.525, 0),
]
UA_RIVERS = {
    'dnipro-fluss': ('Dnipro', 'Дніпро', {'Dnipro', 'Dnieper'}),  # не 'dnipro' — так зветься місто
    'dnister': ('Dnister', 'Дністер', {'Dniester', 'Dnister'}),
    'desna': ('Desna', 'Десна', {'Desna'}),
    'suedlicher-bug': ('Südlicher Bug', 'Південний Буг', {'Southern Bug'}),
    'siwerskyj-donez': ('Siwerskyj Donez', 'Сіверський Донець', {'Donets'}),
    'prypjat': ('Prypjat', "Прип'ять", {'Pripyat'}),
    'donau': ('Donau', 'Дунай', {'Danube', 'Bratul Chillia'}),
}

# ---------------------------------------------------------------- геометрія
admin1 = json.load(open(os.path.join(SRC, 'ne_10m_admin_1_states_provinces.geojson')))['features']
rivers = json.load(open(os.path.join(SRC, 'ne_10m_rivers_lake_centerlines.geojson')))['features']

def esc(s): return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')

def path_d(geom, prec=1):
    out = []
    def ring(coords, close=True):
        pts = [(round(x, prec), round(y, prec)) for x, y in coords]
        dedup = [pts[0]] + [p for i, p in enumerate(pts[1:], 1) if p != pts[i - 1]]
        if close and len(dedup) < 4: return
        s = 'M' + ' L'.join(f'{x:g} {y:g}' for x, y in dedup)
        out.append(s + ('Z' if close else ''))
    if isinstance(geom, (Polygon,)):
        geoms = [geom]
    elif isinstance(geom, MultiPolygon):
        geoms = list(geom.geoms)
    elif isinstance(geom, LineString):
        ring(geom.coords, False); return ''.join(out)
    elif isinstance(geom, MultiLineString):
        for g in geom.geoms: ring(g.coords, False)
        return ''.join(out)
    else:
        geoms = [g for g in getattr(geom, 'geoms', []) if isinstance(g, (Polygon, MultiPolygon))]
        return ''.join(path_d(g, prec) for g in geoms)
    for p in geoms:
        ring(p.exterior.coords)
        for h in p.interiors: ring(h.coords)
    return ''.join(out)

def build(name, regions, cities, river_map, lat0, tol, title):
    # проєкція: рівнопроміжна з косинусом середньої широти, y — донизу
    k = math.cos(math.radians(lat0))
    proj = lambda x, y, z=None: (x * k, -y)
    regs = [(meta, transform(proj, g).buffer(0)) for meta, g in regions]
    simp = coverage_simplify([g for _, g in regs], tol)  # спільні кордони спрощуються однаково
    regs = [(meta, g.buffer(0)) for (meta, _), g in zip(regs, simp)]
    outline = unary_union([g for _, g in regs])
    minx, miny, maxx, maxy = outline.bounds
    pad = (maxx - minx) * 0.03
    s = W / (maxx - minx + 2 * pad)
    H = round((maxy - miny + 2 * pad) * s)
    fit = lambda x, y, z=None: ((x - minx + pad) * s, (y - miny + pad) * s)
    P = lambda g: transform(fit, g)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" class="hs-map" role="img" aria-label="{esc(title)}">']
    parts.append('<g class="hs-regions">')
    for (zid, de, uk), g in regs:
        parts.append(f'<path class="hs-zone hs-region" data-zone="{zid}" data-name="{esc(de)}" data-uk="{esc(uk)}" d="{path_d(P(g))}"/>')
    parts.append('</g>')
    parts.append(f'<path class="hs-outline" d="{path_d(P(outline))}"/>')
    # річки — у межах країни (з невеликим запасом на прикордонні ділянки)
    clip = outline.buffer((maxx - minx) * 0.004)
    parts.append('<g class="hs-rivers">')
    for rid, (de, uk, ne_names) in river_map.items():
        lines = [transform(proj, shape(f['geometry'])) for f in rivers
                 if (f['properties'].get('name') or '') in ne_names]
        if not lines: print('  УВАГА: річку не знайдено', rid); continue
        g = unary_union(lines).intersection(clip).simplify(tol * 0.8)
        if g.is_empty: print('  УВАГА: річка поза картою', rid); continue
        d = path_d(P(g))
        parts.append(f'<g class="hs-zone hs-river" data-zone="{rid}" data-name="{esc(de)}" data-uk="{esc(uk)}">'
                     f'<path class="hs-river-hit" d="{d}"/><path class="hs-river-line" d="{d}"/></g>')
    parts.append('</g>')
    parts.append('<g class="hs-cities">')
    for cid, de, uk, lat, lon, cap in cities:
        x, y = fit(*proj(lon, lat))
        if not outline.buffer(0.02).contains(Point(*proj(lon, lat))): print('  УВАГА: місто поза країною', cid)
        parts.append(f'<g class="hs-zone hs-city{" hs-cap" if cap else ""}" data-zone="{cid}" data-name="{esc(de)}" data-uk="{esc(uk)}" '
                     f'data-x="{x:.1f}" data-y="{y:.1f}" transform="translate({x:.1f} {y:.1f})"><circle r="{5.5 if cap else 4.2}"/></g>')
    parts.append('</g></svg>')
    svg = ''.join(parts)
    js = ('/* Карта для buildHotspot: ' + title + '. Згенеровано tools/build-hotspot-maps.py з даних\n'
          '   Natural Earth (суспільне надбання), власна проєкція й спрощення. Вручну не редагувати —\n'
          '   перезбирати скриптом з tools/ репозиторію. Зони — data-zone у <path>/<g>. */\n'
          'window.HOTSPOT_SVG = window.HOTSPOT_SVG || {};\n'
          f'HOTSPOT_SVG[{json.dumps(name)}] = {json.dumps(svg, ensure_ascii=False)};\n')
    path = os.path.join(OUT, name + '.js')
    open(path, 'w', encoding='utf-8').write(js)
    zones = [m[0] for m, _ in regs] + list(river_map) + [c[0] for c in cities]
    print(f'{path}: {len(js)//1024} КБ, viewBox {W}×{H}, зон: {len(regs)} регіонів, {len(river_map)} річок, {len(cities)} міст')
    return zones

def feats(pred):
    return [f for f in admin1 if pred(f['properties'])]

os.makedirs(OUT, exist_ok=True)
de = feats(lambda p: p.get('adm0_a3') == 'DEU')
assert len(de) == 16, len(de)
build('deutschland', [(DE_LAND[f['properties']['name']], shape(f['geometry'])) for f in de],
      DE_CITIES, DE_RIVERS, 51.0, 0.012, 'Deutschland')

ua = feats(lambda p: p.get('adm0_a3') == 'UKR' or (p.get('name') in ('Crimea', 'Sevastopol')))
names = sorted(f['properties']['name'] for f in ua)
assert len(ua) == 27, names
build('ukraine', [(UA_OBL[f['properties']['name']], shape(f['geometry'])) for f in ua],
      UA_CITIES, UA_RIVERS, 48.5, 0.02, 'Ukraine')
