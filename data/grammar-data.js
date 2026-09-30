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
    pidrozdily: ["dieser, diese, dieses: die Formen", "dieser oder jener?", "solcher, solche, solches: so eine Art", "ein solcher, solch ein, so ein", "derselbe, dieselbe, dasselbe: die Formen", "derselbe oder der gleiche?", "derjenige, der …", "der, die, das als Pronomen: die Formen", "Den kenne ich! – selbstständig und betont", "die meiner Eltern: das Nomen nicht wiederholen", "das für einen ganzen Satz: das alles, all das", "Das ist mein Bruder: das mit sein und werden", "das oder es?", "dessen, deren, derer", "selbst und selber"],
    opublikovano: 36, dyv: ["artikel-gebrauch", "deklination-nomen", "personalpronomen", "possessivartikel", "relativsaetze", "satzstellung-hauptsatz", "konsekutivsaetze", "rektion-verben", "adjektivdeklination", "indefinitpronomen"] },
  { id: "indefinitpronomen", rozdil: "nomen", knyha: 37,
    tema: "Indefinite Pronomen", uk: "Неозначені займенники",
    pidrozdily: ["man – einen – einem", "jemand und niemand", "einer, eine, eins – keiner, keine, keins", "einander: sich gegenseitig", "irgendwer, irgendjemand, irgendwas", "etwas und nichts", "jeder, jede, jedes – alle, sämtliche", "mancher, manche, manches", "alles, allem: alles Liebe, mit aller Kraft", "all die, all meine, all diese", "viele, wenige, einige, mehrere, andere, einzelne", "vieles, einiges, weniges, anderes", "viel, wenig, mehr – ohne Endung", "anders oder anderes?"],
    opublikovano: 37, dyv: ["demonstrativpronomen", "personalpronomen", "possessivartikel", "artikel-gebrauch", "reflexive-verben", "adjektivdeklination", "adjektive-als-nomen", "komparation", "relativsaetze"] },
  { id: "zahlwoerter", rozdil: "nomen", knyha: 38,
    tema: "Zahlwörter", uk: "Числівники",
    pidrozdily: ["Zahlen bilden: einundzwanzig, hundertzwei", "ein als Zahl: nur ein Bruder, nicht zwei", "eins ohne Nomen: einer, eine, eins", "der eine – der andere", "zweier, dreier: Endungen nur bei zwei und drei", "Zahlen als Nomen: die Null, eine Eins", "eine Million, zwei Millionen, eine Milliarde", "beide und beides", "ein Paar oder ein paar?", "ein Dutzend; Hunderte, Tausende", "Mit -er: ein Zehner, in den Neunzigern", "Uhrzeiten: offiziell und im Alltag", "Geld, Grad und Rechnen: so spricht man", "Jahreszahlen: 1989 und 2026", "Ordinalzahlen: der 2. = der zweite – der Wievielte?", "-te oder -ste? der zweite, der zwanzigste", "Endungen wie beim Adjektiv: mein dritter Versuch, Zweiter werden", "Das Datum: der 3. Oktober – am 3. Oktober", "Nach Namen: Ludwig II. = Ludwig der Zweite", "zu zweit, zu dritt: wie viele Personen?", "zweitbeste, drittgrößte: Ordinalzahl + Superlativ", "der erste – der letzte; Ersterer – Letzterer", "Bruchzahlen: halb, ein Drittel, ein Viertel", "erstens, zweitens, drittens", "Wie oft? einmal, dreimal – einmalig", "Wievielfach? einfach, dreifach, doppelt", "Wie viele Arten? zweierlei, einerlei", "Römische Zahlen"],
    opublikovano: 38, dyv: ["artikel-gebrauch", "indefinitpronomen", "demonstrativpronomen", "deklination-nomen", "adjektivdeklination", "komparation", "adjektive-als-nomen", "satzstellung-hauptsatz", "praep-dativ"] },

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
    pidrozdily: ["dürfen: Erlaubnis und Verbot", "können: Möglichkeit und Fähigkeit", "mögen und möchte", "müssen und nicht brauchen zu", "sollen: Regel, Pflicht, Auftrag", "wollen: Wunsch und Plan", "Modalverb ohne Vollverb", "Präsens: Sonderformen im Singular", "Präteritum: ohne Umlaut, mit -te", "Im Hauptsatz: Präsens und Präteritum", "Perfekt und Plusquamperfekt: hat … machen wollen", "Im Nebensatz: …, dass er kommen kann", "hören, sehen, lassen, helfen", "bleiben, gehen, lehren, lernen", "Mit zu oder ohne? helfen, lernen, fühlen", "Modalverb + zwei Infinitive"],
    opublikovano: 18, dyv: ["konjugation", "trennbare-verben", "reflexive-verben", "perfekt-plusquamperfekt", "fragen", "satzstellung-hauptsatz", "nebensaetze", "verben-dass-infinitiv", "infinitiv-um-zu", "modalverben-subjektiv", "passiv", "konjunktiv-2-gebrauch", "starke-verben"] },
  { id: "modalverben-subjektiv", rozdil: "verb", knyha: 20,
    tema: "Modalverben zur subjektiven Aussage", uk: "Модальні дієслова для припущень",
    pidrozdily: ["Objektiv oder subjektiv? Zwei Bedeutungen", "Wie sicher? muss, dürfte, kann, mag", "sollen und wollen: fremde und eigene Behauptung", "Aussage über die Vergangenheit (Aktiv)", "Aussage über die Vergangenheit (Passiv)", "Im Nebensatz: …, weil er den Bus verpasst haben muss", "Im Konjunktiv II: müsste, könnte, dürfte", "sollte: eigentlich und falls"],
    opublikovano: 20, dyv: ["modalverben", "perfekt-plusquamperfekt", "passiv", "futur", "nebensaetze", "konditionalsaetze", "konjunktiv-2-formen", "konjunktiv-2-gebrauch", "indirekte-rede", "starke-verben"] },
  { id: "futur", rozdil: "verb", knyha: 21,
    tema: "Futur I und II zum Ausdruck der Vermutung", uk: "Futur I і II для припущень",
    pidrozdily: ["Zukunft mit Präsens + Zeitangabe", "In der Zukunft schon fertig: Perfekt + Zeitangabe", "Futur I: sichere Aussage, Prognose, Drohung", "Vermutung: Futur I (jetzt) und Futur II (schon passiert)", "Hauptsätze: Aktiv und Passiv", "Hauptsätze mit Modalverb", "Nebensätze: werden am Ende", "Nebensätze mit Modalverb: …, weil er nicht wird kommen können", "Im Alltag einfacher: wahrscheinlich, vielleicht, vermutlich"],
    opublikovano: 21, dyv: ["modalverben-subjektiv", "konjugation", "perfekt-plusquamperfekt", "modalverben", "passiv", "nebensaetze", "tempusformen", "konjunktiv-1-formen", "starke-verben"] },
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
    pidrozdily: ["Verb + Präposition + Objekt", "Fragen: Worauf? – Auf wen?", "Ohne Nomen: darauf – auf ihn", "Mit dass-Satz oder Infinitiv: darauf, dass …", "Wichtige Verben: Präposition + Akkusativ", "Wichtige Verben: Präposition + Dativ", "Zwei präpositionale Objekte: mit wem? – worüber?", "Feste Verbindungen: Angst haben vor, Lust haben auf"],
    opublikovano: 15, dyv: ["rektion-verben", "reflexive-verben", "personalpronomen", "fragen", "verben-dass-infinitiv", "infinitiv-um-zu", "indirekte-fragesaetze", "funktionsverbgefuege", "praep-akkusativ", "praep-dativ", "wechselpraepositionen"] },
  { id: "verben-dass-infinitiv", rozdil: "rektion", knyha: 16,
    tema: "Verben mit dass-Sätzen oder Infinitivkonstruktionen", uk: "Дієслова з dass-реченнями та інфінітивом",
    pidrozdily: ["Der dass-Satz: ein eigenes Subjekt", "Die Infinitivkonstruktion: kein eigenes Subjekt", "Wo steht zu?", "Gruppe 1: hoffen, glauben, versprechen …", "Nur mit Infinitiv: versuchen, anfangen, aufhören …", "Statt dass-Satz: ein Hauptsatz", "brauchen, scheinen, drohen, pflegen + zu", "Gruppe 2: Verben mit Präposition – darauf, dass …", "Gruppe 3: bitten, raten, erlauben …", "Gruppe 4: Es freut mich, … zu", "Es ist wichtig, … zu: es ist + Adjektiv", "Am Satzanfang: Dich zu sehen, freut mich.", "zu machen oder gemacht zu haben?"],
    opublikovano: 16, dyv: ["verben-praepositionalobjekt", "rektion-verben", "infinitiv-um-zu", "nebensaetze", "trennbare-verben", "reflexive-verben", "perfekt-plusquamperfekt", "satzstellung-hauptsatz", "indirekte-rede", "modalverben", "passiv", "kommaregeln"] },
  { id: "funktionsverbgefuege", rozdil: "rektion", knyha: 62,
    tema: "Funktionsverbgefüge", uk: "Сталі дієслівні сполучення",
    pidrozdily: ["Das Verb verliert seine Bedeutung", "Nomen im Akkusativ + Verb: eine Frage stellen", "Artikel und Ergänzung: eine Entscheidung – die Entscheidung, …", "Trennbare und untrennbare Funktionsverben: eine Prüfung ablegen", "Verneinung und Satzstellung: kein oder nicht?", "Mit präpositionalem Objekt: Wert legen auf + Akk.", "Ohne Nomen: darauf, dass … – auf ihn", "Präposition + Nomen + Verb: in Frage kommen", "Mit Objekt: etwas zur Diskussion stellen", "Paare: zur Sprache bringen – zur Sprache kommen", "Redensarten mit festem Artikel"],
    opublikovano: 62, dyv: ["rektion-verben", "verben-praepositionalobjekt", "verben-dass-infinitiv", "adverbien-praeposition", "trennbare-verben", "untrennbare-verben", "trennbar-untrennbar", "reflexive-verben", "perfekt-plusquamperfekt", "satzstellung-hauptsatz", "artikel-gebrauch", "wechselpraepositionen", "passiv", "zustandspassiv"] },

  // ===== Порядок слів і сполучники =====
  { id: "fragen", rozdil: "satzbau", knyha: 17,
    tema: "Fragen", uk: "Питальні речення",
    pidrozdily: ["Ja/Nein-Fragen: das Verb am Anfang", "Verneinte Fragen: ja wird zu doch", "Genauer fragen: schon, noch, erst, nur", "W-Fragewörter: wer, was, wann, wo …", "Fragewort + Nomen: wie viel, welcher, was für ein", "wie + Adjektiv: wie alt, wie oft, wie lange", "Fragen mit Präposition: mit wem? – womit?"],
    opublikovano: 17, dyv: ["satzstellung-hauptsatz", "konjugation", "trennbare-verben", "modalverben", "rektion-verben", "verben-praepositionalobjekt", "personalpronomen", "artikel-gebrauch", "adverbien-dativ-akkusativ", "indirekte-fragesaetze"] },
  { id: "satzstellung-hauptsatz", rozdil: "satzbau", knyha: 22,
    tema: "Die Satzstellung im Hauptsatz", uk: "Порядок слів у головному реченні",
    pidrozdily: ["Das Verb auf Position II", "Die Verneinung mit nicht", "Satzstellung mit Objekten", "Umstellung: ein anderes Satzglied auf Position I", "Pronomen im Akkusativ und Dativ", "Umstellung mit Pronomen", "Stellung der Reflexivpronomen", "Adverbiale Angaben: te-ka-mo-lo", "Objekte und adverbiale Angaben", "Präpositionale Objekte"],
    opublikovano: 22, dyv: ["konjugation", "trennbare-verben", "perfekt-plusquamperfekt", "modalverben", "fragen", "personalpronomen", "rektion-verben", "reflexive-verben", "verben-praepositionalobjekt", "konjunktionen-position-null", "konjunktionen-position-eins", "nebensaetze", "adverbien", "passiv"] },
  { id: "konjunktionen-position-null", rozdil: "satzbau", knyha: 23,
    tema: "Satzverbindungen: Konjunktionen in der Position Null", uk: "Сполучники на нульовій позиції: und, aber, oder, denn, sondern",
    pidrozdily: ["Subjekt in Position I", "Umstellung: ein anderes Satzglied in Position I", "Personalpronomen vor dem Subjekt", "Weglassen nach und", "Wiederholen oder weglassen? aber, oder, sondern, denn", "aber, doch, jedoch", "oder und entweder … oder", "denn: der Grund", "sondern und nicht nur …, sondern auch", "Das Komma vor und, aber, oder, denn, sondern"],
    opublikovano: 23, dyv: ["satzstellung-hauptsatz", "konjunktionen-position-eins", "personalpronomen", "fragen", "modalverben", "nebensaetze", "kausalsaetze", "kommaregeln"] },
  { id: "konjunktionen-position-eins", rozdil: "satzbau", knyha: 24,
    tema: "Satzverbindungen: Konjunktionen in der Position I", uk: "Сполучники на першій позиції: deshalb, trotzdem, dann…",
    pidrozdily: ["Position I oder Position III", "Mit Pronomen: die Konjunktion in Position IV", "Grund: darum, deshalb, deswegen, daher", "Folge: also, folglich, infolgedessen, demnach, insofern", "Gegensatz: trotzdem, dennoch, allerdings, indessen", "Stärker betont: zwar … aber (doch)", "Zeit: dann, danach, da, daraufhin, inzwischen", "Zweiteilig: entweder … oder", "Zweiteilig: nicht nur … sondern auch", "Zweiteilig: weder … noch", "Zweiteilig: einerseits – andererseits, mal – mal, bald – bald", "Betontes Subjekt: Weder der Lehrer …, noch …", "sonst, andernfalls: Folge, Bitte, Drohung", "sonst + Konjunktiv II: eine unsichere Möglichkeit", "sonst als Adverb: früher, gewöhnlich"],
    opublikovano: 24, dyv: ["satzstellung-hauptsatz", "konjunktionen-position-null", "personalpronomen", "nebensaetze", "kausalsaetze", "konsekutivsaetze", "konzessivsaetze", "temporalsaetze", "konditionalsaetze", "konjunktiv-2-gebrauch", "adverbien", "kommaregeln"] },

  // ===== Підрядні речення =====
  { id: "nebensaetze", rozdil: "nebensaetze", knyha: 25,
    tema: "Nebensätze", uk: "Підрядні речення: загальні правила",
    pidrozdily: ["Ein Satz, der nicht allein steht", "Die Konjunktion gibt die Richtung", "Subjekt vorn, Verb am Ende", "Der Nebensatz steht nach dem Hauptsatz", "Der Nebensatz steht vor dem Hauptsatz", "Pronomen im Nebensatz", "Nebensätze hängen voneinander ab", "Nach glauben, meinen …: ein Hauptsatz mit Konjunktiv II"],
    opublikovano: 25, dyv: ["satzstellung-hauptsatz", "konjunktionen-position-null", "konjunktionen-position-eins", "trennbare-verben", "modalverben", "personalpronomen", "reflexive-verben", "verben-dass-infinitiv", "infinitiv-um-zu", "temporalsaetze", "kausalsaetze", "konditionalsaetze", "konzessivsaetze", "finalsaetze", "indirekte-fragesaetze", "relativsaetze", "konjunktiv-2-gebrauch", "kommaregeln"] },
  { id: "temporalsaetze", rozdil: "nebensaetze", knyha: 26,
    tema: "Temporale Nebensätze", uk: "Підрядні речення часу",
    pidrozdily: ["wenn: einmal – in Gegenwart und Zukunft", "Immer wieder: wenn, immer wenn, jedes Mal, wenn, sooft", "als: einmal in der Vergangenheit", "wenn oder als? Die Übersicht", "während: zur gleichen Zeit", "während als Gegensatz", "solange: genauso lange", "bevor, ehe: zuerst der Hauptsatz", "nachdem: zuerst der Nebensatz – mit Zeitenwechsel", "sobald, sowie: sofort danach – oder gleichzeitig", "bis: bis zu einem Zeitpunkt", "seit, seitdem: von damals bis jetzt", "Präposition oder Nebensatz? vor, während, nach, bis zu, seit, bei"],
    opublikovano: 26, dyv: ["nebensaetze", "perfekt-plusquamperfekt", "konjunktionen-position-eins", "konditionalsaetze", "futur", "tempusformen", "modalsaetze", "praep-dativ", "praep-genitiv", "wechselpraepositionen", "kommaregeln"] },
  { id: "kausalsaetze", rozdil: "nebensaetze", knyha: 27,
    tema: "Kausale Nebensätze", uk: "Підрядні речення причини",
    pidrozdily: ["weil: der Grund", "Das Verb am Ende: Zeitformen und Modalverben", "da: der Grund am Satzanfang", "zumal: noch ein Grund dazu", "weil oder denn? Sprechen und Schreiben"],
    opublikovano: 27, dyv: ["nebensaetze", "konjunktionen-position-null", "konjunktionen-position-eins", "temporalsaetze", "fragen", "trennbare-verben", "perfekt-plusquamperfekt", "modalverben", "konsekutivsaetze", "konzessivsaetze", "finalsaetze", "kommaregeln"] },
  { id: "konditionalsaetze", rozdil: "nebensaetze", knyha: 28,
    tema: "Konditionale Nebensätze", uk: "Умовні підрядні речення",
    pidrozdily: ["wenn: erst die Bedingung, dann die Folge", "wenn: Bedingung oder Zeit?", "falls: nur eine Bedingung", "Ohne wenn: das Verb steht vorn", "Der Nebensatz steht hinten: immer mit Konjunktion", "dann oder so am Anfang des Hauptsatzes", "falls … sollte: eher unwahrscheinlich", "Bedingung in der Vergangenheit: nur irreal", "bei + Nomen oder wenn-Satz?", "angenommen, vorausgesetzt, gesetzt den Fall", "Nur mit dass: unter der Bedingung, dass; im Fall, dass"],
    opublikovano: 28, dyv: ["nebensaetze", "temporalsaetze", "konjunktionen-position-eins", "fragen", "futur", "modalverben-subjektiv", "konjunktiv-2-formen", "konjunktiv-2-gebrauch", "praep-dativ", "kommaregeln"] },
  { id: "konsekutivsaetze", rozdil: "nebensaetze", knyha: 29,
    tema: "Konsekutive Nebensätze", uk: "Підрядні речення наслідку",
    pidrozdily: ["sodass: die Folge steht hinten", "so + Adjektiv oder Adverb …, dass", "derart, dermaßen: noch stärker betont", "Grad oder Folge betont: so …, dass oder sodass?", "so vor einem Adjektiv mit Nomen: ein so langer Weg", "solch-: eine solche Hitze, dass …", "zu …, als dass + Konjunktiv II"],
    opublikovano: 29, dyv: ["nebensaetze", "kausalsaetze", "finalsaetze", "konjunktionen-position-eins", "konzessivsaetze", "demonstrativpronomen", "adjektivdeklination", "infinitiv-um-zu", "konjunktiv-2-gebrauch", "kommaregeln"] },
  { id: "konzessivsaetze", rozdil: "nebensaetze", knyha: 30,
    tema: "Konzessive Nebensätze", uk: "Допустові підрядні речення",
    pidrozdily: ["obwohl, obgleich, obschon: der Gegensatz", "Der obwohl-Satz: vorn oder hinten", "Die Zeitform richtet sich nach dem Sinn", "obwohl oder trotzdem? Nebensatz oder Hauptsatz", "obwohl oder weil? Gegensatz oder Grund", "wenn … auch noch so …, so … (doch)", "Nach dem Nebensatz: das Subjekt in Position I", "Ohne wenn: das Verb steht vorn", "wie … auch (immer): egal, wie …"],
    opublikovano: 30, dyv: ["nebensaetze", "konjunktionen-position-eins", "konjunktionen-position-null", "kausalsaetze", "konditionalsaetze", "konsekutivsaetze", "temporalsaetze", "modalsaetze", "perfekt-plusquamperfekt", "trennbare-verben", "modalverben", "kommaregeln"] },
  { id: "modalsaetze", rozdil: "nebensaetze", knyha: 31,
    tema: "Modale Nebensätze", uk: "Підрядні речення способу дії та порівняння",
    pidrozdily: ["so … wie: Erwartung und Tatsache stimmen überein", "so, genauso, ebenso – auch ohne Adjektiv", "Komparativ + als: Es ist anders gekommen", "anders als, ein anderer … als", "Tempuswechsel: vorher vermutet – jetzt Tatsache", "Ohne Nebensatz: genauso wie ihre Mutter", "je …, desto / umso: zwei Komparative", "Die Satzstellung: Verb am Ende – dann Verb auf Position II", "Komparativ mit Nomen: desto höhere Preise, desto mehr Zeit", "Komparativ im Objekt und mit Präposition", "wie: aus der Frage nach der Art und Weise", "wie + Adverb: wie schön, wie schnell", "Wie ich gehört habe, …: eine persönliche Bemerkung", "indem: das Mittel – wie macht man das?", "durch + Nomen oder indem-Satz?"],
    opublikovano: 31, dyv: ["nebensaetze", "komparation", "perfekt-plusquamperfekt", "temporalsaetze", "konsekutivsaetze", "konzessivsaetze", "finalsaetze", "indirekte-fragesaetze", "relativsaetze", "adjektivdeklination", "trennbare-verben", "konjunktiv-2-gebrauch", "kommaregeln"] },
  { id: "finalsaetze", rozdil: "nebensaetze", knyha: 32,
    tema: "Finalsätze", uk: "Підрядні речення мети",
    pidrozdily: ["damit: der Zweck einer Handlung", "Der damit-Satz: hinten oder vorn", "Die Zeitform: meistens Präsens", "Zwei verschiedene Subjekte: nur damit", "Ohne wollen und sollen", "Ein Subjekt: besser um … zu", "Wozu? – zum / zur + Nomen", "damit oder damit? Konjunktion und „mit dem“"],
    opublikovano: 32, dyv: ["nebensaetze", "infinitiv-um-zu", "kausalsaetze", "konsekutivsaetze", "modalsaetze", "modalverben", "trennbare-verben", "reflexive-verben", "konjunktiv-2-gebrauch", "adverbien-praeposition", "kommaregeln"] },
  { id: "infinitiv-um-zu", rozdil: "nebensaetze", knyha: 33,
    tema: "Infinitivkonstruktionen mit um … zu, ohne … zu, anstatt … zu", uk: "Звороти um … zu, ohne … zu, anstatt … zu",
    pidrozdily: ["Eigene Bedeutung – unabhängig vom Verb", "um … zu: Ziel und Absicht", "ohne … zu: Das Erwartete passiert nicht", "(an)statt … zu: etwas anderes als erwartet", "Wo steht zu? Trennbare, reflexive und Modalverben", "Kein eigenes Subjekt: dieselbe Person", "Vorn oder hinten: Stellung und Komma", "Zwei Subjekte: damit, ohne dass, anstatt dass", "nichts anderes / etwas anderes / alles andere … als … zu"],
    opublikovano: 33, dyv: ["verben-dass-infinitiv", "finalsaetze", "nebensaetze", "trennbare-verben", "untrennbare-verben", "reflexive-verben", "modalverben", "satzstellung-hauptsatz", "modalsaetze", "kommaregeln"] },
  { id: "indirekte-fragesaetze", rozdil: "nebensaetze", knyha: 34,
    tema: "Fragesätze als Nebensätze", uk: "Непрямі питання",
    pidrozdily: ["ob: Fragen ohne Fragewort", "Mit Fragewort: wann, warum, wie, wo …", "Fragewort mit Adjektiv oder Nomen: wie alt, welcher, was für ein", "Person oder Sache: wer, wen, wem, wessen, was", "Präposition + Person: mit wem, für wen", "Präposition + Sache: womit, wofür, worauf", "Die Satzstellung: das Verb steht am Ende", "Typische Einleitungen und Satzzeichen", "Nach einem Nomen: die Frage, ob …", "Der Fragesatz vorn – mit es und das", "ob, wenn oder dass?"],
    opublikovano: 34, dyv: ["nebensaetze", "fragen", "personalpronomen", "verben-praepositionalobjekt", "adverbien-praeposition", "trennbare-verben", "modalverben", "verben-dass-infinitiv", "konditionalsaetze", "relativsaetze", "indirekte-rede", "kommaregeln"] },
  { id: "relativsaetze", rozdil: "nebensaetze", knyha: 35,
    tema: "Relativsätze", uk: "Означальні підрядні речення",
    pidrozdily: ["Der Relativsatz erklärt ein Bezugswort", "Direkt hinter dem Bezugswort – mit Kommas", "Ausnahme: ein Verb, ein Präfix oder ein Adverb dazwischen", "Die Formen: fast wie der bestimmte Artikel", "Genus und Numerus: vom Bezugswort", "Der Kasus: aus dem Relativsatz", "Der Genitiv: dessen und deren", "Nach dessen und deren: Nomen ohne Artikel", "Präposition + Relativpronomen: mit dem, für deren …", "wo und wohin statt in + Relativpronomen", "Städte und Länder: wo, wohin – oder das", "wo bei Zeitangaben: jetzt, wo …", "wo(r) + Präposition: für den ganzen Satz", "wer, wen, wem, wessen: jeder, der …", "was nach alles, nichts, etwas, das und dem Superlativ", "was für den ganzen Satz: …, was mich freut", "was und Präposition: an das, was … – was …, daran", "Der was-Satz vorn: das, dem, dessen"],
    opublikovano: 35, dyv: ["nebensaetze", "indirekte-fragesaetze", "modalsaetze", "temporalsaetze", "demonstrativpronomen", "indefinitpronomen", "personalpronomen", "possessivartikel", "rektion-verben", "verben-praepositionalobjekt", "fragen", "satzstellung-hauptsatz", "adjektivdeklination", "komparation", "adverbien-praeposition", "kommaregeln"] },

  // ===== Прикметник і прислівник =====
  { id: "adjektivdeklination", rozdil: "adjektiv", knyha: 39,
    tema: "Deklination des Adjektivs", uk: "Відмінювання прикметників",
    pidrozdily: ["Das Grundprinzip: Einer zeigt den Kasus", "Der Hund ist klein: ohne Endung nach sein, werden, bleiben", "Mit dem bestimmten Artikel: die Formen", "Wie der bestimmte Artikel: dieser, jeder, welcher, derselbe …", "Nur im Plural: alle, beide, sämtliche, irgendwelche", "all- und einig- im Singular: alles Gute, nach einiger Zeit", "Mit dem unbestimmten Artikel: die Formen", "Plural ohne Artikel: neue Schuhe", "Nach Zahlen und nach viele, einige, mehrere …", "Mit Possessivartikeln und kein", "Ohne Artikel im Singular: die Formen", "Wann ohne Artikel? Stoffe, Getränke, Gefühle", "Guten Tag! Lieber Paul: Wünsche, Grüße und Anreden", "Nach viel, wenig, etwas, genug, mehr, allerlei", "etwas Neues, nichts Besonderes: das Adjektiv als Nomen", "Stoffe im Plural: Säfte, Papiere, Abgase", "Nach dem Genitiv: Annas neues Fahrrad; wessen, dessen, deren", "manch, solch, welch ohne Endung", "Nach Personalpronomen: du armes Kind, wir jungen Leute", "Mehrere Adjektive: dieselbe Endung", "Adjektive auf -el und -er: die dunkle Nacht, ein teures Handy", "hoch – ein hohes Haus", "Ohne Endung: rosa, lila, prima, super", "Kölner, Berliner, Schweizer: Adjektive von Städtenamen", "Alles auf einen Blick"],
    opublikovano: 39, dyv: ["artikel-gebrauch", "deklination-nomen", "possessivartikel", "demonstrativpronomen", "indefinitpronomen", "zahlwoerter", "komparation", "adjektive-als-nomen", "relativsaetze"] },
  { id: "komparation", rozdil: "adjektiv", knyha: 40,
    tema: "Komparativ und Superlativ", uk: "Ступені порівняння",
    pidrozdily: ["Drei Stufen: vor dem Nomen und beim Verb", "Der Komparativ: Adjektiv + -er", "Vergleichen: größer als – so groß wie", "Der Superlativ: der schönste – am schönsten", "Der Beste – wo, wann, von wem?", "einer der besten …: einer aus einer Gruppe", "Mit Umlaut: alt – älter – am ältesten", "Ganz anders: gut, viel, gern, hoch, nah", "mehr oder mehrere?", "Nur beim Verb: meistens, höchstens, mindestens …", "Superlativ mit -e-: am breitesten, am heißesten", "Aber ohne -e-: am größten, am spannendsten", "Adjektive auf -el und -er: dunkler, teurer"],
    opublikovano: 40, dyv: ["adjektivdeklination", "modalsaetze", "artikel-gebrauch", "indefinitpronomen", "zahlwoerter", "adjektive-als-nomen", "adverbien", "relativsaetze", "konsekutivsaetze"] },
  { id: "adjektive-als-nomen", rozdil: "adjektiv", knyha: 41,
    tema: "Adjektive und Partizipien als Nomen", uk: "Прикметники й дієприкметники в ролі іменників",
    pidrozdily: ["Groß geschrieben – dekliniert wie ein Adjektiv", "Die Formen: der Bekannte – ein Bekannter", "Im Plural: die Jugendlichen – viele Jugendliche", "das Gute, etwas Neues: Sachen und Ideen", "Aus Adjektiven: der Bekannte, der Fremde, der Deutsche", "Aus dem Partizip I: der Reisende, der Vorsitzende", "Aus dem Partizip II: der Angestellte, der Verletzte", "Achtung: die Beamtin, der Junge, der Franzose", "Allgemein gesagt: meistens maskulin"],
    opublikovano: 41, dyv: ["adjektivdeklination", "n-deklination", "deklination-nomen", "komparation", "indefinitpronomen", "partizipialkonstruktion", "perfekt-plusquamperfekt", "relativsaetze"] },
  { id: "adverbien", rozdil: "adjektiv", knyha: 42,
    tema: "Adverbien", uk: "Прислівники",
    pidrozdily: ["Adverbien werden nicht dekliniert", "Adverb vor Adverb und vor Adjektiv: sehr gut, ein sehr gutes Buch", "Vor einem Partizip: schnell wachsende Städte, ein gut erzogenes Kind", "zu + Adjektiv oder Adverb: zu spät, zu teuer", "Temporaladverbien: wann? wie oft? wie lange?", "Ohne Präposition: jeden Tag, letzte Woche, nächstes Jahr", "Adjektive als Modaladverbien: Sie singt schön – schöner", "sehr, fast, vielleicht, sicher, gar nicht: Stärke und Meinung", "-erweise: glücklicherweise, dummerweise – eine Meinung", "-halber und -falls: vorsichtshalber, notfalls, bestenfalls", "als + Adjektiv: sich als richtig erweisen", "als + Nomen: als Kind, als Schüler – im gleichen Kasus", "Lokaladverbien: wo? wohin? woher?", "hin und her: weg vom Sprecher – zum Sprecher", "Adjektive auf -ig: heute → der heutige Tag", "außen → die äußere Tür, oben → der obere Stock"],
    opublikovano: 42, dyv: ["adverbien-dativ-akkusativ", "adverbien-praeposition", "adjektivdeklination", "komparation", "partizipialkonstruktion", "satzstellung-hauptsatz", "konjunktionen-position-eins", "trennbare-verben", "artikel-gebrauch", "modalsaetze"] },
  { id: "adverbien-dativ-akkusativ", rozdil: "adjektiv", knyha: 43,
    tema: "Modale Adverbien mit Dativ bzw. Akkusativ", uk: "Прислівники з Dativ і Akkusativ",
    pidrozdily: ["Adjektive mit Dativ: Wem ist etwas …?", "Der Dativ im Satz: Stellung, zu + Adjektiv, mir ist kalt", "Maßangaben im Akkusativ: einen Meter hoch", "Zeitangaben im Akkusativ: einen Monat alt, den ganzen Tag lang"],
    opublikovano: 43, dyv: ["adverbien", "adverbien-praeposition", "rektion-verben", "personalpronomen", "possessivartikel", "n-deklination", "zahlwoerter", "komparation", "satzstellung-hauptsatz"] },
  { id: "adverbien-praeposition", rozdil: "adjektiv", knyha: 44,
    tema: "Adverbien mit Präpositionen", uk: "Прислівники з прийменниками",
    pidrozdily: ["Adjektiv + Präposition + Objekt: stolz auf", "Adjektive mit Präposition + Akkusativ", "Adjektive mit Präposition + Dativ", "gegenüber und vor: freundlich gegenüber, rot vor Wut", "Ein Adjektiv – mehrere Präpositionen: bekannt bei / für / mit", "Fragen: Worauf? – Auf wen?", "Ohne Nomen: darauf – auf ihn", "Mit dass-Satz oder Infinitiv: stolz darauf, dass …"],
    opublikovano: 44, dyv: ["adverbien", "adverbien-dativ-akkusativ", "verben-praepositionalobjekt", "rektion-verben", "personalpronomen", "fragen", "verben-dass-infinitiv", "infinitiv-um-zu", "indirekte-fragesaetze", "praep-akkusativ", "praep-dativ", "wechselpraepositionen", "kommaregeln"] },

  // ===== Прийменники =====
  { id: "praepositionen-allgemein", rozdil: "praepositionen", knyha: 57,
    tema: "Präpositionen: Allgemeine Regeln", uk: "Прийменники: загальні правила",
    pidrozdily: ["Den Kasus sieht man am Artikel", "Immer Akkusativ: bis, durch, entlang, für, gegen, ohne, um, wider", "Immer Dativ: aus, bei, mit, nach, seit, von, zu …", "Akkusativ oder Dativ: an, auf, hinter, in, neben, über, unter, vor, zwischen", "Wohin? – Richtung und Ziel: Akkusativ", "Wo? – ein fester Ort: Dativ", "Woher? – immer Dativ", "Präpositionen mit Genitiv", "Präposition statt Vorsilbe: mitkommen – mit uns kommen", "Präpositionen nach Verben und Adjektiven"],
    opublikovano: 57, dyv: ["praep-akkusativ", "praep-dativ", "wechselpraepositionen", "praep-genitiv", "legen-liegen", "trennbare-verben", "verben-praepositionalobjekt", "adverbien-praeposition", "rektion-verben", "artikel-gebrauch", "deklination-nomen", "personalpronomen", "fragen"] },
  { id: "praep-akkusativ", rozdil: "praepositionen", knyha: 58,
    tema: "Präpositionen mit dem Akkusativ", uk: "Прийменники з Akkusativ",
    pidrozdily: ["bis: ohne Artikel – und bis zu, bis an, bis auf", "durch: Ort, Mittel, Art und Weise, Zeit", "entlang: den Fluss entlang – am Fluss entlang", "für: für wen? wie lange? wie viel?", "gegen: Berührung, ungefähre Zeit, Gegner, Tausch", "ohne: meist ohne Artikel", "um: um … herum, um 8 Uhr, um 5 Grad", "wider: wider Willen, wider Erwarten"],
    opublikovano: 58, dyv: ["praepositionen-allgemein", "praep-dativ", "wechselpraepositionen", "praep-genitiv", "personalpronomen", "possessivartikel", "deklination-nomen", "artikel-gebrauch", "verben-praepositionalobjekt", "adverbien-praeposition", "trennbare-verben", "passiv", "modalsaetze", "komparation"] },
  { id: "praep-dativ", rozdil: "praepositionen", knyha: 59,
    tema: "Präpositionen mit dem Dativ", uk: "Прийменники з Dativ",
    pidrozdily: ["ab", "aus", "außer", "bei", "dank", "entgegen", "entsprechend", "gegenüber", "gemäß", "mit", "nach", "nebst", "samt", "seit", "von", "zu", "zufolge"],
    opublikovano: 59, dyv: ["praepositionen-allgemein", "praep-akkusativ", "wechselpraepositionen", "praep-genitiv", "deklination-nomen", "personalpronomen", "possessivartikel", "artikel-gebrauch", "trennbare-verben", "temporalsaetze", "finalsaetze", "infinitiv-um-zu", "passiv", "verben-praepositionalobjekt", "adverbien-praeposition"] },
  { id: "wechselpraepositionen", rozdil: "praepositionen", knyha: 60,
    tema: "Präpositionen mit Akkusativ oder Dativ", uk: "Прийменники з Akkusativ або Dativ",
    pidrozdily: ["Wohin? – Akkusativ, wo? – Dativ", "an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen", "Zeitangaben: an oder in?"],
    opublikovano: 60, dyv: ["praepositionen-allgemein", "praep-akkusativ", "praep-dativ", "praep-genitiv", "legen-liegen", "artikel-gebrauch", "deklination-nomen", "personalpronomen", "verben-praepositionalobjekt", "adverbien-praeposition", "trennbare-verben", "zahlwoerter", "funktionsverbgefuege", "konjunktiv-2-gebrauch"] },
  { id: "praep-genitiv", rozdil: "praepositionen", knyha: 61,
    tema: "Präpositionen mit dem Genitiv", uk: "Прийменники з Genitiv",
    pidrozdily: ["Die Formen: des Weges, der Stadt, der Ferien", "Ohne Artikel: von + Dativ", "Zeit: während, innerhalb, außerhalb, binnen, anlässlich, zeit", "Ort: innerhalb, außerhalb, oberhalb, unterhalb, diesseits, jenseits", "Ort: abseits, beiderseits, inmitten, längs, unweit, seitens", "Grund: wegen, aufgrund, infolge, angesichts", "Grund und Quelle: halber, kraft, laut, zufolge, zugunsten", "wegen mit Dativ? meinetwegen, deinetwegen", "Gegengrund: trotz, ungeachtet", "Ersatz: statt, anstatt, anstelle", "Mittel: anhand, mithilfe, mittels, vermöge", "Zweck: zwecks, um … willen", "Präposition oder Nebensatz?", "Alle Präpositionen im Überblick"],
    opublikovano: 61, dyv: ["praepositionen-allgemein", "praep-akkusativ", "praep-dativ", "wechselpraepositionen", "deklination-nomen", "n-deklination", "adjektivdeklination", "personalpronomen", "temporalsaetze", "kausalsaetze", "konzessivsaetze", "modalsaetze", "finalsaetze", "infinitiv-um-zu", "artikel-gebrauch"] },

  // ===== Пасив =====
  { id: "passiv", rozdil: "passiv", knyha: 19,
    tema: "Das Passiv", uk: "Пасив",
    pidrozdily: ["Präsens und Präteritum: wird gemacht – wurde gemacht", "Perfekt und Plusquamperfekt: ist … worden", "worden oder geworden?", "Handlung oder Ergebnis: ist geöffnet worden – ist geöffnet", "Wann Passiv? Die Handlung im Vordergrund", "Aus dem Akkusativ wird der Nominativ", "Wer macht es? von + Dativ", "Passiv ohne Subjekt: Es wird getanzt", "es als Platzhalter: Es wurden viele Fotos gemacht", "Passiv im Nebensatz", "Passiv mit Modalverben: muss gemacht werden", "Modalverb im Perfekt und im Nebensatz", "Statt können + Passiv: ist zu …, -bar, sich lassen", "Passiv mit zu: eingeladen zu werden", "Vorher passiert: gefragt worden zu sein"],
    opublikovano: 19, dyv: ["konjugation", "perfekt-plusquamperfekt", "modalverben", "rektion-verben", "reflexive-verben", "verben-dass-infinitiv", "nebensaetze", "zustandspassiv", "haben-sein-zu", "modalverben-subjektiv", "konjunktiv-2-formen", "starke-verben"] },
  { id: "zustandspassiv", rozdil: "passiv", knyha: 45,
    tema: "Das Zustandspassiv", uk: "Пасив стану",
    pidrozdily: ["Vorgang oder Zustand? wird geschlossen – ist geschlossen", "Die Bildung: sein + Partizip II", "Nur zwei Zeiten: ist geschlossen – war geschlossen", "Keine handelnde Person: Wie ist es jetzt?", "Adverbial und attributiv: Die Tür ist geschlossen – die geschlossene Tür", "Im Alltag: Das ist schon erledigt!", "Nicht verwechseln: ist gefahren – ist geschlossen – ist geschlossen worden"],
    opublikovano: 45, dyv: ["passiv", "perfekt-plusquamperfekt", "konjugation", "trennbare-verben", "adjektivdeklination", "demonstrativpronomen", "partizipialkonstruktion", "haben-sein-zu", "starke-verben"] },
  { id: "haben-sein-zu", rozdil: "passiv", knyha: 48,
    tema: "haben und sein + Infinitiv mit zu", uk: "haben і sein + zu + інфінітив",
    pidrozdily: ["haben + zu: Jemand muss etwas tun", "sein + zu: Etwas muss getan werden", "sein + zu: Etwas kann (nicht) getan werden", "Die Form: zu-Infinitiv und Satzbau", "Achtung, unhöflich: haben + Infinitiv Passiv", "nichts, etwas, viel + zu: Ich habe dir nichts zu sagen", "Passiversatz: drei Wege, eine Bedeutung", "Adjektive auf -bar und -lich", "sich lassen + Infinitiv ohne zu", "Ohne Subjekt: es nur auf Position I"],
    opublikovano: 48, dyv: ["passiv", "zustandspassiv", "modalverben", "reflexive-verben", "trennbare-verben", "untrennbare-verben", "verben-dass-infinitiv", "infinitiv-um-zu", "indefinitpronomen", "nebensaetze", "gerundivum"] },
  { id: "gerundivum", rozdil: "passiv", knyha: 49,
    tema: "Das Gerundivum", uk: "Gerundivum",
    pidrozdily: ["Eine Bedeutung, vier Formen", "Können oder müssen?", "Passive Bedeutung mit Partizip I", "Die Bildung: zu + Partizip I", "Wie ein Adjektiv: Endungen – und nie nach sein", "Erweiterungen und ein zweites Adjektiv", "Umformen: Relativsatz ↔ Gerundivum"],
    opublikovano: 49, dyv: ["haben-sein-zu", "partizipialkonstruktion", "passiv", "zustandspassiv", "relativsaetze", "adjektivdeklination", "trennbare-verben", "untrennbare-verben", "modalverben", "infinitiv-um-zu", "partizipialsaetze"] },

  // ===== Кон'юнктив =====
  { id: "konjunktiv", rozdil: "konjunktiv", knyha: 52,
    tema: "Der Konjunktiv", uk: "Кон'юнктив: огляд",
    pidrozdily: ["Indikativ und Konjunktiv: Wirklichkeit oder Möglichkeit", "Konjunktiv I: die indirekte Rede", "Konjunktiv II: das Irreale", "Gegenwart und Vergangenheit im Konjunktiv", "Konjunktiv II statt Konjunktiv I"],
    opublikovano: 52, dyv: ["konjunktiv-2-formen", "konjunktiv-2-gebrauch", "konjunktiv-1-formen", "indirekte-rede", "konditionalsaetze", "modalverben-subjektiv", "perfekt-plusquamperfekt", "tempusformen", "starke-verben"] },
  { id: "konjunktiv-2-formen", rozdil: "konjunktiv", knyha: 53,
    tema: "Der Konjunktiv II: Verbformen", uk: "Konjunktiv II: форми",
    pidrozdily: ["Die Endungen: -e, -est, -e, -en, -et, -en", "Starke Verben: Präteritum + Umlaut", "Schwache Verben: wie das Präteritum", "Mit Umlaut: haben, werden, Modalverben, wissen, denken, bringen", "Seltene Formen und würde + Infinitiv", "Vergangenheit: hätte oder wäre + Partizip II", "Drei Zeiten im Indikativ – eine im Konjunktiv II", "Das Passiv im Konjunktiv II", "Modalverben in der Vergangenheit: hätte … machen können", "Im Nebensatz: …, weil er hätte kommen können"],
    opublikovano: 53, dyv: ["konjunktiv", "konjunktiv-2-gebrauch", "konjunktiv-1-formen", "indirekte-rede", "starke-verben", "tempusformen", "perfekt-plusquamperfekt", "modalverben", "modalverben-subjektiv", "passiv", "konditionalsaetze", "nebensaetze"] },
  { id: "konjunktiv-2-gebrauch", rozdil: "konjunktiv", knyha: 54,
    tema: "Gebrauch des Konjunktivs II", uk: "Konjunktiv II: вживання",
    pidrozdily: ["Irreale Wunschsätze", "Irreale Bedingungssätze", "sonst, andernfalls und „Es wäre besser, …“", "würde + Infinitiv", "Irreale Vergleichssätze", "Irreale Folgesätze", "beinahe, fast – Wirklichkeit oder Vorstellung?", "Höfliche Bitten und zweifelnde Fragen", "Vorsichtige Vermutung und weitere Fälle"],
    opublikovano: 54, dyv: ["konjunktiv", "konjunktiv-2-formen", "konditionalsaetze", "konsekutivsaetze", "modalsaetze", "infinitiv-um-zu", "modalverben-subjektiv", "modalverben", "perfekt-plusquamperfekt", "relativsaetze", "komparation", "indirekte-rede", "starke-verben"] },
  { id: "konjunktiv-1-formen", rozdil: "konjunktiv", knyha: 55,
    tema: "Der Konjunktiv I: Verbformen", uk: "Konjunktiv I: форми",
    pidrozdily: ["Die Endungen: Infinitivstamm + -e, -est, -e, -en, -et, -en", "Gegenwart: starke und schwache Verben, Modal- und Hilfsverben", "Gleich wie der Indikativ? Dann Konjunktiv II", "Konjunktiv II wie das Präteritum? Dann würde + Infinitiv", "Kein Vokalwechsel: du gebest, er gebe", "Die Ausnahme: sein", "Zukunft und Vermutung: werde + Infinitiv", "Vergangenheit: habe oder sei + Partizip II", "Das Passiv im Konjunktiv I"],
    opublikovano: 55, dyv: ["konjunktiv", "konjunktiv-2-formen", "indirekte-rede", "konjunktiv-2-gebrauch", "konjugation", "starke-verben", "modalverben", "futur", "perfekt-plusquamperfekt", "passiv", "tempusformen"] },
  { id: "indirekte-rede", rozdil: "konjunktiv", knyha: 56,
    tema: "Gebrauch des Konjunktivs I: indirekte Rede", uk: "Непряма мова",
    pidrozdily: ["Wozu Konjunktiv I? Distanz zur direkten Rede", "Mit oder ohne dass: die Einleitung", "Pronomen: Wer spricht, zu wem, wer berichtet?", "Anreden und Ausrufe fallen weg: bejahen, ablehnen, danken", "Ort und Zeit: aus morgen wird am nächsten Tag", "Welche Form? Konjunktiv I, Konjunktiv II oder würde", "Vergangenheit und Zukunft: habe gemacht, sei gefahren, werde kommen", "Die indirekte Frage: ob oder Fragewort", "Der Imperativ: mögen und sollen", "Konjunktiv I als Aufforderung: Es lebe …, Man nehme …", "Satzzeichen: Doppelpunkt, Anführungszeichen, ? und ! fallen weg"],
    opublikovano: 56, dyv: ["konjunktiv", "konjunktiv-1-formen", "konjunktiv-2-formen", "konjunktiv-2-gebrauch", "indirekte-fragesaetze", "nebensaetze", "verben-dass-infinitiv", "personalpronomen", "possessivartikel", "imperativ", "modalverben", "perfekt-plusquamperfekt", "futur", "kommaregeln"] },

  // ===== Дієприкметникові звороти й означення =====
  { id: "partizipialkonstruktion", rozdil: "attribute", knyha: 46,
    tema: "Die Partizipialkonstruktion", uk: "Дієприкметникові звороти",
    pidrozdily: ["Partizip I und Partizip II als Attribut", "Reflexive Verben: sich nähernd – verliebt", "Die Erweiterung: mehr Informationen vor dem Partizip", "Zwischen Artikel und Nomen – oder ohne Artikel", "Noch ein Adjektiv: davor oder danach", "Transitive Verben, Partizip I: aktiv und gleichzeitig", "Transitive Verben, Partizip II: passiv", "Intransitive Verben mit sein: ankommend – angekommen", "Intransitive Verben mit haben: nur Partizip I", "Mit dem Zustandspassiv: das seit Wochen geschlossene Bad", "Auch Adjektive: der bei allen beliebte Lehrer", "Umformen: Relativsatz ↔ Partizipialkonstruktion"],
    opublikovano: 46, dyv: ["relativsaetze", "adjektivdeklination", "konjugation", "reflexive-verben", "legen-liegen", "perfekt-plusquamperfekt", "passiv", "zustandspassiv", "adjektive-als-nomen", "adverbien", "adverbien-praeposition", "adverbien-dativ-akkusativ", "partizipialsaetze", "gerundivum"] },
  { id: "partizipialsaetze", rozdil: "attribute", knyha: 47,
    tema: "Partizipialsätze", uk: "Дієприкметникові речення",
    pidrozdily: ["Ein Satzglied, das zum Subjekt gehört", "Die Bildung: Partizip ohne Endung, Erweiterungen davor", "Im Hauptsatz: Position I oder III (IV)", "Im Nebensatz: hinter dem Subjekt", "Partizip I: aktiv und gleichzeitig", "Partizip II: passiv und meist vorzeitig", "Partizip II mit sein: aktiv und vorzeitig", "Direkt hinter dem Nomen", "Ohne seiend und habend", "Umformen: Partizipialsatz und Nebensatz"],
    opublikovano: 47, dyv: ["partizipialkonstruktion", "adjektive-als-nomen", "relativsaetze", "nebensaetze", "temporalsaetze", "kausalsaetze", "konditionalsaetze", "finalsaetze", "modalsaetze", "satzstellung-hauptsatz", "passiv", "zustandspassiv", "perfekt-plusquamperfekt", "reflexive-verben", "konjugation", "appositionen", "kommaregeln"] },
  { id: "appositionen", rozdil: "attribute", knyha: 50,
    tema: "Appositionen", uk: "Прикладки",
    pidrozdily: ["Was ist eine Apposition?", "Gleicher Kasus wie das Nomen", "Mehrere Appositionen", "Apposition mit als", "Apposition mit wie", "Datumsangaben"],
    opublikovano: 50, dyv: ["partizipialkonstruktion", "partizipialsaetze", "relativsaetze", "deklination-nomen", "n-deklination", "adjektivdeklination", "possessivartikel", "artikel-gebrauch", "komparation", "temporalsaetze", "zahlwoerter", "satzstellung-hauptsatz", "praep-dativ", "praep-akkusativ", "praep-genitiv", "kommaregeln"] },
  { id: "rangattribute", rozdil: "attribute", knyha: 51,
    tema: "Rangattribute", uk: "Підсилювальні означення (Rangattribute)",
    pidrozdily: ["Was sind Rangattribute?", "Eine Position im Satz: Sogar ihrem Freund hat sie nichts gesagt", "Vor dem Satzglied – auch vor Artikel und Präposition", "Die Bedeutungen im Überblick", "nicht …, sondern: nur ein Satzglied verneinen", "nur, erst, schon: mit Zahlen und Zeitangaben", "auch Tim – Tim auch: die Stellung ändert den Sinn", "selbst: sogar oder persönlich?", "allein: nur oder ohne andere?", "Rangattribut oder Adverb? gerade, schon, besonders, erst"],
    opublikovano: 51, dyv: ["satzstellung-hauptsatz", "konjunktionen-position-null", "konjunktionen-position-eins", "fragen", "demonstrativpronomen", "adverbien", "appositionen"] },

  // ===== Довідка =====
  { id: "kommaregeln", rozdil: "anhang", knyha: null,
    tema: "Die wichtigsten Kommaregeln", uk: "Основні правила вживання коми",
    pidrozdily: ["Ein Komma wird gesetzt", "In Kommas eingeschlossen", "Kommas, die entfallen können"] },
  { id: "starke-verben", rozdil: "anhang", knyha: null,
    tema: "Liste der starken und unregelmäßigen Verben", uk: "Таблиця сильних і неправильних дієслів",
    pidrozdily: [] }
];
