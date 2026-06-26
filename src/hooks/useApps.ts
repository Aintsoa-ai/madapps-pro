import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { App } from '../types/database.types';

export function useApps() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('apps')
          .select('*, categories(name)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setApps(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  return { apps, loading, error };
}

export function useAppDetails(slug: string | undefined) {
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApp() {
      if (!slug) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('apps')
          .select('*, categories(name)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setApp(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApp();
  }, [slug]);

  return { app, loading, error };
}
