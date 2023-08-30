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
import { Stripes } from '@/hooks/stripe';
import StripeWrapper from '@/components/stripe';

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

const PaymentMethodCard = () => {
    const {getUserAuthenticated} = Auth();
    const {updateProfile} = Users();
    const {getAddress} = Maps();
    const {getPortofolioProvider, deleteImagePortofolio, postImagesPortofolio} = Portofolios();
    const {uploadLicense, getLicenses, getServicesProvider, updateServices} = Providers();
    const { getAllServices } = Services();
    const { createAccount } = Stripes();

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


    const saveLicense = (providerLicense: any) => {
        setLoading(true);
        const data = {
            license: providerLicense
        }
        uploadLicense(user.idProvider, data, toast, setLoading, setLicenseList);

        if(fileUploadProviderLicense.current !== null) fileUploadProviderLicense.current.clear();
    }
    
    const savePortofolio = (providerPortofolio: any[]) => {
        setLoading(true);
        const data = {
            images: providerPortofolio,
            count: providerPortofolio.length
        }
        postImagesPortofolio(user.idProvider, data, toast, setLoading, portofolioList, setPortofolioList);
    }

    const handleLicenseChange = (event: any) => {
        let providerLicense: any[] = []
        let files = event.target.files;
        Object.keys(files).forEach((key) => {
            providerLicense.push(files[key])
        });

        saveLicense(providerLicense);
    };

    const handleEditLicenseButtonClick = () => {
        const fileInput = document.getElementById('license-input');
        if (fileInput) {
            fileInput.click();
        }
    };
    
    const handlePortofolioChange = (event: any) => {
        let providerPortofolio: any[] = []
        let files = event.target.files;
        if(Object.keys(files).length > 0) {
            Object.keys(files).forEach((key) => {
                providerPortofolio.push(files[key])
            });
        } else {
            providerPortofolio.push(files)
        }
        savePortofolio(providerPortofolio);
    };

    const handleEditPortofolioButtonClick = () => {
        const fileInput = document.getElementById('portofolio-input');
        if (fileInput) {
            fileInput.click();
        }
    };
    
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
    
    const stripeAccount = () => {
        setLoading(true);
        const data = {
            email: user.email
        }
        createAccount(user.idProvider, data, toast, setLoading);
    }

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <Galleria ref={galleria} value={portofolioList} numVisible={portofolioList.length} style={{ maxWidth: '50%' }} 
        circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} activeIndex={portofolioIndex}
        onItemChange={(e) => setPortofolioIndex(e.index)} />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Settings</h1>
            <div className="text-gray-900/50 text-sm font-normal leading-none mt-3">Configure Your Settings</div>
            <br /><br /><br /><br /><br />
            <StripeWrapper></StripeWrapper>
        </div>
    </LayoutAdmin>
  )
}

export default PaymentMethodCard
