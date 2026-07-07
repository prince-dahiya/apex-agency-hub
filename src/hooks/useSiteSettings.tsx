import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES, ServiceKey, SERVICE_KEYS } from "@/lib/services";

export type ServiceOverride = { label?: string; tagline?: string; description?: string };
export type StatItem = { value: string; label: string };
export type ThemeSettings = {
  primary?: string;
  primaryGlow?: string;
  accent?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  card?: string;
  muted?: string;
  border?: string;
  radius?: string;        // e.g. "0.5rem"
  headingFont?: string;
  bodyFont?: string;
  monoFont?: string;
  gradientFrom?: string;  // HSL
  gradientVia?: string;
  gradientTo?: string;
  layoutDensity?: "compact" | "balanced" | "spacious";
  contentWidth?: "focused" | "wide" | "full";
  cardDepth?: "flat" | "soft" | "deep";
  animationMode?: "none" | "calm" | "premium" | "cinematic";
  animationIntensity?: string;
  hero3d?: "on" | "off";
  texture?: "on" | "off";
};

export type LeadField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string;
};

export type HeroSettings = {
  badge?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  tagline?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
};

export type SiteSettings = {
  services: Partial<Record<ServiceKey, ServiceOverride>>;
  stats: StatItem[];
  theme: ThemeSettings;
  hero: HeroSettings;
  leadFields: LeadField[];
};

const DEFAULTS: SiteSettings = { services: {}, stats: [], theme: {}, hero: {}, leadFields: [] };

const Ctx = createContext<{
  settings: SiteSettings;
  reload: () => Promise<void>;
  getService: (k: ServiceKey) => { label: string; tagline: string; description: string };
}>({
  settings: DEFAULTS,
  reload: async () => {},
  getService: (k) => SERVICES[k],
});

const loadGoogleFont = (name?: string) => {
  if (!name) return;
  const id = `gf-${name.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap`;
  document.head.appendChild(link);
};

