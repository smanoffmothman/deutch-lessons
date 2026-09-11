// data/glossary-data.js
// -------------------------------------------------------------
// Один спільний список слів на всі класи. Кожне слово має теги
// klas/modul, тому глосарій уроку/модуля/класу — це просто фільтр
// над цим самим масивом, а не окремий файл.
//
// Після кожного уроку Claude пропонує список слів-кандидатів —
// підтверджуєш або правиш переклад/теги, і рядки дописуються сюди.
//
// Поля: de (німецькою), uk (переклад), klas, modul, lektion
// -------------------------------------------------------------

const GLOSSARY = [
  {de: "das Nachbarland (die Nachbarstaaten)", uk: "сусідня країна", klas: "7", modul: "A", lektion: 1},
  {de: "die Hauptstadt", uk: "столиця", klas: "7", modul: "A", lektion: 1},
  {de: "das Bundesland", uk: "федеральна земля", klas: "7", modul: "A", lektion: 1},
  {de: "der Fluss", uk: "річка", klas: "7", modul: "A", lektion: 1},
  {de: "der Berg", uk: "гора", klas: "7", modul: "A", lektion: 1},
  {de: "die Flagge", uk: "прапор", klas: "7", modul: "A", lektion: 1},
  {de: "feiern", uk: "святкувати", klas: "7", modul: "A", lektion: 1},
  {de: "das Fest", uk: "свято", klas: "7", modul: "A", lektion: 1},
  {de: "die Amtssprache", uk: "офіційна мова", klas: "7", modul: "A", lektion: 1},
  {de: "ursprünglich", uk: "спочатку / родом (звідки)", klas: "7", modul: "A", lektion: 1},
  {de: "berühmt", uk: "відомий, знаменитий", klas: "7", modul: "A", lektion: 1},
  {de: "gleichzeitig", uk: "одночасно", klas: "7", modul: "A", lektion: 1}
];
