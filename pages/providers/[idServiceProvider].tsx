import React, { useEffect, useState, useRef } from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Providers } from '@/hooks/providers'
import { useRouter } from 'next/router';
import { Portofolio, Provider } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import { Avatar } from 'primereact/avatar';
import { Contracts } from '@/hooks/contracts';
import { Maps } from '@/hooks/maps';
import Link from 'next/link';
import { Portofolios } from '@/hooks/portofolio';
import { Carousel } from 'primereact/carousel';
import Create from './create';
import { Toast } from 'primereact/toast';
import { Auth } from '@/hooks/auth';

const Index = () => {
  const { getOneServiceProvider, getLicenses } = Providers();
  const { getPortofolioProvider } = Portofolios();
  const { getContractsProvider } = Contracts();
  const { getAddress } = Maps();
  const { getUserAuthenticated } = Auth();

  const [provider, setProvider] = useState<Provider>();
  const [portofolio, setPortofolio] = useState<Portofolio[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [address, setAddress] = useState<string>('No Address');
  const [customerId, setCustomerId] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const responsiveOptions = [
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

  const router = useRouter();

  const getProvider = async (idServiceProvider: number) => {
    try {
      const response = await getOneServiceProvider(idServiceProvider);

      if(response.status == 200) {
        getLicense(response.data.service.id_provider);
        const portofolio = await getPortofolioProvider(response.data.service.id_provider);
        const ct = await getContractsProvider(response.data.service.id_provider);

        if(portofolio.status == 200) {
          setPortofolio(portofolio.data.portofolio);
        }
  
        if(ct.status == 200) {
          setCount(ct.data.count);
        }

        setProvider(response.data.service);
        const addr = await getAddress(
          Number(response.data.service.provider_lat ? response.data.service.provider_lat : 0), 
          Number(response.data.service.provider_lng ? response.data.service.provider_lng : 0)
        );
        if(addr.status == 200) {
          setAddress(addr.data.results[0].formatted_address);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  const getLicense = async (idProvider: number) => {
    try {
        const response = await getLicenses(idProvider);
        if(response.status == 200) {
            setLicenses(response.data.licenses);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const getUser = async () => {
    try {
      const response = await getUserAuthenticated();
      setCustomerId(response.data.idCustomer)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(true);
    if (router.query.idServiceProvider) {
      getUser();
      getProvider(Number(router.query.idServiceProvider));
    }
  }, [router.query.idServiceProvider]);

  const itemTemplate = (item: Portofolio) => {
    return (
      <div className='w-[130px] h-[130px] flex items-center justify-center mx-2'>
        <img src={item.portofolio_image} alt={item.portofolio_description || String(item.id_portofolio)} style={{ width: '100%', display: 'block' }} />
      </div>
    );
  };

  return (
    <LayoutPrincipal>
      <Toast ref={toast} />
      <Spinner loading={loading} />
      <div className='h-auto flex flex-col items-center justify-center gap-5 p-10'>
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
          <div className='col-span-12 flex md:justify-end'>
            <Create idCustomer={customerId} idServiceProvider={Number(router.query.idServiceProvider)} toast={toast}/>
          </div>
        </div>

        <div className='max-w-xl md:w-[42%] border shadow-md rounded-md p-5 grid grid-cols-12 gap-1 md:gap-3 items-center'>
          <p className='font-bold col-span-12'>Photos</p>
          <div className='col-span-12 w-full'>
            {
              portofolio.length > 0 &&
                <Carousel value={portofolio} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} itemTemplate={itemTemplate} />
            }
          </div>
        </div>

        <div className='w-full md:w-[42%] border shadow-md rounded-md p-5 grid grid-cols-12 gap-1 md:gap-3 items-center'>
          <i className='pi pi-shield col-span-1'></i>
          <p className='font-bold col-span-11'>Professional Licenses</p>
          <div className='col-span-12 w-full text-[#109EDA]'>
            {
              licenses.length > 0 ?
              licenses.map((item: any, i: number) => (
                <div key={i} className='flex gap-3 items-center mb-1 hover:text-[#0d84b7]'>
                    <i className={`pi ${item.license_name.includes('.pdf') ? 'pi-file-pdf' : 'pi-image'}`}></i>
                    <Link href={item.license_url} target='_blank'>{item.license_name.includes('.pdf') ? 'Download PDF' : 'Open image in new tab'}</Link>
                </div>
              ))
              : <p>No registered license</p>
            }
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  )
}

export default Index