/**
 * Wedding configuration
 * ------------------------------------------------------------------
 * Single source of truth for every piece of copy, date, image and
 * location on the invitation. Components read from here — nothing is
 * hardcoded inside reusable components, so the whole invitation can be
 * re-themed for another couple by editing this file only.
 */

import type { ThemeName } from "./themes";

/* ------------------------------------------------------------------ */
/* Demo imagery                                                        */
/* ------------------------------------------------------------------ */
/**
 * The demo photos are generated on the fly by a text-to-image endpoint so
 * the project ships without binary assets. To use real wedding photos,
 * drop them into `public/images/` and replace the URLs below with
 * `/images/<your-file>.jpg` — nothing else needs to change.
 */
const demoImage = (prompt: string, size = "portrait_4_3"): string =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export interface GalleryImage {
  src: string;
  alt: string;
  /** Drives the masonry rhythm: tall, wide or even. */
  shape: "portrait" | "landscape" | "square";
}

export interface StoryMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon: "sparkles" | "camera" | "heart" | "gem" | "crown";
}

export interface VenueConfig {
  name: string;
  hall: string;
  address: string;
  dateLabel: string;
  timeLabel: string;
  /** Key-less Google Maps embed URL (no API key required, nothing private exposed). */
  mapEmbedUrl: string;
  /** Deep link used by the "Get Directions" button. */
  directionsUrl: string;
  parking: string;
  contactName: string;
  contactPhone: string;
}

