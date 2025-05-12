"use client";

import z from "zod";

import React, { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { setPersonalSettings } from "@/actions/settings";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { PersonalSettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function PersonalSettingsForm() {
    const [errorMessage, formAction, isPending] = useActionState(setPersonalSettings, undefined);
    const { update } = useSession();
    const { user } = useAuth();

    const form = useForm<z.infer<typeof PersonalSettingsSchema>>({
        resolver: zodResolver(PersonalSettingsSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
        },
    });

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        void form.handleSubmit((data) => {
            const formData = new FormData();
            if (data.name) {
                formData.append("name", data.name);
            }
            if (data.email) {
                formData.append("email", data.email);
            }

            startTransition(async () => {
                formAction(formData);
                await update();
            });
        })(event);
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Имя</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="John Doe" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {user?.isOAuth === false && (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="john.doe@example.com"
                                                type="email"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>
                <FormFeedback errorMessage={errorMessage} />
                <Button disabled={isPending} type="submit">
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
