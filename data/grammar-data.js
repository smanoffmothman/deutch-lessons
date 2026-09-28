// data/grammar-data.js
// -------------------------------------------------------------
// Розділ "Граматика": план УСІХ тем, і готових, і запланованих.
// Сторінка gramatyka/ показує весь план одразу (як зміст підручника):
// готові теми клікабельні, заплановані приглушені з позначкою
// "готується" — так само, як порожні модулі в каталозі уроків.
//
// Цей файл РЕДАГУЄТЬСЯ (у т.ч. вставками в середину), а не лише
// дописується в кінець — тому джерело правди тільки версія на GitHub.
// Перед будь-якою правкою бери свіжу копію звідти (див. CHANGELOG,
// "Інцидент: перезатертий Урок 18").
//
// ---------- GRAMMAR_ROZDILY — розділи (групи тем) ----------
//   id    — латиницею, стабільний (на нього посилаються теми)
//   nazva — назва розділу українською
// Порядок у масиві = порядок розділів на сторінці.
//
// ---------- GRAMMAR — теми ----------
//   id           — латиницею через дефіс, СТАБІЛЬНИЙ назавжди: з нього
//                  складається адреса сторінки gramatyka/temy/<id>.html,
//                  на нього посилаються уроки (поле gram у lessons-data.js)
//                  та інші теми (поле dyv). Не перейменовувати після
//                  публікації — зламаються посилання.
//   rozdil       — id розділу з GRAMMAR_ROZDILY
//   tema         — назва теми німецькою
//   uk           — назва теми українською
//   pidrozdily   — підрозділи теми німецькою (можна []). На сторінці
//                  теми це блоки у вкладці Regel; список тут — план.
//   knyha        — номер параграфа в підручнику-плані (Dreyer/Schmitt),
//                  лише для довідки при генерації; на сайті не видно.
//                  Для тем поза планом — null.
//   opublikovano — порядковий номер публікації: 1 для першої готової
//                  теми, 2 для другої і т.д. Немає поля / 0 = тема ще
//                  готується (немає HTML-файлу). Тема з найбільшим
//                  номером отримує мітку "нове". Потрібне саме число, а
//                  не true/false, бо теми генеруються не в порядку плану.
//   dyv          — (необов'язково) id пов'язаних тем, напр. ["relativsaetze"];
//                  показуються на сторінці теми у вкладці Fertig!
//
// Порядок тем у масиві = порядок на сторінці всередині свого розділу.
// Нову тему вставляй туди, де їй місце за змістом, — на мітку "нове"
// це не впливає (вона рахується за opublikovano).
// -------------------------------------------------------------

const GRAMMAR_ROZDILY = [
  { id: "nomen",          nazva: "Іменник, артикль, займенник" },
  { id: "verb",           nazva: "Дієслово: форми і часи" },
  { id: "rektion",        nazva: "Керування дієслів" },
  { id: "satzbau",        nazva: "Порядок слів і сполучники" },
  { id: "nebensaetze",    nazva: "Підрядні речення" },
  { id: "adjektiv",       nazva: "Прикметник і прислівник" },
  { id: "praepositionen", nazva: "Прийменники" },
  { id: "passiv",         nazva: "Пасив" },
  { id: "konjunktiv",     nazva: "Кон'юнктив" },
  { id: "attribute",      nazva: "Дієприкметникові звороти й означення" },
  { id: "anhang",         nazva: "Довідка" }
];

