"use client";
import { createClient } from "better-auth/react";
import { auth } from "@/lib/auth/actions";

export const authClient = createClient(auth);
