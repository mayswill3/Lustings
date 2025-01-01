// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, credits } = session.metadata || {};

      if (!userId || !credits) {
        console.error('Missing required metadata:', { userId, credits });
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      // Log the incoming data
      console.log('Processing credits update:', {
        userId,
        credits,
        eventType: event.type
      });

      // First, get current credits
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user credits:', fetchError);
        return NextResponse.json(
          { error: 'Database fetch error' },
          { status: 500 }
        );
      }

      const currentCredits = userData?.credits || BigInt(0);
      const newCredits = currentCredits + BigInt(credits);

      // Log before update
      console.log('Updating credits:', {
        currentCredits: currentCredits.toString(),
        addingCredits: credits,
        newTotal: newCredits.toString()
      });

      // Update user's credits
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits.toString() })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return NextResponse.json(
          { error: 'Database update error' },
          { status: 500 }
        );
      }

      console.log(
        `Successfully updated credits for user ${userId}. New total: ${newCredits}`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
