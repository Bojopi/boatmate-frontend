import Link from 'next/link'

import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import React, { useEffect, useRef, useState, useContext } from 'react'
import Spinner from '@/components/spinner'
import { Toast } from 'primereact/toast'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Services } from '@/hooks/services'
import { Service } from '@/interfaces/interfaces'
import LayoutPro from '@/components/layoutPro'
import { FormContext } from '@/context/FormContext'

const libraries: any = ['places'];

const ListPage: React.FC = () => {
    const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBfwNcp4UHQnucX_gq0_ThusY_ceSgAtyU',
    libraries
    });

    const { getAllServices } = Services();

    const {setServices, setLat, setLng} = useContext(FormContext)

    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [service, setService] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<string>('');
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const search = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            let _filteredServices;

            if (!event.query.trim().length) {
                _filteredServices = [...service];
            }
            else {
                _filteredServices = service.filter((service: Service) => {
                    return service.service_name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredServices(_filteredServices);
        }, 250);
    }

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setService(res.data.services);
        }
    }

    useEffect(() => {
        getServices();
    }, [])

    if (loadError) return <div>Error al cargar el mapa</div>;
    if (!isLoaded) return <div></div>;

    const onPlaceChanged = () => {
        if (autocomplete != null) {
          const place = autocomplete.getPlace();
          setSelectedPlace(place.formatted_address);
          setSelectedLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          });
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
      };

    const onSubmit = () => {
        setLoading(true);
        const serviceList = [];
        serviceList.push(selectedService)

        setServices(serviceList);
        if(selectedLocation != null) {
            setLat(selectedLocation.lat);
            setLng(selectedLocation.lng)
        }
        router.push('/pro/services');
        setLoading(false);
    };

    const active = () => {
        if((selectedService != null && selectedService != '') || selectedLocation != null) {
            return false
        } else {
            return true
        }
    }

  return (
    <>
    <LayoutPro footer={1}>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full h-auto grid grid-cols-1 md:grid-cols-2 py-10 md:py-10 xl:py-0 items-center overflow-hidden bg-gray-200'>
            <div className='w-5/6 md:w-7/12 mx-auto'>
                <p className='text-2xl md:text-4xl font-bold'>Get Jobs near you.</p>
                <p className='text-xs md:text-sm leading-tight mt-2 md:mt-3'>Thousands of projects performed by boat owners every day.</p>
                <div className='mt-5 md:mt-3 bg-white shadow-md rounded-md p-5'>
                    <p className='text-sm md:text-base'>What service do you provide?</p>
                    <div className='p-inputgroup mt-3'>
                        <span className="p-inputgroup-addon bg-white border-r-0">
                            <i className="pi pi-search text-[#109EDA] text-sm font-bold"></i>
                        </span>
                        <AutoComplete 
                        field="service_name" 
                        value={selectedService} 
                        suggestions={filteredServices} 
                        completeMethod={search} 
                        onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)} 
                        placeholder='e.g. Hull Cleaning' />
                    </div>
                    <div className='p-inputgroup mt-2'>
                        <span className="p-inputgroup-addon bg-white border-r-0">
                            <i className="pi pi-map-marker text-[#109EDA] text-sm font-bold"></i>
                        </span>
                        <Autocomplete
                            onLoad={autocomplete => setAutocomplete(autocomplete)}
                            onPlaceChanged={onPlaceChanged}
                            className='w-full'
                        >
                            <input 
                            type="text" 
                            className='p-inputtext w-full rounded-l-none text-sm md:text-base' 
                            value={selectedPlace} 
                            onChange={(e: any) => {
                                if(e.target.value == '') {
                                    setSelectedLocation(null);
                                }
                                setSelectedPlace(e.target.value)
                            }} 
                            placeholder='Tampa, Florida' />
                        </Autocomplete>
                    </div>
                    <div className='w-full mt-5'>
                        <Button 
                        type='button' 
                        onClick={onSubmit}
                        disabled={active()}
                        className='flex justify-center items-center py-2 border-none focus:shadow-md focus:shadow-[#6d70c7]/50 rounded-md w-full bg-[#373A85] text-white text-sm md:text-base font-medium hover:bg-[#2a2c64]'
                        >Get Started</Button>
                    </div>
                </div>
                <div className='w-full mt-5 text-xs md:text-sm'>
                    <p className='w-full text-center font-bold'>Problems Registering?</p>
                    <p className='w-full text-center mt-1'>Contact us at <Link href={''} className='text-[#109EDA] font-bold' >(813) 766-7565</Link></p>
                </div>
            </div>
            <img src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/54c3355d-4b60-4ed9-a168-e45abec1ea61/nicol-JrMzz7jUD5s-unsplash.png" className='w-full hidden md:block' alt="head" />
        </div>
        
        <div className="w-5/6 md:w-2/3 h-auto overflow-hidden mx-auto my-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className='col-span-1 md:col-span-3'>
                <p className='w-full text-center text-2xl font-bold'>See how BoatMate is different.</p>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/50FZYCRn/Credit-card-bro.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>No subscription fees</p>
                        <p className='text-sm'>There&apos;s no charge to join, no annual fees, and no membership fees.</p>
                    </div>
                </div>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/9M1nKYK8/Customer-feedback-rafiki.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>Great customers</p>
                        <p className='text-sm'>Hear from customers who choose you, with high intent to hire.</p>
                    </div>
                </div>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/bvznw7mv/Contact-us-bro.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>Outstanding support</p>
                        <p className='text-sm'>1:1 help that&apos;s easily accessible, and a simple, flexible refund policy.</p>
                    </div>
                </div>
            </div>
        </div>
    </LayoutPro>
    </>
  )
}

export default ListPage