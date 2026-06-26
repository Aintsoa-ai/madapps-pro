import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface AppFormData {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  developer_name: string;
  category_id: string;
}

export function useCreateApp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const createApp = async (formData: AppFormData, iconFile: File | null, bannerFile: File | null) => {
    try {
      setLoading(true);
      setError(null);

      let icon_url = '';
      let banner_url = '';

      if (iconFile) {
        icon_url = await uploadFile(iconFile, 'icons');
      }
      if (bannerFile) {
        banner_url = await uploadFile(bannerFile, 'banners');
      }

      const { error: insertError } = await supabase.from('apps').insert([
        {
          title: formData.title,
          slug: formData.slug,
          short_description: formData.short_description,
          full_description: formData.full_description,
          developer_name: formData.developer_name,
          category_id: formData.category_id,
          icon_url,
          banner_url,
          status: 'published',
        },
      ]);

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error("Une application avec ce même nom (ou URL) existe déjà. Veuillez choisir un autre nom.");
        }
        throw insertError;
      }
      return true; // Succès
    } catch (err: any) {
      setError(err.message);
      return false; // Échec
    } finally {
      setLoading(false);
    }
  };

  return { createApp, loading, error };
}
