"use client";

import React, {JSX} from "react";
import CreateItemComponent from "@/components/items/CreateItemComponent";

const CreateItemPage: React.FC = (): JSX.Element => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative items-center justify-center min-h-screen overflow-hidden">
                <CreateItemComponent/>
            </div>
        </main>
    );
}

export default CreateItemPage;
