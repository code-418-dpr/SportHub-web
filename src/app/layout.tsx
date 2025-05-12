import React from "react";

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";

import AuthProvider from "@/components/auth/auth-provider";
import { Navbar } from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theming/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import siteMetadata from "@/conf/site-metadata";
import { cn } from "@/lib/utils";

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
    const session = await getServerSession();

    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen")}>
                <AuthProvider session={session}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <Toaster />
                        <Navbar />
                        <div className="mt-10">{children}</div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
