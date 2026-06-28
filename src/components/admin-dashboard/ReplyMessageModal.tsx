
import { X, MessageSquare } from 'lucide-react';

interface ReplyMessageModalProps {
  replyingTo: any;
  setReplyingTo: (msg: any | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  isSendingReply: boolean;
  submitReply: (e: React.FormEvent) => void;
}

export default function ReplyMessageModal({
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  isSendingReply,
  submitReply
}: ReplyMessageModalProps) {
  if (!replyingTo) return null;

  return (
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
  );
}
