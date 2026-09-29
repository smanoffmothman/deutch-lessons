/* =================================================================
   lesson-interactions.js — спільна логіка для "зошитового" стилю
   Підключай ПІСЛЯ контенту через тег script із атрибутом
   src="../../assets/lesson-interactions.js" (шлях залежить від глибини).
   Дані конкретного уроку (тексти вправ, речення, аудіо) лишаються
   в самому файлі уроку — тут тільки поведінка, однакова для всіх.

   ВАЖЛИВО для автономних prev'ю-версій (де цей файл вставляється як
   інлайн-код прямо всередину тега script на сторінці, без окремого
   підключення через src): цей коментар навмисно НЕ містить закривного
   тега script як буквального тексту — HTML-парсер шукає точно таку
   послідовність символів (кутова дужка, коса риска, "script") незалежно
   від того, що вона в JS-коментарі, і обриває інлайн-скрипт раніше
   часу, якщо вона тут з'явиться. Описуй теги словами, а не пиши їх
   як робочу розмітку в цьому файлі.
   ================================================================= */

/* ---------- Вкладки (Start / Üb.1 / Üb.2 / ... / Fertig!) ---------- */
function initTabs(){
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab, tabs, panels)));
  const bar = document.querySelector('.tabbar');
  if(bar){
    bar.addEventListener('scroll', () => syncTabbar(false), {passive: true});
    window.addEventListener('resize', () => syncTabbar(false));
    window.addEventListener('load', () => syncTabbar(true, true)); // шрифти змінюють ширину вкладок
    syncTabbar(true, true);
  }
}
function showTab(name, tabs, panels){
  tabs = tabs || document.querySelectorAll('.tab-btn');
  panels = panels || document.querySelectorAll('.panel');
  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === name ? 'true' : 'false'));
  panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
  syncTabbar(true);
  window.scrollTo({top: 0, behavior: 'smooth'});
}
/* Панель вкладок на телефоні — один рядок з прокруткою (див. lesson-style.css).
   center=true — прокрутити рядок так, щоб активна вкладка стояла по центру
   (важливо для кнопок «Weiter»/«Zu den Übungen», які перемикають вкладку не
   кліком по ній). Клас more-right = праворуч є сховані вкладки (згасання
   краю). На широкому екрані рядок не переповнений — функція нічого не робить. */
function syncTabbar(center, instant){
  const bar = document.querySelector('.tabbar');
  if(!bar) return;
  const over = bar.scrollWidth > bar.clientWidth + 1;
  if(center && over){
    const btn = bar.querySelector('.tab-btn[aria-selected="true"]');
    if(btn){
      const r = bar.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const left = bar.scrollLeft + (b.left - r.left) - (r.width - b.width) / 2;
      bar.scrollTo({left: Math.max(0, left), behavior: instant ? 'auto' : 'smooth'});
    }
  }
  bar.classList.toggle('more-right', over && bar.scrollLeft + bar.clientWidth < bar.scrollWidth - 2);
}

/* ---------- Прогрес-смуга (літак вгорі) ---------- */
const progress = {total: 0, done: 0, key: null, ready: false};
function setTotal(n){ progress.total += n; renderProgress(); }
function markDone(n){ progress.done += n; renderProgress(); }
function renderProgress(){
  const pct = progress.total ? Math.min(100, (progress.done / progress.total) * 100) : 0;
  const plane = document.getElementById('progressPlane');
  const text = document.getElementById('progressText');
  if(plane) plane.style.left = pct + '%';
  if(text) text.textContent = progress.done + ' / ' + progress.total + ' Aufgaben gemeistert';
  if(progress.ready) persistProgress();
}

