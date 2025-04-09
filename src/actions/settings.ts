"use server";

import bcrypt from "bcryptjs";
import z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PasswordSettingsSchema, PersonalSettingsSchema } from "@/schemas";
import { update } from "@/security/auth";

export const setPersonalSettings = async (values: z.infer<typeof PersonalSettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id!);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (user.isOAuth) {
        values.email = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email уже используется!" };
        }
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        },
    });

    await update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
        },
    });

    return { success: "Настройки успешно обновлены!" };
};

export const setPasswordSettings = async (values: z.infer<typeof PasswordSettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id!);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (values.currentPassword && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.currentPassword, dbUser.password);

        if (!passwordsMatch) {
            return { error: "Неверный пароль!" };
        }

        values.currentPassword = await bcrypt.hash(values.newPassword, 10);
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            password: values.currentPassword,
        },
    });

    return { success: "Пароль успешно изменен!" };
};
