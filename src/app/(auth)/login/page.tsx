import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OauthButtons } from "@/components/auth/oauth-buttons";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const registerUrl = `/register${
        Object.keys(searchParams).length > 0
            ? `?${new URLSearchParams(searchParams as Record<string, string>).toString()}`
            : ""
    }`;

    return (
        <div className="w-[min(calc(100%-2rem),400px)] space-y-4">
            <h1 className="pb-4 text-center text-3xl font-semibold">Добро пожаловать</h1>
            <LoginForm />
            <OauthButtons />
            <Button variant="link" className="w-full font-normal" size="sm" asChild>
                <Link href={registerUrl}>Ещё нет аккаунта?</Link>
            </Button>
        </div>
    );
}
