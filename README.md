# Rahul ♥ Priya — Indian Wedding Invitation

A premium, fully responsive **single-page scrolling** Indian wedding invitation website.

Frontend only — no backend, no database, no server, no authentication, no admin dashboard, no routes.
Everything lives on one continuous page with smooth-scroll navigation between sections.

---

## Tech Stack

| Layer     | Choice                                                     |
| --------- | ---------------------------------------------------------- |
| Framework | React 19 + Vite                                            |
| Language  | TypeScript                                                 |
| Styling   | Tailwind CSS v4 (CSS-first, `@theme inline` design tokens) |
| Animation | Framer Motion                                              |
| Icons     | Lucide React                                               |
| Audio     | HTML5 Audio API (one shared `<audio>` element)             |
| Config    | Local TypeScript config files                              |

---

## Installation

```bash
npm install
```

Audio assets are generated locally (see below). If `public/audio/*.wav` is missing, run:

```bash
npm run generate:audio
```

### Scripts

| Command                  | What it does                                                             |
| ------------------------ | ------------------------------------------------------------------------ |
| `npm run dev`            | Start the dev server at `http://localhost:5173`                          |
| `npm run build`          | Type-check (`tsc --noEmit`) then produce a production build in `dist/`   |
| `npm run preview`        | Serve the production build locally                                       |
| `npm run generate:audio` | Synthesise the five original instrumental WAV clips into `public/audio/` |

---

## Sample Assets

### Images

Demo imagery is generated on the fly by a text-to-image URL helper so the site looks complete out of the box.
To use real photographs:

1. Drop your files into **`public/images/`** (create the folder).
2. Point the config at them using root-relative paths, e.g. `/images/hero.jpg`.

Example:

```ts
// src/config/weddingConfig.ts
heroImage: "/images/hero.jpg",
portraits: { bride: "/images/priya.jpg", groom: "/images/rahul.jpg" },
gallery: [
  { id: "g1", src: "/images/g1.jpg", alt: "Haldi morning", shape: "portrait" },
  // ...
],
```

Function card images live in `src/config/weddingEvents.ts` (`image` field) and use the same approach.

Recommended: WebP or optimised JPEG, longest edge ≤ 1600 px. Gallery images are already `loading="lazy"`.

### Audio

`npm run generate:audio` writes ten **original** instrumentals — no copyrighted material:

| File                                | Track            | Plays on               |
| ----------------------------------- | ---------------- | ---------------------- |
| `public/audio/invitation-theme.wav` | Invitation Theme | Welcome screen         |
| `public/audio/couple.wav`           | Two Hearts       | Couple introduction    |
| `public/audio/countdown.wav`        | Counting Down    | Wedding countdown      |
| `public/audio/haldi.wav`            | Marigold Morning | Haldi                  |
| `public/audio/mehendi.wav`          | Henna Hands      | Mehendi                |
| `public/audio/sangeet.wav`          | Dhol & Lights    | Sangeet                |
| `public/audio/wedding.wav`          | Saath Janam      | Wedding Ceremony       |
| `public/audio/story.wav`            | How We Met       | Love story             |
| `public/audio/gallery.wav`          | Moments in Frame | Photo gallery          |
| `public/audio/celebration.wav`      | See You There    | Venue, Thank you |

To swap in your own tracks, replace the files in `public/audio/` and update the paths in
[`src/config/musicConfig.ts`](src/config/musicConfig.ts). The four function clips are read straight from
`audioSrc` / `musicTitle` in [`src/config/weddingEvents.ts`](src/config/weddingEvents.ts), so a function and its
music stay configured together.

> Do **not** ship unlicensed Bollywood or commercial songs. Use music you own or that is licensed for this use.

---

## Configuration

All wedding content lives in local config files — nothing is hardcoded inside reusable components.

### `src/config/weddingConfig.ts`

Single source of truth for the invitation:

- Couple names, roles, portraits, hashtag
- Welcome copy (`welcomeMessage`, `invitationLine`)
- Wedding date (`weddingDate`, ISO 8601 **with a timezone offset**, e.g. `2027-02-14T18:00:00+05:30`), plus the
  human-readable `dateLabel`, `dayLabel`, `city`
- Hero image, couple story
- `story` — the Love Story timeline milestones (date, heading, description, optional image)
- `gallery` — the Photo Gallery images (`shape: "portrait" | "square" | "landscape"`)
- `venue` — name, address, timings, parking, contact, key-less `mapEmbedUrl`, and `directionsUrl`
- `theme` — which of the four palettes to load by default

