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
      description: "Se lediga tider och aktuella priser, boka en beachvolleybana på The Beach i Huddinge och betala med Swish.",
      ogTitle: "Boka bana — The Beach",
      ogDescription: "Boka beachvolleybana direkt och betala tryggt med Swish.",
    },
    hero: {
      eyebrow: "Boka bana",
      titleTop: "Din bana.",
      titleAccent: "Din tid.",
      intro: "Boka direkt hos The Beach. Du ser aktuellt pris för varje ledig tid och betalar smidigt med Swish.",
      cta: "Se lediga tider",
    },
    direct: {
      eyebrow: "Direktbokning",
      title: "Hitta din tid",
      lead: "Vi börjar med ett urval banor och tider. Övriga banor ligger kvar i MATCHi under pilotperioden, så systemen konkurrerar aldrig om samma tid.",
    },
    steps: {
      eyebrow: "Så funkar det",
      title: "Tre steg till sanden",
      items: [
        { title: "Välj tid", text: "Se lediga tider, välj bana och se priset som gäller just då innan du går vidare." },
        { title: "Betala med Swish", text: "Vi håller tiden i 10 minuter och skickar en betalningsbegäran direkt till ditt Swish-nummer." },
        { title: "Kom och spela", text: "När Swish är klart är banan bekräftad. Bollar, omklädningsrum och duschar finns på plats." },
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
        pendingPayment: "Väntar på Swish",
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
      completeProfileError: "Slutför namn och Swish-nummer under Mitt konto före bokning.",
      swishStartError: "Kunde inte starta Swish",
      cancelConfirm: "Avboka banan? Inom en timme efter bokning återbetalas hela beloppet. Minst 24 timmar före start återbetalas beloppet minus 20 kr. Senare sker ingen återbetalning.",
      cancelError: "Kunde inte avboka",
      loadingWidget: "Hämtar bokningen…",
      pilot: {
        tag: "Pilot",
        title: "Snart bokar du direkt här",
        body: "Vi öppnar en första grupp banor i vårt nya bokningssystem. Fram till dess ligger de bokningsbara tiderna kvar i MATCHi.",
        matchiCta: "Boka i MATCHi →",
      },
      confirmedPanel: {
        tag: "Bokning klar",
        title: "Vi ses i sanden!",
        timePrefix: "kl. ",
        paidPrefix: "Betalt med Swish: ",
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
      noSlots: "Inga lediga pilottider den här dagen.",
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
        profileBody: "Lägg till namn och Swish-nummer. Bokningen hämtar uppgifterna automatiskt.",
        profileCta: "Öppna mitt konto",
        swishPrefix: "Swish ",
        edit: "Ändra",
        streamTitle: "Beställ BeachTV-stream",
        streamBody: "Tillgänglig eftersom banan har kamera.",
        checkSwish: "Kontrollera Swish-numret →",
        submitting: "Godkänn betalningen i Swish…",
        submitPrefix: "Boka och betala ",
        submitEmpty: "Välj tid och bana",
        fine1: "Tiden hålls i 10 minuter. Betalningsbegäran skickas till Swish-numret i din profil.",
        fine2: "Avboka inom en timme för full återbetalning. Därefter återbetalas beloppet minus 20 kr fram till 24 timmar före start.",
      },
    },
  },
  en: {
    meta: {
      title: "Book a beach volleyball court — The Beach",
      description: "See available times and current prices, book a beach volleyball court at The Beach in Huddinge and pay with Swish.",
      ogTitle: "Book a court — The Beach",
      ogDescription: "Book a beach volleyball court directly and pay securely with Swish.",
    },
    hero: {
      eyebrow: "Book a court",
      titleTop: "Your court.",
      titleAccent: "Your time.",
      intro: "Book directly with The Beach. You see the current price for every available slot and pay easily with Swish.",
      cta: "See available times",
    },
    direct: {
      eyebrow: "Direct booking",
      title: "Find your time",
      lead: "We are starting with a selection of courts and times. The remaining courts stay in MATCHi during the pilot period, so the two systems never compete for the same slot.",
    },
    steps: {
      eyebrow: "How it works",
      title: "Three steps to the sand",
      items: [
        { title: "Pick a time", text: "See available times, choose a court and see the price that applies right then before you continue." },
        { title: "Pay with Swish", text: "We hold the slot for 10 minutes and send a payment request straight to your Swish number." },
        { title: "Come play", text: "Once the Swish payment is complete, the court is confirmed. Balls, changing rooms and showers are on site." },
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
        pendingPayment: "Waiting for Swish",
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
      completeProfileError: "Complete your name and Swish number under My account before booking.",
      swishStartError: "Could not start Swish",
      cancelConfirm: "Cancel this booking? Within one hour of booking, the full amount is refunded. Up to 24 hours before start, the amount minus SEK 20 is refunded. After that, no refund is given.",
      cancelError: "Could not cancel",
      loadingWidget: "Loading the booking…",
      pilot: {
        tag: "Pilot",
        title: "Soon you can book directly here",
        body: "We are opening a first group of courts in our new booking system. Until then, the bookable times remain in MATCHi.",
        matchiCta: "Book on MATCHi →",
      },
      confirmedPanel: {
        tag: "Booking complete",
        title: "See you in the sand!",
        timePrefix: "at ",
        paidPrefix: "Paid with Swish: ",
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
      noSlots: "No available pilot times on this day.",
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
        profileBody: "Add your name and Swish number. The booking picks up your details automatically.",
        profileCta: "Open my account",
        swishPrefix: "Swish ",
        edit: "Edit",
        streamTitle: "Order a BeachTV stream",
        streamBody: "Available because this court has a camera.",
        checkSwish: "Check the Swish number →",
        submitting: "Approve the payment in Swish…",
        submitPrefix: "Book and pay ",
        submitEmpty: "Pick a time and court",
        fine1: "The slot is held for 10 minutes. The payment request is sent to the Swish number in your profile.",
        fine2: "Cancel within one hour for a full refund. After that, the amount minus SEK 20 is refunded up to 24 hours before start.",
      },
    },
  },
};
