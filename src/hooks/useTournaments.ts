import { CurrentUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';
import { SelectTournament } from '@/db/schema';

export function useTournaments(user: CurrentUser | null) {
  const [tournaments, setTournaments] = useState<SelectTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tournaments');
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTournaments();
    }
  }, [user]);

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
  };
}
