import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useDeleteApp() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteApp = async (id: string) => {
    try {
      setDeleting(true);
      setError(null);
      const { error } = await supabase.from('apps').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteApp, deleting, error };
}
