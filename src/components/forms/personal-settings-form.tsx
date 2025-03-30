"use client";

import z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { setPersonalSettings } from "@/actions/settings";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PersonalSettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function PersonalSettingsForm() {
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof PersonalSettingsSchema>>({
        resolver: zodResolver(PersonalSettingsSchema),
        defaultValues: {
            name: user?.name ?? undefined,
            email: user?.email ?? undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof PersonalSettingsSchema>) => {
        startTransition(() => {
            setPersonalSettings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => {
                    setError("Something went wrong!");
                });
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormFeedback errorMessage={error} successMessage={success} />
                <Button disabled={isPending} type="submit">
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
