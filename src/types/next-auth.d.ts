import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: "ADMIN" | "USER";
        isOAuth?: boolean;
    }

    interface Session {
        user: User & {
            id: string;
            role: "ADMIN" | "USER";
            isOAuth?: boolean;
        };
    }
}
