import React, { useRef } from 'react'

import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

export default function MenuBar() {

    const menu = useRef<any>(null);
    const toast = useRef<any>(null);

    const itemsMenu = [
        {
            label: 'Sign up now',
            url: '/register',
        },
        {
            label: 'Sign in',
            url: '/login',
        },
    ];

    const start = <Link href={'/'}>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-14 lg:h-20">
        </img>
    </Link>
    const end = <>
        <Link href={'/pro'} className='mr-5 font-bold cursor-pointer tracking-tighter hover:underline' >Join Our Pro Network</Link>
        <Toast ref={toast}></Toast>
        <Menu
            model={itemsMenu}
            popup
            ref={menu} />
        <a className='pi pi-ellipsis-h font-bold cursor-pointer bg-gray-200 p-2 rounded-full' onClick={(e) => menu.current.toggle(e)}></a>
        </>;

    return (
        <div className="fixed w-full z-10">
            <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%]" style={{'borderRadius': 0}} />
            <div className='w-full bg-gray-200 shadow-sm lg:pl-[9%]'>
                <ul className='flex flex-row justify-between md:justify-start md:px-0 py-3 text-xs md:text-base text-gray-600 font-medium'>
                    <li className='px-3 md:px-5 border-r-2 border-gray-500 hover:text-black'><Link href={'/boats'}>Boats</Link></li>
                    <li className='px-3 md:px-5 border-r-2 border-gray-500 hover:text-black'><Link href={'/jetskis'}>Jetskis</Link></li>
                    <li className='px-3 md:px-5 border-r-2 border-gray-500 hover:text-black'><Link href={'/'}>Dock & Storage</Link></li>
                    <li className='px-3 md:px-5 border-r-2 border-gray-500 hover:text-black'><Link href={'/'}>Insurance</Link></li>
                    <li className='px-3 md:px-5 hover:text-black'><Link href={'/'}>More</Link></li>
                </ul>
            </div>
        </div>
    )
};