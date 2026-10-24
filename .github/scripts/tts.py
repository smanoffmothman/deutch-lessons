#!/usr/bin/env python3
"""Робот озвучення: перетворює сценарії **/audio/*.ssml на mp3 через Azure Speech.

Запускається GitHub Action'ом (.github/workflows/tts.yml):
  - після push у main, якщо змінився хоч один **/audio/*.ssml;
  - вручну: Actions → tts → Run workflow (поля «шлях» і «голоси»).

Що робить:
  1. Шукає всі **/audio/*.ssml і порівнює їхній sha256 з data/tts-lock.json.
     Хеш збігається → пропуск (ліміт не витрачається). Поле «шлях» при ручному
     запуску — примусово перегенерувати цей файл (або всі .ssml у цій теці).
  2. Перед кожним запитом перевіряє власний лічильник data/tts-usage.json:
     використано за місяць + розмір сценарію > TTS_MONTHLY_LIMIT → файл
     пропускається, запуск закінчується з помилкою.
  3. Запит до Azure (формат audio-24khz-48kbitrate-mono-mp3), пауза ≥ 4 с між
     запитами (F0: не більше 20 запитів за 60 с), на 429 — одна повторна спроба
     через 60 с. Помилка → mp3 не створюється, запуск червоний, текст помилки —
     у підсумку запуску.
  4. Перейдено 80 % ліміту → GitHub Issue «Озвучення: використано X з … за
     <місяць>» (один на місяць); 100 % → коментар у тому самому Issue.

Символи рахуються за всім вмістом .ssml (з тегами) — з запасом відносно Azure.
Місяць — календарний за UTC.

Секрети: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION. Змінна: TTS_MONTHLY_LIMIT
(за замовчуванням 400000). Ключ ніде не друкується.
"""
import datetime
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

LOCK = 'data/tts-lock.json'
USAGE = 'data/tts-usage.json'
FORMAT = 'audio-24khz-48kbitrate-mono-mp3'
PAUSE = 4.5          # с між запитами (F0: 20 запитів / 60 с)
RETRY_429 = 60       # с перед повторною спробою на 429
WARN_SHARE = 0.8     # поріг попередження

KEY = os.environ.get('AZURE_SPEECH_KEY', '').strip()
REGION = os.environ.get('AZURE_SPEECH_REGION', '').strip().lower().replace(' ', '')
LIMIT = int((os.environ.get('TTS_MONTHLY_LIMIT') or '400000').strip())
FORCE = (os.environ.get('TTS_FORCE_PATH') or '').strip().strip('/')
LIST_VOICES = (os.environ.get('TTS_LIST_VOICES') or '').strip().lower() in ('1', 'true', 'yes')
GH_TOKEN = os.environ.get('GITHUB_TOKEN', '')
GH_REPO = os.environ.get('GITHUB_REPOSITORY', '')
SUMMARY = os.environ.get('GITHUB_STEP_SUMMARY')
OUTPUT = os.environ.get('GITHUB_OUTPUT')

MONTH = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m')
TODAY = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')

summary_lines = []


def say(line=''):
    print(line, flush=True)
    summary_lines.append(line)


def annotate(kind, msg):
    # ::error:: / ::notice:: — видно у підсумку запуску й через API перевірок
    print(f'::{kind}::' + msg.replace('%', '%25').replace('\r', '').replace('\n', '%0A'), flush=True)


def fmt(n):
    return f'{n:,}'.replace(',', ' ')


def load_json(path):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write('\n')


def find_ssml():
    found = []
    for dirpath, dirnames, filenames in os.walk('.'):
        dirnames[:] = sorted(d for d in dirnames if not d.startswith('.'))
        if os.path.basename(dirpath) != 'audio':
            continue
        for name in sorted(filenames):
            if name.endswith('.ssml'):
                found.append(os.path.normpath(os.path.join(dirpath, name)).replace(os.sep, '/'))
    return found


