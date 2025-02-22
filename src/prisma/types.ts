import { Prisma } from "@prisma/client";

export type ExtendedEvent = Prisma.EventGetPayload<{
    include: {
        SportDiscipline: true;
        city: { include: { country: true } };
        team: true;
        categories: true;
    };
}>;
