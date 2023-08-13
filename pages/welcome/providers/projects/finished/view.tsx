import React, { useState, useEffect, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ContractProvider, Gallery } from "@/interfaces/interfaces";
import { Galleries } from "@/hooks/gallery";
import { Avatar } from "primereact/avatar";
import { formatDate } from "@/functions/date";
import { Tooltip } from "primereact/tooltip";
import Link from "next/link";
import { AiFillEye } from 'react-icons/ai';
import { Contracts } from "@/hooks/contracts";

export type ContractProviderProps = {
    contract: ContractProvider;
    contracts: ContractProvider[];
    setContracts: any;
    toast: any;
}

const View: React.FC<ContractProviderProps> = ({contract, contracts, setContracts, toast}) => {
    const { getGalleryContract } = Galleries();
    const { updateState } = Contracts();

    const [visible, setVisible] = useState(false);
    const [gallery, setGallery] = useState<Gallery[]>([]);

    const getGallery = async (idContract: number) => {
        try {
            const response = await getGalleryContract(idContract);
            if(response.status == 200) {
                setGallery(response.data.gallery);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(contract) {
            getGallery(contract.id_contract);
        }
    }, [contract]);
    
    const formatStatus = (value: string) => {
        switch (value) {
            case 'FINISHED':
                return 'Completed'
            case 'CANCELED':
                return 'Canceled'
        }
    }

    const openModal = async () => {
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
    };

    const headerContent = (
        <div className='flex items-center gap-5'>
            <p>{`Request Service: ${contract && contract.service_name}`}</p>
            <div className={`w-auto h-7 px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${contract && contract.contract_state == 'FINISHED' ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${contract && contract.contract_state == 'FINISHED' ? 'text-green-800' : 'text-red-800'}`} >{contract && formatStatus(contract.contract_state)}</p>
            </div>
        </div>
    )

    return (
        <>
            <Tooltip target=".view-btn" className='text-xs' />
            <Link href={''} data-pr-tooltip='View' data-pr-position='top' className='w-8 h-8 rounded-md border border-gray-900/50 flex items-center justify-center view-btn' onClick={openModal}>
                <AiFillEye className='w-4 h-4'/>
            </Link>

            <Dialog header={headerContent} visible={visible} className="w-[90%] md:w-[50%]" onHide={() => setVisible(false)}>
                <div className="w-full">
                    <div className="w-[60%] mx-auto flex items-center justify-between">
                        <p className='text-center text-black font-semibold'>{contract && contract.service_name}</p>
                        <p className="text-green-600/60 font-semibold text-lg">$ {contract.contract_price || 0}</p>
                    </div>
                    <div className='flex items-center gap-5 mt-8'>
                        <div>
                            {
                                contract && contract.person_image != null ?
                                <img src={`${contract.person_image}`} alt={`${contract.person_name}`} className='w-14 h-14 rounded-full' />
                                :
                                <Avatar icon="pi pi-image" size='large' shape="circle" />
                            }
                        </div>
                        <div>
                            <p className='font-semibold'>{contract && `${contract.person_name} ${contract.lastname}`}</p>
                            <div className='flex items-center gap-3'>
                                <p className='text-gray-900/75 text-sm'>{contract && contract.email}</p>
                                <p className='flex items-center gap-2 text-sm'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="#6b7280" d="M21 16.42v3.536a1 1 0 0 1-.93.998c-.437.03-.794.046-1.07.046c-8.837 0-16-7.163-16-16c0-.276.015-.633.046-1.07A1 1 0 0 1 4.044 3H7.58a.5.5 0 0 1 .498.45c.023.23.044.413.064.552A13.901 13.901 0 0 0 9.35 8.003c.095.2.033.439-.147.567l-2.158 1.542a13.047 13.047 0 0 0 6.844 6.844l1.54-2.154a.462.462 0 0 1 .573-.149a13.897 13.897 0 0 0 4 1.205c.139.02.322.041.55.064a.5.5 0 0 1 .449.498Z"/></svg>
                                    <span>{contract && contract.phone}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className='text-gray-900'>Request Description</p>
                        <p className='text-gray-900/50 text-justify mt-3'>{contract && contract.contract_description}</p>
                    </div>
                    <div className="mt-8">
                        {
                            gallery.length > 0 ?
                            <>
                                <p className='text-gray-900'>Attached Photos:</p>
                                <div className='grid grid-cols-5 items-center justify-center gap-5 mt-3 h-36'>
                                    {
                                        gallery.map((item: Gallery, i) => (
                                            <div key={i} className="w-full h-full flex items-center overflow-hidden">
                                                <img src={item.gallery_image} alt={contract.person_name} className="object-contain w-full h-full" />
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                            : null
                        }
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-gray-900/50 text-sm">Requested made {formatDate(String(contract.contract_date))}</p>
                        <p className="text-gray-900/50 text-sm">Outcome date {formatDate(String(contract.contract_date_finished))}</p>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default View;