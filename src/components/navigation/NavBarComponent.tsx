"use client";

import React, {JSX} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
const NavBarComponent: React.FC = (): JSX.Element => {

    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    }
    return (
        <main className="fixed w-full z-50">
            <header className="flex w-full bg-primary-bg py-4 px-2 bg-white sticky top-0 z-50 drop-shadow-lg">
                <div className="w-full px-8 flex justify-between">
                    <div className="flex justify-start md:space-x-10">
                        <Link href={"/dashboard"}>
                            <h3 className="text-red-600">Auction App</h3>
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-10 sticky top-0 z-50">
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                </div>
            </header>
        </main>
    )
}

export default NavBarComponent;
