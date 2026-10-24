import React, { useState, useEffect } from 'react';
import { getAdminComplaints } from '../../services/adminService';
import { addMessageToTicket } from '../../services/supportService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Headset, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAdminComplaints();
      if (data.success) {
        setComplaints(data.complaints);
        if (data.complaints.length > 0 && !selectedTicket) {
          setSelectedTicket(data.complaints[0]);
        }
      }
    } catch (err) {
      console.error('Error loading complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await addMessageToTicket(selectedTicket.ticketId, replyText);
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyText('');
        setToast({ message: 'Reply sent to customer ticket.', type: 'success' });
        fetchComplaints();
      }
    } catch (err) {
      setToast({ message: 'Failed to send reply.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-ivory border border-gold-300 p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <Headset className="w-6 h-6 text-gold-600" /> Admin Customer Complaints Resolver
          </h1>
          <p className="text-xs text-zinc-500">Review ticket descriptions, respond to customers & close resolved tickets</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading customer complaints queue..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* List */}
          <div className="bg-white border border-gold-300 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-base text-obsidian border-b border-gold-100 pb-2">
              All Tickets ({complaints.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedTicket(c)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs space-y-1 ${
                    selectedTicket?._id === c._id
                      ? 'bg-gold-50/60 border-gold-500 ring-2 ring-gold-200'
                      : 'bg-ivory border-gold-200 hover:border-gold-300'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-obsidian">
                    <span>#{c.ticketId}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{c.status}</span>
                  </div>
                  <p className="font-semibold text-zinc-700">{c.user?.name || 'Customer'}</p>
                  <p className="text-zinc-500 text-[11px] truncate">{c.category}: {c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Thread View */}
          <div className="lg:col-span-2 bg-white border border-gold-300 rounded-2xl shadow-sm flex flex-col h-[560px]">
            {selectedTicket ? (
              <>
                <div className="p-4 border-b border-gold-200 bg-ivory rounded-t-2xl">
                  <h3 className="font-serif font-bold text-base text-obsidian">
                    Ticket #{selectedTicket.ticketId} - {selectedTicket.category}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Customer: <strong>{selectedTicket.user?.name}</strong> ({selectedTicket.user?.email})
                  </p>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs bg-zinc-50/50">
                  {selectedTicket.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.sender === 'SUPPORT' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-[80%] space-y-1 ${
                          msg.sender === 'SUPPORT'
                            ? 'bg-obsidian text-gold-400 rounded-br-none'
                            : 'bg-white text-zinc-800 border border-gold-300 rounded-bl-none'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold opacity-75 block">{msg.sender}</span>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="p-3 border-t border-gold-200 bg-white flex gap-2 rounded-b-2xl">
                  <input
                    type="text"
                    placeholder="Type official support reply to customer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-ivory border border-gold-200 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white px-4 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" /> Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-400">
                Select a ticket to review customer messages.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
