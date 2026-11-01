/* =================================================================
   pidruchnyky-data.js — розділ «Підручники»: УСІ книжки та їхній зміст.
   Окремий від «Моїх класів» (lessons-data.js / glossary-data.js — їх
   цей розділ не чіпає). Правила — README («Підручники») і BOOK-BRIEF.md.

   ОДИН ЗАПИС = ОДИН ПІДРУЧНИК (одне видання). Поля книжки:
     id          — латиницею, стає адресою: pidruchnyky/<id>/…
                   ПІСЛЯ ПУБЛІКАЦІЇ НЕ ПЕРЕЙМЕНОВУВАТИ (зламаються посилання
                   і пошук Google).
     nazva       — назва ТОЧНО як на титулі (її шукають у Google).
     nazvaKorotko— коротко для крихт, бейджа і списку («Сотникова, 5 клас»).
     pidnazva    — (необов'язково) уточнення видання: рік навчання тощо.
     klas        — «5 клас» | null (для курсів для дорослих — рівень).
     riven       — (необов'язково) рівень за CEFR: "A1.1", "B1"…
     avtory, vydavnytstvo, rik, isbn — як на титулі.
     aliasy      — інші назви, за якими книжку шукають (для пошуку на сайті).
     rivni       — як книжка САМА називає свої рівні: ["Lektion", "Modul"].
     audio       — (необов'язково) офіційна сторінка видавця, де СПРАВДІ
                   лежать аудіозаписи до книжки: {nazva, url}. ЛИШЕ сайт
                   видавця. Інтерактивні додатки, «онлайн-підтримка» без
                   аудіо, неповні добірки — НЕ ставити (див. CHANGELOG).
     opys        — (необов'язково) опис хаба для Google; без нього робот
                   складе опис сам з полів вище.
     rozdily     — зміст книжки, дерево будь-якої глибини (нижче).

   РОЗДІЛ (вузол дерева):
     id          — унікальний у межах книжки, латиницею; стає назвою
                   файлу pidruchnyky/<id книжки>/<id розділу>.html.
                   ПІСЛЯ ПУБЛІКАЦІЇ НЕ ПЕРЕЙМЕНОВУВАТИ.
     label       — позначка з книжки: "1", "A" (може бути "").
     nazva       — назва з книжки (мовою книжки).
     storinky    — сторінки у виданні: "6–10".
     dity        — підрозділи (масив таких самих вузлів), якщо є.
     typ         — є лише в тих розділів, що отримують СТОРІНКУ на сайті:
                   "vpravy"       Wörter → Üb. → Fertig!
                   "chytannya"    Wörter → Text (власний) → Üb. → Fertig!
                   "gramatyka"    Üb. → Fertig! + посилання на тему «Граматики»
                   "povtorennya"  Wörter усіх сусідніх розділів → Üb. → Fertig!
                   "bez-storinky" сторінки немає, у змісті — сірим
     opublikovano— порядковий номер публікації (1, 2, 3…), як у граматиці.
                   Без нього розділ показується як «готується». Найбільший
                   номер у книжці = мітка «нове».
     gram        — (необов'язково) id тем з grammar-data.js.
     audio       — (необов'язково) {url, treky}: сторінка видавця з аудіо
                   саме до цього розділу і номери треків. Лише якщо там
                   справді аудіо цього розділу.
     opys        — (необов'язково) власний опис для Google.

   Новий підручник — новий запис у КІНЕЦЬ масиву. Записи книжок і розділів
   редагуються вставками (opublikovano, audio…), тому перед правкою —
   свіжа копія з GitHub (урок інциденту з Уроком 18, CHANGELOG).
   ================================================================= */

