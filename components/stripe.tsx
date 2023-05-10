import React, {useState} from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

const stripe = () => {
  return (
    <div>stripe</div>
  )
}

export default stripe