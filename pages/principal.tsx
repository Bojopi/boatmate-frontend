import { useEffect, useState } from 'react'
import Link from 'next/link'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faGear,
    faSheetPlastic,
    faHammer,
    faSailboat,
    faBrush,
    faPaintRoller,
    faVolumeHigh,
    faBroom,
    faBolt,
    faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons"

import CardComponent from "../components/card"
import FooterComponent from "../components/footer"
import SectionTitle from "../components/sectionTitle"
import { RaitingComponent } from '../components/rating';
import { reduceRating } from '../functions/reduce';
import MenuBar from '@/components/menuBar'


const Principal = () => {

    const items = [
        {
            name: "Engine Service",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faGear} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Boat Wraps",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faSheetPlastic} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Fiberglass Repair",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faHammer} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Canvas/Bi Mini Tops",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faSailboat} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "T-tops",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faSailboat} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Upholstery",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faBrush} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Barnacle Scraping",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faGear} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Maintenance & Repair",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faScrewdriverWrench} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Electronics",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faBolt} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Hull Cleaning",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faBroom} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Bottom Painting",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faPaintRoller} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Sound & Entertainment",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
    ];

    const costGuides = ['Engine Service Cost', 'Fiberglass Repair Cost', 'Underwater Growth and Barnacle Removal Cost', 'Electronics Replacement Cost', 'Upholstery Repair Cost', 'Insurance Cost'];

  return (
    <>
        <MenuBar linkMenu='Join Our Pro Network' urlMenu='/pro'/>
        <SectionTitle
            title1="Maximizing connectivity"
            title2="in the boating industry"
            btnLabel="Learn More"
            img="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/54c3355d-4b60-4ed9-a168-e45abec1ea61/nicol-JrMzz7jUD5s-unsplash.png"
        />
        <div className="w-full p-10 lg:pl-28 text-white" style={{'backgroundColor': '#00CBA4'}}>
            <h1 className="text-xl w-full lg:text-4xl font-black flex lg:w-2/3 tracking-wide">The modern way to get connected with trustworthy and vetted marine service providers</h1>
            <p className="w-full pt-5 lg:w-2/3 tracking-wide">Mariners and novelty boat owners alike understand it’s all about who you know in the boating and marine industry. Let us make boating hassle-free for you!</p>
        </div>
        <div className="p-10 lg:pl-28 lg:pr-28 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CardComponent
            footerVisibility={true}
            btnLabel={'Learn more'}
            title={'Get Back on the Water'}
            image={'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/f2e2a6b9-78d1-40f1-869c-90b28a108d50/pexels-oliver-sjo%CC%88stro%CC%88m-1223648.jpg'}
            >
                <p>We will help you find the right service for your needs. Let’s get you connected.</p>
            </CardComponent>

            <CardComponent
            footerVisibility={true}
            btnLabel={'Learn more'}
            title={'Own Your Business.'}
            image={'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/bab94901-e3d8-47a3-a744-8097993adce4/pexels-andrea-piacquadio-3823418.jpg'}
            >
                <p>Do you specialize in boat or maritime services? We can help you generate leads and reach the right customers.</p>
            </CardComponent>
        </div>
        <div className="w-full p-10 lg:py-10 lg:px-28">
            <p className="text-xl lg:text-2xl font-extrabold">Popular projects near you</p>
            <div className="w-full mt-5 grid grid-cols-2 lg:grid-cols-4 shadow-md">
                {items.map((item: any, i: number) => (
                    <Link href={'/'} className="w-full p-3 lg:p-5 border flex flex-row items-center gap-4 hover:bg-gray-200" key={i}>
                        <div className="w-8">
                            {item.img}
                        </div>
                        <div className="w-full">
                            <p className="text-sm lg:text-base">{item.name}</p>
                            <div className="w-full lg:hidden flex flex-row items-center gap-2 pt-1">
                                <i className="pi pi-star-fill text-yellow-400" style={{'fontSize': '12px'}}></i>
                                <p className="w-full font-semibold text-xs">{reduceRating(item.rate)}</p>
                            </div>
                            <p className="text-xs lg:text-sm font-bold pt-1"><span className="font-light">from: </span>{item.price}</p>
                            <div className="hidden lg:flex pt-2">
                                <RaitingComponent value={item.rate} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        <div className="w-full px-10 pb-10 lg:px-28">
            <div className="bg-[#d2effb] w-full grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-md">
                <div className="p-5 lg:p-14 col-7">
                    <span className="bg-[#109EDA] p-1 rounded-md text-[10px] lg:text-[11px] tracking-wide text-gray-700 font-bold">BOATMATE COST GUIDES</span>
                    <p className="font-bold lg:font-extrabold leading-none lg:tracking-tight text-lg lg:text-xl mt-3 lg:mt-1">Knowledge is priceless — so our project cost guides are free.</p>
                    <p className="text-xs lg:text-base mt-3 lg:mt-1 font-base text-justify lg:tracking-[-.9px]">Always know what to expect from a project price tag with our cost guides. From materials to labor and more, we have the data-backed info you need to get started with confidence.</p>
                    <button className="mt-3 py-2 px-4 bg-[#3e42be] rounded-lg text-white tracking-tight font-semibold text-sm lg:text-base">Explore project costs</button>
                </div>
                <img src="https://media.angi.com/s3fs-public/HP-angi-costguides-image.png" alt="home" className="rounded-md col-4 self-end" />
            </div>
        </div>

        <div className="w-full px-10 pt-3 pb-10 lg:pt-3 lg:pb-10 lg:px-28">
            <p className="text-xl lg:text-2xl font-extrabold font-[National Bold]">Popular costs guides</p>
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                {
                    costGuides.map((value: string, i: number) => (
                        <Link href={'/'} className="w-full p-3 rounded-md border-2 hover:bg-gray-200" key={i}>
                            <span className="bg-[#109EDA] p-1 rounded-md text-[8px] lg:text-[11px] tracking-wide text-gray-700 font-bold">BOATMATE COST GUIDES</span>
                            <div className="w-full flex flex-row justify-between items-center py-2">
                                <p className="text-[13px] lg:text-base">{value}</p>
                                <i className="pi pi-angle-right"></i>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>

        <div className="w-full p-10 lg:pl-28 text-[#282827] text-base lg:text-xl font-bold" style={{'backgroundColor': '#F5F5F2'}}>
            <p>How it works</p>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-24 text-sm font-normal mt-10">
                <div className="w-full flex flex-col gap-1 lg:gap-4">
                    <div className="h-6 lg:h-12">
                        <i className="pi pi-comment text-2xl lg:text-4xl"></i>
                    </div>
                    <p className="mt-2 font-bold text-sm lg:text-lg leading-tight">1. Tell us what your home needs</p>
                    <p>From routine maintenance and repairs to dream home renovations, we can help with any project — big or small.</p>
                </div>
                <div className="w-full flex flex-col gap-1 lg:gap-4">
                    <div className="h-6 lg:h-12">
                        <i className="pi pi-bolt text-2xl lg:text-4xl"></i>
                    </div>
                    <p className="mt-2 font-bold text-sm lg:text-lg leading-tight">2. We’ll match you with personalized solutions</p>
                    <p>See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.</p>
                </div>
                <div className="w-full flex flex-col gap-1 lg:gap-4">
                    <div className="h-6 lg:h-12">
                        <i className="pi pi-home text-2xl lg:text-4xl"></i>
                    </div>
                    <p className="mt-2 font-bold text-sm lg:text-lg leading-tight">3. Start to finish, we’ve got you covered</p>
                    <p>When you book and pay with Angi, you’re covered by our Happiness Guarantee. We’ll cover your projects up to full purchase price, plus limited damage protection.</p>
                </div>
            </div>
            <button type="button" className="bg-none border-2 mt-5 lg:mt-0 border-gray-600 rounded-lg py-2 px-4 text-base tracking-wide hover:border-[#01a282] hover:text-[#01a282]">Learn more</button>
        </div>

        <div className="w-full lg:h-[500px] p-10 lg:p-40 text-white flex flex-row gap-5 lg:gap-10 items-center overflow-hidden" style={{'backgroundColor': '#373A85'}}>
            <div className="">
                <p className="text-base w-full lg:text-4xl font-bold tracking-wide">Grow your business with us. Become a BoatMate Pro today.</p>
                <button type="button" className="py-2 px-3 mt-8 bg-white text-[#373A85] text-xs lg:text-base font-bold rounded-lg hover:bg-gray-200">Learn more</button>
            </div>
            <div className="hidden lg:block p-10">
                <img src="https://i.postimg.cc/44L02jb0/beth-macdonald-t-JMX4k-Id-UV4-unsplash.jpg" className="rounded-md w-full" alt="obreros" />
            </div>
        </div>

        <FooterComponent />
    </>
  )
}

export default Principal