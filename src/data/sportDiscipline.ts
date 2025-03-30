import { db } from "@/lib/db";
import { Event } from "@prisma/client";

export interface GetSportDiscipline {
    name: string | undefined;
    events: Event[] | undefined;
    sortBy: string | undefined;
    sortDirection: string | undefined;
    page: number;
    pageSize: number;
}

export const getFilteredSportDisciplineWithPagination = async (request: GetSportDiscipline) => {
    const whereClause: any = {};

    if (request.name) {
        whereClause.name = request.name;
    }

    const direction: any = request.sortBy
        ? {
              [request.sortBy]: request.sortDirection === "asc" ? "asc" : "desc",
          }
        : "asc";

    const result = await db.sportDiscipline.findMany({
        where: {
            ...(request.name ? { name: request.name } : {}),
        },
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
        include: {
            events: true,
        },
    });

    return result;
};

export const getSportDisciplines = async () => {
    const result = await db.sportDiscipline.findMany();
    return result;
};
