import { useRouter } from 'next/router';
import React from 'react'
import Layout from '../../components/layout';
import LayoutAdmin from '../../components/layoutAdmin';

export type LayoutProps = {
    children: React.ReactNode;
}

const Layouts: React.FC<LayoutProps> = ({children}) => {
    
    const router = useRouter();
    const {pathname} = router;

    switch (pathname) {
        case "/login":
        case "/register":
        case "/forget-pass":
            return <>{children}</>;
        case "/welcome":
            return <LayoutAdmin>{children}</LayoutAdmin>;
        default:
            return <Layout>{children}</Layout>
    }
}

export default Layouts