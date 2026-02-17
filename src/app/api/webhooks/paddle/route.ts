import { NextRequest, NextResponse } from 'next/server';
import { Webhooks, EventName } from '@paddle/paddle-node-sdk';
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
    case EventName.TransactionCompleted: {
      const tx = event.data as unknown as Record<string, unknown>;
      const customData = tx.customData as Record<string, unknown> | undefined;
      const userId = customData?.user_id as string | undefined;
      const ticketCount = (customData?.ticket_count as number) || 1;
      const purchaseType = (customData?.purchase_type as string) || 'earlybird';
      const price = purchaseType === 'earlybird' ? 29000 : 49000;

      if (userId) {
        const tickets = Array.from({ length: ticketCount }, () => ({
          user_id: userId,
          purchase_type: purchaseType,
          price,
          status: 'unused',
          paddle_transaction_id: tx.id as string,
        }));

        await supabase.from('matching_tickets').insert(tickets);
      }
      break;
    }
    default:
      console.log('Unhandled Paddle event:', event.eventType);
  }

  return NextResponse.json({ received: true });
}