/* ---------- Збереження прогресу в браузері учня (2026-09) ----------
   Сторінка, яка хоче пам'ятати результат, викликає В КІНЦІ свого скрипту
   (після всіх buildQuiz/setTotal):   trackProgress('gram:perfekt-plusquamperfekt');
   Далі все автоматично: після кожної зміни прогресу в localStorage під
   ключем 'dmu:progress:<key>' лежить {total, done, best, at}.
   - best — найкращий результат за весь час (перезавантаження сторінки
     чи "Von vorn beginnen" його не зменшують);
   - якщо сторінку оновили й кількість завдань (total) змінилася, best
     обнуляється — старий результат уже не відповідає новому набору вправ.
   Зберігається лише ПІСЛЯ DOMContentLoaded: під час ініціалізації total
   росте поступово (кожен setTotal), і проміжні значення записувати не
   можна — інакше best обнулявся б на кожному кроці.
   Логіну немає: прогрес живе лише в цьому браузері на цьому пристрої.
   Читає ці дані сторінка gramatyka/ (site.js → loadStoredProgress, той
   самий префікс PROGRESS_PREFIX). Без localStorage (приватний режим,
   file://) усе мовчки працює як раніше, просто нічого не зберігається. */
const PROGRESS_PREFIX = 'dmu:progress:';
function trackProgress(key){
  progress.key = key;
  const start = () => { progress.ready = true; persistProgress(); };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
function persistProgress(){
  if(!progress.key || !progress.total) return;
  try {
    const k = PROGRESS_PREFIX + progress.key;
    let old = null;
    try { old = JSON.parse(localStorage.getItem(k)); } catch(_) {}
    const best = (old && old.total === progress.total) ? Math.max(old.best || 0, progress.done) : progress.done;
    localStorage.setItem(k, JSON.stringify({total: progress.total, done: progress.done, best: best, at: Date.now()}));
  } catch(_) { /* localStorage недоступний — нічого не зберігаємо */ }
}

/* ---------- Допоміжне: перемішати масив (Fisher–Yates) ----------
   ВАЖЛИВО: правильна відповідь у даних квізу (item.correct) НЕ повинна
   систематично збігатися з першим елементом item.opts — інакше учні
   просто клікають "перша кнопка" й проходять квіз, не читаючи питання.
   Тому buildQuiz завжди перемішує opts тут, під час рендеру, а не
   покладається на те, що масив вручну написали у випадковому порядку. */
function shuffleArray(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Міні-квіз з варіантами-кнопками ---------- */
// data: [{ q: "текст питання", opts: ["a","b"], correct: "b" }, ...]
// Кожне правильно вибрана відповідь додає +1 до прогресу.
// opts перемішується автоматично при кожному рендері (див. shuffleArray) —
// порядок варіантів у даних не має значення для того, де опиниться правильна.
//
// АНТИ-ЧІТ (2026-09): раніше при неправильному кліку функція сама одразу
// називала правильну відповідь текстом ("richtig wäre: ...") і підсвічувала
// потрібну кнопку зеленим, а всі кнопки одразу блокувалися. Учень міг
// навмисно клікати навмання, "виписати" собі всі правильні відповіді
// квізу, а тоді натиснути "Von vorn beginnen" (повне перезавантаження
// сторінки) і пройти вже з готовими відповідями — чистий бал без жодного
// реального знання. Тепер: (1) правильна відповідь ніколи не називається
// і не підсвічується текстом/кольором, поки учень сам її не знайде;
// (2) кнопки не блокуються після неправильного кліку — можна пробувати
// далі, це нормальне навчання методом виключення варіантів; (3) бал і
// прогрес фіксуються лише по ПЕРШІЙ реальній спробі кожного питання
// (як і в checkBlanks нижче) — подальші спроби так само дають живий
// колір-фідбек, але вже не впливають на рахунок. Питання блокується
// (кнопки вимикаються) лише тоді, коли учень сам натиснув правильну.
function buildQuiz(containerId, data){
  const wrap = document.getElementById(containerId);
  setTotal(data.length);
  data.forEach((item, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-q';
    div.innerHTML = `<p class="q-text">${qi+1}. ${item.q}</p><div class="quiz-opts"></div><p class="feedback"></p>`;
    const optsWrap = div.querySelector('.quiz-opts');
    let firstTryDone = false;
    shuffleArray(item.opts).forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt-btn'; b.textContent = o;
      b.addEventListener('click', () => {
        if(div.dataset.solved) return;
        const fb = div.querySelector('.feedback');
        const isCorrect = (o === item.correct);
        optsWrap.querySelectorAll('.opt-btn').forEach(x => x.classList.remove('wrong'));
        if(isCorrect){
          b.classList.add('correct');
          fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
          optsWrap.querySelectorAll('.opt-btn').forEach(x => x.disabled = true);
          div.dataset.solved = '1';
        } else {
          b.classList.add('wrong');
          fb.textContent = 'Nicht ganz — versuch es noch mal.'; fb.className = 'feedback bad';
        }
        if(!firstTryDone){
          firstTryDone = true;
          if(isCorrect) markDone(1);
        }
      });
      optsWrap.appendChild(b);
    });
    wrap.appendChild(div);
  });
}

