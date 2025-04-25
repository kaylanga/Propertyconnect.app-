import { stripe, stripePromise } from '../config/stripe';
import { supabase } from '../lib/supabase';
import { PayPalClient } from '@paypal/checkout-server-sdk';
import { MobileMoneyClient } from './MobileMoneyClient';

export class PaymentService {
  static async createPaymentIntent(amount: number, propertyId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create payment record
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          amount,
          currency: 'usd',
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          payment_id: payment.id,
          property_id: propertyId,
          user_id: user.id
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  static async processPayment(paymentMethodId: string, paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Stripe Payment
  static async processStripePayment(amount: number, currency: string, paymentMethodId: string) {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true
    });
  }

  // PayPal Payment
  static async processPayPalPayment(amount: number, currency: string) {
    const paypal = new PayPalClient();
    return await paypal.createOrder({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        }
      }]
    });
  }

  // Mobile Money Payment
  static async processMobileMoneyPayment(
    amount: number,
    phoneNumber: string,
    provider: 'MTN' | 'AIRTEL'
  ) {
    const mobileMoneyClient = new MobileMoneyClient();
    return await mobileMoneyClient.initiatePayment({
      amount,
      phoneNumber,
      provider
    });
  }

  // Crypto Payment
  static async processCryptoPayment(amount: number, walletAddress: string) {
    // Implement cryptocurrency payment logic
  }

  // Bank Transfer
  static async processBankTransfer(amount: number, bankDetails: any) {
    // Implement bank transfer logic
  }
}