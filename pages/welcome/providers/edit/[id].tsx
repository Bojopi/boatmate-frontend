import { Input } from '@/components/react-hook-form/input';
import React, { useRef, useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import MapComponent from '@/components/map';
import { Maps } from '@/hooks/maps';
import { Button } from 'primereact/button';
import { Textarea } from '@/components/react-hook-form/textarea';
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import LayoutAdmin from '@/components/layoutAdmin';
import { useRouter } from 'next/router';
import { Providers } from '@/hooks/providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Provider } from '@/interfaces/interfaces';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { ErrorMessage } from '@/components/react-hook-form/error-message';
import { BreadCrumb } from 'primereact/breadcrumb';
import { generateBreadcrumbItems } from '@/functions/breadcrumb';

export type FormProps = {
    lat:                    string;
    lng:                    string;
    providerName:           string;
    providerDescription:    string;
    phone:                  string;
    email:                  string;
    providerImage:          any;
}

const Edit = () => {
    const {getAddress} = Maps();
    const {show, updateProvider} = Providers();

    const [provider, setProvider] = useState<Provider | null>(null);

    const [imageBussines, setImageBussines] = useState<string>('');
    const [imageProvider, setImageProvider] = useState<any>(null);
    const [idProfile, setIdProfile] = useState<number>(0)

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [listNames, setListNames] = useState<string[]>([]);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const router = useRouter();

    const home = {icon: 'pi pi-home'}

    const breadcrumbItems = [
        ...generateBreadcrumbItems(router.asPath)
    ];

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

            setProvider(result.data.provider);
            setImageBussines(result.data.provider.provider_image);

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

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'You must fill in all fields', life: 4000});
    };


    const handleImageChange = (event: any) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImageBussines(URL.createObjectURL(selectedImage));
            setImageProvider(selectedImage);
            setButtonActive(true);
        }
    };

    const handleEditButtonClick = () => {
        const fileInput = document.getElementById('image-input');
        if (fileInput) {
            fileInput.click();
        }
    };

    const toTitleCase = (str: string) => {
        const string = str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');

        return string;
    }

    const onClickInputs = (e: any) => {
        setButtonActive(true);
        e.target.readOnly = false;
        if(listNames.length > 0) {
            if(!listNames.includes(e.target.name)) {
                listNames.push(e.target.name);
            }
        } else {
            listNames.push(e.target.name);
        }
    };

    const cancelEdit = () => {
        reset();
        resetAsyncForm(Number(router.query.id));
        setImageBussines(provider && provider.provider_image || '');
        setImageProvider(null);
        setButtonActive(false);
        setImageProvider(null);
        setSelectedPlace('');
        setSelectedLocation(null);
        setLoading(true);
        setInterval(() => {
            // router.push('/welcome/providers');
            setLoading(false);
        }, 1500)
    }

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
            <BreadCrumb model={breadcrumbItems} home={home} className='border-none' />
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Edit Provider</h1>
            <div className='w-full mx-auto h-full flex gap-5 mt-5'>
                <div className='w-80 h-72 bg-white rounded-xl border border-neutral-200 flex flex-col items-center gap-10 p-5'>
                    <div className='relative'>
                        {
                            imageBussines != null || imageBussines != '' ?
                            <img src={imageBussines} width={200} height={200} alt='profile' className='rounded-full' />
                            : <FontAwesomeIcon icon={faCircleUser} className='w-10 h-10' style={{color: "#c2c2c2"}} />
                        }
                        <input
                            type='file'
                            id='image-input'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <Button type='button' icon={'pi pi-pencil'} rounded className='absolute bottom-4 right-0' onClick={handleEditButtonClick} />
                    </div>
                    <div className='w-full flex flex-col gap-2 text-center'>
                        <p className='font-normal text-xl text-black leading-7'>{toTitleCase(`${provider && provider.provider_name}`)}</p>
                    </div>
                </div>
                <div className='w-full h-full  overflow-y-auto mx-auto'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                            <div className='bg-white rounded-xl border border-neutral-200 grid grid-cols-2 gap-5 p-5'>
                                <p className='col-span-2 leading-snug'>Business Information</p>
                                <InputWrapper outerClassName='col-span-2 md:col-span-1 py-2'>
                                    <p className='text-sm'>Bussiness Name</p>
                                    <Input 
                                    id='providerName' 
                                    name='providerName' 
                                    type='text' 
                                    placeholder='work day' 
                                    readonly 
                                    onClick={onClickInputs}
                                    rules={{required: 'Provider name is required'}} />
                                    {errors.providerName?.message && (
                                        <ErrorMessage>{errors.providerName.message}</ErrorMessage>
                                    )}
                                </InputWrapper>
                                <InputWrapper outerClassName='col-span-2 md:col-span-1 py-2'>
                                    <p className='text-sm'>Phone Number</p>
                                    <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly onClick={onClickInputs} />
                                    {errors.phone?.message && (
                                        <ErrorMessage>{errors.phone.message}</ErrorMessage>
                                    )}
                                </InputWrapper>
                                <InputWrapper outerClassName='col-span-2 py-2'>
                                    <p className='text-sm'>Email</p>
                                    <Input id='email' name='email' type='email' placeholder='user@email.com' readonly onClick={onClickInputs} />
                                    {errors.email?.message && (
                                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                                    )}
                                </InputWrapper>
                                <div className='col-span-2 py-2'>
                                    <p className='text-sm'>Business Description</p>
                                    <Textarea id='providerDescription' name='providerDescription' rows={3} readonly onClick={onClickInputs} />
                                </div>
                                <div className='col-span-2 py-2'>
                                    <p className='text-sm'>Address</p>
                                    <MapComponent
                                        selectedLocation={selectedLocation}
                                        setSelectedLocation={setSelectedLocation}
                                        getAddress={getAddress}
                                        selectedPlace={selectedPlace}
                                        setSelectedPlace={setSelectedPlace} />
                                </div>
                                {
                                    buttonActive && (
                                        <div className='col-span-2 flex flex-row items-center justify-end gap-3 my-5'>
                                            <Button type='button' label='Cancel' id='btnPersonal' outlined className='w-36 h-10 border-sky-500 text-sky-500 font-medium rounded-xl border-2' onClick={cancelEdit}></Button>
                                            <Button type='submit' label='Save' className='w-36 h-10 font-medium bg-sky-500 border-sky-500 rounded-xl shadow-lg shadow-sky-300 hover:bg-sky-600 hover:border-sky-600'></Button>
                                        </div>
                                    )
                                }
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Edit