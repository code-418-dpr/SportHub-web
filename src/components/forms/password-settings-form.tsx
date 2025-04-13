"use client";

import z from "zod";

import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { setPasswordSettings } from "@/actions/settings";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordSettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function PasswordSettingsForm() {
    const [errorMessage, formAction, isPending] = useActionState(setPasswordSettings, undefined);
    const { update } = useSession();

    const form = useForm<z.infer<typeof PasswordSettingsSchema>>({
        resolver: zodResolver(PasswordSettingsSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        void form.handleSubmit((data) => {
            const formData = new FormData();
            formData.append("currentPassword", data.currentPassword);
            formData.append("newPassword", data.newPassword);

            startTransition(async () => {
                formAction(formData);
                await update();
                form.reset();
            });
        })(event);
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Текущий пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="******" type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Новый пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="******" type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={errorMessage} />
                <Button disabled={isPending} type="submit">
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
