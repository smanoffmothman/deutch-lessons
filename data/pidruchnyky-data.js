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
        { id: "l7-a", label: "A", nazva: "Reiseziele und Verkehr", storinky: "116–120", typ: "vpravy" },
        { id: "l7-b", label: "B", nazva: "Deutschlandreise", storinky: "121–125", typ: "vpravy" },
        { id: "l7-c", label: "C", nazva: "Willkommen in der Ukraine", storinky: "126–129", typ: "vpravy" },
        { id: "l7-d", label: "D", nazva: "Wiederholung", storinky: "130–131", typ: "povtorennya" },
        { id: "l7-e", label: "E", nazva: "Geschichtenzeit", storinky: "132", typ: "chytannya" },
        { id: "l7-f", label: "F", nazva: "Projektarbeit", storinky: "133", typ: "bez-storinky" },
        { id: "l7-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "134", typ: "bez-storinky" }
      ] },
      { id: "l8", label: "8", nazva: "Hey Freunde, raus in die Natur!", storinky: "135–148", dity: [
        { id: "l8-a", label: "A", nazva: "Die Natur erkunden", storinky: "136–139", typ: "vpravy" },
        { id: "l8-b", label: "B", nazva: "Jahreszeiten und Wetter", storinky: "140–143", typ: "vpravy" },
        { id: "l8-c", label: "C", nazva: "Wiederholung", storinky: "144–145", typ: "povtorennya" },
        { id: "l8-d", label: "D", nazva: "Geschichtenzeit", storinky: "146", typ: "chytannya" },
        { id: "l8-e", label: "E", nazva: "Projektarbeit", storinky: "147", typ: "bez-storinky" },
        { id: "l8-selbst", label: "", nazva: "Selbsteinschätzung", storinky: "148", typ: "bez-storinky" }
      ] }
    ]
  }
];
