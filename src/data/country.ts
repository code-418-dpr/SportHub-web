"use server";

import { db } from "@/lib/db";
import { City } from "@prisma/client";

interface GetCountries {
    name?: string;
    cities?: City[];
    sortBy?: string;
    sortDirection?: string;
    page: number;
    pageSize: number;
}

export const getFilteredCountriseWithPagination = async (request: GetCountries) => {
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

    return db.country.findMany({
        where: {
            ...(request.name ? { name: request.name } : {}),
        },
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
        include: {
            cities: true,
        },
    });
};

export const getCountries = async () => {
    return db.country.findMany();
};
