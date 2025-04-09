"use client";

import { ArrowRightIcon, LogOutIcon, SettingsIcon } from "lucide-react";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/actions/logout";
import { UserAvatar } from "@/components/auth/user-avatar";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export const UserButton = () => {
    const user = useCurrentUser();
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register") {
        return <></>;
    }

    if (!user) {
        return (
            <Link href="/login" className={cn(buttonVariants(), "gap-2")}>
                Войти
                <ArrowRightIcon className="size-5" />
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                        <SettingsIcon className="mr-2 size-4" />
                        Настройки
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        void logout();
                    }}
                >
                    <LogOutIcon className="mr-2 size-4" />
                    Выйти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
