"use client";

import z from "zod";

import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { register } from "@/actions/register";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginAndRegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm = () => {
    const [errorMessage, formAction, isPending] = useActionState(register, undefined);

    const form = useForm<z.infer<typeof LoginAndRegisterSchema>>({
        resolver: zodResolver(LoginAndRegisterSchema),
    });

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        void form.handleSubmit((data) => {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

            startTransition(() => {
                formAction(formData);
            });
        })(event);
    };

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="john.doe@example.com" />
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
                <FormFeedback errorMessage={errorMessage} />
                <Button disabled={isPending} type="submit" className="w-full">
                    Создать аккаунт
                </Button>
            </form>
        </Form>
    );
};
