/* =================================================================
   Слова з перекладом до підручника — ОДИН ФАЙЛ НА КНИЖКУ:
   data/slova/<id книжки>.js (id — як у pidruchnyky-data.js).
   Окремо від glossary-data.js: глосарій сайту — лише для «Моїх класів».

   Рядок слова:
     {de: "die Mutter, -ü", uk: "мати, мама", r: "l1-a"}
     de   — словникова форма: іменник з артиклем і множиною, дієслово в
            інфінітиві (за потреби з формами: "fahren (fährt), fuhr, ist gefahren");
     uk   — переклад українською (власний, не зі словника підручника);
     r    — id розділу з pidruchnyky-data.js, до якого слово належить;
     note — (необов'язково) коротка примітка: «розм.», «тут: …».
   Слово повторюється в іншому розділі — окремий рядок з іншим r.
   Сторінка повторення (typ "povtorennya") сама збирає слова всіх
   сусідніх розділів того самого Lektion — дублювати їх не треба.

   Нові слова — у кінець масиву. Перед правкою — свіжа копія з GitHub.
   ================================================================= */

(window.SLOVA = window.SLOVA || {})["sotnykova-7-klas-7-rik"] = [
  // ---- Lektion 1 · Modul A: Familienferien ----
  {de: "die Familienferien (Pl.)", uk: "сімейні канікули, відпустка всією родиною", r: "l1-a"},
  {de: "verbringen, hat verbracht", uk: "проводити (час)", r: "l1-a", note: "Wir haben die Ferien am Meer verbracht."},
  {de: "das Meer, -e", uk: "море", r: "l1-a", note: "am Meer (Wo?) — ans Meer (Wohin?)"},
  {de: "der See, -n", uk: "озеро", r: "l1-a", note: "увага: die See — море (= das Meer): an der See"},
  {de: "das Ufer, -", uk: "берег (річки, озера)", r: "l1-a"},
  {de: "der Strand, -ä-e", uk: "пляж", r: "l1-a"},
  {de: "die Insel, -n", uk: "острів", r: "l1-a", note: "auf der Insel (Wo?) — auf die Insel (Wohin?)"},
  {de: "das Gebirge, -", uk: "гори, гірський масив", r: "l1-a", note: "im Gebirge = in den Bergen"},
  {de: "der Wald, -ä-er", uk: "ліс", r: "l1-a"},
  {de: "die Wüste, -n", uk: "пустеля", r: "l1-a"},
  {de: "auf dem Land / aufs Land", uk: "на селі / на село (за місто)", r: "l1-a"},
  {de: "das Ausland", uk: "закордон", r: "l1-a", note: "im Ausland (Wo?) — ins Ausland (Wohin?)"},
  {de: "das Ferienlager, -", uk: "табір відпочинку", r: "l1-a"},
  {de: "der Campingplatz, -ä-e", uk: "кемпінг", r: "l1-a"},
  {de: "das Zelt, -e", uk: "намет", r: "l1-a"},
  {de: "das Hausboot, -e", uk: "плавучий будинок (човен для житла)", r: "l1-a"},
  {de: "der Hafen, -ä", uk: "порт, гавань", r: "l1-a"},
  {de: "die Landschaft, -en", uk: "краєвид, ландшафт", r: "l1-a"},
  {de: "malerisch", uk: "мальовничий", r: "l1-a"},
  {de: "segeln", uk: "ходити під вітрилом", r: "l1-a"},
  {de: "springen (springt), ist gesprungen", uk: "стрибати", r: "l1-a"},
  {de: "erleben", uk: "переживати, бачити на власні очі", r: "l1-a", note: "In den Ferien haben wir viel erlebt."},
  {de: "erkunden", uk: "досліджувати, оглядати", r: "l1-a"},
  {de: "sich entspannen", uk: "відпочивати, розслаблятися", r: "l1-a", note: "Am See kann ich mich gut entspannen."},
  {de: "träumen von (+ Dat.)", uk: "мріяти про", r: "l1-a", note: "Ich träume von einer Reise ins Ausland."},
  {de: "das Heimweh", uk: "туга за домом", r: "l1-a", note: "Im Ferienlager hatte ich am ersten Abend Heimweh."},
  {de: "todlangweilig", uk: "страшенно нудний", r: "l1-a", note: "розм."},
  {de: "seit (+ Dat.)", uk: "з (якогось часу), уже", r: "l1-a", note: "з теперішнім часом: Ich wohne seit drei Jahren hier. — Я живу тут уже три роки."},
  // ---- Lektion 1 · Modul B: Ich mache im Haushalt mit ----
  {de: "der Haushalt, -e", uk: "домашнє господарство", r: "l1-b", note: "im Haushalt helfen — допомагати по господарству"},
  {de: "mitmachen", uk: "брати участь, долучатися", r: "l1-b", note: "Bei uns macht jeder im Haushalt mit."},
  {de: "aufräumen", uk: "прибирати", r: "l1-b", note: "Ich räume mein Zimmer jeden Samstag auf."},
  {de: "wegräumen", uk: "прибирати (на місце)", r: "l1-b"},
  {de: "einkaufen", uk: "купувати, робити покупки", r: "l1-b", note: "einkaufen gehen — ходити по покупки"},
  {de: "wegbringen, hat weggebracht", uk: "відносити, виносити", r: "l1-b", note: "Bring bitte den Müll weg!"},
  {de: "abholen", uk: "забирати (когось, щось)", r: "l1-b"},
  {de: "der Müll", uk: "сміття", r: "l1-b"},
  {de: "das Geschirr", uk: "посуд", r: "l1-b", note: "лише однина: Das Geschirr ist sauber."},
  {de: "spülen", uk: "мити (посуд)", r: "l1-b"},
  {de: "die Spülmaschine, -n", uk: "посудомийна машина", r: "l1-b"},
  {de: "die Wäsche", uk: "білизна; прання", r: "l1-b", note: "die Wäsche waschen — прати"},
  {de: "bügeln", uk: "прасувати", r: "l1-b"},
  {de: "Staub saugen", uk: "пилососити", r: "l1-b", note: "Ich sauge Staub. — Я пилосошу."},
  {de: "putzen", uk: "чистити, мити", r: "l1-b", note: "die Fenster putzen, die Zähne putzen"},
  {de: "fegen", uk: "підмітати", r: "l1-b"},
  {de: "der Fußboden, -ö", uk: "підлога", r: "l1-b"},
  {de: "gießen, hat gegossen", uk: "поливати", r: "l1-b"},
  {de: "den Tisch decken", uk: "накривати на стіл", r: "l1-b"},
  {de: "das Bett machen", uk: "застеляти ліжко", r: "l1-b"},
  {de: "mit dem Hund Gassi gehen", uk: "вигулювати собаку", r: "l1-b", note: "розм."},
  {de: "die Dienstreise, -n", uk: "відрядження", r: "l1-b"},
  {de: "schaffen", uk: "упоратися, встигнути", r: "l1-b", note: "Wir schaffen das!"},
  {de: "klappen", uk: "вдаватися, виходити", r: "l1-b", note: "розм.: Alles hat gut geklappt."},
  {de: "regelmäßig", uk: "регулярно", r: "l1-b"},
  {de: "einmal in der Woche", uk: "раз на тиждень", r: "l1-b", note: "так само: zweimal am Tag, einmal im Monat"},
  {de: "selten", uk: "рідко", r: "l1-b"},
  {de: "hassen", uk: "ненавидіти", r: "l1-b"},
  {de: "sauber", uk: "чистий", r: "l1-b"},
  {de: "schmutzig", uk: "брудний", r: "l1-b"},
  // ---- Lektion 1 · Modul C: Familientraditionen ----
  {de: "die Tradition, -en", uk: "традиція", r: "l1-c", note: "eine feste Tradition — постійна традиція"},
  {de: "das Familienfest, -e", uk: "родинне свято", r: "l1-c"},
  {de: "im Familienkreis", uk: "у колі родини", r: "l1-c", note: "Wir feiern Weihnachten im Familienkreis."},
  {de: "gemeinsam", uk: "спільний; разом", r: "l1-c"},
  {de: "sich versammeln", uk: "збиратися (разом)", r: "l1-c"},
  {de: "fest", uk: "постійний, твердий", r: "l1-c", note: "ein fester Termin — постійний, незмінний час"},
  {de: "anrufen, hat angerufen", uk: "дзвонити (комусь)", r: "l1-c", note: "+ Akk.: Ich rufe Oma an."},
  {de: "das Picknick, -s", uk: "пікнік", r: "l1-c"},
  {de: "grillen", uk: "смажити на грилі", r: "l1-c"},
  {de: "der Spieleabend, -e", uk: "вечір настільних ігор", r: "l1-c"},
  {de: "die Gute-Nacht-Geschichte, -n", uk: "казка на ніч", r: "l1-c"},
  {de: "vorlesen (liest vor), hat vorgelesen", uk: "читати вголос", r: "l1-c"},
  {de: "basteln", uk: "майструвати", r: "l1-c"},
  {de: "schmücken", uk: "прикрашати", r: "l1-c"},
  {de: "der Hochzeitstag, -e", uk: "річниця весілля", r: "l1-c"},
  {de: "die Überraschung, -en", uk: "сюрприз, несподіванка", r: "l1-c"},
  {de: "das Rezept, -e", uk: "рецепт", r: "l1-c"},
  {de: "erfinden, hat erfunden", uk: "вигадувати, винаходити", r: "l1-c"},
  {de: "begleiten", uk: "супроводжувати", r: "l1-c"},
  {de: "die Neuigkeit, -en", uk: "новина", r: "l1-c"},
  {de: "die Herbstferien (Pl.)", uk: "осінні канікули", r: "l1-c"},
  {de: "stattdessen", uk: "натомість, замість цього", r: "l1-c"},
  {de: "Ostern", uk: "Великдень", r: "l1-c", note: "без артикля: Wir feiern Ostern. — an / zu Ostern"},
  {de: "Weihnachten", uk: "Різдво", r: "l1-c", note: "без артикля: zu / an Weihnachten"},
  {de: "die Kerze, -n", uk: "свічка", r: "l1-c"},
  {de: "werden (wird) + Infinitiv", uk: "майбутній час (Futur I): буду …, будемо …", r: "l1-c", note: "Oma wird uns besuchen. — Бабуся відвідає нас."}
];
