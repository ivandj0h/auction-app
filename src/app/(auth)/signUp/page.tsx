"use client";

import React, {useContext, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import TextBox from "@/components/utils/TextBox";
import Button from "@/components/utils/Button";
import {toast, ToastContainer} from "react-toastify";
import {SignUpContext} from "@/lib/hook/SignUpContext";

const SignUpPage = () => {
    const emailRef = useRef("");
    const passRef = useRef("");
    const router = useRouter();
    const {showSignUp} = useContext(SignUpContext);
    const {setShowSignUp} = useContext(SignUpContext);
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = () => {
        setShowSignUp(false);
    };


    const onSubmit = async () => {
        try {
            const name = emailRef.current.split("@")[0].toUpperCase();
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailRef.current,
                    name,
                    password: passRef.current,
                }),
            });

            if (response.ok) {
                toast.success("Account created successfully");
                router.push("/dashboard");
            } else {
                toast.error("Error signing up. Please check your credentials and try again.");
                console.error("Error signing up:", response.statusText);
            }
        } catch (error) {
            toast.error("Error signing up. Please check your credentials and try again.");
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="max-w-md w-full space-y-4">
            <div className="w-full max-w-lg">
                <div className="flex flex-col justify-center bg-white rounded-lg p-8 gap-[24px] shadow-2xl">
                    <h3 className="text-lg font-bold text-left">Register</h3>
                    <form onSubmit={onSubmit}>
                        <TextBox
                            id="txt1"
                            placeholder="Email"
                            onChange={(e) => (emailRef.current = e.target.value)}
                        />
                        <TextBox
                            id="txt2"
                            placeholder="Password"
                            type="password"
                            onChange={(e) => (passRef.current = e.target.value)}
                        />
                        <Button type="submit" className="mt-10" disabled={isLoading}>
                            {isLoading ? "Loading..." : "register"}
                        </Button>
                    </form>
                    <span className="block mt-6 text-center text-gray-500">Already have an account?{" "}
                        <a onClick={handleLogin} href="#" className="text-blue-600">Login Here</a>
                    </span>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                />
            </div>
        </div>
    );
};

export default SignUpPage;
