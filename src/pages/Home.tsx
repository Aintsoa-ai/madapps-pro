import Navbar from '../components/layout/Navbar';
import AppCard from '../components/AppCard';
import { useApps } from '../hooks/useApps';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { apps, loading, error } = useApps();

  const filteredApps = apps.filter(app => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase().replace(/[-_]/g, ' ');
    const title = app.title.toLowerCase().replace(/[-_]/g, ' ');
    const shortDesc = (app.short_description || '').toLowerCase();
    const dev = (app.developer_name || '').toLowerCase();
    
    return title.includes(term) || shortDesc.includes(term) || dev.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Mise en avant */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">En vedette</h2>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <div className="z-10 flex-1">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Nouveau</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">AintStore</h1>
              <p className="text-gray-300 text-lg mb-8 max-w-xl">
                Découvrez toutes nos applications au même endroit. Profitez d'un téléchargement rapide et sécurisé.
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-8 py-3 rounded-full transition transform hover:-translate-y-1 shadow-lg shadow-indigo-500/25">
                Explorer
              </button>
            </div>
            {/* Décoration */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/10 via-indigo-500/10 to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* Section Catalogue */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Catalogue d'applications</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
              Une erreur est survenue lors du chargement des applications.
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Aucune application ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
