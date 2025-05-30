import { CalendarIcon, FlagIcon, MapPinIcon, TrophyIcon, UsersIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedEvent } from "@/prisma/types";

export function EventCard({ event }: { event: ExtendedEvent }) {
    return (
        <Card className="w-full transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">{event.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {event.categories.map((category) => (
                                <Badge key={category.name} variant="secondary">
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="text-muted-foreground h-5 w-5" />
                        <span>
                            {event.start.toLocaleDateString()} - {event.end.toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPinIcon className="text-muted-foreground h-5 w-5" />
                        <span>
                            {event.city.country.name}, {event.city.name}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UsersIcon className="text-muted-foreground h-5 w-5" />
                        <span>{event.participantCount} участников</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TrophyIcon className="text-muted-foreground h-5 w-5" />
                        <span>{event.SportDiscipline?.name ?? "Без дисциплины"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FlagIcon className="text-muted-foreground h-5 w-5" />
                        <span>{event.team.name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
