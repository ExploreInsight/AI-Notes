"use client"
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AiButtons from "./AiButtons";


export default function NoteEditorModal({ open, onOpenChange, onSave, initial }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (data: { title: string; content: string }) => Promise<any>; initial?: any | null }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [content, setContent] = useState(initial?.content || "");

    const [tags, setTags] = useState<string[] | null>(initial?.tags ?? null);
    useEffect(() => { setTitle(initial?.title || ""); setContent(initial?.content || ""); }, [initial]);


    const [loading, setLoading] = useState(false);

  async function callAiSummary({ title, content }: { title?: string; content?: string; }) {
    
    const fake = "Short summary — " + (content?.slice(0, 120) || title || "no content");
    // setContent((c) => `${fake}\n\n${c}`);
    return fake;
  }

  async function callAiTags({ title, content }: { title?: string; content?: string; }) {
    // Call your tags AI endpoint; return array or comma string
    const fakeTags = ["ai", "notes", "summary"];
    setTags(fakeTags);
    return fakeTags;
  }
    async function save() {
        setLoading(true);
        try { await onSave({ title, content }); } finally { setLoading(false); }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? "Edit note" : "New note"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..." className="min-h-[200px]" />
                    <div className="flex justify-end gap-2">
                        <AiButtons
                            title={title}
                            content={content}
                            onSummarize={callAiSummary}
                            onGenerateTags={callAiTags}
                        />
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}