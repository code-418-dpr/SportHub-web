"use server";

import { Prisma } from "@/app/generated/prisma";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { ExtendedEvent } from "@/prisma/types";

interface GetEvent {
    sportIds?: string[];
    teamIds?: string[];
    categoriesIds?: string[];
    gender?: { male: boolean; female: boolean };
    name?: string;
    cityId?: string;
    start?: Date;
    end?: Date;
    age?: number;
    countryIds?: string[];
    cityIds?: string[];
    sortBy?: string;
    sortDirection?: string;
    page: number;
    pageSize: number;
}

export const getFilteredEventWithPagination = async (request: GetEvent) => {
    const whereClause: Prisma.EventWhereInput = {};

    if (request.name) {
        whereClause.name = {
            contains: request.name,
            mode: "insensitive",
        };
    }

    if (request.sportIds?.length) {
        whereClause.sportDisciplineId = {
            in: request.sportIds,
        };
    }

    if (request.teamIds?.length) {
        whereClause.teamId = {
            in: request.teamIds,
        };
    }

    if (request.categoriesIds?.length) {
        whereClause.categories = {
            some: {
                id: { in: request.categoriesIds },
            },
        };
    }

    if (request.cityIds?.length) {
        whereClause.cityId = {
            in: request.cityIds,
        };
    } else if (request.countryIds?.length) {
        whereClause.city = {
            countryId: { in: request.countryIds },
        };
    }

    if (request.gender) {
        if (request.gender.male !== request.gender.female) {
            if (request.gender.male) {
                whereClause.OR = [
                    {
                        genders: {
                            equals: [true, true],
                        },
                    },
                    {
                        genders: {
                            equals: [true, false],
                        },
                    },
                ];
            } else {
                whereClause.OR = [
                    {
                        genders: {
                            equals: [false, false],
                        },
                    },
                    {
                        genders: {
                            equals: [false, true],
                        },
                    },
                ];
            }
        }
    }

    if (request.start) {
        const start = request.start;
        const end = request.end ?? request.start;
        whereClause.AND = [
            {
                end: {
                    gte: start,
                },
            },
            {
                start: {
                    lte: end,
                },
            },
        ];
    }

    if (request.age) {
        whereClause.ages = {
            hasSome: [request.age],
        };
    }

    let orderBy: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[] = {};

    if (request.sortBy) {
        if (request.sortBy && request.sortDirection) {
            if (request.sortBy === "sport") {
                orderBy = {
                    sportDiscipline: {
                        name: request.sortDirection as Prisma.SortOrder,
                    },
                };
            } else if (request.sortBy === "title") {
                orderBy = {
                    name: request.sortDirection as Prisma.SortOrder,
                };
            } else if (request.sortBy === "location") {
                orderBy = [
                    {
                        city: {
                            country: {
                                name: request.sortDirection as Prisma.SortOrder,
                            },
                        },
                    },
                    {
                        city: {
                            name: request.sortDirection as Prisma.SortOrder,
                        },
                    },
                ];
            } else if (request.sortBy === "dates") {
                orderBy = [
                    {
                        start: request.sortDirection as Prisma.SortOrder,
                    },
                    {
                        end: request.sortDirection as Prisma.SortOrder,
                    },
                ];
            } else if (request.sortBy === "participantsCount") {
                orderBy = {
                    participantCount: request.sortDirection as Prisma.SortOrder,
                };
            }
        }
    }

    const [events, total] = await db.$transaction([
        db.event.findMany({
            where: whereClause,
            skip: request.page * request.pageSize,
            take: request.pageSize,
            include: {
                sportDiscipline: true,
                city: {
                    include: {
                        country: true,
                    },
                },
                team: true,
                categories: true,
            },
            orderBy,
        }),
        db.event.count({
            where: whereClause,
        }),
    ]);

    return {
        events,
        total,
    };
};

export const getUserEventIds = async (emailUser: string): Promise<bigint[]> => {
    const user = await db.user.findUnique({
        where: { email: emailUser },
        select: { eventIds: true },
    });
    return user?.eventIds ?? [];
};

export const getUserEvents = async (emailUser: string): Promise<ExtendedEvent[]> => {
    const eventIds = await getUserEventIds(emailUser);

    return db.event.findMany({
        where: {
            id: { in: eventIds },
        },
        include: {
            sportDiscipline: true,
            city: {
                include: {
                    country: true,
                },
            },
            team: true,
            categories: true,
        },
    });
};

export const addEventToUser = async (userEmail: string, eventId: bigint): Promise<void> => {
    await db.user.update({
        where: { email: userEmail },
        data: {
            eventIds: { push: BigInt(eventId) },
        },
    });
};

export const removeEventFromUser = async (userEmail: string, eventId: bigint): Promise<void> => {
    await db.user.update({
        where: { email: userEmail },
        data: {
            eventIds: {
                set: (await getUserEventIds(userEmail)).filter((id) => id !== eventId),
            },
        },
    });
};

export const getRecommendations = async (userEmail: string | undefined, count: number): Promise<ExtendedEvent[]> => {
    let sportDisciplineId: string | null | undefined;
    let teamId: string | undefined;

    if (userEmail) {
        const user = await getUserByEmail(userEmail);

        if (user?.eventIds.length) {
            const eventId = user.eventIds[Math.floor(Math.random() * user.eventIds.length)];
            const event = await db.event.findUnique({
                where: { id: eventId },
                include: {
                    team: true,
                },
            });
            sportDisciplineId = event?.sportDisciplineId;
            teamId = event?.team.id;
        }
    }

    const eventsCount = await db.event.count({
        where: {
            sportDisciplineId,
            teamId,
            start: {
                gt: new Date(),
            },
        },
    });

    if (eventsCount === 0) return [];

    const events: ExtendedEvent[] = [];
    const usedIndexes = new Set<number>();

    for (let i = 0; i < count; i++) {
        const skip = Math.min(Math.floor(Math.random() * eventsCount), eventsCount - 1);

        if (usedIndexes.has(skip)) continue;

        usedIndexes.add(skip);

        console.log(skip);

        const event = await db.event.findFirst({
            skip,
            where: {
                sportDisciplineId,
                teamId,
                start: {
                    gt: new Date(),
                },
            },
            include: {
                sportDiscipline: true,
                city: {
                    include: {
                        country: true,
                    },
                },
                team: true,
                categories: true,
            },
        });

        if (event) {
            events.push(event);
        }
    }

    return events;
};
