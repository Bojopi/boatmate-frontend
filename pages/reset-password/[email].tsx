import {useRef, useState, useEffect} from 'react';
import LayoutPrincipal from "@/components/layoutPrincipal"
import { InputWrapper } from "@/components/react-hook-form/input-wrapper"
import Link from "next/link"
import { Button } from "primereact/button"
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import { Label } from '@/components/react-hook-form/label';
import { Users } from '@/hooks/user';
import { useRouter } from 'next/router';

const ForgetPass = () => {
    const {resetPassword} = Users();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [togglePass, setTogglePass] = useState<boolean>(false);
    const [toggleConfirmPass, setToggleConfirmPass] = useState<boolean>(false);
    const [errorMatch, setErrorMatch] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    const router = useRouter();

    useEffect(() => {
        if(router.query.email) {
            setEmail(String(router.query.email).split(' ')[0]);
        }
    }, [router.query.email]);

    const onSubmit = () => {
        const data = {
            email: email,
            password: password
        }

        setLoading(true);
        resetPassword(data, setLoading, toast);
    };

    const changePass = (e: any) => {
        if(e.target.id === 'password') setPassword(e.target.value);
        else if(e.target.id === 'confirmPassword') {
            setConfirmPassword(e.target.value);

            if(e.target.value != password) {
                setErrorMatch(true);
            } else {
                setErrorMatch(false);
                setDisableButton(false);
            }
        }
    }

    const showPass = (e: any) => {
        if(e.target.id == 'pass') setTogglePass(!togglePass);
        else if(e.target.id == 'confpass') setToggleConfirmPass(!toggleConfirmPass)
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
            <p className="text-2xl font-bold mt-5">Reset Password</p>
            <form className="w-[80%] md:w-[50%] lg:w-[30%] mt-5" >
                <InputWrapper outerClassName="w-full">
                    <Label id='password'>New Password *</Label>
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
                <InputWrapper outerClassName="w-full mt-5">
                        <Label id='c_password'>Confirm New Password *</Label>
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
                <Button type="button" label="Reset password" icon='pi pi-lock' className="bg-[#109EDA] w-full mt-5" onClick={onSubmit} disabled={disableButton}></Button>
            </form>
        </div>
        </LayoutPrincipal>
    )
}

export default ForgetPass