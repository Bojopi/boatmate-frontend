import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Profile } from '@/interfaces/interfaces';
import { Rating } from 'primereact/rating';
import { Ratings } from '@/hooks/rating';
import { avgRating } from '@/functions/rating';
import { Maps } from '@/hooks/maps';
import { useRouter } from 'next/router';

export type MenuProps = {
    user: Profile;
    logout: any;
    setLoading: any;
    activeOption: any;
    setActiveOption: any;
    setActiveSideOption: any;
    menuList: any;
}

const MenuBarSupAdmin: React.FC<MenuProps> = ({
    user,
    logout,
    setLoading,
    activeOption,
    setActiveOption,
    menuList
}) => {

    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [rating, setRating] = useState<number>(0);
    const [address, setAddress] = useState<string>('');

    const [menus, setMenus] = useState<any>([]);

    const router = useRouter();

    const menu = useRef<any>(null);
    const menuPhone = useRef<any>(null);
    const items: any[] = [
        {
            template: (item: any, options: any) => {
                return (
                    <button onClick={() => {
                        setLoading(true);
                        logout(setLoading);
                        setActiveOption(0);
                    }} className='w-full px-3 py-1 flex flex-row items-center gap-3 hover:bg-gray-100'>
                        <i className='pi pi-sign-out'></i>
                        <p>Sign out</p>
                    </button>
                )
            }
        }
    ];

    const fillItems = () => {
        let items: any[] = [
            { 
                template: (item: any, options: any) => {
                    return (
                        <button onClick={() => {
                            setLoading(true);
                            logout(setLoading);
                            setActiveOption(0);
                        }} className='w-full px-3 py-1 flex flex-row items-center gap-3 hover:bg-gray-100'>
                            <i className='pi pi-sign-out'></i>
                            <p>Sign out</p>
                        </button>
                    )
                }
            },
            { separator: true},
            ...menuList.map((item: any) => {
                item.items.map((child: any) => {
                    if(child.label == 'Ratings') {
                        child.url = child.url.replace('[idProvider]', String(user.idProvider))
                    } 
                    return child
                })
                const { url, icon, ...rest} = item;
                return rest;
            })
        ]

        setMenus(items);
    }

    useEffect(() => {
        validateRoute();
        fillItems();
        if(user.role === "PROVIDER") {
            calcRating();
            getAddressMap();
        }
    }, [user])

    const start = <Link href={'/welcome'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-10 lg:h-20">
        </img>
        <p className='text-[#373A85] text-xs md:text-lg font-bold mb-0 md:-mb-1'>Ads</p>
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
            <TieredMenu model={items} popup ref={menu} className='mt-1 hidden md:block' />
            <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0 hidden md:block' onClick={(e) => menu.current.toggle(e)} />
            <TieredMenu model={menus} popup ref={menuPhone} className='mt-1 block md:hidden' breakpoint="767px" />
            <Button rounded text icon="pi pi-angle-down" className='text-[#109EDA] shrink-0 block md:hidden' onClick={(e) => menuPhone.current.toggle(e)} />
        </div>
        <p className='text-[#109EDA] text-sm font-semibold cursor-default w-full text-right' >{user.name} {user.lastname}</p>
    </div>

    const calcRating = async () => {
        const response = await getRatingProvider(Number(user.idProvider));
        if(response.status == 200 && response.data.rating.length > 0) {
            const avg = avgRating(response.data.rating);
            setRating(Number(avg))
        }
    };

    const getAddressMap = async () => {
        const response = await getAddress(Number(user.providerLat), Number(user.providerLng));
        if(response.status == 200 && response.data.results.length > 0) {
            setAddress(response.data.results[0].formatted_address);
        }
    }

    const validateRoute = () => {
        menuList.map((item: any, i: number) => {
            item.items.map((child: any) => {
                if(router.pathname == child.url) {
                    setActiveOption(i);
                }
                else {
                    if(child.items != null) {
                        child.items.map((items: any) => {
                            if(router.pathname == items.url) {
                                setActiveOption(i);
                            } else {
                                if(router.pathname.split('[').length > 1) {
                                    if(items.url.includes(router.pathname.split('[')[0])) {
                                        setActiveOption(i);
                                    }
                                }
                            }
                        })
                    }
                }
            })
        })
    }

  return (
    <div className="fixed w-full z-10">
        <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%] rounded-none" />
        <div className='bg-gray-200 shadow-sm md:px-[10%] md:py-2'>
            <div className={`${user.role == 'PROVIDER' ? 'flex justify-between items-center' : ''}`}>
                <div className='md:flex flex-row gap-10 items-center hidden'>
                    {
                        menuList.map((item: any, i: number) => {
                            return (
                                <div key={i} className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == i ? 'active-item-list' : null}`} onClick={(e: any) => setActiveOption(i)} >
                                    <Link href={item.label == 'Reviews' ? item.url.replace('[idProvider]', String(user.idProvider)) : item.url} legacyBehavior>
                                        <a className='flex flex-col items-center' >
                                            <i className={item.icon}></i>
                                            <p className='text-sm'>{item.label}</p>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })
                    }

                </div>
                <div className={`${user.role == 'PROVIDER' ? 'block pl-5' : 'hidden'}`}>
                    <p className='text-xs'>{user.providerName}</p>
                    {/* <div className='flex flex-row gap-2 justify-start'>
                        <Rating value={rating} readOnly cancel={false} onIconProps={{style: {color: 'rgb(107, 114, 128)'}}} />
                        <p className='text-sm'>{rating == 0 ? 'N/A' : rating}</p>
                    </div> */}
                    <p className='text-xs font-medium'>{address}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MenuBarSupAdmin