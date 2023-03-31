import React from 'react'

import { Menubar } from 'primereact/menubar';
import Link from 'next/link';

export default function MenuBarPro() {

    const start = <Link href={'/'}>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-14 lg:h-20">
        </img>
    </Link>
    const end = <>
        <Link href={'/pro'} className='mr-5 font-bold cursor-pointer tracking-tighter hover:underline' >Sign In</Link>
        </>;

    return (
        <div className="fixed w-full z-10">
            <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%]" style={{'borderRadius': 0}} />
        </div>
    )
};