import {useRef, useState} from 'react';
import LayoutPrincipal from "@/components/layoutPrincipal"
import { ErrorMessage } from "@/components/react-hook-form/error-message"
import { Input } from "@/components/react-hook-form/input"
import { InputWrapper } from "@/components/react-hook-form/input-wrapper"
import { Auth } from "@/hooks/auth"
import Link from "next/link"
import { Button } from "primereact/button"
import { FormProvider, useForm } from "react-hook-form"
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import ReCAPTCHA from "react-google-recaptcha";

export type FormProps = {
  address: string;
  subject: string;
}

const ForgetPass = () => {
  const {forgotPass} = Auth();

  const [email, setEmail] = useState<string>('');
  const [captchaDone, setCaptchaDone] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null)

  const methods = useForm<FormProps>({
    defaultValues: {
      address: '',
      subject: ''
    }
  });

  const {
    handleSubmit,
    setError,
    formState: {errors},
  } = methods;

  const subject = 'Reset your password'
  
  const onSubmit = (formData: FormProps) => {
    formData.subject = subject;

    setLoading(true);
    forgotPass(formData, setLoading, toast);
  };

  const onErrors = () => {
    toast.current!.show({severity:'error', summary:'Error', detail: 'User and/or password are not correct', life: 4000});
  };

  const onChange = () => {
    setCaptchaDone(true)
  }

  return (
    <LayoutPrincipal>
      <Spinner loading={loading} />
      <Toast ref={toast} />
      <div className='w-full h-[calc(100vh-180px)] md:h-auto flex flex-col items-center justify-center py-16'>
        <Link href={'/'} className='w-16 md:w-24' >
            <img
                src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/07d993cf-6c35-46b4-a3d8-2c26c53b2958/Biggest_BoatMate-removebg-preview.png?format=1500w"
                alt="logo"
                className='w-16 md:w-24'
            />
        </Link>
        <p className="text-2xl font-bold mt-5">Forgot Password</p>
        <Link href={'/login'} className="text-sm text-[#00CBA4] font-medium" >Or Login</Link>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onErrors)} className="w-[80%] md:w-[50%] lg:w-[30%] mt-5" >
            <InputWrapper outerClassName="w-full">
                <Input
                    id='address'
                    name='address'
                    type='email'
                    placeholder="Email address"
                    rules={{required: "Email is required"}}
                />
                {errors?.address?.message && (
                    <ErrorMessage>{errors.address.message}</ErrorMessage>
                )}
            </InputWrapper>
            <div className='w-full flex justify-center mt-5'>
              <ReCAPTCHA
                sitekey="6LcMAZAmAAAAAJtM6Sbb9eni8LbMkL1sg9-Ii2Ae"
                onChange={onChange}
              />
            </div>
            <Button type="submit" label="Send Email" icon='pi pi-lock' className="bg-[#109EDA] w-full mt-5" disabled={!captchaDone}></Button>
          </form>
        </FormProvider>
      </div>
    </LayoutPrincipal>
  )
}

export default ForgetPass