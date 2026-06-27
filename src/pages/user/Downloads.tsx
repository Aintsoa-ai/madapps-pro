import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/layout/Navbar';
import { Download, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Downloads() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Pour l'instant, MadaStack n'a pas de table user_downloads stricte.
      // Si la table 'user_downloads' existe, on la requête.
      // Sinon, on simule ou on utilise une requête appropriée pour le futur.
      try {
        const { data, error } = await supabase
          .from('user_downloads')
          .select('*, apps(*)')
          .eq('user_id', user.id)
          .order('downloaded_at', { ascending: false });
        
        if (!error && data) {
          setDownloads(data.map(d => d.apps).filter(Boolean));
        }
      } catch (e) {
        console.log("Table user_downloads n'existe pas encore. Affichage vide.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes téléchargements</h1>
        <p className="text-gray-600 mb-8">Retrouvez ici toutes les applications que vous avez acquises.</p>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloads.map((app, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition">
                <img src={app.icon_url || 'https://via.placeholder.com/150'} alt={app.title} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{app.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Acquis
                  </div>
                  <Link to={`/app/${app.slug}`} className="mt-2 inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium">
                    <Download className="w-3 h-3" /> Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun téléchargement</h3>
            <p className="text-gray-500">Vous n'avez pas encore téléchargé d'applications.</p>
            <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
              Découvrir les apps
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
