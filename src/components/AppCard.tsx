import React from 'react';
import { App } from '../../types/database.types';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition duration-300 border border-gray-700/50 hover:border-indigo-500/50 group cursor-pointer shadow-lg hover:shadow-indigo-500/10">
      <div className="aspect-[2/1] w-full overflow-hidden relative">
        {/* Fallback image si pas de banner */}
        <img 
          src={app.banner_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'} 
          alt={`Bannière ${app.title}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      
      <div className="p-5 flex gap-4 relative -mt-8">
        <div className="w-16 h-16 rounded-xl bg-gray-700 border-2 border-gray-800 shadow-xl overflow-hidden flex-shrink-0 z-10">
           <img 
            src={app.icon_url || 'https://via.placeholder.com/150'} 
            alt={`Icône ${app.title}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="pt-8">
          <h3 className="text-lg font-bold text-white leading-tight">{app.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{app.developer_name}</p>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <p className="text-gray-300 text-sm line-clamp-2">{app.short_description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
             {app.categories?.name || 'Général'}
          </span>
          <button className="text-sm font-semibold bg-gray-700 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full transition-colors">
            Voir
          </button>
        </div>
      </div>
    </div>
  );
}
