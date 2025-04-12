import type { NextAuthConfig } from "next-auth";

import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PROTECTED_ROUTES } from "@/security/routes";
import { UserRole } from "@prisma/client";

// Проверка на Edge Runtime
const isEdgeRuntime = typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge";

export default {
    pages: {
        signIn: "/login",
        error: "/auth-error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtectedRoute = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route));

            if (isOnProtectedRoute) return isLoggedIn;
            if (isLoggedIn && AUTH_ROUTES.some((path) => nextUrl.pathname.startsWith(path))) {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
            return true;
        },

        session({ token, session }) {
            if (token.sub) session.user.id = token.sub;
            if (token.role) session.user.role = token.role as UserRole;

            session.user.name = token.name;
            session.user.email = token.email!;
            session.user.isOAuth = !!token.isOAuth;

            return session;
        },

        async jwt({ token }) {
            if (!token.sub || isEdgeRuntime) return token;

            try {
                const existingUser = await getUserById(token.sub);
                if (!existingUser) return token;

                const existingAccount = await getAccountByUserId(existingUser.id);

                return {
                    ...token,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    isOAuth: !!existingAccount,
                };
            } catch (error) {
                console.error("JWT callback error:", error);
                return token;
            }
        },
    },
    providers: [],
} satisfies NextAuthConfig;
