
import React, { useState, useEffect } from 'react'
import { Service } from '@/interfaces/interfaces'
import Link from 'next/link'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Services } from '@/hooks/services'

const CategoriesComponent = () => {
    const {getAllServices} = Services();

    const [services, setServices] = useState<Service[]>();

    useEffect(() => {
        getServices();
    }, []);

    const getServices = async () => {
        const res = await getAllServices();
        if(res.status == 200) {
            setServices(res.data.services);
        }
    }

  return (
    <LayoutPrincipal>
        <div className='w-full flex flex-col items-center justify-center py-10'>
            <p className='text-lg md:text-xl font-bold'>Find the perfect pro for your project.</p>
            <p className='text-base md:text-lg'>Select a service below to get started.</p>
        </div>

        <div className='w-full py-10 px-5 md:px-40 bg-neutral-100'>
            <p className='font-bold'>Top services</p>
            <ul className='w-full container-group-categories text-sm md:text-base'>
                {
                    services ? services.map((item: Service, i: number) => (
                        <li key={i} className='leading-loose text-[#0d8fc7] font-medium w-auto'>
                            <Link href={`/category/${item.service_name.replaceAll(' ', '-')}`} className='hover:underline hover:underline-offset-2'>
                                {item.service_name}
                            </Link>
                        </li>
                    ))
                    : 'No services'
                }
            </ul>
        </div>
    </LayoutPrincipal>
  )
}

export default CategoriesComponent