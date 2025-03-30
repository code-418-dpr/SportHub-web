"use client";

import { ArrowRightIcon, LogOutIcon, SettingsIcon } from "lucide-react";

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

export const UserButton = (): React.ReactNode => {
    const user = useCurrentUser();
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register") {
        return <div></div>;
    }

    if (!user) {
        return (
            <Link href="/login" className={cn(buttonVariants(), "gap-2")}>
                Войти
                <ArrowRightIcon className="size-4" />
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Настройки
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Выйти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
