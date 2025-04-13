import bcrypt from "bcryptjs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { LoginAndRegisterSchema } from "@/schemas";
import authConfig from "@/security/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const {
    handlers,
    auth,
    signIn,
    signOut,
    unstable_update: update,
} = NextAuth({
    ...authConfig,
    providers: [
        Yandex,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const validatedFields = await LoginAndRegisterSchema.safeParseAsync(credentials);
                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;
                const user = await getUserByEmail(email);
                if (!user?.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                return passwordsMatch ? user : null;
            },
        }),
    ],
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
});
