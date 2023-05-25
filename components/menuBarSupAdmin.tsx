import React, { useState, useRef, useContext, useEffect } from 'react'
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
import { MenuContext } from '@/context/MenuContext';

export type MenuProps = {
    user: Profile;
    logout: any;
    setLoading: any;
}

const MenuBarSupAdmin: React.FC<MenuProps> = ({
    user,
    logout,
    setLoading
}) => {
    const {activeOption, setActiveOption} = useContext(MenuContext);

    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [rating, setRating] = useState<number>(0);
    const [address, setAddress] = useState<string>('');

    const menu = useRef<any>(null);
    const items: any[] = [
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
        }
    ]

    useEffect(() => {
        if(user.role === 'PROVIDER') {
            calcRating();
            getAddressMap();
        }
    }, [user])

    const start = <Link href={'/admin'} className='flex flex-row items-end'>
        <img
        alt="logo"
        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
        className="mr-2 h-10 lg:h-20">
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

    const calcRating = async () => {
        const response = await getRatingProvider(Number(user.idProvider));
        if(response.status == 200) {
            const avg = avgRating(response.data.rating);
            setRating(Number(avg))
        }
    };

    const getAddressMap = async () => {
        const response = await getAddress(Number(user.providerLat), Number(user.providerLng));
        if(response.status == 200) {
            setAddress(response.data.results[0].formatted_address);
        }
    }

    const handleOptionClick = (option: string) => {
        setActiveOption(option);
    }

  return (
    <div className="fixed w-full z-10">
        <Menubar start={start} end={end} className="bg-white shadow-md z-10 lg:px-[10%] rounded-none" />
        <div className='bg-gray-200 shadow-sm lg:px-[10%] py-2'>
            {
                user.role == 'ADMIN' || user.role == 'SUPERADMIN' ?
                <div className='flex flex-row gap-10 items-center'>
                    <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'welcome' || activeOption == '/welcome' ? 'active-item-list' : null}`}>
                        <Link href="/welcome" legacyBehavior>
                            <a className='flex flex-col items-center' onClick={() => handleOptionClick('welcome')}>
                                <i className='pi pi-cog text-xl'></i>
                                <p className='text-sm'>Settings</p>
                            </a>
                        </Link>
                    </div>
                    <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'users' || activeOption == '/welcome/users' ? 'active-item-list' : null}`} >
                        <Link href="/welcome/users" legacyBehavior>
                            <a className='flex flex-col items-center' onClick={() => handleOptionClick('users')}>
                                <i className='pi pi-users text-xl'></i>
                                <p className='text-sm'>Users</p>
                            </a>
                        </Link>
                    </div>
                    <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'providers' || activeOption == '/welcome/providers' ? 'active-item-list' : null}`} >
                        <Link href="/welcome/providers" legacyBehavior>
                            <a className='flex flex-col items-center' onClick={() => handleOptionClick('providers')}>
                                <i className='pi pi-th-large text-xl'></i>
                                <p className='text-sm'>Providers & Services</p>
                            </a>
                        </Link>
                    </div>
                    <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'customers' || activeOption == '/welcome/customers' ? 'active-item-list' : null}`} >
                        <Link href="/welcome/customers" legacyBehavior>
                            <a className='flex flex-col items-center' onClick={() => handleOptionClick('customers')}>
                                <i className='pi pi-star text-xl'></i>
                                <p className='text-sm'>Customers</p>
                            </a>
                        </Link>
                    </div>
                </div>

                : user.role == 'PROVIDER' ?
                <div className='flex justify-between items-center'>
                    <div className='flex flex-row gap-10 items-center'>
                        <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'welcome' || activeOption === '/welcome' ? 'active-item-list' : null}`}>
                            <Link href="/welcome" legacyBehavior>
                                <a className='flex flex-col items-center' onClick={() => handleOptionClick('welcome')}>
                                    <i className='pi pi-user text-xl'></i>
                                    <p className='text-sm'>Profile</p>
                                </a>
                            </Link>
                        </div>
                        <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'leads' || activeOption === '/welcome/leads' ? 'active-item-list' : null}`}>
                            <Link href="/welcome/leads" legacyBehavior>
                                <a className='flex flex-col items-center' onClick={() => handleOptionClick('leads')}>
                                    <i className='pi pi-inbox text-xl'></i>
                                    <p className='text-sm'>Leads</p>
                                </a>
                            </Link>
                        </div>
                        <div className={`text-gray-500 hover:text-gray-800 cursor-pointer item-list ${activeOption == 'reviews' || activeOption === '/welcome/ratings/[idProvider]' ? 'active-item-list' : null}`}>
                            <Link href={`/welcome/ratings/${user.idProvider}`} legacyBehavior>
                                <a className='flex flex-col items-center' onClick={() => handleOptionClick('reviews')}>
                                    <i className='pi pi-star text-xl'></i>
                                    <p className='text-sm'>Reviews</p>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <p className='text-xs'>{user.providerName}</p>
                        <div className='flex flex-row gap-2 justify-start'>
                            <Rating value={rating} readOnly cancel={false} onIconProps={{style: {color: 'rgb(107, 114, 128)'}}} />
                            <p className='text-sm'>{rating == 0 ? 'N/A' : rating}</p>
                        </div>
                        <p className='text-xs font-medium'>{address}</p>
                    </div>
                </div>
                : null
            }
        </div>
    </div>
  )
}

export default MenuBarSupAdmin