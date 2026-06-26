import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditApp } from '../../hooks/useEditApp';
import { useCategories } from '../../hooks/useCategories';
import { useAppDetails } from '../../hooks/useApps';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import type { AppFormData } from '../../hooks/useCreateApp';

export default function EditApp() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { app, loading: loadingApp } = useAppDetails(slug);
  const { updateApp, loading, error } = useEditApp();
  const { categories } = useCategories();

  const [formData, setFormData] = useState<AppFormData>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    developer_name: '',
    category_id: '',
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (app) {
      setFormData({
        title: app.title || '',
        slug: app.slug || '',
        short_description: app.short_description || '',
        full_description: app.full_description || '',
        developer_name: app.developer_name || '',
        category_id: app.category_id || '',
      });
    }
  }, [app]);

  if (loadingApp) {
    return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;
  }

  if (!app) return <div className="text-center py-20 text-white">Application introuvable</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return alert('Veuillez choisir une catégorie');
    
    const success = await updateApp(app.id, formData, iconFile, bannerFile, app.icon_url || '', app.banner_url || '');
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleSlugify = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-3xl font-bold text-white">Modifier l'application</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
          Erreur: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-2xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Titre de l'application *</label>
            <input required type="text" value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value, slug: handleSlugify(e.target.value)})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL) *</label>
            <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: handleSlugify(e.target.value)})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Développeur *</label>
            <input required type="text" value={formData.developer_name} onChange={(e) => setFormData({...formData, developer_name: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie *</label>
            <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500">
              <option value="">Sélectionner une catégorie...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description courte (sous-titre) *</label>
          <input required type="text" maxLength={120} value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description longue</label>
          <textarea rows={5} value={formData.full_description} onChange={(e) => setFormData({...formData, full_description: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nouvelle Icône (Optionnel)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-900 transition cursor-pointer relative">
              <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-sm text-gray-400">{iconFile ? iconFile.name : 'Remplacer l\'image'}</span>
            </div>
            {app.icon_url && <img src={app.icon_url} className="mt-2 w-12 h-12 rounded-lg object-cover" alt="Current icon" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nouvelle Bannière (Optionnel)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-900 transition cursor-pointer relative">
              <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-sm text-gray-400">{bannerFile ? bannerFile.name : 'Remplacer l\'image'}</span>
            </div>
            {app.banner_url && <img src={app.banner_url} className="mt-2 h-12 w-auto rounded-lg object-cover" alt="Current banner" />}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700 flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
