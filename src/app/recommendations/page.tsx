"use client";

import { useSession } from "next-auth/react";

import { Recommendations } from "@/components/recommendations/recommendations";

export default function RecommendationsPage() {
    const { data: session } = useSession();

    if (!session?.user.email) {
        throw new Error("User not found");
    }

    return (
        <main className="flex-1 space-y-6">
            <Recommendations userEmail={session.user.email} />
        </main>
    );
}
