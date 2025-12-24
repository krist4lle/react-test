"use client";

import { useState } from "react";

export default function AssessmentButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
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
    </div>
  );
}
