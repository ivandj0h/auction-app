import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useSession } from "next-auth/react";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const ItemInputComponent: React.FC = () => {
    const [itemName, setItemName] = useState<string>('');
    const [startPrice, setStartPrice] = useState<string>('');
    const [timeWindow, setTimeWindow] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!itemName) {
            toast.error("Error: Item name is empty");
            return;
        }

        if (!startPrice || Number(startPrice) <= 0) {
            toast.error("Error: Start price is invalid");
            return;
        }

        if (!timeWindow) {
            toast.error("Error: Time window is empty");
            return;
        }

        if (!session) {
            toast.error("Error: Session is null");
            return;
        }

        setIsLoading(true);
        try {
            // Temporarily commented out the API call
            const response = await axios.post("/api/items", {
                itemName,
                startPrice: Number(startPrice),
                timeWindow,
                userId: session.user.id,
            });

            // Simulating the API call with console.log
            console.log({
                itemName,
                startPrice: Number(startPrice),
                timeWindow,
                userId: session.user.id,
            });

            // Assuming status 200 for successful submission
            toast.success("Item added successfully");
            router.push("/item");

        } catch (error) {
            toast.error("Error. Please check your input and try again.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="max-w-full w-[800px] space-y-6 p-4 rounded-lg">
            <div className="w-full max-w-full">
                <div className="flex flex-col justify-center bg-white rounded-lg p-4 gap-[24px]">
                    <h3 className="text-lg font-bold text-left">Add New Item</h3>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder={"Item Name"}
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="h-12 w-full my-2 rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder={"Start Price"}
                            value={startPrice}
                            onChange={(e) => setStartPrice(e.target.value)}
                            className="h-12 w-full my-2 rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder={"Time Window"}
                            value={timeWindow}
                            onChange={(e) => setTimeWindow(e.target.value)}
                            className="h-12 w-full my-2 rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex space-x-4 mt-10 justify-end">
                            <button className="h-12 w-48 rounded font-medium text-sm bg-blue-500 text-white"
                                    type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer position="top-center" autoClose={2000} />
            </div>
        </div>
    );
};

export default ItemInputComponent;
