"use client";

import React, {JSX} from "react";
import NavBarComponent from "@/components/navigation/NavBarComponent";

const DashboardPage: React.FC = (): JSX.Element => {
    return (
        <>
            <NavBarComponent/>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="relative items-center justify-center min-h-screen overflow-hidden">
                    <h1>Dashboard Page</h1>
                </div>
            </main>
        </>
    );
}

export default DashboardPage;
