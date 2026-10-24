import React, { useState } from 'react';
import { queryChatbot } from '../../services/supportService';
import { MessageSquare, Send, Bot, User, PhoneCall, Sparkles, X, ChevronRight } from 'lucide-react';
const SUPPORT_PHONE = '+91 1800-LUXELOOM';

const ChatWidget = ({ onOpenComplaintModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'BOT',
      text: 'Greetings! I am your LuxeLoom Automated Concierge. How may I assist you with your order today?',
      timestamp: new Date(),
    },
  ]);
  const [showEscalation, setShowEscalation] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'Where is my order?',
    'When will it arrive?',
    'I want to return this.',
    'Payment failed.',
    'Product damaged or wrong item.',
  ];

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'USER', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    try {
      setLoading(true);
      const data = await queryChatbot(text, orderId);
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: 'BOT', text: data.reply, timestamp: new Date() },
        ]);

        if (data.actionRequired && onOpenComplaintModal) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'BOT',
              text: 'You can raise an official complaint ticket right now for rapid resolution.',
              isComplaintTrigger: true,
              timestamp: new Date(),
            },
          ]);
        }

        if (data.escalatePhone) {
          setShowEscalation(true);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'BOT',
          text: 'Our AI concierge service is temporarily busy. Please contact direct phone support below.',
          timestamp: new Date(),
        },
      ]);
      setShowEscalation(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white p-4 rounded-full shadow-2xl border border-gold-400/50 flex items-center gap-2 font-serif text-xs font-bold transition-all transform hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">Concierge Chat</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-gold-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 h-[520px]">
          
          {/* Header */}
          <div className="bg-obsidian text-white p-4 flex items-center justify-between border-b border-gold-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-gold-400">LuxeLoom Support Concierge</h4>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Automated Instant Assistance
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optional Order ID Context Bar */}
          <div className="bg-ivory px-4 py-2 border-b border-gold-200 flex items-center gap-2 text-xs">
            <span className="text-zinc-500 text-[11px] font-medium shrink-0">Order ID:</span>
            <input
              type="text"
              placeholder="e.g. ORD-100823"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white border border-gold-200 px-2 py-1 rounded text-xs focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Message Thread Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'BOT' && (
                  <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'USER'
                      ? 'bg-obsidian text-white rounded-br-none shadow-sm'
                      : 'bg-white text-zinc-800 border border-gold-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.isComplaintTrigger && onOpenComplaintModal && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenComplaintModal(orderId);
                      }}
                      className="mt-2 w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      Raise Complaint Ticket <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {msg.sender === 'USER' && (
                  <div className="w-7 h-7 rounded-full bg-obsidian text-gold-400 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <Bot className="w-4 h-4 animate-bounce text-gold-500" />
                <span>Concierge is typing reply...</span>
              </div>
            )}

            {/* Direct Phone Escalation Box */}
            {showEscalation && (
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl space-y-2 text-amber-900 animate-in fade-in">
                <p className="font-bold flex items-center gap-1.5 text-xs">
                  <PhoneCall className="w-4 h-4 text-amber-700" /> Need Senior Human Assistance?
                </p>
                <p className="text-[11px]">
                  You can speak directly with our senior jewellery concierge team:
                </p>
                <a
                  href="tel:+9118005893566"
                  className="block bg-amber-700 text-white text-center font-bold py-2 rounded-lg text-xs hover:bg-amber-800 transition-colors shadow-sm"
                >
                  Call Toll-Free: +91 1800-LUXELOOM
                </a>
              </div>
            )}
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-ivory border-t border-gold-200 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap bg-white border border-gold-300 hover:border-gold-500 text-[10px] font-medium text-zinc-700 px-2.5 py-1 rounded-full transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-gold-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask concierge a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 text-xs p-2.5 bg-ivory border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatWidget;
