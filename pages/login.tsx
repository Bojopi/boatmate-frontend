import React, { useState, useRef } from 'react';
import {FormProvider, useForm} from "react-hook-form";
import Link from 'next/link';
import Head from 'next/head';

import { Toast } from 'primereact/toast';

import { InputWrapper } from '../components/react-hook-form/input-wrapper';
import { Label } from '../components/react-hook-form/label';
import { Input } from '../components/react-hook-form/input';
import { ErrorMessage } from '../components/react-hook-form/error-message';
import Spinner from '../components/spinner';
import { Divider } from 'primereact/divider';

import { Auth } from '@/hooks/auth';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useRouter } from 'next/router';


export type FormProps = {
    email: string;
    password: string;
}

const Login: React.FC = () => {

    const { login, googleLogin } = Auth();

    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const methods = useForm<FormProps>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        handleSubmit,
        setError,
        formState: {errors},
    } = methods;

    const onSubmit = (formData: FormProps) => {
        setLoading(true);
        if([formData.email, formData.password].includes('')) {
            onErrors();
            return
        } else {
            login(formData, toast, setLoading);
        }
    };

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'User and/or password are not correct', life: 4000});
    };

    function handleError() {
        console.log('Login failed')
    }

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        const response = await googleLogin(credentialResponse);
        if(response.status == 200) {
            if(response.data.newUser) {
                router.push('/preferences');
            } else {
                router.push('/welcome');
            }

            setLoading(false);
        }
    }

  return (
    <>
        <GoogleOAuthProvider clientId="376843512756-0sue8frqribicc3m7q5ib5ss4m7jkslg.apps.googleusercontent.com">
            <script src="https://accounts.google.com/gsi/client" async defer></script>
            <Head>
                <title>BoatMate</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/png" href="/Biggest_BoatMate-removebg-preview.ico" />
            </Head>
            <Spinner loading={loading} />
            <Toast ref={toast} />
            <div
                className="w-full h-1/3 shadow-md md:h-screen absolute bg-no-repeat bg-cover bg-center"
                style={{'backgroundImage': "url('https://i.postimg.cc/qv8LyXWs/tomas-malik-FHAHn-F9-C0-Sw-unsplash.jpg')"}}>
                <div></div>
            </div>
            <div className="w-full h-screen absolute p-5 flex justify-center items-center">
                <div className='bg-white w-full md:w-2/4 rounded-lg shadow-2xl p-10 flex flex-col items-center'>
                    <div className='w-full flex justify-between'>
                        <Link href={'/'} className='w-16 lg:w-24' >
                            <img
                                src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
                                alt="logo"
                                className='w-16 lg:w-24'
                            />
                        </Link>
                        <h1 className='mt-5 text-xl md:text-4xl font-semibold mr-5' style={{'color': '#373A85'}}>SIGN IN</h1>
                    </div>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-full md:mt-5">

                            <div className="grid grid-cols-1 gap-y-6 p-5">
                                <InputWrapper outerClassName="col-span-12">
                                        <Label id='email'>Email</Label>
                                        <Input
                                            id='email'
                                            name='email'
                                            type='email'
                                            rules={{required: "Email is required"}}
                                        />
                                    {errors?.email?.message && (
                                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                                    )}
                                </InputWrapper>
                                <InputWrapper outerClassName="col-span-12">
                                        <Label id="password">Password</Label>
                                        <Input
                                            id='password'
                                            name='password'
                                            type='password'
                                            rules={{required: "Password is required"}}
                                        />
                                    {errors?.password?.message && (
                                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                                    )}
                                </InputWrapper>
                                <p className='w-full text-center text-xs lg:text-sm font-medium text-[#373A85]'>New to BoatMate?
                                <Link href='/register' className='text-[#00CBA4] hover:underline'> Create account</Link>
                                </p>
                            </div>

                            <Divider align='center'>
                                <p className='text-gray-400 text-sm'>OR</p>
                            </Divider>

                            <div className='w-full flex flex-row justify-center'>
                                <GoogleLogin onError={handleError} onSuccess={handleSuccess} />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <Link
                                    className='text-xs lg:text-sm font-medium text-[#00CBA4] hover:underline'
                                    href={'/forgot'}>
                                        Forgot password?
                                </Link>
                                <button type='submit' className='p-3 bg-[#109EDA] hover:bg-[#0E8FC7] text-white text-sm lg:text-base rounded-md hover:transition'>SIGN IN</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </GoogleOAuthProvider>
    </>
  )
}

export default Login