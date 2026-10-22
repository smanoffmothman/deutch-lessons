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

(window.SLOVA = window.SLOVA || {})["sotnykova-5-klas-5-rik"] = [
  // ---- Lektion 1 · Modul A: Meine Familie ----
  {de: "die Familie, -n", uk: "сім'я, родина", r: "l1-a"},
  {de: "die Mutter, -ü", uk: "мати, мама", r: "l1-a"},
  {de: "der Vater, -ä", uk: "батько, тато", r: "l1-a"},
  {de: "die Eltern (Pl.)", uk: "батьки", r: "l1-a", note: "лише множина: Meine Eltern sind Lehrer."},
  {de: "die Großeltern (Pl.)", uk: "дідусь і бабуся", r: "l1-a"},
  {de: "die Oma, -s", uk: "бабуся", r: "l1-a"},
  {de: "der Opa, -s", uk: "дідусь", r: "l1-a"},
  {de: "die Geschwister (Pl.)", uk: "брати й сестри", r: "l1-a", note: "Hast du Geschwister? — У тебе є брати чи сестри?"},
  {de: "der Bruder, -ü", uk: "брат", r: "l1-a"},
  {de: "die Schwester, -n", uk: "сестра", r: "l1-a"},
  {de: "das Einzelkind, -er", uk: "єдина дитина в сім'ї", r: "l1-a", note: "Ich bin ein Einzelkind."},
  {de: "der Zwilling, -e", uk: "близнюк", r: "l1-a", note: "Mark und Felix sind Zwillinge."},
  {de: "der Sohn, -ö-e", uk: "син", r: "l1-a"},
  {de: "die Tochter, -ö", uk: "дочка, донька", r: "l1-a"},
  {de: "der Onkel, -", uk: "дядько", r: "l1-a"},
  {de: "die Tante, -n", uk: "тітка", r: "l1-a"},
  {de: "der Cousin, -s", uk: "двоюрідний брат", r: "l1-a"},
  {de: "die Cousine, -n", uk: "двоюрідна сестра", r: "l1-a"},
  {de: "der Verwandte / die Verwandte, -n", uk: "родич / родичка", r: "l1-a"},
  {de: "verheiratet", uk: "одружений, заміжня", r: "l1-a"},
  {de: "ledig", uk: "неодружений, незаміжня", r: "l1-a"},
  {de: "der Rentner, - / die Rentnerin, -nen", uk: "пенсіонер / пенсіонерка", r: "l1-a"},
  {de: "älter", uk: "старший", r: "l1-a", note: "Mein Bruder ist älter als ich."},
  {de: "jünger", uk: "молодший", r: "l1-a", note: "Meine Mutter ist zwei Jahre jünger als mein Vater."},
  {de: "das Haustier, -e", uk: "свійська тварина, домашній улюбленець", r: "l1-a"},
  {de: "der Kater, -", uk: "кіт", r: "l1-a", note: "die Katze — кішка, кицька"},
  {de: "das Kaninchen, -", uk: "кролик", r: "l1-a"},
  {de: "das Meerschweinchen, -", uk: "морська свинка", r: "l1-a"},
  {de: "der Wellensittich, -e", uk: "хвилястий папуга", r: "l1-a"},
  {de: "sich kümmern um (+ Akk.)", uk: "піклуватися про когось, доглядати", r: "l1-a", note: "Opa kümmert sich um den Garten."},
  {de: "unter einem Dach leben", uk: "жити під одним дахом", r: "l1-a"},
  // ---- Lektion 1 · Modul B: Berufe ----
  {de: "der Beruf, -e", uk: "професія", r: "l1-b"},
  {de: "der Traumberuf, -e", uk: "професія мрії", r: "l1-b"},
  {de: "von Beruf sein", uk: "бути за професією", r: "l1-b", note: "Sie ist Ärztin von Beruf."},
  {de: "arbeiten als", uk: "працювати ким-небудь", r: "l1-b", note: "Er arbeitet als Koch."},
  {de: "der Arzt, -ä-e / die Ärztin, -nen", uk: "лікар / лікарка", r: "l1-b"},
  {de: "der Tierarzt, -ä-e / die Tierärztin, -nen", uk: "ветеринар / ветеринарка", r: "l1-b"},
  {de: "die Krankenschwester, -n", uk: "медсестра", r: "l1-b"},
  {de: "der Apotheker, - / die Apothekerin, -nen", uk: "фармацевт / фармацевтка", r: "l1-b"},
  {de: "der Koch, -ö-e / die Köchin, -nen", uk: "кухар / кухарка", r: "l1-b"},
  {de: "der Bäcker, - / die Bäckerin, -nen", uk: "пекар / пекарка", r: "l1-b"},
  {de: "der Friseur, -e / die Friseurin, -nen", uk: "перукар / перукарка", r: "l1-b"},
  {de: "der Programmierer, - / die Programmiererin, -nen", uk: "програміст / програмістка", r: "l1-b"},
  {de: "der Tischler, - / die Tischlerin, -nen", uk: "столяр / столярка", r: "l1-b"},
  {de: "der Landwirt, -e / die Landwirtin, -nen", uk: "фермер / фермерка", r: "l1-b"},
  {de: "der Schauspieler, - / die Schauspielerin, -nen", uk: "актор / акторка", r: "l1-b"},
  {de: "der Mechaniker, - / die Mechanikerin, -nen", uk: "механік / механікиня", r: "l1-b"},
  {de: "der Polizist, -en / die Polizistin, -nen", uk: "поліцейський / поліцейська", r: "l1-b"},
  {de: "die Apotheke, -n", uk: "аптека", r: "l1-b"},
  {de: "das Krankenhaus, -ä-er", uk: "лікарня", r: "l1-b"},
  {de: "die Werkstatt, -ä-en", uk: "майстерня", r: "l1-b"},
  {de: "die Bäckerei, -en", uk: "пекарня", r: "l1-b"},
  {de: "der Bauernhof, -ö-e", uk: "ферма, селянське господарство", r: "l1-b"},
  {de: "behandeln", uk: "лікувати", r: "l1-b"},
  {de: "reparieren", uk: "ремонтувати, лагодити", r: "l1-b"},
  {de: "werden (wird)", uk: "ставати", r: "l1-b", note: "Ich möchte Ärztin werden. — Я хочу стати лікаркою."}
];