const PIDRUCHNYKY = [
  {
    id: "sotnykova-5-klas-5-rik",
    nazva: "Німецька мова (5-й рік навчання)",
    nazvaDe: "Deutsch (5. Lernjahr)",
    nazvaKorotko: "Сотникова, Гоголєва · 5 клас",
    pidnazva: "підручник для 5 класу (з аудіосупроводом), 5-й рік навчання",
    klas: "5 клас",
    riven: null,
    avtory: ["Світлана Сотникова", "Ганна Гоголєва"],
    vydavnytstvo: "Ранок",
    rik: 2022,
    isbn: null,
    aliasy: ["Сотникова 5 клас", "Сотникова Гоголєва 5 клас", "німецька мова 5 клас Сотникова", "Deutsch 5 Sotnykova"],
    rivni: ["Lektion", "Modul"],
    audio: null, // у «Ранку» за QR-кодами — інтерактивний додаток лише до перших Lektion, без окремих аудіо
    rozdily: [
      { id: "l1", label: "1", nazva: "Leute, die ich mag", storinky: "5–26", dity: [
        { id: "l1-a", label: "A", nazva: "Meine Familie", storinky: "6–10", typ: "vpravy", gram: ["possessivartikel"], opublikovano: 1 },
        { id: "l1-b", label: "B", nazva: "Berufe", storinky: "11–15", typ: "vpravy", gram: ["wechselpraepositionen"], opublikovano: 2 },
        { id: "l1-c", label: "C", nazva: "Beste Freunde", storinky: "16–21", typ: "vpravy", gram: ["deklination-nomen", "n-deklination"], opublikovano: 3 },
        { id: "l1-d", label: "D", nazva: "Wiederholung", storinky: "22–23", typ: "povtorennya", gram: ["possessivartikel", "deklination-nomen"], opublikovano: 4 },
        { id: "l1-e", label: "E", nazva: "Geschichtenzeit", storinky: "24", typ: "chytannya", opublikovano: 5 },
        { id: "l1-f", label: "F", nazva: "Projektarbeit", storinky: "25", typ: "bez-storinky" },
        { id: "l1-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "26", typ: "bez-storinky" }
      ] },
      { id: "l2", label: "2", nazva: "Lerne was, so kannst du was", storinky: "27–48", dity: [
        { id: "l2-a", label: "A", nazva: "Stundenplan", storinky: "28–33", typ: "vpravy", gram: ["modalverben", "zahlwoerter"], opublikovano: 6 },
        { id: "l2-b", label: "B", nazva: "In der Deutschstunde", storinky: "34–38", typ: "vpravy", gram: ["imperativ"], opublikovano: 7 },
        { id: "l2-c", label: "C", nazva: "Mein Tagesablauf", storinky: "39–43", typ: "vpravy", gram: ["reflexive-verben"], opublikovano: 8 },
        { id: "l2-d", label: "D", nazva: "Wiederholung", storinky: "44–45", typ: "povtorennya", gram: ["modalverben", "imperativ", "reflexive-verben"], opublikovano: 9 },
        { id: "l2-e", label: "E", nazva: "Geschichtenzeit", storinky: "46", typ: "chytannya", opublikovano: 10 },
        { id: "l2-f", label: "F", nazva: "Projektarbeit", storinky: "47", typ: "bez-storinky" },
        { id: "l2-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "48", typ: "bez-storinky" }
      ] },
      { id: "l3", label: "3", nazva: "Ach, du tolle Freizeit!", storinky: "49–66", dity: [
        { id: "l3-a", label: "A", nazva: "Interessen und Hobbys", storinky: "50–53", typ: "vpravy", gram: ["trennbare-verben", "untrennbare-verben"], opublikovano: 11 },
        { id: "l3-b", label: "B", nazva: "Am Wochenende", storinky: "54–57", typ: "vpravy", gram: ["perfekt-plusquamperfekt"], opublikovano: 12 },
        { id: "l3-c", label: "C", nazva: "In den Ferien", storinky: "58–61", typ: "vpravy", gram: ["perfekt-plusquamperfekt", "starke-verben"], opublikovano: 13 },
        { id: "l3-d", label: "D", nazva: "Wiederholung", storinky: "62–63", typ: "povtorennya", gram: ["trennbare-verben", "perfekt-plusquamperfekt", "starke-verben"], opublikovano: 14 },
        { id: "l3-e", label: "E", nazva: "Geschichtenzeit", storinky: "64", typ: "chytannya", opublikovano: 15 },
        { id: "l3-f", label: "F", nazva: "Projektarbeit", storinky: "65", typ: "bez-storinky" },
        { id: "l3-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "66", typ: "bez-storinky" }
      ] },
      { id: "l4", label: "4", nazva: "Feiern bringt Freude", storinky: "67–82", dity: [
        { id: "l4-a", label: "A", nazva: "Lieblingsfeste", storinky: "68–72", typ: "vpravy", gram: ["zahlwoerter", "konjunktionen-position-null"], opublikovano: 16 },
        { id: "l4-b", label: "B", nazva: "Weihnachten und Silvester", storinky: "73–77", typ: "vpravy", gram: ["praep-dativ"], opublikovano: 17 },
        { id: "l4-c", label: "C", nazva: "Wiederholung", storinky: "78–79", typ: "povtorennya", gram: ["zahlwoerter", "konjunktionen-position-null", "praep-dativ"], opublikovano: 18 },
        { id: "l4-d", label: "D", nazva: "Geschichtenzeit", storinky: "80", typ: "chytannya", opublikovano: 19 },
        { id: "l4-e", label: "E", nazva: "Projektarbeit", storinky: "81", typ: "bez-storinky" },
        { id: "l4-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "82", typ: "bez-storinky" }
      ] },
      { id: "l5", label: "5", nazva: "Kleider machen Leute", storinky: "83–96", dity: [
        { id: "l5-a", label: "A", nazva: "Kleidung und Mode", storinky: "84–87", typ: "vpravy", gram: ["adjektivdeklination"], opublikovano: 20 },
        { id: "l5-b", label: "B", nazva: "Kleidung kaufen", storinky: "88–91", typ: "vpravy", gram: ["demonstrativpronomen", "fragen"], opublikovano: 21 },
        { id: "l5-c", label: "C", nazva: "Wiederholung", storinky: "92–93", typ: "povtorennya", gram: ["adjektivdeklination", "demonstrativpronomen"], opublikovano: 22 },
        { id: "l5-d", label: "D", nazva: "Geschichtenzeit", storinky: "94", typ: "chytannya", opublikovano: 23 },
        { id: "l5-e", label: "E", nazva: "Projektarbeit", storinky: "95", typ: "bez-storinky" },
        { id: "l5-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "96", typ: "bez-storinky" }
      ] },
      { id: "l6", label: "6", nazva: "Guten Appetit!", storinky: "97–114", dity: [
        { id: "l6-a", label: "A", nazva: "Lieblingsessen", storinky: "98–101", typ: "vpravy", gram: ["artikel-gebrauch"], opublikovano: 24 },
        { id: "l6-b", label: "B", nazva: "Leckere Spezialitäten", storinky: "102–105", typ: "vpravy", gram: ["artikel-gebrauch"], opublikovano: 25 },
        { id: "l6-c", label: "C", nazva: "Cafébesuch", storinky: "106–109", typ: "vpravy", opublikovano: 26 },
        { id: "l6-d", label: "D", nazva: "Wiederholung", storinky: "110–111", typ: "povtorennya", gram: ["artikel-gebrauch"], opublikovano: 27 },
        { id: "l6-e", label: "E", nazva: "Geschichtenzeit", storinky: "112", typ: "chytannya", opublikovano: 28 },
        { id: "l6-f", label: "F", nazva: "Projektarbeit", storinky: "113", typ: "bez-storinky" },
        { id: "l6-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "114", typ: "bez-storinky" }
      ] },
      { id: "l7", label: "7", nazva: "Entdecke die Welt!", storinky: "115–134", dity: [
        { id: "l7-a", label: "A", nazva: "Reiseziele und Verkehr", storinky: "116–120", typ: "vpravy", gram: ["praep-dativ", "komparation"], opublikovano: 29 },
        { id: "l7-b", label: "B", nazva: "Deutschlandreise", storinky: "121–125", typ: "vpravy", gram: ["nebensaetze", "indirekte-fragesaetze"], opublikovano: 30 },
        { id: "l7-c", label: "C", nazva: "Willkommen in der Ukraine", storinky: "126–129", typ: "vpravy", opublikovano: 31 },
        { id: "l7-d", label: "D", nazva: "Wiederholung", storinky: "130–131", typ: "povtorennya", gram: ["praep-dativ", "nebensaetze"], opublikovano: 32 },
        { id: "l7-e", label: "E", nazva: "Geschichtenzeit", storinky: "132", typ: "chytannya", opublikovano: 33 },
        { id: "l7-f", label: "F", nazva: "Projektarbeit", storinky: "133", typ: "bez-storinky" },
        { id: "l7-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "134", typ: "bez-storinky" }
      ] },
      { id: "l8", label: "8", nazva: "Hey Freunde, raus in die Natur!", storinky: "135–148", dity: [
        { id: "l8-a", label: "A", nazva: "Die Natur erkunden", storinky: "136–139", typ: "vpravy", gram: ["imperativ"], opublikovano: 34 },
        { id: "l8-b", label: "B", nazva: "Jahreszeiten und Wetter", storinky: "140–143", typ: "vpravy", gram: ["komparation"], opublikovano: 35 },
        { id: "l8-c", label: "C", nazva: "Wiederholung", storinky: "144–145", typ: "povtorennya", gram: ["imperativ", "komparation"], opublikovano: 36 },
        { id: "l8-d", label: "D", nazva: "Geschichtenzeit", storinky: "146", typ: "chytannya", opublikovano: 37 },
        { id: "l8-e", label: "E", nazva: "Projektarbeit", storinky: "147", typ: "bez-storinky" },
        { id: "l8-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "148", typ: "bez-storinky" }
      ] },
      { id: "anhang", label: "", nazva: "Anhang", storinky: "149–192", dity: [
        { id: "anhang-grammatik", label: "", nazva: "Grammatik", storinky: "149–160", typ: "bez-storinky" },
        { id: "anhang-verben", label: "", nazva: "Unregelmäßige Verben", storinky: "161–162", typ: "gramatyka", gram: ["starke-verben", "perfekt-plusquamperfekt"], opublikovano: 38 },
        { id: "anhang-woerter", label: "", nazva: "Deutsch-Ukrainisches Wörterverzeichnis", storinky: "163–192", typ: "bez-storinky" }
      ] }
    ]
  },
  {
    id: "sotnykova-6-klas-6-rik",
    nazva: "Німецька мова (6-й рік навчання)",
    nazvaDe: "Deutsch (6. Lernjahr)",
    nazvaKorotko: "Сотникова, Гоголєва · 6 клас",
    pidnazva: "підручник для 6 класу (з аудіосупроводом), 6-й рік навчання",
    klas: "6 клас",
    riven: null,
    avtory: ["Світлана Сотникова", "Ганна Гоголєва"],
    vydavnytstvo: "Ранок",
    rik: 2023,
    isbn: "978-617-09-8234-6",
    aliasy: ["Сотникова 6 клас", "Сотникова Гоголєва 6 клас", "німецька мова 6 клас Сотникова", "Deutsch 6 Sotnykova"],
    rivni: ["Lektion", "Modul"],
    audio: null,
    rozdily: [
      { id: "l1", label: "1", nazva: "Familie und Freunde", storinky: "5–26", dity: [
        { id: "l1-a", label: "A", nazva: "Meine Verwandten", storinky: "6–11", typ: "vpravy", gram: ["deklination-nomen", "n-deklination", "zahlwoerter"], opublikovano: 1 },
        { id: "l1-b", label: "B", nazva: "Wir sind alle ganz verschieden", storinky: "12–16", typ: "vpravy", gram: ["adjektivdeklination"], opublikovano: 2 },
        { id: "l1-c", label: "C", nazva: "Meine Freunde", storinky: "17–21", typ: "vpravy", gram: ["adjektivdeklination"], opublikovano: 3 },
        { id: "l1-d", label: "D", nazva: "Wiederholung", storinky: "22–23", typ: "povtorennya", gram: ["deklination-nomen", "adjektivdeklination", "zahlwoerter"], opublikovano: 4 },
        { id: "l1-e", label: "E", nazva: "Geschichtenzeit", storinky: "24", typ: "chytannya", opublikovano: 5 },
        { id: "l1-f", label: "F", nazva: "Projektarbeit", storinky: "25", typ: "bez-storinky" },
        { id: "l1-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "26", typ: "bez-storinky" }
      ] },
      { id: "l2", label: "2", nazva: "Einkaufen macht Spaß", storinky: "27–50", dity: [
        { id: "l2-a", label: "A", nazva: "Hier macht man Einkäufe", storinky: "28–33", typ: "vpravy", gram: ["infinitiv-um-zu"], opublikovano: 6 },
        { id: "l2-b", label: "B", nazva: "Passt das gut zusammen?", storinky: "34–39", typ: "vpravy", gram: ["fragen", "demonstrativpronomen", "adjektivdeklination"], opublikovano: 7 },
        { id: "l2-c", label: "C", nazva: "Lebensmittel kaufen", storinky: "40–44", typ: "vpravy", gram: ["kausalsaetze"], opublikovano: 8 },
        { id: "l2-d", label: "D", nazva: "Wiederholung", storinky: "45–47", typ: "povtorennya", gram: ["infinitiv-um-zu", "adjektivdeklination", "kausalsaetze"], opublikovano: 9 },
        { id: "l2-e", label: "E", nazva: "Geschichtenzeit", storinky: "48", typ: "chytannya", opublikovano: 10 },
        { id: "l2-f", label: "F", nazva: "Projektarbeit", storinky: "49", typ: "bez-storinky" },
        { id: "l2-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "50", typ: "bez-storinky" }
      ] },
      { id: "l3", label: "3", nazva: "Essen und Trinken", storinky: "51–72", dity: [
        { id: "l3-a", label: "A", nazva: "Das schmeckt gut", storinky: "52–57", typ: "vpravy", gram: ["adjektivdeklination"], opublikovano: 11 },
        { id: "l3-b", label: "B", nazva: "Internationale Küche", storinky: "58–61", typ: "vpravy", gram: ["adjektivdeklination"], opublikovano: 12 },
        { id: "l3-c", label: "C", nazva: "Wir gehen essen", storinky: "62–66", typ: "vpravy", gram: ["indefinitpronomen", "kausalsaetze"], opublikovano: 13 },
        { id: "l3-d", label: "D", nazva: "Wiederholung", storinky: "67–69", typ: "povtorennya", gram: ["adjektivdeklination", "indefinitpronomen"], opublikovano: 14 },
        { id: "l3-e", label: "E", nazva: "Geschichtenzeit", storinky: "70", typ: "chytannya", opublikovano: 15 },
        { id: "l3-f", label: "F", nazva: "Projektarbeit", storinky: "71", typ: "bez-storinky" },
        { id: "l3-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "72", typ: "bez-storinky" }
      ] },
      { id: "l4", label: "4", nazva: "Sport ist gesund", storinky: "73–88", dity: [
        { id: "l4-a", label: "A", nazva: "Wir machen Sport", storinky: "74–78", typ: "vpravy", gram: ["infinitiv-um-zu", "perfekt-plusquamperfekt"], opublikovano: 16 },
        { id: "l4-b", label: "B", nazva: "Lieblingssportarten", storinky: "79–83", typ: "vpravy" },
        { id: "l4-c", label: "C", nazva: "Wiederholung", storinky: "84–85", typ: "povtorennya", gram: ["infinitiv-um-zu", "perfekt-plusquamperfekt"] },
        { id: "l4-d", label: "D", nazva: "Geschichtenzeit", storinky: "86", typ: "chytannya" },
        { id: "l4-e", label: "E", nazva: "Projektarbeit", storinky: "87", typ: "bez-storinky" },
        { id: "l4-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "88", typ: "bez-storinky" }
      ] },
      { id: "l5", label: "5", nazva: "Unser Schulleben", storinky: "89–108", dity: [
        { id: "l5-a", label: "A", nazva: "Nach den Winterferien", storinky: "90–93", typ: "vpravy", gram: ["perfekt-plusquamperfekt"] },
        { id: "l5-b", label: "B", nazva: "Schule und Schulfächer", storinky: "94–98", typ: "vpravy", gram: ["indefinitpronomen"] },
        { id: "l5-c", label: "C", nazva: "In den Stunden", storinky: "99–103", typ: "vpravy", gram: ["finalsaetze", "infinitiv-um-zu"] },
        { id: "l5-d", label: "D", nazva: "Wiederholung", storinky: "104–105", typ: "povtorennya", gram: ["perfekt-plusquamperfekt", "indefinitpronomen", "finalsaetze"] },
        { id: "l5-e", label: "E", nazva: "Geschichtenzeit", storinky: "106", typ: "chytannya" },
        { id: "l5-f", label: "F", nazva: "Projektarbeit", storinky: "107", typ: "bez-storinky" },
        { id: "l5-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "108", typ: "bez-storinky" }
      ] },
      { id: "l6", label: "6", nazva: "Reiselust und Abenteuer", storinky: "109–128", dity: [
        { id: "l6-a", label: "A", nazva: "Verkehr und Reiseziele", storinky: "110–114", typ: "vpravy", gram: ["praep-dativ", "wechselpraepositionen"] },
        { id: "l6-b", label: "B", nazva: "Reisevorbereitungen", storinky: "115–119", typ: "vpravy", gram: ["praep-akkusativ"] },
        { id: "l6-c", label: "C", nazva: "Reiseeindrücke", storinky: "120–123", typ: "vpravy", gram: ["tempusformen", "starke-verben"] },
        { id: "l6-d", label: "D", nazva: "Wiederholung", storinky: "124–125", typ: "povtorennya", gram: ["praep-dativ", "praep-akkusativ", "tempusformen"] },
        { id: "l6-e", label: "E", nazva: "Geschichtenzeit", storinky: "126", typ: "chytannya" },
        { id: "l6-f", label: "F", nazva: "Projektarbeit", storinky: "127", typ: "bez-storinky" },
        { id: "l6-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "128", typ: "bez-storinky" }
      ] },
      { id: "l7", label: "7", nazva: "Herzlich willkommen in Deutschland", storinky: "129–144", dity: [
        { id: "l7-a", label: "A", nazva: "Deutschland — Land und Leute", storinky: "130–133", typ: "vpravy" },
        { id: "l7-b", label: "B", nazva: "Wir reisen nach Berlin", storinky: "134–139", typ: "vpravy", gram: ["temporalsaetze"] },
        { id: "l7-c", label: "C", nazva: "Wiederholung", storinky: "140–141", typ: "povtorennya", gram: ["temporalsaetze", "tempusformen"] },
        { id: "l7-d", label: "D", nazva: "Geschichtenzeit", storinky: "142", typ: "chytannya" },
        { id: "l7-e", label: "E", nazva: "Projektarbeit", storinky: "143", typ: "bez-storinky" },
        { id: "l7-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "144", typ: "bez-storinky" }
      ] },
      { id: "l8", label: "8", nazva: "Die Ukraine", storinky: "145–158", dity: [
        { id: "l8-a", label: "A", nazva: "Sehenswertes in der Ukraine", storinky: "146–149", typ: "vpravy" },
        { id: "l8-b", label: "B", nazva: "Unsere Hauptstadt", storinky: "150–153", typ: "vpravy", gram: ["praep-akkusativ"] },
        { id: "l8-c", label: "C", nazva: "Wiederholung", storinky: "154–155", typ: "povtorennya", gram: ["praep-akkusativ", "temporalsaetze"] },
        { id: "l8-d", label: "D", nazva: "Geschichtenzeit", storinky: "156", typ: "chytannya" },
        { id: "l8-e", label: "E", nazva: "Projektarbeit", storinky: "157", typ: "bez-storinky" },
        { id: "l8-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "158", typ: "bez-storinky" }
      ] },
      { id: "anhang", label: "", nazva: "Anhang", storinky: "159–191", dity: [
        { id: "anhang-grammatik", label: "", nazva: "Grammatik", storinky: "159–168", typ: "bez-storinky" },
        { id: "anhang-woerter", label: "", nazva: "Deutsch-Ukrainisches Wörterverzeichnis", storinky: "169–191", typ: "bez-storinky" },
        { id: "anhang-verben", label: "", nazva: "Unregelmäßige Verben", typ: "gramatyka", gram: ["starke-verben", "tempusformen"] }
      ] }
    ]
  }
];
