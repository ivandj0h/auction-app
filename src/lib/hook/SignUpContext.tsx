"use client"

import React, { createContext, useState, Dispatch, SetStateAction } from "react";

interface SignUpContextType {
    showSignUp: boolean;
    setShowSignUp: Dispatch<SetStateAction<boolean>>;
}

interface SignUpProviderProps {
    children: React.ReactNode;
}

export const SignUpContext = createContext<SignUpContextType>({
    showSignUp: false,
    setShowSignUp: () => {},
});

export const SignUpProvider: React.FC<SignUpProviderProps> = ({ children }) => {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <SignUpContext.Provider value={{ showSignUp, setShowSignUp }}>
            {children}
        </SignUpContext.Provider>
    );
};
