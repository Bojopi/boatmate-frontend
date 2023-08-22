import { Auth } from '@/hooks/auth'
import { Portofolio, Profile, Service } from '@/interfaces/interfaces'
import React, { useEffect, useState, useRef } from 'react'
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faMountainSun } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'primereact/button'
import { FormProvider, useForm } from 'react-hook-form';
import { Maps } from '@/hooks/maps';
import { Users } from '@/hooks/user';
import { Input } from '@/components/react-hook-form/input';
import MapComponent from '@/components/map';
import { Portofolios } from '@/hooks/portofolio';
import { Providers } from '@/hooks/providers';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Galleria } from 'primereact/galleria';
import { Textarea } from '@/components/react-hook-form/textarea';
import { FileUpload } from 'primereact/fileupload';
import Link from 'next/link';
import Create from '../providers/portofolio/create';
import Edit from '../providers/portofolio/edit';
import CreateMethodPayment from '../payments/create';
import LayoutAdmin from '@/components/layoutAdmin';
import { MultiSelect } from 'primereact/multiselect';
import { Services } from '@/hooks/services';

export type FormProps = {
    name: string;
    lastname: string
    providerName: string;
    providerImage: any;
    email: string;
    password: string;
    lat: string;
    lng: string;
    phone: string;
    state: boolean;
    personImage: any;
    providerDescription: string;
    zip?: string;
}

