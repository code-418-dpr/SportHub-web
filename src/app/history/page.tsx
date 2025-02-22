import { getUserEvents } from "@/data/event";
import { auth } from "@/security/auth";

import { UserEvents } from "@/components/history/user-events";

export default async function History(): Promise<React.ReactNode> {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("User not found");
    }

    const events = await getUserEvents(session.user.id);

    return (
        <main className="flex-1 space-y-6 bg-gray-100">
            <UserEvents events={events} />
        </main>
    );
}
