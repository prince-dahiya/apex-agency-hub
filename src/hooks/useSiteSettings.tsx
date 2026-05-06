import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES, ServiceKey, SERVICE_KEYS } from "@/lib/services";

export type ServiceOverride = { label?: string; tagline?: string; description?: string };
export type StatItem = { value: string; label: string };
export type ThemeSettings = {
  primary?: string;        // HSL "H S% L%"
  accent?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  headingFont?: string;    // google font name
  bodyFont?: string;
};

export type SiteSettings = {
  services: Partial<Record<ServiceKey, ServiceOverride>>;
  stats: StatItem[];
  theme: ThemeSettings;
};

const DEFAULTS: SiteSettings = { services: {}, stats: [], theme: {} };

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
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

const applyTheme = (theme: ThemeSettings) => {
  const root = document.documentElement;
  if (theme.primary) root.style.setProperty("--primary", theme.primary);
  if (theme.accent) root.style.setProperty("--accent", theme.accent);
  if (theme.secondary) root.style.setProperty("--secondary", theme.secondary);
  if (theme.background) root.style.setProperty("--background", theme.background);
  if (theme.foreground) root.style.setProperty("--foreground", theme.foreground);

  if (theme.headingFont) {
    loadGoogleFont(theme.headingFont);
    root.style.setProperty("--font-heading", `'${theme.headingFont}', serif`);
  }
  if (theme.bodyFont) {
    loadGoogleFont(theme.bodyFont);
    root.style.setProperty("--font-body", `'${theme.bodyFont}', system-ui, sans-serif`);
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