def http(method, url, headers=None, body=None, timeout=120):
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read(), dict(e.headers or {})
    except Exception as e:  # мережа, тайм-аут
        return 0, str(e).encode(), {}


def synth(ssml_bytes):
    url = f'https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1'
    headers = {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': FORMAT,
        'User-Agent': 'deutschheft-tts',
    }
    status, data, hdrs = http('POST', url, headers, ssml_bytes)
    if status == 429:
        say(f'  429 (забагато запитів) — чекаю {RETRY_429} с і пробую ще раз')
        time.sleep(RETRY_429)
        status, data, hdrs = http('POST', url, headers, ssml_bytes)
    return status, data, hdrs


def error_text(status, data, hdrs):
    text = data.decode('utf-8', 'replace').strip()[:500]
    extra = [f'{k}: {v}' for k, v in hdrs.items()
             if k.lower() in ('x-microsoft-reason', 'x-requestid', 'retry-after')]
    parts = [f'HTTP {status}' if status else 'немає з\'єднання']
    if text:
        parts.append(text)
    parts += extra
    return ' · '.join(parts)


def gh_api(method, path, payload=None):
    if not (GH_TOKEN and GH_REPO):
        return 0, None
    body = json.dumps(payload).encode() if payload is not None else None
    status, data, _ = http(method, f'https://api.github.com/repos/{GH_REPO}{path}', {
        'Authorization': f'Bearer {GH_TOKEN}',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'deutschheft-tts',
    }, body, timeout=30)
    try:
        return status, json.loads(data or b'null')
    except Exception:
        return status, None


def warn_issue(used, before):
    """Issue на 80 %, коментар на 100 % — один Issue на місяць."""
    hit80 = before < LIMIT * WARN_SHARE <= used
    hit100 = before < LIMIT <= used
    if not (hit80 or hit100):
        return
    marker = f'за {MONTH}'
    title = f'Озвучення: використано {fmt(used)} з {fmt(LIMIT)} символів {marker}'
    number = None
    status, issues = gh_api('GET', '/issues?state=all&per_page=100&creator=github-actions%5Bbot%5D')
    if status == 200 and isinstance(issues, list):
        for it in issues:
            if it.get('title', '').startswith('Озвучення:') and it.get('title', '').endswith(marker):
                number = it['number']
                break
    text = (f'Робот озвучення використав **{fmt(used)} з {fmt(LIMIT)}** символів за {MONTH} '
            f'(власний ліміт `TTS_MONTHLY_LIMIT`; ліміт Azure F0 — 500 000).\n\n')
    if used >= LIMIT:
        text += ('Ліміт вичерпано: нові сценарії не озвучуються до початку наступного місяця '
                 '(UTC). Нічого платити не треба — на F0 гроші не списуються.')
    else:
        text += 'Озвучення працює далі, але до власного ліміту лишилось менше 20 %.'
    if number is None:
        gh_api('POST', '/issues', {'title': title, 'body': text})
        say(f'Відкрито Issue: {title}')
    else:
        gh_api('PATCH', f'/issues/{number}', {'title': title})
        gh_api('POST', f'/issues/{number}/comments', {'body': text})
        say(f'Коментар в Issue #{number}')


def list_voices():
    url = f'https://{REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list'
    status, data, hdrs = http('GET', url, {'Ocp-Apim-Subscription-Key': KEY, 'User-Agent': 'deutschheft-tts'})
    if status != 200:
        msg = f'Список голосів не отримано: {error_text(status, data, hdrs)}'
        say(msg)
        annotate('error', msg)
        return False
    voices = [v for v in json.loads(data) if v.get('Locale', '').startswith('de-')]
    hd = [v.get('ShortName', '') for v in voices if 'HD' in v.get('ShortName', '')]
    annotate('notice', f'Голоси de-* у регіоні {REGION}: {len(voices)}; HD: ' + (', '.join(hd) or 'немає'))
    say(f'### Німецькі голоси в регіоні {REGION} ({len(voices)})')
    say()
    say('| Голос | Стать | Тип | Стилі | Ролі |')
    say('|---|---|---|---|---|')
    for v in sorted(voices, key=lambda v: (v.get('Locale', ''), v.get('ShortName', ''))):
        say('| `{}` | {} | {} | {} | {} |'.format(
            v.get('ShortName', ''), v.get('Gender', ''), v.get('VoiceType', ''),
            ', '.join(v.get('StyleList') or []) or '—',
            ', '.join(v.get('RolePlayList') or []) or '—'))
    say()
    return True