const GRAMMAR = [
  // ===== Іменник, артикль, займенник =====
  { id: "deklination-nomen", rozdil: "nomen", knyha: 1,
    tema: "Deklination des Nomens", uk: "Відмінювання іменників",
    pidrozdily: ["Mit dem bestimmten Artikel im Singular", "Genitiv Singular: -s oder -es", "Mit dem bestimmten Artikel im Plural", "Dativ Plural: -n", "Pluralbildung", "Besondere Pluralformen und Komposita", "Mit dem unbestimmten Artikel"],
    opublikovano: 1, dyv: ["n-deklination", "artikel-gebrauch", "possessivartikel", "adjektivdeklination"] },
  { id: "n-deklination", rozdil: "nomen", knyha: 2,
    tema: "Die n-Deklination", uk: "n-відміна іменників",
    pidrozdily: ["Mit dem bestimmten und unbestimmten Artikel", "Nomen auf -(e)n", "Sonderfälle: -ns, das Herz, der Herr", "Einwohner von Ländern und Erdteilen"],
    opublikovano: 2, dyv: ["deklination-nomen", "adjektive-als-nomen", "artikel-gebrauch"] },
  { id: "artikel-gebrauch", rozdil: "nomen", knyha: 3,
    tema: "Gebrauch des Artikels", uk: "Вживання артикля",
    pidrozdily: ["Der bestimmte Artikel: bekannt und einmalig", "Präposition + Artikel: am, im, zum …", "Der unbestimmte Artikel: neu und unbekannt", "Die Verneinung: kein", "Genitiv Plural: von + Dativ", "Namen, Städte und Länder", "Stoffe, Mengen und Gefühle ohne Artikel", "Beruf, Nationalität, Sprache; als", "Weitere Fälle ohne Artikel"],
    opublikovano: 3, dyv: ["deklination-nomen", "n-deklination", "adjektivdeklination", "komparation", "praepositionen-allgemein"] },
  { id: "personalpronomen", rozdil: "nomen", knyha: 4,
    tema: "Deklination der Personalpronomen", uk: "Відмінювання особових займенників",
    pidrozdily: ["Formen im Nominativ, Akkusativ und Dativ", "Der Genitiv: meiner, deiner …", "ich, du, wir, ihr, Sie: Personen im Gespräch", "er, sie, es: Personen und Sachen", "Personalpronomen mit Präpositionen", "Die Anrede: du, ihr oder Sie?", "Groß oder klein? Anrede in Briefen"],
    opublikovano: 4, dyv: ["deklination-nomen", "possessivartikel", "reflexive-verben", "rektion-verben", "satzstellung-hauptsatz", "praep-dativ", "praep-akkusativ", "verben-praepositionalobjekt"] },
  { id: "possessivartikel", rozdil: "nomen", knyha: 5,
    tema: "Possessivartikel", uk: "Присвійні артиклі (займенники)",
    pidrozdily: ["Formen im Nominativ", "Wer ist der Besitzer? sein oder ihr", "unser und euer", "Die Höflichkeitsform: Ihr, Ihre", "Deklination: die Endungen", "Zwei Fragen: Wer besitzt? Welcher Kasus?", "Ohne Nomen: meiner, meine, meins"],
    opublikovano: 5, dyv: ["personalpronomen", "deklination-nomen", "artikel-gebrauch", "adjektivdeklination", "rektion-verben"] },
  { id: "demonstrativpronomen", rozdil: "nomen", knyha: 36,
    tema: "Demonstrativpronomen", uk: "Вказівні займенники",
    pidrozdily: ["dieser, jener, solcher", "derselbe, derjenige", "der, die, das als Demonstrativpronomen"] },
  { id: "indefinitpronomen", rozdil: "nomen", knyha: 37,
    tema: "Indefinite Pronomen", uk: "Неозначені займенники",
    pidrozdily: ["Selbstständig gebrauchte Pronomen", "Pronomen mit oder ohne Nomen"] },
  { id: "zahlwoerter", rozdil: "nomen", knyha: 38,
    tema: "Zahlwörter", uk: "Числівники",
    pidrozdily: ["Kardinalzahlen", "Ordinalzahlen", "Weitere Zahlwörter", "Römische Zahlen"] },

  // ===== Дієслово: форми і часи =====
  { id: "konjugation", rozdil: "verb", knyha: 6,
    tema: "Konjugation der Verben", uk: "Дієвідмінювання",
    pidrozdily: ["Allgemeine Regeln", "Die Zeitformen im Überblick", "Das Partizip Perfekt", "Schwache Verben", "Starke Verben", "Verben mit Hilfs-e", "Mischverben", "Sonderregeln"],
    opublikovano: 6, dyv: ["trennbare-verben", "untrennbare-verben", "perfekt-plusquamperfekt", "modalverben", "imperativ", "fragen", "futur", "tempusformen", "starke-verben"] },
  { id: "trennbare-verben", rozdil: "verb", knyha: 7,
    tema: "Trennbare Verben", uk: "Відокремлювані дієслова",
    pidrozdily: ["Trennbare Präfixe und Betonung", "Präsens und Präteritum: Präfix am Satzende", "Perfekt und Plusquamperfekt: auf-ge-räumt", "Frage und Imperativ", "Mit Modalverb und im Nebensatz: zusammen", "Infinitiv mit zu: aufzustehen", "Andere Verbzusätze: fernsehen, teilnehmen, stattfinden", "Getrennt oder zusammen geschrieben?"],
    opublikovano: 7, dyv: ["konjugation", "untrennbare-verben", "trennbar-untrennbar", "perfekt-plusquamperfekt", "imperativ", "modalverben", "nebensaetze", "infinitiv-um-zu", "verben-dass-infinitiv"] },
  { id: "untrennbare-verben", rozdil: "verb", knyha: 8,
    tema: "Untrennbare Verben", uk: "Невідокремлювані дієслова",
    pidrozdily: ["Untrennbare Präfixe: be-, emp-, ent-, er-, ge-, miss-, ver-, zer-", "Neue Bedeutung durch das Präfix", "Präsens und Präteritum: das Präfix bleibt am Verb", "Partizip Perfekt ohne ge-", "Frage, Imperativ und Infinitiv mit zu", "Trennbar oder untrennbar?"],
    opublikovano: 8, dyv: ["konjugation", "trennbare-verben", "trennbar-untrennbar", "perfekt-plusquamperfekt", "starke-verben", "imperativ", "infinitiv-um-zu"] },
  { id: "trennbar-untrennbar", rozdil: "verb", knyha: 9,
    tema: "Trennbar und untrennbar gebrauchte Verben", uk: "Префікси durch-, über-, um-, unter-, wider-, wieder-",
    pidrozdily: ["Ein Präfix – zwei Wege: die Formen", "Die Betonung entscheidet", "Wörtliche oder neue Bedeutung", "Ein Verb, zwei Bedeutungen", "durch-: meist trennbar", "über-: meist untrennbar", "um-: meist trennbar", "unter-: meist untrennbar", "wider-: fast immer untrennbar", "wieder-: fast immer trennbar", "Anmerkung: hinter- ist immer untrennbar"],
    opublikovano: 9, dyv: ["trennbare-verben", "untrennbare-verben", "konjugation", "perfekt-plusquamperfekt", "imperativ", "infinitiv-um-zu", "starke-verben"] },
  { id: "reflexive-verben", rozdil: "verb", knyha: 10,
    tema: "Reflexive Verben", uk: "Зворотні дієслова",
    pidrozdily: ["Formen des Reflexivpronomens", "Zurück zum Subjekt: die Bedeutung", "Verben, die immer reflexiv sind", "Reflexiv oder mit Akkusativobjekt", "Reflexivpronomen im Dativ: mir, dir", "Reflexive Verben mit Präposition", "Zeitformen: immer mit haben", "Die Stellung im Satz", "Frage, Imperativ, Infinitiv mit zu", "sich lassen + Infinitiv"],
    opublikovano: 10, dyv: ["personalpronomen", "konjugation", "trennbare-verben", "perfekt-plusquamperfekt", "rektion-verben", "verben-praepositionalobjekt", "satzstellung-hauptsatz", "imperativ", "verben-dass-infinitiv", "passiv"] },
  { id: "imperativ", rozdil: "verb", knyha: 11,
    tema: "Der Imperativ", uk: "Наказовий спосіб",
    pidrozdily: ["Drei Formen: du, ihr, Sie", "Höflich bitten: bitte, doch, mal", "Die du-Form: Präsens ohne -st", "Starke Verben: kein Umlaut", "haben, sein, werden", "Die ihr-Form", "Die Sie-Form", "Die Endung -e: warte!, öffne!", "Verben auf -eln und -ern", "Trennbare und reflexive Verben, nicht", "Aufforderung ohne Imperativ: Infinitiv und Partizip"],
    opublikovano: 11, dyv: ["konjugation", "trennbare-verben", "untrennbare-verben", "reflexive-verben", "personalpronomen", "modalverben", "konjunktiv-2-gebrauch", "indirekte-rede"] },
  { id: "perfekt-plusquamperfekt", rozdil: "verb", knyha: 12,
    tema: "Perfekt und Plusquamperfekt mit haben oder sein", uk: "Perfekt і Plusquamperfekt: haben чи sein",
    pidrozdily: ["Die Bildung: Hilfsverb + Partizip II", "sein: Bewegung von einem Ort zu einem anderen", "sein: Veränderung des Zustands – Anfang und Ende", "sein und bleiben – und was passiert", "fahren, fliegen, schwimmen: mal haben, mal sein", "haben: Verben mit Akkusativobjekt", "haben: reflexive Verben und Modalverben", "haben: keine Bewegung – Ort, Dauer und Zustand", "haben: Verben mit Dativobjekt", "haben: anfangen, beginnen, aufhören", "Zwei Verben mit und", "Kurz und klar: haben oder sein?"],
    opublikovano: 12, dyv: ["konjugation", "trennbare-verben", "untrennbare-verben", "reflexive-verben", "modalverben", "legen-liegen", "rektion-verben", "tempusformen", "temporalsaetze", "starke-verben"] },
  { id: "legen-liegen", rozdil: "verb", knyha: 13,
    tema: "Transitive und intransitive Verben", uk: "legen/liegen, stellen/stehen та інші пари",
    pidrozdily: ["legen/liegen, stellen/stehen, setzen/sitzen", "hängen und stecken", "Handlung oder Ergebnis: wohin? oder wo?", "sich legen, sich stellen, sich setzen", "Weitere Paare: löschen/erlöschen, senken/sinken …", "erschrecken: schwach oder stark?", "Perfekt: haben oder sein?"],
    opublikovano: 13, dyv: ["konjugation", "perfekt-plusquamperfekt", "reflexive-verben", "untrennbare-verben", "wechselpraepositionen", "rektion-verben", "starke-verben"] },
  { id: "modalverben", rozdil: "verb", knyha: 18,
    tema: "Modalverben", uk: "Модальні дієслова",
    pidrozdily: ["Die Bedeutung der Modalverben", "Formen und Gebrauch", "Verben, die wie Modalverben gebraucht werden", "Modalverben mit zwei Infinitiven"] },
  { id: "modalverben-subjektiv", rozdil: "verb", knyha: 20,
    tema: "Modalverben zur subjektiven Aussage", uk: "Модальні дієслова для припущень",
    pidrozdily: ["Aussage über die Vergangenheit (Aktiv)", "Aussage über die Vergangenheit (Passiv)", "Subjektive Modalverben im Konjunktiv II"] },
  { id: "futur", rozdil: "verb", knyha: 21,
    tema: "Futur I und II zum Ausdruck der Vermutung", uk: "Futur I і II для припущень",
    pidrozdily: ["Hauptsätze", "Nebensätze"] },
  { id: "tempusformen", rozdil: "verb", knyha: 63,
    tema: "Gebrauch der Tempusformen", uk: "Вживання часів",
    pidrozdily: ["Präsens und Perfekt", "Präteritum und Plusquamperfekt"] },

  // ===== Керування дієслів =====
  { id: "rektion-verben", rozdil: "rektion", knyha: 14,
    tema: "Rektion der Verben", uk: "Керування дієслів: відмінки",
    pidrozdily: ["Verben mit Akkusativ", "Verben mit Dativ", "Verben mit Dativ und Akkusativ", "Verben mit zwei Akkusativen", "Verben mit Akkusativ und Genitiv", "Verben mit Genitiv", "Verben mit Prädikatsnominativ", "Akkusativobjekt in festen Verbindungen"],
    opublikovano: 14, dyv: ["personalpronomen", "deklination-nomen", "possessivartikel", "untrennbare-verben", "reflexive-verben", "perfekt-plusquamperfekt", "verben-praepositionalobjekt", "verben-dass-infinitiv", "funktionsverbgefuege", "satzstellung-hauptsatz"] },
  { id: "verben-praepositionalobjekt", rozdil: "rektion", knyha: 15,
    tema: "Verben mit präpositionalem Objekt", uk: "Дієслова з прийменниками",
    pidrozdily: ["Gebrauch", "In Fragen, dass-Sätzen und Infinitivkonstruktionen", "Die gebräuchlichsten Verben mit Präposition", "Feste Verb-Akkusativ-Verbindungen mit präpositionalem Objekt"] },
  { id: "verben-dass-infinitiv", rozdil: "rektion", knyha: 16,
    tema: "Verben mit dass-Sätzen oder Infinitivkonstruktionen", uk: "Дієслова з dass-реченнями та інфінітивом",
    pidrozdily: ["Allgemeine Regeln", "Verben, von denen dass-Sätze oder Infinitivkonstruktionen abhängen", "Tempusformen in der Infinitivkonstruktion"] },
  { id: "funktionsverbgefuege", rozdil: "rektion", knyha: 62,
    tema: "Funktionsverbgefüge", uk: "Сталі дієслівні сполучення",
    pidrozdily: ["Akkusativobjekt in einer festen Verbindung", "Akkusativobjekt-Verb-Verbindungen mit präpositionalem Objekt", "Objekt-Verb-Verbindungen mit vorangestellter Präposition", "Redensarten und ihre Bedeutungen"] },

  // ===== Порядок слів і сполучники =====
  { id: "fragen", rozdil: "satzbau", knyha: 17,
    tema: "Fragen", uk: "Питальні речення",
    pidrozdily: ["Fragen ohne Fragewort", "Fragen mit Fragewort"] },
  { id: "satzstellung-hauptsatz", rozdil: "satzbau", knyha: 22,
    tema: "Die Satzstellung im Hauptsatz", uk: "Порядок слів у головному реченні",
    pidrozdily: ["Satzstellung mit Objekten", "Umstellung", "Pronomen im Akkusativ und Dativ", "Stellung der Reflexivpronomen", "Adverbiale Angaben", "Objekte und adverbiale Angaben", "Präpositionale Objekte"] },
  { id: "konjunktionen-position-null", rozdil: "satzbau", knyha: 23,
    tema: "Satzverbindungen: Konjunktionen in der Position Null", uk: "Сполучники на нульовій позиції: und, aber, oder, denn, sondern",
    pidrozdily: ["Subjekt in Position I", "Umstellung", "Satzstellung mit Personalpronomen", "Weglassen von Satzgliedern", "aber, oder, denn, sondern"] },
  { id: "konjunktionen-position-eins", rozdil: "satzbau", knyha: 24,
    tema: "Satzverbindungen: Konjunktionen in der Position I", uk: "Сполучники на першій позиції: deshalb, trotzdem, dann…",
    pidrozdily: ["Satzstellung", "Erläuterungen zu den Konjunktionen"] },

  // ===== Підрядні речення =====
  { id: "nebensaetze", rozdil: "nebensaetze", knyha: 25,
    tema: "Nebensätze", uk: "Підрядні речення: загальні правила",
    pidrozdily: [] },
  { id: "temporalsaetze", rozdil: "nebensaetze", knyha: 26,
    tema: "Temporale Nebensätze", uk: "Підрядні речення часу",
    pidrozdily: ["wenn, als", "während, solange, bevor", "nachdem, sobald", "bis, seit, seitdem"] },
  { id: "kausalsaetze", rozdil: "nebensaetze", knyha: 27,
    tema: "Kausale Nebensätze", uk: "Підрядні речення причини",
    pidrozdily: ["weil, da, zumal"] },
  { id: "konditionalsaetze", rozdil: "nebensaetze", knyha: 28,
    tema: "Konditionale Nebensätze", uk: "Умовні підрядні речення",
    pidrozdily: ["wenn, falls", "Differenzierte Bedingungssätze"] },
  { id: "konsekutivsaetze", rozdil: "nebensaetze", knyha: 29,
    tema: "Konsekutive Nebensätze", uk: "Підрядні речення наслідку",
    pidrozdily: ["sodass; so …, dass"] },
  { id: "konzessivsaetze", rozdil: "nebensaetze", knyha: 30,
    tema: "Konzessive Nebensätze", uk: "Допустові підрядні речення",
    pidrozdily: ["obwohl, obgleich, obschon", "(wenn) … auch noch so …, so … (doch)"] },
  { id: "modalsaetze", rozdil: "nebensaetze", knyha: 31,
    tema: "Modale Nebensätze", uk: "Підрядні речення способу дії та порівняння",
    pidrozdily: ["wie, als (Vergleichssätze)", "je …, desto", "wie (Modalsätze)", "indem"] },
  { id: "finalsaetze", rozdil: "nebensaetze", knyha: 32,
    tema: "Finalsätze", uk: "Підрядні речення мети",
    pidrozdily: ["damit; um … zu"] },
  { id: "infinitiv-um-zu", rozdil: "nebensaetze", knyha: 33,
    tema: "Infinitivkonstruktionen mit um … zu, ohne … zu, anstatt … zu", uk: "Звороти um … zu, ohne … zu, anstatt … zu",
    pidrozdily: [] },
  { id: "indirekte-fragesaetze", rozdil: "nebensaetze", knyha: 34,
    tema: "Fragesätze als Nebensätze", uk: "Непрямі питання",
    pidrozdily: [] },
  { id: "relativsaetze", rozdil: "nebensaetze", knyha: 35,
    tema: "Relativsätze", uk: "Означальні підрядні речення",
    pidrozdily: ["Relativpronomen im Nominativ, Akkusativ, Dativ", "Relativpronomen im Genitiv", "Relativsätze mit Präpositionen", "Relativsätze mit wo(-)", "Relativsätze mit wer, wen, wem, wessen", "Relativsätze mit was"] },

  // ===== Прикметник і прислівник =====
  { id: "adjektivdeklination", rozdil: "adjektiv", knyha: 39,
    tema: "Deklination des Adjektivs", uk: "Відмінювання прикметників",
    pidrozdily: ["Mit dem bestimmten Artikel", "Mit dem unbestimmten Artikel", "Mit Possessivartikeln", "Ohne Artikel im Singular", "Ohne Artikel im Singular und Plural"] },
  { id: "komparation", rozdil: "adjektiv", knyha: 40,
    tema: "Komparativ und Superlativ", uk: "Ступені порівняння",
    pidrozdily: ["Allgemeine Regeln", "Gebrauch des Superlativs", "Sonderformen"] },
  { id: "adjektive-als-nomen", rozdil: "adjektiv", knyha: 41,
    tema: "Adjektive und Partizipien als Nomen", uk: "Прикметники й дієприкметники в ролі іменників",
    pidrozdily: [] },
  { id: "adverbien", rozdil: "adjektiv", knyha: 42,
    tema: "Adverbien", uk: "Прислівники",
    pidrozdily: ["Allgemeine Regeln", "Temporaladverbien", "Modaladverbien", "Lokaladverbien"] },
  { id: "adverbien-dativ-akkusativ", rozdil: "adjektiv", knyha: 43,
    tema: "Modale Adverbien mit Dativ bzw. Akkusativ", uk: "Прислівники з Dativ і Akkusativ",
    pidrozdily: ["Adverbien mit Dativ", "Adverbien mit Zeit- und Maßangaben im Akkusativ"] },
  { id: "adverbien-praeposition", rozdil: "adjektiv", knyha: 44,
    tema: "Adverbien mit Präpositionen", uk: "Прислівники з прийменниками",
    pidrozdily: [] },

  // ===== Прийменники =====
  { id: "praepositionen-allgemein", rozdil: "praepositionen", knyha: 57,
    tema: "Präpositionen: Allgemeine Regeln", uk: "Прийменники: загальні правила",
    pidrozdily: [] },
  { id: "praep-akkusativ", rozdil: "praepositionen", knyha: 58,
    tema: "Präpositionen mit dem Akkusativ", uk: "Прийменники з Akkusativ",
    pidrozdily: ["bis", "durch", "entlang", "für", "gegen", "ohne", "um", "wider"] },
  { id: "praep-dativ", rozdil: "praepositionen", knyha: 59,
    tema: "Präpositionen mit dem Dativ", uk: "Прийменники з Dativ",
    pidrozdily: ["ab", "aus", "außer", "bei", "dank", "entgegen", "entsprechend", "gegenüber", "gemäß", "mit", "nach", "nebst", "samt", "seit", "von", "zu", "zufolge"] },
  { id: "wechselpraepositionen", rozdil: "praepositionen", knyha: 60,
    tema: "Präpositionen mit Akkusativ oder Dativ", uk: "Прийменники з Akkusativ або Dativ",
    pidrozdily: ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"] },
  { id: "praep-genitiv", rozdil: "praepositionen", knyha: 61,
    tema: "Präpositionen mit dem Genitiv", uk: "Прийменники з Genitiv",
    pidrozdily: [] },

  // ===== Пасив =====
  { id: "passiv", rozdil: "passiv", knyha: 19,
    tema: "Das Passiv", uk: "Пасив",
    pidrozdily: ["Konjugation", "Gebrauch", "Passiv mit Modalverben", "Passiv in der Infinitivkonstruktion"] },
  { id: "zustandspassiv", rozdil: "passiv", knyha: 45,
    tema: "Das Zustandspassiv", uk: "Пасив стану",
    pidrozdily: [] },
  { id: "haben-sein-zu", rozdil: "passiv", knyha: 48,
    tema: "haben und sein + Infinitiv mit zu", uk: "haben і sein + zu + інфінітив",
    pidrozdily: ["Notwendigkeit, Möglichkeit, Willensäußerung", "Passiversatz"] },
  { id: "gerundivum", rozdil: "passiv", knyha: 49,
    tema: "Das Gerundivum", uk: "Gerundivum",
    pidrozdily: [] },

  // ===== Кон'юнктив =====
  { id: "konjunktiv", rozdil: "konjunktiv", knyha: 52,
    tema: "Der Konjunktiv", uk: "Кон'юнктив: огляд",
    pidrozdily: [] },
  { id: "konjunktiv-2-formen", rozdil: "konjunktiv", knyha: 53,
    tema: "Der Konjunktiv II: Verbformen", uk: "Konjunktiv II: форми",
    pidrozdily: ["Gegenwartsformen", "Vergangenheitsformen", "Das Passiv im Konjunktiv II", "Vergangenheitsformen mit Modalverben"] },
  { id: "konjunktiv-2-gebrauch", rozdil: "konjunktiv", knyha: 54,
    tema: "Gebrauch des Konjunktivs II", uk: "Konjunktiv II: вживання",
    pidrozdily: ["Irreale Wunschsätze", "Irreale Bedingungssätze", "würde + Infinitiv", "Irreale Vergleichssätze", "Irreale Folgesätze", "Weitere Anwendungsbereiche"] },
  { id: "konjunktiv-1-formen", rozdil: "konjunktiv", knyha: 55,
    tema: "Der Konjunktiv I: Verbformen", uk: "Konjunktiv I: форми",
    pidrozdily: ["Gegenwartsformen", "Zukunftsformen (auch Vermutung)", "Vergangenheitsformen", "Das Passiv im Konjunktiv I"] },
  { id: "indirekte-rede", rozdil: "konjunktiv", knyha: 56,
    tema: "Gebrauch des Konjunktivs I: indirekte Rede", uk: "Непряма мова",
    pidrozdily: ["Die indirekte Rede", "Die indirekte Frage", "Der Imperativ in der indirekten Rede"] },

  // ===== Дієприкметникові звороти й означення =====
  { id: "partizipialkonstruktion", rozdil: "attribute", knyha: 46,
    tema: "Die Partizipialkonstruktion", uk: "Дієприкметникові звороти",
    pidrozdily: ["Allgemeine Regeln", "Mit transitiven Verben", "Mit intransitiven Verben", "Mit dem Zustandspassiv"] },
  { id: "partizipialsaetze", rozdil: "attribute", knyha: 47,
    tema: "Partizipialsätze", uk: "Дієприкметникові речення",
    pidrozdily: [] },
  { id: "appositionen", rozdil: "attribute", knyha: 50,
    tema: "Appositionen", uk: "Прикладки",
    pidrozdily: [] },
  { id: "rangattribute", rozdil: "attribute", knyha: 51,
    tema: "Rangattribute", uk: "Підсилювальні означення (Rangattribute)",
    pidrozdily: [] },

  // ===== Довідка =====
  { id: "kommaregeln", rozdil: "anhang", knyha: null,
    tema: "Die wichtigsten Kommaregeln", uk: "Основні правила вживання коми",
    pidrozdily: ["Ein Komma wird gesetzt", "In Kommas eingeschlossen", "Kommas, die entfallen können"] },
  { id: "starke-verben", rozdil: "anhang", knyha: null,
    tema: "Liste der starken und unregelmäßigen Verben", uk: "Таблиця сильних і неправильних дієслів",
    pidrozdily: [] }
];
