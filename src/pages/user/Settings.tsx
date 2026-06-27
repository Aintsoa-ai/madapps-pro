import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Bell, Moon, Shield, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoUpdate: true,
  });

  useEffect(() => {
    // Charger les paramètres locaux
    const saved = localStorage.getItem('userSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    if (key === 'darkMode') {
      toast.success(newSettings.darkMode ? "Mode sombre activé" : "Mode clair activé");
      // TODO: Implémenter le vrai dark mode global
    } else {
      toast.success("Préférence mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleSetting('notifications')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">M'alerter lors des réponses et des nouveautés</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleSetting('darkMode')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mode sombre</h3>
                <p className="text-sm text-gray-500">Thème visuel de l'interface</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleSetting('autoUpdate')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mises à jour automatiques</h3>
                <p className="text-sm text-gray-500">Télécharger automatiquement en WiFi</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.autoUpdate ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.autoUpdate ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sécurité & Confidentialité</h3>
                <p className="text-sm text-gray-500">Gérer l'accès à vos données</p>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 ml-14">Gérer mes permissions</button>
          </div>
        </div>
      </div>
    </div>
  );
}
