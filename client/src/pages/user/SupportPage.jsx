import React, { useState, useEffect } from 'react';
import { getTickets, addMessageToTicket } from '../../services/supportService';
import ComplaintModal from '../../components/support/ComplaintModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Headset, Plus, PhoneCall, ShieldAlert, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { SUPPORT_PHONE } from '../../utils/constants';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchTicketList = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      if (data.success) {
        setTickets(data.tickets);
        if (data.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(data.tickets[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketList();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await addMessageToTicket(selectedTicket.ticketId, replyText);
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyText('');
        fetchTicketList();
      }
    } catch (err) {
      setToast({ message: 'Failed to send reply.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Banner */}
      <div className="bg-obsidian text-white p-8 rounded-3xl border border-gold-500/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Headset className="w-4 h-4" /> After-Sales Concierge Support
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Customer Support & Discrepancy Portal</h1>
          <p className="text-xs text-zinc-300">Raise complaints, track ticket resolution & request direct phone support.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Raise New Complaint Ticket
        </button>
      </div>

      {/* Direct Phone Support Escalation Banner */}
      <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-amber-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm">Need Direct Phone Support Escalation?</h4>
            <p className="text-xs text-amber-800">For urgent issues or unresolved complaints, speak directly with senior management.</p>
          </div>
        </div>

        <a
          href="tel:+9118005893566"
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-sm transition-colors"
        >
          Call Hotline: {SUPPORT_PHONE}
        </a>
      </div>

      {/* Tickets & Thread Layout */}
      {loading ? (
        <LoadingSpinner text="Fetching support tickets..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Ticket List */}
          <div className="bg-white border border-gold-300 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-base text-obsidian border-b border-gold-100 pb-2">
              Your Complaint Tickets ({tickets.length})
            </h3>

            {tickets.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                      selectedTicket?._id === t._id
                        ? 'bg-gold-50/60 border-gold-500 ring-2 ring-gold-200'
                        : 'bg-ivory border-gold-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-obsidian">#{t.ticketId}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="font-medium text-zinc-800 line-clamp-1">{t.category}</p>
                    <span className="text-[10px] text-zinc-400 block">
                      Created: {new Date(t.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-zinc-500 space-y-2">
                <p>No complaints submitted.</p>
              </div>
            )}
          </div>

          {/* Ticket Thread */}
          <div className="lg:col-span-2 bg-white border border-gold-300 rounded-2xl shadow-sm flex flex-col h-[560px]">
            {selectedTicket ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gold-200 bg-ivory flex justify-between items-center rounded-t-2xl">
                  <div>
                    <h3 className="font-serif font-bold text-base text-obsidian">
                      Ticket #{selectedTicket.ticketId} - {selectedTicket.category}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Status: <strong className="text-gold-700">{selectedTicket.status}</strong>
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs bg-zinc-50/50">
                  {selectedTicket.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-[80%] space-y-1 ${
                          msg.sender === 'USER'
                            ? 'bg-obsidian text-white rounded-br-none'
                            : msg.sender === 'SUPPORT'
                            ? 'bg-gold-500 text-white rounded-bl-none'
                            : 'bg-white text-zinc-800 border border-gold-300 rounded-bl-none'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold opacity-75 block">
                          {msg.sender}
                        </span>
                        <p>{msg.text}</p>
                        <span className="text-[9px] opacity-60 block text-right">
                          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Bar */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-gold-200 bg-white flex gap-2 rounded-b-2xl">
                  <input
                    type="text"
                    placeholder="Type message to support team..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-ivory border border-gold-200 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white px-4 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-400">
                Select a complaint ticket to view message thread.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ComplaintModal
          onClose={() => setShowModal(false)}
          onSuccess={(ticket) => {
            setToast({ message: `Ticket #${ticket.ticketId} created!`, type: 'success' });
            fetchTicketList();
          }}
        />
      )}

    </div>
  );
};

export default SupportPage;
