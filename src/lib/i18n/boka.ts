import type { Dict } from "@/lib/i18n";

/**
 * Ordbok för bokningssidan (/boka resp. /en/book) inklusive BookingWidget.
 * Svenska texterna är källan och bevaras exakt; engelskan speglar strukturen.
 *
 * OBS: BookingWidget är ett skarpt transaktionsflöde (tider, priser, Swish).
 * Härifrån styrs ENDAST text — aldrig belopp, logik, API-anrop eller
 * felhantering. Serverdrivna felmeddelanden (payload.detail från API:t)
 * visas som de kommer, dvs. på svenska även på /en/book.
 */
export interface BokaWidgetDict {
  /** Indexeras med Date#getDay() — söndag först. */
  weekdays: string[];
  genericError: string;
  status: { confirmed: string; pendingPayment: string; refundPending: string; cancelled: string; expired: string };
  /** "Bana" i "Bana 3" — numret kommer från bannamnet. */
  courtPrefix: string;
  cameraOnCourt: string;
  fetchSlotsError: string;
  noVenueError: string;
  unavailableError: string;
  paymentFailed: string;
  completeProfileError: string;
  swishStartError: string;
  cancelConfirm: string;
  cancelError: string;
  loadingWidget: string;
  pilot: { tag: string; title: string; body: string; matchiCta: string };
  confirmedPanel: { tag: string; title: string; timePrefix: string; paidPrefix: string; myBookingsCta: string };
  /** Sätts direkt efter beloppet, med inledande mellanslag. Beloppen ändras aldrig. */
  priceSuffix: string;
  header: { tag: string; title: string; sub: string; toggleBook: string; toggleMine: string };
  mine: { loginPrompt: string; loginCta: string; empty: string; cancel: string };
  stepDay: string;
  today: string;
  tomorrow: string;
  stepTime: string;
  loadingSlots: string;
  noSlots: string;
  stepCourt: string;
  indoor: string;
  outdoor: string;
  pickTimeFirst: string;
  pay: {
    tag: string;
    pickPrompt: string;
    checkingAccount: string;
    loginTitle: string;
    loginBody: string;
    loginCta: string;
    profileTitle: string;
    profileBody: string;
    profileCta: string;
    swishPrefix: string;
    edit: string;
    streamTitle: string;
    streamBody: string;
    personalPriceFallback: string;
    ordinaryPrice: string;
    discount: string;
    quoteUntil: string;
    priceChanged: string;
    quoteExpired: string;
    slotTaken: string;
    checkSwish: string;
    submitting: string;
    submitPrefix: string;
    submitEmpty: string;
    fine1: string;
    fine2: string;
  };
}

export interface BokaDict {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: { eyebrow: string; titleTop: string; titleAccent: string; intro: string; cta: string };
  direct: { eyebrow: string; title: string; lead: string };
  steps: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  /** /trana och /konto saknar engelska rutter — de svenska URL:erna används även på /en. */
  mint: { title: string; lead: string; ctaTrain: string; ctaTrainHref: string; ctaEvents: string; ctaEventsHref: string };
  widget: BokaWidgetDict;
}

