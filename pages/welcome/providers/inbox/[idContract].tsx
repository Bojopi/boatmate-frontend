import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Contracts } from '@/hooks/contracts';
import { ContractCustomer } from '@/interfaces/interfaces';
import { formatDateDash } from '@/functions/date';
import { Maps } from '@/hooks/maps';
import LayoutAdmin from '@/components/layoutAdmin';
import { Conversations } from '@/hooks/conversation';
import { generateBreadcrumbItems } from '@/functions/breadcrumb';
import { BreadCrumb } from 'primereact/breadcrumb';

const InboxPage = () => {
  const { getMessages } = Conversations();

  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  // const [indexActive, setIndexActive] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [hiddenBread, setHiddenBread] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const router = useRouter();

  const setColorStatus = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'text-neutral-600'
      case 'OFFERED':
        return 'text-purple-600'
      case 'APPROVED':
        return 'text-teal-600'
      case 'CANCELED':
        return 'text-rose-500'
      default:
        break;
    }
  }

  // const getAddressMap = async (lat: number, lng: number) => {
  //   try {
  //     const response = await getAddress(lat, lng);
  //     if(response.status == 200 && response.data.results.length > 0) {
  //       setAddresses([...addresses, response.data.results[0].formatted_address]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setAddresses([...addresses, 'No address']);
  //   }
  // };

  const getConversations = async (idContract: number) => {
    console.log(idContract)
    try {
      const response = await getMessages(idContract);
      if(response.status == 200) {
        setData(response.data);

        if(response.data.messages.length > 0) {
          setMessages(response.data.messages);
        }

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const home = {icon: 'pi pi-home'}

  const breadcrumbItems = [
      ...generateBreadcrumbItems(router.asPath)
  ];

  useEffect(() => {
    setLoading(true)
    if(router.query.idContract) {
      getConversations(Number(router.query.idContract));
    }
  }, [router.query.idContract]);
  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
          <BreadCrumb model={breadcrumbItems} home={home} hidden={hiddenBread} className='border-none' />
          <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Inbox</h1>
          <div className='h-[550px] w-full border rounded-xl bg-white p-4 flex flex-col justify-between'>
            {
              data && data != null && (
                  <div className='w-full h-auto'>
                    <div className='w-full flex items-end gap-5'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                      <div className='w-full flex items-center justify-between'>
                        <div>
                          <p className='text-sm'><span className='text-zinc-500'>{formatDateDash(String(data.conversation.contract_date))}</span></p>
                          <p className='text-lg'>{data.conversation.person_name} {data.conversation.lastname}</p>
                        </div>
                        <p className='text-teal-600 text-2xl font-semibold'>$ {data.conversation.contract_price || 0}</p>
                      </div>
                    </div>
                    <div className='ml-11 mt-2 flex flex-col gap-3'>
                      <p className={`${setColorStatus(data.conversation.contract_state)} text-sm`} style={{textTransform: 'capitalize'}}>{(data.conversation.contract_state).toLowerCase()}</p>
                      <p className='text-sm text-neutral-600 font-light'>{data.conversation.contract_description}</p>
                    </div>
                  </div>
              )
            }
            <div className='w-[90%] mx-auto h-full overflow-y-auto overflow-x-hidden'></div>
            <div className='w-full h-16'>
              <input type='text' className='w-[90%] mx-auto h-full rounded-3xl border'></input>
            </div>
          </div>
        </div>
        {/* <div className='w-[80%] h-full mx-auto mt-8 flex gap-5'> */}
          {/* <div className='max-h-[500px] h-full w-full border rounded-xl shrink-0 overflow-x-hidden overflow-y-auto'>
            {
              contracts.length > 0 ?
              contracts.map((item: ContractCustomer, i: number) => (
                <div id={String(i)} key={i} className={`w-full h-auto max-h-44 border flex items-start gap-3 p-3 py-4 ${indexActive == i ? 'active-inbox' : ''} cursor-pointer hover:bg-zinc-100`} onClick={() => setIndexActive(i)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                  <div className='w-full'>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-5'>
                        <p className='font-semibold leading-normal'>{item.provider_name}</p>
                        <p className='text-teal-600 font-semibold leading-normal'>$ {item.contract_price || 0}</p>
                      </div>
                      <p className='text-zinc-500 leading-normal'>{formatDateDash(String(item.contract_date))}</p>
                    </div>
                    <div className='w-full flex flex-col gap-1 mt-1'>
                      <p className={`text-sm leading-tight ${setColorStatus(item.contract_state)}`} style={{textTransform: 'capitalize'}}>{(item.contract_state).toLowerCase()}</p>
                        {
                          addresses.length > 0 ?
                            <p className='text-sm text-neutral-600 font-light leading-tight'>{addresses[i]}</p>
                          : <p className='text-sm text-neutral-600 font-light leading-tight'>No address</p>
                        }
                      <p className='text-sm text-neutral-600 font-light line-clamp-3 leading-tight '>{item.contract_description}</p>
                    </div>
                  </div>
                </div>
              ))
              : null
            }
          </div> */}
          
        {/* </div> */}
    </LayoutAdmin>
  )
}

export default InboxPage