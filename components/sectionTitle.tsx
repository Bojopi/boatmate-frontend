
 import { SearchServiceContext } from '@/context/SearchServiceContext';
import { Services } from '@/hooks/services';
import { Service } from '@/interfaces/interfaces';
import { useRouter } from 'next/router';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import React, { useContext, useEffect, useState } from 'react'


 export type SectionProps = {
    title1: string;
    title2: string;
    img:    string;
    btnLabel: string;
 }

 const SectionTitle: React.FC<SectionProps> = ({title1, title2, img}) => {

    const { getAllServices } = Services();

    const {zip, setZip} = useContext(SearchServiceContext);

    const [services, setServices] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const [inputDisabled, setInputDisabled] = useState<boolean>(false);

    const router = useRouter();

    const search = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            let _filteredServices;

            if (!event.query.trim().length) {
                _filteredServices = [...services];
            }
            else {
                _filteredServices = services.filter((service: Service) => {
                    return service.service_name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredServices(_filteredServices);
        }, 250);
    }

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setServices(res.data.services);
        }
    }

    useEffect(() => {
        getServices();
    }, [])

    const onClickSearch = () => {
        console.log('aqui', selectedService, zip)
        if(selectedService != null && zip != null) {
          setInputDisabled(false);
          setZip(zip);
          router.push(`/category/${selectedService.service_name.replace(' ', '-').toLowerCase()}`)
        } else {
          setInputDisabled(true);
        }
      }

    return(
        <div className='w-full flex items-center justify-center'>
            <div className="grid grid-cols-1 md:grid-cols-3 font-bold mb-24 md:mb-0">
                <div className="col-span-2 w-full p-6 text-center md:text-left flex align-middle ">
                    <section className='pt-10 md:pt-20'>
                        <span className="text-5xl md:text-6xl tracking-tight font-extrabold mb-1" style={{'color': '#373A85'}}>{title1}</span>
                        <div className="text-4xl md:text-5xl tracking-tight font-bold mb-10 mt-2" style={{'color': '#109EDA'}}>{title2}</div>
                        <div className='w-full md:w-[80%] p-inputgroup search-input-group'>
                            <AutoComplete 
                            field='service_name' 
                            value={selectedService} 
                            suggestions={filteredServices} 
                            completeMethod={search} 
                            dropdown
                            onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)}
                            placeholder='Find a service'
                            className={`w-[20%] lg:w-[40%] ${inputDisabled ? 'p-invalid' : ''}`} />
                            <span className={`p-inputgroup-addon bg-white border-r-0 ${inputDisabled ? 'border-red-500' : ''}`}>
                                <i className="pi pi-map-marker text-[#109EDA] text-sm font-bold"></i>
                            </span>
                            <InputNumber 
                            value={zip} 
                            onValueChange={(e) => setZip(e.value != undefined ? e.value : 0)} 
                            useGrouping={false} 
                            maxLength={5} 
                            placeholder='Zip code'
                            className={`input-number ${inputDisabled ? 'p-invalid': ''}`} />
                            <Button type='button' icon='pi pi-search' className='bg-[#109EDA]' onClick={onClickSearch}></Button>
                        </div>
                    </section>
                </div>
                <div className="col-span-1 overflow-hidden h-[506px] md:block hidden">
                    <img src={img} alt="hero-1" className="md:ml-auto object-cover object-bottom w-full h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
        </div>
    )
}

export default SectionTitle;