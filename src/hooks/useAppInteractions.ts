import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAppInteractions(app: any | null, user: User | null) {
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

  const [messageSuccess, setMessageSuccess] = useState(false);

  const handleContactAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !messageContent.trim()) return;
    setIsSendingMessage(true);
    setMessageSuccess(false);
    try {
      // S'assurer que le profil existe (fallback sécurité)
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (!profile) {
        await supabase.from('profiles').insert({ id: user.id, username: user.email?.split('@')[0] || 'Anonyme' });
      }

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        subject: messageSubject || `À propos de ${app?.title}`,
        content: messageContent
      });
      
      if (error) throw error;
      setMessageContent('');
      setMessageSubject('');
      setMessageSuccess(true);
      
      // Masquer le message de succès et fermer la modale après 3 secondes
      setTimeout(() => {
        setMessageSuccess(false);
        setShowContactModal(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi du message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return {
    comments,
    newComment,
    setNewComment,
    rating,
    setRating,
    isSubmitting,
    stats,
    userVote,
    showContactModal,
    setShowContactModal,
    messageSubject,
    setMessageSubject,
    messageContent,
    setMessageContent,
    isSendingMessage,
    messageSuccess,
    handleDownload,
    handleVote,
    handlePostComment,
    handleContactAdmin
  };
}
