"use client";

import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import NoteEditorModal from "./NoteEditor";
import ConfirmDelete from "./ConfirmDelete";
import EmptyState from "./EmptyState";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus as IconPlus } from "lucide-react";
import { getNotes , createNote , deleteNote , updateNote, searchNotes ,  } from "@/actions/notes.action";

type Note = {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState<Note | null>(null);
  const [query, setQuery] = useState("");


  async function loadNotes() {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res?.notes ?? []);
    } catch (err) {
      console.error("Error loading notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(data: { title: string; content: string }) {
    const res = await createNote(data);
    if (res?.note) {
      setOpenCreate(false);
      await loadNotes();
    }
  }

  async function onUpdate(id: string, data: { title: string; content: string }) {
    const res = await updateNote({ id, ...data });
    if (res?.note) {
      setEditing(null);
      await loadNotes();
    }
  }

  async function onDelete(id: string) {
    const res = await deleteNote(id);
    if (res?.success) {
      setOpenDelete(null);
      await loadNotes();
    }
  }
   async function handleSearch(q: string) {
    setQuery(q);
    setLoading(true);
    try {
      if (q.trim() === "") {
        const res = await getNotes();
        setNotes(res?.notes ?? []);
      } else {
        const res = await searchNotes(q);
        setNotes(res?.notes ?? []);
      }
    } catch (err) {
      console.error("Error searching notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
    <Header query={query} onSearch={handleSearch} onCreate={() => setOpenCreate(true)} loading={loading} />

        <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-6">Loading...</div>
                ) : notes.length === 0 ? (
                  <EmptyState onCreate={() => setOpenCreate(true)} />
                ) : (
                  <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-3 p-2">
                      {notes.map((n) => (
                        <NoteCard
                          key={n.id}
                          note={n}
                          onEdit={() => setEditing(n)}
                          onDelete={() => setOpenDelete(n)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setOpenCreate(true)} className="w-full">
                    <IconPlus className="mr-2 h-4 w-4" /> New note
                  </Button>
                  <Button variant="ghost" onClick={loadNotes} className="w-full">
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>

        <NoteEditorModal open={openCreate} onOpenChange={setOpenCreate} onSave={onCreate} />

        {editing && (
          <NoteEditorModal
            open={!!editing}
            onOpenChange={() => setEditing(null)}
            initial={editing}
            onSave={(data) => onUpdate(editing.id, data)}
          />
        )}

        {openDelete && (
          <ConfirmDelete
            note={openDelete}
            onClose={() => setOpenDelete(null)}
            onConfirm={() => onDelete(openDelete.id)}
          />
        )}
      </div>
    </div>
  );
}
