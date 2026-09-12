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
  {de: "der Steckbrief", uk: "коротка розповідь про себе (анкета)", klas: "7", modul: "A", lektion: 1},
  {de: "der Sommer", uk: "літо", klas: "7", modul: "A", lektion: 2},
  {de: "das Ziel", uk: "мета, ціль", klas: "7", modul: "A", lektion: 2},
  {de: "das Schuljahr", uk: "навчальний рік", klas: "7", modul: "A", lektion: 2},
  {de: "packen", uk: "пакувати (валізу)", klas: "7", modul: "A", lektion: 2},
  {de: "der Koffer", uk: "валіза", klas: "7", modul: "A", lektion: 2},
  {de: "die Sonnencreme", uk: "сонцезахисний крем", klas: "7", modul: "A", lektion: 2},
  {de: "der Badeanzug", uk: "купальник", klas: "7", modul: "A", lektion: 2},
  {de: "glücklich", uk: "щасливий", klas: "7", modul: "A", lektion: 2},
  {de: "wollen", uk: "хотіти (модальне дієслово)", klas: "7", modul: "A", lektion: 2},
  {de: "erreichen", uk: "досягати (мети)", klas: "7", modul: "A", lektion: 2},
  {de: "die Ferien", uk: "канікули", klas: "7", modul: "A", lektion: 2},
  {de: "die Postkarte", uk: "листівка", klas: "7", modul: "A", lektion: 2},
  {de: "sich freuen auf (+Akk.)", uk: "радіти (чомусь наперед), чекати на щось із задоволенням", klas: "7", modul: "A", lektion: 2},
  {de: "das Lieblingsfach", uk: "улюблений шкільний предмет", klas: "7", modul: "A", lektion: 3},
  {de: "die Sportkleidung", uk: "спортивний одяг", klas: "7", modul: "A", lektion: 3},
  {de: "das Möbelgeschäft", uk: "меблевий магазин", klas: "7", modul: "A", lektion: 3},
  {de: "das Reiseziel", uk: "мета подорожі, пункт призначення", klas: "7", modul: "A", lektion: 3},
  {de: "treffen", uk: "зустрічати(ся)", klas: "7", modul: "A", lektion: 3},
  {de: "wählen", uk: "обирати, вибирати", klas: "7", modul: "A", lektion: 3},
  {de: "der Reiterhof", uk: "кінна ферма, кінноспортивна база", klas: "7", modul: "A", lektion: 3},
  {de: "das Pony (Islandpony)", uk: "поні (ісландський поні)", klas: "7", modul: "A", lektion: 3},
  {de: "die Übernachtung", uk: "ночівля", klas: "7", modul: "A", lektion: 3},
  {de: "die Geschwister (Pl.)", uk: "брати і сестри", klas: "7", modul: "A", lektion: 3},
  {de: "sich streiten", uk: "сваритися", klas: "7", modul: "A", lektion: 3},
  {de: "gestern", uk: "вчора", klas: "7", modul: "A", lektion: 3},
  {de: "der Fehler", uk: "помилка", klas: "7", modul: "A", lektion: 4},
  {de: "korrigieren", uk: "виправляти", klas: "7", modul: "A", lektion: 4},
  {de: "die Übung", uk: "вправа", klas: "7", modul: "A", lektion: 4},
  {de: "der Sportverein", uk: "спортивний клуб, спортивне товариство", klas: "7", modul: "A", lektion: 4},
  {de: "regnen", uk: "йти (про дощ)", klas: "7", modul: "A", lektion: 4},
  {de: "fliegen", uk: "летіти", klas: "7", modul: "A", lektion: 4},
  {de: "das Wetter", uk: "погода", klas: "7", modul: "A", lektion: 4},
  {de: "der Anfänger", uk: "початківець", klas: "7", modul: "A", lektion: 4},
  {de: "die Bergtour", uk: "гірський похід, гірська прогулянка", klas: "7", modul: "A", lektion: 4},
  {de: "das Matratzenlager", uk: "нічліг на матрацах (спальня зі спальними матрацами)", klas: "7", modul: "A", lektion: 4},
  {de: "die Tante", uk: "тітка", klas: "7", modul: "A", lektion: 4},
  {de: "zusammengesetzte Wörter", uk: "складні слова (граматичний термін)", klas: "7", modul: "A", lektion: 4}
];