/* ---------- Текстові пропуски й випадні списки ----------
   Поле вводу:   <input type="text" class="blank-input" data-ans="komme">
   Випадний список (з 2026-09):
                 <select class="blank" data-ans="dem">
                   <option value="">—</option><option>der</option><option>dem</option><option>den</option>
                 </select>
   Обидва типи перевіряються однаково — тією самою checkBlanks, у тому
   самому контейнері, можна змішувати в одній вправі.

   Кілька правильних відповідей (з 2026-09): data-ans="weil|da" — через "|".
   Потрібно, коли порядок слів чи синонім допускає варіанти.
   Порівняння (normAns): без пробілів по краях, кілька пробілів = один,
   ’ = ', кінцеві . ! ? ігноруються, регістр НЕ важливий. Якщо регістр
   важливий (іменник з великої літери — частина завдання), додай до поля
   атрибут data-case: тоді "tisch" вже не зарахується замість "Tisch".

   Таблиця-відмінювання = звичайна .gtable, у клітинках якої стоять
   input.blank-input / select.blank. Окремої функції не треба.

   АНТИ-ЧІТ (2026-09): раніше при неправильній відповіді функція сама
   дописувала текст "правильно: ..." одразу біля поля — учень міг просто
   скопіювати цей текст назад у поле й одразу отримати залік. Текстову
   підказку прибрано повністю (лишився тільки колір рамки — correct/wrong,
   без розкриття самої відповіді).

   Додатково: бал і прогрес фіксуються по ПЕРШІЙ реальній спробі кожного
   поля (перше НЕпорожнє значення, яке учень перевірив). Подальші зміни
   поля після цього так само підсвічуються (колір оновлюється живо), але
   вже не впливають на рахунок і на прогрес-смугу — це прибирає сенс
   гадати/підбирати відповідь по колу заради накрутки балів. Поле, яке
   ще жодного разу не перевірялось непорожнім, лишається "вільним" —
   перша непорожня перевірка стає для нього залікованою назавжди. */
