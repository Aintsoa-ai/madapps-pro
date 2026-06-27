import { X, Send, Loader2 } from 'lucide-react';

interface ContactAdminModalProps {
  showContactModal: boolean;
  setShowContactModal: (show: boolean) => void;
  handleContactAdmin: (e: React.FormEvent) => void;
  messageSubject: string;
  setMessageSubject: (subject: string) => void;
  messageContent: string;
  setMessageContent: (content: string) => void;
  isSendingMessage: boolean;
}

export default function ContactAdminModal({
  showContactModal,
  setShowContactModal,
  handleContactAdmin,
  messageSubject,
  setMessageSubject,
  messageContent,
  setMessageContent,
  isSendingMessage
}: ContactAdminModalProps) {
  if (!showContactModal) return null;

  return (
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
  );
}
