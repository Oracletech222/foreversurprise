import { NextResponse } from 'next/server';

const orders = globalThis.foreverSurpriseOrders ?? new Map();
globalThis.foreverSurpriseOrders = orders;

const validOccasions = new Set(['Just because', 'Birthday', 'Anniversary', 'Thank you']);
const validAreas = new Set(['Pokhara', 'Lakeside', 'Bagar', 'New Road']);

export async function POST(request) {
  try {
    const body = await request.json();
    const { occasion, recipient, area, bundle } = body;

    if (!validOccasions.has(occasion) || !validAreas.has(area)) {
      return NextResponse.json({ error: 'Please choose a valid occasion and delivery area.' }, { status: 400 });
    }

    if (typeof recipient !== 'string' || recipient.trim().length < 2 || recipient.trim().length > 80) {
      return NextResponse.json({ error: 'Please enter a recipient name between 2 and 80 characters.' }, { status: 400 });
    }

    if (!bundle || typeof bundle.name !== 'string' || !Number.isInteger(bundle.price) || bundle.price < 1) {
      return NextResponse.json({ error: 'Please choose a valid gift bundle.' }, { status: 400 });
    }

    const order = {
      id: `FS-${Date.now().toString(36).toUpperCase()}`,
      occasion,
      recipient: recipient.trim(),
      area,
      bundle: { name: bundle.name, price: bundle.price },
      deliveryFee: 150,
      total: bundle.price + 150,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.set(order.id, order);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'We could not create your order. Please try again.' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ orders: [...orders.values()] });
}