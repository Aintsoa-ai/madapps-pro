import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AppFormData } from './useCreateApp';

export function useEditApp() {
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

  const updateApp = async (id: string, formData: AppFormData, iconFile: File | null, bannerFile: File | null, apkFile: File | null, existingIcon: string, existingBanner: string, existingApk: string) => {
    try {
      setLoading(true);
      setError(null);

      let icon_url = existingIcon;
      let banner_url = existingBanner;
      let apk_url = existingApk;

      if (iconFile) {
        icon_url = await uploadFile(iconFile, 'icons');
      }
      if (bannerFile) {
        banner_url = await uploadFile(bannerFile, 'banners');
      }
      if (apkFile) {
        apk_url = await uploadFile(apkFile, 'apps');
      }

      const { error: updateError } = await supabase.from('apps').update({
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        full_description: formData.full_description,
        developer_name: formData.developer_name,
        category_id: formData.category_id,
        icon_url,
        banner_url,
        apk_url,
      }).eq('id', id);

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error("Une application avec ce même nom (ou URL) existe déjà.");
        }
        throw updateError;
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateApp, loading, error };
}
