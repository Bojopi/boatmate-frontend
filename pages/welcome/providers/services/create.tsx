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
        console.log(serviceList)
        const filterList = response.data.services
        .filter((service: Service) => !serviceList.find((item: any) => Number(item.id_service) === Number(service.id_service)));
        console.log(filterList.length)
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
        <div>
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
            <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" disabled={disabledSubmit()} autoFocus />
        </div>
    );

    const selectedService = (e: DropdownChangeEvent) => {
        setServiceSelected(e.value);
        methods.setValue('idService', Number(e.value.id_service));
    }

    return (
        <>
            <Button type="button" icon="pi pi-plus" outlined label="Add Service" onClick={openModal}
            />

            <Dialog header="Add service" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
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