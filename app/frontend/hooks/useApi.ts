import { useState } from 'react';

export const useApi = <T,>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

