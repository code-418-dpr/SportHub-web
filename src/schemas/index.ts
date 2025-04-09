import z from "zod";

export const PersonalSettingsSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email("Неверный формат email")),
});

export const PasswordSettingsSchema = z.object({
    currentPassword: z
        .string({ required_error: "Для смены пароля введите старый пароль" })
        .min(6, "Пароль должен состоять из не менее 6 символов"),
    newPassword: z
        .string({ required_error: "Для смены пароля введите новый пароль" })
        .min(6, "Пароль должен состоять из не менее 6 символов"),
});

export const LoginAndRegisterSchema = z.object({
    email: z.string({ required_error: "Email обязателен для входа" }).email("Неверный формат email"),
    password: z
        .string({ required_error: "Пароль обязателен для входа" })
        .min(6, "Пароль должен состоять из не менее 6 символов"),
});
