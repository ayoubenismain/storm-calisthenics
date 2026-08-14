import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import StormSettings from "@/models/StormSettings";
import { sendOrderConfirmationEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      notes,
      items,
      paymentMethod,
    } = body;

    if (!customerName || !phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch store settings for delivery fee and currency
    let deliveryFee = 8;
    let currency = "TND";
    try {
      const settings = await StormSettings.findOne().lean();
      if (settings) {
        if ((settings as any).deliveryFee !== undefined)
          deliveryFee = (settings as any).deliveryFee;
        if ((settings as any).currency)
          currency = (settings as any).currency;
      }
    } catch (sErr) {
      console.warn("Could not fetch settings for order fees:", sErr);
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + deliveryFee;
    const orderNumber = `STM-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      email: email || "",
      phone,
      address: address || "",
      city: city || "",
      notes: notes || "",
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
      paymentMethod: paymentMethod || "Cash on Delivery",
      orderStatus: "confirmed",
    });

    // Send order confirmation emails via Gmail SMTP
    try {
      await sendOrderConfirmationEmails({
        orderNumber,
        customerName,
        phone,
        email: email ? email.trim() : undefined,
        city: city || "",
        address: address || "",
        notes: notes || undefined,
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: paymentMethod || "Cash on Delivery",
        currency,
      });
    } catch (emailErr) {
      console.error(
        "Order created successfully, but order email notification failed:",
        emailErr
      );
    }

    return NextResponse.json(
      { order, orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
