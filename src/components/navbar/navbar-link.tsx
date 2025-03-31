"use client";

import React from "react";

import Link from "next/link";

interface NavbarLinkProps {
    href: string;
    children: React.ReactNode;
}

export function NavbarLink({ href, children }: NavbarLinkProps) {
    return (
        <Link className="text-muted-foreground hover:text-foreground text-sm transition-colors" href={href}>
            {children}
        </Link>
    );
}
