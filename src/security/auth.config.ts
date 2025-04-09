import type { NextAuthConfig } from "next-auth";

import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PROTECTED_ROUTES } from "@/security/routes";
import { UserRole } from "@prisma/client";

export default {
    pages: {
        signIn: "/login",
        error: "/auth-error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtectedRoute = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route));
            if (isOnProtectedRoute) {
                return isLoggedIn;
            } else if (isLoggedIn && AUTH_ROUTES.some((path) => nextUrl.pathname.startsWith(path))) {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
            return true;
        },

        session({ token, session }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            if (token.role) {
                session.user.role = token.role as UserRole;
            }

            session.user.name = token.name;
            session.user.email = token.email!;
            session.user.isOAuth = !!token.isOAuth;

            return session;
        },

        async jwt({ token }) {
            if (!token.sub) {
                return token;
            }

            const existingUser = await getUserById(token.sub);
            if (!existingUser) {
                return token;
            }

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;

            return token;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
