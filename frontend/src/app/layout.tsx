import type { Metadata } from "next";
import { Inter  } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import Layout from "@/components/shared/Layout";

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: "Yield Chaser",
    description: "Automated yield strategies powered by real-time analytics. Track, optimize, and grow your portfolio with institutional-grade tools.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Layout>{children}</Layout>
                </ThemeProvider>
            </body>
        </html>
    );
}
