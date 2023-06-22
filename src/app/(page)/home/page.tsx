"use client";

import {useContext} from "react";
import SignUpPage from "@/app/auth/signUp/page";
import LoginPage from "@/app/auth/signIn/page";
import {SignUpContext} from "@/lib/hook/SignUpContext";


export default function Home() {
    const { showSignUp } = useContext(SignUpContext);

    return (
        <main className="flex items-center justify-center min-h-screen overflow-hidden bg-gray-100">
            {showSignUp ? <SignUpPage/> : <LoginPage/>}
        </main>

    )
}
