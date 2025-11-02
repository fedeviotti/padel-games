import { and, desc, eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tournamentTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tournaments = await db
      .select()
      .from(tournamentTable)
      .where(and(isNull(tournamentTable.deletedAt), eq(tournamentTable.userId, user.id)))
      .orderBy(desc(tournamentTable.startDate));

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        userId: user.id,
      })
      .returning();

    return NextResponse.json(newTournament, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}
