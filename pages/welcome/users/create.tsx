import { ErrorMessage } from '@/components/react-hook-form/error-message';
import { Input } from '@/components/react-hook-form/input';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from '@/components/react-hook-form/label';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import React, { useRef, useState, useEffect } from 'react'
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

export type FormProps = {
    email:                  string;
    password:               string;
    roleId:                 string;
    personName:             string;
    lastname:               string;
    phone:                  string;
    lat:                    string;
    lng:                    string;
    providerName:           string;
    providerDescription:    string;
    personImage:            any;
    providerImage:          any
}

export type UserInfo = {
    users: any;
    setUsers: any;
}

const Create: React.FC<UserInfo> = ({users, setUsers}) => {
    const {getAddress} = Maps();
    const {createNewUser, show, updateUser} = Users();

    const [role, setRole] = useState<any>(null);

    const [imagePerson, setImagePerson] = useState<any>(null);
    const [imageProvider, setImageProvider] = useState<any>(null);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const fileUploadProviderRef = useRef<any>(null);
    const toast = useRef<Toast>(null);

    const router = useRouter();

    const roles = [
        {name: 'Provider', code: '3'},
        {name: 'Customer', code: '4'}
    ]

    useEffect(() => {
        if(router.query.id) {
            resetAsyncForm(Number(router.query.id))
        }
    }, [router.query.id]);

    const methods = useForm<FormProps>({
        defaultValues: {
            email: '',
            password: '',
            roleId: '',
            personName: '',
            lastname: '',
            phone: '',
            lat: '',
            lng: '',
            providerName: '',
            providerDescription: '',
            personImage: null,
            providerImage: null
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
            result.data.user.personName = result.data.user.person_name;
            result.data.user.personImage = result.data.user.person_image;
            result.data.user.lat = result.data.user.provider_lat || result.data.user.customer_lat;
            result.data.user.lng = result.data.user.provider_lng || result.data.user.customer_lng;
            result.data.user.providerName = result.data.user.provider_name || '';
            result.data.user.providerDescription = result.data.user.provider_description || '';
            result.data.user.providerImage = result.data.user.provider_image || '';

            reset(result.data.user);
            const roleSelect = roles.filter((item) => item.code == String(result.data.user.roleId));
            setRole(roleSelect[0]);
            setSelectedLocation({lat: Number(result.data.user.lat), lng: Number(result.data.user.lng)})
        }
    };

    const onSubmit = (data: FormProps) => {
        setLoading(true);

        data.lat = selectedLocation ? selectedLocation.lat : null;
        data.lat = selectedLocation ? selectedLocation.lat : null;

        data.roleId = role ? role.code : null;

        data.personImage = imagePerson;
        data.providerImage = imageProvider;

        if(!router.query.id) {
            createNewUser(data, users, setUsers, setLoading, toast);
        } else {
            updateUser(Number(router.query.id), data, setLoading, toast)
        }
    };

    const onClear = () => {
        reset();
        setImagePerson(null);
        setImageProvider(null);
        setRole(null);
        setSelectedPlace('');
        setSelectedLocation(null);

        router.push('/welcome/users');
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
            <h2 className='w-full text-lg font-medium border-b-2 p-5 shadow-sm'>{router.query.id ? 'Edit User' : 'Create User'}</h2>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-12 p-5 gap-3'>
                <div className='col-span-4 md:col-span-2'>
                    <Label id='perImage'>Profile Image</Label>
                    <div className='relative h-20'>
                        <div className='absolute top-0 left-0 bg-gray-300 hover:bg-none rounded-full w-20 h-20 flex justify-center items-center'>
                            {
                                methods.getValues('personImage') != '' ?
                                <Avatar image={methods.getValues('personImage')} shape='circle' className='w-full h-full' />
                                : <i className='pi pi-user text-3xl text-gray-500'></i>
                            }
                        </div>
                        <Tooltip target={'.image-new'}/>
                        <div
                        className='image-new absolute top-0 left-0 bg-none text-transparent hover:text-gray-50 hover:bg-gray-500/50 rounded-full w-20 h-20 flex justify-center items-center p-2 cursor-pointer'
                        data-pr-tooltip="Upload new image"
                        data-pr-position="right"
                        >
                            <div className='relative w-full h-full'>
                                <input
                                type="file"
                                name="personImage"
                                id="personImage"
                                onChange={(e) => {
                                    console.log(e)
                                    setImagePerson(e.target.files![0])
                                }}
                                className='absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer'
                                />
                                <span className='absolute inset-0 flex items-center justify-center'>
                                    <i className='image-new pi pi-image text-3xl'></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    { imagePerson != null ?
                        <p className='max-w-full overflow-hidden text-ellipsis whitespace-nowrap'>{imagePerson.name}</p>
                        : null
                    }
                </div>
                <InputWrapper outerClassName='col-span-8 md:col-span-5'>
                    <Label id='personName'>Name</Label>
                    <Input type='text' id='personName' name='personName' placeholder='Alice' />
                    {errors.personName?.message && (
                        <ErrorMessage>{errors.personName.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-5'>
                    <Label id='lastname'>Lastname</Label>
                    <Input type='text' id='lastname' name='lastname' placeholder='Scooter' />
                    {errors.lastname?.message && (
                        <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='email'>Email</Label>
                    <Input type='email' id='email' name='email' placeholder='tugrp@example.com' />
                    {errors.email?.message && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='password'>Password</Label>
                    <Input type='password' id='password' name='password' placeholder='********' />
                    {errors.password?.message && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12'>
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

                <InputWrapper outerClassName='col-span-12'>
                    <Label id='roleId'>Role</Label>
                    <Dropdown
                    value={role}
                    options={roles}
                    optionLabel='name'
                    placeholder='Select a role'
                    showClear
                    className='w-full'
                    onChange={(e) => {setRole(e.target.value)}}
                    />
                </InputWrapper>

                {
                    role?.code === '3' ?
                    <>
                        <InputWrapper outerClassName='col-span-12'>
                            <Label id='providerName'>Business Name</Label>
                            <Input type='text' id='providerName' name='providerName'  />
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
                    </>
                    : null
                }

                <div className='col-span-12 flex justify-between items-center p-2'>
                    <Button type='reset' label='Cancel' icon='pi pi-times' className='p-button-text' onClick={onClear} />
                    <Button type='submit' label='Save' icon='pi pi-check' className='p-button-success p-mr-2' />
                </div>
            </form>
        </FormProvider>
    </LayoutAdmin>
  )
}

export default Create