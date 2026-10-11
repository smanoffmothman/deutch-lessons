// data/materials-data.js
// -------------------------------------------------------------
// Розділ «Матеріали»: статті для читання (адаптовані тексти з
// німецькомовних журналів) і, за потреби, просто файли/посилання.
// Сторінка materialy/ — картки з фільтрами за рівнем, країною й темою;
// найновіші зверху. Правила наповнення — MATERIAL-BRIEF.md.
//
// НОВІ ЗАПИСИ — ЗАВЖДИ В КІНЕЦЬ МАСИВУ. Останній запис = мітка «нове»
// (як в уроках). Порядок на сторінці — від нових до старих.
// Джерело правди — версія на GitHub: перед додаванням бери свіжу копію.
//
// Поля статті (typ: "stattya"):
//   id       — латиницею через дефіс, = назва файлу materialy/statti/<id>.html.
//              НЕ перейменовується після публікації (адреса сторінки,
//              збережений прогрес учнів).
//   typ      — "stattya"
//   nazva    — заголовок статті німецькою (як h1 на сторінці)
//   opys     — 1–2 речення українською: про що стаття (≈ до 150 символів —
//              на картці видно 3 рядки)
//   riven    — рівень тексту: "A2" | "B1" | "B2" | "C1" | "C2"
//   krayina  — про яку країну: ["DE"] | ["AT"] | ["CH"] | ["LI"] | ["LU"] |
//              ["EU"] — можна кілька: ["DE", "AT"]
//   temy     — 1–3 теми зі списку MATERIAL_TEMY нижче (фільтр і «Почитай ще»)
//   dzherelo — звідки взято факти: { nazva: "Deutsch perfekt", nomer: "11/2026",
//              storinky: "24–25", url: "" }  — storinky: сторінки в номері (видно,
//              що з номера вже зроблено); url необов'язковий (якщо оригінал є онлайн)
//   dodano   — "2026-10" (рік-місяць публікації)
//   file     — "statti/<id>.html" (шлях від папки materialy/)
//
// Інший матеріал (роздруківка, таблиця, посилання) — typ: "fail",
// поля: nazva, opys, file (шлях або https-посилання), dodano.
// -------------------------------------------------------------

// Теми для фільтра. Можна додавати нові — рядок у кінець.
const MATERIAL_TEMY = [
  "Alltag", "Essen & Trinken", "Feste & Traditionen", "Geschichte", "Gesellschaft",
  "Sprache", "Reisen & Städte", "Natur & Umwelt", "Kultur & Medien", "Arbeit & Schule",
  "Sport & Freizeit", "Wissenschaft & Technik"
];

const MATERIALS = [
  // { id: "sonntags-geschlossen", typ: "stattya", nazva: "Sonntags geschlossen",
  //   opys: "Чому в Німеччині в неділю зачинені магазини — і де все-таки можна щось купити.",
  //   riven: "B1", krayina: ["DE"], temy: ["Alltag", "Gesellschaft"],
  //   dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "24–25" },
  //   dodano: "2026-10", file: "statti/sonntags-geschlossen.html" },
  { id: "klischees-im-check", typ: "stattya", nazva: "Typisch deutsch? Vier Klischees im Check",
    opys: "Сміття, правила, хліб і шкарпетки в сандалях: репортерка перевіряє, які кліше про німців правдиві, а які — лише наполовину.",
    riven: "B1", krayina: ["DE"], temy: ["Gesellschaft", "Alltag", "Essen & Trinken"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "14–21" },
    dodano: "2026-10", file: "statti/klischees-im-check.html" },
  { id: "radfahren-lernen-als-erwachsene", typ: "stattya", nazva: "Nie zu spät fürs Fahrrad",
    opys: "У Мюнхені дорослі жінки з різних країн уперше сідають на велосипед — і дізнаються, чому це так важливо в Німеччині.",
    riven: "A2", krayina: ["DE"], temy: ["Sport & Freizeit", "Alltag"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "36–39" },
    dodano: "2026-10", file: "statti/radfahren-lernen-als-erwachsene.html" },
  { id: "ach-so-heisst-das", typ: "stattya", nazva: "Das Ding da – wie heißt das eigentlich?",
    opys: "Pfandschloss, Laffe, Stegplättchen: як по-німецьки називаються дрібні речі, назв яких не знають навіть самі німці.",
    riven: "B2", krayina: ["DE"], temy: ["Sprache", "Alltag"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "50–52" },
    dodano: "2026-10", file: "statti/ach-so-heisst-das.html" },
  { id: "oktoberfest-hinter-den-kulissen", typ: "stattya", nazva: "Oktoberfest: Ein Blick hinter die Kulissen",
    opys: "Як королівське весілля 1810 року перетворилося на найбільше свято світу — і хто працює на Октоберфесті, поки інші святкують.",
    riven: "B1", krayina: ["DE"], temy: ["Feste & Traditionen", "Geschichte", "Reisen & Städte"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "26–33" },
    dodano: "2026-10", file: "statti/oktoberfest-hinter-den-kulissen.html" },
  { id: "leitungswasser-im-restaurant", typ: "stattya", nazva: "Warum kostet Wasser im Restaurant Geld?",
    opys: "Колишня офіціантка пояснює, чому в німецьких ресторанах доводиться платити навіть за воду з-під крана.",
    riven: "A2", krayina: ["DE", "EU"], temy: ["Essen & Trinken", "Alltag"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "12" },
    dodano: "2026-10", file: "statti/leitungswasser-im-restaurant.html" },
  { id: "kinderfreie-hotels", typ: "stattya", nazva: "Urlaub ohne Kinder – Trend oder Ausgrenzung?",
    opys: "Готелі тільки для дорослих: директор швейцарського готелю і захисниця прав дітей сперечаються, чи це нормально.",
    riven: "B2", krayina: ["DE", "CH"], temy: ["Gesellschaft", "Reisen & Städte"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "40–41" },
    dodano: "2026-10", file: "statti/kinderfreie-hotels.html" },
  { id: "sonntags-geschlossen", typ: "stattya", nazva: "Sonntags geschlossen",
    opys: "Чому німецькі магазини зачиняються о 20:00 і не працюють у неділю — і чому торговці та профспілки досі про це сперечаються.",
    riven: "B1", krayina: ["DE"], temy: ["Alltag", "Gesellschaft", "Geschichte"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "24–25" },
    dodano: "2026-10", file: "statti/sonntags-geschlossen.html" },
  { id: "ode-an-das-deutschlandticket", typ: "stattya", nazva: "Ein Ticket für ganz Deutschland",
    opys: "Від квитка за 9 євро до Deutschlandticket: один проїзний на місяць — і вся країна автобусами та регіональними поїздами.",
    riven: "A2", krayina: ["DE"], temy: ["Reisen & Städte", "Alltag"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "34–35" },
    dodano: "2026-10", file: "statti/ode-an-das-deutschlandticket.html" },
  { id: "bienenstich", typ: "stattya", nazva: "Bienenstich: Autsch oder lecker?",
    opys: "Bienenstich — це і укус бджоли, і улюблений німецький пиріг. Колонка про бджілку Майю і легенду, як вулики врятували місто.",
    riven: "B2", krayina: ["DE"], temy: ["Essen & Trinken", "Geschichte", "Kultur & Medien"],
    dzherelo: { nazva: "Deutsch perfekt", nomer: "11/2026", storinky: "66" },
    dodano: "2026-10", file: "statti/bienenstich.html" },
];
