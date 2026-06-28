import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AppDescriptionProps {
  app: any;
}

export default function AppDescription({ app }: AppDescriptionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
          <div className="relative group/carousel">
            {/* Bouton gauche */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-gray-800/90 text-white p-2 rounded-full shadow-lg border border-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex hover:bg-gray-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div 
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide items-center relative"
            >
              {app.screenshots && app.screenshots.length > 0 ? (
                app.screenshots.map((url: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="w-[110px] h-[195px] sm:w-[160px] sm:h-[285px] md:w-[200px] md:h-[355px] flex-shrink-0 bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden snap-center border border-gray-700 cursor-pointer group shadow-lg"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className="w-[110px] h-[195px] sm:w-[160px] sm:h-[285px] md:w-[200px] md:h-[355px] flex-shrink-0 bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden snap-center border border-gray-700 cursor-pointer group shadow-lg"
                    onClick={() => {
                      if (app.banner_url) setSelectedImage(app.banner_url);
                    }}
                  >
                    <img src={app.banner_url || ''} alt={`Screenshot ${i}`} className="w-full h-full object-cover opacity-50 grayscale transition-transform duration-300 group-hover:scale-105" />
                  </div>
                ))
              )}
            </div>

            {/* Bouton droit */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-gray-800/90 text-white p-2 rounded-full shadow-lg border border-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex hover:bg-gray-700"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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
