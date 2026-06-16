import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  company: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(5).max(800),
  rating: z.number().int().min(1).max(5),
});

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Reviews — Northstarr";
    load();
  }, []);

  const load = () => {
    supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).then(({ data }) => setReviews(data || []));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, company: company || undefined, comment, rating });
    if (!parsed.success) {
      toast({ title: "Please check your input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      company: company.trim() || null,
      comment: comment.trim(),
      rating,
      photo_url: photoUrl.trim() || null,
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your review will appear after admin approval." });
      setName(""); setCompany(""); setComment(""); setPhotoUrl(""); setRating(5);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Reviews</p>
        <h1 className="mt-3 font-display font-bold text-5xl md:text-6xl">Client love</h1>
      </div>

      {reviews.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {reviews.map((r) => (
            <div key={r.id} className="glow-border rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90">"{r.comment}"</p>
              <div className="mt-4 flex items-center gap-3">
                {r.photo_url && <img src={r.photo_url} alt={r.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />}
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glow-border rounded-3xl p-8 md:p-10 max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-2xl">Leave a review</h2>
        <p className="text-muted-foreground text-sm mt-1">Reviews are published after admin approval.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Your Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={120} />
            </div>
          </div>
          <div>
            <Label>Photo URL (optional)</Label>
            <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} className="p-1">
                  <Star className={`h-7 w-7 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Comment *</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={800} rows={4} />
          </div>
          <Button type="submit" variant="hero" disabled={submitting} className="w-full">
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
