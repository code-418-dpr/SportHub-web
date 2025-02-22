"use client";

import { useState } from "react";
import Link, { LinkProps } from "next/link";
import { logout } from "@/actions/logout";
import { ArrowRightIcon, FlameIcon, MenuIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/auth/user-avatar";

export function MobileNavbar() {
    const [open, setOpen] = useState(false);
    const user = useCurrentUser();

    const MobileLink = ({
        href,
        className,
        children,
        ...props
    }: {
        onClick?: () => void;
        children: React.ReactNode;
        className?: string;
    } & LinkProps) => {
        return (
            <Link
                href={href}
                onClick={() => {
                    setOpen(false);
                }}
                className={cn(className)}
                {...props}
            >
                {children}
            </Link>
        );
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="p-1">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
                <MobileLink href="/" className="flex items-center">
                    <FlameIcon className="mr-2 h-4 w-4" />
                    <span className="font-bold">{siteConfig.name}</span>
                </MobileLink>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] px-6 pb-10">
                    {user ? (
                        <>
                            <div className="flex flex-col space-y-3 pb-4">
                                {user &&
                                    siteConfig.navLinks.map(
                                        (item) =>
                                            item.href && (
                                                <MobileLink key={item.href} href={item.href}>
                                                    {item.label}
                                                </MobileLink>
                                            )
                                    )}
                            </div>
                            <Separator className="mb-4" />
                            <div className="flex flex-col space-y-3">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex-1 truncate">
                                        <span className="flex-1 truncate font-bold">
                                            {user.name ? user.name : user.email}
                                        </span>
                                    </div>
                                    <UserAvatar user={user} className="size-8" />
                                </div>
                                <MobileLink href="/settings">Настройки</MobileLink>
                                <Button
                                    variant="ghost"
                                    className="h-auto w-full justify-start p-0 text-base font-normal hover:bg-transparent"
                                    onClick={() => logout()}
                                >
                                    Выйти
                                </Button>
                            </div>
                        </>
                    ) : (
                        <MobileLink
                            href="/login"
                            className={cn(buttonVariants(), "mt-4 w-full gap-2")}
                        >
                            Войти
                            <ArrowRightIcon className="size-4" />
                        </MobileLink>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
