
import Layout from '@/components/layout';
import MenuBar from '@/components/menuBar';
import React from 'react'
import FooterComponentThree from '../../components/footer-3';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

export type FormProps = {
    business_name: string;
    first_name: string;
    last_name: string;
    phone: string;
    zip: string;
}

const CreateAccount = () => {

    const methods = useForm<FormProps>({
        defaultValues: {
            business_name: '',
            first_name: '',
            last_name: '',
            phone: '',
            zip: ''
        },
    });

    const {
        handleSubmit,
        setError,
        formState: {errors},
    } = methods;

    const onSubmit = () => {}
    
    const onErrors = () => {}

  return (
    <>
        <Layout>
            <MenuBar linkMenu='Sign In' urlMenu='/login' menuItem={false}/>
            <div className='w-full flex justify-center pb-10 pt-20 lg:pt-32 bg-gray-100'>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-11/12 lg:w-1/3 grid gap-2 grid-cols-1 lg:grid-cols-4 shadow-lg py-5 px-5 lg:px-10 rounded-md border bg-white border-b-4 border-b-[#00CBA4]">
                        <p className="col-span-4 font-bold mb-3 lg:mb-5 text-sm lg:text-base text-center">Create your account</p>
                        <div className="col-span-4 flex flex-col gap-2">
                            <label htmlFor="username">Email</label>
                            <InputText id="business_name" />
                        </div>
                        <div className="col-span-4 flex flex-col gap-2">
                            <label htmlFor="password">Password</label>
                            <div className='flex flex-row '>
                                <Password id='password' toggleMask className='' />
                            </div>
                        </div>
                        <div className="col-span-4 flex flex-col gap-2 text-sm">
                            <p>Your password must:</p>
                            <ul className='list-disc list-inside'>
                                <li>be 8 to 72 characters long</li>
                                <li>not contain your name or email</li>
                                <li>not be commonly used, easily guessed or contain any variation of the word "BoatMate"</li>
                            </ul>
                            <p>By clicking Create Account, you agree to the <Link href={''} className='text-[#109EDA] underline font-medium' >Terms of Use</Link> and <Link href={''} className='text-[#109EDA] underline font-medium' >Privacy Policy</Link>.</p>
                        </div>
                        <Link href={'/admin'} className="col-span-4 mt-5 border-2 border-[#373A85] bg-[#373A85] text-white font-bold py-2 rounded-md hover:bg-[#212359] text-sm lg:text-base text-center">Create Account</Link>
                        <Divider align='center' className='col-span-4 my-2'>
                            <p className='text-gray-500 text-sm font-medium'>OR</p>
                        </Divider>
                        <p className='col-span-4 text-sm'>By clicking Sign up with Google, you agree to the <Link href={''} className='text-[#109EDA] underline font-medium' >Terms of Use</Link> and <Link href={''} className='text-[#109EDA] underline font-medium' >Privacy Policy</Link>.</p>
                        <Link href={'/pro/form-2'} className="col-span-4 mt-5 border-2 border-gray-500 bg-white text-gray-500 font-bold py-2 rounded-md hover:bg-[#e4e4e443] text-sm lg:text-base text-center flex flex-row items-center justify-center gap-3"><i className='pi pi-google'></i>Sign up with Google</Link>
                        <div className="col-span-4 flex flex-col items-center mt-5">
                            <p className="text-xs lg:text-sm">Already have an account? <Link href={''} className="text-[#109EDA] font-medium">Log in</Link>.</p>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <FooterComponentThree />
        </Layout>
    </>
  )
}

export default CreateAccount;