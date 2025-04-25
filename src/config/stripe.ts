import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe instance for server-side operations
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Initialize Stripe promise for client-side operations
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);