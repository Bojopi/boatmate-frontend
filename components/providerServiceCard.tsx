import React, { useEffect, useState } from 'react'
import { ContractCustomer } from '@/interfaces/interfaces';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { RaitingComponent } from './rating';
import { Ratings } from '@/hooks/rating';
import { avgRating } from '@/functions/rating';
import { Maps } from '@/hooks/maps';
import { Tag } from 'primereact/tag';
import { formatDate } from '../functions/date';
import { Contracts } from '@/hooks/contracts';

export type ServiceProps = {
    contract: ContractCustomer;
    contractList: any;
    setContractList: any;
    setLoading: any;
    toast: any;
}

const ProviderServiceCardComponent: React.FC<ServiceProps> = ({contract, contractList, setContractList, setLoading, toast}) => {
    const { updateState } = Contracts();
    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [rating, setRating] = useState<any>(0);
    const [address, setAddress] = useState<string>('No Address');

    const templateState = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'warning'
            case 'APPROVED':
                return 'success'
            case 'CANCELED':
                return 'danger'
        
            default:
                break;
        }
    }

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
        getRating(contract.id_provider);
        getAddressMap(Number(contract.provider_lat), Number(contract.provider_lng));
    }, [contract]);

    const changeStatus = (idContract: number) => {
        setLoading(true)
        const data = {
            contractState: 'APPROVED'
        }

        updateState(idContract, data, contractList, setContractList, setLoading, toast);
    }

  return (
    <div className='p-5 rounded-md shadow-md border'>
        <div className='grid grid-cols-12 items-center'>
            <div className='col-span-8 flex items-top'>
                <div className=''>
                    {
                        contract.provider_image != null ?
                        <img src={`${contract.provider_image}`} alt={`${contract.provider_name}`} className='w-32' />
                        :
                        <Avatar icon="pi pi-image" size='large' shape="circle" />
                    }
                </div>
                <div className=''>
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-lg'>{contract.provider_name}</p>
                        <p className='text-sm font-medium text-[#109EDA]'>{contract.phone}</p>
                        <RaitingComponent value={rating} />
                    </div>
                </div>
            </div>
            <div className='col-span-4 justify-self-end place-self-start flex flex-col gap-3'>
                <Tag severity={templateState(contract.contract_state)} value={contract.contract_state} />
                <Tag severity={'info'} icon='pi pi-dollar' value={contract.price} />
            </div>
            <p className='col-span-12 text-justify font-light mb-3'>{contract.contract_description}</p>
            <div className='col-span-12 flex items-baseline gap-1 mb-3'>
                <i className='pi pi-map-marker text-[13px]'></i>
                <p className='text-xs md:text-sm'>{address}</p>
            </div>
            <div className='col-span-6 text-xs'>{formatDate(String(contract.contract_date))}</div>
            {
                contract.contract_state == 'PENDING' ?
                <div className='col-span-6 flex justify-end items-center gap-3'>
                    {/* <Button label='View' /> */}
                    <Button label='Done' severity='success' onClick={(e: any) => changeStatus(contract.id_contract)} />
                </div>
                : null
            }
        </div>
    </div>
  )
}

export default ProviderServiceCardComponent