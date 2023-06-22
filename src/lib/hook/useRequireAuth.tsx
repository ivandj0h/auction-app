import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const useRequireAuth = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return; // Wait for session data to load

        setIsLoading(false);

        if (!session?.user) {
            router.push('/');
        }
    }, [session, status, router]);

    return { session, isLoading };
};

export default useRequireAuth;
