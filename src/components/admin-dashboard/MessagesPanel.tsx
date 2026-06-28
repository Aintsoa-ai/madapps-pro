
import { MessageSquare } from 'lucide-react';

interface MessagesPanelProps {
  messages: any[];
  handleReplyClick: (msg: any) => void;
}

export default function MessagesPanel({ messages, handleReplyClick }: MessagesPanelProps) {
  return (
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
  );
}