const Index = () => {
    const {getUserAuthenticated} = Auth();
    const {updateProfile} = Users();
    const {getAddress} = Maps();
    const {getPortofolioProvider, deleteImagePortofolio} = Portofolios();
    const {uploadLicense, getLicenses, getServicesProvider, updateServices} = Providers();
    const { getAllServices } = Services();

    const [user, setUser] = useState<Profile>(
        {
            uid:                 0,
            email:               '',
            state:               false,
            google:               false,
            idPerson:            0,
            name:                '',
            lastname:            '',
            phone:               '',
            image:               '',
            idRole:              0,
            role:                '',
            idProvider:          0,
            providerName:        '',
            providerImage:       '',
            providerDescription: '',
            providerLat:         '',
            providerLng:         '',
            idCustomer:          '',
            customerLat:         '',
            customerLng:         '',
            iat:                 0,
            exp:                 0,
        }
    );

    const [imageBussines, setImageBussines] = useState<string>('');
    const [imagePerson, setImagePerson] = useState<any>(null);
    const [imageProvider, setImageProvider] = useState<any>(null);
    // const [providerLicense, setProviderLicense] = useState<any[]>([]);

    const [licenseList, setLicenseList] = useState<any[]>([]);
    const [buttonLicense, setButtonLicense] = useState<boolean>(true);

    const [portofolioList, setPortofolioList] = useState<Portofolio[]>([]);
    const [portofolioIndex, setPortofolioIndex] = useState<number>(0);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [zip, setZip] = useState<any>(null);

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [listNames, setListNames] = useState<string[]>([]);

    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);

    const fileUploadPersonRef = useRef<any>(null);
    const fileUploadProviderRef = useRef<any>(null);
    const fileUploadProviderLicense = useRef<any>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const galleria = useRef<any>(null);

    const methods = useForm<FormProps>({
        defaultValues: {
            name: '',
            lastname: '',
            providerName: '',
            providerImage: '',
            email: '',
            password: '',
            lat: '',
            lng: '',
            phone: '',
            state: true,
            personImage: '',
            providerDescription: ''
        },
    });

    const {
        handleSubmit,
        reset,
    } = methods;

    const resetMap = async (lat: number, lng: number) => {
        const {data} = await getAddress(lat, lng);
        if(data.results.length > 0) {
            setSelectedPlace(data.results[0].formatted_address);
        }
    }

    const setDataUser = async () => {
        try {
            const response = await getUserAuthenticated();
            setUser(response.data.user);
            const serviceList = await getAllServices();
            if(serviceList.status == 200) {
                setServices(serviceList.data.services);
            }

            if(response.data.user.role === 'PROVIDER') {
                setImageBussines(response.data.user.providerImage);
                getPortofolio(response.data.user.idProvider);
                getLicense(response.data.user.idProvider);
                setSelectedLocation({
                    lat: Number(response.data.user.providerLat || 0),
                    lng: Number(response.data.user.providerLng || 0),
                })
                resetMap(response.data.user.providerLat || 0, response.data.user.providerLng || 0);
                const servicesProvider = await getServicesProvider(response.data.user.idProvider);
                if(servicesProvider.status == 200 && servicesProvider.data.services.length > 0) {
                    const filter = servicesProvider.data.services.map((serviceItem: any) => serviceItem.service)
                    setSelectedServices(filter);
                }
            } else {
                setImageBussines(response.data.user.image);
            }
            reset(response.data.user)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const getLicense = async (idProvider: number) => {
        try {
            const response = await getLicenses(idProvider);
            if(response.status == 200) {
                setLicenseList(response.data.licenses);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPortofolio = async (idProvider: number) => {
        try {
            const response = await getPortofolioProvider(idProvider);
            if(response.status == 200) {
                setPortofolioList(response.data.portofolio);
            }
        } catch (error) {
            console.log(error)
        }

    }

    const resetInputsForm = () => {
        listNames.map((item: string) => {
            document.getElementById(item)?.setAttribute('readOnly', 'true');
        });
        setListNames([]);
        setButtonActive(false);
    }

    useEffect(() => {
        setLoading(true);
        setDataUser();
    }, []);

    useEffect(() => {
        setButtonActive(true);
    }, [setSelectedServices])

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

    const resUpdate = async (idProfile: number, data: any) => {
        try {
            const response = await updateProfile(idProfile, data);
            if(response.status == 200) {
                if(user && user.role == 'PROVIDER') {
                    const servicesData = {
                        services: selectedServices.length > 0 ? selectedServices : []
                    }
                    const updateService = await updateServices(user && user.idProvider, servicesData)
                    if(updateService.status == 200) {
                        setDataUser();
                        resetInputsForm();
                        toast.current!.show({severity:'success', summary:'Successfull', detail: response.data.msg, life: 4000});
                        setLoading(false);
                    }
                }

            }
        } catch (error: any) {
            console.log(error)
            setLoading(false)
            toast.current!.show({severity:'error', summary:'Error', detail: error.msg, life: 4000});
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        formData.providerImage = imageProvider;
        formData.personImage = imagePerson;

        formData.lat = String(selectedLocation.lat);
        formData.lng = String(selectedLocation.lng);
        formData.zip = String(zip)

        resUpdate(user.uid, formData);
        
        if(fileUploadPersonRef.current !== null) fileUploadPersonRef.current.clear();
        if(fileUploadProviderRef.current !== null) fileUploadProviderRef.current.clear();
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'There are errors in the form', life: 4000});
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

    const cancelEdit = () => {
        reset();
        resetInputsForm();
        setImageBussines(user.providerImage);
        setImageProvider(null);
        setButtonActive(false);
        setLoading(true);
        setInterval(() => {
            setLoading(false);
        }, 1500)
    }

    const onTemplateSelect = (e: any) => {
        setButtonLicense(false);
        let providerLicense: any[] = []
        let files = e.files;
        console.log(files);
        Object.keys(files).forEach((key) => {
            providerLicense.push(files[key])
        });

        saveLicense(providerLicense);
    };

    const confirmDelete = (idPortofolio: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteImagePortofolio(idPortofolio)
            if(response.status == 200) {
                setLoading(false)
                getPortofolio(user.idProvider);
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
            } else {
                setLoading(false)
                toast.current!.show({severity:'error', summary:'Error', detail: `${response.data.msg}`, life: 4000});
            }
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this image?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const itemTemplate = (item: Portofolio) => {
        return <img src={item.portofolio_image} alt="photo" style={{ width: '100%', display: 'block' }} />;
    }

    const caption = (item: Portofolio) => {
        return (
            <React.Fragment>
                <div className="text-lg mb-2 font-bold">Description</div>
                <p className="text-white">{item.portofolio_description}</p>
            </React.Fragment>
        );
    }

    const saveLicense = (providerLicense: any) => {
        setLoading(true);
        const data = {
            license: providerLicense
        }
        uploadLicense(user.idProvider, data, toast, setLoading, setLicenseList);

        if(fileUploadProviderLicense.current !== null) fileUploadProviderLicense.current.clear();
        setButtonLicense(true);
    }

    const handleImageChange = (event: any) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImageBussines(URL.createObjectURL(selectedImage));
            if(user.role == 'PROVIDER') {
                setImageProvider(selectedImage);
            } else if(user.role == 'ADMIN' || user.role == 'SUPERADMIN') {
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

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <Galleria ref={galleria} value={portofolioList} numVisible={portofolioList.length} style={{ maxWidth: '50%' }} 
        circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} caption={caption} activeIndex={portofolioIndex}
        onItemChange={(e) => setPortofolioIndex(e.index)} />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Settings</h1>
            <div className="text-gray-900/50 text-sm font-normal leading-none mt-3">Configure Your Settings</div>
            {
            user.role == 'PROVIDER' ?
                <div className='w-full mx-auto h-full flex gap-5 mt-5'>
                    <div className='w-80 h-96 bg-white rounded-xl border border-neutral-200 flex flex-col items-center gap-10 p-5'>
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
                            <p className='font-normal text-xl text-black leading-7'>{toTitleCase(`${user && user.providerName}`)}</p>
                            <p className='text-neutral-600 text-base font-normal leading-normal'>{toTitleCase(`${user?.role}`)}</p>
                            <p className='text-sky-500 text-sm'>Change Password</p>
                        </div>
                    </div>
                    <div className='w-full h-full  overflow-y-auto mx-auto'>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                                <div className='bg-white rounded-xl border border-neutral-200 grid grid-cols-2 gap-5 p-5'>
                                    <p className='col-span-2 leading-snug'>Owner Information</p>
                                    <div className='col-span-2 md:col-span-1'>
                                        <p className='text-sm'>First Name</p>
                                        <Input type='text' id='name' name='name' readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-2 md:col-span-1'>
                                        <p className='text-sm'>Last Name</p>
                                        <Input type='text' id='lastname' name='lastname' readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-2 md:col-span-1 py-2'>
                                        <p className='text-sm'>Email</p>
                                        <Input id='email' name='email' type='email' placeholder='user@email.com' readonly onClick={onClickInputs} />
                                    </div>
                                </div>
                                
                                <div className='bg-white rounded-xl border border-neutral-200 grid grid-cols-2 gap-5 p-5 mt-8'>
                                    <p className='col-span-2 leading-snug'>Business Information</p>
                                    <div className='col-span-2 md:col-span-1 py-2'>
                                        <p className='text-sm'>Bussiness Name</p>
                                        <Input id='providerName' name='providerName' type='text' placeholder='work day' readonly onClick={onClickInputs}  />
                                    </div>
                                    <div className='col-span-2 md:col-span-1 py-2'>
                                        <p className='text-sm'>Phone Number</p>
                                        <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-2 py-2'>
                                        <p className='text-sm'>Business Description</p>
                                        <Textarea id='providerDescription' name='providerDescription' rows={3} readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-2 py-2'>
                                        <p className='text-sm'>Services</p>
                                        <MultiSelect value={selectedServices} onChange={(e) => setSelectedServices(e.value)} options={services} optionLabel="service_name" 
                                        filter display="chip" placeholder="Select Services" maxSelectedLabels={10} className="w-full md:w-20rem" />
                                    </div>
                                    <div className='col-span-2 py-2'>
                                        <p className='text-sm'>Address</p>
                                        <MapComponent
                                            selectedLocation={selectedLocation}
                                            setSelectedLocation={setSelectedLocation}
                                            getAddress={getAddress}
                                            selectedPlace={selectedPlace}
                                            setSelectedPlace={setSelectedPlace}
                                            setZip={setZip}
                                            onClick={onClickInputs} />
                                    </div>
                                    {
                                        buttonActive && (
                                            <div className='col-span-2 flex flex-row items-center justify-end gap-3 my-5'>
                                                <Button type='button' label='Cancel' id='btnPersonal' outlined className='w-36 h-10 border-sky-500 text-sky-500 font-medium rounded-xl border-2' onClick={cancelEdit}></Button>
                                                <Button type='submit' label='Save' className='w-36 h-10 font-medium bg-sky-500 border-sky-500 rounded-xl shadow-lg shadow-sky-300 hover:bg-sky-600 hover:border-sky-600'></Button>
                                            </div>
                                        )
                                    }
                                    <div className='col-span-2 py-2'>
                                        <div className='flex items-center gap-5'>
                                            <p className='text-sm'>Credentials</p>
                                            <FileUpload 
                                            ref={fileUploadProviderLicense} 
                                            mode='basic' accept='.pdf,image/*' 
                                            multiple 
                                            customUpload 
                                            uploadHandler={onTemplateSelect}
                                            chooseOptions={{style: {background: 'none', color: 'rgba(25, 24, 37, 50)', borderColor: 'rgba(25, 24, 37, 50)', fontSize: '12px'}}} />
                                        </div>
                                        <div className='w-full mt-5'>
                                        {
                                            licenseList.length > 0 ?
                                            licenseList.map((item: any, i: number) => (
                                                <div key={i}className='text-sm'>
                                                {
                                                    item.license_name.includes('.pdf') ?
                                                    <div className='flex gap-3 items-center mb-3 hover:text-sky-500'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><g fill="currentColor"><path d="M208 88h-56V32Z" opacity=".2"/><path d="M224 152a8 8 0 0 1-8 8h-24v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8ZM92 172a28 28 0 0 1-28 28h-8v8a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h16a28 28 0 0 1 28 28Zm-16 0a12 12 0 0 0-12-12h-8v24h8a12 12 0 0 0 12-12Zm88 8a36 36 0 0 1-36 36h-16a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h16a36 36 0 0 1 36 36Zm-16 0a20 20 0 0 0-20-20h-8v40h8a20 20 0 0 0 20-20ZM40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 0 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0Zm120-32h28.69L160 51.31Z"/></g></svg>
                                                        <div className='relative pr-5'>
                                                            <svg className='absolute top-0 right-0' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M4 3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V7a.5.5 0 0 1 1 0v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1a.5.5 0 0 1 0 1H4Zm3 0a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-1 0V3.707L7.354 5.354a.5.5 0 1 1-.708-.708L8.293 3H7Z"/></svg>
                                                            <Link href={item.license_url} target='_blank' className='font-light leading-tight'>{item.license_name}</Link>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='flex gap-3 items-center mb-3 hover:text-sky-500'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g id="evaImageFill0"><g id="evaImageFill1"><g id="evaImageFill2" fill="currentColor"><path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM6 5h12a1 1 0 0 1 1 1v8.36l-3.2-2.73a2.77 2.77 0 0 0-3.52 0L5 17.7V6a1 1 0 0 1 1-1Z"/><circle cx="8" cy="8.5" r="1.5"/></g></g></g></svg>
                                                        <div className='relative pr-5'>
                                                            <svg className='absolute top-0 right-0' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M4 3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V7a.5.5 0 0 1 1 0v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1a.5.5 0 0 1 0 1H4Zm3 0a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-1 0V3.707L7.354 5.354a.5.5 0 1 1-.708-.708L8.293 3H7Z"/></svg>
                                                            <Link href={item.license_url} target='_blank' className='font-light leading-tight'>Open image in new tab</Link>
                                                        </div>
                                                    </div>
                                                    }
                                                </div>
                                            ))
                                            : <p>No registered license</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-span-2 py-2'>
                                        <div className='flex items-center gap-5'>
                                            <p className='text-sm'>Gallery</p>
                                            <Create idProvider={user.idProvider} portofolio={portofolioList} setPortofolio={setPortofolioList} loading={loading} setLoading={setLoading} toast={toast} />
                                        </div>
                                        <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center items-center gap-3 mt-5 overflow-x-hidden'>
                                            {
                                                portofolioList.length > 0 ?
                                                portofolioList.map((item: Portofolio, i: number) => {
                                                    if(i < 8) {
                                                        return (
                                                            <div 
                                                                key={i}
                                                                className='col-span-1 w-40 h-40 bg-no-repeat bg-cover bg-center border-2 rounded-xl border-neutral-200 shrink-0'
                                                                style={{'backgroundImage': `url(${item.portofolio_image})`}}
                                                            >
                                                                <div className='text-white bg-black/30 w-full h-full p-2 relative flex flex-col opacity-0 hover:opacity-100 transition-opacity'>
                                                                    <p className='font-medium text-sm md:text-base'>Description</p>
                                                                    <p className='text-xs md:text-sm line-clamp-5'>{item.portofolio_description}</p>
                                                                    <div className='absolute bottom-0 flex items-center'>
                                                                        <Edit idPortofolio={item.id_portofolio} portofolio={portofolioList} setPortofolio={setPortofolioList} loading={loading} setLoading={setLoading} toast={toast} />
                                                                        <Button type='button' icon='pi pi-trash' text className='text-white' onClick={() => confirmDelete(item.id_portofolio)} />
                                                                        <Button type='button'  icon="pi pi-external-link" text className='text-white' onClick={() => {
                                                                            setPortofolioIndex(i)
                                                                            galleria.current.show()
                                                                            }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                                :
                                                Array.from({length: 3}).map((item: any, i: number) => {
                                                    return (
                                                        <div key={i} className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-50 flex items-center justify-center shrink-0'>
                                                            <FontAwesomeIcon icon={faMountainSun} className='text-gray-300 w-[40px]' />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className='col-span-2 py-2'>
                                        <div className='flex items-center gap-5'>
                                            <p className='text-sm'>Method payment accepted</p>
                                            <CreateMethodPayment idProvider={user.idProvider} portofolio={portofolioList} setPortofolio={setPortofolioList} setLoading={setLoading} toast={toast} />
                                        </div>
                                        <p className='text-xs font-light leading-tight mt-5 px-5'>Without payment methods, set up.</p>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            :
                <div className='w-full h-full mt-5'>
                    <div className='w-full h-full overflow-y-auto'>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                                <div className='bg-white grid grid-cols-12 gap-5 p-5'>
                                    <p className='col-span-12 leading-snug'>Personal options</p>
                                    <div className='col-span-6 grid grid-cols-2 gap-5'>
                                        <p className='col-span-1 text-sm'>First Name</p>
                                        <div className='col-span-1'>
                                            <Input type='text' id='name' name='name' readonly onClick={onClickInputs} />
                                        </div>
                                        <p className='col-span-1 text-sm'>Last Name</p>
                                        <div className='col-span-1'>
                                            <Input type='text' id='lastname' name='lastname' readonly onClick={onClickInputs} />
                                        </div>
                                        <p className='col-span-1 text-sm'>Email</p>
                                        <div className='col-span-1'>
                                            <Input id='email' name='email' type='email' placeholder='user@email.com' readonly onClick={onClickInputs} />
                                        </div>
                                        <p className='col-span-1 text-sm'>Phone Number</p>
                                        <div className='col-span-1'>
                                            <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly onClick={onClickInputs} />
                                        </div>
                                        <p className='col-span-1 text-sm'>Profile Image</p>
                                        <div className='col-span-1 relative flex items-center justify-center'>
                                            {
                                                imageBussines == null || imageBussines == '' ?
                                                <FontAwesomeIcon icon={faCircleUser} className='w-32 h-32' style={{color: "#c2c2c2"}} />
                                                : <img src={imageBussines} width={200} height={200} alt='profile' className='rounded-full' />
                                            }
                                            <input
                                                type='file'
                                                id='image-input'
                                                accept='image/*'
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <Button type='button' icon={'pi pi-pencil'} rounded className='absolute bottom-4 right-5' onClick={handleEditButtonClick} />
                                        </div>
                                        <p className='col-span-1 text-sm'>Password</p>
                                        <div className='col-span-1'>
                                            <Button label='Change Password' outlined className='w-full rounded-lg border-sky-500 text-sky-500 hover:border-sky-600 hover:text-sky-600' />
                                        </div>
                                    </div>
                                    <div className='col-span-12'></div>
                                    <p className='col-span-3 text-sm'>Address</p>
                                    <div className='col-span-9'>
                                        <MapComponent
                                            selectedLocation={selectedLocation}
                                            setSelectedLocation={setSelectedLocation}
                                            getAddress={getAddress}
                                            selectedPlace={selectedPlace}
                                            setSelectedPlace={setSelectedPlace}
                                            onClick={onClickInputs} />
                                    </div>
                                    {
                                        buttonActive && (
                                            <div className='col-span-12 flex flex-row items-center justify-end gap-3 my-5'>
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
            }
        </div>
    </LayoutAdmin>
  )
}

export default Index
