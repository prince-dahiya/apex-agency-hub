import { useEffect, useState } from "react";
import { Mail, MessageCircle, Instagram, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_KEYS } from "@/lib/services";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { z } from "zod";

const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: "+91", label: "🇮🇳 India (+91)" },
  { code: "+1", label: "🇺🇸 USA / Canada (+1)" },
  { code: "+44", label: "🇬🇧 United Kingdom (+44)" },
  { code: "+61", label: "🇦🇺 Australia (+61)" },
  { code: "+64", label: "🇳🇿 New Zealand (+64)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+966", label: "🇸🇦 Saudi Arabia (+966)" },
  { code: "+974", label: "🇶🇦 Qatar (+974)" },
  { code: "+973", label: "🇧🇭 Bahrain (+973)" },
  { code: "+965", label: "🇰🇼 Kuwait (+965)" },
  { code: "+968", label: "🇴🇲 Oman (+968)" },
  { code: "+65", label: "🇸🇬 Singapore (+65)" },
  { code: "+60", label: "🇲🇾 Malaysia (+60)" },
  { code: "+62", label: "🇮🇩 Indonesia (+62)" },
  { code: "+66", label: "🇹🇭 Thailand (+66)" },
  { code: "+63", label: "🇵🇭 Philippines (+63)" },
  { code: "+84", label: "🇻🇳 Vietnam (+84)" },
  { code: "+852", label: "🇭🇰 Hong Kong (+852)" },
  { code: "+86", label: "🇨🇳 China (+86)" },
  { code: "+81", label: "🇯🇵 Japan (+81)" },
  { code: "+82", label: "🇰🇷 South Korea (+82)" },
  { code: "+880", label: "🇧🇩 Bangladesh (+880)" },
  { code: "+92", label: "🇵🇰 Pakistan (+92)" },
  { code: "+94", label: "🇱🇰 Sri Lanka (+94)" },
  { code: "+977", label: "🇳🇵 Nepal (+977)" },
  { code: "+975", label: "🇧🇹 Bhutan (+975)" },
  { code: "+960", label: "🇲🇻 Maldives (+960)" },
  { code: "+93", label: "🇦🇫 Afghanistan (+93)" },
  { code: "+98", label: "🇮🇷 Iran (+98)" },
  { code: "+90", label: "🇹🇷 Turkey (+90)" },
  { code: "+972", label: "🇮🇱 Israel (+972)" },
  { code: "+49", label: "🇩🇪 Germany (+49)" },
  { code: "+33", label: "🇫🇷 France (+33)" },
  { code: "+34", label: "🇪🇸 Spain (+34)" },
  { code: "+39", label: "🇮🇹 Italy (+39)" },
  { code: "+31", label: "🇳🇱 Netherlands (+31)" },
  { code: "+32", label: "🇧🇪 Belgium (+32)" },
  { code: "+41", label: "🇨🇭 Switzerland (+41)" },
  { code: "+43", label: "🇦🇹 Austria (+43)" },
  { code: "+351", label: "🇵🇹 Portugal (+351)" },
  { code: "+30", label: "🇬🇷 Greece (+30)" },
  { code: "+46", label: "🇸🇪 Sweden (+46)" },
  { code: "+47", label: "🇳🇴 Norway (+47)" },
  { code: "+45", label: "🇩🇰 Denmark (+45)" },
  { code: "+358", label: "🇫🇮 Finland (+358)" },
  { code: "+353", label: "🇮🇪 Ireland (+353)" },
  { code: "+352", label: "🇱🇺 Luxembourg (+352)" },
  { code: "+48", label: "🇵🇱 Poland (+48)" },
  { code: "+420", label: "🇨🇿 Czech Republic (+420)" },
  { code: "+36", label: "🇭🇺 Hungary (+36)" },
  { code: "+40", label: "🇷🇴 Romania (+40)" },
  { code: "+7", label: "🇷🇺 Russia (+7)" },
  { code: "+380", label: "🇺🇦 Ukraine (+380)" },
  { code: "+27", label: "🇿🇦 South Africa (+27)" },
  { code: "+234", label: "🇳🇬 Nigeria (+234)" },
  { code: "+254", label: "🇰🇪 Kenya (+254)" },
  { code: "+20", label: "🇪🇬 Egypt (+20)" },
  { code: "+212", label: "🇲🇦 Morocco (+212)" },
  { code: "+251", label: "🇪🇹 Ethiopia (+251)" },
  { code: "+233", label: "🇬🇭 Ghana (+233)" },
  { code: "+255", label: "🇹🇿 Tanzania (+255)" },
  { code: "+256", label: "🇺🇬 Uganda (+256)" },
  { code: "+52", label: "🇲🇽 Mexico (+52)" },
  { code: "+55", label: "🇧🇷 Brazil (+55)" },
  { code: "+54", label: "🇦🇷 Argentina (+54)" },
  { code: "+56", label: "🇨🇱 Chile (+56)" },
  { code: "+57", label: "🇨🇴 Colombia (+57)" },
  { code: "+51", label: "🇵🇪 Peru (+51)" },
];

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(80).optional(),
  message: z.string().trim().min(5).max(2000),
});

