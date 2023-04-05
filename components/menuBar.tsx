import React, { useRef, useState } from 'react'

import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const menuItems = require('../sql/menu.json')

export type MenuProps = {
    linkMenu: string;
    urlMenu: string;
    menuItem?: boolean;
}

const MenuBar:React.FC<MenuProps> = ({linkMenu, urlMenu, menuItem=true}) => {

    const handleOpen = (e: any) => {
        document.getElementById(`sub-${e.target.id}`)!.hidden = !document.getElementById(`sub-${e.target.id}`)!.hidden;
    }

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

    const start = <Link href={'/'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-14 lg:h-20">
        </img>
        {menuItem ? null : <p className='text-[#373A85] text-lg font-bold -mb-1'>Ads</p>}
    </Link>
    const end = <>
        <Link href={urlMenu} className='mr-5 font-bold cursor-pointer tracking-tighter hover:underline' >{linkMenu}</Link>
        {menuItem ? <Toast ref={toast}></Toast> : null}
        {menuItem ? <Menu
            model={itemsMenu}
            popup
            ref={menu} /> : null}
        {menuItem ? <a className='pi pi-ellipsis-h font-bold cursor-pointer bg-gray-200 p-2 rounded-full' onClick={(e) => menu.current.toggle(e)}></a> : null}
        </>;

    return (
        <div className="fixed w-full z-10">
            <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%]" style={{'borderRadius': 0}} />
            {menuItem ? <div className=' w-full bg-gray-200 shadow-sm lg:pl-[9%]'>
                <ul className='flex flex-row justify-between md:justify-start md:px-0 py-3 text-xs md:text-base text-gray-600 font-medium'>
                {menuItems.map((menu: any, i: number) => (
                    <div key={i} className='flex flex-col'>
                        <li className={i == (menuItems.length - 1) ? 'px-3 md:px-5 hover:text-black' : 'px-3 md:px-5 border-r-2 border-gray-500 hover:text-black'}><Link id={`${i}`} href={`/${menu.label}`} onMouseOver={handleOpen} onMouseLeave={handleOpen}>{menu.label}</Link></li>

                        <ul id={`sub-${i}`} hidden={true} className='absolute top-[132px] z-20 bg-white font-normal border-t-4 border-b-8 border-[#00CBA4]'>
                            {menu.items.map((item: any, i: number) => (
                                <li key={i} className='w-full py-3 px-5 hover:bg-gray-100'>{item.label}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                </ul>
            </div> : null}
        </div>
    )
};

export default MenuBar;