"use client";

import React, {JSX, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage: React.FC = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        toast.success("Login berhasil");
        console.log("handleSubmit");
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-primary-bg py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-4">
                    <h3 className="text-red-600 font-bold text-3xl text-center">Auction App</h3>
                    <div className="w-full rounded-8">
                        <div className="flex justify-center bg-white rounded-lg p-8 gap-[24px] shadow-2xl">
                            <form className="mt-2 w-full"  onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <span className="text-left text-lg font-bold text-gray-900 login-title">Login</span>
                                </div>
                                <input type="hidden" name="remember" value="true" />
                                <div className="rounded-md shadow-sm">
                                    <div className="mb-4">
                                        <label htmlFor="username" className="sr-only">Email</label>
                                        <input id="username" name="email" type="text" required className="appearance-none rounded-none relative block w-full px-0 py-3 border-b border-gray-300 placeholder-gray-300 text-gray-500 focus:outline-none focus:ring-amber-950 focus:border-amber-950 focus:z-10 sm:text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-10">
                                        <label htmlFor="password" className="sr-only">Password</label>
                                        <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-0 py-3 border-b border-gray-300 placeholder-gray-300 text-gray-500 focus:outline-none focus:ring-amber-950 focus:border-amber-950 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center mt-2 p-4 border border-transparent text-sm font-medium rounded-[24px] text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={isLoading} // Disable the button when isLoading is true
                                    >
                                        {isLoading ? "Please wait..." : "Login"}
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-center text-gray-700">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/register"
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        Register
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                />
            </div>
        </>
  );
}

export default LoginPage;
