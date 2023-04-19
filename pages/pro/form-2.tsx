
import Layout from '@/components/layout';
import MenuBar from '@/components/menuBar';
import React from 'react'
import FooterComponentThree from '../../components/footer-3';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';

export type FormProps = {
    business_name: string;
    first_name: string;
    last_name: string;
    phone: string;
    zip: string;
}

const FormServiceTwo = () => {

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
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-11/12 lg:w-1/3 grid gap-2 grid-cols-1 lg:grid-cols-4 shadow-lg py-5 px-9 lg:px-14 rounded-md border bg-white border-b-4 border-b-[#00CBA4]">
                        <p className="col-span-4 font-bold mb-3 lg:mb-5 text-sm lg:text-base text-center">How Should Boaters Contact You?</p>
                        <div className="col-span-4 flex flex-col gap-2">
                            <label htmlFor="username">Business Name</label>
                            <InputText id="business_name" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <label htmlFor="username">First Name</label>
                            <InputText id="first_name" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <label htmlFor="username">Last Name</label>
                            <InputText id="last_name" />
                        </div>
                        <div className="col-span-3 flex flex-col gap-2">
                            <label htmlFor="username">Phone Number</label>
                            <InputMask id="phone" mask="(999) 999-9999" placeholder="(999) 999-9999" />
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                            <label htmlFor="username">Zip Code</label>
                            <InputText id="zip" />
                        </div>
                        <div className="col-span-4 flex flex-row items-center justify-around mt-5 mb-3">
                            <Link href={'/pro/form-1'} className="border-2 border-[#373A85] text-[#373A85] font-bold px-10 py-1 rounded-md hover:bg-[#c6c7ee43] text-sm lg:text-base">Back</Link>
                            <Link href={'/pro/create-account'} className="border-2 border-[#373A85] bg-[#373A85] text-white font-bold px-10 py-1 rounded-md hover:bg-[#212359] text-sm lg:text-base">Next</Link>
                        </div>
                        <div className="col-span-4 flex flex-col items-center gap-1">
                            <p className="text-xs lg:text-sm font-medium">Problems Registering?</p>
                            <p className="text-xs lg:text-sm">Contact us at <span className="text-[#109EDA] font-medium">1-813-766-7565</span></p>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <FooterComponentThree />
        </Layout>
    </>
  )
}

export default FormServiceTwo;