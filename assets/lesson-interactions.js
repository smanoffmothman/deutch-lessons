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
/* data-case="sent" (з 2026-10-23) — режим «ціле речення» (buildTransform):
   регістр важливий, КРІМ першої літери; пробіли навколо ком і перед . ! ?
   не важливі; кінцевий . ! ? ігнорується, як і скрізь. */
function normSent(s){
  let v = normAns(s, true).replace(/\s*([,;:])\s*/g, '$1 ').replace(/\s+([.!?])/g, '$1').trim();
  return v.charAt(0).toLowerCase() + v.slice(1);
}
function blankIsCorrect(el){
  if(el.getAttribute('data-case') === 'sent'){
    const v = normSent(el.value);
    if(v === '') return null;
    return (el.dataset.ans || '').split('|').some(a => normSent(a) === v);
  }
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

/* =====================================================================
   НОВІ ФОРМАТИ ВПРАВ — етап 1 (з 2026-10-23, ТЗ «нові формати вправ»)
   buildWordBank · buildTransform · buildFixError · buildTable
   Спільне для всіх: один виклик — одна вправа; кнопки й лічильник малює
   сама функція (у HTML — лише порожній <div class="card" id="…">);
   зараховується ПЕРША спроба кожного пункту, правильна відповідь не
   показується; enableTestMode поважається; усе потрапляє у звіт-PDF;
   лише тапи, без перетягування; текстові поля отримують панель ä ö ü ß.
   Довідник «який формат коли брати» — README, розділ «Типи вправ».
   ===================================================================== */

// Prüfen / Zurücksetzen / лічильник під вправою з полями .blank-input
// (рахує й перевіряє та сама checkBlanks, тож анти-чіт і звіт — як у wireBlanks)
function wireBlankBox(containerId){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  if(isScored(containerId)) setTotal(blanksIn(containerId).length);
  const bar = document.createElement('div');
  bar.className = 'check-bar';
  bar.innerHTML = '<button class="btn" type="button">Prüfen</button><button class="btn secondary" type="button">Zurücksetzen</button><span class="score-pill"></span>';
  const [c, r] = bar.querySelectorAll('.btn');
  const score = bar.querySelector('.score-pill');
  score.id = containerId + '-score';
  wrap.appendChild(bar);
  const check = () => checkBlanks(containerId, score.id, containerId);
  c.addEventListener('click', check);
  if(isLocked(containerId)) r.style.display = 'none';
  else r.addEventListener('click', () => resetBlanks(containerId, score.id, containerId));
  // Enter у полі = Prüfen (зручно на телефоні)
  wrap.addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.matches('input.blank-input')){ e.preventDefault(); check(); } });
}
// "[a|b]" у тексті → {gap: ["a","b"]}; решта — {t: "текст"}
function exParseGaps(text){
  const out = [];
  let last = 0;
  String(text).replace(/\[([^\]]+)\]/g, (m, inner, pos) => {
    if(pos > last) out.push({t: text.slice(last, pos)});
    out.push({gap: inner.split('|').map(s => s.trim())});
    last = pos + m.length;
  });
  if(last < text.length) out.push({t: text.slice(last)});
  return out;
}

/* ---------- A2. Текст з банком слів (buildWordBank) ----------
   Над текстом — слова-картки; учень тапає пропуск, потім картку (або
   навпаки: картку, потім пропуск). Після вставки сам виділяється наступний
   порожній пропуск — можна просто тапати картки по черзі. Тап по
   заповненому пропуску повертає слово в набір. Кожна картка — один раз.
     buildWordBank('ub2-bank', {
       text: "Meine [Oma] wohnt auf dem Land. Sie ist schon [Rentnerin].\n\nIm [Garten] …",
       extra: ["Zwilling", "Büro"]
     });
   - text — пропуски в [квадратних дужках]; [Oma|Großmutter] — кілька
     правильних, на картці буде перше. Порожній рядок (\n\n) = новий абзац.
   - extra — (необов'язково) зайві картки-дистрактори.
   Prüfen / Zurücksetzen і лічильник — як у пропусках; зараховується перша
   перевірка кожного заповненого пропуску. Кожен пропуск = +1. */
function buildWordBank(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  wrap.classList.add('wbank-ex');
  wrap.innerHTML = '<p class="sort-tip">Натисни пропуск, а потім слово (або навпаки). Натиснеш на вставлене слово — воно повернеться.</p>'
    + '<div class="wb-bank"></div><div class="wb-text"></div>'
    + '<div class="check-bar"><button class="btn" type="button">Prüfen</button><button class="btn secondary" type="button">Zurücksetzen</button><span class="score-pill"></span></div>';
  const bank = wrap.querySelector('.wb-bank'), textEl = wrap.querySelector('.wb-text');
  const [checkBtn, resetBtn] = wrap.querySelectorAll('.check-bar .btn');
  const scoreEl = wrap.querySelector('.score-pill');
  if(lockedMode) resetBtn.style.display = 'none';

  const gaps = [];
  String(data.text || '').split(/\n\s*\n/).forEach(par => {
    const p = document.createElement('p');
    exParseGaps(par.trim()).forEach(part => {
      if(part.t != null){ p.appendChild(document.createTextNode(part.t)); return; }
      const g = document.createElement('button');
      g.type = 'button'; g.className = 'wb-gap'; g.setAttribute('aria-label', 'Пропуск ' + (gaps.length + 1));
      g.dataset.ans = part.gap.join('|');
      p.appendChild(g);
      gaps.push({el: g, ans: part.gap, card: null});
    });
    textEl.appendChild(p);
  });
  if(scored) setTotal(gaps.length);

  let selGap = null, selCard = null, counted = 0;
  const words = gaps.map(g => g.ans[0]).concat(data.extra || []);
  const cards = shuffleArray(words).map(w => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'word-chip'; b.textContent = w; b.dataset.w = w;
    bank.appendChild(b);
    return b;
  });
  const gapOf = el => gaps.find(g => g.el === el);
  function selectGap(g){
    if(selGap) selGap.el.classList.remove('sel');
    selGap = g;
    if(g) g.el.classList.add('sel');
  }
  function selectCard(c){
    if(selCard) selCard.classList.remove('picked');
    selCard = c;
    if(c) c.classList.add('picked');
  }
  function unplace(g){
    if(!g.card) return;
    g.card.hidden = false; g.card = null;
    g.el.textContent = ''; delete g.el.dataset.w;
    g.el.classList.remove('filled', 'correct', 'wrong');
  }
  function place(g, card){
    unplace(g);
    g.card = card; card.hidden = true; card.classList.remove('picked');
    g.el.textContent = card.dataset.w; g.el.dataset.w = card.dataset.w;
    g.el.classList.add('filled');
    selectCard(null);
    // далі — наступний порожній пропуск (після цього, потім з початку)
    const i = gaps.indexOf(g);
    const next = gaps.slice(i + 1).concat(gaps.slice(0, i)).find(x => !x.card && !x.el.disabled);
    selectGap(next || null);
  }
  gaps.forEach(g => g.el.addEventListener('click', () => {
    if(g.el.disabled) return;
    if(selCard){ place(g, selCard); return; }
    if(g.card){ unplace(g); selectGap(g); return; }
    selectGap(selGap === g ? null : g);
  }));
  cards.forEach(c => c.addEventListener('click', () => {
    if(selGap){ place(selGap, c); return; }
    selectCard(selCard === c ? null : c);
  }));

  checkBtn.addEventListener('click', () => {
    let correct = 0;
    gaps.forEach(g => {
      g.el.classList.remove('correct', 'wrong');
      if(g.card){
        const ok = g.ans.some(a => normAns(a, true) === normAns(g.card.dataset.w, true));
        g.el.classList.add(ok ? 'correct' : 'wrong');
        if(!('firstOk' in g.el.dataset)){ g.el.dataset.firstVal = g.card.dataset.w; g.el.dataset.firstOk = ok ? '1' : '0'; } // для звіту
        if(lockedMode) g.el.disabled = true;
      }
      if(g.el.dataset.firstOk === '1') correct++;
    });
    scoreEl.textContent = correct + ' / ' + gaps.length + ' richtig (1. Versuch zählt)';
    if(correct > counted){ if(scored) markDone(correct - counted); counted = correct; }
    selectGap(null); selectCard(null);
  });
  resetBtn.addEventListener('click', () => {
    if(lockedMode) return;
    gaps.forEach(g => { unplace(g); delete g.el.dataset.firstVal; delete g.el.dataset.firstOk; });
    selectGap(null); selectCard(null);
    scoreEl.textContent = '';
    if(counted > 0){ if(scored){ progress.done -= counted; renderProgress(); } counted = 0; }
  });
}

/* ---------- A6. Перетворення речення (buildTransform) ----------
   Дано речення + завдання («Perfekt», «denn», «заміни на займенник»);
   учень пише ЦІЛЕ речення в поле на всю ширину.
     buildTransform('ub4-tr', [
       {s: "Ich spiele Fußball.", task: "Perfekt", ans: "Ich habe Fußball gespielt."},
       {s: "Ich bleibe zu Hause. Ich bin krank.", task: "з'єднай через «denn»",
        ans: "Ich bleibe zu Hause, denn ich bin krank."},
       {s: "Gestern …", task: "…", ans: "варіант 1|варіант 2", hint: "Почни з «Gestern»"}
     ]);
   - ans — правильне речення; кілька варіантів через "|" (інший порядок слів,
     скорочення тощо — напиши всі, які зарахуєш).
   - task, hint — (необов'язково) можна з HTML (<b>…</b>).
   Порівняння: регістр важливий, крім першої літери; зайві пробіли, пробіли
   біля ком і кінцевий . ! ? не важливі; кома всередині — ВАЖЛИВА.
   Перевірка — Prüfen або Enter. Кожне речення = +1, перша спроба. */
function buildTransform(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  wrap.classList.add('tr-ex');
  items.forEach((it, i) => {
    const d = document.createElement('div');
    d.className = 'fill-item tr-item';
    d.innerHTML = '<p class="tr-src"><span class="num">' + (i + 1) + '.</span> <span class="tr-s"></span>'
      + (it.task ? ' <span class="tr-task">→ ' + it.task + '</span>' : '') + '</p>'
      + (it.hint ? ' <p class="order-hint">' + it.hint + '</p>' : '')
      + ' <input type="text" class="blank-input tr-input" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Schreib den Satz …">';
    d.querySelector('.tr-s').textContent = it.s;
    const inp = d.querySelector('input');
    inp.dataset.ans = it.ans;
    inp.setAttribute('data-case', 'sent');
    inp.setAttribute('aria-label', 'Речення ' + (i + 1));
    wrap.appendChild(d);
  });
  wireBlankBox(containerId);
}

