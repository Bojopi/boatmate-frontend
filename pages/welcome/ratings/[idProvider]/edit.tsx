import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@/components/react-hook-form/label";
import { ErrorMessage } from "@/components/react-hook-form/error-message";
import { InputWrapper } from "@/components/react-hook-form/input-wrapper";
import { Ratings } from "@/hooks/rating";
import { Textarea } from "@/components/react-hook-form/textarea";
import { Rating } from "primereact/rating";

export type FormProps = {
    rating: number;
    review: string;
}

export type RatingProps = {
    ratings: any;
    setRatings: any;
    toast: any;
    setLoading: any;
    idRating: number;
    type?: string;
}

const Edit: React.FC<RatingProps> = ({idRating = 0, ratings, setRatings, setLoading, toast, type = ''}) => {
    const { show, updateRating } = Ratings();

    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState<number>(0);

    const methods = useForm<FormProps>({
        defaultValues: {
            review: '',
            rating: 0
        }
    });

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const resetAsyncForm = async (idRating: any) => {
        const response = await show(idRating);
        if(response.status === 200) {
            setRating(response.data.rating.rating);
            reset(response.data.rating);
        }
    }

    const onSubmit = (formData: FormProps) => {
        formData.rating = rating ? rating : 0;
        setLoading(true)
        updateRating(Number(idRating), formData, ratings, setRatings, toast, setLoading, setVisible);
    };

    const onErrors = () => {};

    const openModal = async () => {
        reset();
        setRating(0);
        setVisible(true);
        resetAsyncForm(Number(idRating))
    };

    const closeModal = () => {
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
            <Button type="button" icon="pi pi-pencil" className="p-button-success" rounded tooltip='Edit' tooltipOptions={{position: 'top'}} onClick={openModal}
            />

            <Dialog header={'Edit Rating'} visible={visible} className="w-[90vw] md:w-[50vw]" onHide={() => setVisible(false)} footer={footerContent}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-1 lg:grid-cols-12 p-5 gap-3'>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="review">Review:</Label>
                            <Textarea 
                            id='review'
                            name='review'
                            placeholder="Review..."
                            rows={3}
                            rules={{
                                required: 'Review is required'
                            }}
                            />
                            {errors.review?.message && (
                                <ErrorMessage>{errors.review.message}</ErrorMessage>
                            )}
                        </InputWrapper>
                        <InputWrapper outerClassName="col-span-12">
                            <Label id="review">Rating:</Label>
                            <Rating 
                            id='review'
                            name='review'
                            value={rating}
                            onChange={(e: any) => setRating(e.value)}
                            />
                        </InputWrapper>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    )
}

export default Edit