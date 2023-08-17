import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { Portofolios } from "@/hooks/portofolio";
import { Textarea } from "@/components/react-hook-form/textarea";
import { useRouter } from "next/router";

export type FormProps = {
    description: string;
}

export type PortofolioProps = {
    idPortofolio: number;
    toast: any;
    loading: boolean;
    setLoading: any;
    portofolio: any,
    setPortofolio: any
}

const Edit: React.FC<PortofolioProps> = ({idPortofolio, toast, loading, setLoading, portofolio, setPortofolio}) => {
    const {updatePortofolio, show} = Portofolios();

    const [visible, setVisible] = useState(false);

    const router = useRouter();

    const methods = useForm<FormProps>({
        defaultValues: {
            description: ''
        }
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idPortofolio: number) => {
        const response = await show(idPortofolio);
        if(response.status === 200) {
            methods.setValue('description', response.data.portofolio.portofolio_description);
            setVisible(true);
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        updatePortofolio(idPortofolio, formData, toast, setLoading, portofolio, setPortofolio);
        setVisible(false);
    };

    const onErrors = () => {};

    const openModal = async () => {
        resetAsyncForm(idPortofolio);
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div className='w-full flex items-center justify-end gap-3'>
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} disabled={loading} severity="danger" className="p-button-text" />
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
            {
                router.pathname == '/welcome' ?
                <Button type="button" icon="pi pi-pencil" text className="text-white" onClick={openModal}
                />
                :
                <Button 
                type="button" 
                icon="pi pi-pencil" 
                outlined 
                tooltip='Edit' 
                tooltipOptions={{position: 'top'}} 
                onClick={openModal}
                className="w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn"
                />
            }

            <Dialog header="Edit Description" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="description">Description</Label>
                            <Textarea 
                            id="description"
                            name="description"
                            placeholder="Add description ..."
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