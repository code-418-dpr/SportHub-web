"use client";

import { useSession } from "next-auth/react";

import { Recommendations } from "@/components/recommendations/recommendations";

export default function RecommendationsPage() {
    const { data: session } = useSession();

    if (!session?.user.id) {
        throw new Error("User not found");
    }

    return (
        <main className="flex-1 space-y-6">
            <Recommendations userId={session.user.id} />
        </main>
    );
}
