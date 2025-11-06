// src/components/AiButtons.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {Sparkles as  IconSparkles,Tag as IconTag, Loader2 as IconLoader2 } from "lucide-react";

type AiButtonsProps = {
  /** current note title (optional) to provide context to the AI */
  title?: string;
  /** current note content to provide context to the AI (optional) */
  content?: string;
  /** called when user asks to summarize. should return string | undefined (summary) */
  onSummarize: (args: { title?: string; content?: string }) => Promise<string | undefined>;
  /** called when user asks to generate tags. should return array of tags or comma-separated string */
  onGenerateTags: (args: { title?: string; content?: string }) => Promise<string[] | string | undefined>;
  disabled?: boolean;
  className?: string;
};

export default function AiButtons({
  title,
  content,
  onSummarize,
  onGenerateTags,
  disabled = false,
  className = "",
}: AiButtonsProps) {
  const [loadingSumm, setLoadingSumm] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  async function handleSummarize() {
    if (disabled || loadingSumm) return;
    try {
      setLoadingSumm(true);
      await onSummarize({ title, content });
    } finally {
      setLoadingSumm(false);
    }
  }

  async function handleTags() {
    if (disabled || loadingTags) return;
    try {
      setLoadingTags(true);
      await onGenerateTags({ title, content });
    } finally {
      setLoadingTags(false);
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSummarize}
            disabled={disabled || loadingSumm}
            aria-label="AI Summarize"
          >
            {loadingSumm ? (
              <IconLoader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <IconSparkles className="mr-2 h-4 w-4" />
            )}
            <span className="hidden xs:inline">AI Summarize</span>
            <span className="xs:hidden">Summarize</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Auto-generate a short summary from note content.
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleTags}
            disabled={disabled || loadingTags}
            aria-label="AI Tags"
          >
            {loadingTags ? (
              <IconLoader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <IconTag className="mr-2 h-4 w-4" />
            )}
            <span className="hidden xs:inline">AI Tags</span>
            <span className="xs:hidden">Tags</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Generate tag suggestions (comma separated).</TooltipContent>
      </Tooltip>
    </div>
  );
}
