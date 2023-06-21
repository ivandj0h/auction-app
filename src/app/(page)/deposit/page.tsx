"use client";

import React, {JSX} from "react";
import DepositComponent from "@/components/items/DepositComponent";

const DepositPage: React.FC = (): JSX.Element => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative items-center justify-center min-h-screen overflow-hidden">
                <DepositComponent/>
            </div>
        </main>
    );
}

export default DepositPage;
