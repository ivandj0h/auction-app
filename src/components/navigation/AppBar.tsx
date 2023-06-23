"use client";

import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {useRouter} from "next/navigation";
import { SignUpContext } from "@/lib/hook/SignUpContext";
import { FaFileAlt, FaMoneyBillWave, FaSignOutAlt, FaUser } from 'react-icons/fa';
import {useNavigationEvent} from "@/lib/hook/useNavigationEvent";

const AppBar = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const [balance, setBalance] = useState<number>(0);
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

    const fetchBalance = async () => {
        try {
            const response = await fetch("/api/balance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: session?.user?.id }), // Pass the user id here
            });

            const data = await response.json();

            // Update the balance state
            setBalance(data?.amount || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [session?.user?.id]);

    useNavigationEvent(session, setBalance);

    return (
        <header ref={ref} className="fixed top-0 z-50 w-full flex gap-4 p-2 bg-gray-200 border-b-[2px] border-gray-150">
            <h3 className="font-black text-lg text-center ml-10">Auction App</h3>
            {session && session.user ? (
                <div className="relative ml-auto mr-10">
                    <div className="flex items-center">
                        <p className="text-black mr-2">
                            {session.user.name.toUpperCase()} (${balance})
                        </p>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <FaUser className="h-8 w-8 rounded-full border-2 border-gray-600" />
                        </button>
                    </div>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                            <Link onClick={() => setIsOpen(false)} href="/dashboard" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-600">
                                <div className="flex items-center justify-start">
                                    <FaFileAlt className="h-6 w-6 rounded-full border-2 border-gray-600 mr-2" />
                                    <span>Dashboard</span>
                                </div>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/item" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-600">
                                <div className="flex items-center justify-start">
                                    <FaFileAlt className="h-6 w-6 rounded-full border-2 border-gray-600 mr-2" />
                                    <span>Data Item</span>
                                </div>
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/deposit" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-600">
                                <div className="flex items-center justify-start">
                                    <FaMoneyBillWave className="h-6 w-6 rounded-full border-2 border-gray-600 mr-2" />
                                    <span>Deposit</span>
                                </div>
                            </Link>
                            <a onClick={() => { signOut(); setIsOpen(false); }} className="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-600 border-t-2 border-gray-200">
                                <div className="flex items-center justify-start">
                                    <FaSignOutAlt className="h-6 w-6 rounded-full border-2 border-gray-600 mr-2" />
                                    <span>Logout</span>
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <></>
            )}
        </header>
    );
};

export default AppBar;
