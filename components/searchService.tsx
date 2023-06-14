
import React, {useState, useContext, useEffect} from 'react';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { useRouter } from 'next/router';
import { Service } from '@/interfaces/interfaces';
import { SearchServiceContext } from '@/context/SearchServiceContext';
import { Services } from '@/hooks/services';

const SearchServiceComponent = () => {
    const { getAllServices } = Services();

    const {zip, setZip} = useContext(SearchServiceContext);

    const [inputDisabled, setInputDisabled] = useState<boolean>(false);

    const [services, setServices] = useState<Service[] | any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [filteredServices, setFilteredServices] = useState<Service[] | any>(null);

    const router = useRouter();

    const getServices =  async () => {
        const res = await getAllServices();
        if(res.status == 200 && res.data.services.length > 0) {
            setServices(res.data.services);
        }
    }

    useEffect(() => {
        getServices();
    }, [])

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

    const onClickSearch = () => {
        if(selectedService != null && zip != null) {
            setInputDisabled(false);
            setZip(zip);
            router.push(`/category/${selectedService.service_name.replace(' ', '-').toLowerCase()}`)
        } else {
            setInputDisabled(true);
        }
    }

  return (
    <div className='w-full'>
        <div className='p-inputgroup search-input-group'>
            <AutoComplete 
            field='service_name' 
            value={selectedService} 
            suggestions={filteredServices} 
            completeMethod={search}
            onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)}
            placeholder='I need help with...'
            aria-describedby="autocomplete-help"
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
            <Button type='button' label='Search' className='bg-[#109EDA]' onClick={onClickSearch}></Button>
        </div>
        <small id="autocomplete-help" className='text-xs text-[#495057] font-normal'>
            Try searching for a Marine Mechanic, Hull Cleaning or Bottom Scraping.
        </small>
    </div>
  )
}

export default SearchServiceComponent