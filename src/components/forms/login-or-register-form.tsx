"use client";

import z from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser } from "@/data/user";
import { LoginAndRegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginOrRegisterFormProps {
    mode?: "login" | "register";
}

type LoginAndRegisterFormData = z.infer<typeof LoginAndRegisterSchema>;

export const LoginOrRegisterForm = ({ mode = "login" }: LoginOrRegisterFormProps) => {
    // const [errorMessage, formAction, isPending] = useActionState(mode === "login" ? login : register, undefined);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(LoginAndRegisterSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<LoginAndRegisterFormData> = async ({ email, password }) => {
        try {
            setIsLoading(true);
            setFormError(null);

            if (mode === "register") {
                await createUser(email, password);
            }

            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (signInResult?.error) {
                throw new Error(signInResult.error);
            }
            router.push("/");
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("email")) {
                    form.setError("root", { message: error.message });
                    setFormError(error.message);
                } else {
                    setFormError(error.message);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void form.handleSubmit(onSubmit)(e);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="john.doe@example.com"
                                        autoComplete="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="******"
                                        type="password"
                                        autoComplete="current-password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={formError ?? undefined} />
                <Button disabled={isLoading} type="submit" className="w-full">
                    {mode === "login" ? "Войти" : "Создать аккаунт"}
                </Button>
            </form>
        </Form>
    );
};
