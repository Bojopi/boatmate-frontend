import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Stripes } from '@/hooks/stripe';

const stripePromise = loadStripe('pk_test_51N3mL2KHtcU5N9YXNHUr88bWmktLm7a2blVItZEdf50R0DSSvKYWYUOVHNA2mQBD57mqhKeqCatvnmYgAdhiisFu00G6EvW7tK');

const StripeComponent = () => {

  const { createPaymentMethod } = Stripes();

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { token, error } = await stripe.createToken(elements.getElement(CardElement)!);

        if (error) {
            console.error(error);
        } else {
            console.log(token);
            const data = {
              token: token.id
            }
            createPaymentMethod(data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit">Pagar</button>
        </form>
    );
};

const StripeWrapper = () => (
    <Elements stripe={stripePromise}>
        <StripeComponent />
    </Elements>
);

export default StripeWrapper;