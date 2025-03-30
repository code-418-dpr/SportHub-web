"use client";

import z from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSearchParams } from "next/navigation";

import { login } from "@/actions/login";
import { register } from "@/actions/register";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState(false);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        setIsPending(true);
        register(values).then((data) => {
            if (data.error) {
                setError(data.error);
                form.reset();
                setIsPending(false);
            } else {
                setSuccess(data.success);
                login(values, callbackUrl);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        disabled={isPending}
                                        placeholder="john.doe@example.com"
                                        type="email"
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
                                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={error} successMessage={success} />
                <Button disabled={isPending} type="submit" className="w-full">
                    Создать аккаунт
                </Button>
            </form>
        </Form>
    );
};
