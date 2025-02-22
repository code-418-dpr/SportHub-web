"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/data/event";
import { ExtendedEvent } from "@/prisma/types";

import { EventCard } from "@/components/shared/event-card";

import { Button } from "../ui/button";

type Props = {
    userId: string;
};

export function Recommendations({ userId }: Props): React.ReactNode {
    const [recommendations, setRecommendations] = useState<ExtendedEvent[]>([]);

    const fetchRecommendations = async () => {
        const recommendations = await getRecommendations(userId, 3);
        setRecommendations(recommendations);
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div className="container mx-auto space-y-12 py-8">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Рекомендации</h1>
                <div className="space-y-4">
                    {recommendations.map((event) => (
                        <EventCard key={event.id.toString()} event={event} />
                    ))}
                </div>
                <div className="flex justify-center">
                    <Button onClick={fetchRecommendations} className="px-8 py-6 text-lg">
                        Показать другие события
                    </Button>
                </div>
            </div>
        </div>
    );
}
