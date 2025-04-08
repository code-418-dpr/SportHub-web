"use server";

import { db } from "@/lib/db";
import { Event } from "@prisma/client";

interface GetSportDiscipline {
    name?: string;
    events?: Event[];
    sortBy?: string;
    sortDirection?: string;
    page: number;
    pageSize: number;
}

export const getFilteredSportDisciplineWithPagination = async (request: GetSportDiscipline) => {
    // const whereClause: any = {};
    //
    // if (request.name) {
    //     whereClause.name = request.name;
    // }
    //
    // const direction: any = request.sortBy
    //     ? {
    //           [request.sortBy]: request.sortDirection === "asc" ? "asc" : "desc",
    //       }
    //     : "asc";

    return db.sportDiscipline.findMany({
        where: {
            ...(request.name ? { name: request.name } : {}),
        },
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
        include: {
            events: true,
        },
    });
};

export const getSportDisciplines = async () => {
    return db.sportDiscipline.findMany();
};
