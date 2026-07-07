import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, SERVICE_KEYS, ServiceKey } from "@/lib/services";
import {
  useSiteSettings,
  ServiceOverride,
  StatItem,
  ThemeSettings,
  HeroSettings,
  LeadField,
  THEME_PRESETS,
} from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, RotateCcw, Sparkles, Wand2, FormInput, Layers3, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const upsert = async (key: string, value: any) => {
  const { error } = await supabase.from("site_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  if (error) throw error;
};

const POPULAR_FONTS = [
  "Fraunces", "Playfair Display", "Cormorant Garamond", "DM Serif Display",
  "Instrument Serif", "Libre Baskerville", "Lora", "Abril Fatface",
  "Inter", "DM Sans", "Manrope", "Figtree", "Outfit", "Sora",
  "Space Grotesk", "Poppins", "Karla", "Work Sans", "Nunito Sans",
  "Bebas Neue", "Archivo Black", "Syne", "Urbanist", "Plus Jakarta Sans",
  "JetBrains Mono", "Space Mono", "IBM Plex Mono",
];

export const SiteSettingsPanel = () => {
  const { settings, reload } = useSiteSettings();
  const [services, setServices] = useState<Partial<Record<ServiceKey, ServiceOverride>>>({});
  const [stats, setStats] = useState<StatItem[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>({});
  const [hero, setHero] = useState<HeroSettings>({});
  const [leadFields, setLeadFields] = useState<LeadField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setServices(settings.services || {});
    setStats(settings.stats || []);
    setTheme(settings.theme || {});
    setHero(settings.hero || {});
    setLeadFields(settings.leadFields || []);
  }, [settings]);

  const saveAll = async () => {
    setSaving(true);
    try {
      await upsert("services", services);
      await upsert("stats", stats);
      await upsert("theme", theme);
      await upsert("hero", hero);
      await upsert("leadFields", leadFields);
      await reload();
      toast({ title: "Saved", description: "Site settings updated." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = async () => {
    if (!confirm("Reset the entire theme to default? This clears all color/font customizations.")) return;
    setTheme({});
    await upsert("theme", {});
    await reload();
    toast({ title: "Theme reset", description: "Back to default." });
  };

  const applyPreset = (t: ThemeSettings) => setTheme(t);

  const addLeadField = () => setLeadFields([
    ...leadFields,
    { id: `field_${Date.now()}`, label: "", type: "text", required: false, placeholder: "" },
  ]);

  const updateLeadField = (i: number, patch: Partial<LeadField>) => {
    const next = [...leadFields];
    next[i] = { ...next[i], ...patch };
    setLeadFields(next);
  };

  const colorFields: Array<[keyof ThemeSettings, string]> = [
    ["primary", "Primary (main accent)"],
    ["primaryGlow", "Primary glow"],
    ["accent", "Accent (highlight)"],
    ["secondary", "Secondary"],
    ["background", "Background"],
    ["foreground", "Foreground / text"],
    ["card", "Card surface"],
    ["muted", "Muted surface"],
    ["border", "Border"],
    ["gradientFrom", "Gradient — from"],
    ["gradientVia", "Gradient — via"],
    ["gradientTo", "Gradient — to"],
  ];

  return (
    <div className="space-y-10">
      {/* PRESETS */}
      <section className="glow-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> One-click theme presets
          </h2>
          <Button size="sm" variant="outline" onClick={resetTheme}>
            <RotateCcw className="h-4 w-4 mr-1" /> Reset to default
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Click a preset to load it into the editor below, then hit "Save all settings".
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.theme)}
              className="group rounded-lg border border-border p-4 text-left hover:border-primary transition-colors"
              type="button"
            >
              <div className="flex gap-1 mb-3">
                {(["primary", "accent", "secondary", "background", "foreground"] as const).map((k) => (
                  <span
                    key={k}
                    className="h-6 w-6 rounded"
                    style={{ background: `hsl(${p.theme[k]})` }}
                  />
                ))}
              </div>
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {p.theme.headingFont} · {p.theme.bodyFont}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* APPEARANCE */}
      <section className="glow-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" /> Full appearance control
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Control the whole site's spacing, width, depth, texture, and 3D animation style.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Page spacing</Label>
            <Select value={theme.layoutDensity || "balanced"} onValueChange={(v) => setTheme({ ...theme, layoutDensity: v as ThemeSettings["layoutDensity"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Content width</Label>
            <Select value={theme.contentWidth || "wide"} onValueChange={(v) => setTheme({ ...theme, contentWidth: v as ThemeSettings["contentWidth"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="focused">Focused</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Card depth</Label>
            <Select value={theme.cardDepth || "deep"} onValueChange={(v) => setTheme({ ...theme, cardDepth: v as ThemeSettings["cardDepth"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
                <SelectItem value="deep">Deep 3D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div>
            <Label className="text-xs">Motion style</Label>
            <Select value={theme.animationMode || "premium"} onValueChange={(v) => setTheme({ ...theme, animationMode: v as ThemeSettings["animationMode"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No animation</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="cinematic">Cinematic 3D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Animation intensity: {theme.animationIntensity || "1"}</Label>
            <Input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={theme.animationIntensity || "1"}
              onChange={(e) => setTheme({ ...theme, animationIntensity: e.target.value })}
            />
          </div>
          <div className="grid gap-3 rounded-lg border border-border p-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4 text-primary" /> 3D hero animations</span>
              <Switch checked={(theme.hero3d || "on") === "on"} onCheckedChange={(checked) => setTheme({ ...theme, hero3d: checked ? "on" : "off" })} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Texture/grain overlay</span>
              <Switch checked={(theme.texture || "on") === "on"} onCheckedChange={(checked) => setTheme({ ...theme, texture: checked ? "on" : "off" })} />
            </label>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="glow-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold mb-1">Homepage hero copy</h2>
        <p className="text-sm text-muted-foreground mb-5">Leave any field blank to keep the default.</p>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Top badge text</Label>
            <Input value={hero.badge || ""} placeholder="Est. — Premium Digital Atelier"
              onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Brand tagline (under headline)</Label>
            <Input value={hero.tagline || ""} placeholder="⁂ Northstarr ⁂"
              onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Headline line 1</Label>
            <Input value={hero.line1 || ""} placeholder="Grow Online."
              onChange={(e) => setHero({ ...hero, line1: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Headline line 2 (gradient)</Label>
            <Input value={hero.line2 || ""} placeholder="Look Professional."
              onChange={(e) => setHero({ ...hero, line2: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Headline line 3</Label>
            <Input value={hero.line3 || ""} placeholder="Convert More."
              onChange={(e) => setHero({ ...hero, line3: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Subtitle paragraph</Label>
            <Textarea rows={2} value={hero.subtitle || ""}
              placeholder="We blend timeless craft with modern technology…"
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Primary CTA label</Label>
            <Input value={hero.ctaPrimary || ""} placeholder="Book Free Consultation"
              onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Secondary CTA label</Label>
            <Input value={hero.ctaSecondary || ""} placeholder="View Our Work"
              onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="glow-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold mb-1">Services & bios</h2>
        <p className="text-sm text-muted-foreground mb-5">Edit name, tagline & description shown on the site.</p>
        <div className="grid gap-5">
          {SERVICE_KEYS.map((key) => {
            const base = SERVICES[key];
            const o = services[key] || {};
            const set = (patch: Partial<ServiceOverride>) =>
              setServices({ ...services, [key]: { ...o, ...patch } });
            return (
              <div key={key} className="rounded-lg border border-border p-4 grid md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input value={o.label ?? base.label} onChange={(e) => set({ label: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Tagline</Label>
                  <Input value={o.tagline ?? base.tagline} onChange={(e) => set({ tagline: e.target.value })} />
                </div>
                <div className="md:col-span-3">
                  <Label className="text-xs">Description / bio</Label>
                  <Textarea rows={2} value={o.description ?? base.description} onChange={(e) => set({ description: e.target.value })} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="glow-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-2xl font-bold">Homepage stats</h2>
          <Button size="sm" variant="outline" onClick={() => setStats([...stats, { value: "", label: "" }])}>
            <Plus className="h-4 w-4 mr-1" /> Add stat
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">Leave empty to hide the stats section entirely.</p>
        <div className="grid gap-3">
          {stats.length === 0 && <p className="text-sm text-muted-foreground">No stats — section hidden.</p>}
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
              <div>
                <Label className="text-xs">Value</Label>
                <Input value={s.value} placeholder="120+" onChange={(e) => {
                  const next = [...stats]; next[i] = { ...s, value: e.target.value }; setStats(next);
                }} />
              </div>
              <div>
                <Label className="text-xs">Label</Label>
                <Input value={s.label} placeholder="Happy Clients" onChange={(e) => {
                  const next = [...stats]; next[i] = { ...s, label: e.target.value }; setStats(next);
                }} />
              </div>
              <Button size="sm" variant="outline" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENT FORM FIELDS */}
      <section className="glow-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <FormInput className="h-5 w-5 text-primary" /> Client enquiry fields
          </h2>
          <Button size="sm" variant="outline" onClick={addLeadField}>
            <Plus className="h-4 w-4 mr-1" /> Add field
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Add extra questions to the contact form. Client answers are added to the lead message in admin.
        </p>
        <div className="grid gap-4">
          {leadFields.length === 0 && <p className="text-sm text-muted-foreground">No extra fields — contact form uses the default fields only.</p>}
          {leadFields.map((field, i) => (
            <div key={field.id} className="rounded-lg border border-border p-4 grid md:grid-cols-[1.1fr_0.8fr_1.2fr_auto] gap-3 items-end">
              <div>
                <Label className="text-xs">Field label</Label>
                <Input value={field.label} placeholder="Budget range" onChange={(e) => updateLeadField(i, { label: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={field.type} onValueChange={(v) => updateLeadField(i, { type: v as LeadField["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Short answer</SelectItem>
                    <SelectItem value="textarea">Long answer</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Placeholder / dropdown options</Label>
                <Input
                  value={field.type === "select" ? field.options || "" : field.placeholder || ""}
                  placeholder={field.type === "select" ? "Option 1, Option 2, Option 3" : "Type here…"}
                  onChange={(e) => updateLeadField(i, field.type === "select" ? { options: e.target.value } : { placeholder: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 pb-2">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox checked={!!field.required} onCheckedChange={(checked) => updateLeadField(i, { required: checked === true })} />
                  Required
                </label>
                <Button size="sm" variant="outline" onClick={() => setLeadFields(leadFields.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THEME */}
      <section className="glow-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold mb-1">Custom colors, fonts & shape</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Colors use HSL format like <code>38 78% 58%</code> (no commas, no <code>hsl()</code>).
          Tip: <a className="underline" href="https://hslpicker.com" target="_blank" rel="noreferrer">hslpicker.com</a>.
        </p>

        <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-primary">Colors</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {colorFields.map(([k, label]) => (
            <div key={k}>
              <Label className="text-xs">{label}</Label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="e.g. 38 78% 58%"
                  value={(theme as any)[k] || ""}
                  onChange={(e) => setTheme({ ...theme, [k]: e.target.value })}
                />
                <span
                  className="h-9 w-9 rounded border border-border shrink-0"
                  style={{ background: (theme as any)[k] ? `hsl(${(theme as any)[k]})` : "transparent" }}
                />
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-sm uppercase tracking-wider mt-8 mb-3 text-primary">Shape</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Corner radius</Label>
            <Input placeholder="0.5rem" value={theme.radius || ""}
              onChange={(e) => setTheme({ ...theme, radius: e.target.value })} />
            <p className="text-[10px] text-muted-foreground mt-1">0rem = sharp, 1rem = pill-soft, 1.5rem = very rounded</p>
          </div>
        </div>

        <h3 className="font-semibold text-sm uppercase tracking-wider mt-8 mb-3 text-primary">Fonts (Google Fonts)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            ["headingFont", "Heading font"],
            ["bodyFont", "Body font"],
            ["monoFont", "Mono / accent font"],
          ].map(([k, label]) => (
            <div key={k}>
              <Label className="text-xs">{label}</Label>
              <Input
                list={`fonts-${k}`}
                placeholder={k === "headingFont" ? "Fraunces" : k === "bodyFont" ? "Inter" : "JetBrains Mono"}
                value={(theme as any)[k] || ""}
                onChange={(e) => setTheme({ ...theme, [k]: e.target.value } as ThemeSettings)}
              />
              <datalist id={`fonts-${k}`}>
                {POPULAR_FONTS.map((f) => <option key={f} value={f} />)}
              </datalist>
              {(theme as any)[k] && (
                <p className="mt-2 text-lg" style={{ fontFamily: `'${(theme as any)[k]}'` }}>
                  Aa — The quick brown fox
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end gap-2">
        <Button variant="hero" size="lg" onClick={saveAll} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save all settings"}
        </Button>
      </div>
    </div>
  );
};
