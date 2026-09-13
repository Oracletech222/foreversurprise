import { NextResponse } from 'next/server';

const orders = globalThis.foreverSurpriseOrders ?? new Map();
globalThis.foreverSurpriseOrders = orders;

const validOccasions = new Set(['Just because', 'Birthday', 'Anniversary', 'Thank you']);
const validAreas = new Set(['Pokhara', 'Lakeside', 'Bagar', 'New Road']);

export async function POST(request) {
  try {
    const body = await request.json();
    const { occasion, recipientName, recipientLocation, recipientPhone, deliveryName, deliveryLocation, deliveryPhone, cakeMessage, bundle } = body;

    if (!validOccasions.has(occasion) || !validAreas.has(deliveryLocation)) {
      return NextResponse.json({ error: 'Please choose a valid occasion and delivery area.' }, { status: 400 });
    }

    const requiredFields = { recipientName, recipientLocation, recipientPhone, deliveryName, deliveryLocation, deliveryPhone, cakeMessage };
    if (Object.entries(requiredFields).some(([, value]) => typeof value !== 'string' || value.trim().length < 2)) {
      return NextResponse.json({ error: 'Please complete all recipient and delivery details.' }, { status: 400 });
    }

    if (!/^\+?[0-9 ()-]{7,20}$/.test(recipientPhone) || !/^\+?[0-9 ()-]{7,20}$/.test(deliveryPhone)) {
      return NextResponse.json({ error: 'Please enter valid phone numbers.' }, { status: 400 });
    }

    if (!bundle || typeof bundle.name !== 'string' || !Number.isInteger(bundle.price) || bundle.price < 1) {
      return NextResponse.json({ error: 'Please choose a valid gift bundle.' }, { status: 400 });
    }

    const order = {
      id: `FS-${Date.now().toString(36).toUpperCase()}`,
      occasion,
      recipient: { name: recipientName.trim(), location: recipientLocation.trim(), phone: recipientPhone.trim() },
      delivery: { placeName: deliveryName.trim(), location: deliveryLocation, phone: deliveryPhone.trim() },
      cakeMessage: cakeMessage.trim(),
      bundle: { name: bundle.name, price: bundle.price },
      deliveryFee: 150,
      total: bundle.price + 150,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (!process.env.RESEND_API_KEY || !process.env.FOREVER_SURPRISE_EMAIL) {
      return NextResponse.json({ error: 'Email forwarding is not configured yet. Add RESEND_API_KEY and FOREVER_SURPRISE_EMAIL.' }, { status: 503 });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Forever Surprise <onboarding@resend.dev>',
        to: [process.env.FOREVER_SURPRISE_EMAIL],
        subject: `New Forever Surprise order ${order.id}`,
        text: JSON.stringify(order, null, 2),
      }),
    });

    if (!emailResponse.ok) {
      return NextResponse.json({ error: 'We could not forward the order email. Please try again.' }, { status: 502 });
    }

    orders.set(order.id, order);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'We could not create your order. Please try again.' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ orders: [...orders.values()] });
}