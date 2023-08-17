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
import { GeneralUser } from '@/interfaces/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from 'primereact/breadcrumb';
import { generateBreadcrumbItems } from '@/functions/breadcrumb';

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

    const [userInfo, setUserInfo] = useState<GeneralUser | null>(null);

    const [imageBussines, setImageBussines] = useState<string | any>(null);
    const [imagePerson, setImagePerson] = useState<any>(null);
    const [imageProvider, setImageProvider] = useState<any>(null);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [listNames, setListNames] = useState<string[]>([]);

    const [hiddenBread, setHiddenBread] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const fileUploadProviderRef = useRef<any>(null);
    const toast = useRef<Toast>(null);

    const router = useRouter();

    const roles = [
        {name: 'Provider', code: '3'},
        {name: 'Customer', code: '4'}
    ]

    const home = {icon: 'pi pi-home'}

    const breadcrumbItems = [
        ...generateBreadcrumbItems(router.asPath)
    ];

    useEffect(() => {
        if(router.query.id) {
            resetAsyncForm(Number(router.query.id))
        } else {
            setHiddenBread(false);
        }
    }, [router.query.id]);

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

            setUserInfo(result.data.user);

            if(result.data.user.role_description == 'PROVIDER') {
                setImageBussines(result.data.user.provider_image || '');
            } else if(result.data.user.role_description == 'CUSTOMER') {
                setImageBussines(result.data.user.person_image || '');
            }

            reset(result.data.user);
            const roleSelect = roles.filter((item) => item.code == String(result.data.user.id_role));
            setRole(roleSelect[0]);
            setSelectedLocation({lat: Number(result.data.user.lat), lng: Number(result.data.user.lng)})
            setHiddenBread(false);
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

    const handleImageChange = (event: any) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImageBussines(URL.createObjectURL(selectedImage));
            if(userInfo && userInfo.role_description == 'PROVIDER') {
                setImageProvider(selectedImage);
            } else {
                setImagePerson(selectedImage);
            }
            setButtonActive(true);
        }
    };

    const handleEditButtonClick = () => {
        const fileInput = document.getElementById('image-input');
        if (fileInput) {
            fileInput.click();
        }
    };

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

    const resetInputsForm = () => {
        listNames.map((item: string) => {
            document.getElementById(item)?.setAttribute('readOnly', 'true');
        });
        setListNames([]);
        setButtonActive(false);
    }

    const cancelEdit = () => {
        reset();
        resetInputsForm();
        if(userInfo && userInfo.role_description == 'PROVIDER') {
            setImageBussines(userInfo.provider_image || '');
        } else if(userInfo && userInfo.role_description == 'CUSTOMER') {
            setImageBussines(userInfo.person_image || '');
        } else {
            setImageBussines(null);
        }
        setImagePerson(null);
        setImageProvider(null);
        setButtonActive(false);
        setLoading(true);
        setInterval(() => {
            setLoading(false);
        }, 1500)
    }

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <FormProvider {...methods}>
        <div className='w-full p-5'>
            <BreadCrumb model={breadcrumbItems} home={home} hidden={hiddenBread} className='border-none' />
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>{router.query.id ? 'Edit User' : 'Create User'}</h1>
            <div className='w-full mx-auto h-full flex gap-5 my-5'>
                {
                    userInfo ?
                    <div className='w-80 h-80 bg-white rounded-xl border border-neutral-200 flex flex-col items-center gap-10 p-5'>
                        <div className='relative'>
                            {
                                imageBussines == null || imageBussines == '' ?
                                <FontAwesomeIcon icon={faCircleUser} className='w-32 h-32' style={{color: "#c2c2c2"}} />
                                : 
                                <img src={imageBussines} width={200} height={200} alt='profile' className='rounded-full' />
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
                            <p className='font-normal text-xl text-black leading-7'>{toTitleCase(userInfo ? `${userInfo.person_name} ${userInfo && userInfo.lastname}` : 'No name')}</p>
                            <p className='text-neutral-600 text-base font-normal leading-normal'>{toTitleCase(userInfo ? `${userInfo.role_description}` : 'No role')}</p>
                            {/* <p className='text-sky-500 text-sm'>Change Password</p> */}
                        </div>
                    </div>
                    : null
                }
                <div className='w-full h-full  overflow-y-auto mx-auto pb-5'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                            <div className='px-5'>
                                <div className='w-full grid grid-cols-12 mt-5 gap-2'>
                                    <InputWrapper outerClassName='col-span-12 md:col-span-6 py-2'>
                                        <p>First Name</p>
                                        <Input 
                                        type='text' 
                                        id='personName' 
                                        name='personName' 
                                        placeholder='First Name'
                                        readonly 
                                        onClick={onClickInputs} />
                                        {errors.personName?.message && (
                                            <ErrorMessage>{errors.personName.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <InputWrapper outerClassName='col-span-12 md:col-span-6 py-2'>
                                        <p>Lastname</p>
                                        <Input 
                                        type='text' 
                                        id='lastname' 
                                        name='lastname' 
                                        placeholder='Lastname'
                                        readonly 
                                        onClick={onClickInputs} />
                                        {errors.lastname?.message && (
                                            <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    {
                                        !userInfo ?
                                        <InputWrapper outerClassName='col-span-12 py-2'>
                                            <p>Password</p>
                                            <Input 
                                            type='password' 
                                            id='password' 
                                            name='password' 
                                            placeholder='******'
                                            readonly 
                                            onClick={onClickInputs} />
                                            {errors.lastname?.message && (
                                                <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                                            )}
                                        </InputWrapper>
                                        : null
                                    }
                                    {/* <div className='col-span-12 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-lock'></i>
                                            <p>Password</p>
                                        </div>
                                        <Input id='password' name='password' type='password' placeholder='******' readonly onClick={onClickInputs} />
                                    </div> */}
                                    <InputWrapper outerClassName='col-span-12 md:col-span-6 py-2'>
                                        <p>Email</p>
                                        <Input 
                                        id='email' 
                                        name='email' 
                                        type='email' 
                                        placeholder='user@email.com' 
                                        readonly onClick={onClickInputs} />
                                        {errors.email?.message && (
                                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <InputWrapper outerClassName='col-span-12 md:col-span-6 py-2'>
                                        <p>Phone Number</p>
                                        <Input 
                                        type='tel' 
                                        id='phone' 
                                        name='phone' 
                                        placeholder="(999) 999-9999" 
                                        readonly 
                                        onClick={onClickInputs} />
                                        {errors.phone?.message && (
                                            <ErrorMessage>{errors.phone.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <InputWrapper outerClassName='col-span-12 py-2'>
                                        <p>Address</p>
                                        <MapComponent
                                            selectedLocation={selectedLocation}
                                            setSelectedLocation={setSelectedLocation}
                                            getAddress={getAddress}
                                            selectedPlace={selectedPlace}
                                            setSelectedPlace={setSelectedPlace} />
                                    </InputWrapper>
                                    <InputWrapper outerClassName='col-span-12'>
                                        <p id='roleId'>Role</p>
                                        <Dropdown
                                        value={role}
                                        options={roles}
                                        optionLabel='name'
                                        placeholder='Select a role'
                                        showClear
                                        className='w-full text-sm rounded-xl border-neutral-200'
                                        onChange={(e) => {setRole(e.target.value)}}
                                        />
                                    </InputWrapper>

                                    {
                                        role?.code === '3' ?
                                        <>
                                            <InputWrapper outerClassName='col-span-12'>
                                                <p id='providerName'>Business Name</p>
                                                <Input 
                                                type='text' 
                                                id='providerName' 
                                                name='providerName'
                                                placeholder='Business Name'
                                                onClick={onClickInputs}  />
                                                {errors.providerName?.message && (
                                                    <ErrorMessage>{errors.providerName.message}</ErrorMessage>
                                                    )}
                                            </InputWrapper>

                                            <InputWrapper outerClassName='col-span-12'>
                                                <p id='providerDescription'>Description</p>
                                                <Textarea
                                                id='providerDescription'
                                                name='providerDescription'
                                                placeholder='Add a description of your business'
                                                onClick={onClickInputs}
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
                                </div>
                                {
                                    buttonActive && (
                                        <div className='flex flex-row items-center justify-end gap-3 my-5'>
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
            {/* <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-12 p-5 gap-3'>
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
            </form> */}
        </FormProvider>
    </LayoutAdmin>
  )
}

export default Create