"use client";

import React from "react";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/security/routes";

export const OauthButtons = (): React.ReactNode => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onClick = (provider: "yandex") => {
        void signIn(provider, {
            callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
        });
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">Или</span>
                </div>
            </div>
            <div className="flex w-full items-center gap-x-2">
                <Button
                    size="lg"
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                        onClick("yandex");
                    }}
                >
                    Яндекс
                </Button>
            </div>
        </div>
    );
};
