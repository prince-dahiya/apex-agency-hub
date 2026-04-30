import { Globe, Share2, Video, Search, Sparkles, Palette } from "lucide-react";

export type ServiceKey =
  | "website_design"
  | "social_media"
  | "video_editing"
  | "seo"
  | "content_creation"
  | "branding";

export const SERVICES: Record<
  ServiceKey,
  { label: string; tagline: string; icon: any; gradient: string; description: string }
> = {
  website_design: {
    label: "Website Design",
    tagline: "Conversion-focused websites & business pages",
    icon: Globe,
    gradient: "from-violet-500 to-fuchsia-500",
    description:
      "Premium, lightning-fast websites and business pages engineered to turn visitors into customers.",
  },
  social_media: {
    label: "Social Media Management",
    tagline: "Grow followers, reach & engagement",
    icon: Share2,
    gradient: "from-cyan-400 to-blue-600",
    description:
      "End-to-end social management — strategy, content, and growth across Instagram, Facebook & more.",
  },
  video_editing: {
    label: "Video Editing",
    tagline: "Reels, ads & YouTube edits that hook viewers",
    icon: Video,
    gradient: "from-pink-500 to-rose-500",
    description:
      "Cinematic edits for reels, ads, and long-form videos that drive watch time and conversions.",
  },
  seo: {
    label: "SEO Services",
    tagline: "Rank higher. Get more traffic.",
    icon: Search,
    gradient: "from-emerald-400 to-teal-600",
    description:
      "Technical SEO, content & backlinks to push your business to the top of Google.",
  },
  content_creation: {
    label: "Digital Content Creation",
    tagline: "Creatives, captions & campaigns",
    icon: Sparkles,
    gradient: "from-amber-400 to-orange-600",
    description:
      "Scroll-stopping creatives, captions and campaign content tailored to your brand voice.",
  },
  branding: {
    label: "Branding & Growth",
    tagline: "Logos, identity & complete brand kits",
    icon: Palette,
    gradient: "from-purple-500 to-indigo-600",
    description:
      "Full brand identity systems — logos, palettes, mockups, social kits and packaging.",
  },
};

export const SERVICE_KEYS = Object.keys(SERVICES) as ServiceKey[];

// Per-service custom fields (form schema)
export type FieldDef =
  | { name: string; label: string; type: "text" | "textarea" | "url" | "number" }
  | { name: string; label: string; type: "image" }
  | { name: string; label: string; type: "image-list" }
  | { name: string; label: string; type: "video" };

export const SERVICE_FIELDS: Record<ServiceKey, FieldDef[]> = {
  website_design: [
    { name: "live_link", label: "Live Website Link", type: "url" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "features", label: "Features Included", type: "textarea" },
    { name: "results", label: "Results / Leads Generated", type: "text" },
    { name: "before_image", label: "Before Image", type: "image" },
    { name: "after_image", label: "After Image", type: "image" },
    { name: "screenshots", label: "Website Screenshots", type: "image-list" },
    { name: "testimonial", label: "Client Testimonial", type: "textarea" },
  ],
  social_media: [
    { name: "industry", label: "Industry / Niche", type: "text" },
    { name: "platform", label: "Platform (Instagram, Facebook…)", type: "text" },
    { name: "starting_followers", label: "Starting Followers", type: "number" },
    { name: "current_followers", label: "Current Followers", type: "number" },
    { name: "growth_pct", label: "Growth %", type: "text" },
    { name: "reach_increase", label: "Reach / Engagement Increase", type: "text" },
    { name: "duration", label: "Duration Worked", type: "text" },
    { name: "strategy", label: "Monthly Strategy Used", type: "textarea" },
    { name: "samples", label: "Content Samples (posts/reels)", type: "image-list" },
    { name: "review", label: "Client Review", type: "textarea" },
  ],
  video_editing: [
    { name: "video_type", label: "Video Type (Reel/Ad/YouTube/Promo)", type: "text" },
    { name: "platform", label: "Platform Used", type: "text" },
    { name: "editing_style", label: "Editing Style", type: "text" },
    { name: "before_video", label: "Before Raw Clip", type: "video" },
    { name: "final_video", label: "Final Edited Video", type: "video" },
    { name: "views", label: "Views / Performance", type: "text" },
    { name: "retention", label: "Retention Increase", type: "text" },
    { name: "feedback", label: "Client Feedback", type: "textarea" },
  ],
  seo: [
    { name: "website_name", label: "Website Name", type: "text" },
    { name: "industry", label: "Industry", type: "text" },
    { name: "keywords", label: "Keywords Ranked", type: "textarea" },
    { name: "traffic_before", label: "Traffic Before", type: "text" },
    { name: "traffic_after", label: "Traffic After", type: "text" },
    { name: "results_pct", label: "Results %", type: "text" },
    { name: "duration", label: "Duration", type: "text" },
    { name: "strategy", label: "SEO Strategy", type: "textarea" },
    { name: "ranking_screenshot", label: "Google Ranking Screenshot", type: "image" },
  ],
  content_creation: [
    { name: "content_type", label: "Content Type", type: "text" },
    { name: "campaign_goal", label: "Campaign Goal", type: "text" },
    { name: "brand_style", label: "Brand Style Used", type: "text" },
    { name: "creatives", label: "Images / Creatives", type: "image-list" },
    { name: "captions", label: "Caption Samples", type: "textarea" },
    { name: "performance", label: "Reach / Clicks / Leads / Stats", type: "textarea" },
    { name: "review", label: "Client Review", type: "textarea" },
  ],
  branding: [
    { name: "logo", label: "Logo", type: "image" },
    { name: "colors", label: "Brand Colors (e.g. #111, #abc)", type: "text" },
    { name: "fonts", label: "Fonts", type: "text" },
    { name: "mockups", label: "Mockups", type: "image-list" },
    { name: "social_kit", label: "Social Kit", type: "image-list" },
    { name: "packaging", label: "Packaging Design", type: "image-list" },
    { name: "before_image", label: "Before Image", type: "image" },
    { name: "after_image", label: "After Image", type: "image" },
    { name: "result", label: "Final Brand Result", type: "textarea" },
  ],
};

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
