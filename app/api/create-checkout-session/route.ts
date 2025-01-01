// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { creditPackages } from '@/components/credit-purchase/credit-packages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// app/api/create-checkout-session/route.ts
export async function POST(req: Request) {
  try {
    const { packageId, userId } = await req.json();

    console.log('Received request:', { packageId, userId }); // Add this logging

    const selectedPackage = creditPackages.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      console.log('Package not found:', packageId); // Add this logging
      return NextResponse.json(
        { error: 'Invalid package selected' },
        { status: 400 }
      );
    }

    console.log('Selected package:', selectedPackage); // Add this logging

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description
            },
            unit_amount: Math.round(selectedPackage.price * 100) // Convert to pence
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,

      metadata: {
        userId: userId,
        credits: selectedPackage.credits,
        packageId: packageId
      }
    });

    console.log('Created session with metadata:', session.metadata); // Add this logging

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
