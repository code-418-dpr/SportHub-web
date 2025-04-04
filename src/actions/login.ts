"use server";

import z from "zod";

import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/security/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/security/routes";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Неверные поля!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser?.email || !existingUser.password) {
        return { error: "Email не существует!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Неверные учетные данные!" };
                default:
                    console.log(error.message);
                    return { error: "Что-то пошло не так!" };
            }
        }

        throw error;
    }
};
