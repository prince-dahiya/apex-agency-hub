import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Zap, Star, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_KEYS } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";
import leafOrnament from "@/assets/leaf-ornament.png";


const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
} as const;

const Home = () => {
  const { getService, settings } = useSiteSettings();
  const stats = settings.stats || [];
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
      {/* HERO — heritage masthead × modern motion */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" />

        {/* floating botanical ornaments */}
        <motion.img
          src={leafOrnament} alt="" aria-hidden loading="lazy"
          className="absolute top-10 left-0 w-64 md:w-96 opacity-25 -rotate-12 pointer-events-none -z-10"
          animate={{ y: [0, -14, 0], rotate: [-12, -8, -12] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={leafOrnament} alt="" aria-hidden loading="lazy"
          className="absolute bottom-10 right-0 w-64 md:w-96 opacity-25 rotate-180 pointer-events-none -z-10"
          animate={{ y: [0, 14, 0], rotate: [180, 175, 180] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center relative">
          {/* spinning conic ring badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full">
              <span className="absolute inset-0 rounded-full ring-conic opacity-70 blur-[1px]" />
              <span className="relative h-8 w-8 rounded-full bg-background flex items-center justify-center">
                <Compass className="h-4 w-4 text-primary" />
              </span>
            </span>
            <span className="font-mono-sharp text-[11px] tracking-[0.3em] uppercase text-primary/90">
              Est. — Premium Digital Atelier
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="show" variants={fadeUp}
            className="font-serif-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[0.95] tracking-tight"
          >
            <span className="italic font-elegant">Grow</span> Online.<br />
            <span className="text-gradient italic font-medium">Look Professional.</span><br />
            Convert <span className="italic font-elegant">More</span>.
          </motion.h1>

          <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp}
            className="mt-8 max-w-xl mx-auto divider-flourish">
            <span className="font-mono-sharp text-[10px] tracking-[0.4em] uppercase">⁂ Apex Digital ⁂</span>
          </motion.div>

          <motion.p initial="hidden" animate="show" custom={2} variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-elegant italic">
            We blend timeless craft with modern technology — building brands that look professional,
            grow online, and convert more.
          </motion.p>

          <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="rounded-full px-8">
              <Link to="/contact">Book Free Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="glass" size="lg" className="rounded-full px-8">
              <Link to="/portfolio">View Our Work</Link>
            </Button>
          </motion.div>
        </div>

        {/* ambient orbs */}
        <div className="absolute top-1/4 -left-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-10 h-80 w-80 rounded-full bg-accent/20 blur-[120px] animate-float delay-500" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-secondary/10 blur-[140px]" />
      </section>

      {/* MARQUEE strip */}
      <section className="border-y border-border/60 bg-card/30 overflow-hidden py-5">
        <div className="flex animate-marquee whitespace-nowrap gap-12 font-elegant italic text-2xl text-muted-foreground/70">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12">
              {["Websites", "✦", "Branding", "✦", "SEO", "✦", "Social Media", "✦", "Video", "✦", "Content", "✦", "Growth", "✦"].map((w, i) => (
                <span key={i} className={i % 2 ? "text-primary" : ""}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="font-mono-sharp text-[11px] uppercase tracking-[0.4em] text-primary">— Chapter I —</p>
            <h2 className="mt-4 font-serif-display font-light text-4xl md:text-6xl">
              Services that <span className="italic text-gradient-gold">move</span> the needle
            </h2>
            <p className="mt-4 font-elegant italic text-muted-foreground text-lg">A curated atelier of seven disciplines.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 perspective-1000">
            {SERVICE_KEYS.map((key, i) => {
              const s = SERVICES[key];
              const Icon = s.icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to="/services"
                    className="block glow-border ornate-corners card-3d rounded-md p-8 group h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`h-16 w-16 rounded-md bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-glow rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <span className="font-mono-sharp text-[10px] tracking-widest text-muted-foreground/60">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif-display text-2xl font-medium">{s.label}</h3>
                    <div className="my-3 h-px w-10 bg-primary/60" />
                    <p className="text-muted-foreground font-elegant text-base leading-relaxed">{s.description}</p>
                    <div className="mt-6 inline-flex items-center text-sm text-primary group-hover:gap-3 gap-1 transition-all font-mono-sharp uppercase tracking-wider">
                      Discover <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="font-mono-sharp text-[11px] uppercase tracking-[0.4em] text-accent">— Chapter II —</p>
            <h2 className="mt-4 font-serif-display font-light text-4xl md:text-6xl leading-tight">
              Built for <span className="italic text-gradient">results</span>,<br />not just looks.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg font-elegant italic">
              Strategy, design and growth marketing — fused into one premium service.
              No fluff, only measurable outcomes.
            </p>
            <ul className="mt-10 space-y-5">
              {[
                "Conversion-first design philosophy",
                "Transparent reporting & analytics",
                "Dedicated specialist per service",
                "Premium quality at honest pricing",
              ].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <span className="mt-1 h-7 w-7 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-lg">{t}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-2 gap-5 perspective-1000">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30, rotateY: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="glow-border ornate-corners card-3d rounded-md p-8 text-center"
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="font-serif-display font-medium text-5xl text-gradient-gold">{s.value}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-mono-sharp">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      {projects.length > 0 && (
        <section className="py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
              <div>
                <p className="font-mono-sharp text-[11px] uppercase tracking-[0.4em] text-primary">— Chapter III —</p>
                <h2 className="mt-4 font-serif-display font-light text-4xl md:text-6xl">
                  Featured <span className="italic text-gradient">work</span>
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-full"><Link to="/portfolio">View archive →</Link></Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/portfolio/${p.slug}`} className="group glow-border card-3d rounded-md overflow-hidden block">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} loading="lazy"
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[1200ms]" />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary opacity-40" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <p className="font-mono-sharp text-[10px] uppercase tracking-widest text-primary">
                        {SERVICES[p.service_type as keyof typeof SERVICES]?.label}
                      </p>
                      <h3 className="font-serif-display font-medium text-2xl mt-2">{p.title}</h3>
                      {p.client_name && <p className="text-sm text-muted-foreground font-elegant italic mt-1">— {p.client_name}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="font-mono-sharp text-[11px] uppercase tracking-[0.4em] text-accent">— Chapter IV —</p>
              <h2 className="mt-4 font-serif-display font-light text-4xl md:text-6xl">
                Loved by <span className="italic text-gradient">clients</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glow-border ornate-corners card-3d rounded-md p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/95 font-elegant italic text-lg leading-relaxed">"{r.comment}"</p>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                    {r.photo_url && <img src={r.photo_url} alt={r.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/30" loading="lazy" />}
                    <div>
                      <div className="font-serif-display font-medium">{r.name}</div>
                      {r.company && <div className="text-xs text-muted-foreground font-mono-sharp uppercase tracking-wider">{r.company}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glow-border ornate-corners rounded-md p-12 md:p-20 text-center relative overflow-hidden animate-pulse-glow"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-[0.08] -z-10" />
            <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
            <p className="font-mono-sharp text-[11px] uppercase tracking-[0.4em] text-primary">— Finale —</p>
            <h2 className="mt-4 font-serif-display font-light text-4xl md:text-6xl">
              Ready to <span className="italic text-gradient-gold">grow</span>?
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto font-elegant italic">
              Let's craft a premium digital strategy that puts your brand ahead — for generations.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-10 rounded-full px-10">
              <Link to="/contact">Book Your Free Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
