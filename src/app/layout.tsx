import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "../styles/globals.css";
import ReduxProvider from "@/redux/provider/provider";
import AuthProvider from "@/redux/provider/auth-provider";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Quản lí nhà hàng tiệc cưới",
    description: "Quản lí nhà hàng tiệc cưới",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={mulish.className}>
                <ReduxProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
