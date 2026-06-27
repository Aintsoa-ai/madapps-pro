import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditApp } from '../../hooks/useEditApp';
import { useCategories } from '../../hooks/useCategories';
import { useAppDetails } from '../../hooks/useApps';
import { ArrowLeft, Upload, Loader2, Download } from 'lucide-react';
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
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkType, setApkType] = useState<'upload' | 'link'>('link');
  const [externalApkUrl, setExternalApkUrl] = useState('');

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
      if (app.apk_url && app.apk_url.startsWith('http') && !app.apk_url.includes('supabase.co')) {
        setApkType('link');
        setExternalApkUrl(app.apk_url);
      } else if (app.apk_url) {
        setApkType('upload');
      }
      if (app.screenshots && Array.isArray(app.screenshots)) {
        setExistingScreenshots(app.screenshots);
      }
    }
  }, [app]);

  if (loadingApp) {
    return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;
  }

  if (!app) return <div className="text-center py-20 text-white">Application introuvable</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return alert('Veuillez choisir une catégorie');
    if (apkType === 'link' && !externalApkUrl && !app.apk_url) return alert('Veuillez fournir le lien de téléchargement');
    
    let finalExternalUrl = '';
    if (apkType === 'link') {
      finalExternalUrl = externalApkUrl;
    }
    
    const success = await updateApp(app.id, formData, iconFile, bannerFile, apkType === 'upload' ? apkFile : null, finalExternalUrl, app.icon_url || '', app.banner_url || '', app.apk_url || '', existingScreenshots, screenshotFiles);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleSlugify = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'application</h1>
          <p className="text-gray-500 mt-1">Mettez à jour les informations de {formData.title || 'l\'application'}.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 shadow-sm">
          <p className="font-medium">Une erreur est survenue</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm">
        
        {/* Informations Générales */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'application *</label>
              <input required type="text" value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value, slug: handleSlugify(e.target.value)})}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL) *</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: handleSlugify(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-500 shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Développeur *</label>
              <input required type="text" value={formData.developer_name} onChange={(e) => setFormData({...formData, developer_name: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie *</label>
              <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm">
                <option value="">Sélectionner une catégorie...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description courte (sous-titre) *</label>
            <input required type="text" maxLength={120} value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})}
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description longue</label>
            <textarea rows={6} value={formData.full_description} onChange={(e) => setFormData({...formData, full_description: e.target.value})}
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm resize-y"></textarea>
          </div>
        </div>

        {/* Médias */}
        <div className="pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Ressources visuelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nouvelle Icône (Optionnel)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
                <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">{iconFile ? iconFile.name : 'Remplacer l\'image'}</span>
              </div>
              {app.icon_url && <img src={app.icon_url} className="mt-3 w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-200" alt="Current icon" />}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nouvelle Bannière (Optionnel)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">{bannerFile ? bannerFile.name : 'Remplacer l\'image'}</span>
              </div>
              {app.banner_url && <img src={app.banner_url} className="mt-3 h-16 w-auto rounded-xl object-cover shadow-sm border border-gray-200" alt="Current banner" />}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ajouter/Remplacer les Captures d'écran (Max 5)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
              <input type="file" multiple accept="image/*" 
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (existingScreenshots.length + files.length > 5) {
                    alert(`Vous avez déjà ${existingScreenshots.length} images. Vous ne pouvez pas dépasser 5 au total.`);
                    return;
                  }
                  setScreenshotFiles(files);
                }} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-10 h-10 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-base font-medium text-gray-900">Ajouter des images</span>
              <span className="text-sm text-gray-500 mt-1">{screenshotFiles.length} nouvelle(s) image(s)</span>
            </div>
            
            {(existingScreenshots.length > 0 || screenshotFiles.length > 0) && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
                {existingScreenshots.map((url, idx) => (
                  <div key={`exist-${idx}`} className="w-32 h-48 flex-shrink-0 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative shadow-sm group">
                     <img src={url} className="w-full h-full object-cover" alt="Screenshot" />
                     <button type="button" 
                       onClick={() => setExistingScreenshots(existingScreenshots.filter((_, i) => i !== idx))}
                       className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                       ×
                     </button>
                  </div>
                ))}
                {screenshotFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className="w-32 h-48 flex-shrink-0 bg-gray-100 rounded-xl border-2 border-green-500 overflow-hidden relative shadow-sm">
                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Screenshot preview" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fichier APK */}
        <div className="pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Fichier d'installation</h2>
          <div className="flex justify-between items-center mb-6">
            <label className="block text-sm font-semibold text-gray-700">Remplacer le fichier de l'application (.apk)</label>
            <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-inner">
              <button type="button" onClick={() => setApkType('link')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${apkType === 'link' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}>Lien Externe</button>
              <button type="button" onClick={() => setApkType('upload')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${apkType === 'upload' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}>Uploader (Max 50Mo)</button>
            </div>
          </div>

          {apkType === 'link' ? (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de téléchargement directe</label>
              <input type="url" placeholder="Ex: https://drive.google.com/..." value={externalApkUrl} onChange={(e) => setExternalApkUrl(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" />
              <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 block"></span>
                {app.apk_url && !app.apk_url.includes('supabase.co') ? 'Un lien est déjà enregistré.' : 'Collez ici le lien Google Drive ou autre lien direct.'}
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative group">
              <input type="file" accept=".apk" onChange={(e) => setApkFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Download className="w-12 h-12 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold text-gray-900 mb-1">{apkFile ? apkFile.name : 'Uploader un nouveau fichier APK'}</span>
              {!apkFile && app.apk_url && app.apk_url.includes('supabase.co') && <span className="text-sm text-green-600 font-medium mt-3 text-center bg-green-50 px-4 py-1.5 rounded-full border border-green-200">Un fichier est déjà hébergé sur Supabase.</span>}
            </div>
          )}
        </div>

        <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
