import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { playerTable } from '@/db/schema';
import { isNull } from 'drizzle-orm';

export async function GET() {
  try {
    const players = await db
      .select()
      .from(playerTable)
      .where(isNull(playerTable.deletedAt));

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, yearOfBirth, nickname } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newPlayer] = await db
      .insert(playerTable)
      .values({
        name,
        yearOfBirth: yearOfBirth,
        nickname: nickname || null,
      })
      .returning();

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
