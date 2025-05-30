import bcrypt from "bcryptjs";

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";

import { UserRole } from "@/app/generated/prisma";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { LoginAndRegisterSchema } from "@/schemas";

export const authOptions: NextAuthOptions = {
    providers: [
        Yandex({ clientId: process.env.AUTH_YANDEX_ID!, clientSecret: process.env.AUTH_YANDEX_SECRET! }),
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const validatedFields = await LoginAndRegisterSchema.safeParseAsync(credentials);
                    if (!validatedFields.success) {
                        return null;
                    }
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    if (!user || !(await bcrypt.compare(password, user.password!))) {
                        throw new Error("Неверный email или пароль");
                    }
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: "USER",
                        isOAuth: false,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user as User | undefined) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token.role && token.id) {
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
            }

            session.user.name = token.name;
            session.user.email = token.email!;
            session.user.isOAuth = !!token.isOAuth;

            return session;
        },
        redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
