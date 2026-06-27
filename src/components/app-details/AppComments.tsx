import { MessageSquare, Star, Send, Loader2 } from 'lucide-react';

interface AppCommentsProps {
  comments: any[];
  avgRating: string;
  rating: number;
  setRating: (rating: number) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  handlePostComment: () => void;
  isSubmitting: boolean;
}

export default function AppComments({
  comments,
  avgRating,
  rating,
  setRating,
  newComment,
  setNewComment,
  handlePostComment,
  isSubmitting
}: AppCommentsProps) {
  return (
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
            {[1, 2, 3, 4, 5].map(star => (
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
  );
}
