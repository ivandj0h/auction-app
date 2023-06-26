import Home from "@/app/(page)/home/page";
import {SignUpProvider} from "@/lib/hook/SignUpContext";
import {startCronJob} from "@/lib/utils/cron";


function App() {
    // Start the cron job when the application starts
    startCronJob();
    return (
        <SignUpProvider>
            <Home />
        </SignUpProvider>
    );
}

export default App;
