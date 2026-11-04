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
  {de: "seit (+ Dat.)", uk: "з (якогось часу), уже", r: "l1-a", note: "з теперішнім часом: Ich wohne seit drei Jahren hier. — Я живу тут уже три роки."}
];
