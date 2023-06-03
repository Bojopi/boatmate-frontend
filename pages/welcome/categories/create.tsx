import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { InputWrapper } from '../../../components/react-hook-form/input-wrapper';
import { Label } from "@/components/react-hook-form/label";
import { Input } from "@/components/react-hook-form/input";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { Categories } from "@/hooks/categories";

export type FormProps = {
    categoryName: string;
}

export type CategoryProps = {
    categories: any;
    setCategories: any;
    toast: any;
    setLoading: any;
    idCategory: number;
}

const Create: React.FC<CategoryProps> = ({idCategory = 0, categories, setCategories, setLoading, toast}) => {
    const { show, createCategory, updateCategory } = Categories();

    const [visible, setVisible] = useState(false);

    const methods = useForm<FormProps>({
        defaultValues: {
            categoryName: '',
        }
    });

    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idCategory: number) => {
        const response = await show(idCategory);
        if(response.status === 200) {
            response.data.category.categoryName = response.data.category.category_name;
            reset(response.data.category);
        }
    }

    const onSubmit = (formData: FormProps) => {
        setLoading(true);
        if(idCategory == 0) {
            createCategory(formData, categories, setCategories, setLoading, toast, setVisible);
        } else {
            updateCategory(idCategory, formData, categories, setCategories, setLoading, toast, setVisible);
        }
    };

    const onErrors = () => {};

    const openModal = async () => {
        reset();
        setVisible(true);
        if (idCategory != 0) {
            resetAsyncForm(Number(idCategory));
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
                idCategory === 0 ?
                <Button type="button" label="Create Category"  className="p-button-success" outlined icon="pi pi-plus" onClick={openModal} />
                : 
                <Button type="button" icon="pi pi-pencil" text tooltip='Edit' tooltipOptions={{position: 'top'}} onClick={openModal}
                />
            }

            <Dialog header={idCategory === 0 ? "New Category" : "Edit Category"} visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="categoryName">Category name</Label>
                            <Input 
                            id="categoryName"
                            name="categoryName"
                            type="text"
                            placeholder="Category name..."
                            rules={{
                                required: 'Category name is required'
                            }}
                            />
                            {errors.categoryName?.message && (
                                <ErrorMessage>{errors.categoryName.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Create