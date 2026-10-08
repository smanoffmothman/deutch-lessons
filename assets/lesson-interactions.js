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
  if(name === 'ende') reportOnFertig(); // звіт для вчителя: підвантажити PDF-бібліотеки заздалегідь
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

/* ---------- Режим контрольної роботи (з 2026-10) ----------
   Звичайний урок = навчання: після неправильної відповіді можна шукати
   правильну далі (зараховується лише перша спроба). Для контрольної цього
   замало — учень бачить червоне й виправляє, тож у роботі лишаються
   "підправлені" відповіді. Тому для контрольних є режим, який вмикається
   ОДНИМ рядком у скрипті уроку:

     enableTestMode();                    // вкладка Hausaufgabe — не в оцінку
     enableTestMode({exclude: ['dz']});   // те саме явно
     enableTestMode({exclude: []});       // рахувати всі вкладки

   ВАЖЛИВО: виклик стоїть НА ПОЧАТКУ скрипту уроку — одразу після констант
   LEKTION_*, ДО renderDzVocabCheck і будь-яких buildQuiz/wireBlanks/...
   (функції дивляться на режим у момент побудови вправи).

   Що змінюється в усіх вправах, що НЕ у виключених вкладках:
   - buildQuiz: після першого ж натискання питання закривається; при
     неправильній відповіді — "Leider falsch ✗", правильна не показується;
   - checkBlanks / wireBlanks: після "Prüfen" заповнені поля й списки
     блокуються, порожні лишаються відкритими (можна дописати й перевірити
     пізніше); кнопка Zurücksetzen ховається, resetBlanks нічого не робить;
   - buildSort: розкладені й перевірені картки блокуються, Zurücksetzen
     сховано (поки не натиснуто Prüfen, картки можна переставляти);
   - buildOrder: щойно речення складене повністю — воно закрите (до цього
     картки можна повертати);
   - токени: checkTokens і так блокує після перевірки; resetTokens не діє.
   Виключені вкладки (типово Hausaufgabe з Wörter-Check) працюють як у
   звичайному уроці, але НЕ додаються до лічильника: літак угорі й
   "X von Y" у renderEndStamps показують лише результат контрольної.
   Для виключених вкладок використовуй функції, що рахують самі (buildQuiz,
   wireBlanks, buildOrder, buildSort) — ручний setTotal() там зарахувався б.

   Обмеження (чесно): перезавантаження сторінки стирає все, і учень може
   почати заново. На статичному сайті без логіну це не закрити. */
