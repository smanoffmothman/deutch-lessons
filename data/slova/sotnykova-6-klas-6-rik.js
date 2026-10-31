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

(window.SLOVA = window.SLOVA || {})["sotnykova-6-klas-6-rik"] = [
  // ---- Lektion 1 · Modul A: Meine Verwandten ----
  {de: "der Verwandte / die Verwandte, -n", uk: "родич / родичка", r: "l1-a", note: "відмінюється як прикметник: ein Verwandter, eine Verwandte, die Verwandten"},
  {de: "das Familientreffen, -", uk: "зустріч рідні, родинна зустріч", r: "l1-a"},
  {de: "die Großeltern (Pl.)", uk: "дідусь і бабуся", r: "l1-a"},
  {de: "die Urgroßeltern (Pl.)", uk: "прадідусь і прабабуся", r: "l1-a"},
  {de: "der Uropa, -s", uk: "прадідусь", r: "l1-a", note: "розм.; офіційно — der Urgroßvater"},
  {de: "die Uroma, -s", uk: "прабабуся", r: "l1-a", note: "розм.; офіційно — die Urgroßmutter"},
  {de: "der Enkel, -", uk: "онук", r: "l1-a"},
  {de: "die Enkelin, -nen", uk: "онучка", r: "l1-a"},
  {de: "das Enkelkind, -er", uk: "онук або онучка", r: "l1-a", note: "Oma und Opa haben fünf Enkelkinder."},
  {de: "der Neffe, -n", uk: "племінник", r: "l1-a", note: "слабкий іменник: des Neffen, dem Neffen, den Neffen"},
  {de: "die Nichte, -n", uk: "племінниця", r: "l1-a"},
  {de: "der Onkel, -", uk: "дядько", r: "l1-a"},
  {de: "die Tante, -n", uk: "тітка", r: "l1-a"},
  {de: "der Cousin, -s", uk: "двоюрідний брат", r: "l1-a"},
  {de: "die Cousine, -n", uk: "двоюрідна сестра", r: "l1-a"},
  {de: "das Baby, -s", uk: "немовля", r: "l1-a"},
  {de: "der Junge, -n", uk: "хлопець, хлопчик", r: "l1-a", note: "слабкий іменник: das Zimmer des Jungen"},
  {de: "der Nachbar, -n", uk: "сусід", r: "l1-a", note: "слабкий іменник: das Auto des Nachbarn"},
  {de: "der Stammbaum, -ä-e", uk: "родовід, родинне дерево", r: "l1-a"},
  {de: "das Fotoalbum, -alben", uk: "фотоальбом", r: "l1-a"},
  {de: "die Hochzeit, -en", uk: "весілля", r: "l1-a"},
  {de: "heiraten", uk: "одружуватися, виходити заміж", r: "l1-a", note: "Sie haben 1979 geheiratet. (рік — без in)"},
  {de: "geboren sein", uk: "народитися", r: "l1-a", note: "Ich bin am 3. Mai 2014 geboren."},
  {de: "das Geburtsdatum, -daten", uk: "дата народження", r: "l1-a"},
  {de: "aufwachsen (wächst auf), ist aufgewachsen", uk: "виростати", r: "l1-a", note: "Opa ist auf dem Land aufgewachsen."},
  {de: "erfahren (erfährt), hat erfahren", uk: "дізнаватися", r: "l1-a", note: "Ich habe viel Neues über meine Familie erfahren."},
  {de: "erkennen, hat erkannt", uk: "упізнавати", r: "l1-a", note: "Ich habe meinen Cousin nicht erkannt. — Я не впізнав(ла) свого двоюрідного брата."},
  {de: "ähnlich sein (+ Dat.)", uk: "бути схожим (на когось)", r: "l1-a", note: "Ich bin meiner Oma ähnlich. — Dativ, без прийменника"},
  {de: "die Generation, -en", uk: "покоління", r: "l1-a"},
  {de: "die Überraschung, -en", uk: "сюрприз, несподіванка", r: "l1-a"},
];
