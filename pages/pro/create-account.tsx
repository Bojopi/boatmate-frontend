import React, { useState, useContext, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import LayoutPro from '@/components/layoutPro';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from '@/components/react-hook-form/label';
import { Input } from '@/components/react-hook-form/input';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Auth } from '@/hooks/auth';
import { useRouter } from 'next/router';
import { FormContext } from '@/context/FormContext';
import { Button } from 'primereact/button';
import { ErrorMessage } from '@/components/react-hook-form/error-message';
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';

export type FormProps = {
    email: string;
    password: string;
    idRole: string;
    personName: string;
    lastname: string;
    phone: string;
    lat: number;
    lng: number;
    providerName: string;
    services: any;
}

const CreateAccount = () => {

    const { createUSer, googleLogin } = Auth();
    const { personName, lastname, phone, lat, lng, providerName, services, password, setPassword } = useContext(FormContext);

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const router = useRouter();

    useEffect(() => {
        reset({
            email: '',
            password: '',
            personName,
            lastname,
            phone,
            lat,
            lng,
            providerName,
            services,
        })
    }, [])

    const methods = useForm<FormProps>({
        defaultValues: {
            email: '',
            password: '',
            idRole: "3",
            personName: '',
            lastname: '',
            phone: '',
            lat: 0,
            lng: 0,
            providerName: '',
            services: []
        },
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const onSubmit = (data: FormProps) => {
        setLoading(true);
        data.password = password;
        data.idRole = "3";
        // createUSer(data, toast, setLoading);
    }
    
    const onErrors = () => {}

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
        <LayoutPro footer={2}>
            <Spinner loading={loading} />
            <Toast ref={toast} />
            <GoogleOAuthProvider clientId="376843512756-0sue8frqribicc3m7q5ib5ss4m7jkslg.apps.googleusercontent.com">
                <div className='w-full flex justify-center py-5 md:py-10 bg-gray-100'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-full md:w-2/3 lg:w-1/2 mx-5 grid grid-cols-12 gap-2 shadow-lg py-5 px-5 lg:px-10 rounded-md border bg-white border-b-4 border-b-[#00CBA4]">
                            <p className="col-span-12 font-bold md:mb-5 text-sm lg:text-base text-center">Create your account</p>
                            <InputWrapper outerClassName="col-span-12">
                                <Label id="email">Email</Label>
                                <Input 
                                type='email' 
                                id="email" 
                                name='email' 
                                placeholder='email@email.com'
                                rules={{
                                    required: 'Email is required'
                                }} />
                                {errors?.email?.message && (
                                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                                )}
                            </InputWrapper>
                            <InputWrapper outerClassName="col-span-12">
                                <Label id="password">Password</Label>
                                <Password 
                                id='password' 
                                name='password'
                                toggleMask 
                                placeholder='pass'
                                required
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if(e.target.value == null) {
                                        setPassword('');
                                    } else {
                                        setPassword(e.target.value);
                                    }
                                }}
                                mediumRegex='/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/g'
                                strongRegex='/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/g' />
                            </InputWrapper>
                            <div className="col-span-12 flex flex-col gap-2 text-sm">
                                <p>Your password must:</p>
                                <ul className='list-disc list-inside'>
                                    <li>be 8 to 72 characters long</li>
                                    <li>not contain your name or email</li>
                                    <li>not be commonly used, easily guessed or contain any variation of the word &quot;BoatMate&quot;</li>
                                </ul>
                                <p>By clicking Create Account, you agree to the <Link href={''} className='text-[#109EDA] underline font-medium' >Terms of Use</Link> and <Link href={''} className='text-[#109EDA] underline font-medium' >Privacy Policy</Link>.</p>
                            </div>
                            <Button type='submit' className="col-span-1 md:col-span-12 flex justify-center items-center mt-5 border-2 border-[#373A85] bg-[#373A85] text-white font-bold py-2 rounded-md hover:bg-[#212359] text-sm lg:text-base text-center">Create Account</Button>
                            <Divider align='center' className='col-span-1 md:col-span-12 my-2'>
                                <p className='text-gray-500 text-sm font-medium'>OR</p>
                            </Divider>
                            <p className='col-span-12 text-sm'>By clicking Sign up with Google, you agree to the <Link href={''} className='text-[#109EDA] underline font-medium' >Terms of Use</Link> and <Link href={''} className='text-[#109EDA] underline font-medium' >Privacy Policy</Link>.</p>
                            <div className='col-span-12 w-full flex flex-row justify-center'>
                                <GoogleLogin onError={handleError} onSuccess={handleSuccess} />
                            </div>
                            <div className="col-span-12 flex flex-col items-center mt-5">
                                <p className="text-xs lg:text-sm">Already have an account? <Link href={''} className="text-[#109EDA] font-medium">Log in</Link>.</p>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </GoogleOAuthProvider>
        </LayoutPro>
    </>
  )
}

export default CreateAccount;