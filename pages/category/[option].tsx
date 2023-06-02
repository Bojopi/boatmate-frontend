import React, { useEffect, useState, useRef, useContext } from 'react';
import LayoutPrincipal from '@/components/layoutPrincipal';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Services } from '@/hooks/services';
import { Service, ServiceProvider } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import ServiceCardComponent from '@/components/serviceCard';
import { Auth } from '@/hooks/auth';
import { Messages } from 'primereact/messages';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { InputNumber } from 'primereact/inputnumber';
import { SearchServiceContext } from '@/context/SearchServiceContext';

export type SearchProps = {
  name: string;
}

const Index = () => {

  const { findByNameProvidersService, getAllServices } = Services();
  const { getUserAuthenticated } = Auth();

  const {zip, setZip} = useContext(SearchServiceContext);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  const [serviceList, setServiceList] = useState<ServiceProvider[]>([])

  const [title, setTitle] = useState<string>('No Service');

  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const order = [{option: 'name'}];
  const [selectOrder, setSelectOrder] = useState<any>(null);

  const msg = useRef<any>(null);

  const router = useRouter();

  const getServices = async () => {
    try {
      const response = await getAllServices();
      const enableList = response.data.services.filter((item: Service) => item.service_state);
      setServices(enableList);
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async (titleData: string) => {
    const newTitle = titleData.split('-').join(' ');
    let data: SearchProps = {name: newTitle};
    try {
      const response = await findByNameProvidersService(data);
      if(response.status == 200) {
        let services = response.data.service.service_providers.filter((item: ServiceProvider) => item.service_provider_state == true);
        if(zip != null && zip != 0) {
          services = services.filter((item: ServiceProvider) => item.provider.zip == zip);
        }
        setTitle(response.data.service.service_name);
        setSelectedService(response.data.service)
        setServiceList(services);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const getUser = async () => {
    try {
      const currentUser = await getUserAuthenticated();
      if(currentUser.data.idRole == 4) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } catch (error) {
      console.log(error);
      setDisabled(true);
    }
  }

  useEffect(() => {
    if(disabled) {
      msg.current.show(
          { sticky: true, severity: 'info', summary: '', detail: 'To see more information about the service you must log in', closable: true }
      );
    }
  }, [msg, disabled]);

  useEffect(() => {
    setLoading(true);
    if(router.query.option) {
      getUser();
      getServices();
      getData(router.query.option as string);
    } else {
      setTitle('No service');
      setLoading(false);
    }
  }, [router.query.option, zip]);


  const searchServices = (e: AutoCompleteCompleteEvent) => {
    let _filteredServices;

    if (!e.query.trim().length) {
        _filteredServices = [...services];
    }
    else {
        _filteredServices = services.filter((service) => {
            return service.service_name.toLowerCase().startsWith(e.query.toLowerCase());
        });
    }

    setFilteredServices(_filteredServices);
  }

  const orderList = (orderBy: any) => {
    let filter = [...serviceList];
    setSelectOrder(orderBy)
    if(orderBy) {
      if (orderBy.option === 'name') {
        filter = filter.sort((a: ServiceProvider, b: ServiceProvider) => {
          return a.provider.provider_name.localeCompare(b.provider.provider_name);
        });
        setServiceList(filter);
      }
    }
  };

  const onClickSearch = () => {
    console.log('aqui', selectedService, zip)
    if(selectedService != null && zip != null) {
      setInputDisabled(false);
      setZip(zip);
      router.push(`/category/${selectedService.service_name.replace(' ', '-')}`)
    } else {
      setInputDisabled(true);
    }
  }

  return (
    <>
        <LayoutPrincipal>
        <Spinner loading={loading} />
          <div
          className="w-full h-56 md:h-80 bg-no-repeat bg-cover bg-center"
          style={{'backgroundImage': "url('https://images.unsplash.com/photo-1533678819397-99457d235e42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"}}
          >
            <div className='w-full h-full bg-black/50 flex flex-col gap-2 justify-center items-center text-center px-5'>
              <p className='text-lg md:text-4xl font-medium text-white' style={{textShadow: '2px 2px 15px black', textTransform: 'capitalize'}} >Find top-rated {title} contractors in your area</p>
            </div>
          </div>
          <Messages ref={msg} />
          <div className='p-5 md:p-10'>
            <div className='w-full flex items-center justify-between search-input-group'>
              {/* <p className='text-base md:text-lg font-medium' style={{textTransform: 'capitalize'}}>Explore our catalog of {title} based services</p> */}
              <div className='w-[65%] md:w-[40%] p-inputgroup'>
                <AutoComplete 
                field='service_name' 
                value={selectedService} 
                suggestions={filteredServices} 
                completeMethod={searchServices} 
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
                <Button type='button' icon='pi pi-search' onClick={onClickSearch}></Button>
              </div>
              <Dropdown value={selectOrder} onChange={(e) => orderList(e.value)} options={order} optionLabel="option" 
                placeholder="Order by" className="w-[30%]" showClear />
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 md:mt-10 px-0 md:px-5 lg:px-20'>
              {
                serviceList && serviceList.length > 0 ?
                serviceList.map((item: ServiceProvider) => {
                  return (<ServiceCardComponent key={item.id_service_provider} service={item} disabled={disabled} ></ServiceCardComponent>)
                })
                : 
                <div className='col-span-1 md:col-span-2 flex flex-col gap-3 justify-center items-center my-[25%] md:my-3'>
                  <i className='pi pi-ban' style={{fontSize: '3rem', color: 'red'}}></i>
                  <p className='text-xl font-bold'>No Content</p>
                </div>
              }
            </div>
          </div>
        </LayoutPrincipal>
    </>
  )
}

export default Index