"use server";

import { City, Country, Event } from "@prisma/client";

import { db } from "@/lib/db";

export type GetCities = {
    name: string | undefined;
    countryId: string | undefined;
    country: Country | undefined;
    events: Event[] | undefined;
    sortBy: string | undefined;
    sortDirection: string | undefined;
    page: number;
    pageSize: number;
};

export const getFilteredCitiesWithPagination = async (request: GetCities): Promise<City[]> => {
    const whereClause: any = {};

    if (request.name) {
        whereClause.name = request.name;
    }

    if (request.countryId) {
        whereClause.countryId = request.countryId;
    }

    const direction: any = request.sortBy
        ? {
              [request.sortBy]: request.sortDirection === "asc" ? "asc" : "desc",
          }
        : "asc";

    const result = await db.city.findMany({
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

    return result;
};

export const getCitiesOfCountries = async (countryIds: string[]): Promise<City[]> => {
    const result = await db.city.findMany({
        where: {
            countryId: { in: countryIds },
        },
    });
    return result;
};
