import React, { useEffect, useState } from 'react'
import Layout from '../components/layout';
import MenuBarSupAdmin from '@/components/menuBarSupAdmin';
import Spinner from '@/components/spinner';
import { Auth } from '@/hooks/auth'
import { Profile } from '@/interfaces/profile.interface';
import { googleLogout } from '@react-oauth/google'
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import Link from 'next/link';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ProgressBar } from 'primereact/progressbar';
import FooterComponentAdmin from '@/components/footerAdmin';
import SideBarComponent from '@/components/sideBar';
import UsersIndex from './users';
import RolesIndex from './roles';
import ProvidersIndex from './providers';
import ServicesIndex from './services';
import CategoriesIndex from './categories';
import ServiceHistoryIndex from './service-history';
import BoatsIndex from './boats';

const Welcome = () => {
    const {getUserAuthenticated, logout} = Auth();

    const [loading, setLoading] = useState<boolean>(false);
    const [personalActive, setPersonalActive] = useState<boolean>(true);
    const [detailActive, setDetailActive] = useState<boolean>(true);

    const [sideItem, setSideItem] = useState<any>(0);

    const [index, setIndex] = useState<number>(0);
    const [user, setUser] = useState<Profile>(
        {
            uid:        0,
            email:      '',
            state:      false,
            name:       '',
            lastname:   '',
            phone:      '',
            image:      '',
            role:       '',
            iat:        0,
            exp:        0,
        }
    )

    useEffect(() => {
        getUserAuthenticated(setUser)
    }, []);

    const logoutSession = async () => {
        googleLogout()
        logout(setLoading)
    };

    const activeEdit = () => {};

    const activeSideItem = (e: any) => {
        for (let i = 0; i < document.getElementsByClassName('side-item').length; i++) {
            document.getElementsByClassName('side-item').item(i)?.classList.remove('active-side-item')
        }

        setSideItem(e.target.id)
        document.getElementById(e.target.id)?.classList.add('active-side-item')
    };

    const activeSetSideItem = () => {
        for (let i = 0; i < document.getElementsByClassName('side-item').length; i++) {
            document.getElementsByClassName('side-item').item(i)?.classList.remove('active-side-item')
        }

        setSideItem(0);
        document.getElementsByClassName('side-item').item(0)?.classList.add('active-side-item')
    };


  return (
    <Layout>
        <Spinner loading={loading} />
        <MenuBarSupAdmin user={user} setIndex={setIndex} logout={logoutSession} setLoading={setLoading} activeSetSideItem={activeSetSideItem} />
        <div className='w-full h-screen flex flex-row items-start justify-between gap-5 px-5 pb-5 pt-36 lg:pt-44 bg-neutral-100'>
            <SideBarComponent>
                {
                    index === 0 ?
                        <ul>
                            <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 || sideItem === 'profiles' ? 'active-side-item' : null}`} onClick={activeSideItem} id='profiles'>Profile</li>
                        </ul>
                    : index === 1 ?
                        <ul>
                            <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 || sideItem === 'users' ? 'active-side-item' : null}`} onClick={activeSideItem} id='users'>Users</li>
                            <li className='w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item' onClick={activeSideItem} id='roles'>Roles</li>
                        </ul>
                    : index === 2 ?
                        <ul>
                            <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 || sideItem === 'providers' ? 'active-side-item' : null}`} onClick={activeSideItem} id='providers'>Providers</li>
                            <li className='w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item' onClick={activeSideItem} id='services'>Services</li>
                            <li className='w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item' onClick={activeSideItem} id='categories'>Categories</li>
                            <li className='w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item' onClick={activeSideItem} id='service_history'>Service History</li>
                        </ul>
                    : index === 3 ?
                        <ul>
                            <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 || sideItem === 'boats' ? 'active-side-item' : null}`} onClick={activeSideItem} id='boats'>Boats</li>
                        </ul>
                    : null
                }
            </SideBarComponent>
            <div className=' w-full h-full bg-white rounded-md shadow-md border overflow-y-auto'>
            {
                index === 0 ?
                    <>
                        {
                        sideItem === 0 || sideItem === 'profiles' ?
                        <div>
                            <div className='border-b-2 p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <div className='flex flex-row gap-5'>
                                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" size='large' shape="circle" />
                                        <div className=''>
                                            <p>DrywallersTPA</p>
                                            <div className='flex flex-row gap-2 justify-start'>
                                                <Rating value={3} readOnly cancel={false} onIconProps={{style: {color: '#109EDA', fontSize:'12px'}}} offIconProps={{style: {fontSize:'12px'}}} />
                                                <Link href={''} className='text-[#109EDA] text-sm' >Ask for Reviews</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <p id='personal' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                                </div>
                                <div className='w-full flex flex-col mt-5'>
                                    <div className='py-2 border-b-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-phone'></i>
                                            <p>Phone</p>
                                        </div>
                                        <InputMask id='phone' name='phone' mask='(999) 999-9999' placeholder="(999) 999-9999" className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={personalActive} />
                                    </div>
                                    <div className='py-2 border-b-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-map-marker'></i>
                                            <p>Address</p>
                                        </div>
                                        <InputText id='address' name='address' className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={personalActive} />
                                    </div>
                                    <div className='py-2 border-b-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-bookmark'></i>
                                            <p>Year founded</p>
                                        </div>
                                        {
                                            personalActive ?
                                            <InputText className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={true} />
                                            : <Calendar id='year' name='year' className={`w-full read-only:border-none read-only:focus:shadow-none`} view="year" dateFormat="yy" />

                                        }
                                    </div>
                                    <div className='py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-users'></i>
                                            <p>Number of employees</p>
                                        </div>
                                        <InputNumber id='employees' name='employees' className={`w-full`} readOnly={personalActive} inputClassName='read-only:border-none read-only:focus:shadow-none' useGrouping={false} />
                                    </div>
                                </div>
                                {
                                    !personalActive && (
                                        <div className='flex flex-row items-center justify-end gap-3 mt-3'>
                                            <button className='px-5 py-1 bg-white border-2 border-[#373A85] text-center text-sm text-[#373A85] font-bold rounded-md' onClick={(e: any) => { setPersonalActive(true) }}>Cancel</button>
                                            <button className='px-5 py-1 bg-[#373A85] border-2 border-[#373A85] text-center text-sm text-white font-bold rounded-md'>Save</button>
                                        </div>
                                    )
                                }
                            </div>

                            <div className='border-b-2 p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <p className='font-bold'>Your introduction</p>
                                    <p id='detail' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                                </div>
                                <div className='w-full flex flex-col mt-5'>
                                    <div className='py-2'>
                                        <InputTextarea id='detail' name='detail' className={`w-full overflow-auto read-only:border-none read-only:focus:shadow-none`} readOnly={detailActive} autoResize  rows={2} />
                                    </div>
                                </div>
                                {
                                    !detailActive && (
                                        <div className='flex flex-row items-center justify-end gap-3 mt-3'>
                                            <button className='px-5 py-1 bg-white border-2 border-[#373A85] text-center text-sm text-[#373A85] font-bold rounded-md' onClick={(e: any) => { setDetailActive(true) }}>Cancel</button>
                                            <button className='px-5 py-1 bg-[#373A85] border-2 border-[#373A85] text-center text-sm text-white font-bold rounded-md'>Save</button>
                                        </div>
                                    )
                                }
                            </div>

                            <div className='border-b-2 p-5 mb-5'>
                                <p className='font-bold'>Credentials</p>
                                <div className='w-full flex flex-col mt-5'>
                                    <div className='py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user-plus'></i>
                                            <p>Background Check</p>
                                        </div>
                                        <div className='border-2 border-dashed rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                            <p className='text-sm text-gray-600' >Add a background check badge to your profile by authorizing a free background check. This will help you build customer trust and get hired more.</p>
                                            <Link href={''} className='bg-white border-2 rounded-md text-[#109EDA] font-bold text-center px-5 py-2 hover:bg-gray-50' >Start</Link>
                                        </div>
                                    </div>
                                    <div className='py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-shield'></i>
                                            <p>Professional Licenses</p>
                                        </div>
                                        <div className='border-2 border-dashed rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                            <p className='text-sm text-gray-600' >Customers prefer to hire professionals who are licensed in their profession.</p>
                                            <Link href={''} className='bg-white border-2 rounded-md text-[#109EDA] font-bold text-center px-5 py-2 hover:bg-gray-50' >Add</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='border-b-2 p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <p className='font-bold'>Payment methods accepted</p>
                                    <p className='text-[#109EDA] font-bold cursor-pointer'>Edit</p>
                                </div>
                                <div className='w-full flex flex-col'>
                                    <div className='py-2'>
                                        <div className='border-2 rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                            <div>
                                                <p className='text-sm text-[#00CBA4] font-bold' >Get paid through BoatMate.</p>
                                                <p className='text-xs text-gray-600' >Request and recieve payments from customers in the app. <Link href={''} className='text-[#109EDA] font-semibold' >Learn more</Link></p>

                                            </div>
                                            <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3]' >Set up direct deposit</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='border-b-2 p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <p className='font-bold'>Photos</p>
                                    <p className='text-[#109EDA] font-bold cursor-pointer'>Edit</p>
                                </div>
                                <div className='flex flex-row overflow-hidden gap-3 mt-5'>
                                    <div className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-100 flex items-center justify-center shrink-0'>
                                        <Link href={''} className='pi pi-plus-circle text-[#109EDA] text-xl font-medium'></Link>
                                    </div>
                                    {Array.from({length: 7}).map((item: any, i: number) => {
                                        return (
                                            <div key={i} className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-50 flex items-center justify-center shrink-0'>
                                                <FontAwesomeIcon icon={faMountainSun} className='text-gray-300 w-[40px]' />
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className='border-2 rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                    <div>
                                        <p className='text-sm text-gray-60 font-bold'>Show off your business</p>
                                        <p className='text-xs text-gray-600' >Include photos of your work (before and after), team, workspace, or equipment.</p>

                                    </div>
                                    <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3]' >Add photos</Link>
                                </div>
                            </div>

                            <div className='border-b-2 p-5 mb-5'>
                                <p className='font-bold'>Social Media</p>
                                <div className='w-full grid grid-cols-3 gap-5 mt-5'>
                                    <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                        <FontAwesomeIcon icon={faFacebookF} className='w-[10px]' />
                                        <p className='text-sm font-medium'>Add Facebook</p>
                                    </Link>
                                    <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                        <FontAwesomeIcon icon={faInstagram} className='w-[15px]'  />
                                        <p className='text-sm font-medium'>Add Instagram</p>
                                    </Link>
                                    <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                        <FontAwesomeIcon icon={faTwitter} className='w-[15px]' />
                                        <p className='text-sm font-medium'>Add Twitter</p>
                                    </Link>
                                </div>
                            </div>

                            <div className='p-5 mb-5'>
                                <p className='font-bold'>Reviews</p>
                                <div className='w-full flex flex-row items-center justify-center gap-20 mt-5'>
                                    <div>
                                        <p className='text-[#00CBA4] font-bold'>0.0</p>
                                        <Rating value={0} cancel={false} readOnly offIcon={'pi pi-star-fill'} offIconProps={{style: {color: 'rgb(209, 213, 219)'}}} />
                                        <p className='text-xs'>0 reviews</p>
                                    </div>
                                    <div className='w-1/3 flex flex-col items-start'>
                                        <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                            <p className='col-span-1'>5<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                            <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                            <p className='col-span-1'>0%</p>
                                        </div>
                                        <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                            <p className='col-span-1'>4<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                            <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                            <p className='col-span-1'>0%</p>
                                        </div>
                                        <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                            <p className='col-span-1'>3<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                            <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                            <p className='col-span-1'>0%</p>
                                        </div>
                                        <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                            <p className='col-span-1'>2<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                            <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                            <p className='col-span-1'>0%</p>
                                        </div>
                                        <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                            <p className='col-span-1'>1<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                            <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                            <p className='col-span-1'>0%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-2 rounded-md mt-5 p-3 flex flex-row justify-between items-center gap-5'>
                                    <img src="https://i.postimg.cc/SxJz8VPb/chat.png" alt="reviews" height={70} width={70} />
                                    <div>
                                        <p className='text-sm text-gray-60 font-bold'>Get reviews from past customers, even if they&apos;re not on BoatMate.</p>
                                        <p className='text-xs text-gray-600' >Tell us which customers to ask for a review, and we&apos;ll send the request for you.</p>

                                    </div>
                                    <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3] shrink-0' >Ask for reviews</Link>
                                </div>
                            </div>
                        </div>
                        : null
                        }
                    </>
                : index === 1 ?
                    <div>
                        {
                            sideItem === 0 || sideItem === 'users' ?
                            <UsersIndex />
                            : sideItem === 'roles' ?
                            <RolesIndex />
                            : null
                        }
                    </div>
                : index === 2 ?
                    <div>
                        {
                            sideItem === 0 || sideItem === 'providers' ?
                            <ProvidersIndex />
                            : sideItem === 'services' ?
                            <ServicesIndex />
                            : sideItem === 'categories' ?
                            <CategoriesIndex />
                            : sideItem === 'service_history' ?
                            <ServiceHistoryIndex />
                            : null
                        }
                    </div>
                : index === 3 ?
                    <div>
                        {
                            sideItem === 0 || sideItem === 'boats' ?
                            <BoatsIndex />
                            : null
                        }
                    </div>
                : null
            }
            </div>
        </div>
        <FooterComponentAdmin />
    </Layout>
  )
}

export default Welcome