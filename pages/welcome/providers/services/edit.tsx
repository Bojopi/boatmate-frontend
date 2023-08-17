import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { Textarea } from "@/components/react-hook-form/textarea";
import { Providers } from "@/hooks/providers";

export type FormProps = {
    description: string;
}

export type RoleProps = {
    serviceList: any;
    setServiceList: any;
    toast: any;
    loading: any;
    setLoading: any;
    idProvider: number;
    idService: number;
}

const Edit: React.FC<RoleProps> = ({idProvider, idService, serviceList, setServiceList, loading, setLoading, toast}) => {
    const {showServiceProvider, updateServiceProvider} = Providers();

    const [visible, setVisible] = useState(false);

    const [serviceName, setServiceName] = useState<string>('');

    const methods = useForm<FormProps>({
        defaultValues: {
            description: ''
        }
    });

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idProvider: number, idService: number) => {
        const response = await showServiceProvider(idProvider, idService);
        if(response.status === 200) {
            response.data.service.description = response.data.service.service_provider_description;
            setServiceName(response.data.service.service_name);

            reset(response.data.service)

            setVisible(true);
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        updateServiceProvider(idProvider, idService, formData, toast, setLoading, setVisible, serviceList, setServiceList);
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'Description is required', life: 4000});
    };

    const openModal = async () => {
        resetAsyncForm(idProvider, idService);
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div className='w-full flex items-center justify-end gap-3'>
            <Button type="button" label="Cancel" icon="pi pi-times" severity="danger" disabled={loading} onClick={closeModal} className="p-button-text" />
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
                    <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" autoFocus />
            }
        </div>
    );

    return (
        <>
            <Button 
            type="button" 
            icon='pi pi-pencil' 
            outlined 
            tooltip="Edit"
            tooltipOptions={{position: 'top'}}
            className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn' 
            onClick={openModal} />

            <Dialog header={`Edit ${serviceName}`} visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="description">Service description</Label>
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

export default Edit