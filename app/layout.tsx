import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "RetailPulse | Analytics Dashboard",
    description: "High-fidelity retail analytics dashboard",
};

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("bg-slate-950 text-slate-50 min-h-screen")}>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
