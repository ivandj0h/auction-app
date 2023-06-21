"use client";

import React, {JSX} from "react";
import BidItemComponent from "@/components/items/BidItemComponent";

const BidItemPage: React.FC = (): JSX.Element => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative items-center justify-center min-h-screen overflow-hidden">
                <BidItemComponent/>
            </div>
        </main>
    );
}

export default BidItemPage;
