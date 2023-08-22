import React, { useEffect, useState, useRef, useContext } from 'react';
import LayoutPrincipal from '@/components/layoutPrincipal';
import { useRouter } from 'next/router';
import { Services } from '@/hooks/services';
import { Service, ServiceProvider } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import ServiceCardComponent from '@/components/serviceCard';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { SearchServiceContext } from '@/context/SearchServiceContext';
import { Auth } from '@/hooks/auth';
import { calculateDistance } from '@/functions/calculateDistance';

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

  const [userLat, setUserLat] = useState<number>(0);
  const [userLng, setUserLng] = useState<number>(0);

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

  const orderServicesByDistance = () => {
    return serviceList.slice().sort((a, b) => {
      const distanceA = Number(calculateDistance(userLat, userLng, Number(a.provider.provider_lat), Number(a.provider.provider_lng)));
      const distanceB = Number(calculateDistance(userLat, userLng, Number(b.provider.provider_lat), Number(b.provider.provider_lng)));
      return distanceA - distanceB;
    });
  };

  const getData = async (titleData: string) => {
    const newTitle = titleData.split('-').join(' ');
    let data: SearchProps = {name: newTitle};
    try {
      const response = await findByNameProvidersService(data);
      if(response.status == 200) {
        let services = response.data.service.service_providers.filter((item: ServiceProvider) => item.service_provider_state == true);
        if(zip != null && zip != 0) {
          services = services.filter((item: ServiceProvider) => item.provider.provider_zip == zip);
        }
        setTitle(response.data.service.service_name);
        setSelectedService(response.data.service)

        const filteredList = services.slice().sort((a: any, b: any) => {
          const distanceA = Number(calculateDistance(userLat, userLng, Number(a.provider.provider_lat), Number(a.provider.provider_lng)));
          const distanceB = Number(calculateDistance(userLat, userLng, Number(b.provider.provider_lat), Number(b.provider.provider_lng)));
          return distanceA - distanceB;
        })

        setServiceList(filteredList);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const getLocationUser = async () => {
    try {
      const response = await getUserAuthenticated();
      if(response.status == 200) {
        console.log('hay usuario')
        setUserLat(response.data.user.customerLat || 0);
        setUserLng(response.data.user.customerLng || 0);
      }
    } catch (error) {
      console.log(error)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLat(latitude);
            setUserLng(longitude);
          },
          (error) => {
            console.error("Position error:", error);
          }
        );
      } else {
        console.log("Geolocation not available in this browser.");
      }
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
      getLocationUser();
      getServices();
      getData(router.query.option as string);
    } else {
      setTitle('No service');
      setLoading(false);
    }
  }, [router.query.option, zip]);

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

  return (
    <div className='relative overflow-hidden'>
        <LayoutPrincipal>
          <Spinner loading={loading} />
          <div className="w-[500px] h-[500px] left-[-200px] top-[-100px] absolute bg-teal-500/30 rounded-full blur-3xl -z-10" />
          <div className="w-[500px] h-[500px] left-[80%] top-[50vh] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
          <div className='w-[70%] min-h-screen mx-auto mt-32 z-30'>
            <p className="text-black text-xl font-bold leading-normal">Find Top-Rated <span className="text-sky-500">{title}</span> Contractors In Your Area</p>
            <div className='flex justify-between items-center pt-5'>
              <AutoComplete 
              field='service_name' 
              value={selectedService} 
              suggestions={filteredServices} 
              completeMethod={search}
              onChange={(e: AutoCompleteChangeEvent) => setSelectedService(e.value)}
              placeholder='Search'
              aria-describedby="autocomplete-help"
              className={`w-96 autocomplete-input drop-shadow-md ${inputDisabled ? 'p-invalid' : ''}`} />
              <Dropdown value={selectOrder} onChange={(e) => orderList(e.value)} options={order} optionLabel="option" 
              placeholder="Order by: Name (a-z)" className="w-60 rounded-full text-sm input-dropwdon drop-shadow-xl" showClear />
            </div>
            <div className='grid grid-cols-12 gap-10 mt-14'>
              {
                serviceList && serviceList.length > 0 ?
                serviceList.map((item: ServiceProvider) => {
                  return (<div key={item.id_service_provider} className='col-span-3 h-96'><ServiceCardComponent service={item} disabled={disabled} userLat={userLat} userLng={userLng} ></ServiceCardComponent></div>)
                })
                :
                <div className='col-span-12 flex flex-col gap-3 justify-center items-center my-[25%] md:my-3'>
                  <i className='pi pi-ban' style={{fontSize: '3rem', color: 'red'}}></i>
                  <p className='text-xl font-bold'>No Content</p>
                </div>
              }
            </div>
          </div>
        </LayoutPrincipal>
    </div>
  )
}

export default Index