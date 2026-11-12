#!/usr/bin/env python3
"""
build-flags.py — прапорці країн для розділу «Матеріали» (DeutschHeft).

Прапорці — маленькі SVG (спрощені: без гербів і написів, бо на сайті вони
18×12 px), вбудовані в CSS як data-URI. Емодзі-прапорців не використовуємо:
Windows їх не показує. Результат — блок між маркерами
  /* flags:start … */  …  /* flags:end */
у assets/site.css (класи .flag-DE, .flag-CN …).

Новий прапорець:
  1) додай рядок у FLAGS нижче (код — як у MATERIAL_KRAYINY в
     data/materials-data.js; квадратні прапорці — у SQUARE);
  2) додай країну в MATERIAL_KRAYINY (data/materials-data.js);
  3) запусти з кореня клону:  python3 tools/build-flags.py
Скрипт — інструмент, НЕ частина сайту.
"""
import math
import re
import sys
from pathlib import Path
from urllib.parse import quote


def star(cx, cy, r, rot=-90, inner=0.382):
    """П'ятикутна зірка: точки для <polygon>."""
    pts = []
    for i in range(10):
        a = math.radians(rot + i * 36)
        rr = r if i % 2 == 0 else r * inner
        pts.append(f"{cx + rr * math.cos(a):.2f},{cy + rr * math.sin(a):.2f}")
    return " ".join(pts)


def hstripes(*colors, w=30, h=20):
    n = len(colors)
    return "".join(f'<rect y="{h * i / n:.3f}" width="{w}" height="{h / n + .01:.3f}" fill="{c}"/>'
                   for i, c in enumerate(colors))


def vstripes(*colors, w=30, h=20):
    n = len(colors)
    return "".join(f'<rect x="{w * i / n:.3f}" width="{w / n + .01:.3f}" height="{h}" fill="{c}"/>'
                   for i, c in enumerate(colors))


def nordic(bg, cross, inner=None, w=32, h=20):
    """Скандинавський хрест: зміщений до древка."""
    x, t = w * 0.31, h * 0.2          # центр хреста і товщина
    s = f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    s += f'<rect x="{x - t / 2}" width="{t}" height="{h}" fill="{cross}"/><rect y="{h / 2 - t / 2}" width="{w}" height="{t}" fill="{cross}"/>'
    if inner:
        ti = t / 2
        s += f'<rect x="{x - ti / 2}" width="{ti}" height="{h}" fill="{inner}"/><rect y="{h / 2 - ti / 2}" width="{w}" height="{ti}" fill="{inner}"/>'
    return s


# Union Jack у прямокутнику 0..w × 0..h (спрощений: червоні діагоналі без зсуву)
def union_jack(w=30, h=15):
    return (f'<rect width="{w}" height="{h}" fill="#012169"/>'
            f'<path d="M0,0L{w},{h}M{w},0L0,{h}" stroke="#fff" stroke-width="{h * .2}"/>'
            f'<path d="M0,0L{w},{h}M{w},0L0,{h}" stroke="#C8102E" stroke-width="{h * .08}"/>'
            f'<path d="M{w / 2},0V{h}M0,{h / 2}H{w}" stroke="#fff" stroke-width="{h * .33}"/>'
            f'<path d="M{w / 2},0V{h}M0,{h / 2}H{w}" stroke="#C8102E" stroke-width="{h * .2}"/>')


def us():
    s = ''.join(f'<rect y="{i * 20 / 13:.3f}" width="30" height="{20 / 13 + .01:.3f}" fill="{"#B22234" if i % 2 == 0 else "#fff"}"/>'
                for i in range(13))
    s += '<rect width="12" height="10.77" fill="#3C3B6E"/>'
    s += ''.join(f'<circle cx="{1.5 + 2.25 * c + (1.1 if r % 2 else 0):.2f}" cy="{1.3 + 2 * r:.2f}" r=".45" fill="#fff"/>'
                 for r in range(5) for c in range(5 if r % 2 == 0 else 4))
    return s


def cn():
    s = '<rect width="30" height="20" fill="#EE1C25"/>'
    s += f'<polygon points="{star(5, 5, 3)}" fill="#FFDE00"/>'
    for cx, cy in ((10, 2), (12, 4), (12, 7), (10, 9)):
        rot = math.degrees(math.atan2(5 - cy, 5 - cx))
        s += f'<polygon points="{star(cx, cy, 1, rot)}" fill="#FFDE00"/>'
    return s


def au_nz(stars_fill, stars, outline=None):
    s = '<rect width="30" height="20" fill="#012169"/>' + f'<svg width="15" height="10" viewBox="0 0 30 15" preserveAspectRatio="none">{union_jack()}</svg>'
    for cx, cy, r in stars:
        if outline:
            s += f'<polygon points="{star(cx, cy, r * 1.35)}" fill="{outline}"/>'
        s += f'<polygon points="{star(cx, cy, r)}" fill="{stars_fill}"/>'
    return s


