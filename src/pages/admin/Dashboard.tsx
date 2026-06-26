import { useApps } from '../../hooks/useApps';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { apps, loading } = useApps();
  const { deleteApp } = useDeleteApp();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'application "${title}" ? Cette action est irréversible.`)) {
      const success = await deleteApp(id);
      if (success) {
        // Rafraîchir la page ou recharger la liste (solution simple pour l'MVP)
        window.location.reload();
      } else {
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-400 mt-1">Gérez votre catalogue d'applications publiques.</p>
        </div>
        <Link to="/admin/apps/new" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle application
        </Link>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Applications publiées ({apps.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
              <tr>
                <th className="px-6 py-4">Application</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">Chargement...</td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden shrink-0">
                        <img src={app.icon_url || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{app.title}</div>
                        <div className="text-xs">{app.developer_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">
                        Publié
                      </span>
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
    </div>
  );
}
