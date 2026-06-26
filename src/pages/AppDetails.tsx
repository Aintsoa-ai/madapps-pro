import { useParams, Link } from 'react-router-dom';
import { useAppDetails } from '../hooks/useApps';
import Navbar from '../components/layout/Navbar';
import { Loader2, ArrowLeft, Download, Star, ShieldCheck } from 'lucide-react';

export default function AppDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { app, loading, error } = useAppDetails(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Application introuvable</h2>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pb-20">
      <Navbar />

      {/* Bannière Header */}
      <div className="w-full h-64 md:h-80 relative">
        <img 
          src={app.banner_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200'} 
          alt="Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row items-end gap-6 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gray-800 border-4 border-gray-900 shadow-2xl overflow-hidden flex-shrink-0 relative z-10 translate-y-8 md:translate-y-12">
              <img 
                src={app.icon_url || 'https://via.placeholder.com/150'} 
                alt={app.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 w-full pb-2 md:pb-0">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{app.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-300 font-medium">
                <span className="text-indigo-400">{app.developer_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded-md text-sm border border-gray-700">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Vérifié
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0 pb-2">
               <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                 <Download className="w-5 h-5" />
                 Télécharger
               </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Colonne Principale */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">À propos de cette application</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {app.full_description || app.short_description || "Aucune description longue disponible."}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Captures d'écran</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {/* On simule quelques captures d'écran avec l'image de bannière en attendant la vraie table screenshots */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700">
                    <img src={app.banner_url || ''} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Colonne Latérale */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-4">Informations</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="text-gray-500 block mb-1">Catégorie</span>
                  <span className="text-gray-200 font-medium">{app.categories?.name || 'Général'}</span>
                </li>
                <li>
                  <span className="text-gray-500 block mb-1">Date de sortie</span>
                  <span className="text-gray-200 font-medium">
                    {new Date(app.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </li>
                <li>
                  <span className="text-gray-500 block mb-1">Version actuelle</span>
                  <span className="text-gray-200 font-medium">1.0.0</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
