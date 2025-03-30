import { EventCard } from "@/components/shared/event-card";
import { ExtendedEvent } from "@/prisma/types";

export function UserEvents({ events }: { events: ExtendedEvent[] }): React.ReactNode {
    const pastEvents = events.filter((event) => event.start < new Date());
    const futureEvents = events.filter((event) => event.start > new Date());

    return (
        <div className="container mx-auto space-y-12 py-8">
            {futureEvents.length > 0 && (
                <div>
                    <h1 className="mb-6 text-3xl font-bold">Будущие события</h1>
                    <div className="space-y-4">
                        {futureEvents.map((event) => (
                            <EventCard key={event.id.toString()} event={event} />
                        ))}
                    </div>
                </div>
            )}
            {pastEvents.length > 0 && (
                <div>
                    <h1 className="mb-6 text-3xl font-bold">Прошедшие события</h1>
                    <div className="space-y-4">
                        {pastEvents.map((event) => (
                            <EventCard key={event.id.toString()} event={event} />
                        ))}
                    </div>
                </div>
            )}
            {pastEvents.length === 0 && futureEvents.length === 0 && (
                <div className="flex items-center justify-center">
                    <p className="text-muted-foreground text-lg">Нет событий</p>
                </div>
            )}
        </div>
    );
}