const testMode = {on: false, exclude: []};
function enableTestMode(opts){
  testMode.on = true;
  testMode.exclude = ((opts && opts.exclude) || ['dz']).map(t => 'panel-' + t);
}
// чи йде вправа в цьому контейнері в загальний результат
function isScored(containerId){
  if(!testMode.on) return true;
  const el = document.getElementById(containerId);
  return !(el && testMode.exclude.some(p => el.closest('#' + p)));
}
// чи діє в цьому контейнері правило "одна відповідь — без виправлень"
function isLocked(containerId){ return testMode.on && isScored(containerId); }

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
  const scored = isScored(containerId), locked = isLocked(containerId);
  if(scored) setTotal(data.length);
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
        } else if(locked){ // режим контрольної: одна спроба
          b.classList.add('wrong');
          fb.textContent = 'Leider falsch ✗'; fb.className = 'feedback bad';
          optsWrap.querySelectorAll('.opt-btn').forEach(x => x.disabled = true);
          div.dataset.solved = '1';
        } else {
          b.classList.add('wrong');
          fb.textContent = 'Nicht ganz — versuch es noch mal.'; fb.className = 'feedback bad';
        }
        if(!firstTryDone){
          firstTryDone = true;
          div.dataset.first = o; div.dataset.firstOk = isCorrect ? '1' : '0'; // для звіту вчителю
          if(isCorrect && scored) markDone(1);
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
  let v = String(s || '').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
  return keepCase ? v : v.toLowerCase();
}
function blankIsCorrect(el){
  const keepCase = el.hasAttribute('data-case');
  const val = normAns(el.value, keepCase);
  if(val === '') return null; // порожньо — ще не відповідав
  return (el.dataset.ans || '').split('|').some(a => normAns(a, keepCase) === val);
}
// що учень бачить у полі (для списку — текст обраного варіанта)
function blankShown(el){
  if(el.tagName === 'SELECT') return el.value && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text.trim() : '';
  return String(el.value || '').trim();
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
      inp.dataset.firstVal = blankShown(inp); inp.dataset.firstOk = res ? '1' : '0'; // для звіту вчителю
    }
    if(lockedArr[idx] && lockedArr[idx].correct) correct++;
  });

  // режим контрольної: заповнені поля після перевірки закриваються
  if(isLocked(containerId)){
    blanksIn(containerId).forEach(inp => { if(String(inp.value).trim() !== '') inp.disabled = true; });
  }

  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = correct + ' / ' + total + ' richtig (1. Versuch zählt)';
  const newly = correct - state[stateKey];
  if(newly > 0){ if(isScored(containerId)) markDone(newly); state[stateKey] = correct; }
  return {correct, total};
}
function resetBlanks(containerId, scoreId, stateKey){
  if(isLocked(containerId)) return; // контрольна: почати заново не можна
  blanksIn(containerId).forEach(inp => {
    if(inp.tagName === 'SELECT') inp.selectedIndex = 0; else inp.value = '';
    inp.classList.remove('correct', 'wrong');
    delete inp.dataset.firstVal; delete inp.dataset.firstOk;
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = '';
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(state[stateKey] > 0){
    if(isScored(containerId)){ progress.done -= state[stateKey]; renderProgress(); }
    state[stateKey] = 0;
  }
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
  if(isScored(list)) setTotal(blanksIn(list).length);
  const c = document.getElementById(key + '-check'), r = document.getElementById(key + '-reset');
  if(c) c.addEventListener('click', () => checkBlanks(list, score, key));
  if(r){
    if(isLocked(list)) r.style.display = 'none'; // контрольна: без Zurücksetzen
    else r.addEventListener('click', () => resetBlanks(list, score, key));
  }
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
  if(newly > 0){ if(isScored(containerId)) markDone(newly); state[stateKey] = correct; }
  return {correct, wrong, total};
}
function resetTokens(containerId, scoreId, stateKey){
  if(isLocked(containerId)) return; // контрольна: почати заново не можна
  document.querySelectorAll('#' + containerId + ' .tok').forEach(span => {
    if(span.dataset.locked) return;
    span.classList.remove('picked', 'correct', 'wrong', 'missed');
    span.removeAttribute('data-checked');
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = '';
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(state[stateKey] > 0){
    if(isScored(containerId)){ progress.done -= state[stateKey]; renderProgress(); }
    state[stateKey] = 0;
  }
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
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(items.length);
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
      } else if(lockedMode){ // режим контрольної: одна повна спроба
        fb.textContent = 'Leider falsch ✗'; fb.className = 'feedback bad';
        div.classList.add('is-wrong');
        slots.querySelectorAll('button').forEach(b => b.disabled = true);
      } else {
        fb.textContent = 'Noch nicht — ändere die Reihenfolge.'; fb.className = 'feedback bad';
        div.classList.add('is-wrong');
      }
      if(!firstTryDone){
        firstTryDone = true;
        // для звіту вчителю: речення першої спроби так, як його бачив учень
        div.dataset.first = Array.from(slots.children).map(b => b.textContent).join(' ') + (item.end || '');
        div.dataset.firstOk = ok ? '1' : '0';
        if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
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
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(data.items.length);
  const locked = [];
  let counted = 0, selected = null;

  wrap.classList.add('sort-ex');
  wrap.innerHTML = '<p class="sort-tip">Натисни картку, а потім кошик, куди вона належить.</p><div class="sort-pool"></div><div class="sort-buckets"></div>'
    + '<div class="check-bar"><button class="btn" type="button">Prüfen</button><button class="btn secondary" type="button">Zurücksetzen</button><span class="score-pill"></span></div>';
  const pool = wrap.querySelector('.sort-pool'), bucketsEl = wrap.querySelector('.sort-buckets');
  const [checkBtn, resetBtn] = wrap.querySelectorAll('.check-bar .btn');
  const scoreEl = wrap.querySelector('.score-pill');
  if(lockedMode) resetBtn.style.display = 'none'; // контрольна: без Zurücksetzen

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
      if(!locked[i]){
        locked[i] = {correct: ok};
        b.dataset.firstOk = ok ? '1' : '0'; b.dataset.firstBucket = box.dataset.name; // для звіту вчителю
      }
    });
    locked.forEach(l => { if(l && l.correct) correct++; });
    scoreEl.textContent = correct + ' / ' + data.items.length + ' richtig (1. Versuch zählt)';
    if(correct > counted){ if(scored) markDone(correct - counted); counted = correct; }
    // режим контрольної: перевірені картки в кошиках закриваються
    if(lockedMode) cards.forEach(b => { if(b.closest('.sort-bucket')) b.disabled = true; });
  });
  resetBtn.addEventListener('click', () => {
    if(lockedMode) return;
    cards.forEach(b => {
      b.classList.remove('correct', 'wrong', 'picked'); pool.appendChild(b);
      delete b.dataset.firstOk; delete b.dataset.firstBucket;
    });
    selected = null; wrap.classList.remove('has-pick');
    scoreEl.textContent = '';
    if(counted > 0){ if(scored){ progress.done -= counted; renderProgress(); } counted = 0; }
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

/* ---------- Результат контрольної: відсоток і бали (з 2026-10) ----------
   Рахує відсоток правильних відповідей з того самого лічильника, що й літак
   угорі (progress.done / progress.total), переводить його в бали за шкалою
   і малює підсумок + таблицю шкали з підсвіченим рядком учня. Таблицю в
   HTML уроку писати НЕ треба — вона будується з тієї самої шкали, тож
   підрахунок і таблиця ніколи не розійдуться.
   У режимі контрольної (enableTestMode) виключені вкладки (Hausaufgabe)
   сюди не входять — рахуються лише вправи контрольної.

   HTML (у Fertig!, усередині звичайної .card):  <div id="testResult"></div>
   Виклик — у тому самому обробнику вкладки Fertig!, що й renderEndStamps:
     renderTestResult('testResult', {
       label: 'Üb. 1–6',                            // що саме рахується
       extra: {label: 'E-Mail (Üb. 7)', max: 3}     // (необов'язково) бали вчителя
     });
   - scale — (необов'язково) шкала [[мін. %, бали], ...]. Типова — 9 балів:
     95→9, 85→8, 75→7, 65→6, 55→5, 45→4, 35→3, 25→2, 0→1; разом з extra
     max: 3 це дає 12-бальну систему.
   - Відсоток округлюється ВНИЗ до цілого (94,9 % → 94 % → 8 балів), щоб
     показане число завжди збігалося з рядком таблиці.
   - Невиконані завдання рахуються як неправильні (загальна кількість не
     змінюється). Поки вправи не виконані повністю, учень бачить підказку. */
const TEST_SCALE_DEFAULT = [[95, 9], [85, 8], [75, 7], [65, 6], [55, 5], [45, 4], [35, 3], [25, 2], [0, 1]];
function renderTestResult(boxId, opts){
  const box = document.getElementById(boxId);
  if(!box) return;
  opts = opts || {};
  const scale = (opts.scale || TEST_SCALE_DEFAULT).slice().sort((a, b) => b[0] - a[0]);
  const max = scale[0][1];
  const pct = progress.total ? Math.floor(progress.done / progress.total * 100) : 0;
  const hit = scale.find(r => pct >= r[0]) || scale[scale.length - 1];
  const label = opts.label || 'Kontrollarbeit';
  const extra = opts.extra || null;

  let html = '<p><span class="score-pill">' + progress.done + ' / ' + progress.total + ' richtig · ' + pct + ' %</span></p>'
    + '<p class="beispiel">→ <b>' + hit[1] + ' von ' + max + ' Punkten</b> für ' + label + '</p>';
  if(extra){
    html += '<p class="lead" style="margin:6px 0 0;">+ bis zu ' + extra.max + ' Punkte für ' + extra.label
      + ' — bewertet dein Lehrer / deine Lehrerin. Maximal: ' + (max + extra.max) + ' Punkte.</p>';
  }
  html += '<table class="gtable"><tr><th>Richtig gelöst (' + label + ')</th><th>Punkte</th></tr>';
  scale.forEach((r, i) => {
    const range = (r[0] === 0 && i > 0) ? 'unter ' + scale[i - 1][0] + ' %'
      : r[0] + '–' + (i === 0 ? 100 : scale[i - 1][0] - 1) + ' %';
    const mine = (r === hit);
    const st = mine ? ' style="background:var(--mustard-soft);font-weight:700;"' : '';
    html += '<tr' + st + '><td>' + range + '</td><td>' + r[1] + (mine ? ' ← dein Ergebnis' : '') + '</td></tr>';
  });
  if(extra) html += '<tr><td><b>+ ' + extra.label + '</b></td><td><b>0–' + extra.max + '</b></td></tr>';
  html += '</table>';
  box.innerHTML = html;
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

/* =================================================================
   ЗВІТ ДЛЯ ВЧИТЕЛЯ: PDF замість скріншотів (з 2026-10)
   =================================================================
   Проблема: учні здавали самостійну роботу в Google Classroom десятком
   скріншотів, а вчителю доводилося все це гортати.

   Рішення: у вкладці Fertig! КОЖНОЇ сторінки з вправами (уроки, граматика,
   включно зі старими уроками — розмітку правити не треба) автоматично
   з'являється картка "Bericht für die Lehrkraft": учень вписує ім'я →
   "Створити PDF" → "Надіслати" (меню "Поділитися" телефона → Google
   Classroom) або "Зберегти файл" (на комп'ютері — звичайне завантаження).

   Що в PDF: ім'я, урок, дата й час, загальний результат, а далі по кожній
   вкладці з вправами — відповіді учня ПЕРШОЇ спроби з позначками
   ✓ / ✗ / ? (заповнено, але не перевірено) / ____ (не виконано), повні
   тексти з textarea й кількість слів. ПРАВИЛЬНІ ВІДПОВІДІ В ЗВІТ НЕ
   ПОТРАПЛЯЮТЬ — лише те, що відповів сам учень (інакше PDF ходив би по
   класу як шпаргалка). Перша спроба фіксується тими самими функціями
   вправ (dataset.first / firstOk / firstVal / firstBucket), тож звіт
   збігається з балом "1. Versuch zählt".

   Як це працює технічно:
   - Картка вставляється перед footer.end-card у #panel-ende. Якщо на
     сторінці вже є елемент з id="dmuReport", використовується він (можна
     поставити картку деінде). Вимкнути на сторінці: атрибут data-no-report
     на body. Окрему вправу чи блок прибрати зі звіту: data-no-report на ньому.
   - Звіт збирається з DOM у момент натискання: квізи (.quiz-q), пропуски
     й списки (рядок .fill-item / рядок таблиці / абзац — з відповіддю
     прямо в тексті), токени (.tok), buildOrder, buildSort, textarea.
     Нестандартні вправи, зверстані вручну в окремому уроці, у звіт не
     потрапляють (лише їхні textarea / текстові поля, якщо є).
   - PDF малюється бібліотеками html2canvas + jsPDF з cdnjs, які
     завантажуються ЛИШЕ коли учень відкрив Fertig! (сторінки уроків не
     стають важчими). Сторінки PDF — картинки (текст у PDF не виділяється,
     зате його й не відредагувати як текст), A4, розрив сторінки лише між
     рядками, внизу кожної — ім'я, урок і номер сторінки.
   - Назва файлу: "<Ім'я> - 7A Lektion 5.pdf" (для граматики —
     "<Ім'я> - Grammatik - <тема>.pdf"; звичайний дефіс — найнадійніше
     для назв файлів на всіх пристроях).
   - "Надіслати" — Web Share API з файлом (Android/iPhone; на ПК там, де
     підтримується). Кнопка з'являється лише якщо пристрій уміє ділитися
     файлом; інакше — тільки "Зберегти файл".
   - Запасний варіант (немає інтернету для бібліотек, старий браузер):
     посилання "Зберегти через друк браузера" → той самий звіт у вікні
     друку (Зберегти як PDF).
   - Ім'я запам'ятовується в localStorage ('dmu:student-name'), щоб не
     вводити щоразу; без localStorage просто не запам'ятовується.

   Обмеження (чесно): ім'я учень вводить сам — підпис, а не логін. */
const REPORT_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];
const REPORT_NAME_KEY = 'dmu:student-name';
// A4 мінус поля 12 мм: 186 × 273 мм. Сторінка звіту = 760 css-px завширшки.
const RP = {W: 760, MM_W: 186, MM_H: 273, MARGIN: 12};
RP.PAGE_PX = Math.floor(RP.W * RP.MM_H / RP.MM_W); // ≈ 1115 px на сторінку
const report = {libs: null, blob: null, file: null, fname: ''};

function rpEsc(s){ return String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c])); }
function rpText(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
function rpEl(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
// відповідь учня з позначкою: state = ok | bad | open (не перевірено)
function rpAns(text, state, note){
  const mark = {ok: ' ✓', bad: ' ✗', open: ' ?'}[state] || '';
  return '<span class="rp-ans rp-' + state + '">' + rpEsc(text) + mark + '</span>'
    + (note ? ' <span class="rp-note">(' + rpEsc(note) + ')</span>' : '');
}
const RP_GAP = '<span class="rp-gap">______</span>';
// чи схований елемент усередині вкладки (напр. Wörter-Check у першому уроці модуля)
function rpHidden(el, panel){
  for(let n = el; n && n !== panel; n = n.parentElement){
    if(n.hidden || n.hasAttribute('data-no-report') || getComputedStyle(n).display === 'none') return true;
  }
  return false;
}

/* --- окремі типи вправ → рядки звіту. Кожен повертає {html, ok, n, empty} --- */
function rpBlankState(el){
  const cur = blankShown(el);
  if('firstOk' in el.dataset){
    const first = el.dataset.firstVal || '';
    const later = cur && normAns(cur) !== normAns(first) ? 'потім: ' + cur : '';
    return {html: rpAns(first, el.dataset.firstOk === '1' ? 'ok' : 'bad', later), ok: el.dataset.firstOk === '1', empty: false};
  }
  if(cur) return {html: rpAns(cur, 'open', 'не перевірено'), ok: false, empty: false};
  return {html: RP_GAP, ok: false, empty: true};
}
function rpBlankLine(line){
  const orig = line.querySelectorAll('.blank-input, select.blank');
  const states = Array.from(orig).map(rpBlankState);
  const clone = line.cloneNode(true);
  clone.querySelectorAll('button, script, style, .blank-hint, .feedback').forEach(n => n.remove());
  clone.querySelectorAll('.blank-input, select.blank').forEach((c, i) => c.replaceWith(document.createTextNode('\u0001' + i + '\u0002')));
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const text = clone.tagName === 'TR'
    ? Array.from(clone.cells).map(c => norm(c.textContent)).filter(Boolean).join('  ·  ')
    : norm(clone.textContent);
  const html = rpEsc(text).replace(/\u0001(\d+)\u0002/g, (m, i) => states[+i] ? states[+i].html : '');
  return {html: html, ok: states.filter(s => s.ok).length, n: states.length, empty: states.filter(s => s.empty).length};
}
function rpQuiz(q){
  const text = rpEsc(rpText(q.querySelector('.q-text')));
  if(!('firstOk' in q.dataset)) return {html: '<span class="rp-q">' + text + '</span> → ' + RP_GAP, ok: 0, n: 1, empty: 1};
  const ok = q.dataset.firstOk === '1';
  const later = !ok && q.querySelector('.opt-btn.correct') ? 'потім знайшов(-ла) правильну' : '';
  return {html: '<span class="rp-q">' + text + '</span> → ' + rpAns(q.dataset.first, ok ? 'ok' : 'bad', later), ok: ok ? 1 : 0, n: 1, empty: 0};
}
function rpOrder(div){
  const num = rpText(div.querySelector('.order-line .num'));
  const hint = div.querySelector('.order-hint');
  const pre = (hint ? '<span class="rp-muted">' + rpEsc(rpText(hint)) + '</span><br>' : '') + rpEsc(num) + ' ';
  if(!('firstOk' in div.dataset)){
    const part = Array.from(div.querySelectorAll('.order-slots .word-chip')).map(b => b.textContent).join(' ');
    return {html: pre + (part ? rpAns(part + ' …', 'open', 'не дописано') : RP_GAP), ok: 0, n: 1, empty: part ? 0 : 1};
  }
  const ok = div.dataset.firstOk === '1';
  const later = !ok && div.classList.contains('is-solved') ? 'потім склав(-ла) правильно' : '';
  return {html: pre + rpAns(div.dataset.first, ok ? 'ok' : 'bad', later), ok: ok ? 1 : 0, n: 1, empty: 0};
}
function rpSort(wrap){
  const cards = Array.from(wrap.querySelectorAll('.word-chip'));
  const groups = {}, order = [];
  wrap.querySelectorAll('.sort-bucket').forEach(b => { groups[b.dataset.name] = []; order.push(b.dataset.name); });
  const loose = [];
  let ok = 0, empty = 0;
  cards.forEach(c => {
    const t = c.textContent;
    if('firstOk' in c.dataset){ // перша перевірка — у якому кошику картка лежала тоді
      const good = c.dataset.firstOk === '1'; if(good) ok++;
      (groups[c.dataset.firstBucket] || (groups[c.dataset.firstBucket] = [])).push(rpAns(t, good ? 'ok' : 'bad'));
    } else {
      const box = c.closest('.sort-bucket');
      if(box) groups[box.dataset.name].push(rpAns(t, 'open'));
      else { loose.push(rpEsc(t)); empty++; }
    }
  });
  let html = order.map(name => '<b>' + rpEsc(name) + ':</b> ' + (groups[name].length ? groups[name].join(' ') : '—')).join('<br>');
  if(loose.length) html += '<br><span class="rp-muted">не розкладено: ' + loose.join(', ') + '</span>';
  return {html: html, ok: ok, n: cards.length, empty: empty};
}
function rpTokens(box){
  const toks = Array.from(box.querySelectorAll('.tok')).filter(t => !t.dataset.locked);
  const need = toks.filter(t => t.dataset.correct === 'true');
  const picked = toks.filter(t => t.classList.contains('picked'));
  const checked = toks.some(t => t.dataset.checked);
  if(!picked.length) return {html: 'Позначено: ' + RP_GAP, ok: 0, n: need.length, empty: need.length};
  let ok = 0;
  const list = picked.map(t => {
    if(!checked) return rpAns(rpText(t), 'open');
    const good = t.dataset.correct === 'true'; if(good) ok++;
    return rpAns(rpText(t), good ? 'ok' : 'bad');
  }).join(' ');
  const missed = checked ? need.length - ok : 0;
  return {html: 'Позначено: ' + list + (checked ? '' : ' <span class="rp-note">(не перевірено)</span>')
    + (missed > 0 ? ' <span class="rp-muted">· не знайдено: ' + missed + '</span>' : ''), ok: ok, n: need.length, empty: 0};
}
function rpFieldLabel(el){
  const qa = el.closest('.qa');
  const lbl = (qa && qa.querySelector('label')) || (el.id && document.querySelector('label[for="' + el.id + '"]'));
  return rpText(lbl) || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';
}
function rpWords(n){ // 1 слово, 2–4 слова, 5+ слів, 21 слово
  const d = n % 10, h = n % 100;
  if(d === 1 && h !== 11) return 'слово';
  if(d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'слова';
  return 'слів';
}
function rpTextarea(el){
  const v = String(el.value || '').trim();
  const label = rpFieldLabel(el);
  const words = v ? v.split(/\s+/).length : 0;
  const head = (label ? '<span class="rp-q">' + rpEsc(label) + '</span> ' : '')
    + '<span class="rp-note">(' + words + ' ' + rpWords(words) + ')</span>';
  if(!v) return {html: head + '<div class="rp-text rp-muted">порожньо</div>', ok: 0, n: 0, empty: 0};
  // довгий текст ріжемо на шматки (~10 рядків), щоб сторінки PDF рвалися між ними
  const chunks = rpChunks(v, 700, 10);
  return {html: head + '<div class="rp-text">' + rpEsc(chunks[0]) + '</div>',
    more: chunks.slice(1).map(c => '<div class="rp-text">' + rpEsc(c) + '</div>'), ok: 0, n: 0, empty: 0};
}
function rpChunks(text, maxChars, maxLines){
  const out = [];
  let cur = '';
  const lines = text.split('\n');
  const push = () => { if(cur !== '') out.push(cur); cur = ''; };
  lines.forEach(line => {
    // дуже довгий рядок без переносів — ділимо за пробілами
    while(line.length > maxChars){
      let cut = line.lastIndexOf(' ', maxChars);
      if(cut < maxChars / 2) cut = maxChars;
      push(); out.push(line.slice(0, cut)); line = line.slice(cut).replace(/^ /, '');
    }
    const next = cur === '' ? line : cur + '\n' + line;
    if(cur !== '' && (next.length > maxChars || next.split('\n').length > maxLines)){ push(); cur = line; }
    else cur = next;
  });
  push();
  return out.length ? out : [text];
}

// усі рядки звіту для однієї вкладки
function rpCollectPanel(panel){
  const rows = [];
  const seen = new Set();
  let lastCard = null;
  const sel = '.quiz-q, .order-item, .sort-ex, textarea, input.blank-input, select.blank, .tok, input[type="text"]';
  panel.querySelectorAll(sel).forEach(el => {
    if(el.closest('.report-card') || rpHidden(el, panel)) return;
    let key = el, row = null;
    if(el.matches('.sort-ex')) row = rpSort(el);
    else if(el.closest('.sort-ex')) return;
    else if(el.matches('.quiz-q')) row = rpQuiz(el);
    else if(el.matches('.order-item')) row = rpOrder(el);
    else if(el.matches('textarea')) row = rpTextarea(el);
    else if(el.matches('.tok')){
      key = el.parentElement.closest('[id]') || el.parentElement;
      if(seen.has(key)) return;
      row = rpTokens(key);
    } else if(el.matches('.blank-input, select.blank')){
      key = el.closest('.fill-item, tr, li, .match-row, .wo-row, .qa, p') || el.parentElement;
      if(!panel.contains(key) || key === panel) key = el.parentElement;
      if(seen.has(key)) return;
      row = rpBlankLine(key);
    } else { // інше текстове поле без перевірки — показати, лише якщо заповнене
      const v = String(el.value || '').trim();
      if(!v) return;
      const label = rpFieldLabel(el);
      row = {html: (label ? '<span class="rp-q">' + rpEsc(label) + ':</span> ' : '') + '<span class="rp-ans rp-plain">' + rpEsc(v) + '</span>', ok: 0, n: 0, empty: 0};
    }
    seen.add(key);
    // підзаголовок картки всередині вкладки (напр. "Wörter-Check")
    const card = el.closest('.card');
    const lbl = card && card.querySelector(':scope > .section-label');
    if(card !== lastCard){ lastCard = card; if(lbl) rows.push({sub: rpText(lbl)}); }
    rows.push(row);
  });
  return rows;
}

function rpLessonTitle(){
  const badge = rpText(document.querySelector('.hero .hero-badge'));
  const h1 = rpText(document.querySelector('.hero h1'));
  return (badge ? badge + ' — ' : '') + (h1 || document.title);
}
function rpLessonShort(){
  try {
    if(typeof LEKTION_KLAS !== 'undefined' && LEKTION_KLAS && LEKTION_KLAS !== '...')
      return LEKTION_KLAS + (typeof LEKTION_MODUL !== 'undefined' ? LEKTION_MODUL : '') + ' Lektion ' + (typeof LEKTION_LEKTION !== 'undefined' ? LEKTION_LEKTION : '');
  } catch(_) {}
  const h1 = rpText(document.querySelector('.hero h1'));
  try { if(typeof GRAM_ID !== 'undefined') return 'Grammatik - ' + h1; } catch(_) {}
  return h1 || document.title.split('·')[0].trim();
}
function rpFileName(name){
  return (name + ' - ' + rpLessonShort()).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) + '.pdf';
}

/* Збирає звіт у вигляді "одиниць" (шапка, заголовки вкладок, рядки) —
   щоб розбивати на сторінки PDF лише між ними. */
function rpBuildUnits(name){
  const units = [];
  let total = 0, okAll = 0, emptyAll = 0;
  const blocks = [];
  document.querySelectorAll('.panel').forEach(panel => {
    if(/^panel-(start|regel|ende)$/.test(panel.id) || panel.hasAttribute('data-no-report')) return;
    const rows = rpCollectPanel(panel);
    if(!rows.length) return;
    const tab = document.querySelector('.tab-btn[data-tab="' + panel.id.replace(/^panel-/, '') + '"]');
    const title = rpText(tab) || rpText(panel.querySelector('.panel-title')) || panel.id;
    let ok = 0, n = 0;
    rows.forEach(r => { if(!r.sub){ ok += r.ok || 0; n += r.n || 0; emptyAll += r.empty || 0; } });
    total += n; okAll += ok;
    blocks.push({title: title, rows: rows, ok: ok, n: n});
  });

  const when = new Date().toLocaleString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  const pct = total ? Math.floor(okAll / total * 100) : 0;
  units.push(rpEl('div', 'rp-head',
    '<div class="rp-brand">Deutsch mit uns · Bericht für die Lehrkraft</div>'
    + '<div class="rp-title">' + rpEsc(rpLessonTitle()) + '</div>'
    + '<div class="rp-meta"><b>Учень / учениця:</b> ' + rpEsc(name) + '</div>'
    + '<div class="rp-meta"><b>Сформовано:</b> ' + rpEsc(when) + '</div>'
    + (total ? '<div class="rp-meta"><b>Результат з першої спроби:</b> ' + okAll + ' / ' + total + ' (' + pct + ' %)'
      + (emptyAll ? ' · <span class="rp-bad-txt">не виконано: ' + emptyAll + '</span>' : '') + '</div>' : '')
    + '<div class="rp-legend"><span class="rp-ans rp-ok">✓</span> правильно з першої спроби &nbsp; <span class="rp-ans rp-bad">✗</span> неправильно з першої спроби &nbsp; <span class="rp-ans rp-open">?</span> заповнено, але не перевірено &nbsp; ' + RP_GAP + ' не виконано</div>'));
  blocks.forEach(b => {
    units.push(rpEl('div', 'rp-block-head', '<span>' + rpEsc(b.title) + '</span>' + (b.n ? '<span class="rp-block-score">' + b.ok + ' / ' + b.n + ' ✓</span>' : '')));
    b.rows.forEach(r => {
      if(r.sub){ units.push(rpEl('div', 'rp-sub', rpEsc(r.sub))); return; }
      units.push(rpEl('div', 'rp-row' + (r.more && r.more.length ? ' rp-has-more' : ''), r.html));
      (r.more || []).forEach((m, k) => units.push(rpEl('div', 'rp-row rp-cont' + (k < r.more.length - 1 ? ' rp-has-more' : ''), m)));
    });
  });
  return {units: units, empty: emptyAll, blocks: blocks.length};
}

function rpLoadLibs(){
  if(window.html2canvas && window.jspdf) return Promise.resolve();
  if(report.libs) return report.libs;
  report.libs = Promise.all(REPORT_LIBS.map(src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = res; s.onerror = () => rej(new Error('Не завантажилось: ' + src));
    document.head.appendChild(s);
  }))).catch(e => { report.libs = null; throw e; });
  return report.libs;
}

