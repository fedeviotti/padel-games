import { isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tournamentTable } from '@/db/schema';

export async function GET() {
  try {
    const tournaments = await db
      .select()
      .from(tournamentTable)
      .where(isNull(tournamentTable.deletedAt));

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newTournament] = await db
      .insert(tournamentTable)
      .values({
        name: name,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();

    return NextResponse.json(newTournament, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}
