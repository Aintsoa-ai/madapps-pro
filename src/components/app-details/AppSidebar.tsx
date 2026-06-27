interface AppSidebarProps {
  app: any;
}

export default function AppSidebar({ app }: AppSidebarProps) {
  return (
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
  );
}
