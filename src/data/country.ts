import { db } from "@/lib/db";
import { City } from "@prisma/client";

export interface GetCountries {
    name: string | undefined;
    cities: City[] | undefined;
    sortBy: string | undefined;
    sortDirection: string | undefined;
    page: number;
    pageSize: number;
}

export const getFilteredCountriseWithPagination = async (request: GetCountries) => {
    const whereClause: any = {};

    if (request.name) {
        whereClause.name = request.name;
    }

    const direction: any = request.sortBy
        ? {
              [request.sortBy]: request.sortDirection === "asc" ? "asc" : "desc",
          }
        : "asc";

    const result = await db.country.findMany({
        where: {
            ...(request.name ? { name: request.name } : {}),
        },
        skip: (request.page - 1) * request.pageSize,
        take: request.pageSize,
        include: {
            cities: true,
        },
    });

    return result;
};

export const getCountries = async () => {
    const result = await db.country.findMany();
    return result;
};
