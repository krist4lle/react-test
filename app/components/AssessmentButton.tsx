"use client";

import { useState } from "react";
import {User} from "@/types/api";

export default function AssessmentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed (status ${response.status}).`);
      }

      const data = await response.json();
      setMessage(data.message + '. ' + data.results.score);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Failed to fetch users: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        Run Assessment
      </button>
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Processing...
        </div>
      )}
      {message && <p className="text-sm text-zinc-700">{message}</p>}
    </div>
  );
}
