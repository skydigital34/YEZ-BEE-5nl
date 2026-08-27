import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: Request) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ success: false, message: 'Public ID is required' }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ success: false, message: 'Cloudinary configuration is missing' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({ success: true, data: null });
    } else {
      throw new Error(`Cloudinary returned: ${result.result}`);
    }

  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Deletion failed' },
      { status: 500 }
    );
  }
}
