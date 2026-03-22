import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Loader2, Save, RefreshCw, ChevronDown, ChevronUp,
  Layout, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Stat   { value: string; label: string }
interface Highlight { icon: string; title: string; value: string }
interface ExpItem {
  company: string; role: string; location: string; period: string;
  current: boolean; description: string[]; externalUrl?: string;
}
interface SkillItem  { name: string; level: number }
interface LeaderItem { title: string; subtitle: string; year: string; icon: string }

interface HeroContent {
  availability: string; name: string; title: string;
  description: string; cta_primary: string; cta_secondary: string;
  stats: Stat[];
}
interface AboutContent {
  tagline: string; heading: string; heading_highlight: string;
  paragraphs: string[]; highlights: Highlight[];
}
interface ExperienceContent {
  tagline: string; heading: string; heading_highlight: string;
  items: ExpItem[];
}
interface SkillsContent {
  tagline: string; heading: string; heading_highlight: string;
  items: SkillItem[];
}
interface LeadershipContent {
  tagline: string; heading: string; heading_highlight: string;
  description: string; items: LeaderItem[];
}
interface ContactContent {
  tagline: string; heading: string; heading_highlight: string;
  description: string; email: string; phone: string;
  location: string; linkedin: string; github: string;
}

type SectionKey = "hero" | "about" | "experience" | "skills" | "leadership" | "contact";
type SectionContent = HeroContent | AboutContent | ExperienceContent | SkillsContent | LeadershipContent | ContactContent;

