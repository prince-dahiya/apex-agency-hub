import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Zap, TrendingUp, Star, Users, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_KEYS } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Users, value: "120+", label: "Happy Clients" },
  { icon: Award, value: "200+", label: "Projects Delivered" },
  { icon: TrendingUp, value: "5x", label: "Avg. Growth" },
  { icon: Star, value: "4.9", label: "Avg. Rating" },
];

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Apex Digital Solution — Grow Online. Look Professional. Convert More.";
    const meta = document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute("content",
      "Premium agency for website design, SEO, social media, video editing, branding & content creation.");
    if (!meta.parentNode) document.head.appendChild(meta);

    supabase.from("projects").select("*").eq("published", true).order("featured", { ascending: false }).order("display_order").limit(6).then(({ data }) => setProjects(data || []));
    supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6).then(({ data }) => setReviews(data || []));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Premium Digital Agency</span>
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight animate-fade-up delay-100">
            Grow Online.<br />
            <span className="text-gradient">Look Professional.</span><br />
            Convert More.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-200">
            Apex Digital Solution helps ambitious brands win the internet — websites, SEO, social,
            video, branding & content that actually drive results.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-300">
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">Book Free Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>

        {/* floating orbs */}
        <div className="absolute top-1/4 left-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl animate-float delay-500" />
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">What we do</p>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Services that move the needle</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_KEYS.map((key) => {
              const s = SERVICES[key];
              const Icon = s.icon;
              return (
                <Link
                  to="/services"
                  key={key}
                  className="glow-border rounded-2xl p-8 hover-lift group"
                >
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-glow mb-5`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl">{s.label}</h3>
                  <p className="mt-2 text-muted-foreground">{s.description}</p>
                  <div className="mt-5 inline-flex items-center text-sm text-primary group-hover:gap-2 gap-1 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Why Apex</p>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Built for results, not just looks.</h2>
            <p className="mt-5 text-muted-foreground text-lg">
              We blend strategy, design and growth marketing into one premium service. No fluff —
              just measurable outcomes.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Conversion-first design philosophy",
                "Transparent reporting & analytics",
                "Dedicated specialist per service",
                "Premium quality at honest pricing",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glow-border rounded-2xl p-6 text-center hover-lift">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-display font-bold text-3xl text-gradient">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      {projects.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Featured work</p>
                <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Recent projects</h2>
              </div>
              <Button asChild variant="outline"><Link to="/portfolio">View all</Link></Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <Link to={`/portfolio/${p.slug}`} key={p.id} className="group glow-border rounded-2xl overflow-hidden hover-lift">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary opacity-30" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-primary">{SERVICES[p.service_type as keyof typeof SERVICES]?.label}</p>
                    <h3 className="font-display font-semibold text-lg mt-1">{p.title}</h3>
                    {p.client_name && <p className="text-sm text-muted-foreground">{p.client_name}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Testimonials</p>
              <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Loved by clients</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="glow-border rounded-2xl p-6 hover-lift">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/90">"{r.comment}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    {r.photo_url && <img src={r.photo_url} alt={r.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />}
                    <div>
                      <div className="font-semibold text-sm">{r.name}</div>
                      {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 -z-10" />
            <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl md:text-5xl">Ready to grow?</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Let's craft a premium digital strategy that puts your brand ahead of the competition.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/contact">Book Your Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