// усі поля-пропуски контейнера в порядку документа (індекс = номер поля)
function blanksIn(containerId){
  const box = document.getElementById(containerId);
  return box ? box.querySelectorAll('.blank-input, select.blank') : [];
}
function normAns(s, keepCase){
  let v = String(s || '').replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
  return keepCase ? v : v.toLowerCase();
}
function blankIsCorrect(el){
  const keepCase = el.hasAttribute('data-case');
  const val = normAns(el.value, keepCase);
  if(val === '') return null; // порожньо — ще не відповідав
  return (el.dataset.ans || '').split('|').some(a => normAns(a, keepCase) === val);
}
function checkBlanks(containerId, scoreId, stateKey){
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(!(stateKey in state)) state[stateKey] = 0;
  const locked = checkBlanks._locked || (checkBlanks._locked = {});
  if(!(stateKey in locked)) locked[stateKey] = [];
  const lockedArr = locked[stateKey];

  let correct = 0, total = 0;
  blanksIn(containerId).forEach((inp, idx) => {
    total++;
    const res = blankIsCorrect(inp);
    inp.classList.remove('correct', 'wrong');

    // живий колір-фідбек на КОЖНУ перевірку (без тексту з відповіддю)
    if(res === true) inp.classList.add('correct');
    else if(res === false) inp.classList.add('wrong');

    // залік лише по першій непорожній спробі цього поля
    if(!lockedArr[idx] && res !== null){
      lockedArr[idx] = { correct: res };
    }
    if(lockedArr[idx] && lockedArr[idx].correct) correct++;
  });

  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = correct + ' / ' + total + ' richtig (1. Versuch zählt)';
  const newly = correct - state[stateKey];
  if(newly > 0){ markDone(newly); state[stateKey] = correct; }
  return {correct, total};
}
function resetBlanks(containerId, scoreId, stateKey){
  blanksIn(containerId).forEach(inp => {
    if(inp.tagName === 'SELECT') inp.selectedIndex = 0; else inp.value = '';
    inp.classList.remove('correct', 'wrong');
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = '';
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(state[stateKey] > 0){ progress.done -= state[stateKey]; state[stateKey] = 0; renderProgress(); }
  const locked = checkBlanks._locked || (checkBlanks._locked = {});
  locked[stateKey] = []; // повний ресет знімає й "заморозку" — чесний новий старт
}

/* Скорочення для типової вправи з пропусками (з 2026-09). Замість чотирьох
   рядків (setTotal + два addEventListener) — один виклик:
     wireBlanks('ub2');
   за домовленістю про id: контейнер #ub2-list, кнопки #ub2-check і
   #ub2-reset, лічильник #ub2-score. Старий спосіб теж працює. */
function wireBlanks(key){
  const list = key + '-list', score = key + '-score';
  setTotal(blanksIn(list).length);
  const c = document.getElementById(key + '-check'), r = document.getElementById(key + '-reset');
  if(c) c.addEventListener('click', () => checkBlanks(list, score, key));
  if(r) r.addEventListener('click', () => resetBlanks(list, score, key));
}

/* ---------- Клікабельні токени в тексті (span.tok[data-correct]) ----------
   HTML: <span class="tok" data-correct="true">nach Brasilien</span>
   Клік перемикає .picked; checkTokens зіставляє з data-correct. */
function initTokenClicks(containerId){
  document.querySelectorAll('#' + containerId + ' .tok').forEach(span => {
    if(span.dataset.locked) return;
    span.addEventListener('click', () => {
      if(span.dataset.checked) return;
      span.classList.toggle('picked');
    });
  });
}
function checkTokens(containerId, scoreId, stateKey){
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(!(stateKey in state)) state[stateKey] = 0;
  let correct = 0, wrong = 0, total = 0;
  document.querySelectorAll('#' + containerId + ' .tok').forEach(span => {
    if(span.dataset.locked) return;
    total++;
    span.dataset.checked = '1';
    const shouldPick = span.dataset.correct === 'true';
    const picked = span.classList.contains('picked');
    span.classList.remove('correct', 'wrong', 'missed');
    if(shouldPick && picked){ span.classList.add('correct'); correct++; }
    else if(shouldPick && !picked){ span.classList.add('missed'); }
    else if(!shouldPick && picked){ span.classList.add('wrong'); wrong++; }
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = correct + ' gefunden (' + wrong + ' Fehlgriffe)';
  const newly = correct - state[stateKey];
  if(newly > 0){ markDone(newly); state[stateKey] = correct; }
  return {correct, wrong, total};
}
function resetTokens(containerId, scoreId, stateKey){
  document.querySelectorAll('#' + containerId + ' .tok').forEach(span => {
    if(span.dataset.locked) return;
    span.classList.remove('picked', 'correct', 'wrong', 'missed');
    span.removeAttribute('data-checked');
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = '';
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(state[stateKey] > 0){ progress.done -= state[stateKey]; state[stateKey] = 0; renderProgress(); }
}

/* ---------- Склади речення (з 2026-09) ----------
   Учень клацає слова-картки в правильному порядку; клік по вже
   поставленій картці повертає її назад. Мишка й палець однаково — без
   перетягування, тож працює на телефоні.
     buildOrder('ub3-order', [
       { words: ["Ich", "habe", "gestern", "Fußball", "gespielt"], end: "." },
       { words: ["Gestern", "habe", "ich", "Fußball", "gespielt"], end: ".",
         alt: ["Ich habe gestern Fußball gespielt"], hint: "Почни з «Gestern»" }
     ]);
   - words — слова (чи групи слів) У ПРАВИЛЬНОМУ порядку; на екрані
     перемішуються автоматично. Групу, яку не можна розривати, пиши одним
     елементом: "am Wochenende".
   - alt — (необов'язково) інші правильні порядки цілим рядком.
   - end — (необов'язково) розділовий знак у кінці, показується поза картками.
   - hint — (необов'язково) підказка українською над реченням.
   - gross — (необов'язково) true, якщо перше слово ЗАВЖДИ пишеться з
     великої (ім'я, іменник без артикля: "Anna", "Berlin"). Див. нижче.
   Велика літера на початку речення (з 2026-09): у наборі карток перше
   слово правильного порядку показується з МАЛОЇ ("ich", "gestern"), щоб
   велика літера не підказувала, з чого починати; а та картка, що стоїть
   першою в реченні учня, сама показується з великої. Тому альтернативні
   порядки (alt) теж виглядають правильно: "Die Oma hat mir gestern …".
   Якщо перше слово — ім'я чи іменник, постав gross: true, інакше
   "Anna" в наборі стане "anna".
   Регістр при порівнянні не важливий, важливий лише порядок.
   Перевірка — автоматично, щойно всі картки поставлені. Зараховується
   ПЕРША повна спроба (той самий анти-чіт, що й у квізі); правильну
   відповідь функція не показує. Після правильної відповіді речення
   блокується. Кожне речення = +1 до прогресу. */
function buildOrder(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  setTotal(items.length);
  let solvedFirst = 0;
  const scoreEl = document.createElement('span');
  scoreEl.className = 'score-pill';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + items.length + ' richtig (1. Versuch zählt)'; };

  items.forEach((item, qi) => {
    const answers = [item.words.join(' ')].concat(item.alt || []).map(a => normAns(a));
    let order = shuffleArray(item.words.map((w, i) => i));
    // не віддавати одразу правильний порядок
    for(let t = 0; t < 5 && item.words.length > 1 && order.every((v, i) => v === i); t++) order = shuffleArray(order);

    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = (item.hint ? '<p class="order-hint">' + item.hint + '</p>' : '')
      + '<div class="order-line"><span class="num">' + (qi + 1) + ')</span><span class="order-slots" aria-live="polite"></span>'
      + (item.end ? '<span class="order-end">' + item.end + '</span>' : '') + '</div>'
      + '<div class="order-bank"></div><p class="feedback"></p>';
    const slots = div.querySelector('.order-slots'), bank = div.querySelector('.order-bank'), fb = div.querySelector('.feedback');
    let firstTryDone = false;

    function check(){
      if(bank.children.length) { fb.textContent = ''; fb.className = 'feedback'; div.classList.remove('is-wrong'); return; }
      const built = normAns(Array.from(slots.children).map(b => b.textContent).join(' '));
      const ok = answers.includes(built);
      if(ok){
        fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
        div.classList.remove('is-wrong'); div.classList.add('is-solved');
        slots.querySelectorAll('button').forEach(b => b.disabled = true);
      } else {
        fb.textContent = 'Noch nicht — ändere die Reihenfolge.'; fb.className = 'feedback bad';
        div.classList.add('is-wrong');
      }
      if(!firstTryDone){
        firstTryDone = true;
        if(ok){ markDone(1); solvedFirst++; updScore(); }
      }
    }
    // базова форма картки: перше слово — з малої (якщо не gross)
    const baseOf = i => (i === 0 && !item.gross) ? item.words[0].charAt(0).toLowerCase() + item.words[0].slice(1) : item.words[i];
    const capFirst = w => w.charAt(0).toUpperCase() + w.slice(1);
    function refreshCase(){
      Array.from(bank.children).forEach(b => { b.textContent = b.dataset.w; });
      Array.from(slots.children).forEach((b, pos) => { b.textContent = pos === 0 ? capFirst(b.dataset.w) : b.dataset.w; });
    }
    order.forEach(i => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'word-chip';
      b.dataset.w = baseOf(i); b.textContent = b.dataset.w;
      b.addEventListener('click', () => {
        if(div.classList.contains('is-solved')) return;
        (b.parentNode === bank ? slots : bank).appendChild(b);
        refreshCase();
        check();
      });
      bank.appendChild(b);
    });
    wrap.appendChild(div);
  });
  const bar = document.createElement('div');
  bar.className = 'check-bar';
  bar.appendChild(scoreEl); updScore();
  wrap.appendChild(bar);
}

/* ---------- Розсортуй по кошиках (з 2026-09) ----------
   Учень клацає картку, потім кошик — картка переїжджає туди. Клік по
   картці в кошику повертає її в загальний набір. Для der/die/das,
   Akkusativ/Dativ, haben/sein, trennbar/untrennbar тощо.
     buildSort('ub4-sort', {
       buckets: ["haben", "sein"],
       items: [ {t: "fahren", b: "sein"}, {t: "spielen", b: "haben"} ]
     });
   - buckets — назви кошиків (показуються як є);
   - items — картки, b = назва правильного кошика. Порядок карток
     перемішується автоматично.
   Під кошиками — кнопки Prüfen / Zurücksetzen, як у пропусках. Колір
   показує лише "правильно/неправильно" для розкладених карток (правильний
   кошик не називається). Зараховується ПЕРША перевірка кожної картки, що
   вже лежала в кошику, — той самий анти-чіт, що й у checkBlanks. */
function buildSort(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  setTotal(data.items.length);
  const locked = [];
  let counted = 0, selected = null;

  wrap.classList.add('sort-ex');
  wrap.innerHTML = '<p class="sort-tip">Натисни картку, а потім кошик, куди вона належить.</p><div class="sort-pool"></div><div class="sort-buckets"></div>'
    + '<div class="check-bar"><button class="btn" type="button">Prüfen</button><button class="btn secondary" type="button">Zurücksetzen</button><span class="score-pill"></span></div>';
  const pool = wrap.querySelector('.sort-pool'), bucketsEl = wrap.querySelector('.sort-buckets');
  const [checkBtn, resetBtn] = wrap.querySelectorAll('.check-bar .btn');
  const scoreEl = wrap.querySelector('.score-pill');

  const buckets = data.buckets.map(name => {
    const box = document.createElement('div');
    box.className = 'sort-bucket';
    box.innerHTML = '<button type="button" class="sort-bucket-head"></button><div class="sort-bucket-body"></div>';
    box.querySelector('.sort-bucket-head').textContent = name;
    box.dataset.name = name;
    const drop = () => {
      if(!selected) return;
      box.querySelector('.sort-bucket-body').appendChild(selected);
      selected.classList.remove('picked', 'correct', 'wrong');
      selected = null;
      wrap.classList.remove('has-pick');
    };
    box.querySelector('.sort-bucket-head').addEventListener('click', drop);
    box.querySelector('.sort-bucket-body').addEventListener('click', e => { if(e.target === e.currentTarget) drop(); });
    bucketsEl.appendChild(box);
    return box;
  });

  const cards = shuffleArray(data.items.map((it, i) => i)).map(i => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'word-chip'; b.textContent = data.items[i].t;
    b.dataset.idx = i;
    b.addEventListener('click', () => {
      if(b.parentNode !== pool){ // у кошику → назад у набір
        pool.appendChild(b); b.classList.remove('correct', 'wrong', 'picked');
        if(selected === b){ selected = null; wrap.classList.remove('has-pick'); }
        return;
      }
      if(selected) selected.classList.remove('picked');
      selected = (selected === b) ? null : b;
      if(selected) selected.classList.add('picked');
      wrap.classList.toggle('has-pick', !!selected);
    });
    pool.appendChild(b);
    return b;
  });

  checkBtn.addEventListener('click', () => {
    let correct = 0;
    cards.forEach(b => {
      b.classList.remove('correct', 'wrong');
      const box = b.closest('.sort-bucket');
      const i = +b.dataset.idx;
      if(!box) return;
      const ok = box.dataset.name === data.items[i].b;
      b.classList.add(ok ? 'correct' : 'wrong');
      if(!locked[i]) locked[i] = {correct: ok};
    });
    locked.forEach(l => { if(l && l.correct) correct++; });
    scoreEl.textContent = correct + ' / ' + data.items.length + ' richtig (1. Versuch zählt)';
    if(correct > counted){ markDone(correct - counted); counted = correct; }
  });
  resetBtn.addEventListener('click', () => {
    cards.forEach(b => { b.classList.remove('correct', 'wrong', 'picked'); pool.appendChild(b); });
    selected = null; wrap.classList.remove('has-pick');
    scoreEl.textContent = '';
    if(counted > 0){ progress.done -= counted; counted = 0; renderProgress(); }
    locked.length = 0; // чесний новий старт, як у resetBlanks
  });
}

/* ---------- Аудіоплеєр (Üb. Hören) ---------- */
function wirePlayer(audioId, playId, seekId, timeId){
  const audio = document.getElementById(audioId);
  const playBtn = document.getElementById(playId);
  const seek = document.getElementById(seekId);
  const timeLbl = document.getElementById(timeId);
  if(!audio || !playBtn) return;
  const errId = 'err' + audioId.replace('audio', '');
  const errMsg = document.getElementById(errId);
  playBtn.addEventListener('click', () => {
    if(audio.paused){
      const p = audio.play();
      playBtn.textContent = '❚❚';
      if(p && p.catch){
        p.catch(() => {
          playBtn.textContent = '▶';
          if(errMsg) errMsg.style.display = 'inline';
        });
      }
    } else {
      audio.pause(); playBtn.textContent = '▶';
    }
  });
  audio.addEventListener('timeupdate', () => {
    if(audio.duration){
      seek.value = (audio.currentTime / audio.duration) * 100;
      const m = Math.floor(audio.currentTime / 60), s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      if(timeLbl) timeLbl.textContent = m + ':' + s;
    }
  });
  audio.addEventListener('ended', () => { playBtn.textContent = '▶'; });
  if(seek) seek.addEventListener('input', () => {
    if(audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
}

/* ---------- Прикінцева панель зі штампами ---------- */
// icons: масив емодзі-мотивів модуля (напр. ['🏖️','⛰️','🗺️'])
function renderEndStamps(wrapId, textId, icons){
  const wrap = document.getElementById(wrapId);
  if(!wrap) return;
  wrap.innerHTML = '';
  const pct = progress.total ? progress.done / progress.total : 0;
  const earnedCount = Math.round(pct * icons.length);
  icons.forEach((ic, i) => {
    const d = document.createElement('div');
    d.className = 'stamp' + (i < earnedCount ? ' earned' : '');
    d.textContent = ic;
    wrap.appendChild(d);
  });
  const textEl = document.getElementById(textId);
  if(textEl) textEl.textContent = progress.done + ' von ' + progress.total + ' lösbaren Aufgaben richtig gelöst.';
}

/* ---------- Заборона вставки тексту в поля для письма (2026-09) ----------
   Проблема: у вправах на вільне письмо (textarea) учні копіювали готовий текст
   з інтернету / перекладача / чату з ШІ і вставляли його в поле.

   Рішення: УСІ textarea в уроці автоматично захищені від вставки — нічого
   в розмітці уроку дописувати не треба. Блокується:
   - Ctrl+V / Cmd+V і "Вставити" з контекстного меню (подія paste);
   - перетягування тексту мишкою в поле (подія drop);
   - вставка через beforeinput (inputType insertFromPaste / insertFromDrop /
     insertFromYank / insertFromPasteAsQuotation), зокрема на мобільних;
   - запасний варіант для телефонних клавіатур, де вставку з буфера не
     можна скасувати заздалегідь (напр. "чіп" буфера обміну в Gboard): якщо
     за ОДНУ подію input у поле додалося більше NO_PASTE_MAX_JUMP символів,
     зміна відкочується. Звичайний набір додає 1 символ, автовиправлення —
     кілька, тож учневі, який друкує сам, це не заважає.
   Копіювати СВІЙ текст З поля (щоб переписати в зошит) можна, як і раніше.

   Якщо в якомусь уроці вставка в конкретне поле потрібна (напр. поле для
   нотаток), додай до textarea атрибут data-allow-paste — його не чіпаємо.

   Обмеження (чесно): це "лежачий поліцейський", а не повний захист. Учень
   може передрукувати текст вручну з іншого пристрою, вимкнути JavaScript або
   скористатися інструментами розробника. Голосовий набір на телефоні, який
   вставляє одразу довге речення, теж буде відкочено. */
const NO_PASTE_MAX_JUMP = 30;
function guardNoPaste(el){
  if(!el || el.dataset.noPasteReady) return;
  el.dataset.noPasteReady = '1';

  let warnEl = null, warnTimer = null;
  function warn(){
    if(!warnEl){
      warnEl = document.createElement('p');
      warnEl.className = 'feedback bad';
      warnEl.setAttribute('role', 'status');
      el.insertAdjacentElement('afterend', warnEl);
    }
    warnEl.textContent = 'Einfügen ist hier nicht erlaubt ✗ Вставляти текст не можна — пиши сам(а).';
    clearTimeout(warnTimer);
    warnTimer = setTimeout(() => { if(warnEl) warnEl.textContent = ''; }, 4000);
  }

  ['paste', 'drop'].forEach(type => el.addEventListener(type, e => { e.preventDefault(); warn(); }));
  el.addEventListener('beforeinput', e => {
    if(/^insertFrom(Paste|Drop|Yank|PasteAsQuotation)/.test(e.inputType || '')){
      e.preventDefault(); warn();
    }
  });

  // запасний варіант: відкотити "стрибок" довжини тексту за одну подію
  let lastVal = el.value, lastStart = el.selectionStart, lastEnd = el.selectionEnd;
  const remember = () => { lastVal = el.value; lastStart = el.selectionStart; lastEnd = el.selectionEnd; };
  ['keydown', 'mouseup', 'focus', 'select'].forEach(type => el.addEventListener(type, remember));
  el.addEventListener('input', () => {
    if(el.value.length - lastVal.length > NO_PASTE_MAX_JUMP){
      el.value = lastVal;
      try { el.setSelectionRange(lastStart, lastEnd); } catch(_) {}
      warn();
    }
    remember();
  });
}
function initNoPaste(){
  document.querySelectorAll('textarea:not([data-allow-paste])').forEach(guardNoPaste);
}

document.addEventListener('DOMContentLoaded', initTabs);
document.addEventListener('DOMContentLoaded', initNoPaste);
