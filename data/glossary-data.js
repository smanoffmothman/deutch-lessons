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
  {de: "verbringen", uk: "проводити (час)", klas: "7", modul: "A", lektion: 1},
  {de: "die Ferien (Pl.)", uk: "канікули", klas: "7", modul: "A", lektion: 1},
  {de: "das Ausland", uk: "закордон", klas: "7", modul: "A", lektion: 1},
  {de: "der Großeltern (Pl.)", uk: "бабуся й дідусь", klas: "7", modul: "A", lektion: 1},

  {de: "das Nachbarland (die Nachbarländer)", uk: "сусідня країна", klas: "7", modul: "A", lektion: 1},
  {de: "der Berg", uk: "гора", klas: "7", modul: "A", lektion: 1},
  {de: "der Fluss", uk: "річка", klas: "7", modul: "A", lektion: 1},
  {de: "die Hauptstadt", uk: "столиця", klas: "7", modul: "A", lektion: 1},
  {de: "das Bundesland (die Bundesländer)", uk: "федеральна земля", klas: "7", modul: "A", lektion: 1},
  {de: "die Speise", uk: "страва, їжа", klas: "7", modul: "A", lektion: 1},
  {de: "das Fest", uk: "свято", klas: "7", modul: "A", lektion: 1},
  {de: "berühmt", uk: "відомий, знаменитий", klas: "7", modul: "A", lektion: 1},
  {de: "die Amtssprache", uk: "державна (офіційна) мова", klas: "7", modul: "A", lektion: 1},
  {de: "feiern", uk: "святкувати", klas: "7", modul: "A", lektion: 1}
];
