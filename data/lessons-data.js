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
  }
];
