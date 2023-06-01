import React, { useEffect, useState } from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Providers } from '@/hooks/providers'
import { useRouter } from 'next/router';
import { Provider } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import { Avatar } from 'primereact/avatar';
import { Contracts } from '@/hooks/contracts';
import { Maps } from '@/hooks/maps';
import Link from 'next/link';
import { Button } from 'primereact/button';

const Index = () => {
  const { show } = Providers();
  const { getContractsProvider } = Contracts();
  const { getAddress } = Maps();

  const [provider, setProvider] = useState<Provider>();
  const [count, setCount] = useState<number>(0);
  const [address, setAddress] = useState<string>('No Address');

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const getProvider = async (idProvider: number) => {
    try {
      const response = await show(idProvider);
      if(response.status == 200) {
        setProvider(response.data.provider);

        const addr = await getAddress(
          Number(response.data.provider.provider_lat ? response.data.provider.provider_lat : 0), 
          Number(response.data.provider.provider_lng ? response.data.provider.provider_lng : 0));
        
          if(addr.status == 200) {
            setAddress(addr.data.results[0].formatted_address);
          }
      }

      const ct = await getContractsProvider(idProvider);
      if(ct.status == 200) {
        setCount(ct.data.count);
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (router.query.idProvider) {
      getProvider(Number(router.query.idProvider));
    }
  }, [router.query.idProvider]);

  return (
    <LayoutPrincipal>
      <Spinner loading={loading} />
      <div className='h-[calc(100vh-180px)] md:h-auto flex items-center justify-center p-10'>
        <div className='max-w-xl border shadow-md rounded-md p-5 grid grid-cols-12 gap-1 md:gap-3 items-center'>
          <div className='col-span-3'>
            {
              provider?.provider_image != null ?
              <img src={`${provider.provider_image}`} alt={`${provider.provider_name}`} />
              :
              <Avatar icon="pi pi-image" size='large' shape="circle" />
            }
          </div>
          <p className='col-span-9 text-lg md:text-xl font-medium mx-auto'>{provider?.provider_name}</p>
          <p className='col-span-12'><span className='font-medium'>Introduction:</span> {provider?.provider_description}</p>
          <div className='col-span-12 md:col-span-6'>
            <p className='font-medium text-sm mb-1'>Overview</p>
            <div className='flex items-center gap-1 mb-1'>
              <i className='pi pi-tags text-sm'></i>
              <p className='text-sm'>Hired {count} times</p>
            </div>
            <div className='flex items-baseline gap-1 mb-1'>
              <i className='pi pi-map-marker text-sm'></i>
              <p className='text-sm line-clamp-2'>{address}</p>
            </div>
            <div className='flex items-center gap-1 mb-1'>
              <i className='pi pi-shield text-sm'></i>
              <p className='text-sm'>Background checked</p>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <p className='font-medium text-sm'>Social Media</p>
            <div className='text-sm font-medium'><Link href={'#'} className='text-[#109EDA]' >Facebook</Link>, <Link href={'#'} className='text-[#109EDA]' >Instagram</Link>, <Link href={'#'} className='text-[#109EDA]' >Twitter</Link> </div>
          </div>
          <div className='col-span-12 flex justify-end'>
            <Button outlined>
              <Link href='#' className='flex items-center gap-3' >
                <i className='pi pi-tag'></i>
                <p>Request a quote</p>
              </Link>
            </Button>
        </div>
        </div>
      </div>
    </LayoutPrincipal>
  )
}

export default Index