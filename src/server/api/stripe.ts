import Stripe from 'stripe';
import { supabase } from '../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(
  amount: number,
  currency: string,
  userId: string
) {
  try {
    // Create a payment record in your database
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        amount,
        currency,
        status: 'pending'
      })
      .single();

    if (dbError) throw dbError;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents
      currency,
      metadata: {
        userId,
        paymentId: payment.id
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await updatePaymentStatus(
          paymentIntent.metadata.paymentId,
          'completed'
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await updatePaymentStatus(
          failedPayment.metadata.paymentId,
          'failed'
        );
        break;
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
}

async function updatePaymentStatus(paymentId: string, status: string) {
  const { error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', paymentId);

  if (error) throw error;
} 