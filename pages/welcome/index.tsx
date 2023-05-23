import React, { useEffect, useState, useRef } from 'react'
import Spinner from '@/components/spinner';
import { Auth } from '@/hooks/auth'
import { Avatar } from 'primereact/avatar';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
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
import { Ratings } from '@/hooks/rating';
import { avgRating } from '@/functions/rating';

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
    const {getRatingProvider} = Ratings();
    const {updateProfile} = Users();
    const {getAddress} = Maps();

    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [personalActive, setPersonalActive] = useState<boolean>(true);
    const [detailActive, setDetailActive] = useState<boolean>(true);

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [imagePerson, setImagePerson] = useState<any>(null);
    const [imageProvider, setImageProvider] = useState<any>(null);

    const toast = useRef<Toast>(null);
    const fileUploadPersonRef = useRef<any>(null)
    const fileUploadProviderRef = useRef<any>(null)

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
          setSelectedPlace(data.results[0].formatted_address);
      }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        formData.providerImage = imageProvider;
        formData.personImage = imagePerson;

        formData.lat = String(selectedLocation.lat);
        formData.lng = String(selectedLocation.lng);

        updateProfile(user.uid, formData, setLoading, toast, setDataUser, setPersonalActive, setDetailActive);
        
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
            const res = await getRatingProvider(response.data.idProvider);
            if(res.status === 200) {
                const avg = avgRating(res.data.rating);
                setRating(Number(avg));
            }
            setSelectedLocation({
                lat: Number(response.data.providerLat),
                lng: Number(response.data.providerLng),
            })
            resetMap(response.data.providerLat, response.data.providerLng);
        } else if(response.data.role === 'CUSTOMER') {
            setSelectedLocation({
                lat: Number(response.data.customerLat),
                lng: Number(response.data.customerLng),
            })
            resetMap(response.data.customerLat, response.data.customerLng);
        }
        reset(response.data)
    }

    const activeEdit = (e: any) => {
        if(e.target.id == 'personal') setPersonalActive(false);
        if(e.target.id == 'detail') setDetailActive(false);
    };

    const cancelEdit = (e: any) => {
        reset();
        if(e.target.id == 'btnPersonal') setPersonalActive(true);
        if(e.target.id == 'btnDetail') setDetailActive(true);
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

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };


  return (
        <>
        <Spinner loading={loading} />
        <Toast ref={toast} />
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
                                        : user.role === 'CUSTOMER' && user.image != null ?
                                        <Avatar image={user.image} size='large' shape="circle" />
                                        : (user.role === 'ADMIN' || user.role === 'SUPERADMIN') && user.image != null ?
                                        <Avatar image={user.image} size='large' shape="circle" />
                                        : <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                                    }
                                    <div className='flex flex-col justify-center'>
                                        <p className='font-medium'>{(user.providerName ? user.providerName : `${user.name} ${user.lastname}`).toUpperCase()}</p>
                                        {
                                            user.role === 'PROVIDER' ?
                                            <div className='flex flex-row gap-2 justify-start'>
                                                <Rating value={rating} readOnly cancel={false} onIconProps={{style: {color: '#109EDA', fontSize:'12px'}}} offIconProps={{style: {fontSize:'12px'}}} />
                                                <Link href={`/welcome/providers/ratings/${user.idProvider}`} className='text-[#109EDA] text-sm' >Ask for Reviews</Link>
                                            </div>
                                            : null
                                        }
                                    </div>
                                </div>
                                <p id='personal' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                            </div>

                            <div className='w-full flex flex-col mt-5'>
                                <div className='w-full flex flex-row gap-5'>
                                    <div className='w-1/2 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Name</p>
                                        </div>
                                        <Input type='text' id='name' name='name' readonly={personalActive} />
                                    </div>
                                    <div className='w-1/2 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Lastname</p>
                                        </div>
                                        <Input type='text' id='lastname' name='lastname' readonly={personalActive} />
                                    </div>
                                </div>
                                {
                                    user.role === 'PROVIDER' ?
                                    <>
                                        <div className='w-full py-2'>
                                            <div className='font-medium flex flex-row items-center gap-2'>
                                                <i className='pi pi-building'></i>
                                                <p>Bussiness Name</p>
                                            </div>
                                            <Input id='providerName' name='providerName' type='text' placeholder='work day' readonly={personalActive} />
                                        </div>
                                        {
                                            !personalActive ?
                                            <div className='w-full py-2'>
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
                                            : null
                                        }
                                    </>
                                    : null
                                }
                                <div className={personalActive ? 'hidden' : 'py-2'}>
                                    <div className='font-medium flex flex-row items-center gap-2'>
                                        <i className='pi pi-lock'></i>
                                        <p>Password</p>
                                    </div>
                                    <Input id='password' name='password' type='password' readonly={personalActive} />
                                </div>
                                <div className='w-full flex flex-row gap-5'>
                                    <div className='w-[40%] py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-at'></i>
                                            <p>Email</p>
                                        </div>
                                        <Input id='email' name='email' type='email' placeholder='user@email.com' readonly={personalActive} />
                                    </div>
                                    <div className='w-[40%] py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-phone'></i>
                                            <p>Phone</p>
                                        </div>
                                        <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly={personalActive} />
                                    </div>
                                    <div className='w-[20%] py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-question-circle'></i>
                                            <p>State</p>
                                        </div>
                                        <ToggleButton id='state' name='state' checked={checked} onChange={(e) => {setChecked(e.value)}} onLabel='Active' offLabel='Inactive' onIcon="pi pi-check" offIcon="pi pi-times" disabled={personalActive} className='w-full' />
                                    </div>
                                </div>
                                <div className='py-2'>
                                    <div className='font-medium flex flex-row items-center gap-2'>
                                        <i className='pi pi-map-marker'></i>
                                        <p>Address</p>
                                    </div>
                                    <MapComponent
                                        readonly={personalActive}
                                        selectedLocation={selectedLocation}
                                        setSelectedLocation={setSelectedLocation}
                                        getAddress={getAddress}
                                        selectedPlace={selectedPlace}
                                        setSelectedPlace={setSelectedPlace} />
                                </div>
                                {
                                    !personalActive ?
                                    <div className='py-2'>
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
                                    </div>
                                    : null
                                }
                            </div>
                            {
                                !personalActive && (
                                    <div className='flex flex-row items-center justify-end gap-3 mt-3'>
                                        <button type='button' id='btnPersonal' className='px-5 py-1 bg-white border-2 border-[#373A85] text-center text-sm text-[#373A85] font-bold rounded-md' onClick={cancelEdit}>Cancel</button>
                                        <button type='submit' className='px-5 py-1 bg-[#373A85] border-2 border-[#373A85] text-center text-sm text-white font-bold rounded-md'>Save</button>
                                    </div>
                                )
                            }
                        </div>

                        {
                            user.role === 'PROVIDER' ?
                                <div className='border-t-2 p-5 mb-5'>
                                    <div className='flex flex-row justify-between'>
                                        <p className='font-bold'>Your introduction</p>
                                        <p id='detail' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                                    </div>
                                    <div className='w-full flex flex-col mt-5'>
                                        <div className='py-2'>
                                            <Textarea id='providerDescription' name='providerDescription' readonly={detailActive} rows={2} />
                                        </div>
                                    </div>
                                    {
                                        !detailActive && (
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
                            <div className='py-2'>
                                <div className='font-medium flex flex-row items-center gap-2'>
                                    <i className='pi pi-user-plus'></i>
                                    <p>Background Check</p>
                                </div>
                                <div className='border-2 border-dashed rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                    <p className='text-sm text-gray-600' >Add a background check badge to your profile by authorizing a free background check. This will help you build customer trust and get hired more.</p>
                                    <Link href={''} className='bg-white border-2 rounded-md text-[#109EDA] font-bold text-center px-5 py-2 hover:bg-gray-50' >Start</Link>
                                </div>
                            </div>
                            <div className='py-2'>
                                <div className='font-medium flex flex-row items-center gap-2'>
                                    <i className='pi pi-shield'></i>
                                    <p>Professional Licenses</p>
                                </div>
                                <div className='border-2 border-dashed rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                                    <p className='text-sm text-gray-600' >Customers prefer to hire professionals who are licensed in their profession.</p>
                                    <Link href={''} className='bg-white border-2 rounded-md text-[#109EDA] font-bold text-center px-5 py-2 hover:bg-gray-50' >Add</Link>
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
                        <div className='flex flex-row overflow-hidden gap-3 mt-5'>
                            <div className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-100 flex items-center justify-center shrink-0'>
                                <Link href={''} className='pi pi-plus-circle text-[#109EDA] text-xl font-medium'></Link>
                            </div>
                            {Array.from({length: 7}).map((item: any, i: number) => {
                                return (
                                    <div key={i} className='border-2 border-dashed rounded-md w-[100px] h-[100px] bg-gray-50 flex items-center justify-center shrink-0'>
                                        <FontAwesomeIcon icon={faMountainSun} className='text-gray-300 w-[40px]' />
                                    </div>
                                )
                            })}
                        </div>
                        <div className='border-2 rounded-md mt-2 p-3 flex flex-row justify-between items-center gap-3'>
                            <div>
                                <p className='text-sm text-gray-60 font-bold'>Show off your business</p>
                                <p className='text-xs text-gray-600' >Include photos of your work (before and after), team, workspace, or equipment.</p>

                            </div>
                            <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3]' >Add photos</Link>
                        </div>
                    </div>

                    <div className='border-t-2 p-5 mb-5'>
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
                    </div>

                    <div className='p-5 mb-5'>
                        <p className='font-bold'>Reviews</p>
                        <div className='w-full flex flex-row items-center justify-center gap-20 mt-5'>
                            <div>
                                <p className='text-[#00CBA4] font-bold'>0.0</p>
                                <Rating value={0} cancel={false} readOnly offIcon={'pi pi-star-fill'} offIconProps={{style: {color: 'rgb(209, 213, 219)'}}} />
                                <p className='text-xs'>0 reviews</p>
                            </div>
                            <div className='w-1/3 flex flex-col items-start'>
                                <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                    <p className='col-span-1'>5<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                    <p className='col-span-1'>0%</p>
                                </div>
                                <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                    <p className='col-span-1'>4<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                    <p className='col-span-1'>0%</p>
                                </div>
                                <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                    <p className='col-span-1'>3<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                    <p className='col-span-1'>0%</p>
                                </div>
                                <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                    <p className='col-span-1'>2<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                    <p className='col-span-1'>0%</p>
                                </div>
                                <div className='w-full grid grid-cols-4 justify-items-center items-center'>
                                    <p className='col-span-1'>1<i className='pi pi-star-fill text-[10px] text-gray-300'></i></p>
                                    <ProgressBar value={0} showValue={false} className='col-span-2 h-[10px] w-full' />
                                    <p className='col-span-1'>0%</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-2 rounded-md mt-5 p-3 flex flex-row justify-between items-center gap-5'>
                            <img src="https://i.postimg.cc/SxJz8VPb/chat.png" alt="reviews" height={70} width={70} />
                            <div>
                                <p className='text-sm text-gray-60 font-bold'>Get reviews from past customers, even if they&apos;re not on BoatMate.</p>
                                <p className='text-xs text-gray-600' >Tell us which customers to ask for a review, and we&apos;ll send the request for you.</p>

                            </div>
                            <Link href={''} className='bg-[#109EDA] border-2 border-[#109EDA] rounded-md text-white font-bold text-center px-5 py-2 hover:bg-[#149ad3] hover:border-[#149ad3] shrink-0' >Ask for reviews</Link>
                        </div>
                    </div>
                    </>
                    : null
                }
            </div>
        </div>
    </>
  )
}

export default Welcome