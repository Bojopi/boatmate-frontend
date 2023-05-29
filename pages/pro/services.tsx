import LayoutPro from "@/components/layoutPro"
import { useEffect, useState } from "react"
import React, { useContext } from 'react'
import { FormContext } from "@/context/FormContext"
import { Services } from "@/hooks/services"
import { Service } from "@/interfaces/interfaces"
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import Spinner from "@/components/spinner"
import { useRouter } from "next/router"
import { Button } from "primereact/button"

export type FormProps = {
    service: any;
}

const FormService: React.FC = () => {
    const { getAllServices } = Services();

    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [serviceList, setServiceList] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const {services, setServices} = useContext(FormContext);

    useEffect(() => {
        setLoading(true);
        getServices();
    }, []);

    useEffect(() => {
        setSelectedServices(services);
    }, [services]);

    const getServices = async () => {
        const services = await getAllServices();
        if(services.status == 200 && services.data.services) {
            setServiceList(services.data.services)
            setLoading(false);
        } else {
            setLoading(false)
        }
    }

    const onServiceChange = (e: CheckboxChangeEvent) => {
        let _selectedServices = [...selectedServices];

        if (e.checked)
            _selectedServices.push(e.value);
        else
            _selectedServices = _selectedServices.filter(service => service.id_service !== e.value.id_service);

        setSelectedServices(_selectedServices);
    };

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        const { checked } = e.target
        if(checked) {
            const allServices = serviceList.map((item: Service) => item)
            setSelectedServices(allServices);
        } else {
            setSelectedServices([])
        }
    }

    const nextStep = () => {
        if(selectedServices.length > 0) {
            setServices(selectedServices);
            router.push('/pro/personal');
        }
    }

    const backStep = () => {
        setServices([]);
        router.push('/pro/list');
    }

  return (
    <>
        <LayoutPro footer={3}>
            <Spinner loading={loading} />
            <div className="w-full min-h-full px-5 md:px-0 flex items-center justify-center bg-gray-200">
                <div className="w-full md:w-1/2 shadow-lg p-5 md:px-10 rounded-md border bg-white">
                    <p className="font-bold mb-3 lg:mb-5 text-base">Select any other services you do.</p>
                    <p className="text-sm mb-3 lg:mb-5">You&apos;ll show up in search results and get jobs for all services you select:</p>
                    <div className="flex gap-2 justify-start mb-3 lg:mb-5">
                        <Checkbox
                            inputId="all"
                            checked={selectedServices.length > 0}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="all" className="text-sm font-medium text-[#109EDA] cursor-pointer hover:text-[#27aee8]">
                            Select all
                        </label>
                    </div>
                    <div className="max-h-[300px] lg:max-h-80 flex flex-col gap-3 px-5 overflow-y-auto">
                        {serviceList.map((service: Service) => {
                            return (
                                <div key={service.id_service} className="flex items-center">
                                    <Checkbox
                                    inputId={`${service.id_service}`}
                                    name="service"
                                    value={service}
                                    onChange={onServiceChange}
                                    checked={selectedServices.some((item) => item.id_service === service.id_service)} />
                                    <label htmlFor={`${service.id_service}`} className="ml-2">
                                        {service.service_name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-row items-center justify-around mt-5 mb-3">
                        <Button type="button" onClick={backStep} outlined className="border-2 border-[#373A85] text-[#373A85] font-bold px-10 py-1 rounded-md hover:bg-[#c6c7ee43] text-sm lg:text-base">Back</Button>
                        <Button type="button" onClick={nextStep} className="border-2 border-[#373A85] bg-[#373A85] text-white font-bold px-10 py-1 rounded-md hover:bg-[#212359] text-sm lg:text-base">Next</Button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs lg:text-sm font-medium">Problems Registering?</p>
                        <p className="text-xs lg:text-sm">Contact us at <span className="text-[#109EDA] font-medium">1-813-766-7565</span></p>
                    </div>
                </div>
            </div>
        </LayoutPro>
    </>
  )
}


export default FormService