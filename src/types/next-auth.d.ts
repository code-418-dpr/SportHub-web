import "next-auth";

import { UserRole } from "@/app/generated/prisma";

declare module "next-auth" {
    interface User {
        id: string;
        role: UserRole;
        name?: string | null;
        email?: string | null;
        isOAuth?: boolean;
    }

    interface Session {
        user: User;
    }
}
