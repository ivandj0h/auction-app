import React, { JSX } from "react";
import LoginPage from "@/app/(page)/login/page";
import UserComponent from "@/components/users/UserComponent";

const HomePage: React.FC = (): JSX.Element => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <main className="relative items-center justify-center min-h-screen overflow-hidden">
                <UserComponent  />
            </main>
        </main>
    )
}

export default HomePage;
