import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from "@/components/react-hook-form/label";
import { Input } from "@/components/react-hook-form/input";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { Contracts } from "@/hooks/contracts";
import { NumericInput } from "@/components/react-hook-form/numeric-input";
import { Textarea } from "@/components/react-hook-form/textarea";

export type FormProps = {
    date: any;
    contractDescription: string;
    // price: number;
    idServiceProvider: number;
}

export type RequestProps = {
    idCustomer: number;
    idServiceProvider: number;
    toast: any;
}

const Create: React.FC<RequestProps> = ({idCustomer, idServiceProvider, toast}) => {
    const {createContract} = Contracts();

    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);

    const methods = useForm<FormProps>({
        defaultValues: {
            date: '',
            contractDescription:'',
            // price : 0.00,
            idServiceProvider: 0
        }
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;


    const onSubmit = (formData: FormProps) => {
        setLoading(true);
        formData.date = (new Date()).toISOString();
        formData.idServiceProvider = idServiceProvider
        createContract(idCustomer, formData, setLoading, toast, setVisible);
    };

    const onErrors = () => {};

    const openModal = async () => {
        reset();
        setVisible(true);
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div className="w-full flex items-center justify-end gap-3">
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
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
            <Button type="button" label='Request a quote' disabled={idCustomer == 0} onClick={openModal} className='w-full bg-sky-500 border-sky-500 shadow-2xl shadow-sky-300 hover:bg-sky-600 hover:border-sky-600 rounded-xl' />
            {/* <Button type="button" label="Request a quote" disabled={idCustomer == 0} outlined icon="pi pi-tag" onClick={openModal} /> */}

            <Dialog header="New Request" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        {/* <InputWrapper outerClassName="col-span-12">
                            <div className="w-[50%] m-auto flex flex-row items-start">
                                <div className="w-[20%] flex justify-end">
                                    <i className="pi pi-dollar font-bold"></i>
                                </div>
                                <NumericInput
                                    id="price"
                                    name="price"
                                    placeholder="0.00"
                                    width="w-[60%]"
                                    rules={{
                                        required: 'Price is required'
                                    }}
                                />
                                <p className="w-[20%] font-bold">USD</p>
                            </div>
                            {errors.price?.message && (
                                <ErrorMessage>{errors.price.message}</ErrorMessage>
                            )}
                        </InputWrapper> */}
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="contractDescription">Request description</Label>
                            <Textarea 
                            id='contractDescription' 
                            name='contractDescription' 
                            rows={2} 
                            placeholder="Add your description here..."/>
                            {errors.contractDescription?.message && (
                                <ErrorMessage>{errors.contractDescription.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create