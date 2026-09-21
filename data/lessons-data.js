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
  }
];
