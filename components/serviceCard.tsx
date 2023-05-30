import { ServiceProvider } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React from 'react'

export type ServiceProps = {
    service: ServiceProvider;
}

const ServiceCardComponent: React.FC<ServiceProps> = ({service}) => {
  return (
    <div className='p-5 rounded-md shadow-md'>
        <div className='grid grid-cols-3 items-center'>
            <div className='col-span-1 w-full flex justify-center items-center'>
                {
                    service.provider.provider_image != null ?
                        <img src={`${service.provider.provider_image}`} alt={`${service.provider.provider_name}`} />
                    :
                        <Avatar icon="pi pi-image" size="xlarge" shape="circle" />
                }
            </div>
            <div className='col-span-2'>
                <p>{service.provider.provider_name}</p>
                <span>Rating</span>
                <div className='flex items-center gap-3'>
                    <i className='pi pi-map-marker'></i>
                    <p>Dirección</p>
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