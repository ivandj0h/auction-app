import AppBar from "@/components/navigation/AppBar";
import "./globals.css";
import Providers from "@/lib/hook/Providers";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const metadata = {
    title: "Auction App",
    description: "Next Auction App",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="light">
        <body>
        <Providers>
            <AppBar/>
            {children}
        </Providers>
        <ToastContainer/>
        </body>
        </html>
    );
}
