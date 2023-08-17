import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Contracts } from '@/hooks/contracts';
import { ContractCustomer } from '@/interfaces/interfaces';
import { formatDateDash } from '@/functions/date';
import { Maps } from '@/hooks/maps';

const InboxPage = () => {
  const { getContractsCustomer } = Contracts();
  const { getAddress } = Maps();

  const [contracts, setContracts] = useState<ContractCustomer[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [indexActive, setIndexActive] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const router = useRouter();

  const setColorStatus = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'text-neutral-600'
      case 'APPROVED':
        return 'text-teal-600'
      case 'CANCELED':
        return 'text-rose-500'
      default:
        break;
    }
  }

  const getAddressMap = async (lat: number, lng: number) => {
    try {
      const response = await getAddress(lat, lng);
      if(response.status == 200 && response.data.results.length > 0) {
        setAddresses([...addresses, response.data.results[0].formatted_address]);
      }
    } catch (error) {
      console.log(error);
      setAddresses([...addresses, 'No address']);
    }
  };

  const getContracts = async (idCustomer: number) => {
    try {
      const response = await getContractsCustomer(idCustomer);
      if(response.status == 200) {
        setContracts(response.data.contracts);

        if(response.data.contracts.length > 0) {
          response.data.contracts.map(async (item: ContractCustomer) => {
            getAddressMap(Number(item.provider_lat), Number(item.provider_lng));
          })
        }

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true)
    if(router.query.idCustomer) {
      getContracts(Number(router.query.idCustomer));
    }
  }, [router.query.idCustomer]);
  return (
    <div className='relative overflow-hidden'>
      <LayoutPrincipal>
          <Spinner loading={loading} />
          <Toast ref={toast} />
          <p className='w-full md:w-[80%] mx-auto mt-28 font-semibold'>Inbox</p>
          <div className="w-[500px] h-[500px] left-[80%] top-[300px] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
          <div className='w-[80%] h-full mx-auto mt-8 flex gap-5'>
            <div className='max-h-[500px] h-full w-96 border rounded-xl shrink-0 overflow-x-hidden overflow-y-auto'>
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
            </div>
            <div className='h-auto w-full border rounded-xl bg-white p-4'>
              {
                contracts.length > 0 && (
                    <div>
                      <div className='w-full flex items-end gap-5'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                        <div className='w-full flex items-center justify-between'>
                          <div>
                            <p className='text-sm'><span className='text-zinc-500'>{formatDateDash(String(contracts[indexActive].contract_date))}</span> - <span className='text-cyan-600 font-light'>{addresses.length > 0 ? addresses[indexActive] : 'No address'}</span></p>
                            <p className='text-lg'>{contracts[indexActive].provider_name}</p>
                          </div>
                          <p className='text-teal-600 text-2xl font-semibold'>$ {contracts[indexActive].contract_price || 0}</p>
                        </div>
                      </div>
                      <div className='ml-11 mt-2 flex flex-col gap-3'>
                        <p className={`${setColorStatus(contracts[indexActive].contract_state)} text-sm`} style={{textTransform: 'capitalize'}}>{(contracts[indexActive].contract_state).toLowerCase()}</p>
                        <p className='text-sm text-neutral-600 font-light'>{contracts[indexActive].contract_description}</p>
                      </div>
                    </div>
                )
              }
            </div>
          </div>
      </LayoutPrincipal>
    </div>
  )
}

export default InboxPage