// розкладає одиниці по сторінках (заголовок вкладки не лишається внизу сторінки сам)
function rpPaginate(units, stage){
  const FOOT = 34, LIMIT = RP.PAGE_PX - FOOT;
  const meas = rpEl('div', 'rp-page-body');
  stage.appendChild(meas);
  units.forEach(u => meas.appendChild(u));
  const hs = units.map(u => u.offsetHeight);
  stage.removeChild(meas);
  const pages = [[]];
  let h = 0;
  units.forEach((u, i) => {
    const isHead = u.classList.contains('rp-block-head') || u.classList.contains('rp-sub');
    // заголовок тягне за собою хоча б початок наступного рядка (не весь, якщо той величезний)
    const need = hs[i] + (isHead && i + 1 < units.length ? Math.min(hs[i + 1], 120) : 0);
    if(h > 0 && h + need > LIMIT){ pages.push([]); h = 0; }
    pages[pages.length - 1].push(u);
    h += hs[i];
  });
  return pages;
}

async function rpMakePdf(name){
  const built = rpBuildUnits(name);
  const stage = rpEl('div', 'rp-stage');
  document.body.appendChild(stage);
  try {
    const pages = rpPaginate(built.units, stage);
    const short = rpLessonShort();
    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait', compress: true});
    let pdfPages = 0;
    for(let p = 0; p < pages.length; p++){
      const page = rpEl('div', 'rp-page');
      const body = rpEl('div', 'rp-page-body');
      pages[p].forEach(u => body.appendChild(u));
      page.appendChild(body);
      page.appendChild(rpEl('div', 'rp-foot', '<span>' + rpEsc(name) + ' · ' + rpEsc(short) + '</span><span>' + (p + 1) + ' / ' + pages.length + '</span>'));
      stage.innerHTML = ''; stage.appendChild(page);
      const canvas = await window.html2canvas(page, {
        scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true,
        scrollX: 0, scrollY: 0, windowWidth: RP.W + 40,
        ignoreElements: el => el.classList && (el.classList.contains('app') || el.id === 'siteNav' || el.id === 'crumbs')
      });
      // сторінка вища за A4 лише якщо один рядок довший за сторінку (величезний текст) — ріжемо
      const pxPerMm = canvas.width / RP.MM_W, sliceH = Math.floor(RP.MM_H * pxPerMm);
      for(let y = 0; y < canvas.height; y += sliceH){
        const h = Math.min(sliceH, canvas.height - y);
        if(h < 4) break;
        const part = document.createElement('canvas');
        part.width = canvas.width; part.height = h;
        const ctx = part.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, part.width, h);
        ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
        if(pdfPages++) pdf.addPage();
        pdf.addImage(part.toDataURL('image/jpeg', 0.85), 'JPEG', RP.MARGIN, RP.MARGIN, RP.MM_W, h / pxPerMm);
      }
    }
    return {blob: pdf.output('blob'), pages: pdfPages, empty: built.empty, blocks: built.blocks};
  } finally {
    stage.remove();
  }
}

