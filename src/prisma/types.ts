import { Prisma } from "@/app/generated/prisma";

export type ExtendedEvent = Prisma.EventGetPayload<{
    include: {
        SportDiscipline: true;
        city: { include: { country: true } };
        team: true;
        categories: true;
    };
}>;
