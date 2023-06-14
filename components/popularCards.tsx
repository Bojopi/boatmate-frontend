import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export type DataProps = {
    services: any[];
}

const PopularServicesComponent: React.FC<DataProps> = ({services}) => {

    const [serviceList, setServiceList] = useState<any[]>([]);

    const fillNewList = () => {
        if(services) {
            const newList = services.filter((service: any) => service.service_provider != null);
            setServiceList(newList);
        }
    }

    useEffect(() => {
        if(services != null) {
            fillNewList();
        }
    }, [services])
  return (
    <div className='w-full'>
        {
            serviceList.length > 0 ?
            <div className='w-full relative grid grid-cols-12 shrink-0 gap-3 overflow-x-auto'>
                <div className='absolute right-0 top-0 h-full flex flex-col justify-center'>
                    <Link href={'/'}>
                        <i className='pi pi-chevron-right bg-gray-100 p-2 rounded-full'></i>
                    </Link>
                </div>
                {
                    serviceList.map((service: any, i: number) => {
                        if(i < 3) {
                            return (
                                <div key={i} className='col-span-4 flex flex-col gap-2 items-center'>
                                    <div className='h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] bg-no-repeat bg-cover bg-center' style={{'backgroundImage': `url(${service.service_provider.service.service_image})`}}></div>
                                    <p className='text-sm'>{service.service_provider.service.service_name}</p>
                                </div>
                            )
                        }
                    })
                }
            </div>
            : <p className='w-full text-center text-gray-500 mt-5 text-sm'>Nothing to show</p>
        }
    </div>
  )
}

export default PopularServicesComponent