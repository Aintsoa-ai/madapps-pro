import { Search, Menu, User } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        setSearchParams({ q: inputValue }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  // Synchroniser si l'URL change (par exemple bouton retour)
  useEffect(() => {
    setInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Menu className="h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer md:hidden" />
            <Link to="/" className="text-xl font-medium text-gray-700 flex items-center gap-2">
              <span className="text-indigo-600 font-bold text-2xl">▶</span>
              AintStore
            </Link>
            
            {/* Play Store like tabs */}
            <div className="hidden md:flex ml-8 gap-6">
              <span className="text-indigo-600 font-medium border-b-2 border-indigo-600 py-5">Applications</span>
              <span className="text-gray-500 hover:text-gray-700 font-medium py-5 cursor-pointer">Jeux</span>
              <span className="text-gray-500 hover:text-gray-700 font-medium py-5 cursor-pointer">Enfants</span>
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-transparent focus:ring-2 focus:ring-gray-200 sm:text-sm transition-colors shadow-sm"
                placeholder="Rechercher des applications et des jeux"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition" title="Espace Administrateur">
              <User className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
