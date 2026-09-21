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
}
function showTab(name, tabs, panels){
  tabs = tabs || document.querySelectorAll('.tab-btn');
  panels = panels || document.querySelectorAll('.panel');
  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === name ? 'true' : 'false'));
  panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
  window.scrollTo({top: 0, behavior: 'smooth'});
}

/* ---------- Прогрес-смуга (літак вгорі) ---------- */
const progress = {total: 0, done: 0};
function setTotal(n){ progress.total += n; renderProgress(); }
function markDone(n){ progress.done += n; renderProgress(); }
function renderProgress(){
  const pct = progress.total ? Math.min(100, (progress.done / progress.total) * 100) : 0;
  const plane = document.getElementById('progressPlane');
  const text = document.getElementById('progressText');
  if(plane) plane.style.left = pct + '%';
  if(text) text.textContent = progress.done + ' / ' + progress.total + ' Aufgaben gemeistert';
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
function buildQuiz(containerId, data){
  const wrap = document.getElementById(containerId);
  setTotal(data.length);
  data.forEach((item, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-q';
    div.innerHTML = `<p class="q-text">${qi+1}. ${item.q}</p><div class="quiz-opts"></div><p class="feedback"></p>`;
    const optsWrap = div.querySelector('.quiz-opts');
    shuffleArray(item.opts).forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt-btn'; b.textContent = o;
      b.addEventListener('click', () => {
        if(div.dataset.answered) return;
        const fb = div.querySelector('.feedback');
        optsWrap.querySelectorAll('.opt-btn').forEach(x => x.disabled = true);
        if(o === item.correct){
          b.classList.add('correct'); fb.textContent = 'Richtig! ✓'; fb.className = 'feedback ok';
          markDone(1);
        } else {
          b.classList.add('wrong'); fb.textContent = 'Nicht ganz — richtig wäre: ' + item.correct; fb.className = 'feedback bad';
          optsWrap.querySelectorAll('.opt-btn').forEach(x => { if(x.textContent === item.correct) x.classList.add('correct'); });
        }
        div.dataset.answered = '1';
      });
      optsWrap.appendChild(b);
    });
    wrap.appendChild(div);
  });
}

/* ---------- Текстові пропуски (input.blank-input[data-ans]) ----------
   HTML: <input type="text" class="blank-input" data-ans="правильно">
   Перевірка регістронезалежна.

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
function checkBlanks(containerId, scoreId, stateKey){
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(!(stateKey in state)) state[stateKey] = 0;
  const locked = checkBlanks._locked || (checkBlanks._locked = {});
  if(!(stateKey in locked)) locked[stateKey] = [];
  const lockedArr = locked[stateKey];

  let correct = 0, total = 0;
  document.querySelectorAll('#' + containerId + ' .blank-input').forEach((inp, idx) => {
    total++;
    const ans = (inp.dataset.ans || '').toLowerCase();
    const val = inp.value.trim().toLowerCase();
    inp.classList.remove('correct', 'wrong');

    // живий колір-фідбек на КОЖНУ перевірку (без тексту з відповіддю)
    if(val === ans){
      inp.classList.add('correct');
    } else if(val !== ''){
      inp.classList.add('wrong');
    }

    // залік лише по першій непорожній спробі цього поля
    if(!lockedArr[idx] && val !== ''){
      lockedArr[idx] = { correct: val === ans };
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
  document.querySelectorAll('#' + containerId + ' .blank-input').forEach(inp => {
    inp.value = ''; inp.classList.remove('correct', 'wrong');
  });
  const scoreEl = document.getElementById(scoreId);
  if(scoreEl) scoreEl.textContent = '';
  const state = checkBlanks._state || (checkBlanks._state = {});
  if(state[stateKey] > 0){ progress.done -= state[stateKey]; state[stateKey] = 0; renderProgress(); }
  const locked = checkBlanks._locked || (checkBlanks._locked = {});
  locked[stateKey] = []; // повний ресет знімає й "заморозку" — чесний новий старт
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

document.addEventListener('DOMContentLoaded', initTabs);
