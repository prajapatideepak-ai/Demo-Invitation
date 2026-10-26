/**
 * Audio asset generator
 * ------------------------------------------------------------------
 * Creates the five short original instrumentals used by the invitation
 * (one per wedding function + the invitation theme) as plain 16-bit PCM
 * WAV files inside public/audio.
 *
 * Everything here is synthesised from scratch with simple additive sine
 * voices and noise percussion, so no third-party or copyrighted audio is
 * involved.
 *
 * Usage:  npm run generate:audio
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 22050;
const OUT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "audio",
);

/* ------------------------------------------------------------------ */
/* Music theory helpers                                                */
/* ------------------------------------------------------------------ */
const SEMITONES = {
  C: -9,
  "C#": -8,
  D: -7,
  "D#": -6,
  E: -5,
  F: -4,
  "F#": -3,
  G: -2,
  "G#": -1,
  A: 0,
  "A#": 1,
  B: 2,
};

/** "A4" -> 440, "F#5" -> 739.99 */
function noteFreq(name) {
  const match = /^([A-G]#?)(\d)$/.exec(name);
  if (!match) throw new Error(`Unsupported note name: ${name}`);
  const semitones = SEMITONES[match[1]] + (Number(match[2]) - 4) * 12;
  return 440 * 2 ** (semitones / 12);
}

const makeBuffer = (seconds) =>
  new Float32Array(Math.ceil(seconds * SAMPLE_RATE));

/* ------------------------------------------------------------------ */
/* Voices                                                             */
/* ------------------------------------------------------------------ */
/** Plucked / blown melody voice (sitar- or flute-like). */
function addVoice(
  buffer,
  {
    freq,
    start,
    dur,
    gain = 0.3,
    decay = 3.2,
    attack = 0.012,
    harmonics = [1, 0.35, 0.16, 0.07],
  },
) {
  const from = Math.floor(start * SAMPLE_RATE);
  const to = Math.min(buffer.length, Math.floor((start + dur) * SAMPLE_RATE));

  for (let i = from; i < to; i += 1) {
    const t = (i - from) / SAMPLE_RATE;
    const env =
      Math.exp(-decay * t) * (attack === 0 ? 1 : Math.min(1, t / attack));
    let sample = 0;
    harmonics.forEach((weight, index) => {
      sample += weight * Math.sin(2 * Math.PI * freq * (index + 1) * t);
    });
    buffer[i] += (sample / harmonics.length) * env * gain;
  }
}

/** Sustained pad / drone with a slow swell. */
function addPad(buffer, { freq, start, dur, gain = 0.12 }) {
  const from = Math.floor(start * SAMPLE_RATE);
  const to = Math.min(buffer.length, Math.floor((start + dur) * SAMPLE_RATE));
  const total = to - from;

  for (let i = from; i < to; i += 1) {
    const t = (i - from) / SAMPLE_RATE;
    const progress = (i - from) / total;
    const swell =
      Math.min(1, progress / 0.22) * Math.min(1, (1 - progress) / 0.3);
    const sample =
      Math.sin(2 * Math.PI * freq * t) * 0.7 +
      Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.18 +
      Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.25;
    buffer[i] += sample * swell * gain;
  }
}

/** Bell / ghunghroo shimmer. */
function addBell(buffer, { freq, start, dur = 1.6, gain = 0.12 }) {
  addVoice(buffer, {
    freq,
    start,
    dur,
    gain,
    decay: 2.4,
    attack: 0.004,
    harmonics: [1, 0.5, 0.28, 0.15, 0.08],
  });
}

/** Noise percussion — bright shaker/hat via a one-pole difference. */
function addShaker(buffer, { start, dur = 0.08, gain = 0.1 }) {
  const from = Math.floor(start * SAMPLE_RATE);
  const to = Math.min(buffer.length, Math.floor((start + dur) * SAMPLE_RATE));
  let previous = 0;

  for (let i = from; i < to; i += 1) {
    const t = (i - from) / SAMPLE_RATE;
    const noise = Math.random() * 2 - 1;
    const bright = noise - previous;
    previous = noise;
    buffer[i] += bright * Math.exp(-38 * t) * gain;
  }
}

/** Low hand-drum (dhol) hit: a short downward pitch sweep. */
function addDrum(buffer, { start, gain = 0.5 }) {
  const from = Math.floor(start * SAMPLE_RATE);
  const to = Math.min(buffer.length, Math.floor((start + 0.34) * SAMPLE_RATE));

  for (let i = from; i < to; i += 1) {
    const t = (i - from) / SAMPLE_RATE;
    const freq = 150 * Math.exp(-7 * t) + 58;
    buffer[i] += Math.sin(2 * Math.PI * freq * t) * Math.exp(-9 * t) * gain;
  }
}

/** Clap for the festive tracks. */
function addClap(buffer, { start, gain = 0.16 }) {
  const from = Math.floor(start * SAMPLE_RATE);
  const to = Math.min(buffer.length, Math.floor((start + 0.18) * SAMPLE_RATE));

  for (let i = from; i < to; i += 1) {
    const t = (i - from) / SAMPLE_RATE;
    const envelope = t < 0.012 ? 1 : Math.exp(-26 * (t - 0.012));
    buffer[i] += (Math.random() * 2 - 1) * envelope * gain;
  }
}

/* ------------------------------------------------------------------ */
/* Sequencer                                                          */
/* ------------------------------------------------------------------ */
function renderTrack({
  seconds,
  tempo,
  melody,
  melodyVoice = "pluck",
  chords,
  chordBeats = 4,
  padGain = 0.1,
  drums = "none",
  bells = false,
  introBeats = 4,
}) {
  const buffer = makeBuffer(seconds);
  const beat = 60 / tempo;
  const totalBeats = Math.floor(seconds / beat);

  // Chord bed, looping the progression for the whole track.
  for (
    let index = 0;
    index * chordBeats < totalBeats + chordBeats;
    index += 1
  ) {
    const chord = chords[index % chords.length];
    const start = index * chordBeats * beat;
    chord.forEach((note) =>
      addPad(buffer, {
        freq: noteFreq(note),
        start,
        dur: chordBeats * beat,
        gain: padGain,
      }),
    );
  }

  // Melody, looping from after the intro.
  let cursor = introBeats * beat;
  let step = 0;
  while (cursor < seconds - beat) {
    const [note, beats] = melody[step % melody.length];
    if (note) {
      const duration = beats * beat;
      if (melodyVoice === "flute") {
        addVoice(buffer, {
          freq: noteFreq(note),
          start: cursor,
          dur: duration * 0.96,
          gain: 0.26,
          decay: 1.1,
          attack: 0.09,
          harmonics: [1, 0.22, 0.08],
        });
      } else {
        addVoice(buffer, {
          freq: noteFreq(note),
          start: cursor,
          dur: duration * 1.4,
          gain: 0.28,
          decay: 2.6,
        });
      }
    }
    cursor += beats * beat;
    step += 1;
  }

  // Percussion.
  if (drums === "dhol" || drums === "party") {
    for (let index = 0; index < totalBeats; index += 1) {
      const start = index * beat;
      if (index % 4 === 0 || index % 4 === 2)
        addDrum(buffer, { start, gain: index % 4 === 0 ? 0.5 : 0.34 });
      addShaker(buffer, {
        start: start + beat / 2,
        gain: drums === "party" ? 0.12 : 0.08,
      });
      if (drums === "party" && (index % 8 === 6 || index % 8 === 7))
        addClap(buffer, { start, gain: 0.14 });
      if (index % 8 === 7)
        addDrum(buffer, { start: start + beat * 0.5, gain: 0.28 });
    }
  } else if (drums === "soft") {
    for (let index = 0; index < totalBeats; index += 1) {
      if (index % 2 === 1)
        addShaker(buffer, { start: index * beat, gain: 0.06 });
    }
  }

  // Bells on bar boundaries.
  if (bells) {
    for (let index = 0; index * 8 < totalBeats; index += 1) {
      const root = noteFreq(chords[index % chords.length][0]) * 4;
      addBell(buffer, { freq: root, start: index * 8 * beat, gain: 0.07 });
    }
  }

  return normalize(buffer);
}

/** Scale the mix so the loudest peak sits just under full scale, then fade in/out. */
function normalize(buffer) {
  let peak = 0;
  buffer.forEach((value) => {
    peak = Math.max(peak, Math.abs(value));
  });
  const scale = peak > 0 ? 0.82 / peak : 1;

  const fadeSamples = Math.floor(SAMPLE_RATE * 0.6);
  for (let i = 0; i < buffer.length; i += 1) {
    let value = buffer[i] * scale;
    if (i < fadeSamples) value *= i / fadeSamples;
    const tail = buffer.length - 1 - i;
    if (tail < fadeSamples) value *= tail / fadeSamples;
    buffer[i] = value;
  }

  return buffer;
}

/* ------------------------------------------------------------------ */
/* WAV encoder                                                        */
/* ------------------------------------------------------------------ */
function encodeWav(buffer) {
  const header = Buffer.alloc(44);
  const dataSize = buffer.length * 2;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format: PCM
  header.writeUInt16LE(1, 22); // channels: mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  const data = Buffer.alloc(dataSize);
  for (let i = 0; i < buffer.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, buffer[i]));
    data.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }

  return Buffer.concat([header, data]);
}

