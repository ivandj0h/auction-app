"use client";

import React, {useEffect, useState} from "react";
import useRequireAuth from "@/lib/hook/useRequireAuth";
import Spinner from "@/components/utils/Spinner";
import ItemInputComponent from "@/components/item/ItemInputComponent";
import DraftItem from "@/components/tables/DraftItem";
import {AnimatePresence, motion} from "framer-motion";

const ItemPage = () => {
    const {session, isLoading} = useRequireAuth();
    const [showContent, setShowContent] = useState(false);
    const [isInputOpen, setIsInputOpen] = useState(false);

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
        <main className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-screen-lg">
                <button
                    className="mb-2 p-2 h-12 w-48 rounded font-medium text-sm bg-blue-500 hover:bg-blue-600  text-white"
                    onClick={() => setIsInputOpen(!isInputOpen)}
                >
                    Create New Item
                </button>
                <AnimatePresence>
                    {isInputOpen && (
                        <motion.div
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.3}}
                            className="fixed inset-0 flex items-center justify-center z-50"
                        >
                            <div className="bg-white p-4 rounded border border-gray-300 relative">
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                                    onClick={() => setIsInputOpen(false)}
                                >
                                    Close
                                </button>
                                <ItemInputComponent/>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <DraftItem/>
            </div>
        </main>
    )
}

export default ItemPage;
