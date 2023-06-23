"use client"

import React, { useEffect, useState } from "react";
import useRequireAuth from "@/lib/hook/useRequireAuth";
import Spinner from "@/components/utils/Spinner";
import OnGoingTable from "@/components/tables/OnGoing";

const DashboardPage = () => {
    const { session, isLoading } = useRequireAuth();
    const [showContent, setShowContent] = useState(false);
    const [activeTab, setActiveTab] = useState('Ongoing');

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
                    <Spinner />
                    <span className="text-slate-500 inline-block">Loading...</span>
                </div>
            </div>
        );
    }

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
                    Complete
                </button>
            </div>
            <div className="overflow-y-auto h-full">
                {activeTab === 'Ongoing' && <OnGoingTable />}
                {activeTab === 'Complete' && (
                    <div className="w-full bg-aliceblue p-4 mt-4 rounded-md shadow-md">
                        <h1>Complete Content</h1>
                        <p>This is a placeholder for your complete content.</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default DashboardPage;
