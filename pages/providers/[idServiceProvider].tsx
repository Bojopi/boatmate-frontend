import React, { useEffect, useState, useRef } from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Providers } from '@/hooks/providers'
import { useRouter } from 'next/router';
import { Portofolio, Provider, Ratings as RatingInterface } from '@/interfaces/interfaces';
import Spinner from '@/components/spinner';
import { Avatar } from 'primereact/avatar';
import { Contracts } from '@/hooks/contracts';
import { Maps } from '@/hooks/maps';
import Link from 'next/link';
import { Portofolios } from '@/hooks/portofolio';
import { Toast } from 'primereact/toast';
import { Auth } from '@/hooks/auth';
import { Button } from 'primereact/button';
import ImageCarousel from '@/components/imageCarousel';
import { Ratings } from '@/hooks/rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@/functions/date';
import { Rating as RatingComponent } from 'primereact/rating';
import { BreadCrumb } from 'primereact/breadcrumb';
import Create from './create';

const Index = () => {
  const { getOneServiceProvider, getLicenses } = Providers();
  const { getPortofolioProvider } = Portofolios();
  const { getContractsProvider } = Contracts();
  const { getAddress } = Maps();
  const { getUserAuthenticated } = Auth();
  const { getRatingProvider } = Ratings();

  const [provider, setProvider] = useState<Provider>();
  const [portofolio, setPortofolio] = useState<Portofolio[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [ratings, setRatings] = useState<RatingInterface[]>([]);
  const [count, setCount] = useState<number>(0);
  const [address, setAddress] = useState<string>('No Address');
  const [customerId, setCustomerId] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const router = useRouter();

  const getProvider = async (idServiceProvider: number) => {
    try {
      const response = await getOneServiceProvider(idServiceProvider);

      if(response.status == 200) {
        getRatingsProvider(response.data.service.id_provider);
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

  const getRatingsProvider = async (idProvider: number) => {
    try {
      const response = await getRatingProvider(idProvider);
      if(response.status == 200) {
        setRatings(response.data.rating);
      }
    } catch (error) {
      console.log(error);
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
      setCustomerId(response.data.user.idCustomer)
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

  const items = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
  const home = { icon: 'pi pi-home', url: 'https://primereact.org' }

  return (
    <div className='relative overflow-hidden'>
      <LayoutPrincipal>
        <Toast ref={toast} />
        <Spinner loading={loading} />
        {/* <BreadCrumb model={items} home={home} className='w-[60%] mx-auto border-none bg-transparent' /> */}
        <div className="w-[500px] h-[500px] left-[-200px] top-[-100px] absolute bg-teal-500/30 rounded-full blur-3xl -z-10" />
        <div className="w-[500px] h-[500px] left-[80%] top-[50vh] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
        <div className='w-[60%] mx-auto mt-28 flex items-start justify-between'>
          <div className='flex gap-8'>
            <div className='flex flex-col items-center gap-5'>
              <div className='w-36 h-36 rounded-full overflow-hidden'>
                {
                  provider?.provider_image != null ?
                  <img src={`${provider.provider_image}`} alt={`${provider.provider_name}`} className='w-full h-full object-cover' />
                  :
                  <Avatar icon="pi pi-image" size='large' shape="circle" />
                }
              </div>
              <div className="flex flex-row gap-3 pt-2">
                  <Link href={'https://www.facebook.com/BoatMateInc'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256"><path fill="#1877F2" d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"/><path fill="#FFF" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825"/></svg>
                  </a></Link>
                  <Link href={'https://www.instagram.com/boatmateinc/'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256"><g fill="none"><rect width="256" height="256" fill="url(#skillIconsInstagram0)" rx="60"/><rect width="256" height="256" fill="url(#skillIconsInstagram1)" rx="60"/><path fill="#fff" d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604h.031Zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396c0 26.688-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413c0-26.704.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5c3.5-3.5 6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563v.025Zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12v.004Zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355c0 28.361 22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355h.002Zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334c-18.41 0-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334Z"/><defs><radialGradient id="skillIconsInstagram0" cx="0" cy="0" r="1" gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)" gradientUnits="userSpaceOnUse"><stop stopColor="#FD5"/><stop offset=".1" stopColor="#FD5"/><stop offset=".5" stopColor="#FF543E"/><stop offset="1" stopColor="#C837AB"/></radialGradient><radialGradient id="skillIconsInstagram1" cx="0" cy="0" r="1" gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)" gradientUnits="userSpaceOnUse"><stop stopColor="#3771C8"/><stop offset=".128" stopColor="#3771C8"/><stop offset="1" stopColor="#60F" stopOpacity="0"/></radialGradient></defs></g></svg>
                  </a></Link>
                  <Link href={'https://www.linkedin.com/company/boatmateinc/about/'} className='flex justify-center items-center p-2 rounded-full' legacyBehavior ><a target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 128 128"><path fill="#0076b2" d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3z"/><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"/></svg>
                  </a></Link>
              </div>
            </div>
            <div className='w-full flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl'>{provider?.provider_name}</p>
                <img src="https://i.postimg.cc/qqB3Dm3R/Vector-1.png" alt="shield" className='h-5' />
              </div>
              <div className='flex items-center gap-3'>
                <i className='pi pi-phone'></i>
                <p className='font-light leading-9'>{provider?.phone}</p>
              </div>
              <div className='flex items-center gap-3'>
                <img src="https://i.postimg.cc/xT0J9FqT/Vector.png" alt="liston" className='h-6' />
                <p className='font-light leading-9'>Hired {count} times</p>
              </div>
              <Create idCustomer={customerId} idServiceProvider={Number(router.query.idServiceProvider)} toast={toast}/>
              {/* <Button label='Request a quote' className='w-full bg-sky-500 border-sky-500 shadow-2xl shadow-sky-300 hover:bg-sky-600 hover:border-sky-600 rounded-xl' /> */}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-light leading-9'>{address}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6h16"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32v4.6z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32v4.6z"/><path fill="#fff" d="M32 20.4h27.7c-.7-1.6-1.5-3.2-2.4-4.6H32v4.6"/><path fill="#ed4c5c" d="M32 25h29.2c-.4-1.6-.9-3.1-1.5-4.6H32V25z"/><path fill="#fff" d="M32 29.7h29.9c-.1-1.6-.4-3.1-.7-4.6H32v4.6"/><path fill="#ed4c5c" d="M61.9 29.7H32V32H2c0 .8 0 1.5.1 2.3h59.8c.1-.8.1-1.5.1-2.3c0-.8 0-1.6-.1-2.3"/><path fill="#fff" d="M2.8 38.9h58.4c.4-1.5.6-3 .7-4.6H2.1c.1 1.5.3 3.1.7 4.6"/><path fill="#ed4c5c" d="M4.3 43.5h55.4c.6-1.5 1.1-3 1.5-4.6H2.8c.4 1.6.9 3.1 1.5 4.6"/><path fill="#fff" d="M6.7 48.1h50.6c.9-1.5 1.7-3 2.4-4.6H4.3c.7 1.6 1.5 3.1 2.4 4.6"/><path fill="#ed4c5c" d="M10.3 52.7h43.4c1.3-1.4 2.6-3 3.6-4.6H6.7c1 1.7 2.3 3.2 3.6 4.6"/><path fill="#fff" d="M15.9 57.3h32.2c2.1-1.3 3.9-2.9 5.6-4.6H10.3c1.7 1.8 3.6 3.3 5.6 4.6"/><path fill="#ed4c5c" d="M32 62c5.9 0 11.4-1.7 16.1-4.7H15.9c4.7 3 10.2 4.7 16.1 4.7"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/><path fill="#fff" d="m25 3l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm20 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H15l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm12 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm2.8-14l1.2-.9l1.2.9l-.5-1.5l1.2-1h-1.5L13 9l-.5 1.5h-1.4l1.2.9l-.5 1.6m-8 12l1.2-.9l1.2.9l-.5-1.5l1.2-1H5.5L5 21l-.5 1.5h-1c0 .1-.1.2-.1.3l.8.6l-.4 1.6"/></svg>
          </div>
        </div>

        <div className='w-[60%] mx-auto mt-14'>
          <p className='text-justify text-neutral-600 font-light leading-normal tracking-tight'>{provider?.provider_description}</p>
        </div>
        
        <div className='w-[60%] mx-auto mt-14'>
          <div className='flex justify-start'>
            <p className='text-lg font-normal leading-normal border-neutral-600 border-b-2 pb-2'>Gallery</p>
          </div>
          <div className='mt-8'>
            {
              portofolio.length > 0 ?
                <ImageCarousel portofolio={portofolio}></ImageCarousel>
              : <p className='text-sky-500'>No gallery</p>
            }
          </div>
        </div>
        
        <div className='w-[60%] mx-auto mt-14'>
          <div className='flex justify-start'>
            <p className='text-lg font-normal leading-normal border-neutral-600 border-b-2 pb-2'>Professional licenses</p>
          </div>
          <div className='mt-8'>
            {
              licenses.length > 0 ?
              licenses.map((item: any, i: number) => (
                <div key={i}>
                {
                    item.license_name.includes('.pdf') ?
                      <div className='flex gap-3 items-center mb-3 hover:text-sky-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><g fill="currentColor"><path d="M208 88h-56V32Z" opacity=".2"/><path d="M224 152a8 8 0 0 1-8 8h-24v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8ZM92 172a28 28 0 0 1-28 28h-8v8a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h16a28 28 0 0 1 28 28Zm-16 0a12 12 0 0 0-12-12h-8v24h8a12 12 0 0 0 12-12Zm88 8a36 36 0 0 1-36 36h-16a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h16a36 36 0 0 1 36 36Zm-16 0a20 20 0 0 0-20-20h-8v40h8a20 20 0 0 0 20-20ZM40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 0 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0Zm120-32h28.69L160 51.31Z"/></g></svg>
                        <Link href={item.license_url} target='_blank' className='font-light leading-tight'>{item.license_name}</Link>
                      </div>
                      :
                      <div className='flex gap-3 items-center mb-3 hover:text-sky-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="evaImageFill0"><g id="evaImageFill1"><g id="evaImageFill2" fill="currentColor"><path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM6 5h12a1 1 0 0 1 1 1v8.36l-3.2-2.73a2.77 2.77 0 0 0-3.52 0L5 17.7V6a1 1 0 0 1 1-1Z"/><circle cx="8" cy="8.5" r="1.5"/></g></g></g></svg>
                        <Link href={item.license_url} target='_blank' className='font-light leading-tight'>Open image in new tab</Link>
                      </div>
                    }
                </div>
              ))
              : <p className='text-sky-500'>No registered license</p>
            }
          </div>
        </div>

        <div className='w-[60%] mx-auto mt-14'>
          <div className='flex justify-start'>
            <p className='text-lg font-normal leading-normal border-neutral-600 border-b-2 pb-2'>Reviews</p>
          </div>
          <div className='mt-8 flex flex-col gap-5'>
            {
              ratings && ratings.length > 0 ?
              ratings.map((item: RatingInterface, i: number) => (
                item.provider_visible ?
                  <div key={i} className='w-full flex gap-5 p-4 bg-white rounded-md border border-gray-900/25'>
                    {
                        item.person_image != null ?
                            <Avatar image={item.person_image} shape="circle" className='w-10 h-10' />
                            :
                            <FontAwesomeIcon icon={faCircleUser} className='w-10 h-10' style={{color: "#c2c2c2"}} />
                    }
                    <div className='w-full flex flex-col gap-3'>
                      <div className='w-full flex items-start justify-between'>
                        <div className='flex flex-col gap-2'>
                          <p className='leading-tight'>{item.person_name} {item.lastname}</p>
                          <p className='text-gray-900/50 font-light leading-tight'>{formatDate(String(item.rating_date))}</p>
                        </div>
                        <RatingComponent value={item.rating} readOnly cancel={false} />
                      </div>
                      <p className='text-neutral-500 font-thin leading-normal tracking-tight'>{item.review}</p>
                    </div>
                  </div>
                : null
              ))
              : <p className='text-sky-500'>No reviews</p>
            }
          </div>
        </div>

        {/* <div className='min-h-screen flex flex-col items-center justify-center gap-5 p-10'>
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
        </div> */}
      </LayoutPrincipal>
    </div>
  )
}

export default Index