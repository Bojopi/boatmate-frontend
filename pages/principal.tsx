import Link from 'next/link'
import React, {useState, useContext, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faGear,
    faSheetPlastic,
    faHammer,
    faSailboat,
    faBrush,
    faPaintRoller,
    faBroom,
    faCircleUser,
} from "@fortawesome/free-solid-svg-icons"

import CardComponent from "../components/card"
import SectionTitle from "../components/sectionTitle"
import { RaitingComponent } from '../components/rating';
import { reduceRating } from '../functions/reduce';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Hired, Ratings as RatingInterface, Service } from '@/interfaces/interfaces'
import { Services } from '@/hooks/services'
import { SearchServiceContext } from '@/context/SearchServiceContext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { Contracts } from '@/hooks/contracts'
import HiredCardComponent from '@/components/HiredCard'
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Ratings } from '@/hooks/rating'
import Spinner from '@/components/spinner'
import { Rating } from 'primereact/rating'


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
            name: "Boat Covers",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faPaintRoller} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        },
        {
            name: "Barnacle Scraping",
            rate: 1,
            price: '$100',
            img: <FontAwesomeIcon icon={faBroom} style={{color: "#373a85",}} className='text-lg md:text-2xl' />,
        }
    ];

    const costGuides = ['Engine Service Cost', 'Fiberglass Repair Cost', 'Underwater Growth and Barnacle Removal Cost', 'Electronics Replacement Cost', 'Upholstery Repair Cost', 'Insurance Cost'];

    const { getAllServices } = Services();
    const { hiredServices } = Contracts();
    const { getAllRatigns } = Ratings();

    const router = useRouter();

    const {zip, setZip} = useContext(SearchServiceContext);

    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [testimonials, setTestimonials] = useState<RatingInterface[]>([]);
    const [testimonialsFilter, setTestimonialsFilter] = useState<RatingInterface[]>([]);
    const [popularServicesList, setPopularServicesList] = useState<Hired[] | any[]>([]);
    const [services, setServices] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setServices(res.data.services);
        }
    }

    const getPopularHireds = async () => {
        try {
            const response = await hiredServices();
            if(response.status == 200) {
                let filterList: Hired[] = response.data.hireds
                if(filterList.length > 0) {
                    const serviceCount: any = {};
                    filterList.forEach((hired) => {
                        const idService = hired.id_service;
                        if(!serviceCount[idService]) {
                            serviceCount[idService] = 1;
                        } else {
                            serviceCount[idService]++;
                        }
                    });

                    const popularServices = Object.keys(serviceCount).map((idService) => {
                        const serviceInfo = filterList.find((hired) => hired.id_service === parseInt(idService));

                        return {
                            ...serviceInfo,
                            count: serviceCount[idService]
                        };
                    });
                    popularServices.sort((a, b) => b.count - a.count);
                    setPopularServicesList(popularServices);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getServices();
        getPopularHireds();
        getAllRatigns(setTestimonials, setTestimonialsFilter, setLoading, true);
    }, []);

    const search = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            let _filteredServices;

            if (!event.query.trim().length) {
                _filteredServices = [...services];
            }
            else {
                _filteredServices = services.filter((service: Service) => {
                    return service.service_name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredServices(_filteredServices);
        }, 250);
    }

    const onClickSearch = () => {
        if(selectedService != null && zip != null) {
            setInputDisabled(false);
            setZip(zip);
            router.push(`/category/${selectedService.service_name.replace(' ', '-').toLowerCase()}`)
        } else {
            setInputDisabled(true);
        }
    }

    const testimonialTemplate = (data: RatingInterface) => {
        return (
            <div className="w-full flex flex-col items-center gap-10 p-20">
                <div className="w-32 h-32 bg-white overflow-hidden rounded-full flex items-center justify-center">
                    {
                        data.person_image ?
                        <img src={data.person_image} alt={data.person_name} className='w-full h-full object-cover' />
                        : <FontAwesomeIcon icon={faCircleUser} className='w-full h-full' style={{color: "#c2c2c2"}} />
                    }
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <p className="text-orange-400 font-bold text-lg">{data.person_name} {data.lastname}</p>
                    <div className='flex items-center gap-4'>
                        {
                            Array.from({length: 5}).map((_, index) => (
                                <i key={index} className={`pi pi-star-fill text-xl ${index < data.rating ? 'text-[#FACC15]' : 'text-[#19182580]'}`}></i>
                            ))
                        }
                    </div>
                    <p className=' text-gray-900/75 font-medium leading-9'>{data.review}</p>
                </div>
            </div>
        );
    };

  return (
    <div className='relative overflow-hidden'>
        <Spinner loading={loading} />
        <div className="w-[500px] h-[500px] left-[-200px] top-[-100px] absolute bg-teal-500/30 rounded-full blur-3xl -z-10" />
        <div className="w-[500px] h-[500px] left-[80%] top-[70vh] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />

        <div className="w-[500px] h-[500px] left-[-200px] top-[270vh] absolute bg-yellow-400/20 rounded-full blur-3xl -z-10" />
        <div className="w-[500px] h-[500px] left-[80%] top-[380vh] absolute bg-indigo-900/20 rounded-full blur-3xl -z-10" />
        <div className='w-full py-10'>
            <div className='w-[80%] mx-auto mt-20 grid grid-cols-2 items-center'>
                <div className='col-span-1 w-[80%] justify-self-end flex flex-col gap-8'>
                    <div className='w-64 h-12 px-8 py-4 bg-white rounded-full shadow-2xl justify-start items-center gap-4 inline-flex'>
                        <div className="text-[#00CBA4] text-xs font-bold leading-none">Professionals in your area</div>
                        <svg width="20" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="work 1">
                                <path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M10.7044 3.91684C10.034 3.91684 9.46373 4.38266 9.30365 5.01051H14.6863C14.5263 4.38266 13.956 3.91684 13.2856 3.91684H10.7044ZM16.2071 5.0105H18.1881C20.2891 5.0105 22 6.74214 22 8.86871C22 8.86871 21.94 9.76896 21.92 11.0227C21.918 11.1219 21.8699 11.2191 21.7909 11.2779C21.3097 11.6333 20.8694 11.927 20.8294 11.9472C19.1686 13.0611 17.2386 13.8449 15.1826 14.2348C15.0485 14.2611 14.9165 14.1913 14.8484 14.0718C14.2721 13.0733 13.1956 12.4232 11.995 12.4232C10.8024 12.4232 9.71586 13.0662 9.12256 14.0657C9.05353 14.1832 8.92346 14.251 8.7904 14.2257C6.75138 13.8348 4.82141 13.052 3.17059 11.9573L2.21011 11.289C2.13007 11.2384 2.08004 11.1472 2.08004 11.046C2.05003 10.5295 2 8.86871 2 8.86871C2 6.74214 3.71086 5.0105 5.81191 5.0105H7.78289C7.97299 3.54216 9.2036 2.39786 10.7044 2.39786H13.2856C14.7864 2.39786 16.017 3.54216 16.2071 5.0105ZM21.6598 13.2131L21.6198 13.2334C19.5988 14.5903 17.1676 15.4916 14.6163 15.8663C14.2561 15.9169 13.8959 15.684 13.7959 15.3195C13.5758 14.4891 12.8654 13.9422 12.015 13.9422H12.005H11.985C11.1346 13.9422 10.4242 14.4891 10.2041 15.3195C10.1041 15.684 9.74387 15.9169 9.38369 15.8663C6.83242 15.4916 4.4012 14.5903 2.38019 13.2334C2.37019 13.2233 2.27014 13.1625 2.1901 13.2131C2.10005 13.2638 2.10005 13.3853 2.10005 13.3853L2.17009 18.5498C2.17009 20.6764 3.87094 22.3979 5.97199 22.3979H18.018C20.1191 22.3979 21.8199 20.6764 21.8199 18.5498L21.9 13.3853C21.9 13.3853 21.9 13.2638 21.8099 13.2131C21.7599 13.1828 21.6999 13.1929 21.6598 13.2131ZM12.7454 17.4562C12.7454 17.8815 12.4152 18.2156 11.995 18.2156C11.5848 18.2156 11.2446 17.8815 11.2446 17.4562V16.1498C11.2446 15.7346 11.5848 15.3903 11.995 15.3903C12.4152 15.3903 12.7454 15.7346 12.7454 16.1498V17.4562Z" fill="#00CBA4"/>
                            </g>
                        </svg>
                    </div>
                    <div className='text-6xl font-bold leading-none'>Connect with<br/>Marine Service</div>
                    <div className='text-gray-900/50 leading-7'>Mariners and novelty boat owners alike understand it&apos;s all about who you know in the boating and marine industry. Let us make boating hassle-free for you!</div>
                    <div className='w-[70%]'>
                        <AutoComplete 
                        field='service_name' 
                        value={selectedService} 
                        suggestions={filteredServices} 
                        completeMethod={search}
                        onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)}
                        placeholder='I need help with...'
                        aria-describedby="autocomplete-help"
                        className={`w-full autocomplete-input drop-shadow-md ${inputDisabled ? 'p-invalid' : ''}`} />
                        <div className="w-full grid grid-cols-3 gap-3 py-3">
                            <InputNumber 
                            value={zip} 
                            onValueChange={(e) => setZip(e.value != undefined ? e.value : 0)} 
                            useGrouping={false} 
                            maxLength={5} 
                            placeholder='Zip code'
                            className={`col-span-2 number-input drop-shadow-md ${inputDisabled ? 'p-invalid': ''}`} />
                            <Button type='button' rounded label='Search' className='col-span-1 bg-sky-500 border-sky-500 shadow-xl text-sm font-medium hover:bg-sky-600 hover:border-sky-600' onClick={onClickSearch}></Button>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 w-full flex items-center justify-center'>
                    <img src="https://i.postimg.cc/xCkm9nWB/Group-13.png" alt="world" className='w-full' />
                </div>
            </div>
            <div className='w-[81%] ml-auto mt-32 flex items-center'>
                <div className='w-[20%]'>
                    <p className='text-[#00CBA4] text-sm font-bold uppercase leading-7 tracking-widest'>popular</p>
                    <p className='text-gray-900 text-2xl font-bold leading-8'>Popular costs guides</p>
                </div>
                <div className='w-[80%] grid grid-cols-3 gap-5'>
                    <div className='col-span-1 w-72 h-96 p-12 bg-white border shadow-lg rounded-3xl flex flex-col justify-center items-center gap-8'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256"><g fill="#16a34a"><path d="M216 120v48a8 8 0 0 1-8 8h-12.69a8 8 0 0 0-5.65 2.34l-35.32 35.32a8 8 0 0 1-5.65 2.34H83.31a8 8 0 0 1-5.65-2.34l-35.32-35.32a8 8 0 0 1-2.34-5.65V80a8 8 0 0 1 8-8h100.69a8 8 0 0 1 5.65 2.34l35.32 35.32a8 8 0 0 0 5.65 2.34H208a8 8 0 0 1 8 8Z" opacity=".2"/><path d="M248 104a8 8 0 0 0-8 8v24h-16v-16a16 16 0 0 0-16-16h-12.69L160 68.69A15.86 15.86 0 0 0 148.69 64H128V48h24a8 8 0 0 0 0-16H88a8 8 0 0 0 0 16h24v16H48a16 16 0 0 0-16 16v56H16v-24a8 8 0 0 0-16 0v64a8 8 0 0 0 16 0v-24h16v20.69A15.86 15.86 0 0 0 36.69 184L72 219.31A15.86 15.86 0 0 0 83.31 224h65.38a15.86 15.86 0 0 0 11.31-4.69L195.31 184H208a16 16 0 0 0 16-16v-16h16v24a8 8 0 0 0 16 0v-64a8 8 0 0 0-8-8Zm-40 64h-12.69a15.86 15.86 0 0 0-11.31 4.69L148.69 208H83.31L48 172.69V80h100.69L184 115.31a15.86 15.86 0 0 0 11.31 4.69H208Z"/></g></svg>
                        <div className="h-40 flex-col justify-start items-center gap-3 flex">
                            <div className="text-center text-gray-900 text-xl font-bold leading-snug">Engine Service Cost</div>
                            <div className="text-center text-gray-900 text-sm text-opacity-50 font-normal leading-7">Engine Service Coverage! Explore our competitive prices.</div>
                        </div>
                    </div>
                    <div className='col-span-1 w-72 h-96 p-12 bg-white border shadow-lg rounded-3xl flex flex-col justify-center items-center gap-8'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><g fill="#109eda"><path d="M3 11.991c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473V8l-9 3v.991Z"/><path d="M14.101 21.527C16.761 20.365 21 17.63 21 11.991V11l-9-3v14c1.02 0 1.38-.158 2.101-.473ZM8.838 2.805L8.265 3c-3.007 1.03-4.51 1.545-4.887 2.082C3 5.62 3 7.22 3 10.417V11l9-3V2c-.811 0-1.595.268-3.162.805Z" opacity=".5"/><path d="m15.735 3l-.573-.195C13.595 2.268 12.812 2 12 2v6l9 3v-.583c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081Z"/></g></svg>
                        <div className="h-40 flex-col justify-start items-center gap-3 flex">
                            <div className="text-center text-gray-900 text-xl font-bold leading-snug">Insurance Cost</div>
                            <div className="text-center text-gray-900 text-sm text-opacity-50 font-normal leading-7">Affordable Insurance Plans. Get a quote today!</div>
                        </div>
                    </div>
                    <div className='col-span-1 w-72 h-96 p-12 bg-white border shadow-lg rounded-3xl flex flex-col justify-center items-center gap-8'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 48 48"><path fill="#FF9800" d="M44 18v-4H34V4h-4v10h-4V4h-4v10h-4V4h-4v10H4v4h10v4H4v4h10v4H4v4h10v10h4V34h4v10h4V34h4v10h4V34h10v-4H34v-4h10v-4H34v-4h10z"/><path fill="#4CAF50" d="M8 12v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4H12c-2.2 0-4 1.8-4 4z"/><path fill="#37474F" d="M31 31H17c-1.1 0-2-.9-2-2V19c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2z"/></svg>
                        <div className="h-40 flex-col justify-start items-center gap-3 flex">
                            <div className="text-center text-gray-900 text-xl font-bold leading-snug">Electronics Replacement Cost</div>
                            <div className="text-center text-gray-900 text-sm text-opacity-50 font-normal leading-7">Electronics Replacement Cost. Protect yourself from unforeseen events.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[63%] mx-auto mt-32'>
                <div className='w-full flex items-center justify-between'>
                    <div>
                        <p className='text-[#00CBA4] text-sm font-bold uppercase leading-7 tracking-widest'>popular projects</p>
                        <p className='text-gray-900 text-xl font-bold leading-8'>Explore popular projects near you</p>
                    </div>
                    {/* <div className='flex items-center justify-end gap-5'>
                        <Button icon={'pi pi-arrow-left'} rounded text raised severity='secondary' />
                        <Button icon={'pi pi-arrow-right'} rounded className='bg-sky-500 border-sky-500 hover:bg-sky-600 hover:border-sky-600' />
                    </div> */}
                </div>
                <div className='w-full grid grid-cols-4 gap-8 mt-8'>
                    {
                        popularServicesList.length > 0 ?
                        popularServicesList.slice(0, 6).map((service: Hired, i: number) => (
                            <div key={i} className='col-span-1 h-96'>
                                <HiredCardComponent service={service}></HiredCardComponent>
                            </div>
                        ))
                        : null
                    }
                </div>
            </div>
            <div className='w-[80%] mt-52 grid grid-cols-3'>
                <div className='col-span-2'>
                    <img src="https://i.postimg.cc/8Pn17mdv/Group-9238.png" alt="boat-float" className='w-full' />
                </div>
                <div className='col-span-1 flex flex-col gap-5'>
                    <p className='text-[#00CBA4] uppercase font-bold leading-7 tracking-widest'>Boat services</p>
                    <p className='text-gray-900 text-4xl font-bold leading-10'>We helping you find the best services</p>
                    <p className='text-gray-900/50 leading-7'>Our aim is to assist you in finding the finest solutions for your boat, providing you with a serene and secure journey through crystal-clear waters.</p>
                    <div className='grid grid-cols-2 gap-8'>
                        <div className='w-full h-32 flex flex-col items-center justify-center p-3 bg-white rounded-3xl border border-gray-900 border-opacity-10'>
                            <p className='text-orange-400 text-2xl font-bold leading-10'>500+</p>
                            <p className='text-gray-900 leading-7'>Lorem ipsum</p>
                        </div>
                        <div className='w-full h-32 flex flex-col items-center justify-center p-3 bg-white rounded-3xl border border-gray-900 border-opacity-10'>
                            <p className='text-orange-400 text-2xl font-bold leading-10'>100</p>
                            <p className='text-gray-900 leading-7'>Lorem ipsum</p>
                        </div>
                        <div className='w-full h-32 flex flex-col items-center justify-center p-3 bg-white rounded-3xl border border-gray-900 border-opacity-10'>
                            <p className='text-orange-400 text-2xl font-bold leading-10'>7</p>
                            <p className='text-gray-900 leading-7'>Lorem ipsum</p>
                        </div>
                        <div className='w-full h-32 flex flex-col items-center justify-center p-3 bg-white rounded-3xl border border-gray-900 border-opacity-10'>
                            <p className='text-orange-400 text-2xl font-bold leading-10'>2k+</p>
                            <p className='text-gray-900 leading-7'>Lorem ipsum</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[63%] mx-auto mt-52 grid grid-cols-2'>
                <div className='col-span-1 flex flex-col gap-3'>
                    <p className='text-sm uppercase text-[#00CBA4] font-bold leading-7 tracking-widest'>steps</p>
                    <p className='text-gray-900 text-2xl font-bold leading-10'>How it works</p>
                    <p className='text-gray-900/50 leading-7'>Elevate your boating experience with our one-stop shop for maintenance, repairs, and accessories. Expert care, seamless service, and top-tier enhancements – all for a smoother sail.</p>
                    <div className='w-[90%] ml-auto flex items-center gap-3 mt-8'>
                        <div className='w-16 h-16 bg-orange-400 rounded-3xl flex items-center justify-center shrink-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><mask id="ipTOne0"><path fill="#555" stroke="#fff" strokeWidth="4" d="m11 40l-4.06-8.798a5 5 0 0 1 2.1-6.46l11.257-6.29a3 3 0 0 1 3.264.218l1.026.77a1 1 0 0 0 1.595-.697L27.37 7.25a3 3 0 0 1 1.11-2.034l.215-.172a1.865 1.865 0 0 1 2.484.138c.525.524.82 1.236.82 1.978v22.26a1 1 0 0 0 1.624.782L37 27.5c1.653-1.322 3.875-.459 5.255.445c.439.287.504.881.192 1.303L34.5 40S31 44 23 44s-11.333-2.667-12-4Z"/></mask><path fill="white" d="M0 0h48v48H0z" mask="url(#ipTOne0)"/></svg>
                        </div>
                        <div>
                            <p className='text-gray-900 font-bold leading-7'>Tell us what your boat needs</p>
                            <p className='text-gray-900/50 text-sm leading-snug'>From routine maintenance and repairs to dream boat renovations, we can help with any project — big or small.</p>
                        </div>
                    </div>
                    <div className='w-[90%] ml-auto flex items-center gap-3 mt-8'>
                        <div className='w-16 h-16 bg-[#FACC15] rounded-3xl flex items-center justify-center shrink-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><mask id="ipTTwo0"><path fill="#555" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m11 40l-4.107-8.898a5 5 0 0 1 1.996-6.4l5.541-3.274a3 3 0 0 1 3.116.038l.687.43a1 1 0 0 0 1.524-.965L18.148 7.26a2.616 2.616 0 0 1 .748-2.155a1.744 1.744 0 0 1 2.323-.129l.378.302a3 3 0 0 1 1.087 1.865l2.239 13.88a.568.568 0 0 0 1.127-.036l1.328-13.724a3 3 0 0 1 1.112-2.054l.206-.165a1.865 1.865 0 0 1 2.484.138c.525.524.82 1.236.82 1.978v22.26a1 1 0 0 0 1.624.782L37 27.5c1.653-1.322 3.875-.459 5.255.445c.439.287.504.881.192 1.303L34.5 40S31 44 23 44s-11.333-2.667-12-4Z"/></mask><path fill="white" d="M0 0h48v48H0z" mask="url(#ipTTwo0)"/></svg>
                        </div>
                        <div>
                            <p className='text-gray-900 font-bold leading-7'>Tell us what your boat needs</p>
                            <p className='text-gray-900/50 text-sm leading-snug'>From routine maintenance and repairs to dream boat renovations, we can help with any project — big or small.</p>
                        </div>
                    </div>
                    <div className='w-[90%] ml-auto flex items-center gap-3 mt-8'>
                        <div className='w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center shrink-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><mask id="ipTThree0"><path fill="#555" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m11 40l-4.208-9.117a5 5 0 0 1 1.767-6.255l1.904-1.27a1 1 0 0 1 1.085-.016l.452.283l-1.87-13.68a2.32 2.32 0 0 1 .442-1.707a1.547 1.547 0 0 1 2.166-.31l.133.1c.41.308.719.73.886 1.215l4.112 11.879a.562.562 0 0 0 1.092-.22l-.883-13.685a2.696 2.696 0 0 1 .785-2.08a1.797 1.797 0 0 1 2.393-.132l.34.272a3 3 0 0 1 1.088 1.865l2.239 13.88a.568.568 0 0 0 1.127-.036l1.328-13.724a3 3 0 0 1 1.112-2.054l.206-.165a1.865 1.865 0 0 1 2.484.138c.525.524.82 1.236.82 1.978V19.91a.82.82 0 0 0 .017.175c.112.514.79 3.183 2.983 3.914c.907.302 2.364 2.8 3.373 4.727c.74 1.414.669 3.097-.106 4.492L34.5 40S31 44 23 44s-11.333-2.667-12-4Z"/></mask><path fill="white" d="M0 0h48v48H0z" mask="url(#ipTThree0)"/></svg>
                        </div>
                        <div>
                            <p className='text-gray-900 font-bold leading-7'>Tell us what your boat needs</p>
                            <p className='text-gray-900/50 text-sm leading-snug'>From routine maintenance and repairs to dream boat renovations, we can help with any project — big or small.</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 flex items-center justify-center'>
                    <img src="https://i.postimg.cc/dtYcxSsw/Group-47773.png" alt="boats-figures" className='w-[90%]' />
                </div>
            </div>
            <div className='w-full relative py-32'>
                <div className='absolute -top-52 w-full'>
                    <img src="https://i.postimg.cc/1zV1VxRh/Vector-2.png" alt="vector" className='w-[150%] opacity-10' />
                </div>
                <div>
                    <p className='uppercase text-pink-500 w-full text-center font-bold leading-7 tracking-widest'>Testimonials</p>
                    <p className='text-gray-900 text-2xl w-full text-center font-bold leading-7 tracking-widest'>Trust our clients</p>
                    <div className='w-[63%] mx-auto'>
                        <Carousel value={testimonials} numVisible={1} numScroll={1} className="custom-carousel" circular
                        itemTemplate={testimonialTemplate} />
                    </div>
                </div>
            </div>
        </div>


        {/* <div className="w-full p-10 lg:pl-28 text-white" style={{'backgroundColor': '#00CBA4'}}>
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
                                <RaitingComponent value={reduceRating(item.rate)} />
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
                <div className='mt-8'>
                    <Link href={'/pro'} className="py-2 px-3 bg-white text-[#373A85] text-xs lg:text-base font-bold rounded-lg hover:bg-gray-200">Learn more</Link>
                </div>
            </div>
            <div className="hidden lg:block p-10">
                <img src="https://i.postimg.cc/44L02jb0/beth-macdonald-t-JMX4k-Id-UV4-unsplash.jpg" className="rounded-md w-full" alt="obreros" />
            </div>
        </div> */}
    </div>
  )
}

export default Principal