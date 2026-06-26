import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppDetails } from '../hooks/useApps';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import { Loader2, ArrowLeft, Download, ShieldCheck, Eye, ThumbsUp, ThumbsDown, MessageSquare, Star, Send, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Fonction utilitaire pour convertir les liens Google Drive en téléchargement direct
const getDirectDownloadUrl = (url: string) => {
  if (!url) return url;
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};

export default function AppDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { app, loading: appLoading, error } = useAppDetails(slug);
  const { user, loading: authLoading } = useAuth();

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stats, setStats] = useState({ views: 0, downloads: 0, likes: 0, dislikes: 0 });
  const [userVote, setUserVote] = useState<string | null>(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (app && user) {
      setStats({
        views: app.views_count || 0,
        downloads: app.downloads_count || 0,
        likes: app.likes_count || 0,
        dislikes: app.dislikes_count || 0
      });

      // Incrémenter la vue (une fois par visite)
      const incrementView = async () => {
        const newViews = (app.views_count || 0) + 1;
        await supabase.from('apps').update({ views_count: newViews }).eq('id', app.id);
        setStats(s => ({ ...s, views: newViews }));
      };
      incrementView();

      fetchComments();
      fetchUserVote();
    }
  }, [app?.id, user?.id]);

  const fetchComments = async () => {
    if (!app) return;
    const { data } = await supabase.from('comments').select('*, profiles(username)').eq('app_id', app.id).order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const fetchUserVote = async () => {
    if (!app || !user) return;
    const { data } = await supabase.from('votes').select('vote_type').eq('app_id', app.id).eq('user_id', user.id).single();
    if (data) setUserVote(data.vote_type);
  };

  const handleDownload = async () => {
    if (!app) return;
    const newDownloads = stats.downloads + 1;
    await supabase.from('apps').update({ downloads_count: newDownloads }).eq('id', app.id);
    setStats(s => ({ ...s, downloads: newDownloads }));
  };

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!app || !user) return;
    if (userVote === type) return; // Déjà voté

    let newLikes = stats.likes;
    let newDislikes = stats.dislikes;

    if (type === 'like') {
      newLikes++;
      if (userVote === 'dislike') newDislikes--;
    } else {
      newDislikes++;
      if (userVote === 'like') newLikes--;
    }

    setStats(s => ({ ...s, likes: newLikes, dislikes: newDislikes }));
    setUserVote(type);

    await supabase.from('votes').upsert({ app_id: app.id, user_id: user.id, vote_type: type }, { onConflict: 'app_id,user_id' });
    await supabase.from('apps').update({ likes_count: newLikes, dislikes_count: newDislikes }).eq('id', app.id);
  };

  const handlePostComment = async () => {
    if (!app || !user || !newComment.trim()) return;
    setIsSubmitting(true);
    try {
      // S'assurer que le profil existe (fallback sécurité)
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert({ id: user.id, username: user.email?.split('@')[0] || 'Anonyme' });
      }

      await supabase.from('comments').insert({
        app_id: app.id,
        user_id: user.id,
        content: newComment,
        rating: rating
      });
      setNewComment('');
      setRating(5);
      fetchComments();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la publication du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !messageContent.trim()) return;
    setIsSendingMessage(true);
    try {
      // S'assurer que le profil existe (fallback sécurité)
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert({ id: user.id, username: user.email?.split('@')[0] || 'Anonyme' });
      }

      await supabase.from('messages').insert({
        sender_id: user.id,
        subject: messageSubject || `À propos de ${app?.title}`,
        content: messageContent
      });
      setShowContactModal(false);
      setMessageContent('');
      setMessageSubject('');
      alert("Votre message a été envoyé à l'administrateur avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi du message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (authLoading || appLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Application introuvable</h2>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  const downloadUrl = getDirectDownloadUrl(app.apk_url);
  const avgRating = comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : '5.0';

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pb-20">
      <Navbar />

      {/* Bannière Header */}
      <div className="w-full h-64 md:h-80 relative">
        <Link 
          to="/" 
          className="absolute top-4 left-4 sm:left-6 lg:left-8 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <img 
          src={app.banner_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200'} 
          alt="Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row items-end gap-6 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gray-800 border-4 border-gray-900 shadow-2xl overflow-hidden flex-shrink-0 relative z-10 translate-y-8 md:translate-y-12">
              <img 
                src={app.icon_url || 'https://via.placeholder.com/150'} 
                alt={app.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 w-full pb-2 md:pb-0">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{app.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-300 font-medium">
                <span className="text-indigo-400">{app.developer_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded-md text-sm border border-gray-700">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Vérifié
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0 pb-2 flex flex-col items-center gap-3">
              {app.apk_url ? (
                <a onClick={handleDownload} href={downloadUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger ({stats.downloads})
                </a>
              ) : (
                <button disabled className="w-full md:w-auto bg-gray-700 text-gray-400 font-bold py-3 px-8 rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Bientôt disponible
                </button>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {stats.views} vues</span>
                <button onClick={() => handleVote('like')} className={`flex items-center gap-1 transition-colors ${userVote === 'like' ? 'text-green-400' : 'hover:text-green-300'}`}>
                  <ThumbsUp className="w-4 h-4" /> {stats.likes}
                </button>
                <button onClick={() => handleVote('dislike')} className={`flex items-center gap-1 transition-colors ${userVote === 'dislike' ? 'text-red-400' : 'hover:text-red-300'}`}>
                  <ThumbsDown className="w-4 h-4" /> {stats.dislikes}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Colonne Principale */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">À propos de cette application</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {app.full_description || app.short_description || "Aucune description longue disponible."}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Captures d'écran</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-64 h-40 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700">
                    <img src={app.banner_url || ''} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Colonne Latérale */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-4">Informations</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="text-gray-500 block mb-1">Catégorie</span>
                  <span className="text-gray-200 font-medium">{app.categories?.name || 'Général'}</span>
                </li>
                <li>
                  <span className="text-gray-500 block mb-1">Date de sortie</span>
                  <span className="text-gray-200 font-medium">
                    {new Date(app.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </li>
                <li>
                  <span className="text-gray-500 block mb-1">Version actuelle</span>
                  <span className="text-gray-200 font-medium">1.0.0</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section Commentaires & Notes */}
        <div className="mt-16 border-t border-gray-800 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-500" />
              Avis et Commentaires ({comments.length})
            </h2>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-white font-bold ml-1 text-lg">{avgRating}</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl mb-8">
             <h3 className="text-lg font-semibold mb-4">Laissez un avis</h3>
             <div className="flex items-center gap-2 mb-4 text-gray-500">
               <span>Votre note :</span>
               <div className="flex gap-1 cursor-pointer">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 transition ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} 
                    />
                  ))}
               </div>
             </div>
             <textarea 
               value={newComment}
               onChange={e => setNewComment(e.target.value)}
               className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
               placeholder="Partagez votre expérience avec cette application..."
             ></textarea>
             <div className="mt-4 flex justify-end">
               <button 
                 onClick={handlePostComment}
                 disabled={isSubmitting || !newComment.trim()}
                 className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
               >
                 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                 Publier
               </button>
             </div>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-800">
                <p className="text-gray-400 italic text-center">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-indigo-300">{comment.profiles?.username || 'Utilisateur'}</div>
                    <div className="flex text-yellow-400">
                      {[...Array(comment.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                  <div className="text-xs text-gray-500 mt-3">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Bouton Flottant Contact Admin */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium">
            Contacter l'Admin
          </span>
        </button>
      </div>

      {/* Modal Contact Admin */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold">Contacter l'Admin</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleContactAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sujet (optionnel)</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Sujet du message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  value={messageContent}
                  onChange={e => setMessageContent(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-[120px]"
                  placeholder="Votre message ici..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSendingMessage || !messageContent.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
