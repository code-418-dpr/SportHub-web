import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export const maxDuration = 60;

interface JsonEvent {
    sport: string;
    team: string;
    id: number;
    title: string;
    categories: string[] | undefined;
    participants: string;
    ages: number[][];
    genders: boolean[];
    country: string;
    city: string;
    start: string;
    end: string;
    participants_count: number;
}

export async function POST(request: Request) {
    try {
        const eventsData: JsonEvent[] = (await request.json()) as JsonEvent[];

        for (const event of eventsData) {
            const {
                sport,
                team,
                id,
                title,
                categories,
                participants,
                ages,
                genders,
                country,
                city,
                start,
                end,
                participants_count,
            } = event;

            const countryRecord = await db.country.upsert({
                where: { name: country },
                update: {},
                create: { name: country },
            });

            const cityRecord = await db.city.upsert({
                where: { name: city },
                update: {},
                create: { name: city, countryId: countryRecord.id },
            });

            const sportDisciplineRecord = await db.sportDiscipline.upsert({
                where: { name: sport },
                update: {},
                create: { name: sport },
            });

            const teamRecord = await db.team.upsert({
                where: { name: team },
                update: {},
                create: { name: team },
            });

            const categoryRecords: Category[] = [];
            if (categories) {
                for (const category of categories) {
                    const categoryRecord = await db.category.upsert({
                        where: { name: category },
                        update: {},
                        create: { name: category },
                    });
                    categoryRecords.push(categoryRecord);
                }
            }

            const isEventExist = await db.event.findFirst({ where: { id } });

            const agesSet = new Set<number>();
            for (const ageRange of ages) {
                for (let i = ageRange[0]; i <= ageRange[1]; i++) {
                    agesSet.add(i);
                }
            }

            if (isEventExist) {
                const changedFields = Object.entries(event)
                    .filter(([key, value]) => {
                        const isEventExistKey = key as keyof typeof isEventExist;
                        return isEventExist[isEventExistKey] !== value;
                    })
                    .map(([key]) => key);

                if (changedFields.length > 0) {
                    await db.event.update({
                        where: { id },
                        data: {
                            cityId: cityRecord.id,
                            teamId: teamRecord.id,
                            name: title,
                            start: new Date(start.split(".").reverse().join("-")),
                            end: new Date(end.split(".").reverse().join("-")),
                            participantCount: participants_count,
                            genders,
                            ages: Array.from(agesSet),
                            participants,
                            categories: {
                                connect: categoryRecords.map((categoryRecord) => ({
                                    id: categoryRecord.id,
                                })),
                            },
                            sportDisciplineId: sportDisciplineRecord.id,
                        },
                    });

                    //Отправляем уведомления
                    // await SendNotification();
                } else {
                    await db.event.update({
                        where: { id },
                        data: { updatedAt: new Date() },
                    });
                }
            } else {
                await db.event.create({
                    data: {
                        id,
                        cityId: cityRecord.id,
                        teamId: teamRecord.id,
                        name: title,
                        start: new Date(start.split(".").reverse().join("-")),
                        end: new Date(end.split(".").reverse().join("-")),
                        participantCount: participants_count,
                        genders,
                        ages: Array.from(agesSet),
                        participants,
                        categories: {
                            connect: categoryRecords.map((categoryRecord) => ({
                                id: categoryRecord.id,
                            })),
                        },
                        sportDisciplineId: sportDisciplineRecord.id,
                    },
                });
            }

            //await SoftDelete(event);
        }

        return NextResponse.json({ message: "Success" }, { status: 201 });
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }
}

// async function SoftDelete(event: JsonEvent) {
//     const isEventExist = await db.event.findUnique({
//         where: { id: event.id },
//         include: {
//             city: true,
//             team: true,
//             categories: true,
//         },
//     });
//
//     if (isEventExist) {
//         const oneHourAgo = new Date(Date.now() - 3600000);
//         if (isEventExist.updatedAt > oneHourAgo) {
//             return;
//         }
//
//         const changedFields = Object.entries(event)
//             .filter(([key, value]) => {
//                 const isEventExistKey = key as keyof typeof isEventExist;
//                 return isEventExist[isEventExistKey] !== value;
//             })
//             .map(([key]) => key);
//
//         if (changedFields.length > 0) {
//             await db.event.update({ where: { id: isEventExist.id }, data: { isDeleted: true } });
//         }
//         // await SendNotification();
//
//         return true;
//     }
//
//     // await SendNotification();
//
//     return false;
// }
