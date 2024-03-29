import React, { useState, useRef } from 'react';
import {FormProvider, useForm} from "react-hook-form";
import Link from 'next/link'

import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';

import { InputWrapper } from '../components/react-hook-form/input-wrapper';
import { Label } from '../components/react-hook-form/label';
import { Input } from '../components/react-hook-form/input';
import { ErrorMessage } from '../components/react-hook-form/error-message';

import Spinner from '../components/spinner';
import MapComponent from '@/components/map';
import { Maps } from '@/hooks/maps';
import { Auth } from '@/hooks/auth';
import { Button } from 'primereact/button';
import MenuBar from '@/components/menuBar';
import { useRouter } from 'next/router';


export type FormProps = {
    email:          string;
    password:       string;
    idRole:         string;
    personName:     string;
    lastname:       string;
    phone:          string;
    lat:            string;
    lng:            string;
    zip:            string;
    providerName:   string;
}

const Register: React.FC = () => {

    const { createUSer } = Auth()

    const {getAddress} = Maps();

    const toast = useRef<Toast>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedPlace, setSelectedPlace] = useState<any>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [zip, setZip] = useState<string>('No Zip Code');

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [isSelected, setIsSelected] = useState<string>('')

    const [togglePass, setTogglePass] = useState<boolean>(false);
    const [toggleConfirmPass, setToggleConfirmPass] = useState<boolean>(false);
    const [errorMatch, setErrorMatch] = useState<boolean>(false);

    const router = useRouter()

    const items = [
        {
            label: 'Personal Data',
        },
        {
            label: 'User Data'
        },
        {
            label: 'Role'
        }
    ];

    const methods = useForm<FormProps>({
        defaultValues: {
            email:          '',
            password:       '',
            idRole:         '',
            personName:     '',
            lastname:       '',
            phone:          '',
            lat:            '',
            lng:            '',
            zip:            '',
            providerName:   '',
        }
    });

    const {
        setValue,
        getValues,
        handleSubmit,
        setError,
        formState: {errors, isValid},
    } = methods;

    const createNewUser = async (data: any) => {
        try {
            const response = await createUSer(data);
            if(response.status == 200) {
                toast.current!.show({severity:'success', summary:'Successful', detail: `${response.data.msg}`, life: 4000});
                if(data.idRole == 4) {
                    router.push('/category/detailing')
                } else {
                    router.push('/service-list');
                }
                setLoading(false);
            }
        } catch (error: any) {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: `${error.response.data.msg}`, life: 4000});
            setLoading(false);
        }
    }

    const onSubmit = (formData: FormProps) => {
        formData.idRole = isSelected;
        formData.password = password;

        formData.lat = selectedLocation && selectedLocation.lat ? selectedLocation.lat : ''
        formData.lng = selectedLocation && selectedLocation.lng ? selectedLocation.lng : ''
        formData.zip = zip;

        setLoading(true);
        createNewUser(formData)
    };

    const onErrors = () => {
        toast.current?.show({severity:'error', summary:'Error', detail: 'User and/or password are not correct', life: 4000});
    };

    const nextStep = () => {
        setActiveIndex(cur => cur + 1);
    }

    const backStep = () => {
        setActiveIndex(cur => cur - 1);
    }

    const changePass = (e: any) => {
        if(e.target.id === 'password') setPassword(e.target.value);
        else if(e.target.id === 'confirmPassword') {
            setConfirmPassword(e.target.value);

            if(e.target.value != password) {
                setErrorMatch(true);
            } else {
                setErrorMatch(false);
            }
        }
    }

    const showPass = (e: any) => {
        if(e.target.id == 'pass') setTogglePass(!togglePass);
        else if(e.target.id == 'confpass') setToggleConfirmPass(!toggleConfirmPass)
    }

    const validForm = () => {
        if(activeIndex == 2) {
            if(isSelected != '') {
                return false;
            } else {
                return true;
            }
        }

        if(activeIndex === 1) {
            if(
                isValid == false &&
                errorMatch == true &&
                password.length < 1 &&
                confirmPassword.length < 1
            ) {
                return true;
            }
            else if(
                isValid == true &&
                errorMatch == false &&
                password.length > 9 &&
                confirmPassword.length > 9
                ) {
                return false;
            }
            else {
                return true;
            }
        }

        if(activeIndex === 0) {
            if(isValid ) {
            // if(isValid && selectedLocation != null) {
                return false;
            } else {
                return true;
            }
        }
    }

    const selectedRole = (e: any) => {
        if(e.currentTarget.id == 'customer') {
            setIsSelected('4')
        }
        else if(e.currentTarget.id == 'provider') {
            setIsSelected('3')
        }
    }

    const renderButton = () => {
        if(activeIndex > 2) {
            return undefined;
        } else if(activeIndex === 2) {
            return (
                <div className='w-full flex justify-between'>
                    <Button 
                    type='button' 
                    onClick={backStep}
                    label='Back Step' 
                    icon='pi pi-angle-left' 
                    severity='secondary'
                    text 
                    className='w-auto p-3 text-sm lg:text-base rounded-xl' />
                    <Button 
                    type='button'
                    onClick={handleOnSubmit}
                    disabled={validForm()}
                    label='Sign Up' 
                    className='w-[50%] p-3 border-none bg-gradient-to-r from-sky-600 to-sky-300 hover:to-sky-400 shadow-lg shadow-sky-300/50 text-white text-sm lg:text-base rounded-xl' />
                </div>
            )
        } else if(activeIndex === 0) {
            return (
                <div className='w-full flex justify-end'>
                    <Button 
                    type='button' 
                    onClick={nextStep}
                    disabled={validForm()}
                    label='Next Step' 
                    className='w-full p-3 border-none bg-gradient-to-r from-sky-600 to-sky-300 hover:to-sky-400 shadow-lg shadow-sky-300/50 text-white text-sm lg:text-base rounded-xl' />
                </div>
            )
        } else {
           return (
                <div className='w-full flex justify-between'>
                    <Button 
                    type='button' 
                    onClick={backStep}
                    label='Back Step' 
                    icon='pi pi-angle-left' 
                    severity='secondary'
                    text 
                    className='w-auto p-3 text-sm lg:text-base rounded-xl' />
                    <Button 
                    type='button' 
                    onClick={nextStep}
                    disabled={validForm()}
                    label='Next Step' 
                    className='w-[50%] p-3 border-none bg-gradient-to-r from-sky-600 to-sky-300 hover:to-sky-400 shadow-lg shadow-sky-300/50 text-white text-sm lg:text-base rounded-xl' />
                </div>
           )
        }
    }

    const handleOnSubmit = () => {
        handleSubmit(onSubmit, onErrors)();
    }

  return (
    <>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <MenuBar linkMenu='Join Our Pro Network' urlMenu='/pro' setLoading={setLoading}/>
        <div className='w-full max-h-screen pt-24 flex items-center justify-center'>
            <div className='w-[90%] md:w-[75%] h-auto md:h-[600px] border rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 items-center overflow-hidden'>
                <div className='col-span-1 h-full p-5 flex flex-col'>
                    <p className='text-indigo-900 text-xl font-medium leading-9'>Sign Up</p>
                    <div className='w-[60%] mx-auto'>
                        <Steps model={items} activeIndex={activeIndex} readOnly={true} className='steps-signup' />
                    </div>
                    <div className='w-full h-full mt-3'>
                        <FormProvider {...methods}>
                            <form className="w-full h-full flex flex-col gap-3 justify-between">
                                {
                                    activeIndex === 0 ?
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputWrapper outerClassName="col-span-1">
                                                <Input
                                                    id='personName'
                                                    name='personName'
                                                    type='text'
                                                    placeholder='First Name *'
                                                    rules={{required: "Name is required"}}
                                                />
                                            {errors?.personName?.message && (
                                                <ErrorMessage>{errors.personName.message}</ErrorMessage>
                                            )}
                                        </InputWrapper>
                                        <InputWrapper outerClassName="col-span-1">
                                                <Input
                                                    id='lastname'
                                                    name='lastname'
                                                    type='text'
                                                    placeholder='Last Name *'
                                                    rules={{required: "Lastname is required"}}
                                                />
                                            {errors?.lastname?.message && (
                                                <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                                            )}
                                        </InputWrapper>
                                        <InputWrapper outerClassName="col-span-2">
                                                <Input
                                                    id='phone'
                                                    name='phone'
                                                    type='tel'
                                                    placeholder='Phone *'
                                                    rules={{
                                                        required: "Phone is required",
                                                        pattern: /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm
                                                    }}
                                                />
                                            {errors?.phone?.message && (
                                                <ErrorMessage>{errors.phone.message}</ErrorMessage>
                                            )}
                                        </InputWrapper>
                                        <div className='col-span-2'>
                                            <MapComponent 
                                            height='250px' 
                                            getAddress={getAddress} 
                                            selectedLocation={selectedLocation} 
                                            selectedPlace={selectedPlace} 
                                            setSelectedLocation={setSelectedLocation} 
                                            setSelectedPlace={setSelectedPlace} 
                                            setZip={setZip} />
                                        </div>
                                    </div>
                                    : activeIndex == 1 ?
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                                        <InputWrapper outerClassName="md:col-span-12">
                                                <Label id='email'>Email *</Label>
                                                <Input
                                                    id='email'
                                                    name='email'
                                                    type='email'
                                                    rules={{
                                                        required: "Email is required",
                                                        pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{3}$/g
                                                    }}
                                                />
                                            {errors?.email?.message && (
                                                <ErrorMessage>{errors.email.message}</ErrorMessage>
                                            )}
                                        </InputWrapper>
                                        <InputWrapper outerClassName="md:col-span-12">
                                                <Label id='password'>Password *</Label>
                                                <div className="p-password p-component p-inputwrapper p-input-icon-right">
                                                    <input
                                                        type={togglePass ? 'text' : 'password'}
                                                        name="password"
                                                        id="password"
                                                        value={password}
                                                        onChange={changePass}
                                                        pattern={`/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@$\-_]).{10,}$/g`}
                                                        required
                                                        className='p-inputtext p-component p-password-input w-full'
                                                        />
                                                    <i id='pass' className={togglePass ? 'pi pi-eye-slash cursor-pointer': 'pi pi-eye cursor-pointer'} onClick={showPass}></i>
                                                </div>
                                            <ul className='w-full grid grid-cols-1 md:grid-cols-2 md:gap-x-5 md:gap-y-2 text-xs'>
                                                <li><i className={password.match(/[a-z]/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> One letter (a-z)</li>
                                                <li><i className={password.match(/[A-Z]/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> One letter (A-Z)</li>
                                                <li><i className={password.match(/.{10,}/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> 10 characters minimum</li>
                                                <li><i className={password.match(/\d/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> One number (0-9)</li>
                                                <li><i className={password.match(/[!@$\-_]/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> One special character</li>
                                            </ul>
                                        </InputWrapper>
                                        <InputWrapper outerClassName="md:col-span-12">
                                                <Label id='c_password'>Confirm Password *</Label>
                                                <div className="p-password p-component p-inputwrapper p-input-icon-right">
                                                    <input
                                                        type={toggleConfirmPass ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={changePass}
                                                        pattern={`/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@$\-_]).{10,}$/g`}
                                                        required
                                                        className='p-inputtext p-component p-password-input w-full'
                                                        />
                                                    <i id='confpass' className={toggleConfirmPass ? 'pi pi-eye-slash cursor-pointer': 'pi pi-eye cursor-pointer'} onClick={showPass}></i>
                                                </div>
                                                <p className={errorMatch && confirmPassword != '' ? 'w-full text-sm text-red-500' : 'hidden'}>The passwords do not match</p>
                                        </InputWrapper>
                                    </div>
                                    : activeIndex == 2 ?
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full items-center px-3 py-3">
                                        <div id='customer' className={`col-span-1 flex flex-col items-center gap-5 p-5 rounded-md shadow-lg shadow-gray-300/30 hover:shadow-sky-300/30 cursor-pointer ${isSelected == '4' ? 'border border-sky-500 shadow-xl shadow-sky-300/30' : 'border-none'}`} onClick={selectedRole}>
                                            <div className='w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden flex items-center justify-center'>
                                                <img 
                                                id='customer' 
                                                src="https://i.postimg.cc/MGTBWVts/daniel-olah-Gx0-Zf-Lu-EX9-Y-unsplash.jpg" 
                                                alt="sailor"
                                                className='w-full h-full object-cover' />
                                            </div>
                                            <p id='customer' className='font-extrabold'>CUSTOMER</p>
                                        </div>
                                        <div id='provider' className={`col-span-1 flex flex-col items-center gap-5 p-5 rounded-md shadow-lg shadow-gray-300/30 hover:shadow-sky-300/30 cursor-pointer ${isSelected == '3' ? 'border border-sky-500 shadow-xl shadow-sky-300/30' : 'border-none'}`} onClick={selectedRole}>
                                            <div className='w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden flex items-center justify-center'>
                                                <img 
                                                id='provider' 
                                                src="https://i.postimg.cc/bJnsJTnR/ray-donnelly-rf-Djp-A-f-XY-unsplash.jpg"
                                                alt="provider"
                                                className='w-full h-full object-cover' />
                                            </div>
                                            <p id='provider' className='font-extrabold'>PROVIDER</p>
                                        </div>
                                    </div>
                                    : null
                                }
                                <div>
                                    {renderButton()}
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
                <div className='col-span-1 h-full hidden md:flex items-center justify-center overflow-hidden'>
                    <img 
                    src="https://i.postimg.cc/fTpjqHKw/nikldn-t-6-GW8-T6-Jsc-unsplash.jpg" 
                    alt="boat"
                    className='w-full object-cover' />
                </div>
            </div>
        </div>
    </>
  )
}

export default Register