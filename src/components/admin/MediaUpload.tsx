import { useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export const MediaUpload = ({ value, onChange, accept = "image/*", label }: Props) => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file, { upsert: false });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  const isVideo = accept.includes("video");

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          {isVideo ? (
            <video src={value} className="rounded-lg max-h-40" controls />
          ) : (
            <img src={value} alt="" className="rounded-lg max-h-40" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted/50 transition">
          <Upload className="h-4 w-4" />
          <span className="text-sm">{uploading ? "Uploading…" : label || "Upload"}</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
      )}
      <Input
        type="url"
        placeholder="…or paste a URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
      />
    </div>
  );
};

export const MediaListUpload = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt="" className="rounded-lg w-full aspect-square object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <MediaUpload
        value=""
        onChange={(url) => url && onChange([...value, url])}
        label="Add image"
      />
    </div>
  );
};
