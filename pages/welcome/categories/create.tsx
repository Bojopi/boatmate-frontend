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
    loading: boolean;
    setLoading: any;
    idCategory: number;
}

const Create: React.FC<CategoryProps> = ({idCategory = 0, categories, setCategories, loading, setLoading, toast}) => {
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
            setVisible(true);
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
        if (idCategory != 0) {
            resetAsyncForm(Number(idCategory));
        } else {
            setVisible(true);
        }
    };

    const closeModal = () => {
        reset();
        setVisible(false);
    }

    const footerContent = (
        <div className='w-full flex items-center justify-end'>
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
                idCategory === 0 ?
                <Button 
                type="button" 
                label="Add Category"  
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