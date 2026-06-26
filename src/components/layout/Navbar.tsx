import { Search, Menu, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer md:hidden" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              MadApps Pro
            </span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-900 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="Rechercher des applications..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition">
              <User className="h-5 w-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
