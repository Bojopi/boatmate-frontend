import LayoutPro from "@/components/layoutPro"
import { useEffect, useRef, useState } from "react"
import React, { useContext } from 'react'
import { FormContext } from "@/context/FormContext"
import { Services } from "@/hooks/services"
import { Profile, Service } from "@/interfaces/interfaces"
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import Spinner from "@/components/spinner"
import { useRouter } from "next/router"
import { Button } from "primereact/button"
import Head from "next/head"
import { InputText } from "primereact/inputtext"
import { Auth } from "@/hooks/auth"
import { Providers } from "@/hooks/providers"
import { InputTextarea } from 'primereact/inputtextarea';
import MapComponent from "@/components/map"
import { Maps } from "@/hooks/maps"
import { Toast } from "primereact/toast"
import { Users } from "@/hooks/user"

export type FormProps = {
    service: any;
}

const FormService: React.FC = () => {
    const { getAllServices } = Services();
    const { getUserAuthenticated } = Auth();
    const { updateServices } = Providers();
    const { updateProfile, setCheckSteps } = Users();
    const { getAddress } = Maps();

    const [user, setUser] = useState<Profile | any>(null);

    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [serviceList, setServiceList] = useState<any[]>([]);
    const [serviceFilter, setServiceFilter] = useState<any[]>([]);

    const [services, setServices] = useState<Service[]>([]);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [zip, setZip] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [infoBussines, setInfoBussines] = useState<any>({
        providerName: '',
        providerDescription: '',
        phone: '',
    });

    const toast = useRef<Toast>(null);

    const router = useRouter();

    // const {services, setServices} = useContext(FormContext);

    const getUser = async () => {
        try {
            const response = await getUserAuthenticated();
            if(response.status == 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setLoading(true);
        getServices();
    }, []);

    useEffect(() => {
        setSelectedServices(services);
    }, [services]);

    const getServices = async () => {
        try {
            getUser();
            const services = await getAllServices();
            if(services.status == 200 && services.data.services) {
                setServiceList(services.data.services);
                setServiceFilter(services.data.services);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
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
            const allServices = serviceFilter.map((item: Service) => item)
            setSelectedServices(allServices);
        } else {
            setSelectedServices([])
        }
    }

    const saveDataProvider = async (idProfile: number, idProvider: number, data: any) => {
        try {
            const response = await updateProfile(idProfile, data);
            if(response.status == 200) {
                setUser(response.data.user);
                const dataCheck = {checkSteps: true}
                const check = await setCheckSteps(user && user.uid, dataCheck);
                if(check.status == 200) {
                    const updates = await updateServices(idProvider, data);
                    if(updates.status == 200) {
                        toast.current!.show({severity:'success', summary:'Successfull', detail: updates.data.msg, life: 4000});
                        setLoading(false)
                        router.push('/welcome/profile');
                    }
                }
            }
        } catch (error) {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: 'Error create user', life: 4000});
            setLoading(false);
        }
    }

    const saveList = () => {
        setLoading(true);
        let data: any = {};
        if(selectedServices.length > 0 && selectedLocation != null && zip != null) {
            data = {
                ...infoBussines,
                services: selectedServices,
                zip: zip,
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                state: true
            }
            setServices(selectedServices);
            console.log(selectedServices, user && user.idProvider, infoBussines, selectedLocation, zip);
            saveDataProvider(user && user.uid, user && user.idProvider, data);
            // router.push('/pro/personal');
            // setLoading(false);
        } else {
            toast.current!.show({severity:'error', summary:'Error', detail: `All fields must be filled in`, life: 4000});
            setLoading(false);
        }
    }

    const filterListServices = (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = e.target.value.toLowerCase();
        const filtered = serviceList.filter((service: Service) => {
            return service.service_name.toLowerCase().includes(data);
        })

        setServiceFilter(filtered);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setInfoBussines((prevInfo: any) => ({
            ...prevInfo,
            [name]: value
        }));
    };

  return (
    <>
        <Head>
            <title>BoatMate</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/png" href="/Biggest_BoatMate-removebg-preview.ico" />
        </Head>
        <Toast ref={toast} />
        <Spinner loading={loading} />
        <div className="w-full min-h-screen px-10 py-5 md:px-0 flex items-center justify-center bg-gray-200">
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                <div className="w-auto shadow-lg p-5 md:px-10 rounded-md border bg-white grid grid-cols-2 gap-5">
                    <p className='col-span-2 leading-snug'>Business Information</p>
                    <div className='col-span-2 md:col-span-1'>
                        <p className='text-sm'>Bussiness Name</p>
                        <InputText 
                        id='providerName' 
                        name='providerName' 
                        type='text' 
                        placeholder='work day' 
                        value={infoBussines.providerName}
                        onChange={handleInputChange}
                        className="w-full text-sm rounded-xl border-neutral-200" />
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <p className='text-sm'>Phone Number</p>
                        <InputText 
                        type='tel' 
                        id='phone' 
                        name='phone' 
                        placeholder="(999) 999-9999" 
                        value={infoBussines.phone}
                        onChange={handleInputChange}
                        className="w-full text-sm rounded-xl border-neutral-200" />
                    </div>
                    <div className='col-span-2'>
                        <p className='text-sm'>Business Description</p>
                        <InputTextarea 
                        id='providerDescription' 
                        name='providerDescription' 
                        rows={3} 
                        value={infoBussines.providerDescription}
                        onChange={handleInputChange}
                        className="w-full text-sm rounded-xl border-neutral-200" />
                    </div>
                    <div className='col-span-2'>
                        <p className='text-sm'>Address</p>
                        <MapComponent
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        getAddress={getAddress}
                        selectedPlace={selectedPlace}
                        setSelectedPlace={setSelectedPlace}
                        setZip={setZip}
                        />
                    </div>
                </div>
                <div className="w-auto shadow-lg p-5 md:px-10 rounded-md border bg-white">
                    <p className="mb-3 lg:mb-5 text-base">Select any other services you do.</p>
                    <p className="text-sm mb-3 lg:mb-5">You&apos;ll show up in search results and get jobs for all services you select:</p>
                    <div className="w-full flex items-center justify-between mb-3 lg:mb-5">
                        <div className="flex gap-2 items-center justify-start">
                            <Checkbox
                                inputId="all"
                                checked={selectedServices.length > 0}
                                onChange={handleSelectAll}
                            />
                            <label htmlFor="all" className="text-sm font-medium text-[#109EDA] cursor-pointer hover:text-[#27aee8]">
                                Select all
                            </label>
                        </div>
                        <InputText 
                        type="text"
                        placeholder="Search service"
                        onChange={filterListServices}
                        className="w-[50%] text-sm rounded-xl border-neutral-200" />
                    </div>
                    <div className="h-[300px] lg:max-h-80 flex flex-col gap-3 px-5 overflow-y-auto">
                        {serviceFilter.map((service: Service) => {
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
                    <div className="flex items-center justify-center mt-5 mb-3">
                        <Button 
                        type='submit' 
                        label='Save Data' 
                        onClick={saveList}
                        className='w-full p-3 border-none bg-gradient-to-r from-sky-600 to-sky-300 hover:to-sky-400 shadow-lg shadow-sky-300/50 text-white text-sm lg:text-base rounded-xl' />
                        {/* <Button type="button" onClick={nextStep} className="border-2 border-[#373A85] bg-[#373A85] text-white font-bold px-10 py-1 rounded-md hover:bg-[#212359] text-sm lg:text-base">Next</Button> */}
                    </div>
                    {/* <div className="flex flex-col items-center gap-1">
                        <p className="text-xs lg:text-sm font-medium">Problems Registering?</p>
                        <p className="text-xs lg:text-sm">Contact us at <span className="text-[#109EDA] font-medium">1-813-766-7565</span></p>
                    </div> */}
                </div>
            </div>
        </div>
    </>
  )
}


export default FormService