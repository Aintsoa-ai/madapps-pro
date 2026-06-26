import { useApps } from '../../hooks/useApps';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import { Plus, Edit, Trash2, Users, Download, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const { apps, loading } = useApps();
  const { deleteApp } = useDeleteApp();
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchMessages();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('daily_visits').select('visitors_count').eq('visit_date', today).single();
    if (data) setDailyVisitors(data.visitors_count);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*, profiles(username, avatar_url)').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'application "${title}" ? Cette action est irréversible.`)) {
      const success = await deleteApp(id);
      if (success) {
        window.location.reload();
      } else {
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  // Trier par téléchargements décroissants
  const sortedApps = [...apps].sort((a, b) => ((b as any).downloads_count || 0) - ((a as any).downloads_count || 0));
  const totalDownloads = apps.reduce((acc, app) => acc + ((app as any).downloads_count || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-400 mt-1">Vue d'ensemble de votre plateforme.</p>
        </div>
        <Link to="/admin/apps/new" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle app
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
          <div className="bg-indigo-500/20 p-4 rounded-xl"><Users className="w-8 h-8 text-indigo-400" /></div>
          <div>
            <div className="text-sm text-gray-400">Visiteurs (Aujourd'hui)</div>
            <div className="text-2xl font-bold text-white">{dailyVisitors}</div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
          <div className="bg-green-500/20 p-4 rounded-xl"><Download className="w-8 h-8 text-green-400" /></div>
          <div>
            <div className="text-sm text-gray-400">Total Téléchargements</div>
            <div className="text-2xl font-bold text-white">{totalDownloads}</div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
          <div className="bg-orange-500/20 p-4 rounded-xl"><MessageSquare className="w-8 h-8 text-orange-400" /></div>
          <div>
            <div className="text-sm text-gray-400">Messages reçus</div>
            <div className="text-2xl font-bold text-white">{messages.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des applications (2 colonnes) */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Top Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
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
                  sortedApps.map((app) => (
                    <tr key={app.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden shrink-0">
                          <img src={app.icon_url || ''} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{app.title}</div>
                          <div className="text-xs">{app.categories?.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4 text-xs font-medium">
                          <span className="flex items-center gap-1 text-green-400"><Download className="w-3 h-3" /> {(app as any).downloads_count || 0}</span>
                          <span className="flex items-center gap-1 text-blue-400"><Eye className="w-3 h-3" /> {(app as any).views_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/apps/edit/${app.slug}`} className="text-gray-400 hover:text-indigo-400 transition" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(app.id, app.title)} className="text-gray-400 hover:text-red-400 transition" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liste des messages (1 colonne) */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Derniers Messages</h2>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Aucun message reçu.</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-indigo-400 text-sm">{msg.profiles?.username || 'Membre'}</span>
                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="font-medium text-white mb-1 text-sm">{msg.subject}</div>
                  <p className="text-gray-400 text-sm">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
