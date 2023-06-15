import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Contracts } from '@/hooks/contracts'
import { ContractCustomer } from '@/interfaces/interfaces';
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import MenuProgressComponent from '@/components/menuProgress';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { formatDate } from '@/functions/date';
import { Ratings } from '@/hooks/rating';
import { Maps } from '@/hooks/maps';
import { Avatar } from 'primereact/avatar';
import { RaitingComponent } from '@/components/rating';
import View from './view';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { avgRating } from '@/functions/rating';
import SearchServiceComponent from '@/components/searchService';

const ProjectsPage = () => {
    const { getContractsCustomer, updateState } = Contracts();
    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [idCustomer, setIdCustomer] = useState<number>(0);

    const [contractsPending, setContractsPending] = useState<ContractCustomer[]>([]);
    const [contractsFinished, setContractsFinished] = useState<ContractCustomer[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(1);

    const [rating, setRating] = useState<any>(0);
    const [address, setAddress] = useState<string>('No Address');

    const [loading, setLoading] = useState<boolean>(false);

    const templateState = (status: string) => {
      switch (status) {
          case 'PENDING':
              return 'bg-sky-300/50'
          case 'APPROVED':
              return 'bg-green-300/50'
          case 'CANCELED':
              return 'bg-red-300/50'
      
          default:
              break;
      }
    }

    const toast = useRef<Toast>(null);

    const router = useRouter();

    const getContracts = async (idCustomer: number) => {
        try {
            const response = await getContractsCustomer(idCustomer);
            if(response.status == 200) {
              const inProgress = response.data.contracts.filter((contract: ContractCustomer) => contract.contract_state === 'PENDING' && contract.service_provider_state);
              setContractsPending(inProgress);
              const finished = response.data.contracts.filter((contract: ContractCustomer) => contract.contract_state !== 'PENDING' && contract.service_provider_state);
              setContractsFinished(finished);
              setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getRating = async (idProvider: number) => {
      const response = await getRatingProvider(idProvider);
      if(response.status == 200 && response.data.rating.length > 0) {
          const rtng = avgRating(response.data.rating);
          setRating(rtng);
      }
    };

    const getAddressMap = async (lat: number, lng: number) => {
        const response = await getAddress(lat, lng);
        if(response.status == 200 && response.data.results.length > 0) {
            setAddress(response.data.results[0].formatted_address);
        }
    };

    useEffect(() => {
      setLoading(true);
        if(router.query.idCustomer) {
          setIdCustomer(Number(router.query.idCustomer));
          getContracts(Number(router.query.idCustomer));
        }
    }, [router.query.idCustomer]);

    const changeStatus = async (idContract: number, state: string) => {
      setLoading(true)
      const data = {
          contractState: state
      }

      try {
        const res = await updateState(idContract, data);
        const newState = res.data.contract[1][0];
        const getItem = contractsPending.filter((contract: ContractCustomer) => contract.id_contract == idContract);
        const itemNewState = getItem.map((item: ContractCustomer) => {
          return {
            ...item,
            contract_state: newState.contract_state
          }
        });
        setContractsFinished([...itemNewState, ...contractsFinished]);

        const newListPending = contractsPending.filter((contract: ContractCustomer) => contract.id_contract != idContract);
        setContractsPending(newListPending);
        
        setLoading(false);
        toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
      } catch (error) {
        console.log(error);
        toast.current!.show({severity:'error', summary:'Error', detail: String(error), life: 4000});
        setLoading(false);
      }

      // updateState(idContract, data, contractsFinished, setContractsFinished, setLoading, toast);
    };

    const confirmCancel = (idContract: number) => {
      const accept = async () => {
          setLoading(true)
          changeStatus(idContract, 'CANCELED');
      }
      const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
      confirmDialog({
          message: 'Do you want to cancel this project?',
          header: 'Cancel Confirmation',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept,
          reject
      });
    };
    
    const confirmFinished = (idContract: number) => {
      const accept = async () => {
          setLoading(true)
          changeStatus(idContract, 'APPROVED');
      }
      const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
      confirmDialog({
          message: 'Do you want to mark done this project?',
          header: 'Done Confirmation',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-success',
          accept,
          reject
      });
    };

  return (
    <LayoutPrincipal>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full md:w-[70%] h-full p-10 m-auto flex flex-col gap-3'>
          <div className='w-full flex flex-col md:flex-row md:justify-between px-5'>
            <div className='w-full md:w-[50%]'>
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
          <MenuProgressComponent activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          {
            activeIndex === 1 ?
              contractsPending && contractsPending.length > 0 ?
                contractsPending.map((contract: ContractCustomer, i: number) => {
                  getRating(contract.id_provider);
                  getAddressMap(Number(contract.provider_lat), Number(contract.provider_lng));
                  return (
                    <div key={i} className='p-5 rounded-md shadow-md border'>
                      <div className='grid grid-cols-12 items-center gap-2'>
                          <div className='col-span-12 md:col-span-8 flex items-top'>
                              <div>
                                  {
                                      contract.provider_image != null ?
                                      <img src={`${contract.provider_image}`} alt={`${contract.provider_name}`} className='w-32' />
                                      :
                                      <Avatar icon="pi pi-image" size='large' shape="circle" />
                                  }
                              </div>
                              <div>
                                  <div className='flex flex-col gap-2'>
                                      <p className='font-bold text-sm md:text-lg'>{contract.service_name}</p>
                                      <p className='font-medium text-xs md:text-base'>{contract.provider_name}</p>
                                      <p className=' text-xs md:text-sm font-medium text-[#109EDA]'>{contract.phone}</p>
                                      <RaitingComponent value={rating} />
                                      <div className='flex gap-3 items-center'>
                                        <View contract={contract} ></View>
                                        <div className='p-[2px] rounded-full bg-gray-600'></div>
                                        <p className="w-auto text-[#109EDF] text-xs font-medium cursor-pointer" onClick={(e: any) => confirmCancel(Number(contract.id_contract))}>Cancel project</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className='col-span-12 md:col-span-4 justify-self-center md:justify-self-end place-self-start flex flex-col gap-3'>
                              <Button label='Mark done' icon='pi pi-check-circle' className='text-[#109EDF] border-gray-400' severity='secondary' outlined onClick={(e: any) => confirmFinished(Number(contract.id_contract))} />
                          </div>
                          <p className='col-span-12 text-justify font-light my-3'>{contract.contract_description}</p>
                          <div className='col-span-12 flex items-baseline gap-1 mb-3'>
                              <i className='pi pi-map-marker text-[13px]'></i>
                              <p className='text-xs md:text-sm'>{address}</p>
                          </div>
                          <div className='col-span-12 text-xs'>Requested made {formatDate(String(contract.contract_date))}</div>
                      </div>
                    </div>
                  )
                })
              : 
                <div className='w-full md:w-[50%] border rounded-lg shadow-md mx-auto p-5 md:p-10 flex flex-col gap-5 items-center'>
                  <p>No Projects Requested</p>
                  <p className='w-[50%] text-center text-[#575d64]'>Once you have created a project, you will be able to view your waiting lists here.</p>
                  <Link href={''} className='text-[#109EDF] font-medium'>New project</Link>
                </div>
            : activeIndex === 2 ?
              contractsFinished && contractsFinished.map((contract: ContractCustomer, i: number) => {
                return (
                  <div key={i} className='p-5 rounded-md shadow-md border'>
                    <div className={templateState(contract.contract_state) + ' text-[10px] p-1 w-[20%] md:w-[12%] font-medium flex justify-center items-center rounded-full'}>{contract.contract_state}</div>
                    <div className='grid grid-cols-12 items-center gap-2'>
                        <div className='col-span-12 flex items-top'>
                            <div>
                                {
                                    contract.provider_image != null ?
                                    <img src={`${contract.provider_image}`} alt={`${contract.provider_name}`} className='w-32' />
                                    :
                                    <Avatar icon="pi pi-image" size='large' shape="circle" />
                                }
                            </div>
                            <div>
                                <div className='flex flex-col gap-2'>
                                    <p className='font-bold text-sm md:text-lg'>{contract.service_name}</p>
                                    <p className='font-medium text-xs md:text-base'>{contract.provider_name}</p>
                                    <p className=' text-xs md:text-sm font-medium text-[#109EDA]'>{contract.phone}</p>
                                    <RaitingComponent value={rating} />
                                    <div className='flex gap-3 items-center'>
                                      <View contract={contract} ></View>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className='col-span-12 text-justify font-light my-3'>{contract.contract_description}</p>
                        <div className='col-span-12 flex items-baseline gap-1 mb-3'>
                            <i className='pi pi-map-marker text-[13px]'></i>
                            <p className='text-xs md:text-sm'>{address}</p>
                        </div>
                        <div className='col-span-12 text-xs'>Requested made {formatDate(String(contract.contract_date))}</div>
                    </div>
                  </div>
                )
              })
            : null
          }
        </div>
    </LayoutPrincipal>
  )
}

export default ProjectsPage