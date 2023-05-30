import React, { useEffect, useState } from 'react'
import { ServiceProvider } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { RaitingComponent } from './rating';
import { Ratings } from '@/hooks/rating';
import { avgRating } from '@/functions/rating';
import { Maps } from '@/hooks/maps';

export type ServiceProps = {
    service: ServiceProvider;
}

const ServiceCardComponent: React.FC<ServiceProps> = ({service}) => {

    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [rating, setRating] = useState<any>(0);
    const [address, setAddress] = useState<string>('No direction');

    const getRating = async (idProvider: number) => {
        const response = await getRatingProvider(idProvider);
        if(response.status == 200 && response.data.rating.length > 0) {
            const rtng = avgRating(response.data.rating);
            setRating(rtng);
        }
    };

    const getAddressMap = async (lat: number, lng: number) => {
        console.log(lat, lng)
        const response = await getAddress(lat, lng);
        console.log(response)
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
        <div className='grid grid-cols-3 items-center'>
            <div className='col-span-1 w-full flex justify-center items-center'>
                {
                    service.provider.provider_image != null ?
                        <img src={`${service.provider.provider_image}`} alt={`${service.provider.provider_name}`} />
                    :
                        <Avatar icon="pi pi-image" size="xlarge" shape="circle" />
                }
            </div>
            <div className='col-span-2 flex flex-col gap-1'>
                <p>{service.provider.provider_name}</p>
                <RaitingComponent value={rating} />
                <div className='flex items-center gap-1'>
                    <i className='pi pi-map-marker'></i>
                    <p>{address}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='w-4/5 bg-neutral-100'>Descripcion</div>
                    <Button type='button' label='View Profile'></Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ServiceCardComponent