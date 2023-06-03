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

            reset(response.data.service)
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
        setVisible(true);
        resetAsyncForm(idProvider, idService);
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div>
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
            <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" disabled={loading} autoFocus />
        </div>
    );

    return (
        <>
            <Button type="button" icon="pi pi-pencil" className="p-button-success" text tooltip='Edit' onClick={openModal}
            />

            <Dialog header="Edit Service" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
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