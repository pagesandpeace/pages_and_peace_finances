"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth/actions";

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result =
        mode === "signin" ? await signIn(formData) : await signUp(formData);

      if (result?.ok && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        setError("Invalid credentials or unexpected response.");
      }
    } catch (err) {
      console.error("❌ auth error", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-8 rounded-2xl shadow w-full max-w-md space-y-5 text-center"
      >
        {/* 🪶 Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo_black_transparent.svg"
            alt="Pages & Peace Logo"
            width={160}
            height={160}
            priority
          />
        </div>

        <h1 className="text-2xl font-semibold">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>

        <div className="space-y-3 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
          {loading
            ? "Processing..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </button>

        <p className="text-sm text-gray-700 mt-3">
          {mode === "signin"
            ? "Don’t have an account?"
            : "Already have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-accent cursor-pointer font-semibold"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </form>
    </main>
  );
}
