import { auth } from "@/security/auth";

import { Recommendations } from "@/components/recommendations/recommendations";

export default async function RecommendationsPage(): Promise<React.ReactNode> {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("User not found");
    }

    return (
        <main className="flex-1 space-y-6 bg-gray-100">
            <Recommendations userId={session.user.id} />
        </main>
    );
}
