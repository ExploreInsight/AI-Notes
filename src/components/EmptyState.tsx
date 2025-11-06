"use client"
import { Button } from "@/components/ui/button";
import { Plus as IconPlus } from "lucide-react";


export default function EmptyState({ onCreate }: { onCreate: () => void }) {
return (
<div className="p-8 text-center">
<h3 className="text-lg font-semibold">No notes yet</h3>
<p className="text-sm text-muted-foreground mt-2">Write your first note — AI can help summarize and tag it later.</p>
<div className="mt-4 flex justify-center"><Button onClick={onCreate}><IconPlus className="mr-2 h-4 w-4"/> Create note</Button></div>
</div>
);
}