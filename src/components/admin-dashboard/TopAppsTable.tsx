import React from 'react';
import { Download, Eye, ThumbsUp, ThumbsDown, Star, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopAppsTableProps {
  sortedApps: any[];
  loading: boolean;
  comments: any[];
  handleDelete: (id: string, title: string) => void;
}

export default function TopAppsTable({ sortedApps, loading, comments, handleDelete }: TopAppsTableProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Top Applications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Application</th>
              <th className="px-6 py-4">Statistiques</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8">Chargement...</td></tr>
            ) : (
              sortedApps.map((app) => {
                const appComments = comments.filter(c => c.app_id === app.id);
                const avgRating = appComments.length > 0 
                  ? (appComments.reduce((acc, c) => acc + c.rating, 0) / appComments.length).toFixed(1) 
                  : 'N/A';

                return (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <img src={app.icon_url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{app.title}</div>
                      <div className="text-xs text-gray-500">{app.categories?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1 text-green-400" title="Téléchargements"><Download className="w-3 h-3" /> {(app as any).downloads_count || 0}</span>
                      <span className="flex items-center gap-1 text-blue-400" title="Vues"><Eye className="w-3 h-3" /> {(app as any).views_count || 0}</span>
                      <span className="flex items-center gap-1 text-indigo-400" title="J'aime"><ThumbsUp className="w-3 h-3" /> {(app as any).likes_count || 0}</span>
                      <span className="flex items-center gap-1 text-red-400" title="Je n'aime pas"><ThumbsDown className="w-3 h-3" /> {(app as any).dislikes_count || 0}</span>
                      <span className="flex items-center gap-1 text-yellow-400" title="Note moyenne"><Star className="w-3 h-3 fill-current" /> {avgRating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/admin/apps/edit/${app.slug}`} className="text-gray-400 hover:text-indigo-600 transition" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(app.id, app.title)} className="text-gray-400 hover:text-red-600 transition" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
