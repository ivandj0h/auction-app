import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {toast, ToastContainer} from 'react-toastify';
import axios from "axios";
import { useSession } from "next-auth/react";
import 'react-toastify/dist/ReactToastify.css';

const DepositInputComponent: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!amount) {
            toast.error("Error deposit: amount is empty");
            return;
        }

        if (Number(amount) <= 0) {
            toast.error("Error deposit: amount is less than 0");
            return;
        }

        if (!session) {
            toast.error("Error deposit: session is null");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("/api/deposit", {
                amount: Number(amount),
                balanceId: session.user.id,
            });

            if (response.status === 200) {
                toast.success("Deposit successfully");
                router.push("/dashboard");
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            toast.error("Error deposit. Please check your credentials and try again.");
            console.error("Error deposit:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    return (
        <div className="max-w-full w-[800px] space-y-6 border-2 border-gray-200 p-6 rounded-lg">
            <div className="w-full max-w-full">
                <div className="flex flex-col justify-center bg-white rounded-lg p-8 gap-[24px]">
                    <h3 className="text-lg font-bold text-left">Deposit</h3>
                    <form onSubmit={onSubmit}>
                        <input
                            type="number"
                            placeholder={"Input Amount"}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-12 w-full rounded border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex space-x-4 mt-10 justify-end">
                            <button className="py-2 px-4 text-sm text-blue-500 font-medium" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="h-12 w-48 rounded font-medium text-sm bg-blue-500 text-white"
                                    type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Deposit"}
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer position="top-center" autoClose={2000} />
            </div>
        </div>
    );
};

export default DepositInputComponent;