export const bokaDict: Dict<BokaDict> = {
  sv: {
    meta: {
      title: "Boka beachvolleybana — The Beach",
      description: "Se lediga tider och aktuella priser, boka en beachvolleybana på The Beach i Huddinge och betala med Swish, kort, Apple Pay eller Google Pay.",
      ogTitle: "Boka bana — The Beach",
      ogDescription: "Boka beachvolleybana direkt och betala tryggt med Swish eller kort.",
    },
    hero: {
      eyebrow: "Boka bana",
      titleTop: "Din bana.",
      titleAccent: "Din tid.",
      intro: "Boka direkt hos The Beach. Du ser aktuellt pris för varje ledig tid och betalar med Swish, kort, Apple Pay eller Google Pay.",
      cta: "Se lediga tider",
    },
    direct: {
      eyebrow: "Direktbokning",
      title: "Hitta din tid",
      lead: "Välj dag och tid så ser du vilka banor som är lediga och vad de kostar just då. Vi öppnar fler banor och tider löpande.",
    },
    steps: {
      eyebrow: "Så funkar det",
      title: "Tre steg till sanden",
      items: [
        { title: "Välj tid", text: "Se lediga tider, välj bana och se priset som gäller just då innan du går vidare." },
        { title: "Välj betalsätt", text: "Swish är förstahandsvalet. Du kan också betala med kort, Apple Pay eller Google Pay via Stripe." },
        { title: "Kom och spela", text: "När betalningen är klar är banan bekräftad. Bollar, omklädningsrum och duschar finns på plats." },
      ],
    },
    mint: {
      title: "Träning, event eller annan tid?",
      lead: "Kurser och träningsgrupper hittar du under Träna. Företagsevent, kalas och större bokningar hjälper vi dig att planera.",
      ctaTrain: "Träna →",
      ctaTrainHref: "/trana",
      ctaEvents: "Boka event →",
      ctaEventsHref: "/events",
    },
    widget: {
      weekdays: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
      genericError: "Något gick fel",
      status: {
        confirmed: "Bekräftad",
        pendingPayment: "Väntar på betalning",
        refundPending: "Återbetalning pågår",
        cancelled: "Avbokad",
        expired: "Utgången",
      },
      courtPrefix: "Bana",
      cameraOnCourt: "BeachTV-kamera finns på banan",
      fetchSlotsError: "Kunde inte hämta tider",
      noVenueError: "Ingen bokningsbar anläggning hittades",
      unavailableError: "Bokningen är inte tillgänglig",
      paymentFailed: "Betalningen slutfördes inte och tiden släpptes.",
      completeProfileError: "Slutför ditt namn under Mitt konto. Swish-nummer krävs bara när du väljer Swish.",
      swishStartError: "Kunde inte starta Swish",
      cancelConfirm: "Avboka banan? Inom en timme efter bokning återbetalas hela beloppet. Minst 24 timmar före start återbetalas beloppet minus 20 kr. Senare sker ingen återbetalning.",
      cancelError: "Kunde inte avboka",
      loadingWidget: "Hämtar bokningen…",
      pilot: {
        tag: "Bokning",
        title: "Direktbokningen är tillfälligt stängd",
        body: "Vi har tillfälligt stängt bokningen här på sidan. Ring eller mejla oss så fixar vi din tid.",
        matchiCta: "Mejla boka@thebeach.one →",
      },
      confirmedPanel: {
        tag: "Bokning klar",
        title: "Vi ses i sanden!",
        timePrefix: "kl. ",
        paidPrefix: "Betalt: ",
        myBookingsCta: "Mina bokningar →",
      },
      priceSuffix: " kr",
      header: {
        tag: "Boka online",
        title: "Välj din tid",
        sub: "Priset visas för varje vald tid och bana.",
        toggleBook: "Boka tid",
        toggleMine: "Mina bokningar",
      },
      mine: {
        loginPrompt: "Logga in för att se bokningar från både webben och appen.",
        loginCta: "Logga in eller skapa konto",
        empty: "Du har inga bokningar ännu.",
        cancel: "Avboka",
      },
      stepDay: "1. Välj dag",
      today: "Idag",
      tomorrow: "Imorgon",
      stepTime: "2. Välj tid",
      loadingSlots: "Hämtar lediga tider…",
      noSlots: "Inga lediga tider den här dagen.",
      stepCourt: "3. Välj bana",
      indoor: "Inne",
      outdoor: "Ute",
      pickTimeFirst: "Välj först en tid för att se lediga banor.",
      pay: {
        tag: "4. Konto och betalning",
        pickPrompt: "Välj en ledig tid och bana för att fortsätta.",
        checkingAccount: "Kontrollerar konto…",
        loginTitle: "Logga in för att boka",
        loginBody: "Ett konto krävs. Du loggar in eller skapar konto med e-post och en sexsiffrig kod.",
        loginCta: "Logga in eller skapa konto",
        profileTitle: "Slutför din profil",
        profileBody: "Lägg till ditt namn. Lägg även till Swish-nummer om du vill betala med Swish.",
        profileCta: "Öppna mitt konto",
        swishPrefix: "Swish ",
        edit: "Ändra",
        streamTitle: "Beställ BeachTV-stream",
        streamBody: "Tillgänglig eftersom banan har kamera.",
        personalPriceFallback: "Ditt personliga pris",
        ordinaryPrice: "Ordinarie pris",
        discount: "Du sparar",
        quoteUntil: "Priset gäller till",
        priceChanged: "Priset har uppdaterats. Välj tiden igen för att se och godkänna det nya priset.",
        quoteExpired: "Prisuppgiften hann gå ut. Tider och priser har uppdaterats; välj igen för att fortsätta.",
        slotTaken: "Tiden hann bokas. Vi har uppdaterat de lediga alternativen.",
        checkSwish: "Kontrollera Swish-numret →",
        submitting: "Godkänn betalningen i Swish…",
        submitPrefix: "Boka och betala ",
        submitEmpty: "Välj tid och bana",
        fine1: "Tiden hålls i 10 minuter medan du slutför betalningen.",
        fine2: "Avboka inom en timme för full återbetalning. Därefter återbetalas beloppet minus 20 kr fram till 24 timmar före start.",
      },
    },
  },
  en: {
    meta: {
      title: "Book a beach volleyball court — The Beach",
      description: "See available times and current prices, book a beach volleyball court at The Beach in Huddinge and pay with Swish, card, Apple Pay or Google Pay.",
      ogTitle: "Book a court — The Beach",
      ogDescription: "Book a beach volleyball court directly and pay securely with Swish or card.",
    },
    hero: {
      eyebrow: "Book a court",
      titleTop: "Your court.",
      titleAccent: "Your time.",
      intro: "Book directly with The Beach. See the current price and pay with Swish, card, Apple Pay or Google Pay.",
      cta: "See available times",
    },
    direct: {
      eyebrow: "Direct booking",
      title: "Find your time",
      lead: "Pick a day and a time to see which courts are free and what they cost right then. We keep opening more courts and times.",
    },
    steps: {
      eyebrow: "How it works",
      title: "Three steps to the sand",
      items: [
        { title: "Pick a time", text: "See available times, choose a court and see the price that applies right then before you continue." },
        { title: "Choose how to pay", text: "Swish is the primary option. You can also use card, Apple Pay or Google Pay through Stripe." },
        { title: "Come play", text: "Once payment is complete, the court is confirmed. Balls, changing rooms and showers are on site." },
      ],
    },
    mint: {
      title: "Training, events or another time?",
      lead: "You will find courses and training groups under Training. We help you plan corporate events, birthday parties and larger bookings.",
      ctaTrain: "Training →",
      ctaTrainHref: "/trana",
      ctaEvents: "Book an event →",
      ctaEventsHref: "/en/events",
    },
    widget: {
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      genericError: "Something went wrong",
      status: {
        confirmed: "Confirmed",
        pendingPayment: "Waiting for payment",
        refundPending: "Refund in progress",
        cancelled: "Cancelled",
        expired: "Expired",
      },
      courtPrefix: "Court",
      cameraOnCourt: "This court has a BeachTV camera",
      fetchSlotsError: "Could not fetch available times",
      noVenueError: "No bookable venue was found",
      unavailableError: "Booking is not available",
      paymentFailed: "The payment was not completed and the slot was released.",
      completeProfileError: "Complete your name under My account. A Swish number is only required when you choose Swish.",
      swishStartError: "Could not start Swish",
      cancelConfirm: "Cancel this booking? Within one hour of booking, the full amount is refunded. Up to 24 hours before start, the amount minus SEK 20 is refunded. After that, no refund is given.",
      cancelError: "Could not cancel",
      loadingWidget: "Loading the booking…",
      pilot: {
        tag: "Booking",
        title: "Online booking is temporarily closed",
        body: "Online booking is temporarily closed on this page. Call or email us and we will sort out your time.",
        matchiCta: "Email boka@thebeach.one →",
      },
      confirmedPanel: {
        tag: "Booking complete",
        title: "See you in the sand!",
        timePrefix: "at ",
        paidPrefix: "Paid: ",
        myBookingsCta: "My bookings →",
      },
      priceSuffix: " SEK",
      header: {
        tag: "Book online",
        title: "Choose your time",
        sub: "The price is shown for each selected time and court.",
        toggleBook: "Book a time",
        toggleMine: "My bookings",
      },
      mine: {
        loginPrompt: "Log in to see bookings from both the web and the app.",
        loginCta: "Log in or create an account",
        empty: "You have no bookings yet.",
        cancel: "Cancel",
      },
      stepDay: "1. Pick a day",
      today: "Today",
      tomorrow: "Tomorrow",
      stepTime: "2. Pick a time",
      loadingSlots: "Fetching available times…",
      noSlots: "No available times on this day.",
      stepCourt: "3. Pick a court",
      indoor: "Indoor",
      outdoor: "Outdoor",
      pickTimeFirst: "Pick a time first to see available courts.",
      pay: {
        tag: "4. Account and payment",
        pickPrompt: "Choose an available time and court to continue.",
        checkingAccount: "Checking your account…",
        loginTitle: "Log in to book",
        loginBody: "An account is required. You log in or create an account with your email and a six-digit code.",
        loginCta: "Log in or create an account",
        profileTitle: "Complete your profile",
        profileBody: "Add your name, and add a Swish number if you want to pay with Swish.",
        profileCta: "Open my account",
        swishPrefix: "Swish ",
        edit: "Edit",
        streamTitle: "Order a BeachTV stream",
        streamBody: "Available because this court has a camera.",
        personalPriceFallback: "Your personal price",
        ordinaryPrice: "Standard price",
        discount: "You save",
        quoteUntil: "Price valid until",
        priceChanged: "The price has changed. Select the slot again to see and approve the new price.",
        quoteExpired: "The price quote expired. Times and prices have been refreshed; select again to continue.",
        slotTaken: "The slot was just booked. We have refreshed the available options.",
        checkSwish: "Check the Swish number →",
        submitting: "Approve the payment in Swish…",
        submitPrefix: "Book and pay ",
        submitEmpty: "Pick a time and court",
        fine1: "The slot is held for 10 minutes while you complete payment.",
        fine2: "Cancel within one hour for a full refund. After that, the amount minus SEK 20 is refunded up to 24 hours before start.",
      },
    },
  },
};
