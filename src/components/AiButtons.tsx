// src/components/AiButtons.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles as IconSparkles,Tag as IconTag, Loader2 as IconLoader2 } from "lucide-react";
import { generateSummary, generateTags } from "@/lib/ai-client"; // your axios helpers

type Props = {
  noteId: string;
  onApplySummary?: (summary: string) => void; // parent decides what to do (apply to content/summary or call update)
  onApplyTags?: (tags: string[]) => void;
  disabled?: boolean;
};

export default function AiButtons({ noteId, onApplySummary, onApplyTags, disabled = false }: Props) {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  async function handleSummary() {
    if (disabled || loadingSummary) return;
    setLoadingSummary(true);
    try {
      const res = await generateSummary(noteId);
      if (res.success) {
        onApplySummary?.(res.summary);
      } else {
        // show error - replace with your toast
        console.error("Summary error", res.error);
        alert(res.error || "Failed to generate summary");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error generating summary");
    } finally {
      setLoadingSummary(false);
    }
  }

  async function handleTags() {
    if (disabled || loadingTags) return;
    setLoadingTags(true);
    try {
      const res = await generateTags(noteId);
      if (res.success) {
        onApplyTags?.(res.tags);
      } else {
        console.error("Tags error", res.error);
        alert(res.error || "Failed to generate tags");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error generating tags");
    } finally {
      setLoadingTags(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleSummary} disabled={disabled || loadingSummary}>
        {loadingSummary ? <IconLoader2 className="animate-spin mr-2 h-4 w-4" /> : <IconSparkles className="mr-2 h-4 w-4" />}
        AI Summarize
      </Button>

      <Button size="sm" variant="outline" onClick={handleTags} disabled={disabled || loadingTags}>
        {loadingTags ? <IconLoader2 className="animate-spin mr-2 h-4 w-4" /> : <IconTag className="mr-2 h-4 w-4" />}
        AI Tags
      </Button>
    </div>
  );
}
