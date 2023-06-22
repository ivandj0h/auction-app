import Home from "@/app/(page)/home/page";
import {SignUpProvider} from "@/lib/hook/SignUpContext";
import AppBar from "@/components/AppBar";



function App() {
    return (
        <SignUpProvider>
            <AppBar />
            <Home />
        </SignUpProvider>
    );
}

export default App;
