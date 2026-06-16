import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES, SERVICE_KEYS, ServiceKey } from "@/lib/services";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const [filter, setFilter] = useState<ServiceKey | "all">("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Portfolio — Northstarr";
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("display_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.service_type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Work</p>
        <h1 className="mt-3 font-display font-bold text-5xl md:text-6xl">Portfolio</h1>
        <p className="mt-5 text-muted-foreground text-lg">Real projects. Real results.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button variant={filter === "all" ? "hero" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        {SERVICE_KEYS.map((k) => (
          <Button
            key={k}
            variant={filter === k ? "hero" : "outline"}
            size="sm"
            onClick={() => setFilter(k)}
          >
            {SERVICES[k].label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No projects in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} to={`/portfolio/${p.slug}`} className="group glow-border rounded-2xl overflow-hidden hover-lift">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-primary opacity-30" />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-primary">{SERVICES[p.service_type as ServiceKey]?.label}</p>
                <h3 className="font-display font-semibold text-lg mt-1">{p.title}</h3>
                {p.client_name && <p className="text-sm text-muted-foreground">{p.client_name}</p>}
                {p.summary && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
