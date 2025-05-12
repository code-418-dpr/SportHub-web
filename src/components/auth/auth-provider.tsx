"use client";

import React from "react";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
    session: Session | null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