export interface WeddingConfig {
  theme: ThemeName;
  partnerOne: string;
  partnerTwo: string;
  partnerOneRole: string;
  partnerTwoRole: string;
  partnerOneImage: string;
  partnerTwoImage: string;
  hashtag: string;
  welcomeMessage: string;
  invitationLine: string;
  /** ISO 8601 string. The explicit +05:30 offset keeps the countdown correct worldwide. */
  weddingDate: string;
  dateLabel: string;
  dayLabel: string;
  timeLabel: string;
  city: string;
  heroImage: string;
  coupleStory: string;
  story: StoryMilestone[];
  gallery: GalleryImage[];
  venue: VenueConfig;
  rsvpDeadlineLabel: string;
  closingTitle: string;
  closingMessage: string;
  signature: string;
}

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */
export const weddingConfig: WeddingConfig = {
  /* Change this single value to restyle the whole invitation:
     "royal" | "floral" | "minimal" | "mehendi" (see src/config/themes.ts) */
  theme: "royal",

  partnerOne: "Rahul",
  partnerTwo: "Priya",
  partnerOneRole: "Son of Mr. & Mrs. Sharma",
  partnerTwoRole: "Daughter of Mr. & Mrs. Iyer",
  partnerOneImage: demoImage(
    "Cinematic portrait of a handsome Indian groom in a premium ivory sherwani with intricate gold embroidery, royal palace background, warm soft lighting, high-end wedding photography, 8k",
    "portrait_4_3",
  ),
  partnerTwoImage: demoImage(
    "Cinematic portrait of a stunning Indian bride in a traditional deep red lehenga, heavy gold jewellery, elegant bridal makeup, soft window light, royal aesthetic, high-end wedding photography, 8k",
    "portrait_4_3",
  ),
  hashtag: "#RahulWedsPriya",

  welcomeMessage: "Together with their families",
  invitationLine: "Are Getting Married",

  weddingDate: "2027-02-14T18:00:00+05:30",
  dateLabel: "14 February 2027",
  dayLabel: "Sunday",
  timeLabel: "6:00 PM onwards",
  city: "Jaipur, Rajasthan",

  heroImage: demoImage(
    "Cinematic wide angle shot of a luxury Indian wedding mandap at a royal palace courtyard, sunset golden hour, marigold and rose garlands, warm bokeh lights, elegant and majestic atmosphere, 8k",
    "landscape_16_9",
  ),

  coupleStory:
    "Two families, one celebration. From a chance meeting at a college fest in Pune to seven years of laughter, long-distance calls and shared plates of rajma chawal — we are finally saying yes, in front of everyone we love.",

  story: [
    {
      id: "met",
      date: "March 2019",
      title: "How We Met",
      description:
        "A crowded college fest in Pune, one spilled cup of chai and a conversation that refused to end. Priya was arguing about 90s Bollywood; Rahul was quietly losing the argument on purpose.",
      image: demoImage(
        "Candid shot of a young Indian couple laughing together in a sunny college courtyard, casual traditional clothes, warm afternoon glow, documentary style, 8k",
        "landscape_4_3",
      ),
      icon: "sparkles",
    },
    {
      id: "first-date",
      date: "August 2019",
      title: "Our First Date",
      description:
        "Filter coffee at a tiny Bandra cafe that has since closed down. Three hours became five, the staff started stacking chairs around us, and neither of us wanted to leave.",
      icon: "camera",
    },
    {
      id: "proposal",
      date: "December 2025",
      title: "The Proposal",
      description:
        "A rooftop in Udaipur, a sunset that looked suspiciously well-researched, and a question Rahul had rehearsed in the mirror forty times. She said yes before he finished asking.",
      image: demoImage(
        "Romantic proposal silhouette of an Indian couple on a luxury rooftop in Udaipur, lake background, sunset colors, fairy lights, cinematic wedding photography, 8k",
        "landscape_4_3",
      ),
      icon: "heart",
    },
    {
      id: "engagement",
      date: "April 2026",
      title: "Our Engagement",
      description:
        "Two families, endless plates of laddoos, an exchange of rings and a hall full of aunties claiming they always knew. The countdown officially began that evening.",
      icon: "gem",
    },
    {
      id: "wedding",
      date: "14 February 2027",
      title: "Our Wedding",
      description:
        "The part we have been waiting for. Seven vows, one new family, and a dance floor that we fully intend to shut down.",
      icon: "crown",
    },
  ],

  gallery: [
    {
      src: demoImage(
        "Close up of Indian bride and groom's hands during Haldi ceremony, yellow turmeric paste, marigold petals, warm golden light, 8k",
        "portrait_4_3",
      ),
      alt: "Haldi blessings with marigolds",
      shape: "portrait",
    },
    {
      src: demoImage(
        "Intricate bridal mehndi henna patterns on palms, traditional Indian wedding jewelry, soft daylight, premium macro shot, 8k",
        "square",
      ),
      alt: "Intricate bridal mehndi details",
      shape: "square",
    },
    {
      src: demoImage(
        "Vibrant Indian Sangeet night, professional dancers, colourful stage lighting, festive energy, wide cinematic shot, 8k",
        "landscape_4_3",
      ),
      alt: "Sangeet night celebrations",
      shape: "landscape",
    },
    {
      src: demoImage(
        "Indian bride in a royal red lehenga walking towards the mandap, floral umbrella, traditional wedding entrance, cinematic, 8k",
        "portrait_4_3",
      ),
      alt: "The bridal entrance",
      shape: "portrait",
    },
    {
      src: demoImage(
        "Luxury Indian wedding flat lay, gold necklace, traditional bangles, red bridal dupatta, rose petals, elegant silk background, 8k",
        "square",
      ),
      alt: "Royal bridal accessories",
      shape: "square",
    },
    {
      src: demoImage(
        "Romantic couple portrait at a Jaipur palace corridor, sunset light, traditional Indian wedding attire, majestic aesthetic, 8k",
        "portrait_4_3",
      ),
      alt: "Palace portraits at sunset",
      shape: "portrait",
    },
    {
      src: demoImage(
        "Indian wedding dinner decor, long tables with floral runners, candles, brass elements, luxury outdoor reception, 8k",
        "landscape_4_3",
      ),
      alt: "Grand reception decor",
      shape: "landscape",
    },
    {
      src: demoImage(
        "Close up of Indian couple exchanging wedding rings, traditional jewelry, soft romantic lighting, 8k",
        "square",
      ),
      alt: "The exchange of rings",
      shape: "square",
    },
    {
      src: demoImage(
        "Joyful Indian couple under a shower of rose petals, wedding varmala ceremony, cinematic emotional moment, 8k",
        "portrait_4_3",
      ),
      alt: "Varmala celebration",
      shape: "portrait",
    },
  ],

  venue: {
    name: "The Royal Palace Lawns",
    hall: "Amrit Mahal, Inner Courtyard",
    address: "Amer Road, Jalebi Chowk, Jaipur, Rajasthan 302002, India",
    dateLabel: "Sunday, 14 February 2027",
    timeLabel: "Baraat 5:30 PM · Muhurat 6:45 PM · Dinner 8:30 PM",
    // Key-less embed: swap this with your own Google Maps embed (Share →
    // Embed a map) if the venue changes. No API key is used anywhere.
    mapEmbedUrl:
      "https://www.google.com/maps?q=Amer+Fort,+Amer+Road,+Jaipur,+Rajasthan&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Amer+Fort%2C+Amer+Road%2C+Jaipur%2C+Rajasthan",
    parking: "Complimentary valet parking at Gate 3. Overflow parking 200m ahead at Shanti Bagh.",
    contactName: "Vishal Sharma (Family Contact)",
    contactPhone: "+91 98200 00000",
  },

  rsvpDeadlineLabel: "Please respond by 20 January 2027",
  closingTitle: "Thank You",
  closingMessage:
    "Your presence and blessings mean more to us than any gift. Come celebrate with us, eat too much, dance badly and make this day unforgettable.",
  signature: "With love, Rahul & Priya",
};

export default weddingConfig;
