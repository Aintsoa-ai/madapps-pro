interface AppDescriptionProps {
  app: any;
}

export default function AppDescription({ app }: AppDescriptionProps) {
  return (
    <div className="md:col-span-2 space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">À propos de cette application</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {app.full_description || app.short_description || "Aucune description longue disponible."}
        </p>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Captures d'écran</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {app.screenshots && app.screenshots.length > 0 ? (
            app.screenshots.map((url: string, idx: number) => (
              <div key={idx} className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700">
                <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            [1, 2, 3].map(i => (
              <div key={i} className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700">
                <img src={app.banner_url || ''} alt={`Screenshot ${i}`} className="w-full h-full object-cover opacity-50 grayscale" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
