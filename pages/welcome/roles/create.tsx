import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Roles } from "@/hooks/roles";
import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from '../../../components/react-hook-form/input-wrapper';
import { Label } from "@/components/react-hook-form/label";
import { Input } from "@/components/react-hook-form/input";
import { ErrorMessage } from "@/components/react-hook-form/error-message";

export type FormProps = {
    roleDescription: string;
}

export type RoleProps = {
    roles: any;
    setRoles: any;
    toast: any;
    loading: boolean;
    setLoading: any;
    idRole: number;
}

const Create: React.FC<RoleProps> = ({idRole = 0, roles, setRoles, loading, setLoading, toast}) => {
    const {createRole, show, updateRole} = Roles();

    const [visible, setVisible] = useState(false);

    const methods = useForm<FormProps>({
        defaultValues: {
            roleDescription: ''
        }
    });

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idRole: any) => {
        const response = await show(idRole);
        if(response.status === 200) {
            response.data.role.roleDescription = response.data.role.role_description;

            reset(response.data.role);
            setVisible(true);
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true)
        if(idRole == 0) {
            createRole(formData, roles, setRoles, setLoading, toast);
            setVisible(false);
        } else {
            updateRole(Number(idRole), formData, roles, setRoles, setLoading, toast);
            setVisible(false);
        }
    };

    const onErrors = () => {};

    const openModal = async () => {
        if (idRole != 0) {
            resetAsyncForm(Number(idRole));
        } else {
            setVisible(true);
        }
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div>
            <Button type="button" label="Cancel" icon="pi pi-times" severity="danger" disabled={loading} onClick={closeModal} className="p-button-text" />
            {
                loading ?
                    <Button type="button" className="p-button-success flex items-center" disabled>
                        <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium"> Processing... </span>
                    </Button>
                :
                <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" autoFocus />
            }
        </div>
    );

    return (
        <>
            {
                idRole === 0 ?
                <Button 
                type="button" 
                label="Add Role"  
                className="px-5 py-2.5 bg-emerald-400 rounded-md border border-emerald-400 text-white text-sm"
                onClick={openModal} />
                : 
                <Button 
                type="button" 
                icon="pi pi-pencil" 
                outlined
                tooltip='Edit' 
                tooltipOptions={{position: 'top'}} 
                className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                onClick={openModal}
                />
            }

            <Dialog header={idRole === 0 ? 'New Role' : 'Edit Role'} visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="roleDescription">Role name</Label>
                            <Input 
                            id="roleDescription"
                            name="roleDescription"
                            type="text"
                            placeholder="Administrator"
                            />
                            {errors.roleDescription?.message && (
                                <ErrorMessage>{errors.roleDescription.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create