interface PageSection {
  id: string;
  section: SectionKey;
  content: SectionContent;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sectionLabels: Record<SectionKey, string> = {
  hero: "Hero (Banner)",
  about: "About Me",
  experience: "Experience Timeline",
  skills: "Skills",
  leadership: "Leadership & Engagement",
  contact: "Contact",
};

// ---------------------------------------------------------------------------
// Sub-editors
// ---------------------------------------------------------------------------

const HeroEditor = ({
  content,
  onChange,
}: {
  content: HeroContent;
  onChange: (c: HeroContent) => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Availability Badge Text</Label>
      <Input
        value={content.availability}
        onChange={(e) => onChange({ ...content, availability: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>Your Name</Label>
      <Input
        value={content.name}
        onChange={(e) => onChange({ ...content, name: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>Title / Role</Label>
      <Input
        value={content.title}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        rows={3}
        value={content.description}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Primary Button Text</Label>
        <Input
          value={content.cta_primary}
          onChange={(e) => onChange({ ...content, cta_primary: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Secondary Button Text</Label>
        <Input
          value={content.cta_secondary}
          onChange={(e) => onChange({ ...content, cta_secondary: e.target.value })}
        />
      </div>
    </div>

    {/* Stats */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Stats</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({ ...content, stats: [...content.stats, { value: "", label: "" }] })
          }
        >
          <Plus className="w-3 h-3 mr-1" /> Add Stat
        </Button>
      </div>
      <div className="space-y-2">
        {content.stats.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              className="w-24"
              placeholder="10+"
              value={s.value}
              onChange={(e) => {
                const stats = [...content.stats];
                stats[i] = { ...s, value: e.target.value };
                onChange({ ...content, stats });
              }}
            />
            <Input
              placeholder="Label"
              value={s.label}
              onChange={(e) => {
                const stats = [...content.stats];
                stats[i] = { ...s, label: e.target.value };
                onChange({ ...content, stats });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => {
                onChange({ ...content, stats: content.stats.filter((_, idx) => idx !== i) });
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutEditor = ({
  content,
  onChange,
}: {
  content: AboutContent;
  onChange: (c: AboutContent) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Heading Highlight (gradient text)</Label>
      <Input
        value={content.heading_highlight}
        onChange={(e) => onChange({ ...content, heading_highlight: e.target.value })}
      />
    </div>

    {/* Paragraphs */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Paragraphs</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange({ ...content, paragraphs: [...content.paragraphs, ""] })}
        >
          <Plus className="w-3 h-3 mr-1" /> Add Paragraph
        </Button>
      </div>
      {content.paragraphs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            rows={3}
            value={p}
            onChange={(e) => {
              const paragraphs = [...content.paragraphs];
              paragraphs[i] = e.target.value;
              onChange({ ...content, paragraphs });
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive flex-shrink-0"
            onClick={() =>
              onChange({ ...content, paragraphs: content.paragraphs.filter((_, idx) => idx !== i) })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>

    {/* Highlights */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Highlights (cards below text)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...content,
              highlights: [
                ...content.highlights,
                { icon: "Zap", title: "", value: "" },
              ],
            })
          }
        >
          <Plus className="w-3 h-3 mr-1" /> Add Highlight
        </Button>
      </div>
      {content.highlights.map((h, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-center">
          <Input
            placeholder="Title"
            value={h.title}
            onChange={(e) => {
              const highlights = [...content.highlights];
              highlights[i] = { ...h, title: e.target.value };
              onChange({ ...content, highlights });
            }}
          />
          <Input
            placeholder="Value"
            value={h.value}
            onChange={(e) => {
              const highlights = [...content.highlights];
              highlights[i] = { ...h, value: e.target.value };
              onChange({ ...content, highlights });
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() =>
              onChange({
                ...content,
                highlights: content.highlights.filter((_, idx) => idx !== i),
              })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const ExperienceEditor = ({
  content,
  onChange,
}: {
  content: ExperienceContent;
  onChange: (c: ExperienceContent) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Heading Highlight</Label>
        <Input
          value={content.heading_highlight}
          onChange={(e) => onChange({ ...content, heading_highlight: e.target.value })}
        />
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Experience Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...content,
              items: [
                ...content.items,
                { company: "", role: "", location: "", period: "", current: false, description: [""] },
              ],
            })
          }
        >
          <Plus className="w-3 h-3 mr-1" /> Add Entry
        </Button>
      </div>
      {content.items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.company || `Entry ${i + 1}`}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() =>
                onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })
              }
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Company"
              value={item.company}
              onChange={(e) => {
                const items = [...content.items];
                items[i] = { ...item, company: e.target.value };
                onChange({ ...content, items });
              }}
            />
            <Input
              placeholder="Role"
              value={item.role}
              onChange={(e) => {
                const items = [...content.items];
                items[i] = { ...item, role: e.target.value };
                onChange({ ...content, items });
              }}
            />
            <Input
              placeholder="Location"
              value={item.location}
              onChange={(e) => {
                const items = [...content.items];
                items[i] = { ...item, location: e.target.value };
                onChange({ ...content, items });
              }}
            />
            <Input
              placeholder="Period (e.g. Jan 2024 - Present)"
              value={item.period}
              onChange={(e) => {
                const items = [...content.items];
                items[i] = { ...item, period: e.target.value };
                onChange({ ...content, items });
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Bullet Points</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  const items = [...content.items];
                  items[i] = { ...item, description: [...item.description, ""] };
                  onChange({ ...content, items });
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {item.description.map((desc, j) => (
              <div key={j} className="flex gap-2">
                <Input
                  placeholder="Describe your achievement..."
                  value={desc}
                  onChange={(e) => {
                    const items = [...content.items];
                    const description = [...item.description];
                    description[j] = e.target.value;
                    items[i] = { ...item, description };
                    onChange({ ...content, items });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive flex-shrink-0"
                  onClick={() => {
                    const items = [...content.items];
                    items[i] = { ...item, description: item.description.filter((_, idx) => idx !== j) };
                    onChange({ ...content, items });
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsEditor = ({
  content,
  onChange,
}: {
  content: SkillsContent;
  onChange: (c: SkillsContent) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Heading Highlight</Label>
        <Input
          value={content.heading_highlight}
          onChange={(e) => onChange({ ...content, heading_highlight: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Skills (name + proficiency 0–100)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({ ...content, items: [...content.items, { name: "", level: 80 }] })
          }
        >
          <Plus className="w-3 h-3 mr-1" /> Add Skill
        </Button>
      </div>
      {content.items.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Skill name"
            value={s.name}
            onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...s, name: e.target.value };
              onChange({ ...content, items });
            }}
          />
          <Input
            type="number"
            min={0}
            max={100}
            className="w-20"
            value={s.level}
            onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...s, level: parseInt(e.target.value) || 0 };
              onChange({ ...content, items });
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive flex-shrink-0"
            onClick={() =>
              onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const LeadershipEditor = ({
  content,
  onChange,
}: {
  content: LeadershipContent;
  onChange: (c: LeadershipContent) => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Tagline</Label>
      <Input
        value={content.tagline}
        onChange={(e) => onChange({ ...content, tagline: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>Section Description</Label>
      <Textarea
        rows={2}
        value={content.description}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
      />
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...content,
              items: [
                ...content.items,
                { title: "", subtitle: "", year: "", icon: "Award" },
              ],
            })
          }
        >
          <Plus className="w-3 h-3 mr-1" /> Add Item
        </Button>
      </div>
      {content.items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
          <Input
            placeholder="Title"
            value={item.title}
            onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, title: e.target.value };
              onChange({ ...content, items });
            }}
          />
          <Input
            placeholder="Subtitle"
            value={item.subtitle}
            onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, subtitle: e.target.value };
              onChange({ ...content, items });
            }}
          />
          <Input
            className="w-28"
            placeholder="Year"
            value={item.year}
            onChange={(e) => {
              const items = [...content.items];
              items[i] = { ...item, year: e.target.value };
              onChange({ ...content, items });
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() =>
              onChange({ ...content, items: content.items.filter((_, idx) => idx !== i) })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const ContactEditor = ({
  content,
  onChange,
}: {
  content: ContactContent;
  onChange: (c: ContactContent) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Heading Highlight</Label>
        <Input
          value={content.heading_highlight}
          onChange={(e) => onChange({ ...content, heading_highlight: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        rows={3}
        value={content.description}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={content.email}
          onChange={(e) => onChange({ ...content, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          value={content.phone}
          onChange={(e) => onChange({ ...content, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={content.location}
          onChange={(e) => onChange({ ...content, location: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn URL</Label>
        <Input
          value={content.linkedin}
          onChange={(e) => onChange({ ...content, linkedin: e.target.value })}
        />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const HomepageContentManager = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("hero");
  const { toast } = useToast();

  const fetchSections = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase connection not configured.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page", "home")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch homepage content", variant: "destructive" });
    } else {
      setSections((data as PageSection[]) || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleContentChange = (sectionKey: SectionKey, newContent: SectionContent) => {
    setSections((prev) =>
      prev.map((s) => (s.section === sectionKey ? { ...s, content: newContent } : s))
    );
  };

  const handleSave = async (sectionKey: SectionKey) => {
    const section = sections.find((s) => s.section === sectionKey);
    if (!section || !supabase) return;

    setSavingSection(sectionKey);
    try {
      const { error } = await supabase
        .from("page_sections")
        .update({ content: section.content as unknown as Json })
        .eq("id", section.id);

      if (error) throw error;
      toast({
        title: "Saved",
        description: `${sectionLabels[sectionKey]} updated successfully`,
      });
      await fetchSections();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save section",
        variant: "destructive",
      });
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-20">
        <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          No homepage content found. Make sure the database migration has been applied.
        </p>
        <Button variant="outline" onClick={fetchSections}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const renderEditor = (section: PageSection) => {
    switch (section.section) {
      case "hero":
        return (
          <HeroEditor
            content={section.content as HeroContent}
            onChange={(c) => handleContentChange("hero", c)}
          />
        );
      case "about":
        return (
          <AboutEditor
            content={section.content as AboutContent}
            onChange={(c) => handleContentChange("about", c)}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            content={section.content as ExperienceContent}
            onChange={(c) => handleContentChange("experience", c)}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            content={section.content as SkillsContent}
            onChange={(c) => handleContentChange("skills", c)}
          />
        );
      case "leadership":
        return (
          <LeadershipEditor
            content={section.content as LeadershipContent}
            onChange={(c) => handleContentChange("leadership", c)}
          />
        );
      case "contact":
        return (
          <ContactEditor
            content={section.content as ContactContent}
            onChange={(c) => handleContentChange("contact", c)}
          />
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">No editor available for this section.</p>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-semibold">Homepage Content</h2>
          <p className="text-sm text-muted-foreground">
            Edit each section of your homepage. Changes are saved per section.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSections}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {sections.map((section) => {
        const isExpanded = expandedSection === section.section;
        const isSaving = savingSection === section.section;

        return (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedSection(isExpanded ? null : section.section)}
            >
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {sectionLabels[section.section as SectionKey] || section.section}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Last updated: {new Date(section.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(section.section as SectionKey);
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Editor body */}
            {isExpanded && (
              <div className="border-t border-border p-4">
                {renderEditor(section)}
                <div className="flex justify-end mt-4 pt-4 border-t border-border">
                  <Button
                    onClick={() => handleSave(section.section as SectionKey)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save {sectionLabels[section.section as SectionKey] || "Section"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default HomepageContentManager;
