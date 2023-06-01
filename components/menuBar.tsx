import React, { useRef, useState, useEffect } from 'react'

import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';

import menuItems from '../sql/menu.json'

export type MenuProps = {
    linkMenu: string;
    urlMenu: string;
    menuItem?: boolean;
}

const MenuBar:React.FC<MenuProps> = ({linkMenu, urlMenu, menuItem=true}) => {

    const menu = useRef<any>(null);

    const [menus, setMenus] = useState<any>([]);

    useEffect(() => {
        fillItems();
    }, []);

    const fillItems = () => {
        let items = [
            { 
                label: 'Sign Up Now',
                url: '/register'
            },
            { 
                label: 'Sign In',
                url: '/login'
            },
            { separator: true},
            ...menuItems,
            { separator: true},
            { 
                label: 'Join Our Pro Network',
                url: '/pro'
            }
        ]

        setMenus(items);
    }

    const handleOpen = (e: any) => {
        for(let i = 0; i < document.getElementsByTagName('ul').length; i++) {
            if(document.getElementsByTagName('ul').item(i)?.className.includes('item-menu')) {
                document.getElementsByTagName('ul').item(i)?.setAttribute('hidden', 'true');
            }
        }
        document.getElementById(`sub-${e.target.id}`)!.hidden = false;
    }

    const handleClose = () => {
        document.addEventListener('mouseover', (event: any) => {
            if(event.target.nodeName !== 'LI' && event.target.nodeName !== 'UL' && event.target.nodeName !== 'A') {
                for(let i = 0; i < document.getElementsByTagName('ul').length; i++) {
                    if(document.getElementsByTagName('ul').item(i)?.className.includes('item-menu')) {
                        document.getElementsByTagName('ul').item(i)?.setAttribute('hidden', 'true');
                    }
                }
            }
        })
    }

    const start = <Link href={menuItem ? '/' : '/pro'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-10 lg:h-20">
        </img>
        {menuItem ? null : <p className='text-[#373A85] text-xs md:text-lg font-bold -mb-1'>Ads</p>}
    </Link>
    const end = <>
        <div className={menuItem ? 'hidden md:block' : 'block'}>
            <Link href={urlMenu} className='mr-2 md:mr-5 font-bold cursor-pointer tracking-tighter hover:underline text-xs md:text-base' >{linkMenu}</Link>
            {
                menuItem ? 
                <>
                    <Link href={'/register'} className='mr-2 md:mr-5 cursor-pointer tracking-tighter hover:underline text-xs md:text-base'>Sign up now</Link>
                    <Link href={'/login'} className='mr-2 md:mr-5 cursor-pointer tracking-tighter hover:underline text-xs md:text-base'>Sign in</Link>
                </>
                : null
            }
        </div>
        <div className={menuItem ? 'block md:hidden' : 'hidden'}>
            <TieredMenu model={menus} popup ref={menu} breakpoint="767px" />
            <Button label="Sign In" icon="pi pi-user" outlined onClick={(e) => menu.current.toggle(e)} />
        </div>
        </>;

    return (
        <div className="fixed w-full z-10">
            <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%]" style={{'borderRadius': 0}} />
            {menuItem ? <div className=' w-full bg-gray-200 shadow-sm lg:pl-[9%] hidden md:block'>
                <ul className='flex flex-row justify-between md:justify-start md:px-0 py-3 text-xs md:text-base text-gray-600 font-medium'>
                {menuItems.map((menu: any, i: number) => (
                    <div key={i} className='flex flex-col'>
                        <li id={`${i}`} onMouseOver={handleOpen} onMouseOut={handleClose} className={i == (menuItems.length - 1) ? 'px-3 md:px-5 hover:text-black' : 'px-3 md:px-5 border-r-2 border-gray-500 hover:text-black cursor-pointer'}>{menu.label}</li>

                        <ul id={`sub-${i}`} hidden={true} className='absolute md:top-[100px] lg:top-[140px] z-20 bg-white font-normal border-t-4 border-b-8 border-[#00CBA4] item-menu'>
                            {menu.items.map((item: any, i: number) => (
                                <Link key={i} href={`${item.url}`} >
                                    <li className='w-full py-3 px-5 cursor-pointer hover:bg-gray-100'>
                                            {item.label}
                                    </li>
                                </Link>
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