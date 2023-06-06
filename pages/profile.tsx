import React, {useEffect, useRef, useState} from 'react';
import Layout from '@/components/layout'
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

    const [user, setUser] = useState<Profile>();

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [personalActive, setPersonalActive] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [imagePerson, setImagePerson] = useState<any>(null);

    const fileUploadPersonRef = useRef<any>(null);

    const resetMap = async (lat: number, lng: number) => {
        const {data} = await getAddress(lat, lng);
        if(data.results.length > 0) {
            setSelectedPlace(data.results[0].formatted_address);
        }
    }

    const setDataUser = async () => {
        const response = await getUserAuthenticated();
        console.log(response.data);
        setUser(response.data);
        setSelectedLocation({
            lat: Number(response.data.customerLat || 0),
            lng: Number(response.data.customerLng || 0),
        })
        resetMap(response.data.providerLat || 0, response.data.providerLng || 0);
        reset(response.data)
    }

    useEffect(() => {
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

    const onSubmit = (data: FormProps) => {}
    const onErrors = () => {}

    const activeEdit = (e: any) => {
        if(e.target.id == 'personal') setPersonalActive(false);
    };

    const cancelEdit = (e: any) => {
        reset();
        if(e.target.id == 'btnPersonal') setPersonalActive(true);
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

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  return (
    <Layout>
        <div className=' w-full h-full bg-white rounded-md shadow-md border overflow-y-auto'>
            <div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                        <div className='p-5 mb-5'>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row gap-5'>
                                    {
                                        user?.image != null ?
                                        <Avatar image={user.image} size='xlarge' shape="circle" />
                                        : <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                                    }
                                    <div className='flex flex-col justify-center'>
                                        <p className='font-medium'>{(`${user?.name} ${user?.lastname}`).toUpperCase()}</p>
                                    </div>
                                </div>
                                <p id='personal' className='text-[#109EDA] font-bold cursor-pointer' onClick={activeEdit}>Edit</p>
                            </div>

                            <div className='w-full grid grid-cols-12 mt-5'>
                                <div className='col-span-12 grid grid-cols-12 gap-5'>
                                    <div className='col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Name</p>
                                        </div>
                                        <Input type='text' id='name' name='name' readonly={personalActive} />
                                    </div>
                                    <div className='col-span-6 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-user'></i>
                                            <p>Lastname</p>
                                        </div>
                                        <Input type='text' id='lastname' name='lastname' readonly={personalActive} />
                                    </div>
                                </div>
                                <div className={personalActive ? 'hidden' : 'col-span-12 py-2'}>
                                    <div className='font-medium flex flex-row items-center gap-2'>
                                        <i className='pi pi-lock'></i>
                                        <p>Password</p>
                                    </div>
                                    <Input id='password' name='password' type='password' readonly={personalActive} />
                                </div>
                                <div className='col-span-12 grid grid-cols-12 gap-5'>
                                    <div className='col-span-12 md:col-span-5 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-at'></i>
                                            <p>Email</p>
                                        </div>
                                        <Input id='email' name='email' type='email' placeholder='user@email.com' readonly={personalActive} />
                                    </div>
                                    <div className='col-span-12 md:col-span-5 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-phone'></i>
                                            <p>Phone</p>
                                        </div>
                                        <Input type='tel' id='phone' name='phone' placeholder="(999) 999-9999" readonly={personalActive} />
                                    </div>
                                    <div className='col-span-12 md:col-span-2 py-2'>
                                        <div className='font-medium flex flex-row items-center gap-2'>
                                            <i className='pi pi-question-circle'></i>
                                            <p>State</p>
                                        </div>
                                        <ToggleButton id='state' name='state' checked={checked} onChange={(e) => {setChecked(e.value)}} onLabel='Active' offLabel='Inactive' onIcon="pi pi-check" offIcon="pi pi-times" disabled={personalActive} className='w-full' />
                                    </div>
                                </div>
                                <div className='col-span-12 py-2'>
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
                    </form>
                </FormProvider>

                    {/* <div className='border-t-2 p-5 mb-5'>
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
            </div>
        </div>
    </Layout>
  )
}

export default Profile