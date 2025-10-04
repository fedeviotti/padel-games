import { CurrentUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';
import { SelectPlayer } from '@/db/schema';

export function usePlayers(user: CurrentUser | null) {
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [user]);

  return {
    players,
    loading,
    error,
    fetchPlayers,
  };
}
