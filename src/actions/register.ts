"use server";

import bcrypt from "bcryptjs";

import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { LoginAndRegisterSchema } from "@/schemas";
import { signIn } from "@/security/auth";

export async function register(_: string | undefined, formData: FormData) {
    const validatedFields = await LoginAndRegisterSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!validatedFields.success) {
        return "Ошибка валидации полей";
    }

    try {
        const { email, password } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        await signIn("credentials", formData);
        return;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Неверные учётные данные";
                default:
                    return "Произошла ошибка при регистрации";
            }
        } else if (error instanceof Error && error.message.includes("Unique constraint")) {
            return "Пользователь с таким email уже существует";
        }
        throw error;
    }
}
