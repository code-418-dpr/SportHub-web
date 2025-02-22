import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/security/auth";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.ReactNode> {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <html lang="en">
                <body className={cn(inter.className, "min-h-screen")}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster />
                        <div className="flex min-h-full w-full flex-col pt-16">
                            <Navbar />
                            {children}
                        </div>
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    );
}
