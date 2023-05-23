import { ErrorMessage } from '@/components/react-hook-form/error-message';
import { Input } from '@/components/react-hook-form/input';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from '@/components/react-hook-form/label';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import MapComponent from '@/components/map';
import { Maps } from '@/hooks/maps';
import { Button } from 'primereact/button';
import { Textarea } from '@/components/react-hook-form/textarea';
import { Users } from '@/hooks/user';
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import LayoutAdmin from '@/components/layoutAdmin';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { Providers } from '@/hooks/providers';

export type FormProps = {
    lat:                    string;
    lng:                    string;
    providerName:           string;
    providerDescription:    string;
    phone:                  string;
    email:                  string;
    providerImage:          any;
}

export type UserInfo = {
    providers: any;
    setProviders: any;
}

const Edit: React.FC<UserInfo> = ({providers, setProviders}) => {
    const {getAddress} = Maps();
    const {show, updateProvider} = Providers();


    const [imageProvider, setImageProvider] = useState<any>(null);
    const [idProfile, setIdProfile] = useState<number>(0)

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const fileUploadProviderRef = useRef<any>(null);
    const toast = useRef<Toast>(null);

    const router = useRouter();

    useEffect(() => {
        if(router.query.id) {
            resetAsyncForm(Number(router.query.id))
        }
    }, [router.query.id]);

    const methods = useForm<FormProps>({
        defaultValues: {
            lat: '',
            lng: '',
            providerName: '',
            providerDescription: '',
            providerImage: null,
            phone: '',
            email: '',
        }
    })

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (id: number) => {
        const result = await show(id);
        if(result.data) {
            result.data.provider.lat = result.data.provider.provider_lat;
            result.data.provider.lng = result.data.provider.provider_lng;
            result.data.provider.providerName = result.data.provider.provider_name || '';
            result.data.provider.providerDescription = result.data.provider.provider_description || '';
            result.data.provider.providerImage = result.data.provider.provider_image || '';

            reset(result.data.provider);
            setIdProfile(result.data.provider.id_profile);
            setSelectedLocation({lat: Number(result.data.provider.lat), lng: Number(result.data.provider.lng)})
        }
    };

    const onSubmit = (data: FormProps) => {
        setLoading(true);

        data.lat = selectedLocation ? selectedLocation.lat : null;
        data.lat = selectedLocation ? selectedLocation.lat : null;
        
        data.providerImage = imageProvider || '';

        updateProvider(Number(router.query.id), data, toast, setLoading)
    };

    const onClear = () => {
        reset();
        setImageProvider(null);
        setSelectedPlace('');
        setSelectedLocation(null);

        router.push('/welcome/providers');
    }

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'You must fill in all fields', life: 4000});
    };

    const headerTemplate = (options: any) => {
        const { className, chooseButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };

    const itemTemplateProvider = (file: any, props: any) => {
        setImageProvider(file);
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
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <FormProvider {...methods}>
            <h2 className='text-lg font-medium p-5 border-b-2 shadow-sm'>Edit Provider</h2>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                <InputWrapper outerClassName='col-span-12'>
                    <Label id='providerName'>Name Business</Label>
                    <Input type='text' id='providerName' name='providerName' placeholder='Alice Company' />
                    {errors.providerName?.message && (
                        <ErrorMessage>{errors.providerName.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12'>
                    <Label id='providerDescription'>Description</Label>
                    <Textarea
                    id='providerDescription'
                    name='providerDescription'
                    placeholder='Add a description of your business'
                    />
                </InputWrapper>

                <InputWrapper outerClassName='col-span-6'>
                    <Label id='email'>Email</Label>
                    <Input type='email' id='email' name='email' placeholder='tugrp@example.com' />
                    {errors.email?.message && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-6'>
                    <Label id='phone'>Phone</Label>
                    <Input type='text' id='phone' name='phone' placeholder='+34 6 1234567' />
                    {errors.phone?.message && (
                        <ErrorMessage>{errors.phone.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12'>
                    <Label id='address'>Address</Label>
                    <MapComponent
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    getAddress={getAddress}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace} />
                </InputWrapper>
                <div className='col-span-12'>
                    <div className='font-medium flex flex-row items-center gap-2'>
                        <i className='pi pi-image'></i>
                        <p>Bussiness image</p>
                    </div>
                    <FileUpload
                    ref={fileUploadProviderRef}
                    id='providerImage'
                    name="providerImage"
                    onClear={() => setImageProvider(null)}
                    accept="image/*"
                    maxFileSize={1000000}
                    headerTemplate={headerTemplate}
                    itemTemplate={itemTemplateProvider}
                    chooseOptions={chooseOptions}
                    cancelOptions={cancelOptions}
                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                </div>

                <div className='col-span-12 flex justify-between items-center p-2'>
                    <Button type='reset' label='Cancel' icon='pi pi-times' className='p-button-text' onClick={onClear} />
                    <Button type='submit' label='Save' icon='pi pi-check' className='p-button-success p-mr-2' />
                </div>
            </form>
        </FormProvider>
    </LayoutAdmin>
  )
}

export default Edit