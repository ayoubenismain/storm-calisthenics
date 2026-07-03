import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const [totalProducts, totalOrders, pendingOrders, categories] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Category.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const lowStock = await Product.find({ stock: { $lt: 5 }, status: 'active' })
      .select('name stock images')
      .limit(5);

    const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      categories,
      lowStock,
      latestOrders,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
