import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { Textarea } from "@/components/react-hook-form/textarea";
import { Providers } from "@/hooks/providers";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Services } from "@/hooks/services";
import { Service } from "@/interfaces/interfaces";

export type FormProps = {
    idService: number;
    description: string;
}

export type RoleProps = {
    serviceList: any;
    setServiceList: any;
    toast: any;
    loading: any;
    setLoading: any;
    idProvider: number;
}

const Create: React.FC<RoleProps> = ({idProvider, serviceList, setServiceList, loading, setLoading, toast}) => {
    const {addService} = Providers();
    const {getAllServices} = Services();

    const [serviceSelected, setServiceSelected] = useState<any>(null);
    const [services, setServices] = useState<Service[]>([]);

    const [allServices, setAllServices] = useState<boolean>(false);

    const [visible, setVisible] = useState(false);

    const getServices = async () => {
        const response = await getAllServices();
        const filterList = response.data.services
        .filter((service: Service) => !serviceList.find((item: any) => Number(item.id_service) === Number(service.id_service)));
        if(filterList.length === 0) setAllServices(true)
        setServices(filterList);
    };

    const methods = useForm<FormProps>({
        defaultValues: {
            idService: 0,
            description: ''
        }
    });

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const onSubmit = (formData: FormProps) => {
        setLoading(true);
        addService(idProvider, formData, toast, setLoading, closeModal, serviceList, setServiceList);
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'Fields are required', life: 4000});
    };

    const openModal = async () => {
        reset();
        setServiceSelected(null);
        setAllServices(false);
        getServices();
        setVisible(true);
    };
    
    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const disabledSubmit = () => {
        if(loading || allServices) return true;
        else return false;
    }

    const footerContent = (
        <div className='w-full flex items-center justify-end gap-3'>
            <Button type="button" label="Cancel" icon="pi pi-times" disabled={loading} severity="danger" onClick={closeModal} className="p-button-text" />
            {
                loading ?
                    <Button type="button" className="p-button-success flex items-center" disabled>
                        <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium"> Processing... </span>
                    </Button>
                :
                    <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" disabled={disabledSubmit()} autoFocus />
            }
            {/* <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" disabled={disabledSubmit()} autoFocus /> */}
        </div>
    );

    const selectedService = (e: DropdownChangeEvent) => {
        setServiceSelected(e.value);
        methods.setValue('idService', Number(e.value.id_service));
    }

    return (
        <>
            <Button 
            type="button" 
            label="Add Service" 
            className="px-5 py-2.5 bg-emerald-400 rounded-md border border-emerald-400 text-white text-sm"
            onClick={openModal} />

            <Dialog header="Add service" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="idService">Select a service *</Label>
                            <Dropdown
                            id="idService"
                            name="idService"
                            value={serviceSelected}
                            options={services}
                            optionLabel="service_name"
                            placeholder="Select a service"
                            filter
                            required
                            disabled={allServices}
                            aria-errormessage="messageInvalid"
                            className={`w-full ${serviceSelected ? '': 'p-invalid'}`}
                            onChange={selectedService} />
                            <p id="messageInvalid" className={`w-full text-sm text-red-500 ${serviceSelected ? 'hidden': 'block'}`}>{allServices ? 'No services to add': 'You must select a service'}</p>
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="description">Service description *</Label>
                            <Textarea 
                            id="description"
                            name="description"
                            placeholder="Add description ..."
                            rules={{required: "Description is required"}}
                            />
                            {errors.description?.message && (
                                <ErrorMessage>{errors.description.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create