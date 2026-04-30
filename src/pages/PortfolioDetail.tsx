import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_FIELDS, ServiceKey } from "@/lib/services";

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("projects").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setProject(data);
      setLoading(false);
      if (data) document.title = `${data.title} — Apex`;
    });
  }, [slug]);

  if (loading) return <div className="text-center py-32 text-muted-foreground">Loading…</div>;
  if (!project) return (
    <div className="text-center py-32">
      <p className="text-muted-foreground mb-4">Project not found.</p>
      <Button asChild variant="outline"><Link to="/portfolio">Back to portfolio</Link></Button>
    </div>
  );

  const serviceKey = project.service_type as ServiceKey;
  const service = SERVICES[serviceKey];
  const fields = SERVICE_FIELDS[serviceKey];
  const details = project.details || {};

  const renderField = (f: typeof fields[number]) => {
    const v = details[f.name];
    if (!v || (Array.isArray(v) && v.length === 0)) return null;
    return (
      <div key={f.name} className="glow-border rounded-2xl p-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-2">{f.label}</div>
        {f.type === "image" && typeof v === "string" && (
          <img src={v} alt={f.label} className="rounded-lg w-full" loading="lazy" />
        )}
        {f.type === "image-list" && Array.isArray(v) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {v.map((url: string, i: number) => (
              <img key={i} src={url} alt={`${f.label} ${i + 1}`} className="rounded-lg w-full aspect-square object-cover" loading="lazy" />
            ))}
          </div>
        )}
        {f.type === "video" && typeof v === "string" && (
          <video src={v} controls className="rounded-lg w-full" />
        )}
        {f.type === "url" && typeof v === "string" && (
          <a href={v} target="_blank" rel="noopener noreferrer" className="text-secondary inline-flex items-center gap-1 hover:underline">
            {v} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {(f.type === "text" || f.type === "textarea" || f.type === "number") && (
          <p className="text-foreground/90 whitespace-pre-wrap">{String(v)}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/portfolio"><ArrowLeft className="h-4 w-4 mr-1" /> All projects</Link>
      </Button>

      <p className="text-sm uppercase tracking-widest text-primary">{service?.label}</p>
      <h1 className="font-display font-bold text-4xl md:text-6xl mt-2">{project.title}</h1>
      {project.client_name && <p className="mt-3 text-muted-foreground text-lg">Client: {project.client_name}</p>}
      {project.summary && <p className="mt-5 text-foreground/80 text-lg">{project.summary}</p>}

      {project.cover_image && (
        <img src={project.cover_image} alt={project.title} className="mt-8 rounded-2xl w-full" loading="lazy" />
      )}

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {fields.map(renderField)}
      </div>
    </div>
  );
};

export default PortfolioDetail;
