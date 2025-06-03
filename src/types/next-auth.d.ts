import "next-auth";

import { UserRole } from "@/app/generated/prisma";

declare module "next-auth" {
    interface User {
        id: string;
        role: UserRole;
        name?: string | null;
        email: string;
        isOAuth?: boolean;
    }

    interface Session {
        user: User;
    }
}
