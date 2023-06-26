import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useNavigationEvent(session: any, setBalance: any) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const id = session?.user?.id?.toString();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // Perform the API call to fetch the balance data
                const response = await fetch(`/api/balance`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: session?.user?.id }),
                });

                const data = await response.json();

                // Update the balance state in your AppBar component
                setBalance(data?.amount || 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBalance(); // Call the fetchBalance function when the URL changes or session changes

        // Clean up the effect
        return () => {
            // Perform any necessary cleanup here
        };
    }, [pathname, searchParams, session]); // Add session as a dependency
}
