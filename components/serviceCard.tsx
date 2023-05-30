import { ServiceProvider } from '@/interfaces/interfaces';
import { Button } from 'primereact/button';
import React from 'react'

export type ServiceProps = {
    service: ServiceProvider;
}

const ServiceCardComponent: React.FC<ServiceProps> = ({service}) => {
  return (
    <div className='p-5 rounded-md shadow-md'>
        <div className='grid grid-cols-2'>
            <img src={``} alt={''} className='col-span-1' />
            <div className='col-span-1'>
                <p>Titulo</p>
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