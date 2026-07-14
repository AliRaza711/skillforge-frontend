import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function useHealthCheck() {
  const [isAlive, setIsAlive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkHealth() {
      try {
        setIsLoading(true);
        const response = await api.get('/health');
        if (active) {
          setIsAlive(response.data?.status === 'ok');
          setError(null);
        }
      } catch (err) {
        if (active) {
          setIsAlive(false);
          setError(err instanceof Error ? err.message : 'Unknown integration error');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    checkHealth();

    return () => {
      active = false;
    };
  }, []);

  return { isAlive, isLoading, error };
}
