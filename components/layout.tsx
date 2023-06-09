import React from 'react'
import Head from 'next/head'

const Layout = (props: any) => {
    return (
        <>
        <Head>
            <title>BoatMate</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/png" href="/Biggest_BoatMate-removebg-preview.ico" />
        </Head>
         <main className='w-full h-full'>
            {props.children}
         </main>
        </>
     );
}

export default Layout;