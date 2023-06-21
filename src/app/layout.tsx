import './globals.css'
import {Roboto} from 'next/font/google'
import React from "react";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: 'Auction App',
    description: 'Discover unbeatable deals on our Auction App',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={roboto.className}>{children}</body>
        </html>
    )
}
