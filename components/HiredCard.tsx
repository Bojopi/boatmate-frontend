import React from 'react'
import { Hired } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';

export type ServiceProps = {
    service: Hired;
    disabled?: boolean;
}

const HiredCardComponent: React.FC<ServiceProps> = ({service, disabled = false}) => {

  return (
    <div className='w-full h-full rounded-2xl shadow-2xl shadow-gray-800/10 bg-white flex flex-col relative'>
        <div className='w-full h-[60%] rounded-tl-2xl rounded-tr-2xl flex items-center justify-center overflow-hidden'>
            {
                service.service_image != null ?
                    <img src={`${service.service_image}`} alt={`${service.service_name}`} className='h-full w-full object-center object-cover' />
                :
                    <Avatar icon="pi pi-image" size='xlarge' className='object-cover' />
            }
        </div>
        <div className='w-full h-[40%] px-5 py-2 overflow-hidden flex flex-col gap-4'>
            <p className='font-bold text-gray-900 leading-tight'>{service.service_name}</p>
            <p className='text-gray-900 text-opacity-50 text-sm font-normal leading-none line-clamp-2'>{service.service_description || 'No description'}</p>
            <div className='flex items-center gap-2 text-orange-400'>
                <p className='text-sm font-bold leading-7'>Hired {service.count!} times</p>
            </div>
        </div>
    </div>
  )
}

export default HiredCardComponent