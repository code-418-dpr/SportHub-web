"use client";

import { useCallback, useEffect, useState } from "react";

import { EventCard } from "@/components/shared/event-card";
import { getRecommendations } from "@/data/event";
import { ExtendedEvent } from "@/prisma/types";

import { Button } from "../ui/button";

interface Props {
    userEmail: string;
}

export function Recommendations({ userEmail }: Props) {
    const [recommendations, setRecommendations] = useState<ExtendedEvent[]>([]);

    const fetchRecommendations = useCallback(async () => {
        const recommendations = await getRecommendations(userEmail, 3);
        setRecommendations(recommendations);
    }, [userEmail]);

    useEffect(() => {
        void fetchRecommendations();
    }, [fetchRecommendations]);

    return (
        <div className="container mx-auto space-y-12 py-8">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Рекомендации</h1>
                <div className="space-y-4">
                    {recommendations.map((event) => (
                        <EventCard key={`${event.id}-${Math.random()}`} event={event} />
                    ))}
                </div>
                <div className="flex justify-center">
                    <Button
                        onClick={() => {
                            void fetchRecommendations();
                        }}
                        className="px-8 py-6 text-lg"
                    >
                        Показать другие события
                    </Button>
                </div>
            </div>
        </div>
    );
}
