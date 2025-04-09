import { useEffect, useState } from "react";

import Link from "next/link";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addEventToUser, removeEventFromUser } from "@/data/event";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { ExtendedEvent } from "@/prisma/types";

import { Button, buttonVariants } from "../ui/button";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    event: ExtendedEvent | null;
    userEventIds: bigint[] | null;
}

export function EventDialog({ isOpen, setIsOpen, event, userEventIds }: Props): React.ReactNode {
    const user = useCurrentUser();
    const [participating, setParticipating] = useState(
        event ? (userEventIds ? userEventIds.includes(event.id) : false) : false,
    );

    useEffect(() => {
        setParticipating(event ? (userEventIds ? userEventIds.includes(event.id) : false) : false);
    }, [userEventIds, event]);

    if (!event) {
        return null;
    }

    async function handleCancelParticipation() {
        await removeEventFromUser(user!.id!, event!.id);
        setParticipating(false);
    }

    async function handleParticipate() {
        await addEventToUser(user!.id!, event!.id);
        setParticipating(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md rounded-lg sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{event.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Идентификатор:</span>
                        <div className="col-span-2">{event.id.toString()}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Участники:</span>
                        <div className="col-span-2">{event.participants}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Категории:</span>
                        <div className="col-span-2">
                            {event.categories.length > 0
                                ? event.categories.map((category) => category.name).join(", ")
                                : "-"}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Дата начала:</span>
                        <div className="col-span-2">{event.start.toLocaleDateString()}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Дата окончания:</span>
                        <div className="col-span-2">{event.end.toLocaleDateString()}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Страна:</span>
                        <div className="col-span-2">{event.city.country.name}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Город:</span>
                        <div className="col-span-2">{event.city.name}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-muted-foreground text-right">Количество участников:</span>
                        <div className="col-span-2">{event.participantCount}</div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full space-y-4">
                        <Link
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full bg-blue-500 py-6 text-lg hover:bg-blue-600",
                            )}
                            href={getEventLink(event)}
                        >
                            Добавить в календарь
                        </Link>
                        {userEventIds &&
                            (participating ? (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        void handleCancelParticipation();
                                    }}
                                    className="w-full py-6 text-lg"
                                >
                                    Отменить участие
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        void handleParticipate();
                                    }}
                                    className="w-full py-6 text-lg"
                                >
                                    Участвую!
                                </Button>
                            ))}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function getEventLink(event: ExtendedEvent): string {
    const start = event.start.toISOString().split("T")[0].replace(/-/g, "");
    const end = new Date(event.end.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "");

    const details = `Место проведения: ${event.city.country.name}, ${event.city.name}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.name}&dates=${start}/${end}&details=${encodeURIComponent(details)}`;
}
