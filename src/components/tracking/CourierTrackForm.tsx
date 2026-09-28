"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PackageSearch } from "lucide-react";
import type { Courier } from "@/data/couriers";

export function CourierTrackForm({ courier }: { courier: Courier }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = value.trim();
    if (!n) {
      setError("Please enter a tracking number.");
      return;
    }
    setError("");
    router.push(`/track/${courier.id}?number=${encodeURIComponent(n)}`);
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <PackageSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${courier.name} tracking number`}
            className="c-input pl-11"
          />
        </div>
        <button type="submit" className="c-btn shrink-0">
          Track
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}
    </form>
  );
}