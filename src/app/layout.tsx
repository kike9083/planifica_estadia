import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Planifica Estadía | ProMax",
    description: "Sistema premium de planificación de estadías y presupuestos",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${jakarta.variable} ${outfit.variable} antialiased font-sans`}
                suppressHydrationWarning
            >
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
