"use server";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";

/* ---------- Sign Up ---------- */
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) ?? "Internal User";

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  return { ok: true, userId: result.user?.id, redirectTo: "/accounts" };
}

/* ---------- Sign In ---------- */
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await auth.api.signInEmail({ body: { email, password } });
  return { ok: true, userId: result.user?.id, redirectTo: "/accounts" };
}

/* ---------- Current User ---------- */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/* ---------- Sign Out ---------- */
export async function signOut() {
  const forwardedHeaders = new Headers(await headers());
  await auth.api.signOut({ headers: forwardedHeaders });
  return { ok: true };
}
