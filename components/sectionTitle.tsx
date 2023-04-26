
 import React, { useEffect, useState } from 'react'

 const services = require('../sql/services.json');

import SearchComponent from './search';
import Image from 'next/image';


 export type SectionProps = {
    title1: string;
    title2: string;
    img:    string;
    btnLabel: string;
 }

 const SectionTitle: React.FC<SectionProps> = ({title1, title2, img}) => {

    const [serviceList, setServiceList] = useState<[]>([]);
    const [selectedService, setSelectedService] = useState<string>('');

    useEffect(() => {
        setServiceList(services)
    }, []);

    return(
        <div className='w-full mt-24 lg:mt-48 flex items-center justify-center'>
            <div className="grid grid-cols-1 lg:grid-cols-2 font-bold mb-24 lg:mb-20">
                <div className="w-full p-6 text-center lg:text-left flex align-middle ">
                    <section className='pt-10 lg:pt-20'>
                        <span className="text-5xl lg:text-6xl tracking-tight font-extrabold mb-1" style={{'color': '#373A85'}}>{title1}</span>
                        <div className="text-4xl lg:text-5xl tracking-tight font-bold mb-10 mt-2" style={{'color': '#109EDA'}}>{title2}</div>
                        <div className='w-full md:w-4/5'>
                            <SearchComponent  searchList={serviceList} selectedElement={selectedService} setSelectedElement={setSelectedService} />
                        </div>
                    </section>
                </div>
                <div className="overflow-hidden h-[506px] lg:block hidden">
                    <Image src={img} alt="hero-1" fill className="lg:ml-auto object-cover object-bottom w-full h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
        </div>
    )
}

export default SectionTitle;