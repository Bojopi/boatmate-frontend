import React, {useEffect, useRef, useState} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Auth } from '@/hooks/auth';
import { Profile } from '@/interfaces/interfaces';
import { Maps } from '@/hooks/maps';
import { Input } from '@/components/react-hook-form/input';
import { ToggleButton } from 'primereact/togglebutton';
import MapComponent from '@/components/map';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import LayoutPrincipal from '@/components/layoutPrincipal';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Users } from '@/hooks/user';
import { Button } from 'primereact/button';
import Link from 'next/link';
import SearchServiceComponent from '@/components/searchService';
import Image from 'next/image';

export type FormProps = {
    name: string;
    lastname: string
    email: string;
    password: string;
    lat: string;
    lng: string;
    phone: string;
    state: boolean;
    personImage: any;
}

const Profile = () => {

    const { getUserAuthenticated } = Auth();
    const {getAddress} = Maps();
    const {updateProfile} = Users();

    const [user, setUser] = useState<Profile>();

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [listNames, setListNames] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [imagePerson, setImagePerson] = useState<any>(null);

    const fileUploadPersonRef = useRef<any>(null);

    const toast = useRef<Toast>(null);

    const resetMap = async (lat: number, lng: number) => {
        const {data} = await getAddress(lat, lng);
        if(data.results.length > 0) {
            setSelectedPlace(data.results[0].formatted_address);
        }
    }

    const setDataUser = async () => {
        const response = await getUserAuthenticated();
        setUser(response.data);
        setChecked(response.data.state);
        setSelectedLocation({
            lat: Number(response.data.customerLat || 0),
            lng: Number(response.data.customerLng || 0),
        })
        resetMap(response.data.providerLat || 0, response.data.providerLng || 0);
        reset(response.data)
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setDataUser();
    }, []);

    const methods = useForm<FormProps>({
        defaultValues: {
            name: '',
            lastname: '',
            email: '',
            password: '',
            lat: '',
            lng: '',
            phone: '',
            state: true,
            personImage: '',
        },
    });

    const {
        handleSubmit,
        reset,
    } = methods;

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        formData.personImage = imagePerson;

        formData.lat = String(selectedLocation.lat);
        formData.lng = String(selectedLocation.lng);

        updateProfile(Number(user?.uid), formData, setLoading, toast, setDataUser, resetInputsForm);
        
        if(fileUploadPersonRef.current !== null) fileUploadPersonRef.current.clear();
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'There are errors in the form', life: 4000});
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

    const itemTemplatePerson = (file: any, props: any) => {
        setImagePerson(file);
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
        setButtonActive(false);
        setLoading(true);
        setInterval(() => {
            setLoading(false);
        }, 1500)
    }

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

  return (
    <div className='relative overflow-hidden'>
        <LayoutPrincipal>
            <Spinner loading={loading} />
            <Toast ref={toast} />
            <p className='w-full md:w-[60%] mx-auto font-semibold'>Profile</p>
            <div className="w-[500px] h-[500px] left-[80%] top-[500px] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
            <div className='w-[60%] mx-auto h-full flex gap-5 my-5'>
                <div className='w-80 h-96 bg-white rounded-xl border border-neutral-200 flex flex-col items-center gap-10 p-5'>
                    <div className='relative'>
                        {
                            user?.image != null ?
                            <img src={user.image} width={200} height={200} alt='profile' className='rounded-full' />
                            : <FontAwesomeIcon icon={faCircleUser} className='w-10 h-10' style={{color: "#c2c2c2"}} />
                        }
                        <Button icon={'pi pi-pencil'} rounded className='absolute bottom-4 right-0' />
                    </div>
                    <div className='w-full flex flex-col gap-2 text-center'>
                        <p className='font-normal text-xl text-black leading-7'>{toTitleCase(`${user?.name} ${user?.lastname}`)}</p>
                        <p className='text-neutral-600 text-base font-normal leading-normal'>{toTitleCase(`${user?.role}`)}</p>
                        <p className='text-sky-500 text-sm'>Change Password</p>
                    </div>
                </div>
                <div className='w-full h-full  overflow-y-auto mx-auto'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                            <div className='px-5'>
                                <div className='w-full grid grid-cols-12 mt-5 gap-2'>
                                    <div className='col-span-12 md:col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Name</p>
                                        </div>
                                        <Input type='text' id='name' name='name' readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-12 md:col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Lastname</p>
                                        </div>
                                        <Input type='text' id='lastname' name='lastname' readonly onClick={onClickInputs} />
                                    </div>
                                    {/* <div className='col-span-12 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-lock'></i>
                                            <p>Password</p>
                                        </div>
                                        <Input id='password' name='password' type='password' placeholder='******' readonly onClick={onClickInputs} />
                                    </div> */}
                                    <div className='col-span-12 md:col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-at'></i>
                                            <p>Email</p>
                                        </div>
                                        <Input id='email' name='email' type='email' placeholder='user@email.com' readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-12 md:col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-phone'></i>
                                            <p>Phone</p>
                                        </div>
                                        <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-12 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-map-marker'></i>
                                            <p>Address</p>
                                        </div>
                                        <MapComponent
                                            selectedLocation={selectedLocation}
                                            setSelectedLocation={setSelectedLocation}
                                            getAddress={getAddress}
                                            selectedPlace={selectedPlace}
                                            setSelectedPlace={setSelectedPlace} />
                                    </div>
                                    {/* <div className='col-span-12 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-image'></i>
                                            <p>Profile image</p>
                                        </div>
                                        <FileUpload
                                            ref={fileUploadPersonRef}
                                            id='personImage'
                                            name="personImage"
                                            onClear={() => setImagePerson(null)}
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            headerTemplate={headerTemplate}
                                            itemTemplate={itemTemplatePerson}
                                            chooseOptions={chooseOptions}
                                            cancelOptions={cancelOptions}
                                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                                    </div> */}
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
            {/* <div className='w-full md:w-[40%] m-auto'>
                <SearchServiceComponent></SearchServiceComponent>
            </div> */}
        </LayoutPrincipal>
    </div>
  )
}

export default Profile