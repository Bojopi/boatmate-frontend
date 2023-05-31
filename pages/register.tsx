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

    const onSubmit = (formData: FormProps) => {
        formData.idRole = isSelected;
        formData.password = password;

        formData.lat = selectedLocation.lat ? selectedLocation.lat : ''
        formData.lng = selectedLocation.lng ? selectedLocation.lng : ''
        formData.zip = zip;

        console.log(formData);
        setLoading(true);
        createUSer(formData, toast, setLoading)
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
            if(isValid && selectedLocation != null) {
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
                    <button
                        type='button'
                        className='p-3 text-xs md:text-base bg-gray-400 hover:bg-gray-600 text-white rounded-md hover:transition disabled:bg-gray-300'
                        onClick={backStep}>
                            Back Step
                    </button>
                    <button
                        type='button'
                        className='p-3 text-xs md:text-base bg-[#109EDA] hover:bg-[#0E8FC7] text-white rounded-md hover:transition disabled:bg-gray-300'
                        disabled={validForm()}
                        onClick={handleOnSubmit}>
                            SING UP
                    </button>
                </div>
            )
        } else if(activeIndex === 0) {
            return (
                <div className='w-full flex justify-end'>
                    <button
                        type='button'
                        className='p-3 text-xs md:text-base bg-[#109EDA] hover:bg-[#0E8FC7] text-white rounded-md hover:transition disabled:bg-gray-300'
                        onClick={nextStep}
                        disabled={validForm()}>
                            Next Step
                    </button>
                </div>
            )
        } else {
           return (
                <div className='w-full flex justify-between'>
                    <button
                        type='button'
                        className='p-3 text-xs md:text-base bg-gray-400 hover:bg-gray-600 text-white rounded-md hover:transition disabled:bg-gray-400'
                        onClick={backStep}>
                            Back Step
                    </button>
                    <button
                        type='button'
                        className='p-3 text-xs md:text-base bg-[#109EDA] hover:bg-[#0E8FC7] text-white rounded-md hover:transition disabled:bg-gray-400'
                        onClick={nextStep}
                        disabled={validForm()}>
                            Next Step
                    </button>
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
        <div
            className="w-full h-1/3 shadow-md md:h-screen absolute top-0 left-0 bg-no-repeat bg-cover bg-center"
            style={{'backgroundImage': "url('https://i.postimg.cc/qv8LyXWs/tomas-malik-FHAHn-F9-C0-Sw-unsplash.jpg')"}}>
        </div>
        <div className="container h-screen mx-auto flex justify-center items-center">
            <div className='bg-white z-10 w-11/12 md:w-1/2 rounded-lg md:rounded-none shadow-2xl py-4 md:py-5 px-5 md:px-10 flex flex-col items-center'>
                <div className='w-full flex justify-between'>
                    <img
                        src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
                        alt="logo"
                        className='w-16 md:w-20'
                    />
                    <h1 className='mt-2 md:mt-5 text-xl md:text-2xl font-semibold mr-5' style={{'color': '#373A85'}}>SIGN UP</h1>
                </div>
                <div className='w-full mt-4'>
                    <Steps model={items} activeIndex={activeIndex} readOnly={true} />
                </div>
                <div className='w-full'>
                    <FormProvider {...methods}>
                        <form className="w-full">
                            {
                                activeIndex === 0 ?
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                    <InputWrapper outerClassName="md:col-span-6">
                                            <Label id='personName'>Name *</Label>
                                            <Input
                                                id='personName'
                                                name='personName'
                                                type='text'
                                                rules={{required: "Name is required"}}
                                            />
                                        {errors?.personName?.message && (
                                            <ErrorMessage>{errors.personName.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <InputWrapper outerClassName="md:col-span-6">
                                            <Label id='lastname'>Lastname *</Label>
                                            <Input
                                                id='lastname'
                                                name='lastname'
                                                type='text'
                                                rules={{required: "Lastname is required"}}
                                            />
                                        {errors?.lastname?.message && (
                                            <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <InputWrapper outerClassName="md:col-span-12">
                                            <Label id='phone'>Phone *</Label>
                                            <Input
                                                id='phone'
                                                name='phone'
                                                type='tel'
                                                rules={{
                                                    required: "Phone is required",
                                                    pattern: /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm
                                                }}
                                            />
                                        {errors?.phone?.message && (
                                            <ErrorMessage>{errors.phone.message}</ErrorMessage>
                                        )}
                                    </InputWrapper>
                                    <div className='md:col-span-12'>
                                        <Label>Address *</Label>
                                        <MapComponent height='250px' getAddress={getAddress} selectedLocation={selectedLocation} selectedPlace={selectedPlace} setSelectedLocation={setSelectedLocation} setSelectedPlace={setSelectedPlace} setZip={setZip} />
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
                                                    pattern='/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/g'
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
                                            <li><i className={password.match(/[@$\-_]/gm) != null ? "pi pi-check text-green-500": 'pi pi-times text-red-500'} style={{'fontSize': '12px'}}></i> One special character</li>
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
                                                    pattern='/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/g'
                                                    required
                                                    className='p-inputtext p-component p-password-input w-full'
                                                    />
                                                <i id='confpass' className={toggleConfirmPass ? 'pi pi-eye-slash cursor-pointer': 'pi pi-eye cursor-pointer'} onClick={showPass}></i>
                                            </div>
                                            <p className={errorMatch && confirmPassword != '' ? 'w-full text-sm text-red-500' : 'hidden'}>The passwords do not match</p>
                                    </InputWrapper>
                                </div>
                                : activeIndex == 2 ?
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                                    <h1 className='md:col-span-12 mt-5 text-lg md:text-2xl font-semibold text-center' style={{'color': '#373A85'}}>Which best describes your role?</h1>
                                    <div className='md:col-span-12 w-full flex flex-row items-center justify-center gap-3 md:gap-20'>
                                        <div id='customer' className={`flex flex-col items-center gap-5 p-5 rounded-md shadow-md border hover:bg-green-100 cursor-pointer ${isSelected == '4' ? 'bg-green-100' : 'bg-white'}`} onClick={selectedRole}>
                                            <img id='customer' src="https://i.postimg.cc/Zn2fvXhV/sailor.png" width={100} height={100} alt="sailor" />
                                            <p id='customer' className='font-extrabold text-[#373A85]'>BOAT OWNER</p>
                                        </div>
                                        <div id='provider' className={`flex flex-col items-center gap-5 p-5 rounded-md shadow-md border hover:bg-green-100 cursor-pointer ${isSelected == '3' ? 'bg-green-100' : 'bg-white'}`} onClick={selectedRole}>
                                            <img id='provider' src="https://i.postimg.cc/L8h5v7Lm/cargo-ship.png" width={100} height={100} alt="provider" />
                                            <p id='provider' className='font-extrabold text-[#373A85]'>PROVIDER</p>
                                        </div>
                                    </div>
                                </div>
                                : null
                            }
                            <p className='w-full text-center text-xs md:text-sm font-medium text-[#373A85] mt-3'>Already have an account? <Link href={'/login'} className='text-[#00CBA4] hover:underline'>Sign in now</Link></p>
                            <div className="mt-4">
                                {renderButton()}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register