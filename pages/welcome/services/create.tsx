import React, { useState, useRef } from "react";
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
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";

export type FormProps = {
    serviceName:        string;
    serviceDescription: string;
    serviceImage:       string;
    categories:         any;
}

export type ServiceProps = {
    services: any;
    setServices: any;
    toast: any;
    loading: boolean;
    setLoading: any;
    idService: number;
}

const Create: React.FC<ServiceProps> = ({idService = 0, services, setServices, loading, setLoading, toast}) => {
    const { show, createService, updateService } = Services();
    const { getAllCategories } = Categories();

    const [categoryList, setCategoryList] = useState<ServiceCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any[]>([]);

    const [imageService, setImageService] = useState<any>(null);

    const [visible, setVisible] = useState(false);

    const fileUploadServiceRef = useRef<any>(null);

    const methods = useForm<FormProps>({
        defaultValues: {
            serviceName: '',
            serviceDescription: '',
            serviceImage: '',
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
            setLoading(false);
            setVisible(true);
        }
    }

    const getCategories = async () => {
        const response = await getAllCategories();
        if(response.status === 200) {
            setCategoryList(response.data.categories);
            setLoading(false);
            setVisible(true);
        }
    }

    const onSubmit = (formData: FormProps) => {
        formData.categories = selectedCategory;
        formData.serviceImage = imageService;
        setLoading(true);
        if(idService == 0) {
            createService(formData, services, setServices, setLoading, toast, setVisible);
        } else {
            updateService(idService, formData, services, setServices, setLoading, toast, setVisible);
        }
    };

    const onErrors = () => {};

    const openModal = async () => {
        setLoading(true);
        reset();
        setSelectedCategory([]);
        getCategories();
        if (idService != 0) {
            resetAsyncForm(Number(idService));
        }
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div className='w-full flex items-center justify-end'>
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
                    <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" autoFocus />
            }
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

    const headerTemplate = (options: any) => {
        const { className, chooseButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };

    const itemTemplateService = (file: any, props: any) => {
        setImageService(file);
        return (
            <div className="flex items-center flex-wrap">
                <div className="flex items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-col text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <>
            {
                idService === 0 ?
                <Button 
                type="button" 
                label="Add Service"
                className="px-5 py-2.5 bg-emerald-400 rounded-md border border-emerald-400 text-white text-sm"
                onClick={openModal} />
                : 
                <Button 
                type="button" 
                icon="pi pi-pencil" 
                tooltip='Edit' 
                outlined
                tooltipOptions={{position: 'top'}}
                className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn' 
                onClick={openModal}
                />
            }

            <Dialog header={idService === 0 ? "New Service" : "Edit Service"} visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="serviceName">Service name</Label>
                            <Input 
                            id="serviceName"
                            name="serviceName"
                            type="text"
                            placeholder="Service name"
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
                            className="w-full text-sm rounded-xl border-neutral-200"
                            display="chip" />
                        </InputWrapper>
                        <div className='col-span-12'>
                            <Label id="image">Service image</Label>
                            <FileUpload
                            ref={fileUploadServiceRef}
                            id='providerImage'
                            name="providerImage"
                            onClear={() => setImageService(null)}
                            accept="image/*"
                            headerTemplate={headerTemplate}
                            itemTemplate={itemTemplateService}
                            chooseOptions={chooseOptions}
                            cancelOptions={cancelOptions}
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                        </div>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create