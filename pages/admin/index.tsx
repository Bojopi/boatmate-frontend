

import React, { useState } from 'react'
import Layout from '@/components/layout'
import FooterComponentAdmin from '@/components/footerAdmin'
import MenuBarAdmin from '@/components/menuBarAdmin'
import { Avatar } from 'primereact/avatar';
import { Rating } from "primereact/rating";
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { InputMask } from "primereact/inputmask";
import { FormProvider, useForm } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from 'primereact/progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import LayoutAdmin from '@/components/layoutAdmin';
import DirectLeads from './direct-leads';
import Messages from './messages';
import SentQuotes from './sent-quotes';
import Opportunities from './opportunities';

export type DataProps = {
    phone: string;
    address: string;
    year: string;
    employees: number;
    detail: string;
}

const HomePage = () => {
    const [personalActive, setPersonalActive] = useState<boolean>(true);
    const [detailActive, setDetailActive] = useState<boolean>(true);

    const [index, setIndex] = useState<number>(0);
    const [sideItem, setSideItem] = useState<number>(0);

    const [cantPhotos, setCantPhotos] = useState<number>(6);

    const methods = useForm<DataProps>({
        defaultValues: {
            phone: '(813) 766-7565',
            address: 'Tampa, Florida, 33615',
            year: '2020',
            employees: 1,
            detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi amet iste alias beatae placeat, nihil ad impedit ipsum quos porro sit enim minus fugit maiores dolores vitae cumque modi odio?',
        }
    });

    const {
        reset,
        handleSubmit,
        setError,
        formState: {errors},
    } = methods;

    const onSubmit = () => {};

    const onErrors = () => {};

    const activeEdit = (e: any) => {
        console.log(e)
        if (e.target.id === 'personal') {
            setPersonalActive(false)
        }
        else if (e.target.id === 'detail') {
            setDetailActive(false)
        }
    };

    const activeSideItem = (e: any) => {
        for (let i = 0; i < document.getElementsByClassName('side-item-list').length; i++) {
            document.getElementsByClassName('side-item-list').item(i)?.classList.remove('side-item-active')
        }
        if(e.target.nodeName === 'I' || e.target.nodeName === 'P' || e.target.nodeName === 'svg') {
            setSideItem(Number(e.target.parentNode.id))
            document.getElementsByClassName('side-item-list').item(e.target.parentNode.id)?.classList.add('side-item-active')

        } else {
            setSideItem(Number(e.target.id))
            document.getElementsByClassName('side-item-list').item(e.target.id)?.classList.add('side-item-active')
        }
    }

  return (
    <>
        <Layout>
            <MenuBarAdmin user={{}} index={index} setIndex={setIndex}/>
            {
                index === 0 ?
                    <div className='w-full flex flex-col items-center pb-5 pt-36 lg:pt-48 bg-neutral-100'>
                        <FormProvider {...methods}>
                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
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
                                        <InputMask id='phone' name='phone' mask='(999) 999-9999' placeholder="(999) 999-9999" value={methods.getValues('phone')} className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={personalActive} />
                                    </div>
                                    <div className='py-2 border-b-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-map-marker'></i>
                                            <p>Address</p>
                                        </div>
                                        <InputText id='address' name='address' value={methods.getValues('address')} className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={personalActive} />
                                    </div>
                                    <div className='py-2 border-b-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-bookmark'></i>
                                            <p>Year founded</p>
                                        </div>
                                        {
                                            personalActive ?
                                            <InputText value={methods.getValues('year')} className={`w-full read-only:border-none read-only:focus:shadow-none`} readOnly={true} />
                                            : <Calendar id='year' name='year' value={methods.getValues('year')} className={`w-full read-only:border-none read-only:focus:shadow-none`} view="year" dateFormat="yy" />

                                        }
                                    </div>
                                    <div className='py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-users'></i>
                                            <p>Number of employees</p>
                                        </div>
                                        <InputNumber id='employees' name='employees' value={methods.getValues('employees')} className={`w-full`} readOnly={personalActive} inputClassName='read-only:border-none read-only:focus:shadow-none' useGrouping={false} />
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <p className='font-bold'>Your introduction</p>
                                    <p id='detail' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                                </div>
                                <div className='w-full flex flex-col mt-5'>
                                    <div className='py-2'>
                                        <InputTextarea id='detail' name='detail' value={methods.getValues('detail')} className={`w-full overflow-auto read-only:border-none read-only:focus:shadow-none`} readOnly={detailActive} autoResize  rows={2} />
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
                                <div className='flex flex-row justify-between'>
                                    <p className='font-bold'>Photos</p>
                                    <p className='text-[#109EDA] font-bold cursor-pointer'>Edit</p>
                                </div>
                                <div className='flex flex-row overflow-hidden gap-3 mt-5'>
                                    <div className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-100 flex items-center justify-center shrink-0'>
                                        <Link href={''} className='pi pi-plus-circle text-[#109EDA] text-xl font-medium'></Link>
                                    </div>
                                    {Array.from({length: cantPhotos}).map((item: any, i: number) => {
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
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

                            <div className='w-1/2 bg-white rounded-md shadow-md p-5 mb-5'>
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
                        </FormProvider>
                    </div>
                : index === 1 ?
                    <div className='w-full flex flex-row items-start gap-10 pb-5 pt-36 lg:pt-48 lg:px-10 bg-neutral-100'>
                        <div className='w-1/4 bg-white p-5 rounded-md shadow-md'>
                            <div id='0' className='flex flex-row gap-2 items-center p-2 rounded-md side-item-list cursor-pointer side-item-active' onClick={activeSideItem}>
                                <i className='pi pi-user'></i>
                                <p>Direct leads</p>
                            </div>
                            <div id='1' className='flex flex-row gap-2 items-center p-2 rounded-md side-item-list cursor-pointer' onClick={activeSideItem}>
                                <FontAwesomeIcon icon={faMessage} className='w-[15px] h-[15px]' />
                                <p>Messages</p>
                            </div>
                            <div id='2' className='flex flex-row gap-2 items-center p-2 rounded-md side-item-list cursor-pointer' onClick={activeSideItem}>
                                <i className='pi pi-send'></i>
                                <p>Sent quotes</p>
                            </div>
                            <div id='3' className='flex flex-row gap-2 items-center p-2 rounded-md side-item-list cursor-pointer' onClick={activeSideItem}>
                                <i className='pi pi-tag'></i>
                                <p>Opportunities</p>
                            </div>
                            <hr />
                            <div className='flex flex-row gap-2 items-center p-2 rounded-md'>
                                <i className='pi pi-circle-fill text-sm text-gray-400'></i>
                                <Link href={''} className='hover:underline underline-offset-2 cursor-pointer'>Pending</Link>
                            </div>
                            <div className='flex flex-row gap-2 items-center p-2 rounded-md'>
                                <i className='pi pi-circle-fill text-sm text-gray-400'></i>
                                <Link href={''} className='hover:underline underline-offset-2 cursor-pointer'>Job confirmed</Link>
                            </div>
                            <div className='flex flex-row gap-2 items-center p-2 rounded-md'>
                                <i className='pi pi-circle-fill text-sm text-gray-400'></i>
                                <Link href={''} className='hover:underline underline-offset-2 cursor-pointer'>Job done</Link>
                            </div>
                            <div className='flex flex-row gap-2 items-center p-2 rounded-md'>
                                <i className='pi pi-circle-fill text-sm text-gray-400'></i>
                                <Link href={''} className='hover:underline underline-offset-2 cursor-pointer'>Not hired</Link>
                            </div>
                        </div>
                        <LayoutAdmin>
                            {
                                sideItem === 0 ?
                                <DirectLeads></DirectLeads>
                                : sideItem === 1 ?
                                <Messages></Messages>
                                : sideItem === 2 ?
                                <SentQuotes></SentQuotes>
                                : sideItem === 3 ?
                                <Opportunities></Opportunities>
                                : null
                            }
                        </LayoutAdmin>
                        {/* <div className='w-full bg-white p-5 rounded-md shadow-md'>
                            main
                        </div> */}
                    </div>
                    : null
                }
            <FooterComponentAdmin />
        </Layout>
    </>
  )
}

export default HomePage