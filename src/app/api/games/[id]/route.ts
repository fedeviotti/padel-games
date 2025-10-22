import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable } from '@/db/schema';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const {
      playedAt,
      team1Player1,
      team1Player2,
      team2Player1,
      team2Player2,
      team1SetScore,
      team2SetScore,
      winningTeam,
      totalGamesDifference,
      tournamentId,
    } = body;
    const id = (await params).id;
    const gameId = parseInt(id);

    if (
      !playedAt ||
      !team1Player1 ||
      !team1Player2 ||
      !team2Player1 ||
      !team2Player2 ||
      team1SetScore === undefined ||
      team2SetScore === undefined ||
      winningTeam === undefined ||
      totalGamesDifference === undefined
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [updatedGame] = await db
      .update(gameTable)
      .set({
        playedAt: new Date(playedAt),
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2,
        team1SetScore,
        team2SetScore,
        winningTeam,
        totalGamesDifference,
        tournamentId: tournamentId || null,
        updatedAt: new Date(),
      })
      .where(eq(gameTable.id, gameId))
      .returning();

    if (!updatedGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const gameId = parseInt(id);

    const [deletedGame] = await db
      .update(gameTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(gameTable.id, gameId))
      .returning();

    if (!deletedGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
