// data/lessons-data.js
// -------------------------------------------------------------
// Єдиний файл, який редагуєш щоразу, коли додаєш новий урок.
// Скопіюй один об'єкт, зміни поля — і збережи.
//
// Поля:
//   klas    — "7" | "8" | "9"
//   modul   — "A".."H" (у кожному класі 8 модулів)
//   lektion — номер уроку в межах модуля (число)
//   nazva   — назва уроку для каталогу
//   opys    — короткий опис (1 речення)
//   file    — шлях до html-файлу уроку відносно lessons/
//   nove    — true/false, позначка "нове"
//   dz      — що задано додому ПІСЛЯ цього уроку. Наступний урок цього ж
//             модуля бере цей текст для своєї вкладки "Hausaufgabe"
//             (перевірка ДЗ). Для першого уроку модуля залиш "" —
//             перевіряти ще нема чого.
//
// Тема МОДУЛЯ (напр. "Familienferien") сюди більше не входить —
// вона живе окремо в data/modules-data.js (MODULE_THEMES), незалежно
// від того, скільки уроків у модулі вже готово.
// -------------------------------------------------------------

const LESSONS = [
  {
    klas: "7",
    modul: "A",
    lektion: 1,
    nazva: "Вступний урок. Вікторина про Німеччину",
    opys: "Знайомство з фактами про Німеччину: розташування, гори, річки, свята — квіз і вправа на закріплення.",
    file: "klas-7/modul-a/lektion-1.html",
    nove: true,
    dz: "Написати короткий Steckbrief про себе (5 речень): ім'я, вік, місто проживання, країна/місто походження."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 2,
    nazva: "Mein Sommer, meine Ziele",
    opys: "Згадуємо літо (Perfekt) і пакуємо 'валізу літа', обираємо емоджі-символи літа зі своєю історією та ставимо цілі на навчальний рік (wollen).",
    file: "klas-7/modul-a/lektion-2.html",
    nove: true,
    dz: 'Schreib eine kurze Postkarte (5–6 Sätze) an einen Freund / eine Freundin: Erzähl im Perfekt, was du im Sommer erlebt hast (z. B. "Ich bin ... gefahren", "Ich habe ... gemacht"), und schreib am Ende einen Satz, worauf du dich in diesem Schuljahr am meisten freust (z. B. "Ich freue mich auf ...").'
  },
  {
    klas: "7",
    modul: "A",
    lektion: 3,
    nazva: "Вхідна діагностувальна робота №1",
    opys: "Перевірка знань і вмінь на початку навчального року: складні слова, Perfekt/Präteritum, читання (Falko, оголошення про кінноспортивну базу) і лист-відповідь.",
    file: "klas-7/modul-a/lektion-3.html",
    nove: true,
    dz: "Опрацювати помилки в діагностувальній роботі та написати 3 речення у Perfekt про минулі вихідні (напр. „Ich habe ... gespielt“, „Ich bin ... gegangen“)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 4,
    nazva: "Fehlerdetektive: аналіз діагностувальної роботи",
    opys: "Розбираємо типові помилки з діагностувальної роботи №1 у форматі гри-розслідування: складні слова, Perfekt/Präteritum, читання (Falko, Reiterhof) і лист-відповідь Silke.",
    file: "klas-7/modul-a/lektion-4.html",
    nove: true,
    dz: "Написати 5 речень німецькою про свій типовий шкільний день, використавши щонайменше 2 складні іменники (напр. Lieblingsfach, Sportkleidung, Möbelgeschäft) і 1 запитання однокласнику в Perfekt (напр. „Was hast du gestern gemacht?“)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 5,
    nazva: "Familienferien: wo und wohin?",
    opys: "Прийменники місця Wo?/Wohin? (Dativ/Akkusativ) на матеріалі вірша й двох інтерв'ю про літні канікули; мозковий штурм ідей для родинної відпустки.",
    file: "klas-7/modul-a/lektion-5.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze): Wo verbringt deine Familie am liebsten die Ferien? Nutze mindestens drei Präpositionen mit Dativ oder Akkusativ (z. B. „Wir fahren an die Ostsee.“, „Im Sommer sind wir im Ferienlager.“) und einen Satz mit „Ich finde das …, weil …“."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 6,
    nazva: "Канікули в колі сім'ї",
    opys: "SMS-листування і лист про сімейні канікули; закріплюємо прийменники з Dativ (ab, aus, bei, mit, nach, seit, von, zu) через читання, пропуски і клікабельні токени.",
    file: "klas-7/modul-a/lektion-6.html",
    nove: true,
    dz: "Schreib eine E-Mail (8–10 Sätze) an eine Freundin / einen Freund: Erzähl, wie deine Familie die Ferien meistens verbringt und bei wem ihr manchmal zu Besuch seid. Nutze mindestens vier Präpositionen mit Dativ (ab, aus, bei, mit, nach, seit, von, zu) und beschreib eine schöne Erinnerung aus den Ferien."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 7,
    nazva: "Familienferien: Jans Reise nach Brasilien",
    opys: "Читаємо про подорож Яна до Бразилії, повторюємо прийменники з Dativ і пишемо йому лист-відповідь; додатково — усна гра «Unsere Ferien» в групах.",
    file: "klas-7/modul-a/lektion-7.html",
    nove: true,
    dz: "Schreib eine Antwort-E-Mail an Jan (8–10 Sätze): Bedank dich für seinen Brief, erzähl, wie deine Familie die letzten Ferien verbracht hat, und nutze dabei mindestens vier verschiedene Präpositionen mit Dativ (ab, aus, bei, mit, nach, seit, von, zu). Beschreib auch, was dir am besten gefallen hat (gefallen + Dativ)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 8,
    nazva: "Ich mache im Haushalt mit",
    opys: "Домашні обов'язки: слухаємо і повторюємо вирази про хатні справи (аудіо), тренуємо рими та вивчаємо trennbare Verben (aufräumen, einkaufen, wegbringen).",
    file: "klas-7/modul-a/lektion-8.html",
    nove: true,
    dz: "Schreib 5–6 Sätze über die Hausarbeit in deiner Familie: Wer macht was zu Hause mit? Benutze mindestens zwei trennbare Verben (z. B. aufräumen, einkaufen, wegbringen) im Präsens."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 1,
    nazva: "Вступний урок. Вікторина про Німеччину",
    opys: "Складніша вікторина про факти Німеччини (сусідні країни, гори, річки, Берлінська стіна) та граматична тема Superlativ (найвищий ступінь порівняння прикметників).",
    file: "klas-8/modul-a/lektion-1.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über Deutschland. Benutze dabei mindestens drei Superlativformen (z. B. der größte, der längste, der bekannteste ...). Du kannst Fakten aus dem Unterricht oder aus dem Internet nutzen."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 2,
    nazva: "Вхідна діагностувальна робота №1",
    opys: "Виконуємо вхідну діагностувальну роботу №1 в інтерактивному форматі: граматика/лексика (Futur, Imperativ, заперечення, Perfekt), діалог, читання про Bodensee і лист-відповідь Marcus.",
    file: "klas-8/modul-a/lektion-2.html",
    nove: true,
    dz: "Schau dir noch einmal deine Antworten aus der Diagnose an und überlege, wo du dir unsicher warst. Schreib außerdem 3 Sätze im Perfekt über dein letztes Wochenende."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 3,
    nazva: "Wie erholst du dich?",
    opys: "Стиль життя і відпочинок: слухання (вірш Th. Fontane «Guter Rat» і діалог про літні канікули), асоціограма й сортування видів відпочинку, граматика «man kann ... machen».",
    file: "klas-8/modul-a/lektion-3.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über deinen Alltag: Wie erholst du dich meistens? Benutze mindestens drei Sätze mit der Konstruktion „man kann ... + Infinitiv“ (z. B. „Man kann im Park spazieren gehen.“) und erwähne auch ein Hobby, das du besonders gern hast."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 4,
    nazva: "Nach den Sommerferien",
    opys: "СМС-листування Яна і Петрика про літні пригоди (Perfekt, читання з правильно/неправильно), нова граматика — прийменники з Genitiv (außerhalb, innerhalb, während, wegen, trotz, unweit, infolge).",
    file: "klas-8/modul-a/lektion-4.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) darüber, wie du die ersten Schulwochen nach den Sommerferien erlebst. Benutze dabei mindestens drei Genitiv-Präpositionen (außerhalb, innerhalb, während, wegen, trotz, unweit oder infolge) und erzähl auch, worauf du dich in diesem Schuljahr am meisten freust."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 5,
    nazva: "Wie war dein Sommerurlaub?",
    opys: "Читаємо оголошення про подорожі й повідомлення про літні канікули трьох персонажів, зіставляємо, хто куди їздив, і тренуємо Perfekt (haben/sein + Partizip II).",
    file: "klas-8/modul-a/lektion-5.html",
    nove: true,
    dz: "Schreib ein kurzes SMS-Gespräch (6–8 Nachrichten) zwischen dir und einem Freund / einer Freundin über eure Sommerferien. Nutzt zusammen mindestens vier Verben im Perfekt (z. B. sein, fahren, machen, fotografieren, genießen) und erwähnt am Ende, welche drei Sachen ihr für den Urlaub gepackt habt."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 6,
    nazva: "Aktive Erholung: Sportarten",
    opys: "Лексика активного дозвілля: будуємо складні іменники-назви видів спорту, розподіляємо їх за групами (Leichtathletik, Wassersport, Mannschaftssport, Skisport, Fitness) і тренуємо аудіювання за діалогом про улюблені заняття спортом.",
    file: "klas-8/modul-a/lektion-6.html",
    nove: true,
    dz: "Schreib ein kurzes Interview (5–6 Fragen und Antworten) mit dir selbst oder einem Familienmitglied über aktive Erholung: Welche Sportarten treibst du? Wie oft? Erwähne mindestens einen Mannschaftssport und benutze das Verb „Sport treiben“ mindestens einmal."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 9,
    nazva: "Ich mache im Haushalt mit (Teil 2)",
    opys: "Продовжуємо тему хатніх обов'язків: сортуємо справи за часом доби, тренуємо нові відокремлювані дієслова (abholen, mitmachen, zubereiten, fernsehen) і перевіряємо себе аудіозаписом.",
    file: "klas-7/modul-a/lektion-9.html",
    nove: true,
    dz: "Schreib einen kurzen Dialog (6–8 Repliken) zwischen zwei Familienmitgliedern über die Hausarbeit für morgen: Wer macht was, wann und wie oft? Benutze mindestens drei trennbare Verben (z. B. aufräumen, abholen, mitmachen, zubereiten, wegräumen) im Präsens und mindestens zwei Häufigkeitsangaben (z. B. regelmäßig, nicht sehr oft, zweimal am Tage)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 1,
    nazva: "Вступний урок. Вікторина про Німеччину",
    opys: "Ускладнена вікторина про факти Німеччини (сусідні держави, річки, гори, Bundesländer-міста, історичні дати) з поглибленим граматичним фокусом на атрибутивний Superlativ.",
    file: "klas-9/modul-a/lektion-1.html",
    nove: false,
    dz: "Recherchiere und schreib 4–5 neue Fakten über Deutschland, die wir im Unterricht NICHT besprochen haben. Benutze dabei mindestens zwei Superlativformen (z. B. „die bekannteste Universität ist ...“, „der berühmteste deutsche Autor ist ...“). Bring deine Fakten zur nächsten Stunde mit – wir vergleichen sie im Quiz-Stil!"
  },
  {
    klas: "9",
    modul: "A",
    lektion: 2,
    nazva: "Mein Sommer",
    opys: "Повторення Perfekt на матеріалі літніх спогадів, квіз 'Stimmt das?' про факти Німеччини та вивчення прикметників характеру через ігри-знайомства.",
    file: "klas-9/modul-a/lektion-2.html",
    nove: true,
    dz: "Schreib einen kurzen Steckbrief über deine Persönlichkeit (5–6 Sätze). Benutze mindestens drei Adjektive aus dieser Stunde (z. B. neugierig, klug, kreativ, gelassen, aufmerksam) und einen Satz im Perfekt über ein besonderes Erlebnis in diesem Sommer."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 3,
    nazva: "Вхідна діагностувальна робота №1",
    opys: "Виконуємо вхідну діагностувальну роботу №1: граматика/лексика (Konjunktionen, Komparativ, Artikel, Präteritum, Modalverben, Futur I, Imperativ), діалог на встановлення відповідності, читання про мовний курс у Мюнхені та лист-відповідь Феліксу.",
    file: "klas-9/modul-a/lektion-3.html",
    nove: true,
    dz: "Schau dir noch einmal deine Antworten aus der Diagnose an und markiere, wo du dir unsicher warst. Schreib außerdem 4–5 Sätze: Was möchtest du in Zukunft beruflich machen, und was kannst du persönlich für den Umweltschutz tun? Benutze dabei mindestens ein Modalverb (z. B. möchten, wollen, müssen, können)."
  }
];
