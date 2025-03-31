import React from "react";

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theming/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import siteMetadata from "@/conf/site-metadata";
import { cn } from "@/lib/utils";
import { auth } from "@/security/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: { default: siteMetadata.name, template: `%s | ${siteMetadata.name}` },
    applicationName: siteMetadata.name,
    description: siteMetadata.description,
    authors: [siteMetadata.authors],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <html lang="ru" suppressHydrationWarning>
                <body className={cn(inter.className, "min-h-screen")}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <Toaster />
                        <Navbar />
                        <div className="mt-10">{children}</div>
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    );
}
