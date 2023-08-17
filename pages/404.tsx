import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ErrorPage = () => {
    const router = useRouter();

    useEffect(() => {
        const currentPath = router.asPath;

        if (currentPath === '/welcome') {
            router.push('/welcome/profile');
        } 
    }, []);

    return null;
};

export default ErrorPage;