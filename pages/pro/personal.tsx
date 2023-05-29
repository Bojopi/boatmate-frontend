
import React, { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import LayoutPro from '@/components/layoutPro';
import { FormContext } from '@/context/FormContext';
import { Button } from 'primereact/button';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from '@/components/react-hook-form/label';
import { Input } from '@/components/react-hook-form/input';
import { useRouter } from 'next/router';

export type FormProps = {
    business_name: string;
    first_name: string;
    last_name: string;
    phone: string;
}

const FormServiceTwo = () => {

    const { setProviderName, setPersonName, setLastname, setPhone } = useContext(FormContext);

    const router = useRouter();

    const methods = useForm<FormProps>({
        defaultValues: {
            business_name: '',
            first_name: '',
            last_name: '',
            phone: ''
        },
    });

    const {
        handleSubmit,
    } = methods;

    const onSubmit = (data: FormProps) => {
        setProviderName(data.business_name);
        setPersonName(data.first_name);
        setLastname(data.last_name);

        router.push('/pro/create-account');
    }

    const onErrors = () => {}

  return (
    <>
        <LayoutPro footer={2}>
            <div className='w-full h-full py-10 px-5 md:px-0 flex justify-center bg-gray-100'>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-full md:w-2/3 p-5 md:p-10 grid grid-cols-1 md:grid-cols-12 md:gap-3 rounded-md border bg-white border-b-4 border-b-[#00CBA4]">
                        <p className="col-span-1 md:col-span-12 font-bold mb-3 lg:mb-5 text-sm lg:text-base text-center">How Should Boaters Contact You?</p>
                        <InputWrapper outerClassName="col-span-1 md:col-span-6">
                            <Label id="business_name">Business Name</Label>
                            <Input type='text' id="business_name" name='business_name' placeholder='Company other' />
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-1 md:col-span-6">
                            <Label id="username">Phone Number</Label>
                            <InputNumber
                            id="phone"
                            placeholder="9999999"
                            useGrouping={false}
                            className='w-full'
                            onChange={(e: InputNumberChangeEvent) => {
                                if(e.value == null) {
                                    setPhone('');
                                } else {
                                    setPhone(String(e.value));
                                }
                            }} />
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-1 md:col-span-6">
                            <Label id="first_name">First Name</Label>
                            <Input type='text' id="first_name" name='first_name' placeholder='Ane' />
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-1 md:col-span-6 flex flex-col gap-2">
                            <Label id="last_name">Last Name</Label>
                            <Input type='text' id="last_name" name='last_name' placeholder='Smith' />
                        </InputWrapper>
                        <div className="col-span-1 md:col-span-12 flex flex-row items-center justify-around mt-5 mb-3">
                            <Button type='button' outlined onClick={(e: any) => {}} className="border-2 border-[#373A85] text-[#373A85] font-bold px-10 py-1 rounded-md hover:bg-[#c6c7ee43] text-sm lg:text-base">Back</Button>
                            <Button type='submit' className="border-2 border-[#373A85] bg-[#373A85] text-white font-bold px-10 py-1 rounded-md hover:bg-[#212359] text-sm lg:text-base">Next</Button>
                        </div>
                        <div className="col-span-1 md:col-span-12 flex flex-col items-center gap-1">
                            <p className="text-xs lg:text-sm font-medium">Problems Registering?</p>
                            <p className="text-xs lg:text-sm">Contact us at <span className="text-[#109EDA] font-medium">1-813-766-7565</span></p>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </LayoutPro>
    </>
  )
}

export default FormServiceTwo;