"use client"

import Link from "next/link";
import React, {useContext, useEffect, useRef, useState} from "react";
import { signOut, useSession } from "next-auth/react";
import {useRouter} from "next/navigation";
import {SignUpContext} from "@/lib/hook/SignUpContext";

const AppBar = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const { showSignUp } = useContext(SignUpContext);
    const { setShowSignUp } = useContext(SignUpContext);

    const handleSignUp = () => {
        setShowSignUp(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogin = () => {
        setShowSignUp(false);
    };

    return (
        <header ref={ref} className="fixed top-0 z-10 w-full flex gap-4 p-4 bg-white shadow-md">
            <Link href="/">
                <h3 className="text-red-600 font-bold text-3xl text-center">Auction App</h3>
            </Link>
            {session && session.user ? (
                <div className="relative ml-auto">
                    <div className="flex items-center">
                        <p className="text-black mr-2">Logged As {session.user.name}</p>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <img src="https://source.unsplash.com/random/100x100" alt="Profile" className="h-8 w-8 rounded-full" />
                        </button>
                    </div>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                            <Link href="/item" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-red-500 hover:text-white">
                                Create New Item
                            </Link>
                            <Link href="/deposit" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-red-500 hover:text-white">
                                Deposit
                            </Link>
                            <a onClick={() => {signOut(); setIsOpen(false);}} className="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-red-500 hover:text-white">
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {showSignUp ? (
                        <button onClick={handleLogin} className="text-green-600 ml-auto">
                            Login
                        </button>
                    ) : (
                        <button onClick={handleSignUp} className="text-green-600 ml-auto">
                            Register
                        </button>
                    )}
                </>
            )}
        </header>
    );
};

export default AppBar;
