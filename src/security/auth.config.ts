import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";

export default {
    providers: [
        Yandex({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if (!user?.password) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        return user;
                    }
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
