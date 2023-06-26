import {ReactNode} from "react";

export type BalanceContextType = {
    userBalance: number | null;
    setBalanceAmount: (amount: number) => void;
};

export type BalanceContextProviderProps = {
    children: ReactNode;
};
