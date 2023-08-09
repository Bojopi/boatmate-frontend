import React, { useEffect, useState } from 'react'
import { ServiceProvider } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { RaitingComponent } from './rating';
import { Ratings } from '@/hooks/rating';
import { avgRating } from '@/functions/rating';
import { Maps } from '@/hooks/maps';
import Link from 'next/link';

export type ServiceProps = {
    service: ServiceProvider;
    disabled?: boolean;
}

const ServiceCardComponent: React.FC<ServiceProps> = ({service, disabled = false}) => {

    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [rating, setRating] = useState<any>(0);
    const [address, setAddress] = useState<string>('No Address');

    const getRating = async (idProvider: number) => {
        const response = await getRatingProvider(idProvider);
        if(response.status == 200 && response.data.rating.length > 0) {
            // setRating(response.data.rating);
            const rtng = avgRating(response.data.rating);
            setRating(rtng);
        }
    };

    const getAddressMap = async (lat: number, lng: number) => {
        const response = await getAddress(lat, lng);
        if(response.status == 200 && response.data.results.length > 0) {
            setAddress(response.data.results[0].formatted_address);
        }
    };

    useEffect(() => {
        getRating(service.providerIdProvider);
        getAddressMap(Number(service.provider.provider_lat), Number(service.provider.provider_lng));
    }, [service]);

  return (
    <div className='w-full h-full rounded-2xl shadow-2xl bg-white flex flex-col relative'>
        <div className='absolute w-auto h-7 top-3 right-3 px-2 bg-gray-900/60 rounded-3xl text-white flex items-center justify-center text-sm'>
            To 10mi
        </div>
        <div className='w-full h-[60%] rounded-tl-2xl rounded-tr-2xl flex items-center justify-center overflow-hidden'>
            {
                service.provider.provider_image != null ?
                    <img src={`${service.provider.provider_image}`} alt={`${service.provider.provider_name}`} className='h-full object-center object-cover' />
                :
                    <Avatar icon="pi pi-image" size='large' shape="circle" className='object-cover' />
            }
        </div>
        <div className='w-full h-[40%] px-5 py-2 overflow-hidden flex flex-col gap-3'>
            <p className='font-bold text-gray-900 leading-tight'>{service.provider.provider_name}</p>
            <p className='text-gray-900 text-opacity-75 text-sm leading-none'>{address}</p>
            <p className='text-gray-900 text-opacity-50 text-sm font-normal leading-none line-clamp-2'>{service.service_provider_description}</p>
            <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-2 text-orange-400'>
                    <p className='text-xl font-bold leading-7'>{rating}</p>
                    <i className='pi pi-star-fill'></i>
                </div>
                <Link href={`/providers/${service.id_service_provider}`} className='w-[30%] text-sky-500 text-sm font-semibold leading-none' >
                    Profile
                </Link>
            </div>
        </div>
    </div>
  )
}

export default ServiceCardComponent