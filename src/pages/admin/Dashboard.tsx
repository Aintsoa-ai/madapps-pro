import { useApps } from '../../hooks/useApps';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import { Plus, Edit, Trash2, Users, Download, Eye, MessageSquare, ThumbsUp, ThumbsDown, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
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

  useEffect(() => {
    fetchStats();
    fetchMessages();
    fetchComments();
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('daily_visits').select('visitors_count').eq('visit_date', today).single();
    if (data) setDailyVisitors(data.visitors_count);
  };

  const fetchMessages = async () => {
    // Ne charger que les messages destinés à l'admin (receiver_id est null)
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

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: replyingTo.sender_id, // L'admin répond à l'expéditeur d'origine
        subject: `Re: ${replyingTo.subject}`,
        content: replyContent
      });

      if (error) throw error;
      
      setReplyingTo(null);
      setReplyContent('');
      alert("Réponse envoyée avec succès au membre !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi de la réponse.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'application "${title}" ? Cette action est irréversible.`)) {
      const success = await deleteApp(id);
      if (success) {
        window.location.reload();
      } else {
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  // Trier par téléchargements décroissants
  const sortedApps = [...apps].sort((a, b) => ((b as any).downloads_count || 0) - ((a as any).downloads_count || 0));
  const totalDownloads = apps.reduce((acc, app) => acc + ((app as any).downloads_count || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre plateforme.</p>
        </div>
        <Link to="/admin/apps/new" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle app
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl"><Users className="w-8 h-8 text-indigo-600" /></div>
          <div>
            <div className="text-sm text-gray-500">Visiteurs (Aujourd'hui)</div>
            <div className="text-2xl font-bold text-gray-900">{dailyVisitors}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-xl"><Users className="w-8 h-8 text-blue-600" /></div>
          <div>
            <div className="text-sm text-gray-500">Membres Inscrits</div>
            <div className="text-2xl font-bold text-gray-900">{profiles.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-xl"><Download className="w-8 h-8 text-green-600" /></div>
          <div>
            <div className="text-sm text-gray-500">Total Téléchargements</div>
            <div className="text-2xl font-bold text-gray-900">{totalDownloads}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-50 p-4 rounded-xl"><MessageSquare className="w-8 h-8 text-orange-600" /></div>
          <div>
            <div className="text-sm text-gray-500">Messages reçus</div>
            <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
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