/* ---------- A5. Знайди й виправ помилку (buildFixError) ----------
   Учень тапає слово з помилкою → з'являється поле → вписує правильну форму.
   Речення без помилки — кнопка «Fehlerfrei» (вона є біля КОЖНОГО речення,
   щоб не підказувати).
     buildFixError('ub3-fix', [
       {s: "Ich besuche mein Onkel.", wrong: 2, fix: "meinen"},
       {s: "Lena liebt ihren Bruder.", ok: true},
       {s: "Gestern ich habe Fußball gespielt.", wrong: 1, fix: "habe ich", hint: "порядок слів"}
     ]);
   - wrong — номер слова з помилкою, рахуючи з 0 (розділові знаки не рахуються:
     «Ich(0) besuche(1) mein(2) Onkel(3).»);
   - fix — правильна форма; варіанти через "|"; може бути кілька слів;
     регістр важливий (для першого слова речення — ні);
   - ok: true — речення без помилки; hint — (необов'язково) підказка.
   Бал (+1 за речення) — лише якщо ПЕРШИЙ тап влучив і ПЕРША спроба
   виправлення правильна (або одразу «Fehlerfrei» для правильного речення). */
function buildFixError(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(items.length);
  wrap.classList.add('fix-ex');
  wrap.innerHTML = '<p class="sort-tip">Натисни слово з помилкою і впиши, як правильно. Якщо помилки немає — «Fehlerfrei».</p>';
  let solvedFirst = 0;
  const scoreEl = document.createElement('span');
  scoreEl.className = 'score-pill';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + items.length + ' richtig (1. Versuch zählt)'; };

  items.forEach((it, qi) => {
    const div = document.createElement('div');
    div.className = 'fix-item';
    div.dataset.s = it.s;
    div.innerHTML = (it.hint ? '<p class="order-hint">' + it.hint + '</p>' : '')
      + '<p class="fix-line"><span class="num">' + (qi + 1) + ')</span> </p>'
      + '<div class="fix-tools"><button type="button" class="btn small secondary fix-ok">Fehlerfrei ✓</button>'
      + '<span class="fix-field" hidden><input type="text" class="blank-input inline wide" autocomplete="off" spellcheck="false" placeholder="richtig: …">'
      + '<button type="button" class="btn small fix-go">OK</button></span></div>'
      + '<p class="feedback"></p>';
    const line = div.querySelector('.fix-line'), fb = div.querySelector('.feedback');
    const okBtn = div.querySelector('.fix-ok'), field = div.querySelector('.fix-field');
    const inp = field.querySelector('input'), goBtn = field.querySelector('.fix-go');
    inp.dataset.ans = it.fix || '';
    inp.setAttribute('data-case', it.wrong === 0 ? 'sent' : ''); // перше слово речення — без огляду на велику літеру
    inp.setAttribute('aria-label', 'Виправлення, речення ' + (qi + 1));

    const toks = [];
    it.s.split(/\s+/).forEach((piece, k, arr) => {
      const m = piece.match(/^([„“"'(«]*)(.*?)([.,!?;:»“"')…]*)$/);
      if(m[1]) line.appendChild(document.createTextNode(m[1]));
      if(m[2]){
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'fx-tok'; b.textContent = m[2];
        b.dataset.i = toks.length;
        toks.push(b);
        line.appendChild(b);
      }
      line.appendChild(document.createTextNode(m[3] + (k < arr.length - 1 ? ' ' : '')));
    });

    let found = false, done = false, pendingOk = false;
    const say = (t, ok) => { fb.textContent = t; fb.className = 'feedback ' + (ok ? 'ok' : 'bad'); };
    function setFirst(desc, ok){
      if('firstOk' in div.dataset) return;
      div.dataset.first = desc; div.dataset.firstOk = ok ? '1' : '0'; // для звіту вчителю
      if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
    }
    function close(solved){
      done = true;
      div.classList.add(solved ? 'is-solved' : 'is-closed');
      toks.forEach(t => t.disabled = true); okBtn.disabled = true; inp.disabled = true; goBtn.disabled = true;
    }
    toks.forEach(t => t.addEventListener('click', () => {
      if(done || found) return;
      const i = +t.dataset.i;
      if(!it.ok && i === it.wrong){
        found = true; pendingOk = !('firstOk' in div.dataset);
        t.classList.add('found'); okBtn.hidden = true; field.hidden = false;
        div.dataset.found = t.textContent;
        say('Gefunden! Wie ist es richtig?', true);
        inp.focus();
        return;
      }
      setFirst('«' + t.textContent + '»', false);
      t.classList.add('miss'); setTimeout(() => t.classList.remove('miss'), 900);
      if(lockedMode){ say('Leider falsch ✗', false); close(false); }
      else say('Hier ist kein Fehler — such weiter.', false);
    }));
    okBtn.addEventListener('click', () => {
      if(done || found) return;
      if(it.ok){ setFirst('Fehlerfrei', true); say('Richtig! ✓ Der Satz ist fehlerfrei.', true); close(true); return; }
      setFirst('Fehlerfrei', false);
      if(lockedMode){ say('Leider falsch ✗', false); close(false); }
      else say('Doch — hier ist ein Fehler.', false);
    });
    function tryFix(){
      if(done) return;
      const res = blankIsCorrect(inp);
      if(res === null) return;
      const desc = '«' + div.dataset.found + '» → «' + inp.value.trim() + '»';
      inp.classList.remove('correct', 'wrong');
      inp.classList.add(res ? 'correct' : 'wrong');
      if(pendingOk){ pendingOk = false; setFirst(desc, res); }
      else setFirst(desc, false);
      if(res){ say('Richtig! ✓', true); close(true); }
      else if(lockedMode){ say('Leider falsch ✗', false); close(false); }
      else say('Noch nicht richtig — versuch es noch mal.', false);
    }
    goBtn.addEventListener('click', tryFix);
    inp.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); tryFix(); } });
    wrap.appendChild(div);
  });
  const bar = document.createElement('div');
  bar.className = 'check-bar';
  bar.appendChild(scoreEl); updScore();
  wrap.appendChild(bar);
}

/* ---------- B3. Таблиця для заповнення (buildTable) ----------
   Таблиця відмінювання / дієвідмінювання: у клітинках — текст, поле або
   текст з полем усередині. Пропуск — [квадратні дужки], як у банку слів.
     buildTable('ub2-tab', {
       head: ["", "Nominativ", "Akkusativ"],
       rows: [["der", "mein Bruder", "[meinen] Bruder"],
              ["die", "[meine] Schwester", "meine Schwester"]]
     });
   - head — (необов'язково) шапка; rows — рядки; перший стовпчик жирний.
   - [a|b] — кілька правильних; case: true — регістр важливий (типово — ні).
   - caption — (необов'язково) підпис над таблицею.
   Prüfen / Zurücksetzen малює функція; перевірка й бал — як у wireBlanks.
   На вузькому екрані прокручується сама таблиця, а не сторінка. */
function buildTable(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  wrap.classList.add('tb-ex');
  const box = document.createElement('div');
  box.className = 'tb-wrap';
  const table = document.createElement('table');
  table.className = 'gtable tb-table';
  if(data.caption){ const c = table.createCaption(); c.textContent = data.caption; }
  if(data.head){
    const tr = table.createTHead().insertRow();
    data.head.forEach(h => { const th = document.createElement('th'); th.textContent = h; tr.appendChild(th); });
  }
  const body = table.createTBody();
  let n = 0;
  (data.rows || []).forEach(row => {
    const tr = body.insertRow();
    row.forEach((cellText, ci) => {
      const td = tr.insertCell();
      if(ci === 0) td.className = 'tb-rh';
      const parts = exParseGaps(String(cellText));
      const alone = parts.length === 1 && parts[0].gap;
      parts.forEach(part => {
        if(part.t != null){ td.appendChild(document.createTextNode(part.t)); return; }
        const inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'blank-input' + (alone ? '' : ' inline');
        inp.autocomplete = 'off'; inp.spellcheck = false;
        inp.dataset.ans = part.gap.join('|');
        if(data.case) inp.setAttribute('data-case', '');
        inp.setAttribute('aria-label', 'Поле ' + (++n));
        td.appendChild(inp);
      });
    });
  });
  box.appendChild(table);
  wrap.appendChild(box);
  wireBlankBox(containerId);
}

/* =====================================================================
   НОВІ ФОРМАТИ ВПРАВ — етап 2 (з 2026-10-23)
   buildChat · buildCTest · buildWriting (+ атрибути textarea) ·
   buildMemory · buildScramble. Ті самі спільні правила, що й в етапі 1.
   ===================================================================== */
const exReducedMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Програти mp3 або фрагмент спільного mp3 (buildChat, buildPicture).
   a = "audio/x.mp3" або {src: "audio/dialog.mp3", from: 3.2, to: 6.8} (секунди).
   Один плеєр на сторінку: новий запуск зупиняє попередній. */
function exPlayClip(a, btn){
  const src = typeof a === 'string' ? a : a.src;
  const from = (typeof a === 'object' && a.from) || 0, to = (typeof a === 'object' && a.to != null) ? a.to : null;
  const audio = exPlayClip.audio || (exPlayClip.audio = new Audio());
  audio.pause();
  if(audio._src !== src){ audio.src = src; audio._src = src; }
  audio.ontimeupdate = to != null ? () => { if(audio.currentTime >= to) audio.pause(); } : null;
  const go = () => {
    try { audio.currentTime = from; } catch(_) {}
    audio.play().catch(() => { if(btn){ btn.textContent = '⚠'; btn.title = 'Аудіо не завантажилось'; } });
  };
  // позицію фрагмента можна ставити лише після завантаження метаданих
  if(audio.readyState >= 1) go();
  else {
    audio.addEventListener('loadedmetadata', go, {once: true});
    audio.addEventListener('error', () => { if(btn){ btn.textContent = '⚠'; btn.title = 'Аудіо не завантажилось'; } }, {once: true});
    audio.load();
  }
}

/* ---------- A1. Діалог-чат (buildChat) ----------
   Репліки бульбашками: ліворуч співрозмовник, праворуч учень. На кроці
   учня — 2–3 варіанти; вибір доречної → бульбашка, діалог іде далі.
   Недоречна: червоний відгук, можна вибрати ще (бал — перша спроба);
   діалог не продовжується, поки не обрано доречну.
     buildChat('ub4-chat', {
       partner: "Kellnerin",
       steps: [
         {them: "Guten Tag! Was möchtest du trinken?", audio: "audio/kellnerin-1.mp3"},
         {you: ["Einen Apfelsaft, bitte.", "Ich bin zwölf.", "Tschüss!"], correct: 0},
         {them: "Gern. Und zum Essen?"},
         {you: ["Eine Pizza Margherita, bitte.", "Danke, gut."], correct: 0, hint: "замов їжу"}
       ]
     });
   - them — репліка співрозмовника; кілька {them} поспіль — кілька бульбашок.
   - audio — (необов'язково) mp3 до репліки: "файл.mp3" або фрагмент
     спільного файлу {src: "dialog.mp3", from: 3.2, to: 6.8} (секунди) —
     біля бульбашки з'явиться ▶.
   - you — варіанти (перемішуються самі), correct — номер доречного з 0.
   - hint — (необов'язково) підказка українською над варіантами.
   - me — (необов'язково) як підписати учня (типово «Du»).
   Контрольна: одна спроба на крок; після невдалої діалог іде далі, а
   бульбашка учня лишається червоною — доречна репліка не показується.
   Кожен крок учня = +1. */
