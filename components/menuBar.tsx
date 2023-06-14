import React, { useRef, useState, useEffect } from 'react'

import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';

import menuItems from '../sql/menu.json'
import { Profile } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export type MenuProps = {
    linkMenu: string;
    urlMenu: string;
    user?: Profile | undefined;
    menuItem?: boolean;
    logout?: any;
    setLoading?: any;
}

const MenuBar:React.FC<MenuProps> = ({linkMenu, urlMenu, user = null, menuItem=true, logout, setLoading}) => {

    const menu = useRef<any>(null);
    const menuUser = useRef<any>(null);
    const menuPhone = useRef<any>(null);

    const [menus, setMenus] = useState<any>([]);

    useEffect(() => {
        fillItems();
    }, [user]);

    const fillItems = () => {
        let items: any = []
        if(user) {
            items = [
                { 
                    template: (item: any, options: any) => {
                        return (
                            <button onClick={() => {
                                setLoading(true);
                                logout(setLoading);
                            }} className='w-full px-3 py-1 flex flex-row items-center gap-3 hover:bg-gray-100'>
                                <i className='pi pi-sign-out'></i>
                                <p>Sign out</p>
                            </button>
                        )
                    }
                },
                {label: 'Profile', url: '/profile'},
                { separator: true},
                ...menuItems
            ]
        } else {
            items = [
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
        }

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
        {
            user ? 
            <div className='flex flex-row gap-2 items-center'>
                <p className='text-[#109EDA] text-sm md:text-base font-semibold'>{user.name} {user.lastname}</p>
                {
                    user.image != null ?
                        <Avatar image={user.image} shape="circle" />
                        :
                        <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                }
                <TieredMenu model={menus} popup ref={menuUser} className='mt-1 hidden md:block' />
                <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0 hidden md:block' onClick={(e) => menuUser.current.toggle(e)} />
                <TieredMenu model={menus} popup ref={menuPhone} className='mt-1 block md:hidden' breakpoint="767px" />
                <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0 block md:hidden' onClick={(e) => menuPhone.current.toggle(e)} />
            </div>
            :
            <>
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
            </>
        }

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