def main():
    if not KEY or not REGION:
        say('Немає секретів AZURE_SPEECH_KEY / AZURE_SPEECH_REGION (Settings → Secrets and variables → Actions).')
        annotate('error', 'Немає секретів AZURE_SPEECH_KEY / AZURE_SPEECH_REGION')
        return 1

    ok_all = True
    say(f'## Озвучення — {TODAY}')
    say()
    if LIST_VOICES:
        ok_all = list_voices() and ok_all

    lock = load_json(LOCK)
    usage = load_json(USAGE)
    used = int(usage.get(MONTH, 0))
    used_start = used

    todo = []
    for path in find_ssml():
        with open(path, 'rb') as f:
            raw = f.read()
        digest = hashlib.sha256(raw).hexdigest()
        forced = bool(FORCE) and (path == FORCE or path.startswith(FORCE + '/'))
        mp3 = path[:-5] + '.mp3'
        if not forced and lock.get(path, {}).get('sha256') == digest and os.path.exists(mp3):
            continue
        todo.append((path, raw, digest))

    if FORCE and not any(p == FORCE or p.startswith(FORCE + '/') for p, _, _ in todo):
        say(f'Поле «шлях»: `{FORCE}` — сценаріїв .ssml там не знайдено.')
        annotate('error', f'Шлях {FORCE}: сценаріїв .ssml не знайдено')
        ok_all = False

    if not todo:
        say('Нових або змінених сценаріїв немає.')

    done_files, done_chars = 0, 0
    first = True
    for path, raw, digest in todo:
        text = raw.decode('utf-8-sig')
        chars = len(text)
        if used + chars > LIMIT:
            msg = (f'{path}: пропущено — ліміт місяця ({fmt(used)} + {fmt(chars)} > {fmt(LIMIT)})')
            say('- ✗ ' + msg)
            annotate('error', msg)
            ok_all = False
            continue
        if not first:
            time.sleep(PAUSE)
        first = False
        status, data, hdrs = synth(text.encode('utf-8'))
        if status == 200 and data:
            mp3 = path[:-5] + '.mp3'
            with open(mp3, 'wb') as f:
                f.write(data)
            before = used
            used += chars
            usage[MONTH] = used
            lock[path] = {'sha256': digest, 'chars': chars, 'date': TODAY}
            save_json(USAGE, usage)
            save_json(LOCK, lock)
            done_files += 1
            done_chars += chars
            msg = f'{path} → {os.path.basename(mp3)} ({fmt(chars)} символів, {len(data) // 1024} КБ)'
            say('- ✓ ' + msg)
            annotate('notice', 'Озвучено: ' + msg)
            warn_issue(used, before)
        else:
            msg = f'{path}: {error_text(status, data, hdrs)}'
            say('- ✗ ' + msg)
            annotate('error', msg)
            ok_all = False

    say()
    say(f'Озвучено: {done_files} файлів, {fmt(done_chars)} символів.')
    say(f'**За місяць ({MONTH}): {fmt(used)} / {fmt(LIMIT)}**')
    annotate('notice', f'За місяць ({MONTH}): {fmt(used)} / {fmt(LIMIT)} символів')

    if SUMMARY:
        with open(SUMMARY, 'a', encoding='utf-8') as f:
            f.write('\n'.join(summary_lines) + '\n')
    if OUTPUT:
        with open(OUTPUT, 'a', encoding='utf-8') as f:
            f.write(f'files={done_files}\nchars={done_chars}\n')
    return 0 if ok_all else 1


if __name__ == '__main__':
    sys.exit(main())
