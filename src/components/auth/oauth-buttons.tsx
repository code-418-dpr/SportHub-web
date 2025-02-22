"use client";

import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/security/routes";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export const OauthButtons = (): React.ReactNode => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onClick = (provider: "yandex") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Или</span>
                </div>
            </div>
            <div className="flex w-full items-center gap-x-2">
                <Button
                    size="lg"
                    className="w-full"
                    variant="outline"
                    onClick={() => onClick("yandex")}
                >
                    Яндекс
                </Button>
            </div>
        </div>
    );
};
