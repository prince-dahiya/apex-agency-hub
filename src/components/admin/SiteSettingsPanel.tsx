import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, SERVICE_KEYS, ServiceKey } from "@/lib/services";
import { useSiteSettings, ServiceOverride, StatItem, ThemeSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";

const upsert = async (key: string, value: any) => {
  const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
};

export const SiteSettingsPanel = () => {
  const { settings, reload } = useSiteSettings();
  const [services, setServices] = useState<Partial<Record<ServiceKey, ServiceOverride>>>({});
  const [stats, setStats] = useState<StatItem[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setServices(settings.services || {});
    setStats(settings.stats || []);
    setTheme(settings.theme || {});
  }, [settings]);

  const saveAll = async () => {
    setSaving(true);
    try {
      await upsert("services", services);
      await upsert("stats", stats);
      await upsert("theme", theme);
      await reload();
      toast({ title: "Saved", description: "Site settings updated." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
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

      {/* THEME */}
      <section className="glow-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold mb-1">Theme — colors & fonts</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Colors use HSL format like <code>38 78% 58%</code>. Fonts are any Google Font name (e.g. "Playfair Display", "Poppins").
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["primary", "Primary (accent gold)"],
            ["accent", "Accent (highlight)"],
            ["secondary", "Secondary"],
            ["background", "Background"],
            ["foreground", "Foreground (text)"],
          ].map(([k, label]) => (
            <div key={k}>
              <Label className="text-xs">{label}</Label>
              <Input
                placeholder="e.g. 38 78% 58%"
                value={(theme as any)[k] || ""}
                onChange={(e) => setTheme({ ...theme, [k]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label className="text-xs">Heading font (Google)</Label>
            <Input placeholder="Fraunces" value={theme.headingFont || ""} onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Body font (Google)</Label>
            <Input placeholder="Inter" value={theme.bodyFont || ""} onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Tip: open <a className="underline" href="https://hslpicker.com" target="_blank" rel="noreferrer">hslpicker.com</a> to grab HSL values.
        </p>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button variant="hero" size="lg" onClick={saveAll} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save all settings"}
        </Button>
      </div>
    </div>
  );
};
