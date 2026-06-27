import Navbar from '../components/layout/Navbar';
import AppCard from '../components/AppCard';
import { useApps } from '../hooks/useApps';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { apps, loading, error } = useApps();
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

  // Extraire les catégories uniques
  const categories = ['Toutes', ...Array.from(new Set(apps.map(app => app.categories?.name).filter(Boolean)))];

  const filteredApps = apps.filter(app => {
    // Filtre par recherche
    const matchesSearch = (() => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase().replace(/[-_]/g, ' ');
      const title = app.title.toLowerCase().replace(/[-_]/g, ' ');
      const shortDesc = (app.short_description || '').toLowerCase();
      const dev = (app.developer_name || '').toLowerCase();
      return title.includes(term) || shortDesc.includes(term) || dev.includes(term);
    })();

    // Filtre par catégorie
    const matchesCategory = selectedCategory === 'Toutes' || app.categories?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section Catalogue */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[1.75rem] font-medium text-gray-900 tracking-tight">Sélection d'applications</h2>
              <p className="text-gray-500 text-sm mt-1">{filteredApps.length} application{filteredApps.length > 1 ? 's' : ''}</p>
            </div>
            
            {/* Filtres de catégories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category as string}
                  onClick={() => setSelectedCategory(category as string)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {category as string}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              Une erreur est survenue lors du chargement des applications.
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Aucune application ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
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
