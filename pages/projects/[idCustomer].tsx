import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Contracts } from '@/hooks/contracts';
import { ContractCustomer } from '@/interfaces/interfaces';
import { formatDateFirstMonth } from '@/functions/date';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Rating as RatingComponent } from 'primereact/rating';
import { Ratings } from '@/hooks/rating';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';

const ProjectsPage = () => {
  const { getContractsCustomer, updateState } = Contracts();
  const { getRatingProvider } = Ratings();

  const [contracts, setContracts] = useState<ContractCustomer[]>([]);
  const [contractFilterProgress, setContractFilterProgress] = useState<ContractCustomer[]>([]);
  const [contractFilterFinished, setContractFilterFinished] = useState<ContractCustomer[]>([]);
  const [indexActive, setIndexActive] = useState<number>(0);
  const [ratingsProvider, setRatingsProviders] = useState<any[]>([]);

  const [money, setMoney] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const op = useRef<any>(null);

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
      case 'FINISHED':
        return 'text-gray-500'
      default:
        break;
    }
  }
  
  const setBackgroundColorStatus = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'bg-neutral-600 border-neutral-600'
      case 'OFFERED':
        return 'bg-purple-600 border-purple-600'
      case 'APPROVED':
        return 'bg-teal-600 border-teal-600'
      case 'CANCELED':
        return 'bg-rose-500 border-rose-500'
      case 'FINISHED':
        return 'bg-gray-500 border-gray-500'
      default:
        break;
    }
  }

  const getRatingsOfProviders = async (idProvider: number) => {
    try {
      const response = await getRatingProvider(idProvider);
      if(response.status == 200) {
        setRatingsProviders([...ratingsProvider, idProvider])
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getContracts = async (idCustomer: number) => {
    try {
      const response = await getContractsCustomer(idCustomer);
      if(response.status == 200) {
        setContracts(response.data.contracts);
        activeIndex(0);

        if(response.data.contracts.length > 0) {
          response.data.contracts.map((item: ContractCustomer) => {
            getRatingsOfProviders(item.id_provider);
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

  const activeIndex = (index: number) => {
    setIndexActive(index);
    let filterProgressList: any[] = [];
    let filterFinishedList: any[] = [];

    if(index == 0) filterProgressList = contracts.filter((item: ContractCustomer) => item.contract_state == 'APPROVED' || item.contract_state == 'OFFERED')
    if(index == 1) filterFinishedList = contracts.filter((item: ContractCustomer) => item.contract_state == 'FINISHED' || item.contract_state == 'CANCELED')

    setContractFilterProgress(filterProgressList);
    setContractFilterFinished(filterFinishedList);
  }

  const changeStateContract = async (idContract: number, state: string) => {
    setLoading(true);
    const data = {
      contractState: state
    }
    try {
      const response = await updateState(idContract, data);
      if(response.status == 200) {
        const newState = response.data.contract[1][0];
        activeIndex(0)
        // const getItem = contractsPending.filter((contract: ContractCustomer) => contract.id_contract == idContract);
        // const itemNewState = getItem.map((item: ContractCustomer) => {
        //   return {
        //     ...item,
        //     contract_state: newState.contract_state
        //   }
        // });
        // setContractsFinished([...itemNewState, ...contractsFinished]);

        // const newListPending = contractsPending.filter((contract: ContractCustomer) => contract.id_contract != idContract);
        // setContractsPending(newListPending);
        
        setLoading(false);
        toast.current!.show({severity:'success', summary:'Successfull', detail: response.data.msg, life: 4000});
      }
    } catch (error) {
      toast.current!.show({severity:'error', summary:'Error', detail: String(error), life: 4000});
      setLoading(false);
    }
  }

  const changeStatus = async (item: ContractCustomer, data: any) => {
    try {
        const response = await updateState(item.id_contract, data);
        if(response.status == 200) {
          item.contract_state = response.data.contract[1][0].contract_state
          if(data.contractState == 'OFFERED' || data.contractState == 'APPROVED') {
              setContractFilterProgress([...contractFilterProgress]);
          } else {
              const updateList = contractFilterProgress.filter((itemContract: ContractCustomer) => itemContract.id_contract != item.id_contract);
              setContractFilterProgress(updateList);
              setContractFilterFinished([...contractFilterFinished, item])
          }
            toast.current!.show({severity:'success', summary:'Successfull', detail: response.data.msg, life: 4000});
            setLoadingButton(false);
        }
    } catch (error) {
        console.log(error);
        toast.current!.show({severity:'error', summary:'Error', detail: 'Error update', life: 4000});
    }
  }

  const updateResponse = (item: ContractCustomer, state: string) => {
      setLoadingButton(true);
      let data = {};
      if(state == 'OFFERED') {
        if(money != 0 && money != null) {
          data = {contractState: state, price: money, date: new Date().toISOString()}
          item.contract_price = money
          op.current.hide();
        } else {
          toast.current!.show({severity:'error', summary:'Error', detail: 'Price is required', life: 4000});
          return
        }
      } else {
        data = {contractState: state, date: new Date().toISOString()}
      }
      changeStatus(item, data)
  }

  return (
    <div className='relative overflow-hidden'>
      <LayoutPrincipal>
          <Spinner loading={loading} />
          <Toast ref={toast} />
          <p className='w-full md:w-[80%] mx-auto mt-28 font-semibold'>Projects</p>
          <div className="w-[500px] h-[500px] left-[80%] top-[300px] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
          <div className='w-[80%] h-full mx-auto mt-8 flex gap-8'>
            <div className='h-full w-96 border rounded-xl shrink-0 overflow-x-hidden'>
              <div className={`w-full h-full max-h-44 border flex items-start gap-3 p-3 py-4 ${indexActive == 0 ? 'active-inbox' : ''} cursor-pointer hover:bg-zinc-100`} onClick={() => activeIndex(0)}>
                <p>In progress</p>
              </div>
              <div className={`w-full h-auto max-h-44 border flex items-start gap-3 p-3 py-4 ${indexActive == 1 ? 'active-inbox' : ''} cursor-pointer hover:bg-zinc-100`} onClick={() => activeIndex(1)}>
                <p>Finished</p>
              </div>
            </div>
            <div className='h-[500px] w-full overflow-y-auto flex flex-col gap-3'>
              {
                indexActive == 0 && contractFilterProgress.length > 0 ?
                contractFilterProgress.map((item: ContractCustomer, i: number) => (
                    <div key={i} className='border border-neutral-200 rounded-xl p-4'>
                      <div className='flex items-start gap-5'>
                        {
                          item.provider_image != null ?
                            <Avatar image={item.provider_image} shape="circle" className='w-10 h-10' />
                            :
                            <FontAwesomeIcon icon={faCircleUser} className='w-10 h-10' style={{color: "#c2c2c2"}} />
                        }
                        <div className='w-full flex flex-col gap-2'>
                          <div className='flex items-center gap-5'>
                            <p className='text-zinc-900 font-medium text-lg'>{item.service_name}</p>
                            <p className={`${setColorStatus(item.contract_state)} text-sm`} style={{textTransform: 'capitalize'}}>{(item.contract_state).toLowerCase()}</p>
                            <p className="text-green-600/60 font-semibold">$ {item.contract_price || 0}</p>
                          </div>
                          <p className='text-zinc-900'>{item.provider_name}</p>
                          <p className='text-zinc-900 text-sm font-light'>{item.phone}</p>
                          {/* <div className='w-full flex justify-end'>
                            <RatingComponent value={rating.rating} readOnly cancel={false} />
                          </div> */}
                          <p className='text-neutral-600 text-sm font-light'>{item.contract_description}</p>
                          <div className='w-full flex items-center justify-between'>
                            <p className='text-neutral-400 text-xs font-light'>Request made {formatDateFirstMonth(String(item.contract_date))}</p>
                            {
                              item.contract_state == 'OFFERED' ?
                              <div className='flex items-center justify-end gap-3'>
                                <OverlayPanel ref={op} showCloseIcon>
                                    <InputNumber inputId="currency-us" value={money} onValueChange={(e) => setMoney(Number(e.value))} mode="currency" currency="USD" locale="en-US" />
                                    <Button label="Send Offer" text className="rounded-3xl text-sm px-5 py-3 text-sky-500 hover:text-sky-600" onClick={() => updateResponse(item, 'OFFERED')} />
                                </OverlayPanel>
                                <Button 
                                disabled={loadingButton}
                                label='Decline Offer' 
                                className='rounded-xl shadow-lg shadow-rose-500 bg-rose-500 border-rose-500 hover:bg-rose-600 hover:border-rose-600' 
                                onClick={(e) => op.current.toggle(e)} />
                                <Button 
                                disabled={loadingButton}
                                label='Accept Offer' 
                                className='rounded-xl shadow-lg shadow-emerald-500 bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600' 
                                onClick={() => updateResponse(item, 'APPROVED')} />
                              </div>
                              :
                              <Button 
                              label='Mark Done' 
                              disabled={loadingButton}
                              className='rounded-xl shadow-lg shadow-sky-500 bg-sky-500 border-sky-500 hover:bg-sky-600 hover:border-sky-600'
                              onClick={() => updateResponse(item, 'FINISHED')} />
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                ))
                :
                indexActive == 1 && contractFilterFinished.length > 0 ?
                contractFilterFinished.map((item: ContractCustomer, i: number) => (
                    <div key={i} className='border border-neutral-200 rounded-xl p-4'>
                      <div className='flex items-start gap-5'>
                        {
                          item.provider_image != null ?
                            <Avatar image={item.provider_image} shape="circle" className='w-10 h-10' />
                            :
                            <FontAwesomeIcon icon={faCircleUser} className='w-10 h-10' style={{color: "#c2c2c2"}} />
                        }
                        <div className='w-full flex flex-col gap-2'>
                          <div className='flex items-center gap-5'>
                            <p className='text-zinc-900 font-medium text-lg'>{item.service_name}</p>
                            <p className="text-green-600/60 font-semibold">$ {item.contract_price || 0}</p>
                          </div>
                          <p className='text-zinc-900'>{item.provider_name}</p>
                          <p className='text-zinc-900 text-sm font-light'>{item.phone}</p>
                          <p className='text-neutral-600 text-sm font-light'>{item.contract_description}</p>
                          <div className='w-full flex items-center justify-between'>
                            <p className='text-neutral-400 text-xs font-light'>Request made {formatDateFirstMonth(String(item.contract_date))}</p>
                            <div className={`px-7 py-2.5 rounded-xl shadow-lg ${setBackgroundColorStatus(item.contract_state)}`}>
                              <p className='text-white text-sm' style={{textTransform: 'capitalize'}}>{(item.contract_state).toLowerCase()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
                : null
              }
            </div>
          </div>
      </LayoutPrincipal>
    </div>
  )
}

export default ProjectsPage