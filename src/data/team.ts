"use server";

import { Event } from "@/app/generated/prisma";
import db from "@/lib/db";

interface GetTeam {
    name?: string;
    events?: Event[];
    sortBy?: string;
    sortDirection?: string;
    page: number;
    pageSize: number;
}

export const getFilteredTeamWithPagination = async (request: GetTeam) => {
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

    return db.team.findMany({
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

export const getTeams = async () => {
    return db.team.findMany();
};
