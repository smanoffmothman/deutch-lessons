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
  {de: "die Hauptstadt", uk: "столиця", klas: "7", modul: "A", lektion: 1},
  {de: "der Berg (die Zugspitze)", uk: "гора (Цугшпітце — найвища в Німеччині)", klas: "7", modul: "A", lektion: 1},
  {de: "der Fluss (der Rhein)", uk: "річка (Рейн — найдовша в Німеччині)", klas: "7", modul: "A", lektion: 1},
  {de: "der Nachbarstaat", uk: "сусідня держава", klas: "7", modul: "A", lektion: 1},
  {de: "der Karneval", uk: "карнавал", klas: "7", modul: "A", lektion: 1},
  {de: "das Oktoberfest", uk: "Октоберфест (пивний фестиваль у Мюнхені)", klas: "7", modul: "A", lektion: 1},
  {de: "die Amtssprache", uk: "офіційна (державна) мова", klas: "7", modul: "A", lektion: 1},
  {de: "liegen", uk: "розташовуватися, лежати", klas: "7", modul: "A", lektion: 1},
  {de: "der Steckbrief", uk: "коротка розповідь про себе (анкета)", klas: "7", modul: "A", lektion: 1}
];