/* ------------------------------------------------------------------ */
/* The clips                                                          */
/* ------------------------------------------------------------------ */
const TRACKS = [
  {
    file: "haldi.wav",
    // Bright, sunny, marigold morning.
    session: {
      seconds: 20,
      tempo: 96,
      melodyVoice: "pluck",
      chords: [
        ["D3", "A3", "F#4"],
        ["A2", "E3", "C#4"],
        ["B2", "F#3", "D4"],
        ["G2", "D3", "B3"],
      ],
      melody: [
        ["D5", 1],
        ["E5", 1],
        ["F#5", 1],
        ["A5", 2],
        [null, 1],
        ["F#5", 1],
        ["E5", 1],
        ["D5", 2],
        [null, 1],
        ["D5", 1],
        ["F#5", 1],
        ["A5", 1],
        ["B5", 2],
        ["A5", 1],
        ["F#5", 1],
        ["E5", 1],
        ["D5", 2],
        [null, 2],
      ],
      drums: "dhol",
      bells: true,
      padGain: 0.09,
    },
  },
  {
    file: "mehendi.wav",
    // Slow, intimate, henna-afternoon mood.
    session: {
      seconds: 22,
      tempo: 72,
      melodyVoice: "flute",
      chords: [
        ["E3", "B3", "G4"],
        ["C3", "G3", "E4"],
        ["A2", "E3", "C4"],
        ["D3", "A3", "F#4"],
      ],
      melody: [
        ["E5", 2],
        ["G5", 1],
        ["F#5", 1],
        ["E5", 2],
        [null, 2],
        ["D5", 2],
        ["E5", 1],
        ["D5", 1],
        ["B4", 2],
        [null, 2],
        ["C5", 2],
        ["E5", 1],
        ["G5", 1],
        ["F#5", 3],
        [null, 1],
        ["E5", 2],
        ["D5", 2],
        ["E5", 4],
      ],
      drums: "soft",
      padGain: 0.11,
    },
  },
  {
    file: "sangeet.wav",
    // Festive, dance-floor energy.
    session: {
      seconds: 20,
      tempo: 126,
      melodyVoice: "pluck",
      chords: [
        ["A2", "E3", "C4"],
        ["F2", "C3", "A3"],
        ["G2", "D3", "B3"],
        ["E2", "B2", "G3"],
      ],
      melody: [
        ["A4", 1],
        ["C5", 1],
        ["E5", 1],
        ["A5", 1],
        ["G5", 1],
        ["E5", 1],
        ["F5", 1],
        ["A5", 1],
        ["C6", 1],
        ["A5", 1],
        ["G5", 2],
        ["A4", 1],
        ["B4", 1],
        ["C5", 1],
        ["D5", 1],
        ["E5", 2],
        ["D5", 1],
        ["C5", 1],
        ["B4", 1],
        ["A4", 3],
      ],
      drums: "party",
      bells: true,
      padGain: 0.08,
    },
  },
  {
    file: "wedding.wav",
    // Romantic ceremony instrumental.
    session: {
      seconds: 24,
      tempo: 64,
      melodyVoice: "flute",
      chords: [
        ["D3", "A3", "F#4"],
        ["B2", "F#3", "D4"],
        ["G2", "D3", "B3"],
        ["A2", "E3", "C#4"],
      ],
      melody: [
        ["A4", 2],
        ["D5", 2],
        ["E5", 2],
        ["F#5", 3],
        [null, 1],
        ["E5", 2],
        ["D5", 2],
        ["B4", 2],
        ["C#5", 2],
        [null, 2],
        ["D5", 2],
        ["F#5", 2],
        ["A5", 3],
        [null, 1],
        ["G5", 2],
        ["F#5", 2],
        ["E5", 2],
        ["D5", 4],
      ],
      drums: "none",
      bells: true,
      padGain: 0.13,
    },
  },
  {
    file: "invitation-theme.wav",
    // Ambient cover / hero theme.
    session: {
      seconds: 22,
      tempo: 60,
      melodyVoice: "flute",
      chords: [
        ["C3", "G3", "E4"],
        ["G2", "D3", "B3"],
        ["A2", "E3", "C4"],
        ["F2", "C3", "A3"],
      ],
      melody: [
        ["E5", 2],
        ["G5", 2],
        ["A5", 2],
        [null, 2],
        ["G5", 2],
        ["E5", 2],
        ["D5", 4],
        ["C5", 2],
        ["E5", 2],
        ["G5", 2],
        [null, 2],
        ["E5", 2],
        ["D5", 2],
        ["C5", 4],
      ],
      drums: "none",
      bells: true,
      padGain: 0.14,
    },
  },
  {
    file: "couple.wav",
    // Romantic pair theme — the couple introduction.
    session: {
      seconds: 22,
      tempo: 68,
      melodyVoice: "flute",
      chords: [
        ["F2", "C3", "A3"],
        ["C3", "G3", "E4"],
        ["D3", "A3", "F#4"],
        ["A#2", "F3", "D4"],
      ],
      melody: [
        ["F5", 2],
        ["G5", 1],
        ["A5", 3],
        [null, 2],
        ["G5", 2],
        ["F5", 2],
        ["E5", 4],
        ["D5", 2],
        ["F5", 2],
        ["G5", 2],
        [null, 2],
        ["F5", 2],
        ["E5", 2],
        ["D5", 4],
      ],
      drums: "none",
      bells: true,
      padGain: 0.13,
    },
  },
  {
    file: "countdown.wav",
    // Ticking, expectant build-up for the countdown.
    session: {
      seconds: 20,
      tempo: 84,
      melodyVoice: "pluck",
      chords: [
        ["A2", "E3", "C4"],
        ["F2", "C3", "A3"],
        ["C3", "G3", "E4"],
        ["G2", "D3", "B3"],
      ],
      melody: [
        ["A4", 1],
        ["C5", 1],
        ["E5", 1],
        ["A5", 1],
        [null, 1],
        ["G5", 1],
        ["E5", 1],
        ["C5", 1],
        ["F5", 1],
        ["A5", 1],
        ["C6", 1],
        ["A5", 1],
        ["G5", 2],
        ["E5", 2],
        ["D5", 2],
        ["C5", 2],
      ],
      drums: "soft",
      bells: true,
      padGain: 0.1,
    },
  },
  {
    file: "story.wav",
    // Nostalgic, reflective — the love story timeline.
    session: {
      seconds: 22,
      tempo: 74,
      melodyVoice: "pluck",
      chords: [
        ["F2", "C3", "A3"],
        ["C3", "G3", "E4"],
        ["D3", "A3", "F#4"],
        ["A#2", "F3", "D4"],
      ],
      melody: [
        ["C5", 2],
        ["D5", 2],
        ["F5", 3],
        [null, 1],
        ["E5", 2],
        ["D5", 2],
        ["C5", 4],
        ["A4", 2],
        ["C5", 2],
        ["D5", 2],
        [null, 2],
        ["C5", 4],
        ["A4", 4],
      ],
      drums: "soft",
      bells: false,
      padGain: 0.12,
    },
  },
  {
    file: "gallery.wav",
    // Bright, lighthearted — the photo gallery.
    session: {
      seconds: 20,
      tempo: 104,
      melodyVoice: "pluck",
      chords: [
        ["G2", "D3", "B3"],
        ["D3", "A3", "F#4"],
        ["E3", "B3", "G4"],
        ["C3", "G3", "E4"],
      ],
      melody: [
        ["G4", 1],
        ["B4", 1],
        ["D5", 1],
        ["G5", 2],
        ["F#5", 1],
        ["D5", 1],
        ["E5", 2],
        [null, 2],
        ["B4", 1],
        ["D5", 1],
        ["G5", 1],
        ["A5", 2],
        ["G5", 1],
        ["E5", 1],
        ["D5", 2],
        [null, 2],
      ],
      drums: "soft",
      bells: true,
      padGain: 0.08,
    },
  },
  {
    file: "celebration.wav",
    // Jubilant send-off — venue, RSVP and the closing thank-you.
    session: {
      seconds: 22,
      tempo: 116,
      melodyVoice: "pluck",
      chords: [
        ["C3", "G3", "E4"],
        ["G2", "D3", "B3"],
        ["A2", "E3", "C4"],
        ["F2", "C3", "A3"],
      ],
      melody: [
        ["C5", 1],
        ["E5", 1],
        ["G5", 1],
        ["C6", 1],
        ["B5", 1],
        ["G5", 1],
        ["A5", 1],
        ["C6", 1],
        ["G5", 2],
        ["E5", 1],
        ["G5", 1],
        ["F5", 1],
        ["A5", 1],
        ["G5", 4],
      ],
      drums: "party",
      bells: true,
      padGain: 0.08,
    },
  },
];

/* ------------------------------------------------------------------ */
mkdirSync(OUT_DIR, { recursive: true });

TRACKS.forEach(({ file, session }) => {
  const buffer = renderTrack(session);
  const wav = encodeWav(buffer);
  writeFileSync(resolve(OUT_DIR, file), wav);
  console.log(
    `  ${file.padEnd(24)} ${(wav.length / 1024).toFixed(0)} KB · ${session.seconds}s · ${session.tempo} BPM`,
  );
});

console.log(
  `\nDone. ${TRACKS.length} clips written to public/audio (${SAMPLE_RATE} Hz mono WAV).`,
);
