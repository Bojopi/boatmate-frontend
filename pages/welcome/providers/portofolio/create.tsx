import React, { useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Textarea } from "@/components/react-hook-form/textarea";
import { Portofolios } from "@/hooks/portofolio";
import { useRouter } from "next/router";

export type FormProps = {
    portofolioDescription: string;
    images: any;
    count: number;
}

export type PortofolioProps = {
    portofolio: any;
    setPortofolio: any;
    toast: any;
    loading: boolean;
    setLoading: any;
    idProvider: number;
}

const Create: React.FC<PortofolioProps> = ({portofolio, setPortofolio, loading, setLoading, toast, idProvider}) => {
    const {postImagesPortofolio} = Portofolios();

    const [visible, setVisible] = useState(false);

    const [imagesList, setImagesList] = useState<any[]>([]);

    const fileUploadProviderRef = useRef<any>(null);

    const router = useRouter();

    const methods = useForm<FormProps>({
        defaultValues: {
            portofolioDescription: '',
            images: null
        }
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const onSubmit = (formData: FormProps) => {
        formData.images = imagesList;
        formData.count = imagesList.length;

        setLoading(true)
        postImagesPortofolio(idProvider, formData, toast, setLoading, portofolio, setPortofolio);
        setVisible(false);
        reset();
        setImagesList([]);
    };

    const onErrors = () => {};

    const openModal = async () => {
        setVisible(true);
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

    const headerTemplate = (options: any) => {
        const { className, chooseButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };

    const onTemplateSelect = (e: any) => {
        let files = e.files;
        Object.keys(files).forEach((key) => {
            imagesList.push(files[key])
        });
    };

    const itemTemplateProvider = (file: any, props: any) => {
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
                router.pathname == '/welcome' ?
                <Button 
                type="button"
                outlined
                icon={'pi pi-plus'}
                severity="secondary" 
                className="w-8 h-8 rounded-lg"
                onClick={openModal} />
                :
                <Button 
                type="button" 
                label="Update Files" 
                onClick={openModal}
                className="px-5 py-2.5 bg-emerald-400 rounded-md border border-emerald-400 text-white text-sm" />
            }

            <Dialog header="New Portofolio" visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="portofolioDescription">Portofolio description</Label>
                            <Textarea
                            id='portofolioDescription'
                            name='portofolioDescription'
                            placeholder='Add a description of your photos'
                            />
                            {errors.portofolioDescription?.message && (
                                <ErrorMessage>{errors.portofolioDescription.message}</ErrorMessage>
                            )}
                        </InputWrapper>

                        <div className='col-span-12'>
                            <div className='font-medium flex flex-row items-center gap-2'>
                                <i className='pi pi-image'></i>
                                <p>Portofolio Images</p>
                            </div>
                            <FileUpload
                            multiple 
                            ref={fileUploadProviderRef}
                            id='providerImage'
                            name="providerImage"
                            onSelect={onTemplateSelect}
                            onClear={() => setImagesList([])}
                            accept="image/*"
                            maxFileSize={1000000}
                            headerTemplate={headerTemplate}
                            itemTemplate={itemTemplateProvider}
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