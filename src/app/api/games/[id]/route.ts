import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    } = body;
    const gameId = parseInt(params.id);

    if (!playedAt || !team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 ||
        team1SetScore === undefined || team2SetScore === undefined ||
        !winningTeam || totalGamesDifference === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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
        updatedAt: new Date(),
      })
      .where(eq(gameTable.id, gameId))
      .returning();

    if (!updatedGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = parseInt(params.id);

    const [deletedGame] = await db
      .update(gameTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(gameTable.id, gameId))
      .returning();

    if (!deletedGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
