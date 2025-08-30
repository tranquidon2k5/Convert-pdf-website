"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full border rounded px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="h-px bg-black/10 dark:bg-white/20 my-6" />

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "1" && (
        <button
          className="w-full border rounded px-3 py-2 mb-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </button>
      )}
      {process.env.NEXT_PUBLIC_AZURE_AD_ENABLED === "1" && (
        <button
          className="w-full border rounded px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
          onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
        >
          Continue with Microsoft
        </button>
      )}

      <div className="text-sm mt-4">
        <span>Don&apos;t have an account? </span>
        <Link className="underline" href="/auth/sign-up">Sign up</Link>
      </div>
    </div>
  );
}



