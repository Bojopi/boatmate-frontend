import React, { useEffect, useState, useRef } from 'react'
import Spinner from '@/components/spinner';
import { Auth } from '@/hooks/auth'
import { Avatar } from 'primereact/avatar';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from 'primereact/progressbar';
import { Rating } from 'primereact/rating';
import { FormProvider, useForm } from 'react-hook-form';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Users } from '@/hooks/user';
import { ToggleButton } from "primereact/togglebutton";
import { Input } from '../../components/react-hook-form/input';
import MapComponent from '@/components/map';
import { Maps } from '@/hooks/maps';
import { Tag } from 'primereact/tag';
import { Textarea } from '@/components/react-hook-form/textarea';
import { Profile } from '@/interfaces/interfaces';
import { Ratings as Rtng } from '@/hooks/rating';
import { avgRating, calculateAllRatingPercentages } from '@/functions/rating';
import { Portofolios } from '@/hooks/portofolio';
import { Portofolio } from '@/interfaces/interfaces';
import Create from './providers/portofolio/create';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Galleria } from 'primereact/galleria';
import Edit from './providers/portofolio/edit';
import { Providers } from '@/hooks/providers';

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
}

const Welcome = () => {
    const {getUserAuthenticated} = Auth();
    const {getRatingProvider} = Rtng();
    const {updateProfile} = Users();
    const {getAddress} = Maps();
    const {getPortofolioProvider, deleteImagePortofolio} = Portofolios();
    const {uploadLicense} = Providers();

    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [listNames, setListNames] = useState<string[]>([]);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [imagePerson, setImagePerson] = useState<any>(null);
    const [imageProvider, setImageProvider] = useState<any>(null);
    const [providerLicense, setProviderLicense] = useState<any>(null);

    const toast = useRef<Toast>(null);
    const galleria = useRef<any>(null);

    const fileUploadPersonRef = useRef<any>(null)
    const fileUploadProviderRef = useRef<any>(null)
    const fileUploadProviderLicense = useRef<any>(null)

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
    const [rating, setRating] = useState<number>(0);
    const [countRating, setCountRating] = useState<number>(0);
    const [ratingDetail, setRatingDetail] = useState<any>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

    const [portofolioList, setPortofolioList] = useState<Portofolio[]>([]);
    const [portofolioIndex, setPortofolioIndex] = useState<number>(0);

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

    useEffect(() => {
        setDataUser();
    }, []);

    const resetMap = async (lat: number, lng: number) => {
        const {data} = await getAddress(lat, lng);
        if(data.results.length > 0) {
            setSelectedPlace(data.results[0].formatted_address);
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        formData.providerImage = imageProvider;
        formData.personImage = imagePerson;

        formData.lat = String(selectedLocation.lat);
        formData.lng = String(selectedLocation.lng);

        updateProfile(user.uid, formData, setLoading, toast, setDataUser, resetInputsForm);
        
        if(fileUploadPersonRef.current !== null) fileUploadPersonRef.current.clear();
        if(fileUploadProviderRef.current !== null) fileUploadProviderRef.current.clear();
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'There are errors in the form', life: 4000});
    };

    const setDataUser = async () => {
        const response = await getUserAuthenticated();
        setUser(response.data);
        setChecked(response.data.state);
        if(response.data.role === 'PROVIDER') {
            getRatings(response.data.idProvider);
            getPortofolio(response.data.idProvider);
            setSelectedLocation({
                lat: Number(response.data.providerLat || 0),
                lng: Number(response.data.providerLng || 0),
            })
            resetMap(response.data.providerLat || 0, response.data.providerLng || 0);
        }
        reset(response.data)
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

    const getRatings = async (idProvider: number) => {
        try {
            const res = await getRatingProvider(idProvider);
            setCountRating(res.data.countRating)
            if(res.status == 200 && res.data.rating.length > 0) {
                const ratDetail = calculateAllRatingPercentages(res.data.rating);
                setRatingDetail(ratDetail)

                const avg = avgRating(res.data.rating);
                setRating(Number(avg))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onClickInputs = (e: any) => {
        console.log(listNames)
        setButtonActive(true);
        e.target.readOnly = false;
        if(listNames.length > 0) {
            if(!listNames.includes(e.target.name)) {
                listNames.push(e.target.name)
            }
        } else {
            console.log('aqui entro')
            listNames.push(e.target.name)
        }
    }

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

    const itemTemplateLicense = (file: any, props: any) => {
        setProviderLicense(file);
        return (
            <div className="flex items-center flex-wrap">
                <div className="flex items-center" style={{ width: '40%' }}>
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

    const saveLicense = () => {
        setLoading(true);
        const data = {
            license: providerLicense
        }
        uploadLicense(user.idProvider, data, toast, setLoading);

        if(fileUploadProviderLicense.current !== null) fileUploadProviderLicense.current.clear();
    }


  return (
        <>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <Galleria ref={galleria} value={portofolioList} numVisible={portofolioList.length} style={{ maxWidth: '50%' }} 
                circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} caption={caption} activeIndex={portofolioIndex}
                onItemChange={(e) => setPortofolioIndex(e.index)} />
        <div className=' w-full h-full bg-white rounded-md shadow-md border overflow-y-auto'>
            <div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                        <div className='p-5 mb-5'>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row gap-5'>
                                    {
                                        user.role === 'PROVIDER' && user.providerImage != null ?
                                        <Avatar image={user.providerImage} size='xlarge' shape="circle" />
                                        : (user.role === 'ADMIN' || user.role === 'SUPERADMIN') && user.image != null ?
                                        <Avatar image={user.image} size='large' shape="circle" />
                                        : <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                                    }
                                    <div className='flex flex-col justify-center'>
                                        <p className='font-medium'>{(user.providerName ? user.providerName : `${user.name} ${user.lastname}`).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full grid grid-cols-12 mt-5'>
                                <div className='col-span-12 grid grid-cols-12 gap-5'>
                                    <div className='col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Name</p>
                                        </div>
                                        <Input type='text' id='name' name='name' readonly onClick={onClickInputs}  />
                                    </div>
                                    <div className='col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Lastname</p>
                                        </div>
                                        <Input type='text' id='lastname' name='lastname' readonly onClick={onClickInputs}  />
                                    </div>
                                </div>
                                {
                                    user.role === 'PROVIDER' ?
                                    <>
                                        <div className='col-span-12 py-2'>
                                            <div className='font-medium flex flex-row items-center gap-2'>
                                                <i className='pi pi-building'></i>
                                                <p>Bussiness Name</p>
                                            </div>
                                            <Input id='providerName' name='providerName' type='text' placeholder='work day' readonly onClick={onClickInputs}  />
                                        </div>
                                        <div className='col-span-12 py-2'>
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
                                            headerTemplate={headerTemplate}
                                            itemTemplate={itemTemplateProvider}
                                            chooseOptions={chooseOptions}
                                            cancelOptions={cancelOptions}
                                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                                        </div>
                                    </>
                                    : null
                                }
                                <div className='col-span-12 py-2'>
                                    <div className='font-medium flex flex-row items-center gap-2'>
                                        <i className='pi pi-lock'></i>
                                        <p>Password</p>
                                    </div>
                                    <Input id='password' name='password' type='password' placeholder='******' readonly onClick={onClickInputs} />
                                </div>
                                <div className='col-span-12 grid grid-cols-12 gap-5'>
                                    <div className='col-span-12 md:col-span-5 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-at'></i>
                                            <p>Email</p>
                                        </div>
                                        <Input id='email' name='email' type='email' placeholder='user@email.com' readonly onClick={onClickInputs} />
                                    </div>
                                    <div className='col-span-12 md:col-span-5 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-phone'></i>
                                            <p>Phone</p>
                                        </div>
                                        <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly onClick={onClickInputs} />
                                    </div>
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
                                <div className='col-span-12 py-2'>
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
                                        headerTemplate={headerTemplate}
                                        itemTemplate={itemTemplatePerson}
                                        chooseOptions={chooseOptions}
                                        cancelOptions={cancelOptions}
                                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                                </div>
                            </div>
                        </div>

                        {
                            user.role === 'PROVIDER' ?
                                <div className='border-t-2 p-5 mb-5'>
                                    <div className='flex flex-row justify-between'>
                                        <p className='font-bold'>Your introduction</p>
                                    </div>
                                    <div className='w-full flex flex-col mt-5'>
                                        <div className='py-2'>
                                            <Textarea id='providerDescription' name='providerDescription' rows={2} readonly onClick={onClickInputs} />
                                        </div>
                                    </div>
                                    {
                                        buttonActive && (
                                            <div className='flex flex-row items-center justify-end gap-3 mt-3'>
                                                <button type='button' id='btnDetail' className='px-5 py-1 bg-white border-2 border-[#373A85] text-center text-sm text-[#373A85] font-bold rounded-md' onClick={cancelEdit}>Cancel</button>
                                                <button type='submit' className='px-5 py-1 bg-[#373A85] border-2 border-[#373A85] text-center text-sm text-white font-bold rounded-md'>Save</button>
                                            </div>
                                        )
                                    }
                                </div>
                            : null
                        }
                    </form>
                </FormProvider>

                {
                    user.role != 'ADMIN' && user.role != 'SUPERADMIN' ?
                    <>
                    <div className='border-t-2 p-5 mb-5'>
                        <p className='font-bold'>Credentials</p>
                        <div className='w-full flex flex-col mt-5'>
                            {/* <div className='py-2'>
                                <div className='font-medium flex flex-row items-center gap-2'>
                                    <i className='pi pi-user-plus'></i>
                                    <p>Background Check</p>
                                </div>
                                <div className='border-2 border-dashed rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                    <p className='text-sm text-gray-600' >Add a background check badge to your profile by authorizing a free background check. This will help you build customer trust and get hired more.</p>
                                    <Link href={''} className='bg-white border-2 rounded-md text-[#109EDA] font-bold text-center px-5 py-2 hover:bg-gray-50' >Start</Link>
                                </div>
                            </div> */}
                            <div className='py-2'>
                                <div className='font-medium flex flex-row items-center gap-2'>
                                    <i className='pi pi-shield'></i>
                                    <p>Professional Licenses</p>
                                </div>
                                <div className='border-2 border-dashed rounded-md mt-2 p-3'>
                                    <FileUpload
                                        ref={fileUploadProviderLicense}
                                        id='providerLicense'
                                        name="providerLicense"
                                        onClear={() => setProviderLicense(null)}
                                        accept=".pdf"
                                        headerTemplate={headerTemplate}
                                        itemTemplate={itemTemplateLicense}
                                        chooseOptions={chooseOptions}
                                        cancelOptions={cancelOptions}
                                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                                    <div className='w-full flex justify-end mt-5'>
                                        <Button label='Save License' outlined onClick={saveLicense} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='border-t-2 p-5 mb-5'>
                        <div className='flex flex-row justify-between'>
                            <p className='font-bold'>Payment methods accepted</p>
                            <p className='text-[#109EDA] font-bold cursor-pointer'>Edit</p>
                        </div>
                        <div className='w-full flex flex-col'>
                            <div className='py-2'>
                                <div className='border-2 rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                    <div>
                                        <p className='text-sm text-[#00CBA4] font-bold' >Get paid through BoatMate.</p>
                                        <p className='text-xs text-gray-600' >Request and recieve payments from customers in the app. <Link href={''} className='text-[#109EDA] font-semibold' >Learn more</Link></p>

                                    </div>
                                    <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3]' >Set up direct deposit</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='border-t-2 p-5 mb-5'>
                        <div className='flex flex-row justify-between'>
                            <p className='font-bold'>Photos</p>
                        </div>
                        <div className='max-w-full overflow-hidden overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-3 mt-5'>
                            {
                                portofolioList.length > 0 ?
                                 portofolioList.map((item: Portofolio, i: number) => {
                                    if(i < 8) {
                                        return (
                                            <div 
                                                key={i}
                                                className='col-span-1 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] bg-no-repeat bg-cover bg-center border-2 rounded-md shadow-md shrink-0'
                                                style={{'backgroundImage': `url(${item.portofolio_image})`}}
                                            >
                                                <div className='text-white bg-black/30 w-full h-full p-2 relative flex flex-col opacity-0 hover:opacity-100 transition-opacity'>
                                                    <p className='font-medium text-sm md:text-base'>Description</p>
                                                    <p className='text-xs md:text-sm line-clamp-5'>{item.portofolio_description}</p>
                                                    <div className='absolute bottom-0 flex items-center'>
                                                        <Edit idPortofolio={item.id_portofolio} portofolio={portofolioList} setPortofolio={setPortofolioList} setLoading={setLoading} toast={toast} />
                                                        <Button icon='pi pi-trash' text className='text-white' onClick={() => confirmDelete(item.id_portofolio)} />
                                                        <Button  icon="pi pi-external-link" text className='text-white' onClick={() => {
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
                                Array.from({length: 1}).map((item: any, i: number) => {
                                    return (
                                        <div key={i} className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-50 flex items-center justify-center shrink-0'>
                                            <FontAwesomeIcon icon={faMountainSun} className='text-gray-300 w-[40px]' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='border-2 rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                            <div>
                                <p className='text-sm text-gray-60 font-bold'>Show off your business</p>
                                <p className='text-xs text-gray-600' >Include photos of your work (before and after), team, workspace, or equipment.</p>

                            </div>
                            <Create idProvider={user.idProvider} portofolio={portofolioList} setPortofolio={setPortofolioList} setLoading={setLoading} toast={toast} />
                        </div>
                    </div>

                    {/* <div className='border-t-2 p-5 mb-5'>
                        <p className='font-bold'>Social Media</p>
                        <div className='w-full grid grid-cols-3 gap-5 mt-5'>
                            <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                <FontAwesomeIcon icon={faFacebookF} className='w-[10px]' />
                                <p className='text-sm font-medium'>Add Facebook</p>
                            </Link>
                            <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                <FontAwesomeIcon icon={faInstagram} className='w-[15px]'  />
                                <p className='text-sm font-medium'>Add Instagram</p>
                            </Link>
                            <Link href={''} className='py-1 bg-white border-2 flex flex-row justify-center items-center gap-5 text-gray-500 rounded-md hover:bg-gray-50'>
                                <FontAwesomeIcon icon={faTwitter} className='w-[15px]' />
                                <p className='text-sm font-medium'>Add Twitter</p>
                            </Link>
                        </div>
                    </div> */}

                    {/* <div className='p-5 mb-5'>
                        <p className='font-bold'>Reviews</p>
                        <div className='w-full flex flex-row items-center justify-center md:gap-20 mt-5 px-5 md:px-20'>
                            <div className='w-[40%] md:w-full'>
                                <p className='text-[#00CBA4] font-bold'>{rating}</p>
                                <Rating value={rating} cancel={false} readOnly offIcon={'pi pi-star-fill'} offIconProps={{style: {color: 'rgb(209, 213, 219)'}}} />
                                <p className='text-xs'>{countRating} reviews</p>
                            </div>
                            <div className='w-[60%] md:w-full flex flex-col items-start'>
                                <div className='w-full grid grid-cols-12 justify-items-center items-center'>
                                    <p className='col-span-2'>5<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={ratingDetail['5']} showValue={false} className='col-span-6 h-[10px] w-full' />
                                    <p className='col-span-4'>{ratingDetail['5']}%</p>
                                </div>
                                <div className='w-full grid grid-cols-12 justify-items-center items-center'>
                                    <p className='col-span-2'>4<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={ratingDetail['4']} showValue={false} className='col-span-6 h-[10px] w-full' />
                                    <p className='col-span-4'>{ratingDetail['4']}%</p>
                                </div>
                                <div className='w-full grid grid-cols-12 justify-items-center items-center'>
                                    <p className='col-span-2'>3<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={ratingDetail['3']} showValue={false} className='col-span-6 h-[10px] w-full' />
                                    <p className='col-span-4'>{ratingDetail['3']}%</p>
                                </div>
                                <div className='w-full grid grid-cols-12 justify-items-center items-center'>
                                    <p className='col-span-2'>2<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={ratingDetail['2']} showValue={false} className='col-span-6 h-[10px] w-full' />
                                    <p className='col-span-4'>{ratingDetail['2']}%</p>
                                </div>
                                <div className='w-full grid grid-cols-12 justify-items-center items-center'>
                                    <p className='col-span-2'>1<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={ratingDetail['1']} showValue={false} className='col-span-6 h-[10px] w-full' />
                                    <p className='col-span-4'>{ratingDetail['1']}%</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-2 rounded-md mt-5 p-3 flex flex-row justify-between items-center gap-5'>
                            <img src="https://i.postimg.cc/SxJz8VPb/chat.png" alt="reviews" height={70} width={70} />
                            <div>
                                <p className='text-sm text-gray-60 font-bold'>Get reviews from past customers, even if they&apos;re not on BoatMate.</p>
                                <p className='text-xs text-gray-600' >Tell us which customers to ask for a review, and we&apos;ll send the request for you.</p>

                            </div>
                            <Link href={`/welcome/ratings/${user.idProvider}`} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3] shrink-0' >Ask for reviews</Link>
                        </div>
                    </div> */}
                    </>
                    : null
                }
            </div>
        </div>
    </>
  )
}

export default Welcome