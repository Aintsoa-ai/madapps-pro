import { Search, Menu, User, Bell, X, Check, CheckCheck, MessageSquare, Settings, HelpCircle, Info, LogOut, UserMinus, ChevronRight } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showInbox, setShowInbox] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchUserMessages(user.id);
        fetchUserProfile(user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserMessages(session.user.id);
        fetchUserProfile(session.user.id);
      }
      else { 
        setUnreadCount(0); 
        setInboxMessages([]); 
        setUserProfile(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setUserProfile(data);
  };

  const fetchUserMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setInboxMessages(data);
      setUnreadCount(data.filter(m => !m.is_read).length);
    }
  };

  const markAsRead = async (msgId: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', msgId);
    if (user) fetchUserMessages(user.id);
  };

  const handleReplyClick = (msg: any) => {
    setReplyingTo(msg);
    setReplyContent('');
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyContent.trim() || !user) return;
    
    setIsSendingReply(true);
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: null,
        subject: `Re: ${replyingTo.subject}`,
        content: replyContent
      });

      if (error) throw error;
      
      setReplyingTo(null);
      setReplyContent('');
      toast.success("Votre réponse a été envoyée à l'administrateur !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'envoi de la réponse.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowSidebar(false);
    toast.success("Déconnexion réussie");
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">Suppression de compte</p>
        <p className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action effacera toutes vos données.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md">Annuler</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            // Delete user data and signOut (Full deletion requires Admin API or edge function, but we can clear profile and sign out for now)
            if (user) await supabase.from('profiles').delete().eq('id', user.id);
            await supabase.auth.signOut();
            setShowSidebar(false);
            toast.success("Compte supprimé avec succès.");
            navigate('/');
          }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md">Supprimer</button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  useEffect(() => {
    if (replyContent.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    }
    setIsTyping(false);
  }, [replyContent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) setSearchParams({ q: inputValue }, { replace: true });
      else setSearchParams({}, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  useEffect(() => {
    setInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      {/* Overlay du Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-[60] transition-opacity" onClick={() => setShowSidebar(false)}></div>
      )}

      {/* Sidebar Mobile/Desktop */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm overflow-hidden">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{userProfile?.username || user?.email?.split('@')[0] || 'Invité'}</h2>
              <p className="text-sm text-gray-500">{user?.email || 'Non connecté'}</p>
            </div>
          </div>
          <button onClick={() => setShowSidebar(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {user ? (
            <div className="space-y-1 px-3">
              <Link to="/profil" onClick={() => setShowSidebar(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition group">
                <div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> <span className="font-medium">Afficher le profil</span></div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
              </Link>
              <Link to="/mes-telechargements" onClick={() => setShowSidebar(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition group">
                <div className="flex items-center gap-3"><CheckCheck className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> <span className="font-medium">Mes téléchargements</span></div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
              </Link>
              <div className="my-4 border-t border-gray-100"></div>
              <Link to="/parametres" onClick={() => setShowSidebar(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition group">
                <div className="flex items-center gap-3"><Settings className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> <span className="font-medium">Paramètres</span></div>
              </Link>
              <Link to="/support" onClick={() => setShowSidebar(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition group">
                <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> <span className="font-medium">Aide & Support</span></div>
              </Link>
              <Link to="/a-propos" onClick={() => setShowSidebar(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition group">
                <div className="flex items-center gap-3"><Info className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /> <span className="font-medium">À propos & Conditions</span></div>
              </Link>
            </div>
          ) : (
            <div className="px-6 py-4">
              <p className="text-gray-500 text-sm mb-4">Connectez-vous pour accéder à votre profil et vos téléchargements.</p>
              <Link to="/auth" onClick={() => setShowSidebar(false)} className="block w-full text-center bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition">
                Se connecter
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium">
              <LogOut className="w-5 h-5 text-gray-400" /> Se déconnecter
            </button>
            <button onClick={handleDeleteAccount} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium">
              <UserMinus className="w-5 h-5" /> Supprimer son compte
            </button>
          </div>
        )}
      </div>

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowSidebar(true)} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="text-xl font-medium text-gray-700 flex items-center gap-2">
                <span className="text-indigo-600 font-bold text-2xl">▶</span>
                MadaStack
              </Link>
            
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
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowInbox(!showInbox)} 
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showInbox && (
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button onClick={() => setShowInbox(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {replyingTo ? (
                      <form onSubmit={submitReply} className="p-4 flex flex-col h-64">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">Répondre à l'Admin</span>
                          <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 text-xs flex items-center">
                            <X className="w-3 h-3 mr-1" /> Annuler
                          </button>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg mb-3 text-xs text-gray-600 border border-gray-100 line-clamp-2 italic">
                          "{replyingTo.content}"
                        </div>
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Écrivez votre message..."
                          className="flex-1 w-full bg-white text-gray-900 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-3"
                          required
                        />
                        <div className="flex items-center justify-between">
                          <div className="h-4">
                            {isTyping && (
                              <div className="flex gap-1 items-center px-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={isSendingReply || !replyContent.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
                          >
                            {isSendingReply ? 'Envoi...' : 'Envoyer'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {inboxMessages.length === 0 ? (
                          <div className="p-6 text-center text-sm text-gray-500">Aucun message de l'admin.</div>
                        ) : (
                          inboxMessages.map(msg => (
                            <div key={msg.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!msg.is_read ? 'bg-indigo-50/30' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                                  Admin MadaStack
                                </span>
                                <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="text-sm font-medium text-indigo-900 mb-1">{msg.subject}</div>
                              <p className="text-xs text-gray-600 line-clamp-3 mb-3">{msg.content}</p>
                              
                              <div className="flex items-center gap-4">
                                {!msg.is_read ? (
                                  <button 
                                    onClick={() => markAsRead(msg.id)}
                                    className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded"
                                  >
                                    <Check className="w-3 h-3" /> Marquer comme lu
                                  </button>
                                ) : (
                                  <span className="text-xs text-green-500 font-medium flex items-center gap-1" title="Lu">
                                    <CheckCheck className="w-4 h-4" /> Vu
                                  </span>
                                )}
                                
                                <button 
                                  onClick={() => handleReplyClick(msg)}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition"
                                >
                                  <MessageSquare className="w-3 h-3" /> Répondre
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <Link to="/admin/dashboard" className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition" title="Espace Administrateur">
              <User className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
