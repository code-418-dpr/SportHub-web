"use server";

import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { db } from "@/lib/db";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Неверные поля!" };
    }

    const { email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    } catch {
        return { error: "Что-то пошло не так!" };
    }

    return { success: "Аккаунт успешно создан!" };
};
