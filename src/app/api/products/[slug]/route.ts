import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const product = await Product.findOne({ slug, status: 'active' }).populate('category', 'name slug');
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(`Error fetching product ${await params.then(p => p.slug).catch(() => 'unknown')}:`, err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
