"use server";

import { AuthError } from "next-auth";

import { LoginAndRegisterSchema } from "@/schemas";
import { signIn } from "@/security/auth";

export async function login(_: string | undefined, formData: FormData) {
    const validatedFields = await LoginAndRegisterSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!validatedFields.success) {
        return "Ошибка валидации полей";
    }

    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Неверные учётные данные";
                default:
                    return "Произошла ошибка при входе";
            }
        }
        throw error;
    }
}
