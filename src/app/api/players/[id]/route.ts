import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { playerTable } from '@/db/schema';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { firstName, lastName, yearOfBirth, nickname } = body;
    const id = (await params).id;
    const playerId = parseInt(id);

    if (!lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [updatedPlayer] = await db
      .update(playerTable)
      .set({
        firstName: firstName,
        lastName: lastName,
        yearOfBirth: yearOfBirth,
        nickname: nickname || null,
        updatedAt: new Date(),
      })
      .where(eq(playerTable.id, playerId))
      .returning();

    if (!updatedPlayer) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const playerId = parseInt(id);

    const [deletedPlayer] = await db
      .update(playerTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(playerTable.id, playerId))
      .returning();

    if (!deletedPlayer) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}
