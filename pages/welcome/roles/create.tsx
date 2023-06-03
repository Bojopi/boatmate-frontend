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
    setLoading: any;
    idRole: number;
}

const Create: React.FC<RoleProps> = ({idRole = 0, roles, setRoles, setLoading, toast}) => {
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

            reset(response.data.role)
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
        setVisible(true);
        if (idRole != 0) {
            resetAsyncForm(Number(idRole));
        }
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div>
            <Button type="button" label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
            <Button type="button" label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} className="p-button-success" autoFocus />
        </div>
    );

    return (
        <>
            {
                idRole === 0 ?
                <Button type="button" label="Create Role" outlined icon="pi pi-plus" onClick={openModal} />
                : 
                <Button type="button" icon="pi pi-pencil" className="p-button-success" text tooltip='Edit' onClick={openModal}
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