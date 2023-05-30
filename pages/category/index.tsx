import React, { useEffect, useState } from 'react';
import LayoutPrincipal from '@/components/layoutPrincipal';
import { useRouter } from 'next/router';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Button } from 'primereact/button';
import { Services } from '@/hooks/services';
import { ServiceProvider } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import ServiceCardComponent from '@/components/serviceCard';

const libraries: any = ['places'];

export type SearchProps = {
  name: string;
}

const Index = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBfwNcp4UHQnucX_gq0_ThusY_ceSgAtyU',
    libraries
  });

  const { findByNameProvidersService } = Services();

  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [serviceList, setServiceList] = useState<ServiceProvider[]>([])

  const [title, setTitle] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const changeTitle = (titleData: string) => {
    const newTitle = titleData.split('-').join(' ')
    setTitle(newTitle)
    const data: SearchProps = {name: newTitle}
    findByNameProvidersService(data, setServiceList, setLoading);
  }

  useEffect(() => {
    setLoading(true);
    if(router.query.option) {
      changeTitle(router.query.option as string);
    } else {
      setTitle('No service');
      setLoading(false);
    }
  }, [router.query.option]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div></div>;

  const onPlaceChanged = () => {
    if (autocomplete != null) {
      const place = autocomplete.getPlace();
      setSelectedPlace(place.formatted_address);
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      });
    } else {
        console.log('Autocomplete is not loaded yet!');
    }
  };

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
              <p className='text-sm md:text-lg text-white' style={{textShadow: '2px 2px 10px black'}}>Enter your address and find the best offers</p>
              <div className='p-inputgroup flex justify-center'>
                  <span className="p-inputgroup-addon bg-white rounded-s-md border-r-0">
                      <i className="pi pi-map-marker text-[#109EDA] text-lg font-bold"></i>
                  </span>
                  <Autocomplete
                      onLoad={autocomplete => setAutocomplete(autocomplete)}
                      onPlaceChanged={onPlaceChanged}
                  >
                      <input 
                      type="text" 
                      className='p-inputtext w-full md:w-[300px] h-12 rounded-e-md rounded-l-none border-l-0 text-sm md:text-base' 
                      value={selectedPlace} 
                      onChange={(e: any) => {
                          if(e.target.value == '') {
                              setSelectedLocation(null);
                          }
                          setSelectedPlace(e.target.value)
                      }} 
                      placeholder='Tampa, Florida' />
                  </Autocomplete>
              </div>
              <Button 
              type='button'
              className='w-auto flex justify-center items-center py-2 border-none focus:shadow-md focus:shadow-[#6d70c7]/50 rounded-md bg-[#373A85] text-white text-sm md:text-base font-medium hover:bg-[#2a2c64]'
              >Get Started</Button>
            </div>
          </div>
          <div className='p-5 md:p-10'>
            <p className='text-base md:text-lg font-medium' style={{textTransform: 'capitalize'}}>Explore our catalog of {title} based services</p>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 md:mt-10 px-0 md:px-5 lg:px-20'>
              {
                serviceList && serviceList.length > 0 ?
                serviceList.map((item: ServiceProvider, i: number) => {
                  return (<ServiceCardComponent key={i} service={item}></ServiceCardComponent>)
                })
                : 'No content'
              }
            </div>
          </div>
        </LayoutPrincipal>
    </>
  )
}

export default Index