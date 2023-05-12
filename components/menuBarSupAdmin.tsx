

import React, {useRef} from 'react'
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Profile } from '@/interfaces/profile.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export type MenuProps = {
    user: Profile;
    setIndex: any;
    logout: any;
    setLoading: any;
    activeSetSideItem: any;
}

const MenuBarSupAdmin: React.FC<MenuProps> = ({user, setIndex, logout, setLoading, activeSetSideItem}) => {

    const menu = useRef<any>(null);
    const items: any[] = [
        {
            template: (item: any, options: any) => {
                return (
                    <button onClick={() => {
                        setLoading(true)
                        logout(setLoading)
                    }} className='w-full px-3 py-1 flex flex-row items-center gap-3 hover:bg-gray-100'>
                        <i className='pi pi-sign-out'></i>
                        <p>Sign out</p>
                    </button>
                )
            }
        }
    ]

    const start = <Link href={'/admin'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-14 lg:h-20">
        </img>
        <p className='text-[#373A85] text-lg font-bold -mb-1'>Ads</p>
    </Link>

    const end = <div className='flex flex-col items-center'>
        <div className='flex flex-row gap-2 items-center'>
            <i className='pi pi-bell text-2xl'></i>
            {
                user.image != null ?
                    <Avatar image={user.image} shape="circle" />
                    :
                    <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
            }
            <TieredMenu model={items} popup ref={menu} className='mt-1' />
            <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0' onClick={(e) => menu.current.toggle(e)} />
        </div>
        <p className='text-[#109EDA] text-sm font-semibold cursor-default w-full text-right' >{user.name} {user.lastname}</p>
    </div>

    const activeIndex = (e: any) => {
        for (let i = 0; i < document.getElementsByClassName('item-list').length; i++) {
            document.getElementsByClassName('item-list').item(i)?.classList.remove('active-item-list')
        }

        activeSetSideItem()

        if(e.target.nodeName === 'I' || e.target.nodeName === 'P') {
            setIndex(Number(e.target.parentNode.id))
            document.getElementsByClassName('item-list').item(e.target.parentNode.id)?.classList.add('active-item-list')
            
        } else {
            setIndex(Number(e.target.id))
            document.getElementsByClassName('item-list').item(e.target.id)?.classList.add('active-item-list')
        }
    }

  return (
    <div className="fixed w-full z-10">
        <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%] rounded-none" />
        <div className='flex flex-row justify-between items-center bg-gray-200 shadow-sm lg:px-[10%] py-2'>
            <div className='flex flex-row gap-10 items-center'>
                <div id='0' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list active-item-list' onClick={activeIndex}>
                    <i className='pi pi-cog text-xl'></i>
                    <p className='text-sm'>Settings</p>
                </div>
                <div id='1' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-user text-xl'></i>
                    <p className='text-sm'>Users</p>
                </div>
                <div id='2' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-shopping-bag text-xl'></i>
                    <p className='text-sm'>Providers & Services</p>
                </div>
                <div id='3' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-star text-xl'></i>
                    <p className='text-sm'>Customers</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MenuBarSupAdmin