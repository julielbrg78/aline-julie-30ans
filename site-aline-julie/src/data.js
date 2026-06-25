/* Données de l'événement — Aline & Julie · 30 ans */

export const EVENT = {
  names: "Aline & Julie",
  title: "Aline & Julie fêtent leurs 30 ans",
  subtitle: "Une soirée exceptionnelle entourées de ceux qu'on aime.",
  // Vendredi 4 septembre 2026, 17h00 (heure locale)
  dateISO: "2026-09-04T17:00:00",
  dateLabel: "Vendredi 4 septembre 2026",
  timeLabel: "À partir de 17h00",
  venue: "Domaine de la Roche Couloir",
  city: "Chevreuse",
  address: "Domaine de la Roche Couloir, Vallée de Chevreuse, 78460",
  mapsUrl:
    "https://www.google.com/maps/dir//Domaine+de+la+Roche+Couloir,+35+ter+Rte+de+la+Brosse,+78460+Chevreuse/@48.8665157,2.3340766,4884m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x47e681c6002e3b33:0x9721e5c749b8c44f!2m2!1d2.0233159!2d48.7191545?entry=ttu",
  // Numéro des organisatrices pour le message "Je participe" — À REMPLACER par le vrai numéro.
  organisersPhone: "+33600000000",
};

/* Programme de la soirée */
export const PROGRAMME = [
  { time: "17h00", title: "Accueil", desc: "Bulles de bienvenue & retrouvailles dans le parc.", icon: "arrive" },
  { time: "18h00", title: "Apéro Jazz", desc: "Bulles, bouchées et trio jazz pour lancer la soirée en douceur.", icon: "glass" },
  { time: "20h00", title: "Dîner — barbecue géant", desc: "Grand barbecue convivial sous les guirlandes du domaine.", icon: "plate" },
  { time: "22h00", title: "À vous de jouer !", desc: "Un temps libre pour vos activités, jeux et discours surprises.", icon: "quote", cta: "Je participe" },
  { time: "23h00", title: "DJ Set & Dancefloor", desc: "On danse jusqu'au bout de la nuit.", icon: "note" },
];

/* Dress code — moodboard "Sunset Gala" */
export const DRESSCODE = {
  palette: [
    { name: "Magenta", hex: "#C9197D" },
    { name: "Cotton candy", hex: "#E8A6D6" },
    { name: "Sun orange", hex: "#F07F23" },
    { name: "Exotic orange", hex: "#EC5B2E" },
    { name: "Jaune soleil", hex: "#FBDC3F" },
  ],
  cards: [
    { slot: "dc-femmes", label: "Tenues femmes", hint: "robe satinée · slip dress · mini fleurie · couleurs vives" },
    { slot: "dc-hommes", label: "Tenues hommes", hint: "chemise colorée · lin · orange / rose / jaune assumé" },
  ],
  do: ["Couleurs vives & saturées", "Rose, orange, magenta, jaune", "Satin & imprimés fleuris", "Mini, slip dress ou robe longue"],
  avoid: ["Total look noir", "Tons neutres / beiges ternes", "Tenue stricte de gala"],
};

/* Galeries */
export const GALLERIES = {
  lieu: [
    { slot: "lieu-1", label: "Façade du domaine" },
    { slot: "lieu-2", label: "Le parc" },
    { slot: "lieu-3", label: "La grande salle" },
  ],
  duo: [
    { slot: "duo-1", label: "Nous deux" },
    { slot: "duo-2", label: "Mini nous" },
    { slot: "duo-3", label: "Entre copines" },
    { slot: "duo-4", label: "En vadrouille" },
    { slot: "duo-5", label: "Fous rires" },
  ],
};

/* Infos pratiques */
export const INFOS_PRATIQUES = [
  { title: "Parking", icon: "route", text: "Parking gratuit sur place, dans l'enceinte du domaine. Voiturier de cœur à l'arrivée 😉" },
  { title: "Dormir sur place", icon: "pin", text: "Plein d'hôtels et chambres d'hôtes adorables à 5–10 min. On vous a fait une petite sélection :", link: { label: "Voir les hôtels proches", url: "https://www.booking.com/searchresults.fr.html?ss=Chevreuse" } },
];

/* ============================================================
   Photos
   ------------------------------------------------------------
   Déposez vos images dans le dossier  public/photos/  en
   respectant ces noms de fichiers, puis elles s'afficheront
   automatiquement. Tant qu'un fichier est absent, un joli
   cadre "Photo à venir" est affiché à la place.
   ============================================================ */
export const PHOTOS = {
  "hero-main": "/photos/hero-aline-julie.png",
  "lieu-1": "/photos/lieu-1.jpg",
  "lieu-2": "/photos/lieu-2.jpg",
  "lieu-3": "/photos/lieu-3.jpg",
  "duo-1": "/photos/duo-1.jpg",
  "duo-2": "/photos/duo-2.jpg",
  "duo-3": "/photos/duo-3.jpg",
  "duo-4": "/photos/duo-4.jpg",
  "duo-5": "/photos/duo-5.jpg",
  "dc-femmes": "/photos/dc-femmes.jpg",
  "dc-hommes": "/photos/dc-hommes.jpg",
};
