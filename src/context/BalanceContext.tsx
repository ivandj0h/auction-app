"use client"


import { createContext, useState, ReactNode, useContext } from 'react';
import {BalanceContextProviderProps, BalanceContextType} from "@/lib/types/balance";

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceContextProvider = ({ children }: BalanceContextProviderProps) => {
    const [userBalance, setBalance] = useState<number | null>(null);

    const setBalanceAmount = (amount: number) => {
        setBalance(amount);
    };

    const contextValue: BalanceContextType = {
        userBalance,
        setBalanceAmount,
    };

    return (
        <BalanceContext.Provider value={contextValue}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalanceContext = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalanceContext must be used within a BalanceContextProvider');
    }
    return context;
};

export default BalanceContext;
