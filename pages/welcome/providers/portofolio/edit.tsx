import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { Portofolios } from "@/hooks/portofolio";
import { Textarea } from "@/components/react-hook-form/textarea";

export type FormProps = {
    description: string;
}

export type PortofolioProps = {
    idPortofolio: number;
    toast: any;
    setLoading: any;
    portofolio: any,
    setPortofolio: any
}

const Edit: React.FC<PortofolioProps> = ({idPortofolio, toast, setLoading, portofolio, setPortofolio}) => {
    const {updatePortofolio, show} = Portofolios();

    const [visible, setVisible] = useState(false);

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
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        updatePortofolio(idPortofolio, formData, toast, setLoading, portofolio, setPortofolio);
        setVisible(false);
    };

    const onErrors = () => {};

    const openModal = async () => {
        setVisible(true);
        resetAsyncForm(idPortofolio);
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div>
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
            <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" autoFocus />
        </div>
    );

    return (
        <>
            <Button type="button" icon="pi pi-pencil" text tooltip='Edit' tooltipOptions={{position: 'top'}} onClick={openModal}
            />

            <Dialog header="Update Portofolio" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
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