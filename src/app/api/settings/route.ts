import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import StormSettings from '@/models/StormSettings';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await StormSettings.findOne();
    if (!settings) settings = await StormSettings.create({});
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
