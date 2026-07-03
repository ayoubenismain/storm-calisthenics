import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';
import { uploadFileToCloudinary, validateFileType, validateFileSize } from '@/lib/cloudinary';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'model/gltf-binary': 'model',
  'application/octet-stream': 'model', // .glb files are often sent as this
  'audio/mpeg': 'sound',
  'audio/mp3': 'sound',
  'audio/wav': 'sound',
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const filter: any = {};
    if (type) filter.type = type;
    const assets = await MediaAsset.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ assets });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const mimeType = file.type;
    const assetType = ALLOWED_TYPES[mimeType];

    if (!assetType) {
      return NextResponse.json({ error: `File type ${mimeType} not allowed` }, { status: 400 });
    }

    if (!validateFileSize(file.size, 100)) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, '-');

    let url: string;
    let key: string;

    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

    if (hasCloudinary) {
      const result = await uploadFileToCloudinary(buffer, filename, mimeType);
      url = result.url;
      key = result.key;
    } else {
      // Save to /public/uploads as fallback
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const uniqueName = `${Date.now()}-${filename}`;
      await writeFile(join(uploadDir, uniqueName), buffer);
      url = `/uploads/${uniqueName}`;
      key = uniqueName;
    }

    const asset = await MediaAsset.create({
      filename: key,
      originalName: file.name,
      url,
      key,
      type: assetType as 'image' | 'video' | 'model' | 'sound',
      mimeType,
      size: file.size,
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