const applyTheme = (theme: ThemeSettings) => {
  const root = document.documentElement;
  const map: Array<[keyof ThemeSettings, string]> = [
    ["primary", "--primary"],
    ["primaryGlow", "--primary-glow"],
    ["accent", "--accent"],
    ["secondary", "--secondary"],
    ["background", "--background"],
    ["foreground", "--foreground"],
    ["card", "--card"],
    ["muted", "--muted"],
    ["border", "--border"],
  ];
  map.forEach(([k, css]) => {
    const v = theme[k];
    if (v) root.style.setProperty(css, v);
    else root.style.removeProperty(css);
  });

  if (theme.radius) root.style.setProperty("--radius", theme.radius);
  else root.style.removeProperty("--radius");

  if (theme.gradientFrom || theme.gradientVia || theme.gradientTo) {
    const from = theme.gradientFrom || "38 78% 58%";
    const via = theme.gradientVia || "42 95% 68%";
    const to = theme.gradientTo || "14 65% 55%";
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, hsl(${from}), hsl(${via}) 50%, hsl(${to}))`,
    );
    root.style.setProperty(
      "--gradient-text",
      `linear-gradient(135deg, hsl(${from}), hsl(${via}) 45%, hsl(${to}))`,
    );
  }

  const dataset = root.dataset;
  dataset.layoutDensity = theme.layoutDensity || "balanced";
  dataset.contentWidth = theme.contentWidth || "wide";
  dataset.cardDepth = theme.cardDepth || "deep";
  dataset.animationMode = theme.animationMode || "premium";
  dataset.hero3d = theme.hero3d || "on";
  dataset.texture = theme.texture || "on";
  root.style.setProperty("--animation-intensity", theme.animationIntensity || "1");

  if (theme.headingFont) {
    loadGoogleFont(theme.headingFont);
    root.style.setProperty("--font-heading", `'${theme.headingFont}', serif`);
    document.body.style.setProperty("--font-heading-active", `'${theme.headingFont}'`);
    // override heading rule
    let style = document.getElementById("dyn-heading-font") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "dyn-heading-font";
      document.head.appendChild(style);
    }
    style.innerHTML = `h1,h2,h3,h4,h5,.font-serif-display,.font-elegant{font-family:'${theme.headingFont}',serif !important;}`;
  }
  if (theme.bodyFont) {
    loadGoogleFont(theme.bodyFont);
    root.style.setProperty("--font-body", `'${theme.bodyFont}', system-ui, sans-serif`);
    let style = document.getElementById("dyn-body-font") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "dyn-body-font";
      document.head.appendChild(style);
    }
    style.innerHTML = `body{font-family:'${theme.bodyFont}',system-ui,sans-serif !important;}`;
  }
  if (theme.monoFont) {
    loadGoogleFont(theme.monoFont);
    let style = document.getElementById("dyn-mono-font") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "dyn-mono-font";
      document.head.appendChild(style);
    }
    style.innerHTML = `.font-mono-sharp,.font-mono{font-family:'${theme.monoFont}',monospace !important;}`;
  }
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  const reload = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value");
    const next: SiteSettings = { ...DEFAULTS };
    (data || []).forEach((row: any) => {
      if (row.key === "services") next.services = row.value || {};
      else if (row.key === "stats") next.stats = Array.isArray(row.value) ? row.value : [];
      else if (row.key === "theme") next.theme = row.value || {};
      else if (row.key === "hero") next.hero = row.value || {};
      else if (row.key === "leadFields") next.leadFields = Array.isArray(row.value) ? row.value : [];
    });
    setSettings(next);
    applyTheme(next.theme);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const getService = (k: ServiceKey) => {
    const base = SERVICES[k];
    const o = settings.services[k] || {};
    return {
      label: o.label ?? base.label,
      tagline: o.tagline ?? base.tagline,
      description: o.description ?? base.description,
    };
  };

  return <Ctx.Provider value={{ settings, reload, getService }}>{children}</Ctx.Provider>;
};

export const useSiteSettings = () => useContext(Ctx);
export { SERVICE_KEYS };

// Preset themes that admin can apply with one click.
export const THEME_PRESETS: Array<{ name: string; theme: ThemeSettings }> = [
  {
    name: "Heritage Gold (default)",
    theme: {
      primary: "38 78% 58%", primaryGlow: "42 95% 68%",
      accent: "320 85% 62%", secondary: "158 55% 32%",
      background: "28 22% 7%", foreground: "38 35% 92%",
      card: "28 20% 10%", muted: "28 18% 14%", border: "38 25% 22%",
      radius: "0.5rem",
      headingFont: "Fraunces", bodyFont: "Inter", monoFont: "JetBrains Mono",
      gradientFrom: "38 78% 58%", gradientVia: "42 95% 68%", gradientTo: "14 65% 55%",
    },
  },
  {
    name: "Midnight Indigo",
    theme: {
      primary: "243 75% 65%", primaryGlow: "260 90% 75%",
      accent: "190 95% 55%", secondary: "220 40% 28%",
      background: "232 35% 6%", foreground: "220 25% 95%",
      card: "232 28% 10%", muted: "232 20% 14%", border: "232 25% 20%",
      radius: "0.75rem",
      headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      gradientFrom: "243 75% 65%", gradientVia: "260 90% 70%", gradientTo: "190 95% 55%",
    },
  },
  {
    name: "Editorial Paper",
    theme: {
      primary: "12 78% 45%", primaryGlow: "20 80% 55%",
      accent: "200 70% 38%", secondary: "30 30% 35%",
      background: "38 35% 95%", foreground: "28 30% 12%",
      card: "38 30% 92%", muted: "38 20% 88%", border: "28 20% 80%",
      radius: "0.25rem",
      headingFont: "Playfair Display", bodyFont: "Lora", monoFont: "IBM Plex Mono",
      gradientFrom: "12 78% 45%", gradientVia: "20 80% 55%", gradientTo: "200 70% 38%",
    },
  },
  {
    name: "Neon Mint",
    theme: {
      primary: "160 90% 55%", primaryGlow: "175 95% 65%",
      accent: "300 90% 65%", secondary: "200 60% 35%",
      background: "210 40% 5%", foreground: "160 30% 95%",
      card: "210 30% 8%", muted: "210 25% 13%", border: "200 30% 22%",
      radius: "1rem",
      headingFont: "Sora", bodyFont: "Manrope", monoFont: "JetBrains Mono",
      gradientFrom: "160 90% 55%", gradientVia: "175 95% 65%", gradientTo: "300 90% 65%",
    },
  },
  {
    name: "Luxury Noir",
    theme: {
      primary: "45 85% 58%", primaryGlow: "50 95% 70%",
      accent: "0 0% 92%", secondary: "0 0% 25%",
      background: "0 0% 5%", foreground: "45 25% 95%",
      card: "0 0% 8%", muted: "0 0% 12%", border: "45 25% 22%",
      radius: "0rem",
      headingFont: "Cormorant Garamond", bodyFont: "Karla", monoFont: "Space Mono",
      gradientFrom: "45 85% 58%", gradientVia: "50 95% 70%", gradientTo: "38 75% 50%",
    },
  },
  {
    name: "Ocean Deep",
    theme: {
      primary: "195 80% 50%", primaryGlow: "180 85% 60%",
      accent: "340 85% 65%", secondary: "210 55% 30%",
      background: "210 50% 8%", foreground: "195 30% 95%",
      card: "210 40% 11%", muted: "210 30% 15%", border: "210 30% 22%",
      radius: "0.5rem",
      headingFont: "Outfit", bodyFont: "Figtree", monoFont: "JetBrains Mono",
      gradientFrom: "195 80% 50%", gradientVia: "180 85% 60%", gradientTo: "340 85% 65%",
    },
  },
];