const todayISO = () => {
  const d = new Date();
  d.setDate(d.getDate());
  return d.toISOString().slice(0, 10);
};

const Contact = () => {
  const { settings, getService } = useSiteSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [extraAnswers, setExtraAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const extraFields = (settings.leadFields || []).filter((field) => field.label.trim());

  useEffect(() => { document.title = "Contact — Northstarr"; }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = form.phone.trim() ? `${form.countryCode === "+other" ? "" : form.countryCode} ${form.phone.trim()}`.trim() : "";
    const parsed = schema.safeParse({ ...form, phone: fullPhone });
    if (!parsed.success) {
      toast({ title: "Please check your form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    const missingField = extraFields.find((field) => field.required && !extraAnswers[field.id]?.trim());
    if (missingField) {
      toast({ title: "Please check your form", description: `${missingField.label} is required.`, variant: "destructive" });
      return;
    }

    const extraMessage = extraFields
      .map((field) => ({ label: field.label.trim(), answer: (extraAnswers[field.id] || "").trim() }))
      .filter((item) => item.answer)
      .map((item) => `${item.label}: ${item.answer}`)
      .join("\n");

    const availability = [
      form.preferredDate ? `Preferred date: ${form.preferredDate}` : "",
      form.preferredTime ? `Preferred time: ${form.preferredTime}` : "",
    ].filter(Boolean).join("\n");

    const finalMessage = [form.message.trim(), availability, extraMessage && `Extra client details:\n${extraMessage}`]
      .filter(Boolean)
      .join("\n\n");

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: fullPhone || null,
      service: form.service || null,
      message: finalMessage,
    });

    if (!error) {
      // Fire-and-forget email notification to admin
      try {
        await supabase.functions.invoke("notify-lead", {
          body: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: fullPhone || null,
            service: form.service || null,
            preferredDate: form.preferredDate || null,
            preferredTime: form.preferredTime || null,
            message: form.message.trim(),
            extras: extraFields
              .map((field) => ({ label: field.label.trim(), answer: (extraAnswers[field.id] || "").trim() }))
              .filter((item) => item.answer),
          },
        });
      } catch (_) { /* no-op: lead is already stored */ }
    }

    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", countryCode: "+91", phone: "", service: "", preferredDate: "", preferredTime: "", message: "" });
      setExtraAnswers({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
        <h1 className="mt-3 font-display font-bold text-5xl md:text-6xl">Let's talk growth</h1>
        <p className="mt-5 text-muted-foreground text-lg">
          Free consultation. No pressure. Just a real conversation about your goals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <a href="https://wa.me/918683899730" target="_top" className="glow-border rounded-2xl p-6 flex items-center gap-4 hover-lift">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">Chat with us instantly</div>
            </div>
          </a>
          <a href="mailto:princedahiya605@gmail.com" className="glow-border rounded-2xl p-6 flex items-center gap-4 hover-lift">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-glow">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">princedahiya605@gmail.com</div>
            </div>
          </a>
          <a href="https://www.instagram.com/northstarr.co.in/" target="_top" className="glow-border rounded-2xl p-6 flex items-center gap-4 hover-lift">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-glow">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold">Instagram</div>
              <div className="text-sm text-muted-foreground">Follow our work</div>
            </div>
          </a>
          <div className="glow-border rounded-2xl p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold">Worldwide</div>
              <div className="text-sm text-muted-foreground">Serving clients globally</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="glow-border rounded-3xl p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={80} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={200} />
            </div>
          </div>

          <div>
            <Label>Phone</Label>
            <div className="grid grid-cols-[minmax(140px,180px)_1fr] gap-2">
              <Select value={form.countryCode} onValueChange={(v) => setForm({ ...form, countryCode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={20}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div>
            <Label>Service Interested In</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger><SelectValue placeholder="Choose a service…" /></SelectTrigger>
              <SelectContent>
                {SERVICE_KEYS.map((k) => (
                  <SelectItem key={k} value={getService(k).label}>{getService(k).label}</SelectItem>
                ))}
                {(settings.customServices || []).map((s) => (
                  <SelectItem key={s.id} value={s.label}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Best date to talk</Label>
              <Input
                type="date"
                min={todayISO()}
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Best time</Label>
              <Input
                type="time"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              />
            </div>
          </div>

          {extraFields.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {extraFields.map((field) => (
                <div key={field.id} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <Label>{field.label}{field.required ? " *" : ""}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={extraAnswers[field.id] || ""}
                      onChange={(e) => setExtraAnswers({ ...extraAnswers, [field.id]: e.target.value })}
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ""}
                      maxLength={1000}
                    />
                  ) : field.type === "select" ? (
                    <Select value={extraAnswers[field.id] || ""} onValueChange={(v) => setExtraAnswers({ ...extraAnswers, [field.id]: v })}>
                      <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                      <SelectContent>
                        {(field.options || "").split(",").map((option) => option.trim()).filter(Boolean).map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={extraAnswers[field.id] || ""}
                      onChange={(e) => setExtraAnswers({ ...extraAnswers, [field.id]: e.target.value })}
                      required={field.required}
                      placeholder={field.placeholder || ""}
                      maxLength={300}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div>
            <Label>Message *</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required maxLength={2000} placeholder="Tell us about your goals…" />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
