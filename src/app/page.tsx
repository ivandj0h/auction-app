import React, {JSX} from "react";
import LoginPage from "@/app/(auth)/login/page";

const HomePage: React.FC = (): JSX.Element => {
    return (
        <main className="relative items-center justify-center min-h-screen overflow-hidden bg-gray-100">
            <LoginPage/>
        </main>
    )
}

export default HomePage;
