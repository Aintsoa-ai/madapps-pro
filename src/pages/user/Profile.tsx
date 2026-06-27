import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { User, Mail, Save, Camera } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ username: '', avatar_url: '', full_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile({
          username: data.username || '',
          avatar_url: data.avatar_url || '',
          full_name: data.full_name || ''
        });
      }
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success("Profil mis à jour avec succès !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-indigo-600"></div>
          <div className="px-6 pb-6 relative">
            <div className="absolute -top-16 left-6 w-32 h-32 bg-white rounded-full p-2">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden relative group">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="mt-20">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Non modifiable)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" value={user?.email || ''} disabled className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
                  <input type="text" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" placeholder="Votre pseudo public" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choisissez votre Avatar</label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Nala",
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=Max"
                    ].map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfile({ ...profile, avatar_url: url })}
                        className={`w-16 h-16 rounded-full border-4 overflow-hidden transition-all ${
                          profile.avatar_url === url 
                            ? 'border-indigo-600 scale-110 shadow-md' 
                            : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover bg-gray-100" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
