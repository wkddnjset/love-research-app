import { NextRequest, NextResponse } from 'next/server';
import { Webhooks, EventName } from '@paddle/paddle-node-sdk';
import type { SubscriptionNotification } from '@paddle/paddle-node-sdk';
import { createClient } from '@/lib/supabase/server';

const webhooks = new Webhooks();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('paddle-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('PADDLE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  let event;
  try {
    event = await webhooks.unmarshal(body, secret, signature);
  } catch (err) {
    console.error('Paddle webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionActivated: {
      const sub = event.data as SubscriptionNotification;
      const userId = sub.customData?.user_id as string | undefined;
      if (userId) {
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan: 'premium',
            status: 'active',
            paddle_subscription_id: sub.id,
            paddle_customer_id: sub.customerId,
            current_period_start: sub.currentBillingPeriod?.startsAt ?? null,
            current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
          }, { onConflict: 'user_id' });
      }
      break;
    }
    case EventName.SubscriptionUpdated: {
      const sub = event.data as SubscriptionNotification;
      await supabase
        .from('subscriptions')
        .update({
          status: sub.status === 'active' ? 'active' : 'cancelled',
          current_period_end: sub.nextBilledAt ?? null,
        })
        .eq('paddle_subscription_id', sub.id);
      break;
    }
    case EventName.SubscriptionCanceled: {
      const sub = event.data as SubscriptionNotification;
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', plan: 'free' })
        .eq('paddle_subscription_id', sub.id);
      break;
    }
    case EventName.TransactionCompleted: {
      console.log('Transaction completed:', event.data);
      break;
    }
    default:
      console.log('Unhandled Paddle event:', event.eventType);
  }

  return NextResponse.json({ received: true });
}
