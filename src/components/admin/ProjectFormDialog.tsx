import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICES, SERVICE_KEYS, SERVICE_FIELDS, ServiceKey, slugify } from "@/lib/services";
import { MediaUpload, MediaListUpload } from "./MediaUpload";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: any;
  onSaved: () => void;
}

export const ProjectFormDialog = ({ open, onOpenChange, project, onSaved }: Props) => {
  const [serviceType, setServiceType] = useState<ServiceKey>("website_design");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState<Record<string, any>>({});
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setServiceType(project.service_type);
      setTitle(project.title || "");
      setSlug(project.slug || "");
      setClientName(project.client_name || "");
      setCategory(project.category || "");
      setCoverImage(project.cover_image || "");
      setSummary(project.summary || "");
      setDetails(project.details || {});
      setFeatured(!!project.featured);
      setPublished(!!project.published);
    } else {
      setServiceType("website_design");
      setTitle(""); setSlug(""); setClientName(""); setCategory("");
      setCoverImage(""); setSummary(""); setDetails({});
      setFeatured(false); setPublished(true);
    }
  }, [project, open]);

  useEffect(() => {
    if (!project && title) setSlug(slugify(title));
  }, [title, project]);

  const setField = (name: string, value: any) => setDetails((d) => ({ ...d, [name]: value }));

  const save = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      service_type: serviceType,
      title: title.trim(),
      slug: slug.trim(),
      client_name: clientName.trim() || null,
      category: category.trim() || null,
      cover_image: coverImage || null,
      summary: summary.trim() || null,
      details,
      featured,
      published,
    };
    const { error } = project
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: project ? "Project updated" : "Project created" });
    onSaved();
    onOpenChange(false);
  };

  const fields = SERVICE_FIELDS[serviceType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Service category *</Label>
            <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceKey)} disabled={!!project}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SERVICE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>{SERVICES[k].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Project Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>URL Slug *</Label>
              <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
            </div>
            <div>
              <Label>Client Name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div>
              <Label>Category / Tag</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Cover Image</Label>
            <MediaUpload value={coverImage} onChange={setCoverImage} />
          </div>

          <div>
            <Label>Short Summary</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-display font-semibold text-lg mb-4">
              {SERVICES[serviceType].label} — custom fields
            </h3>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <Label>{f.label}</Label>
                  {f.type === "text" && (
                    <Input value={details[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                  )}
                  {f.type === "url" && (
                    <Input type="url" value={details[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                  )}
                  {f.type === "number" && (
                    <Input type="number" value={details[f.name] ?? ""} onChange={(e) => setField(f.name, e.target.value ? Number(e.target.value) : "")} />
                  )}
                  {f.type === "textarea" && (
                    <Textarea value={details[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} rows={3} />
                  )}
                  {f.type === "image" && (
                    <MediaUpload value={details[f.name] || ""} onChange={(v) => setField(f.name, v)} />
                  )}
                  {f.type === "image-list" && (
                    <MediaListUpload value={details[f.name] || []} onChange={(v) => setField(f.name, v)} />
                  )}
                  {f.type === "video" && (
                    <MediaUpload value={details[f.name] || ""} onChange={(v) => setField(f.name, v)} accept="video/*" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <Switch checked={featured} onCheckedChange={setFeatured} />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={published} onCheckedChange={setPublished} />
              <span className="text-sm">Published</span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="hero" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
