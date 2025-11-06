"use client"
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDelete({ note, onClose, onConfirm }: { note: any; onClose: () => void; onConfirm: () => void }) {
    const [open, setOpen] = useState(true);
    useEffect(() => { setOpen(true); }, [note]);
    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete note?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>Are you sure you want to delete <strong>{note.title || 'this note'}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => { setOpen(false); onClose(); }}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { onConfirm(); setOpen(false); }}>Delete</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}