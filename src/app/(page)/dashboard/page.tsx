"use client"

import React, { useState } from "react";
import useRequireAuth from "@/lib/hook/useRequireAuth";
import OnGoingTable from "@/components/tables/OnGoing";
import Completed from "@/components/tables/Completed";


const DashboardPage = () => {
    const { session, isLoading } = useRequireAuth();
    const [activeTab, setActiveTab] = useState('Ongoing');



    return (
        <main className="flex min-h-screen flex-col items-left p-24">
            <div className="w-full flex justify-start mb-2 border-b-2 sticky top-0 bg-white z-10">
                <button
                    className={`px-4 py-4 border-b-4 ${activeTab === 'Ongoing' ? 'font-bold border-blue-500' : 'border-transparent'}`}
                    onClick={() => setActiveTab('Ongoing')}
                >
                    Ongoing
                </button>
                <button
                    className={`px-4 py-0.5 border-b-4 ${activeTab === 'Complete' ? 'font-bold border-blue-500' : 'border-transparent'}`}
                    onClick={() => setActiveTab('Complete')}
                >
                    Completed
                </button>
            </div>
            <div className="overflow-y-auto h-full">
                {activeTab === 'Ongoing' && <OnGoingTable  />}
                {activeTab === 'Complete' && <Completed />}
            </div>
        </main>
    );
}

export default DashboardPage;
