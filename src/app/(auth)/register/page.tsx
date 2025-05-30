import React from "react";

import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { LoginOrRegisterForm } from "@/components/forms/login-or-register-form";
import { Button } from "@/components/ui/button";

export default async function RegisterPage(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const searchParams = await props.searchParams;
    const loginUrl = `/login${
        Object.keys(searchParams).length > 0
            ? `?${new URLSearchParams(searchParams as Record<string, string>).toString()}`
            : ""
    }`;

    return (
        <div className="w-[min(calc(100%-2rem),400px)] space-y-4">
            <h1 className="pb-4 text-center text-3xl font-semibold">Создать аккаунт</h1>
            <LoginOrRegisterForm mode="register" />
            <OAuthButtons />
            <Button variant="link" className="w-full font-normal" size="sm" asChild>
                <Link href={loginUrl}>Уже есть аккаунт?</Link>
            </Button>
        </div>
    );
}
