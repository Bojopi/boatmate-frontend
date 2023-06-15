import React, { useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ContractCustomer } from "@/interfaces/interfaces";
import { Avatar } from "primereact/avatar";
import { formatDate } from "@/functions/date";
import { Ratings } from "@/hooks/rating";
import { Maps } from "@/hooks/maps";
import { avgRating } from "@/functions/rating";
import { Rating } from "primereact/rating";

export type ContractCustomerProps = {
    contract: ContractCustomer;
}

const View: React.FC<ContractCustomerProps> = ({contract}) => {
    const { getRatingProvider } = Ratings();
    const { getAddress } = Maps();

    const [visible, setVisible] = useState(false);

    const [rating, setRating] = useState<any>(0);
    const [address, setAddress] = useState<string>('No Address');

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


    const openModal = async () => {
        getRating(contract.id_provider);
        getAddressMap(Number(contract.provider_lat), Number(contract.provider_lng));
        setVisible(true);
    };

    const closeModal = () => {
        setRating(0);
        setAddress('');
        setVisible(false);
    }

    const footerContent = (
        <div>
            <Button type="button" label="Close" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
        </div>
    );

    return (
        <>
            <p className="w-auto text-[#109EDF] text-xs font-medium cursor-pointer" onClick={openModal}>See details</p>

            <Dialog header={`Service: ${contract && contract.service_name}`} visible={visible} className="w-[90%] md:w-[70%]" onHide={() => setVisible(false)} footer={footerContent}>
                <div className="w-full mt-2">
                    <div className={templateState(contract.contract_state) + ' text-[10px] p-1 w-[20%] md:w-[12%] font-medium flex justify-center items-center rounded-full'}>{contract && contract.contract_state}</div>
                    <div className="flex md:flex-row flex-col md:justify-between items-start mb-2">
                        <div className="flex gap-5 items-start">
                            <div>
                                {
                                    contract.provider_image != null ?
                                    <img src={`${contract.provider_image}`} alt={`${contract.provider_name}`} className='w-32' />
                                    :
                                    <Avatar icon="pi pi-image" size='large' shape="circle" />
                                }
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg font-medium">{contract && contract.provider_name}</p>
                                <p className="text-sm md:text-base">{contract && contract.email}</p>
                                <p className="text-[#109EDF] text-xs md:text-sm">{contract && contract.phone}</p>
                            </div>
                        </div>
                        <p className="text-xs md:text-sm font-medium">Requested made {formatDate(String(contract && contract.contract_date))}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className='flex flex-row gap-2 justify-start'>
                            <Rating value={rating} readOnly cancel={false} onIconProps={{style: {color: 'rgb(107, 114, 128)'}}} />
                            <p className='text-sm'>{rating == 0 ? 'N/A' : rating} evaluations</p>
                        </div>
                        <div className='flex items-baseline gap-1 mb-3'>
                            <i className='pi pi-map-marker text-[13px]'></i>
                            <p className='text-xs md:text-sm'>{address}</p>
                        </div>
                        <p className="font-medium text-sm md:text-base">About the project</p>
                        <p className="text-sm md:text-base">{contract && contract.contract_description}</p>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default View;