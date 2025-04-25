import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import { PaymentService } from '../services/PaymentService';

interface PaymentProps {
  amount: number;
  propertyId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<PaymentProps> = ({ amount, propertyId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      setErrorMessage('Payment failed');
      onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
        <p className="text-gray-600">Amount: ${amount}</p>
      </div>

      <PaymentElement className="mb-6" />

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export const Payment: React.FC<PaymentProps> = (props) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const { clientSecret } = await PaymentService.createPaymentIntent(
          props.amount,
          props.propertyId
        );
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error initializing payment:', error);
        props.onError(error as Error);
      }
    };

    initializePayment();
  }, [props.amount, props.propertyId]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}; 