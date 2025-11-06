"use client"
import { Button } from "@/components/ui/button";
import { Edit as IconEdit, Trash as IconTrash } from "lucide-react";


export default function NoteCard({ note, onEdit, onDelete }: { note: any; onEdit: () => void; onDelete: () => void }) {
    return (
        <article className="border rounded-md p-3 hover:shadow transition-shadow bg-background">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold">{note.title || "Untitled"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{note.content}</p>
                </div>
                <div className="flex items-start gap-2">
                    <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit"><IconEdit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete"><IconTrash className="h-4 w-4" /></Button>
                </div>
            </div>
            <div className="text-xs text-muted-foreground mt-3">{new Date(note.updatedAt).toLocaleString()}</div>
        </article>
    );
}