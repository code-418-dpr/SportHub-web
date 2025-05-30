import "next-auth";

import { UserRole } from "@/app/generated/prisma";

declare module "next-auth" {
    interface User {
        id: string;
        role: UserRole;
        isOAuth?: boolean;
    }

    interface Session {
        user: User & {
            id: string;
            role: UserRole;
            isOAuth?: boolean;
        };
    }
}