### `src/config/weddingEvents.ts`

The four functions — Haldi, Mehendi, Sangeet, Wedding Ceremony — each rendered as its **own dedicated section**.
Each entry carries title, subtitle, tagline, date/time, venue, description, dress code, colour story, palette,
per-function accent colours, decorative motif, icon, image, and its background track.

The `decor` field also selects the section layout: `marigold` (garland + arch photo), `mehendi`
(corner-ornamented frame + jasmine string), `sparkle` (full-bleed dark stage) or `royal` (centred mandap banner).

### `src/config/musicConfig.ts`

Maps each section id to its background track, in page order. Sections not listed here simply have no music.

### `src/config/themes.ts`

Four complete palettes, applied at runtime by `applyTheme(name)` which writes CSS custom properties onto
`documentElement`:

1. **Royal Indian** — maroon / antique gold / ivory _(default)_
2. **Floral Romance** — blush pink / cream / rose
3. **Modern Minimalist** — white / beige / champagne
4. **Mehendi Garden** — emerald / sage / gold

Change the default in `weddingConfig.theme`, or call `applyTheme("mehendi")` at runtime.

---

## Project Structure

```
wedding-invitation/
├── public/
│   ├── audio/                     # generated / replaced music clips
│   └── images/                    # your photos (create this folder)
├── scripts/
│   └── generate-audio.mjs         # original WAV synthesiser
├── src/
│   ├── components/
│   │   ├── WelcomeSection.tsx     # hero + invitation cover
│   │   ├── Navbar.tsx             # sticky nav + scroll progress
│   │   ├── CoupleIntro.tsx
│   │   ├── Countdown.tsx
│   │   ├── EventShowcase.tsx      # the four function sections, one layout each
│   │   ├── LoveStory.tsx
│   │   ├── PhotoGallery.tsx       # masonry + lightbox
│   │   ├── VenueSection.tsx       # map + directions
│   │   ├── Footer.tsx
│   │   └── …                      # Reveal, SectionHeading, FloatingPetals, SparkleField
│   ├── config/
│   │   ├── weddingConfig.ts
│   │   ├── weddingEvents.ts
│   │   ├── musicConfig.ts         # section id -> background track
│   │   └── themes.ts
│   ├── context/
│   │   └── AudioContext.tsx       # centralised music controller (no UI)
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useSectionMusic.ts     # plays the track of the section in view
│   │   └── useScrollReveal.ts
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Sections & Navigation

All sections are anchored and reachable from the sticky nav with smooth scrolling:

`#home` → `#couple` → `#countdown` → `#events` → `#story` → `#gallery` → `#venue` → `#thanks`

The functions band also carries one anchor per ceremony — `#haldi`, `#mehendi`, `#sangeet`, `#wedding` — reached
from the function pills at the top of the section. On mobile the nav collapses into a compact drawer.

---

## Music Behaviour

There is **no visible player and no music controls**. Music is background only:

- **Automatic per section.** The section in view owns the music. Scrolling or navigating to another section
  switches the track immediately; the previous song stops.
- **One element, one song.** A single shared `<audio>` element serves every section, so switching swaps its
  `src` — overlapping playback is structurally impossible.
- **No upfront download.** `preload="none"` plus the source being assigned only on the first play means zero
  audio bytes are fetched at page load. Clips are 20–24 s and loop while their section is on screen.
- **Autoplay fallback.** Browsers block audio until the guest interacts with the page, so playback starts on the
  "Open Invitation" tap and, if still blocked, retries silently on the first scroll/click/key press (and when
  the tab regains focus). Nothing is shown to the guest.
- **Soft by default.** Volume sits at 40% so it stays under the page rather than in front of it.

Configuration lives in [`src/config/musicConfig.ts`](src/config/musicConfig.ts) — add, remove or re-point a
section's track there.

---

---

## Accessibility & Performance

- Semantic landmarks, labelled controls, visible focus states, skip-to-content link.
- Lightbox is keyboard-driven (Escape, ←, →) and traps nothing it shouldn't; body scroll locks while open.
- `prefers-reduced-motion` is respected in three layers: `MotionConfig reducedMotion="user"`, hook-level guards
  (floating petals and sparkles render nothing), and a CSS media-query kill-switch.
- Gallery images lazy-load; audio is never fetched at initial page load; no background videos; timers and audio
  listeners are cleaned up on unmount.

---

## License / Content Notice

The bundled music is original, procedurally generated audio. Couple names, dates, venue, and imagery are
placeholders — replace them in the config files before sharing the invitation publicly.
