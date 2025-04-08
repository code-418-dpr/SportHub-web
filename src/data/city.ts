"use server";

import { db } from "@/lib/db";
import { City, Country, Event } from "@prisma/client";

interface GetCities {
    name: string | undefined;
    countryId: string | undefined;
    country: Country | undefined;
    events: Event[] | undefined;
    sortBy: string | undefined;
    sortDirection: string | undefined;
    page: number;
    pageSize: number;
}

export const getFilteredCitiesWithPagination = async (request: GetCities) => {
    // const whereClause: any = {};
    //
    // if (request.name) {
    //     whereClause.name = request.name;
    // }
    //
    // if (request.countryId) {
    //     whereClause.countryId = request.countryId;
    // }
    //
    // const direction: any = request.sortBy
    //     ? {
    //           [request.sortBy]: request.sortDirection === "asc" ? "asc" : "desc",
    //       }
    //     : "asc";

    return db.city.findMany({
        where: {
            ...(request.name ? { name: request.name } : {}),
            ...(request.countryId ? { countryId: request.countryId } : {}),
        },
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
        include: {
            events: true,
            country: true,
        },
    });
};

export const getCitiesOfCountries = async (countryIds: string[]): Promise<City[]> => {
    return db.city.findMany({
        where: {
            countryId: { in: countryIds },
        },
    });
};