function buildChat(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  const steps = data.steps || [];
  const youSteps = steps.filter(s => s.you);
  if(scored) setTotal(youSteps.length);
  wrap.classList.add('chat-ex');
  wrap.innerHTML = '<div class="chat-head"><span class="chat-ava" aria-hidden="true"></span><b></b></div>'
    + '<div class="chat-log" aria-live="polite"></div><div class="chat-opts-box"><p class="order-hint" hidden></p><div class="chat-opts"></div><p class="feedback"></p></div>'
    + '<div class="check-bar"><span class="score-pill"></span></div>';
  const partner = data.partner || 'Partner';
  wrap.querySelector('.chat-head b').textContent = partner;
  wrap.querySelector('.chat-ava').textContent = partner.charAt(0).toUpperCase();
  const log = wrap.querySelector('.chat-log'), optsBox = wrap.querySelector('.chat-opts-box');
  const opts = wrap.querySelector('.chat-opts'), fb = optsBox.querySelector('.feedback'), hintEl = optsBox.querySelector('.order-hint');
  const scoreEl = wrap.querySelector('.score-pill');
  // для звіту: по кроку учня — що сказав співрозмовник перед ним і перша спроба
  wrap._chat = []; wrap._chatTotal = youSteps.length;
  let solvedFirst = 0, lastThem = '';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + youSteps.length + ' richtig (1. Versuch zählt)'; };
  updScore();

  const playClip = exPlayClip;
  function bubble(who, text, step){
    const m = document.createElement('div');
    m.className = 'chat-msg ' + who;
    const t = document.createElement('span');
    t.textContent = text;
    m.appendChild(t);
    if(step && step.audio){
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-play'; b.textContent = '▶'; b.setAttribute('aria-label', 'Послухати');
      b.addEventListener('click', () => playClip(step.audio, b));
      m.insertBefore(b, t);
    }
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  let i = 0;
  function next(){
    while(i < steps.length && steps[i].them != null){
      const s = steps[i++];
      lastThem = s.them;
      bubble('them', s.them, s);
    }
    if(i >= steps.length){ optsBox.hidden = true; wrap.classList.add('is-done'); return; }
    ask(steps[i++]);
  }
  function ask(s){
    const rec = {prompt: lastThem, first: null, firstOk: null};
    wrap._chat.push(rec);
    opts.innerHTML = ''; fb.textContent = ''; fb.className = 'feedback';
    hintEl.hidden = !s.hint; hintEl.innerHTML = s.hint || '';
    optsBox.hidden = false;
    let done = false;
    shuffleArray(s.you.map((t, k) => k)).forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn'; b.textContent = s.you[k];
      b.addEventListener('click', () => {
        if(done) return;
        const ok = k === s.correct;
        if(rec.first === null){
          rec.first = s.you[k]; rec.firstOk = ok;
          if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
        }
        if(ok || lockedMode){
          done = true;
          const m = bubble('me', s.you[k]);
          if(!ok) m.classList.add('wrong');
          rec.solved = ok;
          optsBox.hidden = true;
          setTimeout(next, exReducedMotion() ? 0 : 450);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          fb.textContent = 'Passt nicht — probier eine andere Antwort.'; fb.className = 'feedback bad';
        }
      });
      opts.appendChild(b);
    });
  }
  next();
}

/* ---------- A7. C-Test (buildCTest) ----------
   У словах тексту сховано частину — учень дописує.
     buildCTest('ub6-ct', {
       text: "Meine {Fam|ilie} ist groß. Ich habe zwei {Brüder} und eine {Schw|ester}.",
       mode: "half"
     });
   - {Fam|ilie} — видима частина | схована; варіанти схованої через "/":
     {Fam|ilie/ilien}.
   - {Brüder} — без "|": ховається автоматично за mode:
     "half" (типово, класичний C-Test — сховано другу половину слова, для
     непарної довжини — більшу) або "first" (видно лише першу літеру).
   - Порожній рядок (\n\n) = новий абзац.
   - case: true — регістр важливий (типово — ні).
   Prüfen / Zurücksetzen — як у пропусках; кожне слово = +1, перша спроба. */
function buildCTest(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  wrap.classList.add('ctest-ex');
  const mode = data.mode || 'half';
  const box = document.createElement('div');
  box.className = 'ct-text';
  String(data.text || '').split(/\n\s*\n/).forEach(par => {
    const p = document.createElement('p');
    let last = 0;
    const src = par.trim();
    src.replace(/\{([^}]+)\}/g, (m, inner, pos) => {
      if(pos > last) p.appendChild(document.createTextNode(src.slice(last, pos)));
      last = pos + m.length;
      let vis, hid;
      if(inner.includes('|')){ [vis, hid] = inner.split('|'); }
      else {
        const n = mode === 'first' ? 1 : Math.floor(inner.length / 2);
        vis = inner.slice(0, n); hid = inner.slice(n);
      }
      const w = document.createElement('span');
      w.className = 'ct-w';
      w.appendChild(document.createTextNode(vis));
      const inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'blank-input ct-in';
      inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('autocapitalize', 'off');
      inp.dataset.ans = hid.split('/').map(x => x.trim()).join('|');
      if(data.case) inp.setAttribute('data-case', '');
      const len = Math.max(...hid.split('/').map(x => x.trim().length));
      inp.style.width = (len + 1.6) + 'ch'; // ширина ≈ довжина схованого (не точна — щоб не підказувати)
      inp.setAttribute('aria-label', vis + '…');
      w.appendChild(inp);
      p.appendChild(w);
    });
    if(last < src.length) p.appendChild(document.createTextNode(src.slice(last)));
    box.appendChild(p);
  });
  wrap.appendChild(box);
  wireBlankBox(containerId);
}

/* ---------- C6. Письмо з чеклістом ----------
   Розширення звичайного .qa textarea — атрибутами, без JS у сторінці:
     <div class="qa">
       <label for="w1">Напиши листа другові (60–80 слів).</label>
       <textarea id="w1" rows="8" data-words="60-80"
         data-must="Lieber/Liebe|Viele Grüße|weil"
         data-check="Звертання й підпис|Відповів(-ла) на 3 питання|Перевірив(-ла) порядок слів"></textarea>
     </div>
   - data-words — мета: "60-80" або "60" (мінімум); лічильник «45 / 60–80 Wörter».
   - data-must — обов'язкові слова/звороти через "|", варіанти через "/";
     підсвічуються ✓, щойно учень їх ужив (регістр не важливий).
   - data-check — чекліст критеріїв через "|", учень відмічає сам.
   Або одним викликом: buildWriting('ub7-w', {prompt, words, must, check, rows}).
   Не оцінюється автоматично й у бал не йде; у звіт — текст, кількість
   слів, що з обов'язкового вжито, і що відмічено в чеклісті. */
function exWordCount(v){ return (String(v).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length; }
function exHasPhrase(text, phrase){
  const esc = phrase.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp('(^|[^\\p{L}])' + esc + '(?=$|[^\\p{L}])', 'iu').test(text);
}
function initWritingAid(ta){
  if(ta.dataset.wAid) return;
  ta.dataset.wAid = '1';
  const aid = document.createElement('div');
  aid.className = 'w-aid';
  let goal = null;
  if(ta.dataset.words){
    const m = ta.dataset.words.match(/(\d+)\s*(?:[-–]\s*(\d+))?/);
    if(m) goal = {min: +m[1], max: m[2] ? +m[2] : null};
  }
  const cnt = document.createElement('span');
  cnt.className = 'w-count';
  aid.appendChild(cnt);
  const must = (ta.dataset.must || '').split('|').map(s => s.trim()).filter(Boolean);
  const mustEls = must.map(item => {
    const c = document.createElement('span');
    c.className = 'w-must'; c.textContent = item.split('/').join(' / ');
    c.dataset.alts = item;
    aid.appendChild(c);
    return c;
  });
  ta.insertAdjacentElement('afterend', aid);
  const checks = (ta.dataset.check || '').split('|').map(s => s.trim()).filter(Boolean);
  if(checks.length){
    const ul = document.createElement('ul');
    ul.className = 'w-check';
    checks.forEach((txt, k) => {
      const li = document.createElement('li');
      const id = (ta.id || 'w') + '-chk' + k + '-' + Math.random().toString(36).slice(2, 6);
      li.innerHTML = '<input type="checkbox"><label></label>';
      li.querySelector('input').id = id;
      const lb = li.querySelector('label'); lb.htmlFor = id; lb.textContent = txt;
      ul.appendChild(li);
    });
    aid.insertAdjacentElement('afterend', ul);
  }
  function upd(){
    const v = ta.value;
    const n = exWordCount(v);
    if(goal){
      cnt.textContent = n + ' / ' + goal.min + (goal.max ? '–' + goal.max : '+') + ' Wörter';
      cnt.className = 'w-count ' + (n < goal.min ? 'under' : (goal.max && n > goal.max ? 'over' : 'ok'));
    } else cnt.textContent = n + ' Wörter';
    mustEls.forEach(c => c.classList.toggle('ok', c.dataset.alts.split('/').some(a => exHasPhrase(v, a))));
  }
  ta.addEventListener('input', upd);
  upd();
}
function initWritingAids(){
  document.querySelectorAll('textarea[data-words], textarea[data-must], textarea[data-check]').forEach(initWritingAid);
}
function buildWriting(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const qa = document.createElement('div');
  qa.className = 'qa';
  const id = containerId + '-text';
  qa.innerHTML = '<label></label><textarea rows="' + (data.rows || 8) + '"></textarea>';
  const lb = qa.querySelector('label'), ta = qa.querySelector('textarea');
  lb.htmlFor = id; lb.innerHTML = data.prompt || '';
  ta.id = id;
  const join = v => Array.isArray(v) ? v.join('|') : v;
  if(data.words) ta.dataset.words = data.words;
  if(data.must) ta.dataset.must = join(data.must);
  if(data.check) ta.dataset.check = join(data.check);
  wrap.appendChild(qa);
  initWritingAid(ta); // заборону вставки додасть initNoPaste, як усім textarea
}

/* ---------- C2. Memory (buildMemory) ----------
   Картки лицем донизу; учень відкриває по дві, шукає пари.
     buildMemory('ub8-mem', {
       pairs: [["der Onkel", "дядько"], ["die Tante", "тітка"], ["der Opa", "дідусь"]]
     });
   - pairs — пари [a, b]: de ↔ uk, слово ↔ емодзі, форма ↔ форма; 4–8 пар.
   - scored: false — (необов'язково) не йти в бал, лише гра.
   Бал: +1, коли всі пари знайдено не більше ніж за 2 × (кількість пар)
   спроб; інакше — «завершено», без балу. Таймера немає. У звіт —
   кількість спроб. У контрольній — без змін (це гра, а не перевірка). */
function buildMemory(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const pairs = data.pairs || [];
  const scored = data.scored !== false && isScored(containerId);
  if(scored) setTotal(1);
  wrap.classList.add('mem-ex');
  if(data.scored === false) wrap.dataset.noScore = '1'; // лише гра — у звіт не йде
  wrap.innerHTML = '<p class="sort-tip">Відкривай по дві картки й шукай пари.</p><div class="mem-grid"></div>'
    + '<div class="check-bar"><span class="score-pill"></span></div>';
  const grid = wrap.querySelector('.mem-grid'), scoreEl = wrap.querySelector('.score-pill');
  const limit = pairs.length * 2;
  let open = [], tries = 0, found = 0, busy = false;
  wrap.dataset.pairs = pairs.length;
  const upd = () => {
    scoreEl.textContent = found === pairs.length
      ? 'Fertig! ' + tries + (tries === 1 ? ' Versuch' : ' Versuche') + (tries <= limit ? ' ✓' : '')
      : found + ' / ' + pairs.length + ' Paare · ' + tries + (tries === 1 ? ' Versuch' : ' Versuche');
  };
  const cards = [];
  pairs.forEach((p, k) => [0, 1].forEach(side => cards.push({pair: k, side: side, t: p[side]})));
  shuffleArray(cards).forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mem-card side-' + c.side;
    b.innerHTML = '<span class="mem-face"></span>';
    b.querySelector('.mem-face').textContent = c.t;
    b.setAttribute('aria-label', 'Картка');
    b.addEventListener('click', () => {
      if(busy || b.classList.contains('open')) return;
      b.classList.add('open'); b.setAttribute('aria-label', c.t);
      open.push({b: b, c: c});
      if(open.length < 2) return;
      tries++;
      const [x, y] = open;
      open = [];
      if(x.c.pair === y.c.pair){
        x.b.classList.add('matched'); y.b.classList.add('matched');
        x.b.disabled = y.b.disabled = true;
        found++;
        if(found === pairs.length){
          wrap.dataset.tries = tries; wrap.dataset.firstOk = tries <= limit ? '1' : '0'; // для звіту
          if(tries <= limit && scored) markDone(1);
        }
      } else {
        busy = true;
        x.b.classList.add('miss'); y.b.classList.add('miss');
        setTimeout(() => {
          [x.b, y.b].forEach(n => { n.classList.remove('open', 'miss'); n.setAttribute('aria-label', 'Картка'); });
          busy = false;
        }, exReducedMotion() ? 600 : 950);
      }
      upd();
    });
    grid.appendChild(b);
  });
  upd();
}