def tr():
    return ('<rect width="30" height="20" fill="#E30A17"/>'
            '<circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.25" cy="10" r="4" fill="#E30A17"/>'
            f'<polygon points="{star(17.3, 10, 2.1, 180)}" fill="#fff"/>')


def ca():
    leaf = ("15,4 15.9,6 17.2,5.4 16.7,8.6 18.3,7.2 18.7,8.2 20.3,7.9 19.8,9.6 20.6,10 "
            "17.6,12.4 17.9,13.4 15.3,13.1 15.3,15.6 14.7,15.6 14.7,13.1 12.1,13.4 12.4,12.4 "
            "9.4,10 10.2,9.6 9.7,7.9 11.3,8.2 11.7,7.2 13.3,8.6 12.8,5.4 14.1,6")
    return ('<rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#D52B1E"/>'
            f'<rect x="22.5" width="7.5" height="20" fill="#D52B1E"/><polygon points="{leaf}" fill="#D52B1E"/>')


def gr():
    s = ''.join(f'<rect y="{i * 20 / 9:.3f}" width="30" height="{20 / 9 + .01:.3f}" fill="{"#0D5EAF" if i % 2 == 0 else "#fff"}"/>'
                for i in range(9))
    u = 20 / 9
    s += f'<rect width="{5 * u:.3f}" height="{5 * u:.3f}" fill="#0D5EAF"/>'
    s += f'<rect x="{2 * u:.3f}" width="{u:.3f}" height="{5 * u:.3f}" fill="#fff"/><rect y="{2 * u:.3f}" width="{5 * u:.3f}" height="{u:.3f}" fill="#fff"/>'
    return s


def eu():
    s = '<rect width="30" height="20" fill="#003399"/>'
    for i in range(12):
        a = math.radians(i * 30)
        s += f'<polygon points="{star(15 + 6 * math.sin(a), 10 - 6 * math.cos(a), 1.1)}" fill="#FFCC00"/>'
    return s


def welt():
    # «увесь світ»: глобус (не прапорець) — квадратний
    return ('<circle cx="10" cy="10" r="9.3" fill="#2E726F"/>'
            '<g fill="none" stroke="#F6EFE0" stroke-width="1.1">'
            '<circle cx="10" cy="10" r="9.3"/><ellipse cx="10" cy="10" rx="4" ry="9.3"/>'
            '<path d="M10,.7V19.3M.7,10H19.3M2.2,5.3H17.8M2.2,14.7H17.8"/></g>')


