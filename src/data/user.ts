"use server";

import bcrypt from "bcryptjs";

import db from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
    return db.user.findUnique({ where: { id } });
};

export const createUser = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.user.create({ data: { email, password: hashedPassword, role: "USER" } });
};

export const getAllUserEmails = async () => {
    const userEmails = await db.user.findMany({ select: { email: true } });

    return userEmails.map(({ email }) => email);
};
