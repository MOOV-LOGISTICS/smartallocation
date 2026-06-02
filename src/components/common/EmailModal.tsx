import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadOnlyRow {
  label: string;
  value: string;
}

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (details: { to: string; cc: string; subject: string; body: string }) => void;
  title: string;
  defaultTo?: string;
  defaultCc?: string;
  defaultSubject?: string;
  defaultBody?: string;
  readOnlyRows?: ReadOnlyRow[];
}

export function EmailModal({
  open, onClose, onSend, title,
  defaultTo = '', defaultCc = '', defaultSubject = '', defaultBody = '',
  readOnlyRows = [],
}: EmailModalProps) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState(defaultCc);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setTo(defaultTo);
      setCc(defaultCc);
      setSubject(defaultSubject);
      setBody(defaultBody);
      setSending(false);
    }
  }, [open, defaultTo, defaultCc, defaultSubject, defaultBody]);

  const handleSend = () => {
    if (!to.trim() || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSend({ to, cc, subject, body });
    }, 650);
  };

  const canSend = to.trim().length > 0 && !sending;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '88vh' }}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DEE5EC] flex items-center gap-2.5 flex-shrink-0 bg-white">
              <div className="w-7 h-7 rounded-lg bg-[#004F7C] flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#0F1E2E]">{title}</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] text-[#8A98AB] bg-[#F0F4F8] px-2 py-0.5 rounded font-mono">via Outlook</span>
                <button onClick={onClose} className="p-1 hover:bg-[#F8FAFC] rounded text-[#8A98AB] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {/* To */}
              <div>
                <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">To</label>
                <input
                  type="text"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="recipient@example.com, another@example.com"
                  className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent"
                />
              </div>
              {/* CC */}
              <div>
                <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">CC</label>
                <input
                  type="text"
                  value={cc}
                  onChange={e => setCc(e.target.value)}
                  placeholder="cc@example.com (optional)"
                  className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent"
                />
              </div>
              {/* Subject */}
              <div>
                <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent"
                />
              </div>

              {/* Read-only LOT data */}
              {readOnlyRows.length > 0 && (
                <div>
                  <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1.5">
                    LOT Details <span className="text-[#8A98AB] font-normal normal-case tracking-normal">(auto-filled · read-only)</span>
                  </label>
                  <div className="border border-[#DEE5EC] rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {readOnlyRows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                            <td className="px-3 py-1.5 font-semibold text-[#4A5A6E] w-28 border-r border-[#DEE5EC] uppercase tracking-wide text-[10px]">
                              {row.label}
                            </td>
                            <td className="px-3 py-1.5 font-mono text-[#0F1E2E]">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Editable body */}
              <div>
                <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Message</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={9}
                  className="w-full px-3 py-2.5 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent font-mono leading-relaxed resize-y"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-[#DEE5EC] flex items-center justify-between flex-shrink-0 bg-[#FAFBFC]">
              <span className="text-[10px] text-[#8A98AB]">Sent from z.dorothy@moovlogistics.com</span>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition-all"
                  style={{ background: canSend ? '#004F7C' : '#C5CFDB', cursor: canSend ? 'pointer' : 'not-allowed' }}
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
