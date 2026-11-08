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

(window.SLOVA = window.SLOVA || {})["sotnykova-8-klas-8-rik"] = [
  // ---- Lektion 1 · Modul A: Sommererholung ----
  {de: "die Erholung", uk: "відпочинок", r: "l1-a", note: "Ich wünsche dir gute Erholung!"},
  {de: "sich erholen", uk: "відпочивати, відновлювати сили", r: "l1-a", note: "Im Sommer habe ich mich am See gut erholt."},
  {de: "der Ausflug, -ü-e", uk: "екскурсія, поїздка", r: "l1-a", note: "einen Ausflug machen / unternehmen"},
  {de: "der Tagesausflug, -ü-e", uk: "одноденна поїздка", r: "l1-a"},
  {de: "die Wanderung, -en", uk: "піший похід", r: "l1-a", note: "eine Wanderung machen"},
  {de: "die Radtour, -en", uk: "велоподорож, велопрогулянка", r: "l1-a"},
  {de: "der Radweg, -e", uk: "велодоріжка, веломаршрут", r: "l1-a"},
  {de: "die Unterkunft, -ü-e", uk: "житло, місце ночівлі", r: "l1-a"},
  {de: "die Pension, -en", uk: "пансіон, невеликий готель", r: "l1-a", note: "хибний друг: не «пенсія» (пенсія — die Rente)"},
  {de: "übernachten", uk: "ночувати", r: "l1-a", note: "Wir haben im Zelt übernachtet."},
  {de: "das Gepäck", uk: "багаж", r: "l1-a", note: "лише однина: das ganze Gepäck"},
  {de: "der Rucksack, -ä-e", uk: "рюкзак", r: "l1-a"},
  {de: "die Fähre, -n", uk: "пором", r: "l1-a", note: "mit der Fähre auf die Insel fahren"},
  {de: "das Gewitter, -", uk: "гроза", r: "l1-a"},
  {de: "die Hitze", uk: "спека", r: "l1-a"},
  {de: "der Gegenwind", uk: "зустрічний вітер", r: "l1-a"},
  {de: "der Muskelkater", uk: "біль у м'язах (після навантаження)", r: "l1-a", note: "Ich habe Muskelkater. (без артикля)"},
  {de: "die Strecke, -n", uk: "відстань, маршрут", r: "l1-a"},
  {de: "das Ziel, -e", uk: "мета, кінцевий пункт", r: "l1-a"},
  {de: "die Burg, -en", uk: "фортеця, замок", r: "l1-a"},
  {de: "genießen, hat genossen", uk: "насолоджуватися", r: "l1-a", note: "Wir haben die Aussicht genossen. (+ Akk., без прийменника)"},
  {de: "unternehmen (unternimmt), hat unternommen", uk: "здійснювати, влаштовувати (поїздку)", r: "l1-a"},
  {de: "das Erlebnis, -se", uk: "пригода, враження", r: "l1-a"},
  {de: "unvergesslich", uk: "незабутній", r: "l1-a"},
  {de: "während (+ Gen.)", uk: "під час", r: "l1-a", note: "während der Ferien"},
  {de: "wegen (+ Gen.)", uk: "через (причина)", r: "l1-a", note: "wegen des Regens"},
  {de: "trotz (+ Gen.)", uk: "незважаючи на", r: "l1-a", note: "trotz des Windes"},
  {de: "innerhalb (+ Gen.)", uk: "протягом, у межах (часу)", r: "l1-a"},
  {de: "außerhalb (+ Gen.)", uk: "за межами, поза", r: "l1-a"},
  {de: "unweit (+ Gen.)", uk: "неподалік від", r: "l1-a"}
];
