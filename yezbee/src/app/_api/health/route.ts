import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Frontend server is healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return NextResponse.json({ success: true }, { status: 200 });
}