// запасний варіант: той самий звіт у вікні друку браузера ("Зберегти як PDF")
function rpPrint(name){
  let holder = document.getElementById('dmuReportPrint');
  if(!holder){ holder = rpEl('div'); holder.id = 'dmuReportPrint'; document.body.appendChild(holder); }
  holder.innerHTML = '';
  const sheet = rpEl('div', 'rp-sheet');
  rpBuildUnits(name).units.forEach(u => sheet.appendChild(u));
  holder.appendChild(sheet);
  const oldTitle = document.title;
  document.title = rpFileName(name).replace(/\.pdf$/, ''); // браузер бере назву файлу із заголовка
  document.body.classList.add('dmu-printing');
  const done = () => { document.body.classList.remove('dmu-printing'); document.title = oldTitle; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
}

function rpDownload(){
  if(!report.blob) return;
  const url = URL.createObjectURL(report.blob);
  const a = rpEl('a');
  a.href = url; a.download = report.fname;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function initReport(){
  if(document.body.hasAttribute('data-no-report')) return;
  const ende = document.getElementById('panel-ende');
  if(!ende) return;
  if(!document.querySelector('.panel .quiz-q, .panel .blank-input, .panel select.blank, .panel textarea, .panel .tok, .panel .order-item, .panel .sort-ex')) return;

  let card = document.getElementById('dmuReport');
  if(!card){
    card = rpEl('div'); card.id = 'dmuReport';
    const footer = ende.querySelector('footer.end-card');
    if(footer) ende.insertBefore(card, footer); else ende.appendChild(card);
  }
  card.classList.add('card', 'report-card');
  card.innerHTML =
      '<p class="section-label" style="margin:0 0 6px;">Bericht für die Lehrkraft</p>'
    + '<p class="lead" style="font-size:15px;">Збережи свої відповіді одним PDF-файлом і прикріпи його до завдання в Google Classroom — замість скріншотів.</p>'
    + '<label class="report-label" for="dmuReportName">Ім\'я та прізвище</label>'
    + '<input type="text" class="report-name" id="dmuReportName" data-no-umlaut autocomplete="name" maxlength="60" placeholder="напр. Марія Іваненко">'
    + '<div class="check-bar"><button class="btn" type="button" id="dmuReportMake">Створити PDF</button>'
    + '<span class="report-status" id="dmuReportStatus" role="status"></span></div>'
    + '<div class="report-ready" id="dmuReportReady" hidden>'
    + '<p id="dmuReportInfo"></p>'
    + '<div class="check-bar"><button class="btn" type="button" id="dmuReportShare">📤 Надіслати (Classroom)</button>'
    + '<button class="btn secondary" type="button" id="dmuReportSave">⬇ Зберегти файл</button></div></div>'
    + '<p class="report-alt">Не виходить? <button type="button" class="linklike" id="dmuReportPrintBtn">Зберегти через друк браузера</button></p>';

  const $ = id => document.getElementById(id);
  const nameIn = $('dmuReportName'), status = $('dmuReportStatus'), ready = $('dmuReportReady');
  try { nameIn.value = localStorage.getItem(REPORT_NAME_KEY) || ''; } catch(_) {}
  const say = (msg, bad) => { status.textContent = msg; status.className = 'report-status' + (bad ? ' bad' : ''); };
  const getName = () => {
    const v = nameIn.value.replace(/\s+/g, ' ').trim();
    if(v.length < 2){ say('Впиши, будь ласка, ім\'я та прізвище.', true); nameIn.focus(); return ''; }
    try { localStorage.setItem(REPORT_NAME_KEY, v); } catch(_) {}
    return v;
  };
  nameIn.addEventListener('input', () => { ready.hidden = true; say(''); });
  nameIn.addEventListener('focus', () => { rpLoadLibs().catch(() => {}); });

  $('dmuReportMake').addEventListener('click', async () => {
    const name = getName(); if(!name) return;
    const btn = $('dmuReportMake');
    btn.disabled = true; ready.hidden = true;
    say('Готую PDF… це кілька секунд.');
    try {
      await rpLoadLibs();
      const res = await rpMakePdf(name);
      report.blob = res.blob; report.fname = rpFileName(name);
      report.file = null;
      try { report.file = new File([res.blob], report.fname, {type: 'application/pdf'}); } catch(_) {}
      const canShare = !!(report.file && navigator.canShare && navigator.share && navigator.canShare({files: [report.file]}));
      $('dmuReportShare').hidden = !canShare;
      $('dmuReportInfo').innerHTML = '✓ Готово: <b>' + rpEsc(report.fname) + '</b> · ' + res.pages + ' стор.'
        + (res.empty ? '<br><span class="rp-bad-txt">Увага: ' + res.empty + ' завд. не виконано — у звіті вони порожні.</span>' : '')
        + (canShare ? '<br>Натисни «Надіслати» й обери Google Classroom (або збережи файл і прикріпи його до завдання).' : '<br>Збережи файл і прикріпи його до завдання в Google Classroom.');
      ready.hidden = false;
      say('');
    } catch(e){
      console.error(e);
      say('Не вдалося створити PDF (можливо, немає інтернету). Спробуй ще раз або збережи через друк браузера нижче.', true);
    } finally {
      btn.disabled = false;
    }
  });
  $('dmuReportShare').addEventListener('click', async () => {
    if(!report.file) return rpDownload();
    try { await navigator.share({files: [report.file]}); }
    catch(e){ if(!(e && e.name === 'AbortError')) rpDownload(); }
  });
  $('dmuReportSave').addEventListener('click', rpDownload);
  $('dmuReportPrintBtn').addEventListener('click', () => { const name = getName(); if(name) rpPrint(name); });
}
// викликається з showTab при відкритті Fertig!: старий PDF уже неактуальний,
// а бібліотеки краще почати вантажити заздалегідь
function reportOnFertig(){
  const ready = document.getElementById('dmuReportReady');
  if(!ready) return;
  ready.hidden = true;
  rpLoadLibs().catch(() => {});
}

/* ---------- Панель німецьких літер ä ö ü ß (з 2026-10) ----------
   Проблема: не в усіх учнів на телефоні чи комп'ютері є німецька розкладка,
   і набрати ä / ö / ü / ß у полі відповіді їм просто нічим.

   Рішення: щойно учень ставить курсор у текстове поле (input type="text" —
   пропуски, клітинки таблиць — і textarea), унизу екрана з'являється
   компактна панель  ä ö ü ß ⇧ . Курсор пішов з поля — панель ховається.
   Нічого в розмітці уроку дописувати не треба: працює на всіх сторінках,
   що підключають цей файл (уроки, граматика, старі теж).
   - Літера вставляється в місце курсора (або замість виділеного тексту).
   - ⇧ — одна наступна літера велика (Ä Ö Ü), як Shift на телефоні.
     ß лишається ß (на початку слова не буває).
   - Натискання кнопки НЕ забирає фокус з поля (preventDefault на
     pointerdown/mousedown), тож клавіатура телефона не закривається.
   - Після вставки поле отримує звичайну подію input — захист від вставки
     (guardNoPaste) бачить +1 символ і не заважає.
   - На телефоні панель стоїть над екранною клавіатурою (visualViewport —
     iPhone кладе клавіатуру поверх сторінки), а поле, якщо панель його
     закриває, прокручується вище.
   - Заблоковані поля (disabled/readonly — напр. режим контрольної після
     Prüfen) панель не отримують.
   Вимкнути: атрибут data-no-umlaut на полі, на будь-якому блоці навколо
   нього або на body (уся сторінка). Поле імені у звіті для вчителя вже
   має цей атрибут. */
const UMLAUT_KEYS = ['ä', 'ö', 'ü', 'ß'];
const umlautKb = {el: null, target: null, upper: false, hideTimer: null};

function umlautEligible(el){
  if(!el || !el.tagName || el.disabled || el.readOnly) return false;
  if(el.closest('[data-no-umlaut]')) return false;
  if(el.tagName === 'TEXTAREA') return true;
  if(el.tagName !== 'INPUT') return false;
  const t = (el.getAttribute('type') || 'text').toLowerCase();
  return t === 'text' || t === 'search';
}
function buildUmlautKb(){
  const bar = document.createElement('div');
  bar.className = 'umlaut-kb';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Deutsche Buchstaben');
  bar.hidden = true;
  bar.innerHTML = '<div class="umlaut-keys">'
    + UMLAUT_KEYS.map(ch => '<button type="button" class="umlaut-key" tabindex="-1" data-ch="' + ch + '">' + ch + '</button>').join('')
    + '<button type="button" class="umlaut-key umlaut-shift" tabindex="-1" aria-pressed="false" title="Велика літера (Ä Ö Ü)" aria-label="Велика літера">⇧</button>'
    + '</div><p class="umlaut-tip">або утримуй a / o / u / s на латинській клавіатурі</p>';
  // не віддавати фокус кнопкам: поле лишається активним, клавіатура не ховається
  const press = e => {
    if(e.button > 0) return;
    e.preventDefault();
    if(e.type !== 'pointerdown') return; // mousedown — лише щоб не забрати фокус
    const b = e.target.closest('.umlaut-key');
    if(!b) return;
    if(b.classList.contains('umlaut-shift')) setUmlautUpper(!umlautKb.upper);
    else umlautInsert(b.dataset.ch);
  };
  bar.addEventListener('pointerdown', press);
  bar.addEventListener('mousedown', press);
  document.body.appendChild(bar);
  umlautKb.el = bar;
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', () => { placeUmlautKb(); umlautKeepVisible(); });
    window.visualViewport.addEventListener('scroll', placeUmlautKb);
  }
  window.addEventListener('resize', placeUmlautKb);
  return bar;
}
function setUmlautUpper(on){
  umlautKb.upper = on;
  if(!umlautKb.el) return;
  umlautKb.el.querySelector('.umlaut-shift').setAttribute('aria-pressed', on ? 'true' : 'false');
  umlautKb.el.querySelectorAll('.umlaut-key[data-ch]').forEach(b => {
    b.textContent = (on && b.dataset.ch !== 'ß') ? b.dataset.ch.toUpperCase() : b.dataset.ch;
  });
}
function umlautInsert(ch){
  const el = umlautKb.target;
  if(!umlautEligible(el)){ hideUmlautKb(); return; }
  if(umlautKb.upper && ch !== 'ß') ch = ch.toUpperCase();
  const len = el.value.length;
  const s = el.selectionStart == null ? len : el.selectionStart;
  const e = el.selectionEnd == null ? s : el.selectionEnd;
  if(el.maxLength > 0 && len - (e - s) + 1 > el.maxLength) return;
  if(document.activeElement !== el) el.focus({preventScroll: true});
  el.setRangeText(ch, s, e, 'end');
  el.dispatchEvent(new Event('input', {bubbles: true}));
  if(umlautKb.upper) setUmlautUpper(false); // ⇧ діє на одну літеру
}
// панель над екранною клавіатурою: на iPhone клавіатура лежить ПОВЕРХ
// сторінки (innerHeight не міняється, зменшується лише visualViewport)
function placeUmlautKb(){
  const bar = umlautKb.el;
  if(!bar || bar.hidden) return;
  const vv = window.visualViewport;
  const lift = vv ? Math.max(0, window.innerHeight - (vv.offsetTop + vv.height)) : 0;
  bar.style.bottom = Math.round(lift + 10) + 'px';
}
// якщо панель закриває поле — прокрутити сторінку трохи вище
function umlautKeepVisible(){
  const el = umlautKb.target, bar = umlautKb.el;
  if(!el || !bar || bar.hidden) return;
  requestAnimationFrame(() => {
    const r = el.getBoundingClientRect(), top = bar.getBoundingClientRect().top;
    if(r.bottom > top - 8 && r.top > 60) window.scrollBy({top: Math.min(r.bottom - top + 16, r.top - 60), behavior: 'smooth'});
  });
}
function showUmlautKb(el){
  clearTimeout(umlautKb.hideTimer);
  const bar = umlautKb.el || buildUmlautKb();
  if(umlautKb.target !== el) setUmlautUpper(false);
  umlautKb.target = el;
  bar.hidden = false;
  document.documentElement.classList.add('umlaut-open'); // місце внизу сторінки, щоб останнє поле не ховалось під панеллю
  placeUmlautKb();
  umlautKeepVisible();
}
function hideUmlautKb(){
  clearTimeout(umlautKb.hideTimer);
  umlautKb.target = null;
  setUmlautUpper(false);
  if(umlautKb.el) umlautKb.el.hidden = true;
  document.documentElement.classList.remove('umlaut-open');
}
function initUmlautKb(){
  document.addEventListener('focusin', e => {
    if(umlautEligible(e.target)) showUmlautKb(e.target);
    else if(umlautKb.target) hideUmlautKb();
  });
  document.addEventListener('focusout', e => {
    if(e.target !== umlautKb.target) return;
    clearTimeout(umlautKb.hideTimer);
    // невелика пауза: при переході на інше поле focusin покаже панель знову
    umlautKb.hideTimer = setTimeout(() => { if(!umlautEligible(document.activeElement)) hideUmlautKb(); }, 150);
  });
}

document.addEventListener('DOMContentLoaded', initTabs);
document.addEventListener('DOMContentLoaded', initNoPaste);
document.addEventListener('DOMContentLoaded', initReport);
document.addEventListener('DOMContentLoaded', initUmlautKb);
