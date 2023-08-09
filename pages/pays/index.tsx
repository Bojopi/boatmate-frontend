import React from 'react'
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { Button } from 'primereact/button';

const stripePromise = loadStripe("pk_test_51N3mL2KHtcU5N9YXNHUr88bWmktLm7a2blVItZEdf50R0DSSvKYWYUOVHNA2mQBD57mqhKeqCatvnmYgAdhiisFu00G6EvW7tK");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const {error, paymentMethod} = await stripe!.createPaymentMethod({
            type: 'card',
            card: elements!.getElement(CardElement)!
        })

        if(!error) {
            console.log('payment method created!', paymentMethod);
        }
    }

    return <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <img src="https://m.media-amazon.com/images/I/71snht4ZY+L._AC_UF1000,1000_QL80_.jpg" alt="computer" className='img-fluid' />
        <CardElement/>
        <Button label='Buy' severity='success'/>
    </form>
}

const PayPage = () => {
  return (
    <div className='bg-gray-100 w-[50%] m-auto p-10 rounded-md'>
        <Elements stripe={stripePromise}>
            <CheckoutForm/>
        </Elements>
    </div>
  )
}

export default PayPage
