import { Prisma } from "@/app/generated/prisma";

export type ExtendedEvent = Prisma.EventGetPayload<{
    include: {
        sportDiscipline: true;
        city: { include: { country: true } };
        team: true;
        categories: true;
    };
}>;
