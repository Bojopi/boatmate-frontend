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
    <div className='p-5 rounded-md shadow-md border'>
        <div className='grid grid-cols-12 items-center'>
            <div className='col-span-3 w-full flex justify-center items-center'>
                {
                    service.provider.provider_image != null ?
                        <img src={`${service.provider.provider_image}`} alt={`${service.provider.provider_name}`} />
                    :
                        <Avatar icon="pi pi-image" size='large' shape="circle" />
                }
            </div>
            <div className='col-span-9'>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>{service.provider.provider_name}</p>
                    <RaitingComponent value={rating} />
                    <div className='flex items-baseline gap-1'>
                        <i className='pi pi-map-marker text-[13px]'></i>
                        <p className='text-xs md:text-sm'>{address}</p>
                    </div>
                </div>
                <div className='mt-2 grid grid-cols-12 gap-2'>
                    <p className='col-span-12 md:col-span-8 bg-neutral-100 text-sm line-clamp-2 p-1 rounded-md'>{service.service_provider_description}</p>
                    <Button 
                    type='button'
                    className='col-span-12 md:col-span-4 flex justify-center items-center text-xs lg:text-sm font-normal lg:font-medium' 
                    disabled={disabled} >
                        <Link href={`/providers/${service.provider.id_provider}`} >
                        View Profile
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ServiceCardComponent