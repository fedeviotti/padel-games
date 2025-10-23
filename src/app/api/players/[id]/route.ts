import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { playerTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const playerId = parseInt(id);

    const [player] = await db
      .select()
      .from(playerTable)
      .where(and(eq(playerTable.id, playerId), eq(playerTable.userId, user.id)));

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      .where(and(eq(playerTable.id, playerId), eq(playerTable.userId, user.id)))
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
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const playerId = parseInt(id);

    const [deletedPlayer] = await db
      .update(playerTable)
      .set({
        deletedAt: new Date(),
      })
      .where(and(eq(playerTable.id, playerId), eq(playerTable.userId, user.id)))
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
