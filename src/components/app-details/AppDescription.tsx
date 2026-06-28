import { useState } from 'react';
import { X } from 'lucide-react';

interface AppDescriptionProps {
  app: any;
}

export default function AppDescription({ app }: AppDescriptionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
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
                <div 
                  key={idx} 
                  className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700 cursor-pointer group"
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
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

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-full p-2 transition-all z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Screenshot pleine taille" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
