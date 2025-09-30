import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { playerTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, dob, nickname } = body;
    const playerId = parseInt(params.id);

    if (!name || !dob) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [updatedPlayer] = await db
      .update(playerTable)
      .set({
        name,
        dob: new Date(dob),
        nickname: nickname || null,
        updatedAt: new Date(),
      })
      .where(eq(playerTable.id, playerId))
      .returning();

    if (!updatedPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id);

    const [deletedPlayer] = await db
      .update(playerTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(playerTable.id, playerId))
      .returning();

    if (!deletedPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
