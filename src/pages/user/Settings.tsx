import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Bell, Moon, Shield, Smartphone, X, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: false,
    darkMode: false,
    autoUpdate: true,
  });

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    // Charger les paramètres locaux
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
      // Appliquer le dark mode globalement si le composant parent le supporte
      if (JSON.parse(saved).darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleNotificationToggle = async (currentVal: boolean) => {
    if (!currentVal) {
      // Trying to enable
      if (!('Notification' in window)) {
        toast.error('Les notifications ne sont pas supportées par votre navigateur.');
        return false;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('MadApps Pro', { body: 'Les notifications sont bien activées !' });
        return true;
      } else {
        toast.error('Permission refusée par le navigateur.');
        return false;
      }
    }
    // Turning off
    return false;
  };

  const toggleSetting = async (key: keyof typeof settings) => {
    let newValue = !settings[key];

    // Logique spécifique pour les notifications
    if (key === 'notifications') {
      newValue = await handleNotificationToggle(settings.notifications);
    }

    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    if (key === 'darkMode') {
      if (newValue) {
        document.documentElement.classList.add('dark');
        toast.success("Mode sombre activé");
      } else {
        document.documentElement.classList.remove('dark');
        toast.success("Mode clair activé");
      }
    } else if (key !== 'notifications') {
      toast.success("Préférence mise à jour");
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ userSettings: settings, exportDate: new Date() }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mes_donnees_madapps.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Vos données ont été téléchargées.");
  };

  const handleClearCache = () => {
    localStorage.removeItem('userSettings');
    setSettings({ notifications: false, darkMode: false, autoUpdate: true });
    document.documentElement.classList.remove('dark');
    toast.success("Votre cache local a été vidé.");
    setShowPrivacyModal(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 transition-colors duration-300 text-gray-900">Paramètres</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 transition-colors duration-300">
          <div className="p-6 flex items-center justify-between transition cursor-pointer hover:bg-gray-50" onClick={() => toggleSetting('notifications')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold transition-colors duration-300 text-gray-900">Notifications</h3>
                <p className="text-sm transition-colors duration-300 text-gray-500">M'alerter lors des réponses et des nouveautés</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between transition cursor-pointer hover:bg-gray-50" onClick={() => toggleSetting('darkMode')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold transition-colors duration-300 text-gray-900">Mode sombre</h3>
                <p className="text-sm transition-colors duration-300 text-gray-500">Thème visuel global de la plateforme</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between transition cursor-pointer hover:bg-gray-50" onClick={() => toggleSetting('autoUpdate')}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold transition-colors duration-300 text-gray-900">Mises à jour automatiques</h3>
                <p className="text-sm transition-colors duration-300 text-gray-500">Télécharger automatiquement en WiFi</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${settings.autoUpdate ? 'bg-indigo-600' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${settings.autoUpdate ? 'translate-x-6' : ''}`}></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold transition-colors duration-300 text-gray-900">Sécurité & Confidentialité</h3>
                <p className="text-sm transition-colors duration-300 text-gray-500">Gérer l'accès à vos données</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="text-sm font-medium text-indigo-500 hover:text-indigo-700 ml-14 transition-colors"
            >
              Gérer mes permissions
            </button>
          </div>
        </div>
      </div>

      {/* Modal Sécurité & Confidentialité */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-500" /> Sécurité & Confidentialité
              </h2>
              <button onClick={() => setShowPrivacyModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-gray-600">
              Gérez vos données personnelles. Vous pouvez télécharger une copie de vos préférences ou effacer vos données locales.
            </p>

            <div className="space-y-3">
              <button 
                onClick={handleDownloadData}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" /> Télécharger mes données
              </button>
              
              <button 
                onClick={handleClearCache}
                className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-colors border border-gray-200 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="w-5 h-5" /> Effacer le cache local
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
