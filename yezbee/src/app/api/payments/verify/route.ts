import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Razorpay keys are not configured.' },
        { status: 500 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Verify the signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      // Payment is successful and verified
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