/* ---------- C3. Буквений салат / склади слово (buildScramble) ----------
   Літери (або частини) слова перемішані — тапами скласти слово. Будова
   як у buildOrder: тап по поставленій літері повертає її назад.
     buildScramble('ub9-scr', [
       {w: "Familie", hint: "сім'я"},
       {w: "Kinderzimmer", parts: ["Kinder", "zimmer"], pre: "das", hint: "дитяча кімната"},
       {w: "Geschwister", parts: ["Ge", "schwis", "ter"]}
     ]);
   - w — слово (з великої, якщо іменник: перша поставлена картка сама
     покажеться з великої, у наборі всі — з малої, щоб не підказувати).
   - parts — (необов'язково) частини замість літер: склади, композит.
   - pre — (необов'язково) текст перед словом, не перемішується (артикль).
   - hint — підказка українською; alt — інші правильні написання.
   Перевірка — щойно всі картки поставлені; перша повна спроба = бал (+1). */
function buildScramble(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(items.length);
  wrap.classList.add('scr-ex');
  let solvedFirst = 0;
  const scoreEl = document.createElement('span');
  scoreEl.className = 'score-pill';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + items.length + ' richtig (1. Versuch zählt)'; };
  items.forEach((it, qi) => {
    const units = (it.parts || Array.from(it.w)).map(u => u.toLowerCase());
    const answers = [it.w].concat(it.alt || []).map(a => a.toLowerCase());
    let order = shuffleArray(units.map((u, k) => k));
    for(let t = 0; t < 8 && units.length > 1 && order.map(k => units[k]).join('') === units.join(''); t++) order = shuffleArray(order);
    const upperFirst = it.w.charAt(0) !== it.w.charAt(0).toLowerCase();
    const div = document.createElement('div');
    div.className = 'order-item scr-item' + (it.parts ? ' scr-parts' : '');
    div.innerHTML = (it.hint ? '<p class="order-hint">' + it.hint + '</p>' : '')
      + '<div class="order-line"><span class="num">' + (qi + 1) + ')</span>' + (it.pre ? '<span class="scr-pre"></span>' : '')
      + '<span class="order-slots" aria-live="polite"></span></div><div class="order-bank"></div><p class="feedback"></p>';
    if(it.pre) div.querySelector('.scr-pre').textContent = it.pre;
    const slots = div.querySelector('.order-slots'), bank = div.querySelector('.order-bank'), fb = div.querySelector('.feedback');
    let firstTryDone = false;
    const shown = () => Array.from(slots.children).map(b => b.textContent).join('');
    function refresh(){
      Array.from(bank.children).forEach(b => { b.textContent = b.dataset.w; });
      Array.from(slots.children).forEach((b, pos) => { b.textContent = (pos === 0 && upperFirst) ? b.dataset.w.charAt(0).toUpperCase() + b.dataset.w.slice(1) : b.dataset.w; });
    }
    function check(){
      if(bank.children.length){ fb.textContent = ''; fb.className = 'feedback'; div.classList.remove('is-wrong'); return; }
      const ok = answers.includes(shown().toLowerCase());
      if(ok){
        fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
        div.classList.remove('is-wrong'); div.classList.add('is-solved');
        slots.querySelectorAll('button').forEach(b => b.disabled = true);
      } else if(lockedMode){
        fb.textContent = 'Leider falsch ✗'; fb.className = 'feedback bad';
        div.classList.add('is-wrong'); slots.querySelectorAll('button').forEach(b => b.disabled = true);
      } else {
        fb.textContent = 'Noch nicht — versuch eine andere Reihenfolge.'; fb.className = 'feedback bad';
        div.classList.add('is-wrong');
      }
      if(!firstTryDone){
        firstTryDone = true;
        div.dataset.first = (it.pre ? it.pre + ' ' : '') + shown(); div.dataset.firstOk = ok ? '1' : '0'; // для звіту (як buildOrder)
        if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
      }
    }
    order.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'word-chip';
      b.dataset.w = units[k]; b.textContent = units[k];
      b.addEventListener('click', () => {
        if(div.classList.contains('is-solved') || (lockedMode && div.classList.contains('is-wrong') && !bank.children.length)) return;
        (b.parentNode === bank ? slots : bank).appendChild(b);
        refresh(); check();
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

/* =====================================================================
   НОВІ ФОРМАТИ ВПРАВ — етап 3 (з 2026-10-24)
   buildSpeak · buildClock · buildHotspot (+ карти assets/svg/) · buildPicture
   Ті самі спільні правила, що й в етапах 1–2.
   ===================================================================== */
// тека assets/ — звідси buildHotspot сам довантажує карти (assets/svg/<назва>.js)
const LI_ASSETS = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/[^/]*$/, '') : '';

/* ---------- A3. Говоріння з розпізнаванням мови (buildSpeak) ----------
   Учень натискає 🎤 і вимовляє фразу; браузер розпізнає мовлення (de-DE),
   функція порівнює почуте з цільовим текстом і показує, що почув браузер.
     buildSpeak('ub5-speak', [
       {say: "Meine Großeltern wohnen in Lwiw.", uk: "Мої бабуся й дідусь живуть у Львові."},
       {say: "Ich habe einen Bruder|Ich hab einen Bruder", prompt: "Скажи, що в тебе є брат."},
       {say: "Ich bin zwölf|Ich bin 12"}
     ]);
   - say — що сказати; кілька допустимих варіантів через "|". Числа браузер
     часто пише цифрами — додай варіант з цифрами ("zwölf|12").
   - uk — (необов'язково) переклад під фразою.
   - prompt — (необов'язково) завдання замість фрази: тоді say НЕ
     показується (учень сам будує фразу), а після трьох невдач — теж ні.
   - третій аргумент (необов'язково): {min: 0.8} — частка слів фрази, яку
     треба вимовити (типово 80 %), {tries: 3} — кількість спроб.
   Порівняння: без регістру й розділових знаків, ß = ss; зайвими можуть
   бути щонайбільше ~30 % слів (мінімум одне).
   БАЛ: +1, якщо фразу розпізнано в межах 3 спроб (і в контрольній теж) —
   помилка розпізнавання часто не помилка учня (шум, мікрофон), а
   підглянути відповідь тут нема де. «Нічого не почуто» й збій зв'язку
   спробу не забирають. У звіт — що почув браузер у кожній спробі.
   Браузери: Chrome, Edge, Android — так; Safari — частково; Firefox — ні.
   Без підтримки (або якщо мікрофон заборонено) — блок «Скажи вголос» зі
   зразком, без балу (ці пункти не рахуються в загальну кількість). */
function spkWords(s){
  return String(s || '').toLowerCase().replace(/ß/g, 'ss').replace(/[’'`-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}
function spkLcs(a, b){
  const dp = Array(b.length + 1).fill(0);
  for(let i = 1; i <= a.length; i++){
    let prev = 0;
    for(let j = 1; j <= b.length; j++){
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}
// чи збігається почуте (heard) з одним із варіантів цілі (target "a|b")
function spkMatch(target, heard, min){
  const h = spkWords(heard);
  if(!h.length) return false;
  return String(target).split('|').some(alt => {
    const t = spkWords(alt);
    if(!t.length) return false;
    const l = spkLcs(t, h);
    return l / t.length >= (min || 0.8) && (h.length - l) <= Math.max(1, Math.round(t.length * 0.3));
  });
}
const spkState = {rec: null}; // одне розпізнавання на сторінку за раз
function buildSpeak(containerId, items, opts){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  opts = opts || {};
  const tries = opts.tries || 3, min = opts.min || 0.8;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  wrap.classList.add('spk-ex');
  const first = s => String(s).split('|')[0].trim();

  // без підтримки — «Скажи вголос», без балу
  function renderOff(note){
    wrap.innerHTML = '<p class="spk-off-note">' + note + '</p>';
    items.forEach((it, i) => {
      const d = document.createElement('div');
      d.className = 'spk-item spk-off';
      d.innerHTML = '<p class="spk-text"><span class="num">' + (i + 1) + ')</span> <span class="spk-say"></span></p>'
        + (it.uk && !it.prompt ? '<p class="spk-uk"></p>' : '')
        + (it.prompt ? '<button type="button" class="btn small secondary spk-sample">Зразок</button><p class="spk-sample-text" hidden></p>' : '');
      d.querySelector('.spk-say').textContent = it.prompt || first(it.say);
      if(d.querySelector('.spk-uk')) d.querySelector('.spk-uk').textContent = it.uk;
      if(it.prompt){
        d.querySelector('.spk-sample-text').textContent = first(it.say);
        d.querySelector('.spk-sample').addEventListener('click', e => { d.querySelector('.spk-sample-text').hidden = false; e.currentTarget.remove(); });
      }
      wrap.appendChild(d);
    });
  }
  if(!SR){
    renderOff('🗣 Скажи кожну фразу вголос. <span class="spk-small">(Твій браузер не вміє розпізнавати мовлення — тут найкраще працюють Chrome, Edge або телефон з Android. Тоді ця вправа перевірятиметься автоматично.)</span>');
    return;
  }

  const scored = isScored(containerId);
  if(scored) setTotal(items.length);
  wrap.innerHTML = '<p class="spk-privacy">🎤 Натисни «Sprich» і скажи фразу німецькою. Мовлення розпізнає сервіс твого браузера (Google або Apple); наш сайт запис не отримує й не зберігає.</p>';
  let solvedFirst = 0, blocked = false;
  const scoreEl = document.createElement('span');
  scoreEl.className = 'score-pill';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + items.length + ' richtig'; };
  const recs = [];

  items.forEach((it, i) => {
    const d = document.createElement('div');
    d.className = 'spk-item';
    d.innerHTML = (it.hint ? '<p class="order-hint">' + it.hint + '</p>' : '')
      + '<p class="spk-text"><span class="num">' + (i + 1) + ')</span> <span class="spk-say"></span></p>'
      + (it.uk && !it.prompt ? '<p class="spk-uk"></p>' : '')
      + '<div class="spk-tools"><button type="button" class="btn spk-mic"><span aria-hidden="true">🎤</span> Sprich</button><span class="spk-tries"></span></div>'
      + '<p class="spk-heard" aria-live="polite"></p><p class="feedback"></p>';
    const sayEl = d.querySelector('.spk-say');
    if(it.prompt){ sayEl.textContent = it.prompt; sayEl.classList.add('is-prompt'); } else sayEl.textContent = first(it.say);
    if(d.querySelector('.spk-uk')) d.querySelector('.spk-uk').textContent = it.uk;
    const mic = d.querySelector('.spk-mic'), triesEl = d.querySelector('.spk-tries');
    const heardEl = d.querySelector('.spk-heard'), fb = d.querySelector('.feedback');
    const rec = {item: it, heard: [], ok: false, done: false};
    recs.push(rec); d._spk = rec;
    const say = (t, ok) => { fb.textContent = t; fb.className = 'feedback' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); };
    const updTries = () => { triesEl.textContent = rec.done ? '' : 'Versuch ' + Math.min(rec.heard.length + 1, tries) + ' / ' + tries; };
    updTries();

    function finish(ok){
      rec.done = true; rec.ok = ok;
      d.classList.add(ok ? 'is-solved' : 'is-closed');
      mic.disabled = true; updTries();
      if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
    }
    mic.addEventListener('click', () => {
      if(rec.done || blocked) return;
      if(spkState.rec){ try { spkState.rec.abort(); } catch(_) {} }
      const r = new SR();
      spkState.rec = r;
      r.lang = 'de-DE'; r.interimResults = false; r.continuous = false; r.maxAlternatives = 5;
      let got = false;
      d.classList.add('is-listening'); mic.innerHTML = '<span aria-hidden="true">●</span> Ich höre zu …';
      say('');
      r.onresult = e => {
        got = true;
        const alts = Array.from(e.results[0] || []).map(a => a.transcript.trim()).filter(Boolean);
        if(!alts.length) return;
        const hit = alts.find(a => spkMatch(it.say, a, min));
        const shown = hit || alts[0];
        rec.heard.push(shown);
        heardEl.innerHTML = 'Gehört: «<span></span>»';
        heardEl.querySelector('span').textContent = shown;
        if(hit){ say('Richtig! ✓', true); finish(true); }
        else if(rec.heard.length >= tries){ say('Leider nicht erkannt ✗', false); finish(false); }
        else { say('Noch nicht — sprich deutlich und versuch es noch mal.', false); updTries(); }
      };
      r.onerror = e => {
        got = true;
        const err = e.error;
        if(err === 'not-allowed' || err === 'service-not-allowed'){ blockAll(); return; }
        if(err === 'no-speech') say('Нічого не почуто — натисни 🎤 і говори одразу.', false);
        else if(err === 'audio-capture') say('Мікрофон не знайдено.', false);
        else if(err === 'network') say('Немає зв\'язку з сервісом розпізнавання — перевір інтернет і спробуй ще раз.', false);
        else if(err !== 'aborted') say('Не вийшло розпізнати — спробуй ще раз.', false);
      };
      r.onend = () => {
        d.classList.remove('is-listening');
        if(!rec.done) mic.innerHTML = '<span aria-hidden="true">🎤</span> Sprich';
        else mic.innerHTML = rec.ok ? '✓' : '✗';
        if(spkState.rec === r) spkState.rec = null;
        if(!got && !rec.done) say('Нічого не почуто — натисни 🎤 і говори одразу.', false);
      };
      try { r.start(); } catch(_) { d.classList.remove('is-listening'); mic.innerHTML = '<span aria-hidden="true">🎤</span> Sprich'; }
    });
    wrap.appendChild(d);
  });
  // мікрофон заборонено: ще не пройдені фрази — «скажи вголос», з загальної кількості їх прибираємо
  function blockAll(){
    if(blocked) return;
    blocked = true;
    const left = recs.filter(r => !r.done && !r.heard.length).length;
    wrap.querySelectorAll('.spk-item').forEach(el => {
      if(!el._spk.done && !el._spk.heard.length){ el.classList.add('spk-off'); el.querySelector('.spk-mic').disabled = true; }
    });
    const note = document.createElement('p');
    note.className = 'feedback bad';
    note.textContent = 'Доступ до мікрофона заборонено. Дозволь його в налаштуваннях сайту в браузері й онови сторінку — або просто скажи фрази вголос.';
    wrap.insertBefore(note, wrap.children[1] || null);
    if(scored && left){ progress.total -= left; renderProgress(); }
  }
  const bar = document.createElement('div');
  bar.className = 'check-bar';
  bar.appendChild(scoreEl); updScore();
  wrap.appendChild(bar);
}

/* ---------- B1. Годинник (buildClock) ----------
   Аналоговий годинник (SVG). Три види пунктів, можна змішувати:
     buildClock('ub3-uhr', [
       {time: "15:15", opts: ["Viertel nach drei", "Viertel vor drei", "halb vier"], correct: "Viertel nach drei"},
       {time: "7:30"},                                  // учень пише час сам
       {set: "Viertel vor acht", time: "7:45"}         // учень ставить стрілки
     ]);
   - time — час "H:MM" (0–23 год).
   - opts + correct — вибір з варіантів (як квіз; перемішуються самі).
   - лише time (без opts) — учень пише час. Зараховується САМО будь-яке
     правильне написання: розмовне («Viertel nach drei», «viertel vier»,
     «zehn vor halb vier», «drei Uhr» / «drei»), офіційне («fünfzehn Uhr
     fünfzehn», «drei Uhr fünfzehn») і цифрами («15:15», «3.15»). Свої
     варіанти — ans: "…|…"; лише свої (без автоматичних) — auto: false.
     Розмовні форми — для кратних 5 хвилин.
   - set — завдання словами; учень ставить стрілки кнопками −1 h / +1 h /
     −5 min / +5 min і натискає «Prüfen». Годинник 12-годинний: 15:15 = 3:15.
     step: 1 — кнопки ±1 хв замість ±5.
   - hint — (необов'язково) підказка.
   Кожен пункт = +1, перша спроба; у контрольній — одна спроба. */
const CLK_NUM = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
  'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
function clkNumWord(n){
  if(n < 20) return CLK_NUM[n];
  const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig'][Math.floor(n / 10)], u = n % 10;
  return u ? (u === 1 ? 'ein' : CLK_NUM[u]) + 'und' + tens : tens;
}
function clkParse(t){ const m = String(t).match(/(\d{1,2})\s*[:.]\s*(\d{2})/); return m ? {H: +m[1] % 24, M: +m[2] % 60} : {H: 0, M: 0}; }
function clkFmt(H, M){ return H + ':' + String(M).padStart(2, '0'); }
// усі правильні написання часу (розмовне, офіційне, цифри)
function clkVariants(H, M){
  const v = [];
  const h12 = H % 12 || 12, next = h12 % 12 + 1;
  const hw = n => CLK_NUM[n];
  const offH = h => h === 1 ? 'ein' : clkNumWord(h);
  [H, h12, (H === 0 && M === 0) ? 24 : -1].filter((x, i, a) => x >= 0 && a.indexOf(x) === i).forEach(h => {
    v.push(clkFmt(h, M));
    v.push(offH(h) + ' Uhr' + (M ? ' ' + clkNumWord(M) : ''));
  });
  if(M % 5 === 0){
    const c = {
      0: [h12 === 1 ? 'ein Uhr' : hw(h12) + ' Uhr', hw(h12)],
      5: ['fünf nach ' + hw(h12)], 10: ['zehn nach ' + hw(h12)],
      15: ['Viertel nach ' + hw(h12), 'viertel ' + hw(next)],
      20: ['zwanzig nach ' + hw(h12), 'zehn vor halb ' + hw(next)],
      25: ['fünf vor halb ' + hw(next)], 30: ['halb ' + hw(next)], 35: ['fünf nach halb ' + hw(next)],
      40: ['zwanzig vor ' + hw(next), 'zehn nach halb ' + hw(next)],
      45: ['Viertel vor ' + hw(next), 'drei viertel ' + hw(next), 'dreiviertel ' + hw(next)],
      50: ['zehn vor ' + hw(next)], 55: ['fünf vor ' + hw(next)]
    }[M];
    v.push.apply(v, c);
  }
  if(M === 0 && (H === 0 || H === 24)) v.push('Mitternacht');
  if(M === 0 && H === 12) v.push('Mittag');
  return v;
}
function clkNorm(s){
  let v = normAns(s);
  const m = v.match(/^(\d{1,2})\s*[:.h]\s*(\d{2})(\s*uhr)?$/) || v.match(/^(\d{1,2})()\s*uhr$/);
  if(m) v = (+m[1]) + ':' + (m[2] || '00');
  return v;
}
function clkSvg(){
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('class', 'clk-face'); svg.setAttribute('aria-hidden', 'true');
  let s = '<circle cx="100" cy="100" r="94" class="clk-rim"/>';
  for(let i = 0; i < 60; i++){
    const a = i * 6 * Math.PI / 180, r1 = 88, r2 = i % 5 ? 84 : 77;
    s += '<line class="' + (i % 5 ? 'clk-tick' : 'clk-tick5') + '" x1="' + (100 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (100 - r1 * Math.cos(a)).toFixed(1)
      + '" x2="' + (100 + r2 * Math.sin(a)).toFixed(1) + '" y2="' + (100 - r2 * Math.cos(a)).toFixed(1) + '"/>';
  }
  for(let n = 1; n <= 12; n++){
    const a = n * 30 * Math.PI / 180;
    s += '<text class="clk-num" x="' + (100 + 64 * Math.sin(a)).toFixed(1) + '" y="' + (100 - 64 * Math.cos(a) + 6).toFixed(1) + '">' + n + '</text>';
  }
  s += '<line class="clk-h" x1="100" y1="100" x2="100" y2="54"/><line class="clk-m" x1="100" y1="100" x2="100" y2="24"/><circle class="clk-c" cx="100" cy="100" r="5"/>';
  svg.innerHTML = s;
  return svg;
}
function clkSet(svg, mins){ // mins — хвилини від 0:00
  const m = ((mins % 720) + 720) % 720;
  svg.querySelector('.clk-h').setAttribute('transform', 'rotate(' + (m * 0.5) + ' 100 100)');
  svg.querySelector('.clk-m').setAttribute('transform', 'rotate(' + ((m % 60) * 6) + ' 100 100)');
}
function buildClock(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(items.length);
  wrap.classList.add('clk-ex');
  let solvedFirst = 0;
  const scoreEl = document.createElement('span');
  scoreEl.className = 'score-pill';
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + items.length + ' richtig (1. Versuch zählt)'; };
  const grid = document.createElement('div');
  grid.className = 'clk-grid';
  wrap.appendChild(grid);

  items.forEach((it, qi) => {
    const t = clkParse(it.time);
    const mode = it.set ? 'set' : (it.opts ? 'opts' : 'write');
    const div = document.createElement('div');
    div.className = 'clk-item clk-' + mode;
    div.innerHTML = '<p class="clk-head"><span class="num">' + (qi + 1) + ')</span> <span class="clk-prompt"></span></p>'
      + (it.hint ? '<p class="order-hint">' + it.hint + '</p>' : '');
    const prompt = div.querySelector('.clk-prompt');
    prompt.textContent = mode === 'set' ? it.set : (mode === 'opts' ? 'Wie spät ist es?' : 'Wie spät ist es? Schreib die Uhrzeit.');
    const svg = clkSvg();
    div.appendChild(svg);
    const fb = document.createElement('p'); fb.className = 'feedback';
    let done = false;
    const say = (txt, ok) => { fb.textContent = txt; fb.className = 'feedback ' + (ok ? 'ok' : 'bad'); };
    function record(desc, ok){
      if('firstOk' in div.dataset) return;
      div.dataset.first = desc; div.dataset.firstOk = ok ? '1' : '0'; // для звіту вчителю
      if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
    }
    const close = solved => { done = true; div.classList.add(solved ? 'is-solved' : 'is-closed'); div.querySelectorAll('button, input').forEach(b => b.disabled = true); };

    if(mode === 'set'){
      let cur = 0; clkSet(svg, cur);
      const step = it.step || 5;
      const tools = document.createElement('div');
      tools.className = 'clk-tools';
      [['−1 h', -60], ['+1 h', 60], ['−' + step + ' min', -step], ['+' + step + ' min', step]].forEach(([lbl, d]) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'btn small secondary clk-adj'; b.textContent = lbl;
        b.addEventListener('click', () => { if(done) return; cur = (cur + d + 720) % 720; clkSet(svg, cur); fb.textContent = ''; });
        tools.appendChild(b);
      });
      const go = document.createElement('button');
      go.type = 'button'; go.className = 'btn small clk-go'; go.textContent = 'Prüfen';
      go.addEventListener('click', () => {
        if(done) return;
        const ok = cur === (t.H * 60 + t.M) % 720;
        record(clkFmt(Math.floor(cur / 60) || 12, cur % 60), ok);
        if(ok){ say('Richtig! ✓', true); close(true); }
        else if(lockedMode){ say('Leider falsch ✗', false); close(false); }
        else say('Noch nicht — stell die Uhr anders.', false);
      });
      tools.appendChild(go);
      div.appendChild(tools);
    } else {
      clkSet(svg, t.H * 60 + t.M);
      svg.setAttribute('aria-hidden', 'false'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Uhr');
      if(mode === 'opts'){
        const box = document.createElement('div');
        box.className = 'quiz-opts clk-opts';
        shuffleArray(it.opts).forEach(o => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'opt-btn'; b.textContent = o;
          b.addEventListener('click', () => {
            if(done) return;
            const ok = o === it.correct;
            box.querySelectorAll('.opt-btn').forEach(x => x.classList.remove('wrong'));
            b.classList.add(ok ? 'correct' : 'wrong');
            record(o, ok);
            if(ok){ say('Richtig! ✓', true); close(true); }
            else if(lockedMode){ say('Leider falsch ✗', false); close(false); }
            else say('Nicht ganz — versuch es noch mal.', false);
          });
          box.appendChild(b);
        });
        div.appendChild(box);
      } else {
        const accept = (it.ans ? String(it.ans).split('|') : []).concat(it.auto === false ? [] : clkVariants(t.H, t.M)).map(clkNorm);
        const row = document.createElement('div');
        row.className = 'clk-write';
        row.innerHTML = '<input type="text" class="blank-input clk-in" autocomplete="off" spellcheck="false" placeholder="Es ist …" aria-label="Uhrzeit">'
          + '<button type="button" class="btn small">OK</button>';
        const inp = row.querySelector('input'), ok = row.querySelector('button');
        const check = () => {
          if(done) return;
          let v = inp.value.trim().replace(/^es ist\s+/i, '');
          if(!v) return;
          const good = accept.includes(clkNorm(v));
          inp.classList.remove('correct', 'wrong'); inp.classList.add(good ? 'correct' : 'wrong');
          record(inp.value.trim(), good);
          if(good){ say('Richtig! ✓', true); close(true); }
          else if(lockedMode){ say('Leider falsch ✗', false); close(false); }
          else say('Noch nicht richtig — versuch es noch mal.', false);
        };
        ok.addEventListener('click', check);
        inp.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); check(); } });
        div.appendChild(row);
      }
    }
    div.appendChild(fb);
    grid.appendChild(div);
  });
  const bar = document.createElement('div');
  bar.className = 'check-bar';
  bar.appendChild(scoreEl); updScore();
  wrap.appendChild(bar);
}

/* ---------- B2. Зображення з активними зонами (buildHotspot) ----------
   Карта (або інша SVG-основа) + завдання «Klick auf …»: учень тапає зону.
     buildHotspot('ub3-map', {
       svg: 'deutschland',
       tasks: [{q: "Wo liegt Hamburg?", zone: "hamburg"}, {q: "Wo liegt Bayern?", zone: "bayern"},
               {q: "Wo fließt der Rhein?", zone: "rhein"}]
     });
   - svg — 'deutschland' або 'ukraine' (власні карти в assets/svg/, див.
     README «Типи вправ» → список зон); файл карти довантажується сам. Для
     превʼю в проєктах генерації краще підключити його явно ще одним
     <script> (assets/svg/deutschland.js) ПЕРЕД lesson-interactions.js.
     Можна й своє: 'шлях/до/файлу.svg' (лише на сайті, не з диска) або
     рядок '<svg …>'. Зони в SVG — елементи з class="hs-zone",
     data-zone="id", data-name="назва" (+ data-uk); міста — <g class="hs-zone
     hs-city" transform="translate(x y)">, річки — class="hs-zone hs-river".
   - tasks — по одному завданню на екрані; zone — id зони (для міста й землі
     з тим самим ім'ям, напр. hamburg, — зараховується будь-яке з двох);
     kind — (необов'язково) 'city' | 'region' | 'river', якщо треба саме
     місто чи саме землю: {q: "Wo liegt das Bundesland Hamburg?", zone: "hamburg", kind: "region"}.
   - label — підпис знайденої зони: 'de' (типово), 'uk' або 'none'.
   Міста легко влучити пальцем: зараховується найближче місто до точки
   дотику. Точки міст видно, лише якщо серед завдань є місто (або
   cities: true). Неправильний тап — зона блимає червоним і показує свою
   назву; правильна НЕ показується. Після 3 невдач з'являється «Далі ›».
   Кожне завдання = +1, перша спроба; у контрольній — одна спроба. */
const hsMaps = {};
function hsLoadMap(name){
  if(/^\s*</.test(name)) return Promise.resolve(name);
  if(hsMaps[name]) return hsMaps[name];
  hsMaps[name] = new Promise((res, rej) => {
    if(window.HOTSPOT_SVG && window.HOTSPOT_SVG[name]) return res(window.HOTSPOT_SVG[name]);
    if(/\.svg(\?|#|$)/i.test(name)) return fetch(name).then(r => r.ok ? r.text() : Promise.reject(new Error(r.status))).then(res, rej);
    if(!LI_ASSETS) return rej(new Error('assets?'));
    const s = document.createElement('script');
    s.src = LI_ASSETS + 'svg/' + encodeURIComponent(name) + '.js';
    s.onload = () => (window.HOTSPOT_SVG && window.HOTSPOT_SVG[name]) ? res(window.HOTSPOT_SVG[name]) : rej(new Error('empty'));
    s.onerror = () => rej(new Error('load'));
    document.head.appendChild(s);
  });
  hsMaps[name].catch(() => { delete hsMaps[name]; });
  return hsMaps[name];
}
function buildHotspot(containerId, data){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const tasks = data.tasks || [];
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(tasks.length);
  const label = data.label || 'de';
  wrap.classList.add('hs-ex');
  wrap.innerHTML = '<div class="hs-task"><span class="hs-step"></span> <b class="hs-q"></b></div>'
    + '<div class="hs-stage"><p class="hs-loading">Karte wird geladen …</p></div>'
    + '<div class="hs-under"><p class="feedback" aria-live="polite"></p><button type="button" class="btn small secondary hs-skip" hidden>Weiter ›</button></div>'
    + '<div class="check-bar"><span class="score-pill"></span></div>';
  const stage = wrap.querySelector('.hs-stage'), qEl = wrap.querySelector('.hs-q'), stepEl = wrap.querySelector('.hs-step');
  const fb = wrap.querySelector('.feedback'), skip = wrap.querySelector('.hs-skip'), scoreEl = wrap.querySelector('.score-pill');
  // для звіту: по завданню — що тапнув учень першою спробою
  wrap._hs = tasks.map(t => ({q: t.q, first: null, firstOk: null, solved: false}));
  let solvedFirst = 0, cur = 0, misses = 0, svg = null;
  const updScore = () => { scoreEl.textContent = solvedFirst + ' / ' + tasks.length + ' richtig (1. Versuch zählt)'; };
  updScore();
  const say = (t, ok) => { fb.textContent = t; fb.className = 'feedback' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); };
  const nameOf = el => (label === 'uk' && el.dataset.uk) ? el.dataset.uk : (el.dataset.name || el.dataset.zone);

  function addLabel(el){
    if(label === 'none' || el.querySelector && el._hsLabel) return;
    let x, y, anchor = 'middle';
    if(el.classList.contains('hs-city')){
      x = +el.dataset.x + 8; y = +el.dataset.y + 4; anchor = 'start';
      const vb = svg.viewBox.baseVal;
      if(x > vb.width * 0.78){ x = +el.dataset.x - 8; anchor = 'end'; }
    } else if(el.classList.contains('hs-river')){
      const p = el.querySelector('path'); const L = p.getTotalLength(); const pt = p.getPointAtLength(L * 0.45);
      x = pt.x + 6; y = pt.y - 6; anchor = 'start';
    } else {
      const b = el.getBBox(); x = b.x + b.width / 2; y = b.y + b.height / 2 + 4;
    }
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('class', 'hs-label'); t.setAttribute('x', x.toFixed(1)); t.setAttribute('y', y.toFixed(1)); t.setAttribute('text-anchor', anchor);
    t.textContent = nameOf(el);
    svg.appendChild(t);
    el._hsLabel = t;
  }
  const zonesById = id => svg ? Array.from(svg.querySelectorAll('.hs-zone')).filter(z => z.dataset.zone === id) : [];
  function kindOf(id, kind){
    if(kind) return kind === 'region' ? 'area' : kind;
    const z = zonesById(id);
    if(z.some(e => e.classList.contains('hs-city'))) return 'city';
    if(z.some(e => e.classList.contains('hs-river'))) return 'river';
    return 'area';
  }
  function show(){
    misses = 0; skip.hidden = true;
    if(cur >= tasks.length){
      qEl.textContent = 'Fertig!'; stepEl.textContent = '';
      wrap.classList.add('is-done'); stage.className = 'hs-stage';
      return;
    }
    stepEl.textContent = (cur + 1) + ' / ' + tasks.length;
    qEl.textContent = tasks[cur].q;
    stage.className = 'hs-stage hs-mode-' + kindOf(tasks[cur].zone, tasks[cur].kind) + (stage.classList.contains('hs-no-cities') ? ' hs-no-cities' : '');
  }
  // точка дотику в координатах SVG
  function svgPoint(e){
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }
  function resolve(e){
    const kind = kindOf(tasks[cur].zone, tasks[cur].kind);
    if(kind === 'city'){
      const pt = svgPoint(e);
      let best = null, bd = Infinity;
      svg.querySelectorAll('.hs-city').forEach(c => {
        const d = Math.hypot(+c.dataset.x - pt.x, +c.dataset.y - pt.y);
        if(d < bd){ bd = d; best = c; }
      });
      const R = svg.viewBox.baseVal.width * 0.06; // ≈ 36 одиниць на карті шириною 600
      if(best && bd <= R) return best;
    }
    const el = e.target.closest && e.target.closest('.hs-zone');
    return el && svg.contains(el) ? el : null;
  }
  function onTap(e){
    if(cur >= tasks.length) return;
    const el = resolve(e);
    if(!el) return; // тап по морю / поза картою — не спроба
    const task = tasks[cur], r = wrap._hs[cur];
    const want = kindOf(task.zone, task.kind);
    const elKind = el.classList.contains('hs-city') ? 'city' : el.classList.contains('hs-river') ? 'river' : 'area';
    // місто й земля з однаковим id (hamburg, berlin…) — зараховується будь-яке, якщо kind не задано
    const ok = el.dataset.zone === task.zone && (!task.kind || elKind === want);
    if(r.first === null){
      r.first = nameOf(el); r.firstOk = ok;
      if(ok){ if(scored) markDone(1); solvedFirst++; updScore(); }
    }
    if(ok){
      r.solved = true;
      zonesById(task.zone).forEach(z => z.classList.add('hs-found'));
      addLabel(el);
      say('Richtig! ✓', true);
      cur++;
      setTimeout(show, exReducedMotion() ? 200 : 700);
    } else {
      el.classList.add('hs-miss'); setTimeout(() => el.classList.remove('hs-miss'), 800);
      if(lockedMode){
        say('Leider falsch ✗', false);
        cur++; setTimeout(show, 900);
      } else {
        misses++;
        say('Nein, das ist ' + nameOf(el) + '. Versuch es noch mal.', false);
        if(misses >= 3) skip.hidden = false;
      }
    }
  }
  skip.addEventListener('click', () => { say(''); cur++; show(); });

  hsLoadMap(data.svg).then(src => {
    stage.innerHTML = src;
    svg = stage.querySelector('svg');
    if(!svg) throw new Error('no svg');
    const needCity = data.cities || tasks.some(t => kindOf(t.zone, t.kind) === 'city');
    if(!needCity) stage.classList.add('hs-no-cities');
    wrap.classList.toggle('hs-no-cities', !needCity);
    svg.addEventListener('click', onTap);
    show();
  }).catch(() => {
    stage.innerHTML = '<p class="feedback bad">Карта не завантажилась. Онови сторінку.</p>';
    if(scored){ progress.total -= tasks.length; renderProgress(); }
    wrap._hs = [];
  });
}

/* ---------- B4. Вибір картинки (buildPicture) ----------
   Слово чи речення → вибрати одну з 3–4 картинок; або навпаки — картинка
   → вибрати слово; або аудіо → картинка («Was hörst du?»).
     buildPicture('ub2-pic', [
       {q: "der Apfel", opts: ["🍎", "🍌", "🍐"], correct: "🍎"},
       {pic: "☔", opts: ["Es regnet.", "Es schneit.", "Die Sonne scheint."], correct: "Es regnet."},
       {audio: "audio/l2-c-wetter.mp3", opts: ["☀️", "🌧️", "❄️"], correct: "🌧️"},
       {q: "die Jacke", opts: [{src: "../../assets/pics/jacke.svg", alt: "Jacke"}, …], correct: "Jacke"}
     ]);
   - q — слово/речення; pic — картинка-завдання; audio — mp3 або фрагмент
     {src, from, to} (кнопка ▶). Можна поєднувати (audio + q).
   - opts — емодзі, текст або власні картинки {src, alt}; перемішуються
     самі. correct — той самий рядок (для картинки — її alt або src).
   - Власні картинки — лише свої або з вільною ліцензією, у assets/pics/.
   Емодзі на різних пристроях виглядають трохи по-різному — це нормально.
   Кожен пункт = +1, перша спроба; у контрольній — одна спроба. */
function picIsImg(o){ return typeof o === 'object' || /\.(svg|png|jpe?g|webp|gif)(\?|$)/i.test(String(o)); }
function picKey(o){ return typeof o === 'object' ? (o.alt || o.src) : String(o); }
function picFill(el, o, big){
  if(picIsImg(o)){
    const img = document.createElement('img');
    img.src = typeof o === 'object' ? o.src : o; img.alt = typeof o === 'object' ? (o.alt || '') : ''; img.loading = 'lazy';
    el.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.className = /[\p{Extended_Pictographic}]/u.test(o) && String(o).length <= 8 ? 'pic-emoji' : 'pic-word';
    span.textContent = o;
    el.appendChild(span);
  }
  if(big) el.classList.add('pic-big');
}
function buildPicture(containerId, items){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  const scored = isScored(containerId), lockedMode = isLocked(containerId);
  if(scored) setTotal(items.length);
  wrap.classList.add('pic-ex');
  items.forEach((it, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-q pic-q';
    const qp = document.createElement('div');
    qp.className = 'q-text pic-prompt';
    qp.appendChild(Object.assign(document.createElement('span'), {className: 'num', textContent: (qi + 1) + '. '}));
    if(it.audio){
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pic-play'; b.setAttribute('aria-label', 'Послухати'); // ▶ — з CSS, щоб не потрапляв у текст звіту
      b.addEventListener('click', () => exPlayClip(it.audio, b));
      qp.appendChild(b);
    }
    if(it.pic){ const p = document.createElement('span'); p.className = 'pic-task'; picFill(p, it.pic, true); qp.appendChild(p); }
    if(it.q){ const s = document.createElement('span'); s.className = 'pic-q-text'; s.textContent = it.q; qp.appendChild(s); }
    if(!it.q && !it.pic && it.audio){ const s = document.createElement('span'); s.className = 'pic-q-text'; s.textContent = 'Was hörst du?'; qp.appendChild(s); }
    div.appendChild(qp);
    const box = document.createElement('div');
    const imgOpts = it.opts.some(picIsImg) || it.opts.every(o => /[\p{Extended_Pictographic}]/u.test(String(o)) && String(o).length <= 8);
    box.className = 'quiz-opts pic-opts' + (imgOpts ? ' pic-tiles' : '') + (it.opts.length === 4 ? ' pic-4' : '');
    const fb = document.createElement('p'); fb.className = 'feedback';
    let firstTryDone = false;
    const correctKey = typeof it.correct === 'object' ? picKey(it.correct) : String(it.correct);
    shuffleArray(it.opts).forEach(o => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn pic-opt';
      picFill(b, o, false);
      const key = picKey(o);
      if(picIsImg(o)) b.setAttribute('aria-label', key);
      b.addEventListener('click', () => {
        if(div.dataset.solved) return;
        const ok = key === correctKey || (typeof o === 'object' && o.src === correctKey);
        box.querySelectorAll('.opt-btn').forEach(x => x.classList.remove('wrong'));
        if(ok){
          b.classList.add('correct'); fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
          box.querySelectorAll('.opt-btn').forEach(x => x.disabled = true); div.dataset.solved = '1';
        } else if(lockedMode){
          b.classList.add('wrong'); fb.textContent = 'Leider falsch ✗'; fb.className = 'feedback bad';
          box.querySelectorAll('.opt-btn').forEach(x => x.disabled = true); div.dataset.solved = '1';
        } else {
          b.classList.add('wrong'); fb.textContent = 'Nicht ganz — versuch es noch mal.'; fb.className = 'feedback bad';
        }
        if(!firstTryDone){
          firstTryDone = true;
          div.dataset.first = key; div.dataset.firstOk = ok ? '1' : '0'; // для звіту (як у квізі)
          if(ok && scored) markDone(1);
        }
      });
      box.appendChild(b);
    });
    div.appendChild(box);
    div.appendChild(fb);
    wrap.appendChild(div);
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
// buildWordBank: текст з відповідями учня на місці пропусків, абзац = рядок звіту
function rpWordBank(wrap){
  let ok = 0, n = 0, empty = 0;
  const paras = Array.from(wrap.querySelectorAll('.wb-text p')).map(p => {
    const states = [];
    const clone = p.cloneNode(true);
    p.querySelectorAll('.wb-gap').forEach(g => {
      n++;
      const cur = g.dataset.w || '';
      if('firstOk' in g.dataset){
        const good = g.dataset.firstOk === '1'; if(good) ok++;
        const later = cur && cur !== g.dataset.firstVal ? 'потім: ' + cur : '';
        states.push(rpAns(g.dataset.firstVal, good ? 'ok' : 'bad', later));
      } else if(cur) states.push(rpAns(cur, 'open', 'не перевірено'));
      else { states.push(RP_GAP); empty++; }
    });
    clone.querySelectorAll('.wb-gap').forEach((g, i) => g.replaceWith(document.createTextNode('\u0001' + i + '\u0002')));
    return rpEsc(clone.textContent.replace(/\s+/g, ' ').trim()).replace(/\u0001(\d+)\u0002/g, (m, i) => states[+i]);
  });
  return {html: paras[0] || '', more: paras.slice(1), ok: ok, n: n, empty: empty};
}
// buildChat: рядок на кожен крок учня — репліка співрозмовника → вибір першої спроби
function rpChat(wrap){
  const recs = wrap._chat || [];
  const n = wrap._chatTotal || recs.length;
  const partner = rpText(wrap.querySelector('.chat-head b'));
  let ok = 0, empty = 0;
  const lines = recs.map(r => {
    const pre = r.prompt ? '<span class="rp-muted">' + rpEsc(partner) + ': ' + rpEsc(r.prompt) + '</span> → ' : '';
    if(r.first === null){ empty++; return pre + RP_GAP; }
    if(r.firstOk) ok++;
    return pre + rpAns(r.first, r.firstOk ? 'ok' : 'bad', !r.firstOk && r.solved ? 'потім обрав(-ла) доречну' : '');
  });
  while(lines.length < n){ lines.push(RP_GAP); empty++; } // до цих кроків учень не дійшов
  return {html: lines[0] || RP_GAP, more: lines.slice(1), ok: ok, n: n, empty: empty};
}
// buildMemory: завершено чи ні, скільки спроб
function rpPlural(n, one, few, many){ const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : (d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many); }
function rpMemory(wrap){
  const pairs = +wrap.dataset.pairs || 0;
  if(!('firstOk' in wrap.dataset)){
    const found = wrap.querySelectorAll('.mem-card.matched').length / 2;
    return {html: 'Memory: ' + (found ? rpAns('знайдено ' + found + ' з ' + pairs + ' ' + rpPlural(pairs, 'пари', 'пар', 'пар'), 'open', 'не завершено') : RP_GAP), ok: 0, n: 1, empty: found ? 0 : 1};
  }
  const good = wrap.dataset.firstOk === '1';
  return {html: 'Memory: ' + rpAns('усі ' + pairs + ' ' + rpPlural(pairs, 'пару', 'пари', 'пар') + ' за ' + wrap.dataset.tries + ' ' + rpPlural(+wrap.dataset.tries, 'спробу', 'спроби', 'спроб'), good ? 'ok' : 'bad', 'норма — до ' + (pairs * 2)), ok: good ? 1 : 0, n: 1, empty: 0};
}
// buildSpeak: фраза (або завдання) → що почув браузер у кожній спробі
function rpSpeak(d){
  const r = d._spk;
  const it = r.item;
  const pre = rpEsc(rpText(d.querySelector('.spk-text .num'))) + ' ' + rpEsc(it.prompt || String(it.say).split('|')[0].trim()) + ' → ';
  if(!r.heard.length) return {html: pre + RP_GAP, ok: 0, n: 1, empty: 1};
  const parts = r.heard.map((h, i) => rpAns(h, (r.ok && i === r.heard.length - 1) ? 'ok' : 'bad'));
  const note = r.ok ? (r.heard.length > 1 ? r.heard.length + '-а спроба' : '') : (r.done ? 'не розпізнано' : 'не завершено');
  return {html: pre + parts.join(' → ') + (note ? ' <span class="rp-note">(' + rpEsc(note) + ')</span>' : ''), ok: r.ok ? 1 : 0, n: 1, empty: 0};
}
// buildClock: годинник / завдання → відповідь першої спроби (часу на годиннику не пишемо — це й є відповідь)
function rpClock(div){
  const num = rpText(div.querySelector('.clk-head .num'));
  const what = div.classList.contains('clk-set') ? '«' + rpText(div.querySelector('.clk-prompt')) + '» — постав стрілки' : 'годинник';
  const pre = rpEsc(num + ' ' + what) + ' → ';
  if(!('firstOk' in div.dataset)) return {html: pre + RP_GAP, ok: 0, n: 1, empty: 1};
  const ok = div.dataset.firstOk === '1';
  const later = !ok && div.classList.contains('is-solved') ? 'потім правильно' : '';
  return {html: pre + rpAns(div.dataset.first, ok ? 'ok' : 'bad', later), ok: ok ? 1 : 0, n: 1, empty: 0};
}
// buildHotspot: завдання → яку зону тапнув учень першою спробою
function rpHotspot(wrap){
  const rows = (wrap._hs || []).map(r => {
    const pre = '<span class="rp-q">' + rpEsc(r.q) + '</span> → ';
    if(r.first === null) return {h: pre + RP_GAP, ok: 0, e: 1};
    return {h: pre + rpAns(r.first, r.firstOk ? 'ok' : 'bad', !r.firstOk && r.solved ? 'потім знайшов(-ла)' : ''), ok: r.firstOk ? 1 : 0, e: 0};
  });
  if(!rows.length) return null;
  return {html: rows[0].h, more: rows.slice(1).map(r => r.h), ok: rows.reduce((a, r) => a + r.ok, 0), n: rows.length, empty: rows.reduce((a, r) => a + r.e, 0)};
}
// buildFixError: речення → що учень позначив / як виправив з першої спроби
function rpFix(div){
  const pre = rpEsc(rpText(div.querySelector('.fix-line .num'))) + ' ' + rpEsc(div.dataset.s || '') + ' → ';
  if(!('firstOk' in div.dataset)){
    if(div.dataset.found) return {html: pre + rpAns('«' + div.dataset.found + '» → …', 'open', 'не дописано'), ok: 0, n: 1, empty: 0};
    return {html: pre + RP_GAP, ok: 0, n: 1, empty: 1};
  }
  const good = div.dataset.firstOk === '1';
  const later = !good && div.classList.contains('is-solved') ? 'потім виправив(-ла)' : '';
  return {html: pre + rpAns(div.dataset.first, good ? 'ok' : 'bad', later), ok: good ? 1 : 0, n: 1, empty: 0};
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
  // письмо з чеклістом (data-words / data-must / data-check)
  let aid = '';
  if(el.dataset.words) aid += ' <span class="rp-note">мета: ' + rpEsc(el.dataset.words) + '</span>';
  const must = (el.dataset.must || '').split('|').map(x => x.trim()).filter(Boolean);
  if(must.length) aid += '<br><span class="rp-muted">обов\'язкове:</span> ' + must.map(m => rpAns(m.split('/').join(' / '), m.split('/').some(a => exHasPhrase(v, a)) ? 'ok' : 'bad')).join(' ');
  const chk = el.parentElement ? el.parentElement.querySelectorAll('.w-check li') : [];
  if(chk.length) aid += '<br><span class="rp-muted">чекліст (відмічає учень):</span> ' + Array.from(chk).map(li => (li.querySelector('input').checked ? '☑ ' : '☐ ') + rpEsc(rpText(li))).join(' · ');
  if(!v) return {html: head + aid + '<div class="rp-text rp-muted">порожньо</div>', ok: 0, n: 0, empty: 0};
  // довгий текст ріжемо на шматки (~10 рядків), щоб сторінки PDF рвалися між ними
  const chunks = rpChunks(v, 700, 10);
  return {html: head + aid + '<div class="rp-text">' + rpEsc(chunks[0]) + '</div>',
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
  const sel = '.quiz-q, .order-item, .sort-ex, .wbank-ex, .fix-item, .chat-ex, .mem-ex, .spk-item, .clk-item, .hs-ex, textarea, input.blank-input, select.blank, .tok, input[type="text"]';
  panel.querySelectorAll(sel).forEach(el => {
    if(el.closest('.report-card') || rpHidden(el, panel)) return;
    let key = el, row = null;
    if(el.matches('.sort-ex')) row = rpSort(el);
    else if(el.closest('.sort-ex')) return;
    else if(el.matches('.wbank-ex')) row = rpWordBank(el);
    else if(el.matches('.chat-ex')) row = rpChat(el);
    else if(el.matches('.mem-ex')){ if(el.dataset.noScore) return; row = rpMemory(el); }
    else if(el.matches('.fix-item')) row = rpFix(el);
    else if(el.matches('.spk-item')){ if(el.classList.contains('spk-off') || !el._spk) return; row = rpSpeak(el); }
    else if(el.matches('.clk-item')) row = rpClock(el);
    else if(el.closest('.clk-item')) return; // поле часу — уже в рядку годинника
    else if(el.matches('.hs-ex')){ row = rpHotspot(el); if(!row) return; }
    else if(el.closest('.fix-ex')) return; // поле виправлення — уже в рядку речення
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
    '<div class="rp-brand">DeutschHeft · Bericht für die Lehrkraft</div>'
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
  // є хоч одна вправа (з 2026-10-24 — і нових форматів: раніше сторінка лише з банком слів, чатом чи Memory лишалась без звіту)
  if(!document.querySelector('.panel .quiz-q, .panel .blank-input, .panel select.blank, .panel textarea, .panel .tok, .panel .order-item, .panel .sort-ex, '
    + '.panel .wbank-ex, .panel .fix-ex, .panel .chat-ex, .panel .mem-ex, .panel .spk-item:not(.spk-off), .panel .clk-item, .panel .hs-ex')) return;

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
  /* Фікс 2026-10-11 ("загублений клік"): разом з панеллю зникає й нижній відступ
     сторінки (html.umlaut-open). Коли сторінку прокручено до самого низу, вона від
     цього "підскакує". Раніше панель ховалась уже на натисканні миші (mousedown →
     фокус іде з поля → focusin), тож кнопка (напр. Prüfen під останнім полем)
     з'їжджала з-під курсора ще до відпускання — і перший клік губився. Тепер, поки
     кнопка миші / палець натиснуті, панель лише "чекає" і ховається вже ПІСЛЯ
     кліку. Клавіатура (Tab) — як і раніше, одразу.

     Фікс 2026-10-17 (те саме на сенсорних екранах): на телефоні порядок подій
     інший — pointerup приходить ДО того, як фокус іде з поля (браузер шле
     mousedown/focus лише після того, як палець піднято, а click — ще пізніше).
     Тому «відпускання» по pointerup не допомагало: панель ховалась між pointerup
     і click, сторінка підскакувала, і дотик губився. Тепер для дотику/стилуса
     чекаємо саму подію click (запасний таймер — якщо click так і не прийде,
     напр. довге натискання). Для миші — як і раніше, pointerup. */
  let pressing = false, pendingHide = false, releaseTimer = null;
  const hideIfIdle = () => { if(!umlautEligible(document.activeElement)) hideUmlautKb(); };
  const requestHide = () => { if(pressing) pendingHide = true; else hideIfIdle(); };
  const release = () => {
    clearTimeout(releaseTimer);
    pressing = false;
    if(pendingHide){ pendingHide = false; setTimeout(hideIfIdle, 60); } // після click
  };
  document.addEventListener('pointerdown', e => {
    if(e.target.closest && e.target.closest('.umlaut-kb')) return;
    clearTimeout(releaseTimer);
    pressing = true;
  }, true);
  document.addEventListener('pointerup', e => {
    if(!pressing) return;
    if(e.pointerType === 'mouse') release();
    else { clearTimeout(releaseTimer); releaseTimer = setTimeout(release, 700); } // дотик: чекаємо click
  }, true);
  document.addEventListener('click', () => { if(pressing) release(); }, true);
  document.addEventListener('pointercancel', release, true); // прокрутка пальцем замість дотику
  document.addEventListener('focusin', e => {
    if(umlautEligible(e.target)){ pendingHide = false; showUmlautKb(e.target); }
    else if(umlautKb.target) requestHide();
  });
  document.addEventListener('focusout', e => {
    if(e.target !== umlautKb.target) return;
    clearTimeout(umlautKb.hideTimer);
    // невелика пауза: при переході на інше поле focusin покаже панель знову
    umlautKb.hideTimer = setTimeout(requestHide, 150);
  });
}

document.addEventListener('DOMContentLoaded', initTabs);
document.addEventListener('DOMContentLoaded', initNoPaste);
document.addEventListener('DOMContentLoaded', initWritingAids);
document.addEventListener('DOMContentLoaded', initReport);
document.addEventListener('DOMContentLoaded', initUmlautKb);
