
 import { Services } from '@/hooks/services';
import { Service } from '@/interfaces/interfaces';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import React, { useEffect, useState } from 'react'


 export type SectionProps = {
    title1: string;
    title2: string;
    img:    string;
    btnLabel: string;
 }

 const SectionTitle: React.FC<SectionProps> = ({title1, title2, img}) => {

    const { getAllServices } = Services();

    const [service, setService] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<string>('');
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const search = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            let _filteredServices;

            if (!event.query.trim().length) {
                _filteredServices = [...service];
            }
            else {
                _filteredServices = service.filter((service: Service) => {
                    return service.service_name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredServices(_filteredServices);
        }, 250);
    }

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setService(res.data.services);
        }
    }

    useEffect(() => {
        getServices();
    }, [])

    return(
        <div className='w-full flex items-center justify-center'>
            <div className="grid grid-cols-1 md:grid-cols-2 font-bold mb-24 md:mb-0">
                <div className="w-full p-6 text-center md:text-left flex align-middle ">
                    <section className='pt-10 md:pt-20'>
                        <span className="text-5xl md:text-6xl tracking-tight font-extrabold mb-1" style={{'color': '#373A85'}}>{title1}</span>
                        <div className="text-4xl md:text-5xl tracking-tight font-bold mb-10 mt-2" style={{'color': '#109EDA'}}>{title2}</div>
                        <div className='w-full md:w-4/5'>
                        <AutoComplete 
                        field="service_name" 
                        value={selectedService} 
                        suggestions={filteredServices} 
                        completeMethod={search} 
                        dropdown
                        className='w-full'
                        onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)} 
                        placeholder='e.g. Hull Cleaning' />
                        </div>
                    </section>
                </div>
                <div className="overflow-hidden h-[506px] md:block hidden">
                    <img src={img} alt="hero-1" className="md:ml-auto object-cover object-bottom w-full h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
        </div>
    )
}

export default SectionTitle;