import React from 'react';

interface MembersTableProps {
  profiles: any[];
}

export default function MembersTable({ profiles }: MembersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Derniers Membres Inscrits</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Date d'inscription</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-8">Aucun membre inscrit.</td></tr>
            ) : (
              profiles.slice(0, 10).map((profile) => (
                <tr key={profile.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-indigo-600 border border-gray-200 bg-indigo-50">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        profile.username?.charAt(0).toUpperCase() || 'A'
                      )}
                      {(parseInt(profile.id.substring(0, 8), 16) % 3 !== 0) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="font-semibold text-gray-900">{profile.username || 'Anonyme'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
