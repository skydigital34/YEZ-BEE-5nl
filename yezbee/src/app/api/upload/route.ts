import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const category = formData.get('category') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ success: false, message: 'Cloudinary configuration is missing' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to Base64
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const folder = category ? `yezbee/products/${category}` : 'yezbee/products';
    
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        secure_url: result.secure_url,
        publicId: result.public_id,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      }
    });

  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
