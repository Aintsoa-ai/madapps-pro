import React from 'react';
import { Users, Download, MessageSquare, Activity, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  dailyVisitors: number;
  profilesLength: number;
  totalDownloads: number;
  messagesLength: number;
}

export default function DashboardStats({ dailyVisitors, profilesLength, totalDownloads, messagesLength }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Visiteurs (Aujourd'hui)</div>
          <div className="text-3xl font-bold text-gray-900">{dailyVisitors}</div>
          <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +12% vs hier
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl group-hover:bg-indigo-100 transition-colors"><Activity className="w-8 h-8 text-indigo-600" /></div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Membres Inscrits</div>
          <div className="text-3xl font-bold text-gray-900">{profilesLength}</div>
          <div className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-2">
            Total de la communauté
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors"><Users className="w-8 h-8 text-blue-600" /></div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Total Téléchargements</div>
          <div className="text-3xl font-bold text-gray-900">{totalDownloads}</div>
          <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +5% cette semaine
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl group-hover:bg-green-100 transition-colors"><Download className="w-8 h-8 text-green-600" /></div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Messages reçus</div>
          <div className="text-3xl font-bold text-gray-900">{messagesLength}</div>
          <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-2">
            En attente de réponse
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors"><MessageSquare className="w-8 h-8 text-orange-600" /></div>
      </div>
    </div>
  );
}
