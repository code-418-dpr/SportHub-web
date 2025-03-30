import z from "zod";

export const PersonalSettingsSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
});

export const PasswordSettingsSchema = z
    .object({
        currentPassword: z.optional(z.string().min(6)),
        newPassword: z.optional(z.string().min(6)),
    })
    .refine(
        (data) => {
            return !(data.currentPassword && !data.newPassword);
        },
        {
            message: "New password is required!",
            path: ["newPassword"],
        },
    )
    .refine(
        (data) => {
            return !(data.newPassword && !data.currentPassword);
        },
        {
            message: "Password is required!",
            path: ["currentPassword"],
        },
    );

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required ",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
});
