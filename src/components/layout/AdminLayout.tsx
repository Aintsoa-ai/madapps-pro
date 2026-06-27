import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Vérification stricte du seul et unique identifiant administrateur autorisé
  if (user.email !== 'madappspro@gmail.com') {
    // Si un utilisateur normal essaie d'accéder à l'admin, on le bloque
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Accès Refusé</h2>
        <p className="text-gray-400 mb-6">Votre compte n'a pas les droits d'administration.</p>
        <button 
          onClick={async () => await supabase.auth.signOut()}
          className="bg-indigo-600 hover:bg-indigo-500 py-2 px-6 rounded-lg font-medium"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-indigo-600">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="/admin/dashboard" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            Tableau de bord
          </a>
          <a href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm transition">
            Voir le site public
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition w-full px-4 py-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
