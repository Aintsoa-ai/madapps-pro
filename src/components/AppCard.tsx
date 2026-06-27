import type { App } from '../types/database.types';
import { Link } from 'react-router-dom';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link to={`/app/${app.slug}`} className="block h-full group">
      <div className="flex flex-col gap-3">
        {/* Icône de l'application (grande, arrondie) */}
        <div className="aspect-square w-full rounded-2xl md:rounded-[2rem] bg-gray-800 overflow-hidden shadow-md group-hover:shadow-indigo-500/20 transition-all duration-300 relative border border-gray-800 group-hover:border-indigo-500/30">
          <img 
            src={app.icon_url || 'https://via.placeholder.com/256'} 
            alt={`Icône ${app.title}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Informations */}
        <div className="flex flex-col">
          <h3 className="text-base font-medium text-gray-200 truncate group-hover:text-indigo-400 transition-colors">
            {app.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {app.developer_name}
          </p>
          
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-gray-400">4,5</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
  );
}
