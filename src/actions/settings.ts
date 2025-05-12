"use server";

import bcrypt from "bcrypt";

import { getServerSession } from "next-auth";

import { getUserByEmail, getUserById } from "@/data/user";
import db from "@/lib/db";
import { PasswordSettingsSchema, PersonalSettingsSchema } from "@/schemas";

export async function setPersonalSettings(_: string | undefined, formData: FormData) {
    const validatedFields = await PersonalSettingsSchema.safeParseAsync({
        name: formData.get("name"),
        email: formData.get("email"),
    });
    if (!validatedFields.success) {
        return "Ошибка валидации полей";
    }

    const values = validatedFields.data;

    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
        return "Ошибка сессии";
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return "Пользователь не существует";
    }

    if (user.isOAuth) {
        values.email = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return "Email уже используется";
        }
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        },
    });

    session.user.name = updatedUser.name;
    session.user.email = updatedUser.email;
}

export async function setPasswordSettings(_: string | undefined, formData: FormData) {
    const validatedFields = await PasswordSettingsSchema.safeParseAsync({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
    });
    if (!validatedFields.success) {
        return "Ошибка валидации полей";
    }
    const values = validatedFields.data;

    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
        return "Ошибка сессии";
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return "Пользователь не существует";
    }

    if (values.currentPassword && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.currentPassword, dbUser.password);
        if (!passwordsMatch) {
            return "Неверный пароль!";
        }

        values.currentPassword = await bcrypt.hash(values.newPassword, 10);
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            password: values.currentPassword,
        },
    });
}
