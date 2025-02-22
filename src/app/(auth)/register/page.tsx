import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OauthButtons } from "@/components/auth/oauth-buttons";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}): React.ReactNode {
    const loginUrl = `/login${
        Object.keys(searchParams).length > 0
            ? `?${new URLSearchParams(searchParams as Record<string, string>).toString()}`
            : ""
    }`;

    return (
        <div className="w-[min(calc(100%-2rem),400px)] space-y-4">
            <h1 className="pb-4 text-center text-3xl font-semibold">Создать аккаунт</h1>
            <RegisterForm />
            <OauthButtons />
            <Button variant="link" className="w-full font-normal" size="sm" asChild>
                <Link href={loginUrl}>Уже есть аккаунт?</Link>
            </Button>
        </div>
    );
}
