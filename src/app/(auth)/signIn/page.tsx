"use client";

import React, {useContext, useRef, useState} from "react";
import {signIn} from "next-auth/react";
import TextBox from "@/components/utils/TextBox";
import Button from "@/components/utils/Button";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SignUpContext} from "@/lib/hook/SignUpContext";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const userName = useRef("");
    const pass = useRef("");

    const {showSignUp, setShowSignUp} = useContext(SignUpContext);

    const handleSignUp = () => {
        setShowSignUp(true);
    };

    const onSubmit = async (event: any) => {
        event.preventDefault();
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
                    <form onSubmit={onSubmit}>
                        <TextBox id="txt3" placeholder="Input  Email" onChange={(e) => (userName.current = e.target.value)}/>
                        <TextBox id="txt4" placeholder="Input  Password" type="password"
                                 onChange={(e) => (pass.current = e.target.value)}/>
                        <Button type="submit" className="mt-10" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Login"}
                        </Button>
                    </form>
                    <span className="block mt-6 text-center text-gray-500">Need an account?{" "}
                        <a onClick={handleSignUp} href="#" className="text-blue-600">Sign Up Here</a>
                    </span>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                />
            </div>
        </div>
    );
}

export default LoginPage;
