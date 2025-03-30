import { Recommendations } from "@/components/recommendations/recommendations";
import { auth } from "@/security/auth";

export default async function RecommendationsPage() {
    const session = await auth();

    if (!session?.user.id) {
        throw new Error("User not found");
    }

    return (
        <main className="flex-1 space-y-6 bg-gray-100">
            <Recommendations userId={session.user.id} />
        </main>
    );
}
