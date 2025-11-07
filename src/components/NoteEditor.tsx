"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AiButtons from "./AiButtons";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: { title: string; content: string }) => Promise<any>;
  initial?: {
    id?: string;
    title?: string;
    content?: string;
    summary?: string | null;
    tags?: string[] | null;
  } | null;
};

export default function NoteEditorModal({ open, onOpenChange, onSave, initial }: Props) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [summary, setSummary] = useState<string | null>(initial?.summary ?? null);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setSummary(initial?.summary ?? null);
    setTags(initial?.tags ?? []);
  }, [initial]);

  async function save() {
    setLoading(true);
    try {
      await onSave({ title, content });
    } finally {
      setLoading(false);
    }
  }

  // called by AiButtons when AI returns a summary
  function handleApplySummary(s: string) {
    setSummary(s);
    // optional: you may show a toast here or persist via updateNote if desired
  }

  // called by AiButtons when AI returns tags array
  function handleApplyTags(t: string[]) {
    setTags(t);
    // optional: persist or show toast
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit note" : "New note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="min-h-[200px]"
          />

          {/* AI buttons -> pass noteId and callbacks */}
          <div className="flex items-center justify-between gap-2">
            <AiButtons
              noteId={initial?.id ?? ""}
              onApplySummary={handleApplySummary}
              onApplyTags={handleApplyTags}
              disabled={!initial?.id} // disable if note not yet created (no id)
            />

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* show generated summary (if any) */}
          {summary ? (
            <div className="rounded-md border p-3 bg-muted/50">
              <h4 className="font-medium mb-1">AI Summary</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
            </div>
          ) : null}

          {/* show tags as chips */}
          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full border bg-background/60"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
