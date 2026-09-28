"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, UserPlus } from "lucide-react";

export default function AdminSignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Sign up failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-950 px-4">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:36px_36px] opacity-30" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="card overflow-hidden shadow-card-lg">
          <div className="border-b border-slate-100 bg-slate-50 px-8 py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 shadow-card">
              <Truck className="h-7 w-7 text-accent-400" />
            </span>
            <h1 className="mt-4 font-display text-xl font-bold text-brand-900">
              Create Admin Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign up to manage your own shipments and tracking numbers.
            </p>
          </div>

          <form onSubmit={submit} className="p-8">
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                required
              />
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                className="input"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
              />
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-brand-300">
          Already have an account?{" "}
          <Link href="/admin/login" className="font-semibold text-accent-400 hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Your shipments are visible only to you
        </div>
      </div>
    </div>
  );
}