"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { UserEvents } from "@/components/history/user-events";
import { getUserEvents } from "@/data/event";
import type { ExtendedEvent } from "@/prisma/types";

export default function History() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<ExtendedEvent[]>();

    if (!session?.user.email) {
        throw new Error("User not found");
    }

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getUserEvents(session.user.email);
            setEvents(data);
        };

        void fetchEvents();
    }, [session.user.email]);

    return <main className="flex-1 space-y-6">{events && <UserEvents events={events} />}</main>;
}
