import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import SearchServiceComponent from '@/components/searchService';
import Link from 'next/link';
import { Button } from 'primereact/button';
import PopularGroupComponent from '@/components/popularCards';
import { Services } from '@/hooks/services';
import { Customers } from '@/hooks/customers';

const InboxPage = () => {
  const {show} = Customers();
  const {getPopularServices} = Services();

  const [idCustomer, setIdCustomer] = useState<number>(0);
  const [popularServices, setPopularServices] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const router = useRouter();

  const getTopServices = async (idCustomer: number) => {
    try {
      const resCustomer = await show(idCustomer);
      const resPopServ = await getPopularServices(resCustomer.data.customer.customer_zip);
      setPopularServices(resPopServ.data.services);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true)
    if(router.query.idCustomer) {
      setIdCustomer(Number(router.query.idCustomer));
      getTopServices(Number(router.query.idCustomer));
    }
  }, [router.query.idCustomer])

  return (
    <LayoutPrincipal>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full h-full flex flex-col gap-5 pt-10 md:pt-5 p-5'>
          <div className='w-full flex flex-col md:flex-row md:justify-between px-5'>
            <div className='w-full md:w-[40%]'>
              <SearchServiceComponent></SearchServiceComponent>
            </div>
            <div className='flex gap-2 place-content-end border-b md:border-none'>
                <Link href={`/inbox/${idCustomer}`}>
                    <Button label='Inbox' text severity='secondary' className='text-black font-semibold' />
                </Link>
                <Link href={`/projects/${idCustomer}`}>
                    <Button label='Projects' text severity='secondary' className='text-black font-semibold' />
                </Link>
            </div>
          </div>
          <p className='w-full md:w-[50%] mx-auto font-semibold'>Inbox</p>
          <div className='w-full md:w-[50%] border rounded-lg shadow-md mx-auto p-5 md:p-10 flex flex-col gap-5 items-center'>
            <p>No conversations yet</p>
            <p className='w-[50%] text-center text-[#575d64]'>Once you create  a project, you&apos;ll see your messages and booking reminders-all right here.</p>
            <Link href={''} className='text-[#109EDF] font-medium'>New project</Link>
          </div>

          <div className='w-full md:w-[50%] mx-auto'>
            <p className='w-full mx-auto font-semibold mb-5'>Popular Services in your area</p>
            <PopularGroupComponent services={popularServices}></PopularGroupComponent>
          </div>
        </div>
    </LayoutPrincipal>
  )
}

export default InboxPage