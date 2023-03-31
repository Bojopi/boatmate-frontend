import React from 'react'
import MenuBar from './menuBar';

const Layout = (props: any) => {
    return (
        <>
        <MenuBar />
         <main className='pt-28 lg:pt-36'>
            {props.children}
         </main>
        </>
     );
}

export default Layout;