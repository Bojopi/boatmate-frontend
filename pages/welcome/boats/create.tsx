import React, { useRef, useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import LayoutAdmin from '@/components/layoutAdmin';
import { useRouter } from 'next/router';
import { Customers } from '@/hooks/customers';
import { Boats } from '@/hooks/boats';
import { Boat, Customer } from '@/interfaces/interfaces';
import { InputWrapper } from '@/components/react-hook-form/input-wrapper';
import { Label } from '@/components/react-hook-form/label';
import { Dropdown } from 'primereact/dropdown';
import { Input } from '@/components/react-hook-form/input';
import { ErrorMessage } from '@/components/react-hook-form/error-message';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import MapComponent from '@/components/map';
import { Maps } from '@/hooks/maps';

export type FormProps = {
	type:       string;
	model:      string;
	brand:      string;
	brandMotor: string;
	modelMotor: string;
	year:       number;
	length:     number;
	boatLat:    string;
	boatLng:    string;
}

const Create: React.FC = () => {
    const {getAddress} = Maps();
    const {getAllCustomers} = Customers();
    const {show, createBoat, updateBoat} = Boats();

    const [boat, setBoat] = useState<Boat>({
        id_boat:     0,
        type:        '',
        model:       '',
        brand:       '',
        year:        0,
        length:      '',
        boat_lat:    '',
        boat_lng:    '',
        person_name: '',
        lastname:    '',
        id_profile:  0,
        phone:       ''
    });

    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const [customer, setCustomer] = useState<any>(null);
    const [customers, setCustomers] = useState<Customer | any>(null);

    const [date, setDate] = useState<any>(null);
    const [lentgh, setLength] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [isValidPosition, setIsValidPosition] = useState<boolean>(true);

    const toast = useRef<Toast>(null);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        getCustomers();
        if(router.query.id) {
            resetAsyncForm(Number(router.query.id))
        }
    }, [router.query.id]);

    useEffect(() => {
        if(selectedLocation) {
            setIsValidPosition(false);
        }
    }, [selectedLocation])

    const methods = useForm<FormProps>({
        defaultValues: {
            type:       '',
            model:      '',
            brand:      '',
            brandMotor: '',
            modelMotor: '',
            year:       0,
            length:     0,
            boatLat:    '',
            boatLng:    '',
        }
    })

    const {
        handleSubmit,
        setError,
        reset,
        formState: {errors},
    } = methods;

    const getCustomers = async () => {
        const response = await getAllCustomers();
        if(response.status == 200) {
            setCustomers(response.data.customers);
            setLoading(false);
        }
    }

    const resetAsyncForm = async (idBoat: number) => {
        const result = await show(idBoat);
        if(result.status == 200) {
            result.data.boat.brandMotor = result.data.boat.brand_motor;
            result.data.boat.modelMotor = result.data.boat.model_motor;
            result.data.boat.lat = result.data.boat.boat_lat;
            result.data.boat.lng = result.data.boat.boat_lng;
            
            reset(result.data.boat);
            setBoat(result.data.boat);
            setLength(result.data.boat.length);
            setDate(new Date(result.data.boat.year));
            setSelectedLocation({lat: Number(result.data.boat.boat_lat), lng: Number(result.data.boat.boat_lng)});
            const response = await getAllCustomers();
            if(response.status === 200) {
                const customerSelected = response.data.customers.filter((item: Customer) => item.id_profile == Number(result.data.boat.id_profile));
                setCustomer(customerSelected[0]);
            }

            const res = await getAddress(Number(result.data.boat.boat_lat), Number(result.data.boat.boat_lng));
            if(res.status == 200) {
                setSelectedPlace(res.data.results[0].formatted_address);
            }
            setLoading(false);
        }
    };

    const onSubmit = (data: FormProps) => {
        const idCustomer = customer.id_customer;

        data.year = new Date(date).getFullYear();
        data.length = lentgh;
        data.boatLat = selectedLocation.lat;
        data.boatLng = selectedLocation.lng;
        setLoading(true);

        if(!router.query.id) {
            createBoat(Number(idCustomer), data, toast, setLoading);
        } else {
            updateBoat(Number(router.query.id), data, toast, setLoading)
        }
    };

    const onClear = () => {
        reset();
        setBoat({
            id_boat:     0,
            type:        '',
            model:       '',
            brand:       '',
            year:        0,
            length:      '',
            boat_lat:    '',
            boat_lng:    '',
            person_name: '',
            lastname:    '',
            id_profile:  0,
            phone:       ''
        });
        setSelectedPlace('');
        setSelectedLocation(null);

        router.push('/welcome/boats');
    }

    const onErrors = () => {
        toast.current!.show({severity:'error', summary:'Error', detail: 'You must fill in all fields', life: 4000});
    };

    const customerOptionTemplate = (option: Customer) => {
        return (
            <div className="flex align-items-center">
                <div>{option.person_name ? option.person_name : ''} {option.lastname ? option.lastname : ''}</div>
            </div>
        );
    };
    
    const selectedCustomerTemplate = (option: Customer) => {
        return (
            <div className="flex align-items-center">
                <div>{option.person_name ? option.person_name : ''} {option.lastname ? option.lastname : ''}</div>
            </div>
        );
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <FormProvider {...methods}>
            <h2 className='w-full text-lg font-medium border-b-2 p-5 shadow-sm'>{router.query.id ? 'Edit Boat' : 'Create Boat'}</h2>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className='w-full grid grid-cols-12 px-10 py-5 gap-3'>
                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='id_customer'>Select a customer</Label>
                    <Dropdown
                    value={customer}
                    options={customers}
                    optionLabel='person_name'
                    itemTemplate={customerOptionTemplate}
                    valueTemplate={selectedCustomerTemplate}
                    placeholder='Select a customer'
                    showClear
                    className='w-full'
                    onChange={(e) => {setCustomer(e.target.value)}}
                    required
                    />
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='type'>Type:</Label>
                    <Input
                    id='type'
                    name='type'
                    type='text'
                    placeholder='Type...'
                    rules={{
                        required: 'Type is required'
                    }}
                    />
                    {errors.type?.message && (
                        <ErrorMessage>{errors.type.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-6'>
                    <Label id='year'>Year:</Label>
                    <Calendar
                    value={date}
                    view="year"
                    dateFormat="yy"
                    className='w-full'
                    required
                    onChange={(e) => setDate(e.value)}
                    />
                </InputWrapper>

                <InputWrapper outerClassName='col-span-6'>
                    <Label id='length'>Length:</Label>
                    <InputNumber
                    inputId="length"
                    value={lentgh}
                    className='w-full'
                    required
                    onValueChange={(e) => setLength(e.value!)}
                    suffix=" in" />
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='model'>Model:</Label>
                    <Input
                    id='model'
                    name='model'
                    type='text'
                    placeholder='Model...'
                    rules={{
                        required: 'Model is required'
                    }}
                    />
                    {errors.model?.message && (
                        <ErrorMessage>{errors.model.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='brand'>Brand:</Label>
                    <Input
                    id='brand'
                    name='brand'
                    type='text'
                    placeholder='Brand...'
                    rules={{
                        required: 'Brand is required'
                    }}
                    />
                    {errors.brand?.message && (
                        <ErrorMessage>{errors.brand.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='modelMotor'>Model motor:</Label>
                    <Input
                    id='modelMotor'
                    name='modelMotor'
                    type='text'
                    placeholder='Model Motor...'
                    rules={{
                        required: 'Model Motor is required'
                    }}
                    />
                    {errors.modelMotor?.message && (
                        <ErrorMessage>{errors.modelMotor.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12 md:col-span-6'>
                    <Label id='brandMotor'>Brand motor:</Label>
                    <Input
                    id='brandMotor'
                    name='brandMotor'
                    type='text'
                    placeholder='Brand Motor...'
                    rules={{
                        required: 'Brand Motor is required'
                    }}
                    />
                    {errors.brandMotor?.message && (
                        <ErrorMessage>{errors.brandMotor.message}</ErrorMessage>
                    )}
                </InputWrapper>

                <InputWrapper outerClassName='col-span-12'>
                    <Label id='address'>Address</Label>
                    <MapComponent
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    getAddress={getAddress}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace} />
                </InputWrapper>

                <div className='col-span-12 flex justify-between items-center p-2'>
                    <Button type='reset' label='Cancel' icon='pi pi-times' className='p-button-text' onClick={onClear} />
                    <Button type='submit' label='Save' icon='pi pi-check' disabled={isValidPosition} className='p-button-success p-mr-2' />
                </div>
            </form>
        </FormProvider>
    </LayoutAdmin>
  )
}

export default Create