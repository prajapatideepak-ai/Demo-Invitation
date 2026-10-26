/**
 * Theme system
 * ------------------------------------------------------------------
 * Four ready-made palettes. Every palette is expressed purely as CSS
 * custom properties, which are pushed onto <html> at runtime by
 * `applyTheme()`. Components never hardcode colours — they read the
 * semantic tokens (`--c-primary`, `--c-accent`, ...) through Tailwind
 * utilities such as `text-primary`, `bg-surface` or `border-line`.
 *
 * Switch the whole site's look by changing `weddingConfig.theme`.
 */

export type ThemeName = "royal" | "floral" | "minimal" | "mehendi";

export interface ThemeConfig {
  id: ThemeName;
  /** Human readable name, handy for a theme switcher / documentation. */
  label: string;
  description: string;
  /** Swatches (hex) for previews in a style guide or switcher. */
  palette: string[];
  /** CSS custom properties applied to the document root. */
  tokens: Record<string, string>;
}

const sharedTokens = {
  "--c-text-invert": "#fffdf9",
} satisfies Record<string, string>;

export const themes: Record<ThemeName, ThemeConfig> = {
  /* 1. Royal Indian — maroon, antique gold, ivory. The demo default. */
  royal: {
    id: "royal",
    label: "Royal Indian",
    description: "Maroon, antique gold and ivory with palace-inspired ornaments.",
    palette: ["#7b1224", "#c8952f", "#fdf8f1", "#4e0817"],
    tokens: {
      "--c-bg": "#fdf8f1",
      "--c-bg-alt": "#f6ead6",
      "--c-surface": "#fffdf9",
      "--c-primary": "#7b1224",
      "--c-primary-dark": "#4e0817",
      "--c-primary-soft": "#f0d8d3",
      "--c-accent": "#c8952f",
      "--c-accent-soft": "#f6e7c4",
      "--c-gold": "#c8952f",
      "--c-gold-soft": "#e3c88b",
      "--c-text": "#3a2318",
      "--c-text-soft": "#7a6355",
      "--c-border": "rgba(200, 149, 47, 0.38)",
      "--c-overlay": "rgba(78, 8, 23, 0.62)",
      "--c-glow": "rgba(200, 149, 47, 0.35)",
      "--pattern-opacity": "0.45",
      ...sharedTokens,
    },
  },

  /* 2. Floral Romance — blush pink, cream and rose. */
  floral: {
    id: "floral",
    label: "Floral Romance",
    description: "Blush pink, cream and rose with soft floral decorations.",
    palette: ["#b4566f", "#c98b7a", "#fffafc", "#8a3a52"],
    tokens: {
      "--c-bg": "#fffafc",
      "--c-bg-alt": "#fdeef3",
      "--c-surface": "#ffffff",
      "--c-primary": "#b4566f",
      "--c-primary-dark": "#8a3a52",
      "--c-primary-soft": "#fbe0e8",
      "--c-accent": "#c98b7a",
      "--c-accent-soft": "#f9e6de",
      "--c-gold": "#cf9f6a",
      "--c-gold-soft": "#ecd3b8",
      "--c-text": "#4a2d34",
      "--c-text-soft": "#8b6f75",
      "--c-border": "rgba(185, 138, 94, 0.34)",
      "--c-overlay": "rgba(138, 58, 82, 0.48)",
      "--c-glow": "rgba(180, 86, 111, 0.32)",
      "--pattern-opacity": "0.35",
      ...sharedTokens,
    },
  },

  /* 3. Modern Minimalist — white, beige, champagne. */
  minimal: {
    id: "minimal",
    label: "Modern Minimalist",
    description: "White, beige and champagne with clean typography.",
    palette: ["#2f2a26", "#b99a6b", "#fbfaf7", "#eae5dd"],
    tokens: {
      "--c-bg": "#fbfaf7",
      "--c-bg-alt": "#f2efe9",
      "--c-surface": "#ffffff",
      "--c-primary": "#2f2a26",
      "--c-primary-dark": "#171412",
      "--c-primary-soft": "#eae5dd",
      "--c-accent": "#b99a6b",
      "--c-accent-soft": "#f1e9dc",
      "--c-gold": "#b99a6b",
      "--c-gold-soft": "#ded0b6",
      "--c-text": "#2f2a26",
      "--c-text-soft": "#6f665c",
      "--c-border": "rgba(185, 154, 107, 0.42)",
      "--c-overlay": "rgba(23, 20, 18, 0.5)",
      "--c-glow": "rgba(47, 42, 38, 0.22)",
      "--pattern-opacity": "0.28",
      ...sharedTokens,
    },
  },

  /* 4. Mehendi Garden — emerald, sage and gold. */
  mehendi: {
    id: "mehendi",
    label: "Mehendi Garden",
    description: "Emerald, sage and gold with botanical illustrations.",
    palette: ["#1f5c3f", "#c2a24a", "#f7faf5", "#123a28"],
    tokens: {
      "--c-bg": "#f7faf5",
      "--c-bg-alt": "#e8f0e3",
      "--c-surface": "#ffffff",
      "--c-primary": "#1f5c3f",
      "--c-primary-dark": "#123a28",
      "--c-primary-soft": "#dcebe0",
      "--c-accent": "#c2a24a",
      "--c-accent-soft": "#f1e8c9",
      "--c-gold": "#c2a24a",
      "--c-gold-soft": "#ddc98d",
      "--c-text": "#26382c",
      "--c-text-soft": "#5f7264",
      "--c-border": "rgba(31, 92, 63, 0.26)",
      "--c-overlay": "rgba(18, 58, 40, 0.5)",
      "--c-glow": "rgba(31, 92, 63, 0.26)",
      "--pattern-opacity": "0.4",
      ...sharedTokens,
    },
  },
};

export const defaultTheme: ThemeName = "royal";

export const themeList: ThemeConfig[] = Object.values(themes);

/**
 * Push a palette onto the document root as CSS custom properties.
 * Safe to call on every render — it is a no-op when the palette is
 * already applied.
 */
export function applyTheme(name: ThemeName, target?: HTMLElement): void {
  const root = target ?? document.documentElement;
  const theme = themes[name] ?? themes[defaultTheme];

  root.setAttribute("data-theme", theme.id);
  Object.entries(theme.tokens).forEach(([token, value]) => {
    root.style.setProperty(token, value);
  });
}
