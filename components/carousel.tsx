import React, { useState, useEffect } from 'react'

import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import Image from 'next/image';
// import { BoatMateService } from '../services/BoatMateService';

interface Service {
  id: string;
  code: string;
  name: string;
  image: string;
}

const CarouselComponent = () => {

  const [services, setServices] = useState<Service[]>([]);

  const responsiveOptions: CarouselResponsiveOption[] = [
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
  ];

  useEffect(() => {
    // BoatMateService.getServicesSmall().then((data) => setServices(data.slice(0, 9)));
  }, []);

  const serviceTemplate = (service: Service) => {
    return (
        <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
            <div className="mb-3 h-52 w-full flex justify-center">
                <Image src={`${service.image}`} alt={service.name} fill className="h-full shadow-lg" />
            </div>
            <div>
                <h4 className="mb-1">{service.name}</h4>
            </div>
        </div>
    );
};

  return (
    <div className='card'>
      <Carousel value={services} numScroll={1} numVisible={3} responsiveOptions={responsiveOptions} itemTemplate={serviceTemplate} />
    </div>
  )
}

export default CarouselComponent
