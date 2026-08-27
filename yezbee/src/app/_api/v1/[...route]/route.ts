import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Embedded API routes have been removed. Please use the external backend API.' },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Embedded API routes have been removed. Please use the external backend API.' },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Embedded API routes have been removed. Please use the external backend API.' },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Embedded API routes have been removed. Please use the external backend API.' },
    { status: 404 }
  );
}

export async function OPTIONS() {
  return NextResponse.json({ success: true }, { status: 200 });
}
