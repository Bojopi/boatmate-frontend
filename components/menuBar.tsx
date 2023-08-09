import React, { useRef, useState, useEffect } from 'react'

import { Menubar } from 'primereact/menubar';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';

import menuItems from '../sql/menu.json'
import { Profile } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import menuList from '../sql/menu.json';

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
                ...menuItems,
                // { separator: true},
                // { 
                //     template: (item: any, options: any) => {
                //         return (
                //             <button onClick={(e) => options.onClick(e)} className='w-full flex align-items-center'>
                //                 <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" shape="circle" />
                //                 <div className="flex flex-column align">
                //                     <span className="font-bold">Amy Elsner</span>
                //                     <span className="text-sm">Agent</span>
                //                 </div>
                //             </button>
                //         )
                // }}
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

    const start = <Link href={menuItem ? '/' : '/pro'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://i.postimg.cc/jSW0kv3s/Logo-Boat-Mate-horizontal.png"
        className="h-9">
        </img>
        {menuItem ? null : <p className='text-[#373A85] text-xs md:text-lg font-bold -mb-1'>Ads</p>}
    </Link>
    const end = <>
        {
            user ? 
            <div className='flex flex-row gap-7 items-end'>
                <i className='pi pi-inbox p-overlay-badge text-[1.3rem] cursor-pointer' onClick={() => console.log('mensajes')}>
                    <Badge value={2}></Badge>
                </i>
                {
                    user.image != null ?
                        <Avatar image={user.image} shape="circle" onClick={(e) => menuUser.current.toggle(e)} />
                        :
                        <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} onClick={(e) => menuUser.current.toggle(e)} />
                }
                <TieredMenu model={menus} popup ref={menuUser} className='mt-1 hidden md:block' />
                {/* <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0 hidden md:block' onClick={(e) => menuUser.current.toggle(e)} /> */}
                <TieredMenu model={menus} popup ref={menuPhone} className='mt-1 block md:hidden' breakpoint="767px" />
                <Button rounded text icon="pi pi-ellipsis-v" className='text-[#109EDA] shrink-0 block md:hidden' onClick={(e) => menuPhone.current.toggle(e)} />
            </div>
            :
            <>
                <div className={menuItem ? 'hidden md:block' : 'block'}>
                    {/* <Link href={urlMenu} className='mr-2 md:mr-5 font-bold cursor-pointer tracking-tighter hover:underline text-xs md:text-base' >{linkMenu}</Link> */}
                    {
                        menuItem ?
                        <div className='flex items-center gap-3'>
                            <Link href={'/login'} className='cursor-pointer font-semibold leading-none text-xs md:text-sm'>Login</Link>
                            <Button type='button' rounded className='bg-sky-500 border-sky-500 hover:bg-sky-600 hover:border-sky-600'>
                                <Link href={'/register'} className='font-bold leading-none text-xs md:text-sm'>Sign up</Link>
                            </Button>
                        </div>
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

    const scroll = () => {
        const menu = document.getElementById('menubar');
        if(menu) {
            if(document.body.scrollTop >= 70 || document.documentElement.scrollTop >= 70) {
                menu.classList.remove('bg-transparent');
                menu.classList.add('bg-white');
            } else {
                menu.classList.remove('bg-white');
                menu.classList.add('bg-transparent');
            }
        }
    }

    if(typeof window !== 'undefined') {
        window.addEventListener('scroll', scroll);
    }



    return (
        <div className="fixed w-full z-10">
            <Menubar id='menubar' model={menuList} start={start} end={end} className="bg-transparent border-none z-10 lg:px-[15%] py-4 md:py-6 flex items-center justify-between text-sm font-medium" style={{'borderRadius': 0}} />
        </div>
    )
};

export default MenuBar;