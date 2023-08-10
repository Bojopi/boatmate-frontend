
import { useContext, useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link";
import SearchServiceComponent from "./searchService";
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Services } from "@/hooks/services";
import { SearchServiceContext } from "@/context/SearchServiceContext";
import { Service } from "@/interfaces/interfaces";
import { useRouter } from "next/router";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

export default function FooterComponent() {

    const { getAllServices } = Services();

    const router = useRouter();

    const {zip, setZip} = useContext(SearchServiceContext);

    const [inputDisabled, setInputDisabled] = useState<boolean>(false);

    const [services, setServices] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const [email, setEmail] = useState<string>('');

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setServices(res.data.services);
        }
    }

    useEffect(() => {
        getServices();
    }, [])

    const submit = () => {
        console.log('enviando datos...');
    }

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

    return(
        <footer className="w-[70%] mx-auto pt-28">
            <div className="hidden md:grid grid-cols-12 gap-20 pb-5">
                <div className="col-span-4">
                    <p className="w-full text-left font-bold text-xl">Sign up for free project cost information</p>
                    <AutoComplete 
                    field='service_name' 
                    value={selectedService} 
                    suggestions={filteredServices} 
                    completeMethod={search}
                    onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)}
                    placeholder='I need help with...'
                    aria-describedby="autocomplete-help"
                    className={`w-full autocomplete-input drop-shadow-md pt-5 ${inputDisabled ? 'p-invalid' : ''}`} />
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
                <div className="col-span-2"></div>
                <div className="col-span-6 flex justify-end">
                    <img src="https://i.postimg.cc/dVwVtq5k/boat-illustration-1.png" alt="boat" />
                </div>
            </div>
            <div className="flex gap-5">
                <div className="w-full px-5 flex flex-col gap-5">
                    <img
                    alt="logo"
                    src="https://i.postimg.cc/jSW0kv3s/Logo-Boat-Mate-horizontal.png"
                    className="img-fluid" />
                    <p className="text-center text-neutral-400 font-light leading-tight tracking-tight text-sm">Passion for the Sea, Attention to Every Detail.</p>
                    <div className="flex flex-row gap-3 pt-2">
                        <Link href={'https://www.facebook.com/BoatMateInc'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256"><path fill="#1877F2" d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"/><path fill="#FFF" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825"/></svg>
                        </a></Link>
                        <Link href={'https://www.instagram.com/boatmateinc/'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256"><g fill="none"><rect width="256" height="256" fill="url(#skillIconsInstagram0)" rx="60"/><rect width="256" height="256" fill="url(#skillIconsInstagram1)" rx="60"/><path fill="#fff" d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604h.031Zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396c0 26.688-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413c0-26.704.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5c3.5-3.5 6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563v.025Zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12v.004Zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355c0 28.361 22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355h.002Zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334c-18.41 0-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334Z"/><defs><radialGradient id="skillIconsInstagram0" cx="0" cy="0" r="1" gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)" gradientUnits="userSpaceOnUse"><stop stopColor="#FD5"/><stop offset=".1" stopColor="#FD5"/><stop offset=".5" stopColor="#FF543E"/><stop offset="1" stopColor="#C837AB"/></radialGradient><radialGradient id="skillIconsInstagram1" cx="0" cy="0" r="1" gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)" gradientUnits="userSpaceOnUse"><stop stopColor="#3771C8"/><stop offset=".128" stopColor="#3771C8"/><stop offset="1" stopColor="#60F" stopOpacity="0"/></radialGradient></defs></g></svg>
                        </a></Link>
                        <Link href={'https://www.linkedin.com/company/boatmateinc/about/'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 128 128"><path fill="#0076b2" d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3z"/><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"/></svg>
                        </a></Link>
                    </div>
                </div>
                <div className="w-full flex flex-col items-start gap-3">
                    <p className="text-lg text-black">Boat services</p>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Find local businesses</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Services near me</Link>
                </div>
                <div className="w-full flex flex-col items-start gap-3">
                    <p className="text-lg text-black">Service pros</p>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Register your business</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Business center</Link>
                </div>
                <div className="w-full flex flex-col items-start gap-3">
                    <p className="text-lg text-black">About us</p>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>How it works</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Who we are</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Careers</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>Contact us</Link>
                </div>
                <div className="w-full flex flex-col items-start gap-3">
                    <p className="text-lg text-black">Meet us</p>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>(813) 766-7565</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>support@boatmate.com</Link>
                    <Link href={'/'} className='hover:underline text-neutral-600 leading-tight text-sm'>205, R Street, New York<br/>8D23200</Link>
                </div>
            </div>
            <div className="w-full">
                <p className="text-center leading-tight tracking-tight text-zinc-900 text-xs lg:text-sm font-normal p-1 lg:p-5 w-full">Copyright &copy; 2021-2023 BoatMate, Inc. All rights reserved</p>
            </div>
        </footer>
    )
};
