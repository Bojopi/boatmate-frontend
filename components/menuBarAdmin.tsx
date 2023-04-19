

import React, {useRef} from 'react'
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Rating } from "primereact/rating";

export type MenuProps = {
    user: any;
    index: number;
    setIndex: any;
}

const MenuBarAdmin: React.FC<MenuProps> = ({user, index, setIndex}) => {

    const menu = useRef<any>(null);
    const items: any[] = [
        {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            url: '/pro/create-account'
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
        <div className='flex flex-row gap-3 items-center'>
            <i className='pi pi-bell text-2xl'></i>
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" shape="circle" />
            <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
            <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA]' onClick={(e) => menu.current.toggle(e)} />
        </div>
        <Link href={''} className='text-[#109EDA] text-sm font-semibold' >View as a customer</Link>
    </div>

    const activeIndex = (e: any) => {
        for (let i = 0; i < document.getElementsByClassName('item-list').length; i++) {
            document.getElementsByClassName('item-list').item(i)?.classList.remove('active-item-list')
        }
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
                    <i className='pi pi-user text-2xl'></i>
                    <p className='text-sm'>Profile</p>
                </div>
                <div id='1' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-inbox text-2xl'></i>
                    <p className='text-sm'>Leads</p>
                </div>
                <div id='2' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-star text-2xl'></i>
                    <p className='text-sm'>Reviews</p>
                </div>
                <div id='3' className='flex flex-col items-center text-gray-500 hover:text-gray-800 cursor-pointer item-list' onClick={activeIndex}>
                    <i className='pi pi-building text-2xl'></i>
                    <p className='text-sm'>My Business</p>
                </div>
            </div>
            <div className='flex flex-col items-start gap-1 text-xs'>
                <p className='font-medium'>DrywallersTPA</p>
                <div className='flex flex-row gap-2 justify-start'>
                    <Rating value={3} readOnly cancel={false} onIconProps={{style: {color: 'rgb(107, 114, 128)', fontSize: '12px'}}} offIconProps={{style: {fontSize: '12px'}}} />
                    <p>N/A</p>
                </div>
                <p className='font-medium'>Tampa, Florida, 33615</p>
            </div>
        </div>
    </div>
  )
}

export default MenuBarAdmin