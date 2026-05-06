import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogOut, Plus, Pencil, Trash2, Check, X, FolderKanban, Star, Inbox, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectFormDialog } from "@/components/admin/ProjectFormDialog";
import { SiteSettingsPanel } from "@/components/admin/SiteSettingsPanel";
import { SERVICES, ServiceKey } from "@/lib/services";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAll = () => {
    supabase.from("projects").select("*").order("created_at", { ascending: false }).then(({ data }) => setProjects(data || []));
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => setReviews(data || []));
    supabase.from("leads").select("*").order("created_at", { ascending: false }).then(({ data }) => setLeads(data || []));
  };

  useEffect(() => {
    document.title = "Admin Dashboard — Apex";
    if (isAdmin) loadAll();
  }, [isAdmin]);

  if (loading) return <div className="text-center py-32 text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-32 text-center">
        <h1 className="font-display font-bold text-3xl">No admin access</h1>
        <p className="mt-3 text-muted-foreground">
          Your account is signed in but doesn't have the <code>admin</code> role yet.
          Open Lovable Cloud → Database → <code>user_roles</code> and insert a row with your user id and role <code>admin</code>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">User ID: {session.user.id}</p>
        <Button variant="outline" className="mt-6" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    );
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); loadAll(); }
  };

  const setReviewApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else loadAll();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    loadAll();
  };

  const updateLead = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    loadAll();
  };
  const deleteLead = async (id: string) => {
    if (!confirm("Delete lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    loadAll();
  };

  const stats = [
    { icon: FolderKanban, label: "Projects", value: projects.length },
    { icon: Star, label: "Pending Reviews", value: reviews.filter(r => !r.approved).length },
    { icon: Inbox, label: "New Leads", value: leads.filter(l => l.status === "new").length },
    { icon: BarChart3, label: "Total Leads", value: leads.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-4xl">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage everything without code</p>
        </div>
        <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const I = s.icon;
          return (
            <div key={s.label} className="glow-border rounded-2xl p-5">
              <I className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="site">Site & Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button variant="hero" onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> New project
            </Button>
          </div>
          <div className="grid gap-3">
            {projects.length === 0 && <p className="text-muted-foreground text-center py-8">No projects yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="glow-border rounded-xl p-4 flex items-center gap-4 flex-wrap">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} className="h-16 w-24 rounded-lg object-cover" />
                ) : (
                  <div className="h-16 w-24 rounded-lg bg-muted" />
                )}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{SERVICES[p.service_type as ServiceKey]?.label}</Badge>
                    {p.featured && <Badge>Featured</Badge>}
                    {!p.published && <Badge variant="outline">Draft</Badge>}
                  </div>
                  <div className="font-semibold mt-1">{p.title}</div>
                  <div className="text-sm text-muted-foreground">{p.client_name || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteProject(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid gap-3">
            {reviews.length === 0 && <p className="text-muted-foreground text-center py-8">No reviews.</p>}
            {reviews.map((r) => (
              <div key={r.id} className="glow-border rounded-xl p-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.name}</span>
                      {r.company && <span className="text-sm text-muted-foreground">· {r.company}</span>}
                      <Badge variant={r.approved ? "default" : "outline"}>{r.approved ? "Approved" : "Pending"}</Badge>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">{r.comment}</p>
                  </div>
                  <div className="flex gap-2">
                    {!r.approved ? (
                      <Button size="sm" variant="hero" onClick={() => setReviewApproval(r.id, true)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setReviewApproval(r.id, false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteReview(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="grid gap-3">
            {leads.length === 0 && <p className="text-muted-foreground text-center py-8">No leads yet.</p>}
            {leads.map((l) => (
              <div key={l.id} className="glow-border rounded-xl p-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{l.name}</span>
                      <Badge variant={l.status === "new" ? "default" : "outline"}>{l.status}</Badge>
                      {l.service && <Badge variant="secondary">{l.service}</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <a href={`mailto:${l.email}`} className="hover:text-foreground">{l.email}</a>
                      {l.phone && <> · <a href={`tel:${l.phone}`} className="hover:text-foreground">{l.phone}</a></>}
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{l.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(l.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {l.status === "new" && (
                      <Button size="sm" variant="outline" onClick={() => updateLead(l.id, "contacted")}>Mark contacted</Button>
                    )}
                    {l.status !== "closed" && (
                      <Button size="sm" variant="outline" onClick={() => updateLead(l.id, "closed")}>Close</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteLead(l.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="site" className="mt-6">
          <SiteSettingsPanel />
        </TabsContent>
      </Tabs>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editing}
        onSaved={loadAll}
      />
    </div>
  );
};

export default Admin;