# код → (SVG-вміст, ширина viewBox, висота viewBox)
FLAGS = {
    # німецькомовні
    'DE': (hstripes('#000', '#DD0000', '#FFCE00'), 30, 20),
    'AT': (hstripes('#C8102E', '#fff', '#C8102E'), 30, 20),
    'CH': ('<rect width="20" height="20" fill="#DA291C"/><rect x="8.1" y="4" width="3.8" height="12" fill="#fff"/><rect x="4" y="8.1" width="12" height="3.8" fill="#fff"/>', 20, 20),
    'LI': (hstripes('#002B7F', '#CE1126') + '<circle cx="7" cy="5" r="1.6" fill="#FFD83D"/>', 30, 20),
    'LU': (hstripes('#EF3340', '#fff', '#00A3E0'), 30, 20),
    # регіони
    'EU': (eu(), 30, 20),
    'WELT': (welt(), 20, 20),
    # інші країни (за кодом ISO 3166-1)
    'AO': (hstripes('#CC092F', '#000') + '<path d="M17.2,6.6A4.2,4.2 0 1 1 11.6,13.4" fill="none" stroke="#FFCB00" stroke-width="1.1"/>'
           + '<path d="M11.8,12.8L16.4,8.6" stroke="#FFCB00" stroke-width="1"/>' + f'<polygon points="{star(13.2, 8.3, 1.5)}" fill="#FFCB00"/>', 30, 20),
    'AR': (hstripes('#74ACDF', '#fff', '#74ACDF') + '<circle cx="15" cy="10" r="2" fill="#F6B40E"/>', 30, 20),
    'AU': (au_nz('#fff', [(7.5, 15, 2.3), (22.5, 4, 1.1), (19, 9.5, 1.1), (25.5, 8.5, 1.1), (22.5, 16.5, 1.2)]), 30, 20),
    'BE': (vstripes('#000', '#FDDA24', '#EF3340'), 30, 20),
    'BR': ('<rect width="30" height="20" fill="#009C3B"/><polygon points="15,2 28,10 15,18 2,10" fill="#FFDF00"/><circle cx="15" cy="10" r="4.4" fill="#002776"/>', 30, 20),
    'BW': ('<rect width="30" height="20" fill="#75AADB"/><rect y="7.5" width="30" height="5" fill="#fff"/><rect y="8.33" width="30" height="3.33" fill="#000"/>', 30, 20),
    'CA': (ca(), 30, 20),
    'CN': (cn(), 30, 20),
    'CZ': ('<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D7141A"/><polygon points="0,0 15,10 0,20" fill="#11457E"/>', 30, 20),
    'DK': (nordic('#C8102E', '#fff', w=37, h=28), 37, 28),
    'EG': (hstripes('#CE1126', '#fff', '#000') + '<circle cx="15" cy="10" r="1.9" fill="#C09300"/>', 30, 20),
    'ES': ('<rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/>', 30, 20),
    'FI': (nordic('#fff', '#002F6C', w=36, h=22), 36, 22),
    'FR': (vstripes('#0055A4', '#fff', '#EF4135'), 30, 20),
    'GB': (union_jack(30, 15), 30, 15),
    # Гренландія: біле/червоне + коло з протилежними кольорами, зміщене до древка
    'GL': ('<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D00C33"/>'
           '<path d="M5,10A6.67,6.67 0 0 1 18.33,10Z" fill="#D00C33"/><path d="M5,10A6.67,6.67 0 0 0 18.33,10Z" fill="#fff"/>', 30, 20),
    'GR': (gr(), 30, 20),
    'HT': (hstripes('#00209F', '#D21034') + '<rect x="11" y="6.5" width="8" height="7" fill="#fff"/><rect x="14" y="8" width="2" height="4" fill="#016A16"/>', 30, 20),
    'HU': (hstripes('#CD2A3E', '#fff', '#436F4D'), 30, 20),
    'ID': (hstripes('#CE1126', '#fff'), 30, 20),
    'IE': (vstripes('#169B62', '#fff', '#FF883E'), 30, 20),
    'IN': (hstripes('#FF9933', '#fff', '#138808') + '<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".7"/><circle cx="15" cy="10" r=".6" fill="#000080"/>', 30, 20),
    'IQ': (hstripes('#CE1126', '#fff', '#000') + '<rect x="9" y="9" width="12" height="2" rx="1" fill="#007A3D"/>', 30, 20),
    'IS': (nordic('#02529C', '#fff', '#DC1E35', w=34, h=24), 34, 24),
    'IT': (vstripes('#009246', '#fff', '#CE2B37'), 30, 20),
    'JP': ('<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#BC002D"/>', 30, 20),
    'MX': (vstripes('#006847', '#fff', '#CE1126') + '<circle cx="15" cy="10" r="2.3" fill="#8C5A2B"/>', 30, 20),
    'NL': (hstripes('#AE1C28', '#fff', '#21468B'), 30, 20),
    'NO': (nordic('#BA0C2F', '#fff', '#00205B', w=33, h=24), 33, 24),
    'NZ': (au_nz('#C8102E', [(22.5, 5, 1.1), (19.5, 10, 1.1), (25.5, 9, 1.1), (22.5, 15.5, 1.2)], outline='#fff'), 30, 20),
    'PE': (vstripes('#D91023', '#fff', '#D91023'), 30, 20),
    'PL': (hstripes('#fff', '#DC143C'), 30, 20),
    'PT': ('<rect width="30" height="20" fill="#FF0000"/><rect width="12" height="20" fill="#006600"/><circle cx="12" cy="10" r="4" fill="#FFE900"/><circle cx="12" cy="10" r="2.4" fill="#FF0000"/><rect x="11" y="8.5" width="2" height="3" fill="#fff"/>', 30, 20),
    'RO': (vstripes('#002B7F', '#FCD116', '#CE1126'), 30, 20),
    'SE': (nordic('#006AA7', '#FECC00', w=32, h=20), 32, 20),
    'TR': (tr(), 30, 20),
    'UA': (hstripes('#0057B7', '#FFD700'), 30, 20),
    'US': (us(), 30, 20),
    'VA': ('<rect width="10" height="20" fill="#FFE000"/><rect x="10" width="10" height="20" fill="#fff"/><circle cx="15" cy="10" r="2" fill="none" stroke="#B5A033" stroke-width=".9"/>', 20, 20),
}
SQUARE = {'CH', 'VA', 'WELT'}  # показуються 12×12 замість 18×12


def svg_uri(body, w, h):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none">{body}</svg>'
    return 'url("data:image/svg+xml,' + quote(svg, safe=" =:/,.-'") + '")'


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    css_path = root / 'assets' / 'site.css'
    css = css_path.read_text(encoding='utf-8')
    lines = ['/* flags:start — ЗГЕНЕРОВАНО tools/build-flags.py, руками не редагувати */']
    for code in sorted(FLAGS):
        body, w, h = FLAGS[code]
        extra = 'width:12px; ' if code in SQUARE else ''
        if code == 'WELT':
            extra += 'box-shadow:none; border-radius:50%; '
        lines.append(f'.flag-{code}{{ {extra}background:{svg_uri(body, w, h)} center/100% 100% no-repeat; }}')
    lines.append('/* flags:end */')
    block = '\n'.join(lines)
    new, n = re.subn(r'/\* flags:start.*?/\* flags:end \*/', lambda _: block, css, flags=re.S)
    if n != 1:
        sys.exit('site.css: не знайдено блок /* flags:start … flags:end */')
    css_path.write_text(new, encoding='utf-8')
    print(f'{len(FLAGS)} прапорців → {css_path}')


if __name__ == '__main__':
    main()
