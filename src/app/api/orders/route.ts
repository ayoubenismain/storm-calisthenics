import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerName, email, phone, address, city, items, paymentMethod } = body;

    if (!customerName || !phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const deliveryFee = 8; // Could come from settings
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      orderNumber: `STM-${Date.now().toString(36).toUpperCase()}`,
      customerName,
      email: email || '',
      phone,
      address: address || '',
      city: city || '',
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod: paymentMethod || 'cod',
      orderStatus: 'pending',
    });

    return NextResponse.json({ order, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
