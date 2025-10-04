import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable } from '@/db/schema';

export async function GET() {
  try {
    console.log('Testing database connection...');

    // Simple test query to check if the table exists and is accessible
    const result = await db.select().from(gameTable).limit(1);
    console.log('Database connection successful, sample result:', result);

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      sampleData: result,
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
