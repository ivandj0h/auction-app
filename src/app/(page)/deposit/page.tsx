"use client";

import React, {useEffect, useState} from "react";
import useRequireAuth from "@/lib/hook/useRequireAuth";
import Spinner from "@/components/utils/Spinner";
import DepositInputComponent from "@/components/deposit/DepositInputComponent";
import AppBar from "@/components/navigation/AppBar";

const DepositPage = () => {
    const {session, isLoading} = useRequireAuth();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setShowContent(true);
            }, 3000);
        }
    }, [isLoading]);

    if (isLoading || !showContent) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex items-center gap-3">
                    <Spinner/>
                    <span className="text-slate-500 inline-block">Loading...</span>
                </div>
            </div>
        );
    }


    return (
        <main className="flex items-center justify-center min-h-screen">
            <DepositInputComponent/>
        </main>
    )
}

export default DepositPage;
