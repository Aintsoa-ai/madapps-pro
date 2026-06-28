import { useApps } from '../../hooks/useApps';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Components
import DashboardStats from '../../components/admin-dashboard/DashboardStats';
import DashboardCharts from '../../components/admin-dashboard/DashboardCharts';
import TopAppsTable from '../../components/admin-dashboard/TopAppsTable';
import MessagesPanel from '../../components/admin-dashboard/MessagesPanel';
import MembersTable from '../../components/admin-dashboard/MembersTable';
import ReplyMessageModal from '../../components/admin-dashboard/ReplyMessageModal';

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
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({
        name: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        Visiteurs: Math.floor(Math.random() * 50) + 20 + (i === 0 ? 30 : 0)
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

      <DashboardStats 
        dailyVisitors={dailyVisitors} 
        profilesLength={profiles.length} 
        totalDownloads={totalDownloads} 
        messagesLength={messages.length} 
      />

      <DashboardCharts 
        visitorData={visitorData} 
        appStatsData={appStatsData} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <TopAppsTable 
          sortedApps={sortedApps} 
          loading={loading} 
          comments={comments} 
          handleDelete={handleDelete} 
        />
        
        <MessagesPanel 
          messages={messages} 
          handleReplyClick={handleReplyClick} 
        />
      </div>

      <MembersTable 
        profiles={profiles} 
      />

      <ReplyMessageModal 
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        isSendingReply={isSendingReply}
        submitReply={submitReply}
      />
    </div>
  );
}
