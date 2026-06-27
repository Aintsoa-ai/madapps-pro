import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppDetails } from '../hooks/useApps';
import { useAuth } from '../hooks/useAuth';
import { useAppInteractions } from '../hooks/useAppInteractions';
import Navbar from '../components/layout/Navbar';
import { Loader2, ArrowLeft, MessageSquare } from 'lucide-react';

import AppHeader from '../components/app-details/AppHeader';
import AppDescription from '../components/app-details/AppDescription';
import AppSidebar from '../components/app-details/AppSidebar';
import AppComments from '../components/app-details/AppComments';
import ContactAdminModal from '../components/app-details/ContactAdminModal';

// Fonction utilitaire pour convertir les liens Google Drive en téléchargement direct
const getDirectDownloadUrl = (url: string | null | undefined) => {
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

  const {
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
    handleDownload,
    handleVote,
    handlePostComment,
    handleContactAdmin
  } = useAppInteractions(app, user);

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

  const downloadUrl = getDirectDownloadUrl(app.apk_url) || '';
  const avgRating = comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : '5.0';

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pb-20">
      <Navbar />

      <AppHeader 
        app={app}
        stats={stats}
        userVote={userVote}
        downloadUrl={downloadUrl}
        handleDownload={handleDownload}
        handleVote={handleVote}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <AppDescription app={app} />
          <AppSidebar app={app} />
        </div>

        <AppComments 
          comments={comments}
          avgRating={avgRating}
          rating={rating}
          setRating={setRating}
          newComment={newComment}
          setNewComment={setNewComment}
          handlePostComment={handlePostComment}
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Bouton Flottant Contact Admin */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium">
            Contacter l'Admin
          </span>
        </button>
      </div>

      <ContactAdminModal 
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
        handleContactAdmin={handleContactAdmin}
        messageSubject={messageSubject}
        setMessageSubject={setMessageSubject}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        isSendingMessage={isSendingMessage}
        messageSuccess={messageSuccess}
      />
    </div>
  );
}
