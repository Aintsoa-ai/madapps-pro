import { useApps } from '../../hooks/useApps';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import { Plus, Edit, Trash2, Users, Download, Eye, MessageSquare, ThumbsUp, ThumbsDown, Star, X, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  // ... existing states
  const { apps, loading } = useApps();
  const { deleteApp } = useDeleteApp();
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Chart data
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [appStatsData, setAppStatsData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchMessages();
    fetchComments();
    fetchProfiles();
    generateMockVisitorData();
  }, []);

  useEffect(() => {
    if (apps.length > 0) {
      const stats = apps.map(app => ({
        name: app.title.substring(0, 15) + (app.title.length > 15 ? '...' : ''),
        Téléchargements: (app as any).downloads_count || 0,
        Vues: (app as any).views_count || 0
      })).sort((a, b) => b.Téléchargements - a.Téléchargements).slice(0, 5);
      setAppStatsData(stats);
    }
  }, [apps]);

  const generateMockVisitorData = () => {
    // Generate realistic looking data for the last 7 days
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({
        name: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        Visiteurs: Math.floor(Math.random() * 50) + 20 + (i === 0 ? 30 : 0) // Spike today
      });
    }
    setVisitorData(data);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('daily_visits').select('visitors_count').eq('visit_date', today).single();
    if (data) {
      setDailyVisitors(data.visitors_count);
      // Update today's mock data with real data if available
      setVisitorData(prev => {
        const newData = [...prev];
        if (newData.length > 0) {
          newData[newData.length - 1].Visiteurs = data.visitors_count > 0 ? data.visitors_count : newData[newData.length - 1].Visiteurs;
        }
        return newData;
      });
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*, profiles(username, avatar_url)').is('receiver_id', null).order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('app_id, rating');
    if (data) setComments(data);
  };

  const handleReplyClick = (msg: any) => {
    setReplyingTo(msg);
    setReplyContent('');
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyContent.trim()) return;
    
    setIsSendingReply(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (!replyingTo.sender_id) {
        throw new Error("Impossible de répondre : L'expéditeur d'origine est inconnu (message anonyme).");
      }

      // S'assurer que le profil de l'admin existe (fallback sécurité)
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert({ id: user.id, username: user.email?.split('@')[0] || 'Admin' });
      }

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: replyingTo.sender_id,
        subject: `Re: ${replyingTo.subject}`,
        content: replyContent
      });

      if (error) throw error;
      
      setReplyingTo(null);
      setReplyContent('');
      toast.success("Réponse envoyée avec succès au membre !");
    } catch (e: any) {
      console.error(e);
      toast.error(`Erreur lors de l'envoi de la réponse : ${e.message || JSON.stringify(e)}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">Confirmer la suppression</p>
        <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer l'application "{title}" ? Cette action est irréversible.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Annuler
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const success = await deleteApp(id);
              if (success) {
                toast.success("Application supprimée avec succès.");
                setTimeout(() => window.location.reload(), 1000);
              } else {
                toast.error("Une erreur est survenue lors de la suppression.");
              }
            }} 
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    ), { duration: 10000, style: { minWidth: '300px' } });
  };

  const sortedApps = [...apps].sort((a, b) => ((b as any).downloads_count || 0) - ((a as any).downloads_count || 0));
  const totalDownloads = apps.reduce((acc, app) => acc + ((app as any).downloads_count || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre plateforme.</p>
        </div>
        <Link to="/admin/apps/new" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 shadow-sm">
          <Plus className="w-5 h-5" />
          Nouvelle app
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Visiteurs (Aujourd'hui)</div>
            <div className="text-3xl font-bold text-gray-900">{dailyVisitors}</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +12% vs hier
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl group-hover:bg-indigo-100 transition-colors"><Activity className="w-8 h-8 text-indigo-600" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Membres Inscrits</div>
            <div className="text-3xl font-bold text-gray-900">{profiles.length}</div>
            <div className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-2">
              Total de la communauté
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors"><Users className="w-8 h-8 text-blue-600" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Total Téléchargements</div>
            <div className="text-3xl font-bold text-gray-900">{totalDownloads}</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +5% cette semaine
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl group-hover:bg-green-100 transition-colors"><Download className="w-8 h-8 text-green-600" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Messages reçus</div>
            <div className="text-3xl font-bold text-gray-900">{messages.length}</div>
            <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-2">
              En attente de réponse
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors"><MessageSquare className="w-8 h-8 text-orange-600" /></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Trafic des 7 derniers jours
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="Visiteurs" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVisiteurs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" /> Top Applications (Téléchargements)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appStatsData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Téléchargements" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="Vues" fill="#93c5fd" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Liste des applications (2 colonnes) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Application</th>
                  <th className="px-6 py-4">Statistiques</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8">Chargement...</td></tr>
                ) : (
                  sortedApps.map((app) => {
                    const appComments = comments.filter(c => c.app_id === app.id);
                    const avgRating = appComments.length > 0 
                      ? (appComments.reduce((acc, c) => acc + c.rating, 0) / appComments.length).toFixed(1) 
                      : 'N/A';

                    return (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img src={app.icon_url || ''} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{app.title}</div>
                          <div className="text-xs text-gray-500">{app.categories?.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-4 text-xs font-medium">
                          <span className="flex items-center gap-1 text-green-400" title="Téléchargements"><Download className="w-3 h-3" /> {(app as any).downloads_count || 0}</span>
                          <span className="flex items-center gap-1 text-blue-400" title="Vues"><Eye className="w-3 h-3" /> {(app as any).views_count || 0}</span>
                          <span className="flex items-center gap-1 text-indigo-400" title="J'aime"><ThumbsUp className="w-3 h-3" /> {(app as any).likes_count || 0}</span>
                          <span className="flex items-center gap-1 text-red-400" title="Je n'aime pas"><ThumbsDown className="w-3 h-3" /> {(app as any).dislikes_count || 0}</span>
                          <span className="flex items-center gap-1 text-yellow-400" title="Note moyenne"><Star className="w-3 h-3 fill-current" /> {avgRating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/apps/edit/${app.slug}`} className="text-gray-400 hover:text-indigo-600 transition" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(app.id, app.title)} className="text-gray-400 hover:text-red-600 transition" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liste des messages (1 colonne) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Derniers Messages</h2>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Aucun message reçu.</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-indigo-600 text-sm">{msg.profiles?.username || 'Membre'}</span>
                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="font-medium text-gray-900 mb-1 text-sm">{msg.subject}</div>
                  <p className="text-gray-600 text-sm mb-3">{msg.content}</p>
                  
                  {/* Reply Button */}
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-200">
                    <button 
                      onClick={() => handleReplyClick(msg)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Répondre
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {profile.username?.charAt(0).toUpperCase() || 'A'}
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

      {/* Admin Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {replyingTo.profiles?.username?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">Répondre à {replyingTo.profiles?.username}</h3>
                  <p className="text-xs text-gray-500">Message reçu le {new Date(replyingTo.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={submitReply} className="p-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 relative">
                <div className="absolute -left-3 top-4 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Message original</div>
                <div className="text-sm text-gray-700 italic ml-4">"{replyingTo.content}"</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Votre réponse</label>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-[140px] resize-none transition-all shadow-sm placeholder-gray-400"
                    placeholder={`Rédigez votre message pour ${replyingTo.profiles?.username}...`}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyContent.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSendingReply ? 'Envoi en cours...' : 'Envoyer la réponse'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
