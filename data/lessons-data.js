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
  },
  {
    klas: "9",
    modul: "A",
    lektion: 4,
    nazva: "Fehlerdetektive: Grammatik unter der Lupe",
    opys: "Аналіз типових помилок вхідної діагностувальної роботи у форматі гри-розслідування: знаходимо помилки у вигаданому листі (Nebensätze, Komparativ, Artikel, Präteritum, Modalverben, Futur I, Imperativ) і закріплюємо теми у квізі й вправі на пропуски.",
    file: "klas-9/modul-a/lektion-4.html",
    nove: true,
    dz: "Schreib 5–6 Sätze über deine Zukunftspläne: Was möchtest du nach der Schule machen? Benutze dabei mindestens ein Modalverb (z. B. möchten, wollen, können), eine Futur-I-Form (werde ... + Infinitiv), einen Komparativ (z. B. interessanter, besser) und einen Satz mit „weil“ (mit dem Verb am Satzende)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 5,
    nazva: "Meine Familie, meine Freunde",
    opys: "Читаємо вірш про дітей і мир у родині, будуємо асоціограму зі словом „Familie“ та вчимося описувати стосунки в родині (einander verstehen, engen Kontakt haben, sich streiten тощо).",
    file: "klas-9/modul-a/lektion-5.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über die Beziehungen in deiner Familie oder in der Familie eines Freundes / einer Freundin. Benutze dabei mindestens vier Ausdrücke aus dem Wortmaterial von Üb. 3 (z. B. einander gut verstehen, engen Kontakt haben, Respekt haben, sich streiten) und einen Satz mit „weil“."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 6,
    nazva: "Коли всі разом…",
    opys: "Стосунки в родині: дієслова зі сталими прийменниками (sorgen für, Angst haben vor, böse sein auf...), особові займенники у Dativ/Akkusativ і речення з wenn (порядок слів).",
    file: "klas-9/modul-a/lektion-6.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über deine Familie: Wann fühlst du dich glücklich, gestresst oder stolz in deiner Familie? Benutze mindestens drei wenn-Sätze (z. B. „Ich bin glücklich, wenn …“) und mindestens zwei Personalpronomen im Dativ oder Akkusativ (z. B. ihm, ihr, ihnen)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 7,
    nazva: "Сімейні стосунки: Wortfolge im wenn-Satz",
    opys: "Розбираємо два порядки слів у wenn-реченнях (Hauptsatz+Nebensatz і навпаки), тренуємось на комбінуванні речень, читаємо три форумні дописи підлітків про сімейні проблеми і шукаємо в одному з них усі wenn-речення.",
    file: "klas-9/modul-a/lektion-7.html",
    nove: true,
    dz: "Schreib eine Antwort auf einen der Forumsbeiträge (6–8 Sätze): Gib der Person einen Rat, wie sie ihr Familienproblem lösen kann. Benutze mindestens drei wenn-Sätze (probiere beide Wortfolgen: Hauptsatz + wenn ... und Wenn ..., + Hauptsatz) und mindestens einen Satz mit einem Dativ-Verb (z. B. helfen, zuhören, raten)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 10,
    nazva: "Ich helfe zu Hause",
    opys: "Слухаємо розповідь Лукаса про те, що він любить і не любить робити вдома, читаємо допис-опитування в соцмережі про хатні справи та пишемо власний коментар до нього.",
    file: "klas-7/modul-a/lektion-10.html",
    nove: true,
    dz: "Mach eine kleine Umfrage in deiner Familie: Frage mindestens drei Personen, welche Hausarbeit sie gern und welche sie nicht gern machen. Schreib die Ergebnisse auf (6–8 Sätze) und benutze dabei mindestens zwei Ausdrücke mit „gern“/„nicht gern“ und eine Häufigkeitsangabe (z. B. regelmäßig, zweimal am Tage)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 11,
    nazva: "Familientraditionen",
    opys: "Вірш про вечірку в дідуся Мартіна (аудіювання), лексика сімейних традицій та нова граматична тема Futur I (werden + Infinitiv) на матеріалі діалогу Felix und Luisa.",
    file: "klas-7/modul-a/lektion-11.html",
    nove: true,
    dz: "Schreib 6–8 Sätze im Futur I darüber, was deine Familie am nächsten Wochenende gemeinsam unternehmen wird. Benutze mindestens vier Verben mit „werden + Infinitiv“ und nenne mindestens zwei Familientraditionen (z. B. gemeinsames Essen, ein Ausflug, ein Spaziergang, Verwandte besuchen)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 12,
    nazva: "Familienfeste: wie feiert deine Familie?",
    opys: "Тренуємо Futur I (перевірка ДЗ), зіставляємо картинки зі святами, читаємо три тексти про традиції родини König (Ostern, Weihnachten, Geburtstag) з прикметниковими закінченнями і перевіряємо розуміння в Richtig/Falsch.",
    file: "klas-7/modul-a/lektion-12.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über ein Familienfest, das du besonders gut in Erinnerung hast (z. B. Geburtstag, Weihnachten, ein anderes Fest). Erzähl im Perfekt, was passiert ist, und benutze mindestens zwei Adjektive mit richtiger Endung (z. B. ein schönes Fest, eine lustige Party) sowie eine Häufigkeitsangabe (z. B. jedes Jahr, einmal im Jahr)."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 7,
    nazva: "Extreme Sportarten und aktive Erholung",
    opys: "Форумні дописи підлітків про спорт (Fitness-Studio, Handball, Eishockey, Tanzen), повторення прийменників з Genitiv на автентичному тексті та два аудіювання.",
    file: "klas-8/modul-a/lektion-7.html",
    nove: true,
    dz: "Schreib einen kurzen Forumsbeitrag (6–8 Sätze) über deine eigene aktive Erholung, ähnlich wie Sabine, Paul, Lukas oder Maria. Benutze dabei mindestens drei Präpositionen mit Genitiv (innerhalb, außerhalb, während, wegen, unweit, infolge, trotz) und erzähl auch, was dich an deiner Sportart am meisten fasziniert."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 8,
    nazva: "Wir treiben Sport",
    opys: "Інтерв'ю про спортивні звички, назви екстремальних видів спорту (Freiklettern, Fallschirmspringen, Mountainbiking, Bungeejumping, Rafting, Parkour, Canyoning) з аудіюванням та граматика 'man + Modalverb'.",
    file: "klas-8/modul-a/lektion-8.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über eine Extremsportart, die dich am meisten interessiert. Benutze dabei mindestens drei Sätze mit „man“ und einem Modalverb (man muss, man kann, man darf, man braucht) und erkläre, warum genau diese Sportart für dich einen echten Nervenkitzel bedeutet."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 8,
    nazva: "Zwischenmenschliche Beziehungen in der Familie",
    opys: "Читаємо про родинні ситуації трьох підлітків (Eddy, Marianna, Miriam), вчимось давати поради за допомогою модальних дієслів з 'man' і мовних кліше для дискусії, пишемо власні поради для доброго клімату в родині.",
    file: "klas-9/modul-a/lektion-8.html",
    nove: true,
    dz: "Wähle eine der drei Personen aus Üb. 1 (Eddy, Marianna oder Miriam) und schreib ihr/ihm eine kurze Antwort (6–8 Sätze): Gib konkrete Ratschläge zu genau ihrer/seiner Familiensituation. Benutze dabei mindestens zwei Sätze mit „man“ + Modalverb (man muss, man soll, man kann) und mindestens ein Redemittel zum Diskutieren (z. B. „Ich denke, dass ...“, „Meiner Meinung nach ...“)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 9,
    nazva: "Meine Freunde sind mir wichtig",
    opys: "Німецькі прислів'я про дружбу з аудіоконтролем, закінчення прикметників після 'ein' (Nominativ/Akkusativ) та опис зовнішності й характеру друзів.",
    file: "klas-9/modul-a/lektion-9.html",
    nove: true,
    dz: "Schreib eine kurze Beschreibung (6–8 Sätze) von deinem besten Freund / deiner besten Freundin: Aussehen und Charakter. Benutze dabei mindestens vier Adjektive mit richtiger Endung (z. B. „ein lustiger Junge“, „lange Haare“, „eine nette Freundin“) und mindestens ein Sprichwort über Freundschaft aus dem heutigen Unterricht."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 9,
    nazva: "Aktive Erholung: Extremsport oder lieber sicher?",
    opys: "Читаємо про молодь і екстремальний спорт (Naturerlebnis, Nervenkitzel, Stolz- und Glücksgefühl), повторюємо 'man + Modalverb' і тренуємо лексику через опитування й діалог про улюблені та екстремальні види спорту.",
    file: "klas-8/modul-a/lektion-9.html",
    nove: true,
    dz: "Schreib einen Forumsbeitrag (8–10 Sätze) über deine sportlichen Gewohnheiten: Welche Sportart(en) treibst du? Wann und wie oft trainierst du? Warum genau dieser Sport (z. B. Teamgeist, Fitness, Nervenkitzel)? Hast du Pläne, eine neue Sportart oder sogar eine Extremsportart auszuprobieren? Benutze mindestens drei Ausdrücke aus dem heutigen Unterricht (z. B. Teamgeist, die Höhenangst überwinden, sich glücklich fühlen, gefährlich/riskant finden) und mindestens einen Satz mit „man + Modalverb“."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 13,
    nazva: "Familienfeste und -traditionen",
    opys: "Анкета про сімейні традиції та прийоми їжі, гра-інтерв'ю „Familienfeste“, нова лексика (Fragebogen, Ritual, Mahlzeit) і повторення Perfekt/прикметникових закінчень.",
    file: "klas-7/modul-a/lektion-13.html",
    nove: true,
    dz: "Führe zu Hause ein kurzes Interview mit einem Familienmitglied über eure Familientraditionen (mindestens 6 Fragen aus unserem Fragebogen im Unterricht, z. B. über Mahlzeiten, Feste, Rituale, Urlaub, Hobbys). Schreib die Antworten auf (6–8 Sätze) und benutze dabei mindestens vier Wörter aus dem heutigen Wortschatz (z. B. Mahlzeit, Ritual, Fragebogen, Urlaubsort)."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 14,
    nazva: "У колі сім'ї: повторення (Hausarbeit & Familienfeste)",
    opys: "Повторювальний урок модуля: зіставляємо стійкі вирази про хатні справи, слухаємо аудіо й нумеруємо картинки, шукаємо навмисні помилки в грі «Das ist aber falsch!».",
    file: "klas-7/modul-a/lektion-14.html",
    nove: true,
    dz: "Schreib einen kurzen SMS-Dialog (6–8 Nachrichten) zwischen dir und deinem Bruder / deiner Schwester (oder einem Freund / einer Freundin): Wer macht heute welche Hausarbeit zu Hause? Benutze dabei mindestens vier Ausdrücke aus dem heutigen Wortschatz (z. B. das Geschirr spülen, die Wäsche bügeln, den Müll wegbringen, Staub saugen, das Haus aufräumen) und erwähne am Ende ein Familienfest, auf das ihr euch freut."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 15,
    nazva: "Haushalt: gut, okay oder nicht besonders gut?",
    opys: "Висловлюємо думку про хатні активності (gut/okay/nicht besonders gut) за зразком діалогу, повторюємо Futur I через сімейний блог і настільну гру про родину.",
    file: "klas-7/modul-a/lektion-15.html",
    nove: true,
    dz: "Schreib einen kurzen Beitrag für deinen eigenen „Familienblog“ (6–8 Sätze): Was werdet ihr am nächsten Wochenende zu Hause machen? Benutze mindestens vier Sätze im Futur I mit verschiedenen Subjekten (ich, du/er/sie, wir) und nenne dabei mindestens zwei Hausarbeiten (z. B. Staub saugen, die Kleidung waschen, das Haus aufräumen). Schreib am Ende einen Satz mit deiner Meinung, z. B. „Das finde ich nicht besonders gut, weil …“ oder „Das finde ich ganz gut, weil …“."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 16,
    nazva: "Mein Tagesablauf",
    opys: "Uhrzeiten у побутовій формі (Viertel vor/nach, halb) на матеріалі аудіозапису про розпорядок дня Luisa; повторення й розширення теми домашніх обов'язків через слухання з пропусками, квіз на розуміння і вправу 'хатні справи чи дозвілля?'.",
    file: "klas-7/modul-a/lektion-16.html",
    nove: true,
    dz: "Schreib einen kurzen Text (6–8 Sätze) über deinen typischen Schultag. Nutze mindestens vier Uhrzeiten in der Alltagsform (z. B. Viertel vor acht, halb neun, zwanzig nach fünf) und erwähne mindestens drei Hausarbeiten, die du an diesem Tag machst (z. B. das Bett machen, die Blumen gießen, das Geschirr spülen). Benutze dabei mindestens zwei trennbare Verben im Präsens."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 10,
    nazva: "Charaktereigenschaften: Wie sind wahre Freunde?",
    opys: "Нові прикметники характеру (ehrlich, hilfsbereit, taktvoll, tolerant, zuverlässig), закінчення прикметників (attributiv/prädikativ) та читання форумних дописів підлітків про справжню дружбу.",
    file: "klas-9/modul-a/lektion-10.html",
    nove: true,
    dz: "Interviewt euch gegenseitig (zu zweit oder mit einem Familienmitglied) über den besten Freund / die beste Freundin: Name, Alter, Aussehen, Lieblingskleidung, Charakter. Schreibt die Antworten eurer Partnerin / eures Partners auf (6–8 Sätze). Benutzt dabei mindestens vier Adjektive aus dem heutigen Wortschatz (z. B. ehrlich, hilfsbereit, taktvoll, zuverlässig) — davon mindestens zwei mit richtiger Endung vor einem Nomen (z. B. „ein hilfsbereiter Junge“) und mindestens eins nach „sein“ ohne Endung (z. B. „Sie ist sehr ehrlich.“)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 11,
    nazva: "Gemeinsame Interessen",
    opys: "Аудіювання про хобі трьох підлітків (Lars, Anna, Ines: гурт, малювання, волейбол), граматика 'sich interessieren für / sich beschäftigen mit' та мовні кліше для вираження згоди/незгоди.",
    file: "klas-9/modul-a/lektion-11.html",
    nove: true,
    dz: "Schreib einen kurzen Forumsbeitrag (6–8 Sätze) über dein eigenes Hobby — ähnlich wie Lars, Anna oder Ines aus dem heutigen Hörtext. Benutze dabei mindestens zwei Ausdrücke aus dem heutigen Unterricht (z. B. „sich interessieren für“, „sich beschäftigen mit“) und erzähl, wie oft und mit wem du das machst."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 12,
    nazva: "Freunde und Freizeit",
    opys: "Продовжуємо тему дружби: що підлітки роблять разом у вільний час, як розпізнати справжнього друга (читання форум-посту) і граматика речень з «wenn ..., dann ...».",
    file: "klas-9/modul-a/lektion-12.html",
    nove: true,
    dz: "Schreib einen Forumsbeitrag (6–10 Sätze) zum Thema „Wahre Freundschaft“. Gehe dabei auf folgende Punkte ein: Gibt es wahre Freunde? Wer kann als echte(r) Freund(in) gelten? Woran erkennt man echte Freunde? Was kann man zusammen mit Freunden unternehmen? Benutze dabei mindestens zwei Sätze mit „wenn ..., dann ...“ (z. B. „Wenn ich jemanden Freund nenne, dann vertraue ich ihm/ihr voll und ganz.“)."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 10,
    nazva: "Gesunde Lebensweise: Sprichwörter und gute Ratschläge",
    opys: "Німецькі прислів'я про здоров'я з аудіюванням, сортуємо корисні й шкідливі звички за принципом gesund/schädlich та вчимося радити конструкцією „man sollte + Infinitiv“.",
    file: "klas-8/modul-a/lektion-10.html",
    nove: true,
    dz: "Lies den Text über Jonas' Tag und finde 5 Fehler — Aussagen, die einem gesunden Leben widersprechen. Schreib den Text richtig ab (korrigiere die 5 Stellen): „Jonas steht jeden Tag erst um elf Uhr vormittags auf und isst dann sofort viele Süßigkeiten zum Frühstück, weil das seiner Meinung nach sehr gesund ist. Nach der Schule liegt er drei Stunden lang in der Sonne und trinkt dabei kein Wasser. Am Abend isst er sehr spät, um Mitternacht, und geht dann sofort schlafen. Jonas findet, man muss sich nicht bewegen, um fit zu bleiben.\u201c Schreib danach noch 2 eigene Sätze mit „man sollte“, was Jonas stattdessen tun sollte."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 11,
    nazva: "Sport das ganze Jahr",
    opys: "Форумні дописи чотирьох підлітків (Jan, Maria, Michael, Petra) про спортивні звички і спосіб життя в різні пори року; граматика gern – lieber – am liebsten.",
    file: "klas-8/modul-a/lektion-11.html",
    nove: true,
    dz: "Zeichne (oder gestalte digital) deinen persönlichen „Sportkalender“ für ein Jahr: vier Felder für vier Jahreszeiten (Frühling, Sommer, Herbst, Winter). Schreib zu jeder Jahreszeit mindestens eine Sportart, die du in dieser Zeit gern treibst, und einen kurzen Satz dazu (z. B. „Im Winter laufe ich gern Ski.“ oder „Am liebsten fahre ich im Sommer Rad.“). Benutze insgesamt mindestens zweimal gern/lieber/am liebsten."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 17,
    nazva: "Тематична контрольна робота за Модуль A",
    opys: "Контрольна робота за темою «Я, моя родина, мої друзі»: лексика (хатні справи, свята, прийоми їжі), прийменники Wo?/Wohin? і з Dativ, Perfekt, Futur I, відокремлювані дієслова, читання листа Емми, пошук помилок і лист-відповідь.",
    file: "klas-7/modul-a/lektion-17.html",
    nove: true,
    dz: "Schau dir deine Ergebnisse in der Kontrollarbeit an und schreib drei Fehler, die du gemacht hast, richtig in dein Heft – mit einer kurzen Regel auf Ukrainisch. Erstelle danach ein Mini-Quiz für deine Mitschüler: 5 Fragen zum Modul A (z. B. Hausarbeit, Familienfeste, Präpositionen, Perfekt oder Futur I) mit je drei Antwortmöglichkeiten – nur eine ist richtig. In der nächsten Stunde spielen wir eure Quizfragen."
  },
  {
    klas: "7",
    modul: "A",
    lektion: 18,
    nazva: "Projekt: Schöne Familientraditionen",
    opys: "Проєктний урок: плануємо фотоколаж і презентацію про сімейні традиції — етапи проєкту, Imperativ для «ihr», теми (ритуали, свята, подорожі, незвичайні традиції), тексти до колажу та фрази для презентації й коментарів.",
    file: "klas-7/modul-a/lektion-18.html",
    nove: true,
    dz: "Gestalte (allein oder mit deiner Gruppe) eine Foto-Collage zum Thema „Schöne Familientraditionen“: Wähle 3–4 Traditionen deiner Familie (z. B. ein Familienritual, einen Familienfeiertag, eine Familienreise oder eine ungewöhnliche Tradition), klebe oder zeichne passende Bilder dazu und schreib zu jedem Bild 2–3 Sätze mit einer Zeitangabe (z. B. jeden Sonntag, einmal im Jahr, im Sommer). Bereite außerdem eine kurze Präsentation (ca. 1 Minute) vor und benutze dabei mindestens drei Redemittel aus dem heutigen Unterricht (z. B. „Unser Projekt heißt …“, „Auf diesem Foto seht ihr …“, „Uns gefällt diese Tradition, weil …“). Wer möchte, dreht dazu auch ein kurzes Video (bis 1 Minute)."
  },
  {
    klas: "7",
    modul: "B",
    lektion: 1,
    nazva: "Einkaufen und kochen",
    opys: "Скоромовки про їжу (аудіо), міри й упаковки (Flasche, Dose, Glas, Tüte, Kilo, Gramm, Liter, Pfund) з аудіоконтролем, Nullartikel після Mengenangaben, що потрібно для страви, і власний Einkaufszettel.",
    file: "klas-7/modul-b/lektion-1.html",
    nove: true,
    dz: "Mach zu Hause einen „Küchen-Check“: Schau in den Kühlschrank und in den Küchenschrank und schreib einen Einkaufszettel mit 8 Produkten, die deine Familie diese Woche braucht. Benutze mindestens sechs verschiedene Mengenangaben (z. B. eine Flasche, eine Dose, ein Glas, eine Tüte, eine Packung, ein Kilo, 200 Gramm, ein Pfund) – ohne Artikel vor dem Produkt (Nullartikel!) – und mindestens zwei Mengenangaben im Plural (z. B. drei Flaschen, zwei Tüten). Schreib am Ende einen Satz: „Für … braucht man …“."
  },
  {
    klas: "7",
    modul: "B",
    lektion: 2,
    nazva: "Im Lebensmittelgeschäft",
    opys: "Діалог у крамниці з аудіо (зіпсована ковбаса), займенники etwas / was / nichts, скарги на неякісні продукти (unreif, verdorben, zerrissen…) і що роблять на кухні з безособовим man.",
    file: "klas-7/modul-b/lektion-2.html",
    nove: true,
    dz: "1) Bring den Dialog in die richtige Reihenfolge und schreib ihn ins Heft: a) Nein, danke. Nichts mehr. b) Guten Tag! Brauchen Sie etwas? c) Aber die Brötchen sind trocken! So was kann ich nicht nehmen. d) Ja, ich brauche vier Brötchen, bitte. e) Oh, Entschuldigung! Hier sind frische Brötchen. Brauchen Sie noch etwas? f) Bitte schön. 2) Schreib dein Lieblingsrezept (5–6 Sätze) mit „man“: Was braucht man und was macht man in der Küche? Benutze mindestens vier Verben aus der Stunde (z. B. schälen, waschen, schneiden, vermischen, umrühren, braten, dazugeben) und einmal „etwas“ oder „nichts“."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 12,
    nazva: "Mein Tagesablauf",
    opys: "Неофіційний час (Viertel nach, halb, fünf vor halb…) з аудіоконтролем, аудіювання про шкільний день Луїзи, зворотні дієслова з sich в Akkusativ і Dativ (ich kämme mich / ich kämme mir die Haare) та інтерв'ю в парах із порадами.",
    file: "klas-8/modul-a/lektion-12.html",
    nove: true,
    dz: "Mach ein Interview mit einem Familienmitglied (Mutter, Vater, Bruder, Schwester, Oma …) über seinen / ihren Tagesablauf an einem Werktag. Stell mindestens 6 Fragen (z. B. „Um wie viel Uhr stehst du auf?“, „Wann putzt du dir die Zähne?“, „Wann isst du zu Abend?“) und notiere die Antworten in der 3. Person mit inoffiziellen Uhrzeiten (z. B. „Meine Mutter steht um Viertel nach sechs auf.“). Benutze mindestens drei reflexive Verben – mindestens eins mit sich im Akkusativ (sich waschen, sich anziehen …) und eins mit sich im Dativ (sich die Zähne putzen, sich einen Film ansehen …). Schreib am Ende einen Tipp für diese Person mit „Es ist besser / gesünder, um … aufzustehen / ins Bett zu gehen.“"
  },
  {
    klas: "8",
    modul: "A",
    lektion: 13,
    nazva: "Elemente einer gesunden Lebensweise",
    opys: "Читаємо про опитування «Fünfmal am Tag» (хто в Європі їсть досить овочів і фруктів), шукаємо корисні звички у форумному дописі, від «man muss + Infinitiv» переходимо до порад в Imperativ (du / ihr / Sie) і пишемо власні поради.",
    file: "klas-8/modul-a/lektion-13.html",
    nove: true,
    dz: "Mach den „Fünfmal-am-Tag“-Test: Notiere drei Tage lang (z. B. Freitag, Samstag, Sonntag), wie viele Portionen Obst und Gemüse du isst und wie viele Gläser Wasser du trinkst. Schreib danach einen kurzen Post für die Schülerzeitung (5–6 Sätze): Wie gut schneidest du beim Test ab? (z. B. „Am Samstag habe ich nur zwei Portionen gegessen – da schneide ich schlecht ab.“) Gib am Ende drei Tipps für eine gesunde Lebensweise im Imperativ – einen für einen Freund (du), einen für die Klasse (ihr) und einen für einen Erwachsenen (Sie), z. B. „Trink mehr Wasser!“, „Esst weniger Fastfood!“, „Gehen Sie jeden Tag spazieren!“."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 14,
    nazva: "Meine Freizeit",
    opys: "Повторення лексики модуля (спорт, екстремальний спорт, розпорядок дня, літній відпочинок), аудіювання про канікули в «індіанському таборі», аргументи за і проти екстремального спорту, опитування з während + Genitiv і гра-загадка «Ich sehe was, was du nicht siehst» (wenn-Satz, damit/darin/darauf).",
    file: "klas-8/modul-a/lektion-14.html",
    nove: true,
    dz: "Schreib 5 Rätsel-Karten für das Spiel „Ich sehe was, was du nicht siehst“ zum Thema Freizeit und Erholung (z. B. Dinge für Camping, Sport oder Urlaub). Auf die Vorderseite schreibst du 2–3 Sätze, ohne das Wort selbst zu nennen: Wie ist es? (Das ist klein / rund / aus Holz …) Und wozu braucht man es? Benutze in jedem Rätsel einen Satz mit „wenn“ (z. B. „Man braucht es, wenn man Feuer machen will.“) und in mindestens zwei Rätseln „damit“ oder „darin“ (z. B. „Damit kann man …“). Auf die Rückseite schreibst du die Lösung mit Artikel (z. B. „die Streichhölzer“). Nächstes Mal spielen wir mit euren Karten!"
  },
  {
    klas: "9",
    modul: "A",
    lektion: 13,
    nazva: "Persönliche Daten",
    opys: "Персональні дані в анкеті-Steckbrief (зіставлення, гра «Wer ist das?»), утворення іменників від дієслів з аудіо (besuchen → der Besuch, forschen → die Forschung, leben → das Leben), роки на слух і як їх читати та біографія бабусі Міріам із пропусками.",
    file: "klas-9/modul-a/lektion-13.html",
    nove: true,
    dz: "Zeichne einen Lebensstrahl (Zeitstrahl) für ein Familienmitglied (z. B. Oma, Opa, Mutter, Vater) oder für eine bekannte Person aus der Ukraine. Trag mindestens 6 wichtige Daten ein und schreib zu jedem Datum ein Nomen aus dem heutigen Unterricht mit Artikel (z. B. die Geburt, der Abschluss, das Studium, die Heirat, der Umzug, die Arbeit, die Auszeichnung). Schreib bei drei Jahreszahlen auch in Worten, wie man sie liest (z. B. 1978 – neunzehnhundertachtundsiebzig). Mach außerdem einen kurzen Steckbrief zu dieser Person (Vorname, Nachname, Alter, Wohnort, Beruf, Hobbys)."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 14,
    nazva: "Mein Lebenslauf",
    opys: "Біографія Міхаеля Бауера: Präteritum слабких, сильних і змішаних дієслів (таблиця форм з аудіоконтролем), життєпис із пропусками на слух, відокремлювані дієслова в підрядному реченні (umzog, leichtfielen) і als / wenn / wann.",
    file: "klas-9/modul-a/lektion-14.html",
    nove: true,
    dz: "Das sind Stichpunkte aus dem Leben von Lena Bauer, Michaels Schwester: am 3. März 1985 in Siegburg geboren · 1991 Umzug der Familie nach Bonn, Grundschule in Bonn · 1995 Wechsel aufs Gymnasium · Biologie und Chemie – leichtfallen · 2004 Abitur als die Beste der Klasse · Medizinstudium in Köln, 12 Semester · 2010 Praktikum in einem Krankenhaus in München · 2011 sich um eine Stelle in Bonn bewerben · seit 2011 Ärztin in einer Kinderklinik in Bonn. Schreib Lenas Lebenslauf in der Ich-Form (8–10 Sätze) im Präteritum (z. B. „Ich bin am 3. März 1985 in Siegburg geboren. Als meine Familie 1991 nach Bonn umzog, …“). Benutze mindestens zwei als-Sätze und mindestens zwei trennbare Verben (z. B. umziehen, leichtfallen). Unterstreiche alle Präteritumformen."
    },
  {
    klas: "9",
    modul: "A",
    lektion: 15,
    nazva: "Wendepunkte im Leben",
    opys: "Ключові моменти життя: порядок слів у підрядних реченнях часу з als (Hauptsatz + Nebensatz і навпаки), als / wenn / wann, пошук als-речень у блозі, Steckbrief Лени Бауер за життєписом та інтерв'ю з паном Бауером у ввічливій формі Sie.",
    file: "klas-9/modul-a/lektion-15.html",
    nove: true,
    dz: "Gestalte eine Seite „Mein Lebensalbum“: Wähle 5 wichtige Momente (Wendepunkte) aus deinem Leben (z. B. die Geburt deiner Schwester, der erste Schultag, ein Umzug, ein besonderes Ereignis in den Ferien). Klebe zu jedem Moment ein Foto ein oder zeichne ein Bild und schreib darunter eine Bildunterschrift mit einem als-Satz im Präteritum. Mindestens zwei Sätze beginnen mit „Als …“ (z. B. „Als ich sechs war, kam ich in die Schule.“), und in mindestens einem Satz steht ein trennbares Verb (z. B. „…, als wir nach Lwiw umzogen.“). Schreib außerdem drei Interviewfragen in der Sie-Form an eine bekannte Person, deren Lebenslauf dich interessiert (z. B. „Wann haben Sie Ihre erste Stelle bekommen?“)."
  },
  {
    klas: "7",
    modul: "B",
    lektion: 3,
    nazva: "Wir kochen nach Rezept",
    opys: "Кухонне приладдя (Pfanne, Löffel, Kochtopf, Backofen, Messer, Schüssel) і man kann + Infinitiv з mit/in + Dativ, СМС Яна й рецепт «Würstchen mit Sauerkraut», порядок кроків приготування, розповідь із zuerst / dann / danach / zum Schluss (man brät, man stellt … beiseite) і власна картка-рецепт.",
    file: "klas-7/modul-b/lektion-3.html",
    nove: true,
    gram: ["indefinitpronomen", "modalverben", "praep-dativ", "trennbare-verben"],
    dz: "1) Schreib einen SMS-Chat (8–10 Nachrichten) mit einem Freund oder einer Freundin aus Deutschland – wie Petryk und Jan: Er/Sie fragt, was ihr gestern gegessen habt. Du erzählst von einem typisch ukrainischen Gericht (z. B. Borschtsch, Wareniki, Syrnyky) und schickst das Rezept. Erzähl die Zubereitung in mindestens vier Schritten mit „man“ und mit zuerst, dann, danach, zum Schluss (z. B. „Zuerst schält man die Kartoffeln.“). Benutze mindestens ein trennbares Verb (z. B. umrühren, dazugeben, beiseitestellen). 2) Zeichne vier Küchengeräte und schreib zu jedem einen Satz: „Mit einem Messer kann man Brot schneiden.“ / „In einer Pfanne kann man …“."
  },
  {
    klas: "7",
    modul: "B",
    lektion: 4,
    nazva: "In der Küche: Küchengeräte",
    opys: "Вісім кухонних приладів (der Herd, der Kühlschrank, die Mikrowelle, der Mixer…) з двома аудіо, складні іменники (Kaffee + Maschine = die Kaffeemaschine, артикль від останнього слова), текст «Helfer in der Küche» і підрядне речення з wenn: Man benutzt …, wenn man … will / Wenn …, benutzt man …",
    file: "klas-7/modul-b/lektion-4.html",
    nove: true,
    gram: ["nebensaetze", "konditionalsaetze", "temporalsaetze"],
    dz: "1) Fehlersuche: Im Text sind 6 Fehler (Artikel oder Wortfolge). Finde sie und schreib den Text richtig ins Heft: „In unserer Küche gibt es viele Geräte. Das Kühlschrank ist groß und weiß. Meine Mutter benutzt den Herd, wenn sie kocht eine Suppe. Die Kaffeemaschine braucht mein Vater, wenn er ist am Morgen müde. Der Mikrowelle benutzen wir, wenn wir das Essen schnell aufwärmen wollen. Wenn ich Saft trinken will, ich benutze die Saftpresse. Die Küchenmaschine ist sehr praktisch, wenn man will einen Kuchen backen. Den Fleischwolf brauchen wir selten.“ 2) Mach ein Mini-Interview mit einem Familienmitglied: Welche Küchengeräte benutzt ihr zu Hause und wann? Schreib 4 Sätze mit „wenn“ (z. B. „Meine Oma benutzt den Mixer, wenn sie einen Kuchen backen will.“). Mindestens ein Satz beginnt mit „Wenn …“."
  },
  {
    klas: "7",
    modul: "B",
    lektion: 5,
    nazva: "Aus dem Kochbuch",
    opys: "Кухонні прилади в діалогах (einen / eine / ein, keinen / keine / kein), дієслова приготування з прийменниками (in einer Pfanne braten, durch den Fleischwolf drehen, mithilfe einer Raspel reiben), аудіорецепт дерунів із пропусками, мова рецептів (Infinitiv-Stil) і um … zu + Infinitiv та загадки про українські страви.",
    file: "klas-7/modul-b/lektion-5.html",
    nove: true,
    gram: ["infinitiv-um-zu", "wechselpraepositionen"],
    dz: "1) Schreib zwei Rätsel über ukrainische Spezialitäten (wie in Üb. 5, je 3–4 Sätze) – aber nenne den Namen des Gerichts nicht! Was für ein Gericht ist das (eine Suppe, ein Gemüsegericht, ein Fleischgericht, eine Süßspeise …)? Was braucht man dafür? Wie macht man es? Benutze in jedem Rätsel mindestens zwei Verben aus der Stunde (z. B. schälen, reiben, schneiden, würzen, braten, kochen) und schreib die Lösung mit Artikel auf die Rückseite. Nächstes Mal raten die anderen! 2) Schreib eine Rezeptkarte für unser „Klassen-Kochbuch“: Name des Gerichts, Zutaten für eine Portion mit Mengenangaben (z. B. zwei Esslöffel Mehl, eine Zwiebel) und 5 Schritte im Rezeptstil – mit dem Infinitiv am Ende (z. B. „Zuerst Kartoffeln schälen und reiben.“). Mindestens ein Schritt enthält „um … zu“ (z. B. „Eine Küchenmaschine benutzen, um die Zwiebeln zu zerkleinern.“)."
    },
  {
    klas: "7",
    modul: "B",
    lektion: 6,
    nazva: "Kochen lernen: Kochkurse",
    opys: "Як можна навчитися готувати: 8 способів (einen Kochkurs besuchen, Rezepte sammeln, sich eine Kochshow ansehen…), мета з um … zu і умова з wenn (Um besser kochen zu lernen, kann man … / Wenn man … will, kann man …), оголошення про кулінарні курси, книжки й шоу (зіставлення з ситуаціями, Richtig/Falsch) і обговорення: Welche Anzeige findest du interessant?",
    file: "klas-7/modul-b/lektion-6.html",
    nove: true,
    gram: ["infinitiv-um-zu", "konditionalsaetze"],
    dz: "Gestalte eine Anzeige (wie A–F in der Stunde) für einen Kochkurs, wo man ukrainische Spezialitäten kochen lernt. Deine Anzeige hat: einen Titel, den Namen des Kochs oder der Köchin, das Programm des Kurses (mindestens 4 ukrainische Gerichte, z. B. Borschtsch, Wareniki, Syrnyky, Kartoffelpuffer), wo und wie lange der Kurs ist und was er kostet. Schreib in deine Anzeige einen Satz mit „um … zu“ (z. B. „Um ukrainisch kochen zu lernen, besuchen Sie unseren Kurs!“) und einen Satz, der mit „Wenn …“ beginnt (z. B. „Wenn Sie Wareniki lieben, kommen Sie zu uns!“). Mal ein Bild dazu oder klebe ein Foto ein. Nächstes Mal hängen wir alle Anzeigen auf und jeder wählt einen Kurs."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 15,
    nazva: "Ein interessantes Abenteuer: Ferien im Indianerlager",
    opys: "Цікава пригода: аудіювання про канікули «гобі-індіанців» у Нижній Саксонії (картинки, факти, Richtig/Falsch з виправленням, Satzteile), Perfekt з haben / sein і відокремлювані дієслова (aufgewacht, mitgemacht, eingetreten), щоденник Яна, W-Fragen з ihr для рольового інтерв'ю та власна думка: Wie findest du diese Erholungsart? (weil / denn).",
    file: "klas-8/modul-a/lektion-15.html",
    nove: true,
    gram: ["perfekt-plusquamperfekt", "fragen"],
    dz: "Stell dir vor: Du warst eine Woche im Indianerlager in Niedersachsen. Schreib einen Post für deine Freunde in einem sozialen Netzwerk (6–8 Sätze) im Perfekt: Was hast du dort erlebt? Benutze mindestens drei Verben mit „sein“ (z. B. reiten, Kanu fahren, aufwachen) und zwei trennbare Verben (z. B. aufwachen, mitmachen, sich zudecken). Der letzte Satz ist deine Meinung mit „weil“: Wie findest du diese Erholungsart? Zeichne ein „Foto“ zu deinem Post (oder klebe eins ein) und schreib eine kurze Bildunterschrift. Unter den Post schreibst du zwei Kommentare von Freunden – zwei W-Fragen an dich (z. B. „Wo hast du geschlafen?“). Nächstes Mal beantworten wir die Fragen in Paaren."
  },
  {
    klas: "8",
    modul: "A",
    lektion: 16,
    nazva: "Тематична контрольна робота: Lebensstil",
    opys: "Контрольна робота за Модуль A «Стиль життя»: лексика (відпочинок, спорт, здоров'я, розпорядок дня), Perfekt, прийменники з Genitiv, Superlativ і gern – lieber – am liebsten, зворотні дієслова, man + Modalverb, Imperativ, порядок слів (weil, wenn, während), читання форумного допису й лист-відповідь.",
    file: "klas-8/modul-a/lektion-16.html",
    nove: true,
    gram: ["perfekt-plusquamperfekt", "praep-genitiv", "komparation", "reflexive-verben", "modalverben", "imperativ", "kausalsaetze", "konditionalsaetze"],
    dz: "Mach deine persönliche „Fehlerkarte“ zur Kontrollarbeit: Wähle drei Aufgaben aus verschiedenen Übungen, bei denen du einen Fehler gemacht hast oder unsicher warst. Schreib zu jeder Aufgabe: 1) deine Antwort, 2) die richtige Antwort, 3) die Regel in einem kurzen Satz mit Beispiel (z. B. „wegen + Genitiv: wegen des Regens“). Hattest du keine Fehler? Dann wähle die drei Aufgaben, die für dich am schwierigsten waren. Schreib außerdem eine eigene Quizfrage zum Wortschatz des Moduls „Lebensstil“ auf eine Karte: die Frage und drei Antworten (nur eine ist richtig). Nächstes Mal machen wir aus euren Karten ein Klassen-Quiz!"
  },
  {
    klas: "8",
    modul: "B",
    lektion: 1,
    nazva: "Meine Freunde und ich: Sprichwörter über Freundschaft",
    opys: "Вступ до модуля «Я і мої друзі»: німецькі прислів'я про дружбу (з'єднати частини й перевірити за аудіо, українські відповідники), що таке дружба (сортування ідей), присвійні артиклі mein / dein / sein / ihr, sich interessieren für, seit wann … befreundet, питання з карток, діалог Лени і Йонаса та інтерв'ю в парах про друзів.",
    file: "klas-8/modul-b/lektion-1.html",
    nove: true,
    gram: ["possessivartikel", "fragen", "verben-praepositionalobjekt"],
    dz: "1) Mach ein Interview mit einem Freund, einer Freundin oder einem Familienmitglied über seinen / ihren besten Freund oder seine / ihre beste Freundin. Stell mindestens fünf Fragen aus Üb. 5 (z. B. „Wie heißt dein Freund?“, „Seit wann seid ihr befreundet?“, „Wofür interessiert er sich?“) und schreib die Antworten in der 3. Person auf – mit „sein“ oder „ihr“ (z. B. „Ihr Freund heißt Taras. Sie sind seit drei Jahren befreundet. Er interessiert sich für Fußball.“). 2) Wähle ein Sprichwort über Freundschaft aus der Stunde, schreib es schön auf eine Karte, mal ein Bild dazu und schreib darunter das ukrainische Äquivalent. Nächstes Mal stellen wir die Interviews vor und machen aus euren Karten eine „Freundschaftswand“."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 16,
    nazva: "Meine Biografie: Albert Einstein",
    opys: "Біографія Альберта Ейнштейна: аудіювання з доповненням таблиці-життєпису й питаннями на деталі, Präteritum слабких і сильних дієслів з тексту (zog … um / als … umzog), дати в біографії (am / im / ab / von … bis / mit … Jahren, «im Jahr 1905», а не «in 1905»), роки словами та розповідь про життя вченого за таблицею.",
    file: "klas-9/modul-a/lektion-16.html",
    nove: true,
    gram: ["tempusformen", "starke-verben", "temporalsaetze", "zahlwoerter"],
    dz: "Stell dir vor: Es ist das Jahr 2080, und eine Zeitung schreibt über dein Leben. 1) Mach eine Tabelle wie Einsteins Lebenslauf in Üb. 1 (mindestens 8 Zeilen): links die Zeit (am …, ab …, von … bis …, mit … Jahren), rechts ein Nomen (z. B. Geburt in …, Abitur, Studium in …, Praktikum, Heirat, Umzug nach …, Auszeichnung mit dem …preis). 2) Schreib dazu einen kurzen Zeitungsartikel (8–10 Sätze) in der 3. Person im Präteritum (z. B. „Olena Petrenko ist am 5. Mai 2011 in Kyjiw geboren. Als sie 17 war, …“). Benutze mindestens zwei als-Sätze, ein trennbares Verb (z. B. umziehen, anfangen) und drei starke Verben (z. B. verließ, fand, wurde). Kein „in 2035“ – nur „2035“ oder „im Jahr 2035“! 3) Gib deinem Artikel eine Überschrift. Nächstes Mal lesen wir die Artikel ohne Namen vor und raten: Wessen Zukunft ist das?"
  },
  {
    klas: "9",
    modul: "A",
    lektion: 17,
    nazva: "Familienatmosphäre: Wiederholung",
    opys: "Родинна атмосфера — урок-повторення: добрі стосунки й виклики в родині (сортування), ein gutes Verhältnis zu + Dativ з denn / weil, допис Б'янки на форумі й поради (wenn-речення, Komparativ, «Du kannst versuchen, … zu …»), аудіювання з запитаннями для анкети-Steckbrief, презентація людини в 3-й особі (er / sein, sie / ihr) і гра з кубиком «Mein Umfeld».",
    file: "klas-9/modul-a/lektion-17.html",
    nove: true,
    gram: ["konjunktionen-position-null", "kausalsaetze", "konditionalsaetze", "komparation", "verben-dass-infinitiv", "possessivartikel"],
    dz: "Familien-Interview: Wähle eine Person aus deiner Familie oder einen Verwandten (z. B. Oma, Opa, Tante, Onkel, Cousin) und stell ihr die zehn Fragen aus Üb. 5 (z. B. „Wann und wo bist du geboren?“, „Wann bist du zur Schule gegangen?“). 1) Füll für diese Person einen Steckbrief aus – alle neun Zeilen wie in Üb. 5. 2) Schreib dazu eine kurze Präsentation in der 3. Person (6–8 Sätze) wie in Üb. 6 – mit „er / sein“ oder „sie / ihr“ (z. B. „Meine Oma heißt Halyna. Sie ist am 2. Juni 1958 in Tschernihiw geboren. Ihre Eltern waren …“). 3) Der letzte Satz ist über eure Beziehung: „Ich habe ein … Verhältnis zu ihm / zu ihr, denn …“. Kleb ein Foto ein oder zeichne die Person. Nächstes Mal stellen wir die Personen in Gruppen vor – die anderen stellen dir zwei Zusatzfragen."
  },
  {
    klas: "9",
    modul: "A",
    lektion: 18,
    nazva: "Тематична контрольна робота: Ich, meine Familie, meine Freunde",
    opys: "Тематична контрольна робота за модуль A (режим контрольної, бали рахуються автоматично): лексика модуля, дієслова з прийменниками й займенники в Dativ / Akkusativ, закінчення прикметників після ein і ступені порівняння, Präteritum у життєписі, порядок слів (wenn / als / weil / denn, man + Modalverb, Sie-Form), als / wenn / wann, читання допису про патчворк-родину, лист-відповідь і бонус «Familienrätsel».",
    file: "klas-9/modul-a/lektion-18.html",
    nove: true,
    gram: ["verben-praepositionalobjekt", "personalpronomen", "adjektivdeklination", "komparation", "tempusformen", "starke-verben", "temporalsaetze", "konditionalsaetze", "kausalsaetze", "konjunktionen-position-null"],
    dz: "Mein Fehler-Detektiv-Heft: 1) Schreib nach der Kontrollarbeit aus dem Gedächtnis drei Aufgaben auf, bei denen du unsicher warst (z. B. Adjektivendungen nach „ein“, als / wenn / wann, Präteritum, Verben mit Präpositionen). Schlag zu jeder Aufgabe die Regel nach (Heft, Lehrbuch oder Grammatik-Seite) und schreib sie in einem Satz auf. 2) Schreib zu jeder Regel zwei eigene, richtige Beispielsätze über deine Familie oder deine Freunde. 3) Mach ein Wortnetz „Modul A: Ich, meine Familie, meine Freunde“ mit mindestens 15 Wörtern aus fünf Bereichen: Familie, Beziehungen, Charakter, Freizeit, Lebenslauf – Nomen immer mit Artikel. Nächstes Mal besprechen wir die typischen Fehler der Kontrollarbeit."
  }
];
