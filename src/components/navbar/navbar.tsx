"use client";

import { FlameIcon } from "lucide-react";

import Link from "next/link";

import { UserButton } from "@/components/auth/user-button";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";
import { NavbarLink } from "@/components/navbar/navbar-link";
import { ModeToggle } from "@/components/theming/mode-toggle";
import siteMetadata from "@/conf/site-metadata";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

function NavLinksBlock() {
    return siteMetadata.navLinks.map((link) => (
        <NavbarLink key={link.href} href={link.href}>
            {link.label}
        </NavbarLink>
    ));
}

export function Navbar() {
    const scrolled = useScroll(10);
    const user = useCurrentUser();

    return (
        <header
            className={cn("fixed top-0 right-0 left-0 z-50", scrolled && "border-border border-b backdrop-blur-xl")}
        >
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 rounded-xl p-4 md:gap-10">
                <Link className="flex items-center gap-2" href="/">
                    <FlameIcon className="size-6" />
                    <span className="text-xl font-bold">{siteMetadata.name}</span>
                </Link>
                <div className="hidden flex-1 items-center justify-between gap-2 md:flex">
                    <nav className="flex flex-1 items-center gap-6">{user && <NavLinksBlock />}</nav>
                    <UserButton />
                    <ModeToggle />
                </div>
                <MobileNavbar className="flex md:hidden" />
            </div>
        </header>
    );
}
