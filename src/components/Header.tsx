"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as IconSearch, Plus as IconPlus } from "lucide-react";
import React, { useState } from "react";

export default function Header({
  query,
  onSearch,
  onCreate,
  loading,
}: {
  query: string;
  onSearch: (q: string) => void;
  onCreate: () => void;
  loading: boolean;
}) {
  const [localQuery, setLocalQuery] = useState(query);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(localQuery.trim());
    }
  }

  function handleClick() {
    onSearch(localQuery.trim());
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">AI Notes</h2>
        <div className="hidden sm:block text-sm text-muted-foreground">
          Your personal note assistant
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <Input
            placeholder="Search notes..."
            value={localQuery}
            disabled={loading}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          <Button
            variant="ghost"
            disabled={loading}
            onClick={handleClick}
            aria-label="Search"
          >
            {loading ? <IconSearch className="animate-spin" /> : <IconSearch />}
          </Button>
        </div>

        <Button onClick={onCreate} className="ml-2">
          <IconPlus className="mr-2 h-4 w-4" /> New
        </Button>
      </div>
    </div>
  );
}
