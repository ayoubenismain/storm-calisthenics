import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import StormSettings from '@/models/StormSettings';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await StormSettings.findOne();
    if (!settings) {
      settings = await StormSettings.create({});
    }
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let settings = await StormSettings.findOne();
    if (!settings) {
      settings = await StormSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
