import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from '../../../components/react-hook-form/input-wrapper';
import { Label } from "@/components/react-hook-form/label";
import { Input } from "@/components/react-hook-form/input";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { Services } from "@/hooks/services";
import { Textarea } from "@/components/react-hook-form/textarea";
import { MultiSelect } from 'primereact/multiselect';
import { Categories } from "@/hooks/categories";
import { ServiceCategory } from "@/interfaces/interfaces";

export type FormProps = {
    serviceName:        string;
    serviceDescription: string;
    categories:         any;
}

export type ServiceProps = {
    services: any;
    setServices: any;
    toast: any;
    setLoading: any;
    idService: number;
}

const Create: React.FC<ServiceProps> = ({idService = 0, services, setServices, setLoading, toast}) => {
    const { show, createService, updateService } = Services();
    const { getAllCategories } = Categories();

    const [categoryList, setCategoryList] = useState<ServiceCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any[]>([])

    const [visible, setVisible] = useState(false);

    const methods = useForm<FormProps>({
        defaultValues: {
            serviceName: '',
            serviceDescription: '',
            categories: [],
        }
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idService: number) => {
        const response = await show(idService);
        if(response.status === 200) {
            response.data.service.serviceName = response.data.service.service_name;
            response.data.service.serviceDescription = response.data.service.service_description;

            setSelectedCategory(response.data.service.service_categories.map((category: ServiceCategory) => category.category))

            reset(response.data.service);
        }
    }

    const getCategories = async () => {
        const response = await getAllCategories();
        if(response.status === 200) {
            setCategoryList(response.data.categories);
            setLoading(false);
        }
    }

    const onSubmit = (formData: FormProps) => {
        formData.categories = selectedCategory;
        setLoading(true);
        if(idService == 0) {
            createService(formData, services, setServices, setLoading, toast, setVisible);
        } else {
            updateService(idService, formData, services, setServices, setLoading, toast, setVisible);
        }
    };

    const onErrors = () => {};

    const openModal = async () => {
        reset();
        setSelectedCategory([]);
        getCategories();
        setVisible(true);
        if (idService != 0) {
            resetAsyncForm(Number(idService));
        }
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

    const panelFooterTemplate = () => {
        const length = selectedCategory.length;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    }

    return (
        <>
            {
                idService === 0 ?
                <Button type="button" label="Create Service"  className="p-button-success" outlined icon="pi pi-plus" onClick={openModal} />
                : 
                <Button type="button" icon="pi pi-pencil" text tooltip='Edit' tooltipOptions={{position: 'top'}} onClick={openModal}
                />
            }

            <Dialog header={idService === 0 ? "New Service" : "Edit Service"} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="serviceName">Service name</Label>
                            <Input 
                            id="serviceName"
                            name="serviceName"
                            type="text"
                            placeholder="Painting"
                            rules={{
                                required: 'Service name is required'
                            }}
                            />
                            {errors.serviceName?.message && (
                                <ErrorMessage>{errors.serviceName.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="serviceDescription">Service description</Label>
                            <Textarea 
                            id='serviceDescription'
                            name='serviceDescription'
                            placeholder="Description..."
                            rows={3}
                            rules={{
                                required: 'Description is required'
                            }}
                            />
                            {errors.serviceDescription?.message && (
                                <ErrorMessage>{errors.serviceDescription.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="categories">Service categories</Label>
                            <MultiSelect
                            value={selectedCategory}
                            options={categoryList}
                            onChange={(e) => setSelectedCategory(e.value)}
                            optionLabel="category_name"
                            placeholder="Select Categories"
                            filter
                            panelFooterTemplate={panelFooterTemplate}
                            className="w-full"
                            display="chip" />
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create