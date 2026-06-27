import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ShieldCheck, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AppHeaderProps {
  app: any;
  stats: { views: number; downloads: number; likes: number; dislikes: number };
  userVote: string | null;
  downloadUrl: string;
  handleDownload: () => void;
  handleVote: (type: 'like' | 'dislike') => void;
}

export default function AppHeader({
  app,
  stats,
  userVote,
  downloadUrl,
  handleDownload,
  handleVote
}: AppHeaderProps) {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <Link 
        to="/" 
        className="absolute top-4 left-4 sm:left-6 lg:left-8 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
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
              <span className="text-cyan-400">{app.developer_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded-md text-sm border border-gray-700">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Vérifié
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0 pb-2 flex flex-col items-center gap-3">
            {app.apk_url ? (
              <a onClick={handleDownload} href={downloadUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Télécharger ({stats.downloads})
              </a>
            ) : (
              <button disabled className="w-full md:w-auto bg-gray-700 text-gray-400 font-bold py-3 px-8 rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Bientôt disponible
              </button>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {stats.views} vues</span>
              <button onClick={() => handleVote('like')} className={`flex items-center gap-1 transition-colors ${userVote === 'like' ? 'text-green-400' : 'hover:text-green-300'}`}>
                <ThumbsUp className="w-4 h-4" /> {stats.likes}
              </button>
              <button onClick={() => handleVote('dislike')} className={`flex items-center gap-1 transition-colors ${userVote === 'dislike' ? 'text-red-400' : 'hover:text-red-300'}`}>
                <ThumbsDown className="w-4 h-4" /> {stats.dislikes}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
