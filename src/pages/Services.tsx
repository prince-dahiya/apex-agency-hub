import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_KEYS } from "@/lib/services";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const features: Record<string, string[]> = {
  website_design: ["Custom premium design", "Mobile responsive", "SEO-ready", "Fast loading", "CMS-friendly", "Lead-capture optimized"],
  social_media: ["Content calendar", "Reels & posts", "Hashtag strategy", "Community management", "Monthly analytics", "Growth strategy"],
  video_editing: ["Cinematic edits", "Color grading", "Motion graphics", "Subtitles & captions", "Sound design", "Platform-optimized exports"],
  seo: ["Keyword research", "On-page SEO", "Technical SEO audit", "Backlink strategy", "Content optimization", "Monthly rank reports"],
  content_creation: ["Brand-aligned creatives", "Caption writing", "Carousel design", "Reel scripts", "Campaign assets", "Performance tracking"],
  branding: ["Logo design", "Brand identity system", "Color & typography", "Mockups & guidelines", "Social kit", "Packaging design"],
};

const Services = () => {
  const { getService } = useSiteSettings();
  useEffect(() => {
    document.title = "Services — Northstarr";
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Services</p>
        <h1 className="mt-3 font-display font-bold text-5xl md:text-6xl">Premium services for premium brands</h1>
        <p className="mt-5 text-muted-foreground text-lg">
          Pick what you need — or combine them into a complete growth engine.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICE_KEYS.map((key) => {
          const s = SERVICES[key];
          const o = getService(key);
          const Icon = s.icon;
          return (
            <div key={key} className="glow-border rounded-3xl p-8 hover-lift relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br ${s.gradient} opacity-20 blur-3xl`} />
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-glow`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-5 font-display font-bold text-2xl">{o.label}</h3>
              <p className="mt-2 text-muted-foreground">{o.description}</p>
              <ul className="mt-5 space-y-2">
                {features[key].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/contact">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
