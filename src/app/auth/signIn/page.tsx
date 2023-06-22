"use client";

import React, {useRef, useState} from "react";
import {signIn} from "next-auth/react";
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const userName = useRef("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const pass = useRef("");

    const onSubmit = async () => {
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                username: userName.current,
                password: pass.current,
                redirect: true,
                callbackUrl: "/",
            });

            if (result?.error) {
                toast.error(`Error signing in: ${result.error}`);
                setIsLoading(false);
            } else {
                toast.success("Successfully signed in!");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            toast.error("Error signing in. Please check your credentials and try again.");
            setIsLoading(false);
        }
    };
    return (
            <div className="max-w-md w-full space-y-4">

                <div className="w-full max-w-lg">
                    <div className="flex flex-col justify-center bg-white rounded-lg p-8 gap-[24px] shadow-2xl">
                        <h3 className="text-lg font-bold text-left">Login</h3>
                        <TextBox id="txt3" placeholder="User Name" onChange={(e) => (userName.current = e.target.value)} />
                        <TextBox id="txt4" placeholder="Password" type="password" onChange={(e) => (pass.current = e.target.value)} />
                        <Button onClick={onSubmit} className="mt-10" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Login"}
                        </Button>
                    </div>
                </div>
            </div>


    );
}

export default LoginPage;
