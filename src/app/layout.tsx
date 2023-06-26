import "./globals.css";
import AppBar from "@/components/navigation/AppBar";
import Providers from "@/lib/hook/Providers";
import {BalanceContextProvider} from "@/context/BalanceContext";


export const metadata = {
    title: "Auction App",
    description: "Next Auction App",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="light">
        <body>
        <Providers>
            <BalanceContextProvider>
                <AppBar/>
                {children}
            </BalanceContextProvider>
        </Providers>
        </body>
        </html>
    );
}
