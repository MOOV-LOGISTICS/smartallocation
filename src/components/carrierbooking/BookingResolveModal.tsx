import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PO, Lang } from '../../App';
import { t } from '../../i18n';
import { IconClose, IconCheck } from '../icons/index';

interface BookingResolveModalProps {
  po: PO | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  lang: Lang;
}

export function BookingResolveModal({ po, open, onClose, onSubmit, lang }: BookingResolveModalProps) {
  const [comment, setComment] = useState('');

  if (!po) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-[rgba(0,79,124,0.18)] backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[61] pointer-events-none">
            <motion.div
              className="w-[500px] max-w-full bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-6 py-4 border-b border-[#DEE5EC] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F2A3F]">{t(lang, 'resolve.title')}</h2>
                <button onClick={onClose} className="p-1 hover:bg-[#F8FAFC] rounded text-[#4A5A6E] transition-colors">
                  <IconClose />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#DEE5EC]">
                  <div className="text-sm font-medium text-[#0F2A3F] mb-1">PO: {po.poNo}</div>
                  <div className="text-xs text-[#4A5A6E]">Lot: {po.lot} · Blocked at Step {po.exceptionAtStep || '-'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F2A3F] mb-2">
                    {t(lang, 'resolve.commentLabel')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-[#C5CFDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent resize-none"
                    placeholder={t(lang, 'resolve.commentPlaceholder')}
                  />
                  {comment.trim() === '' && (
                    <p className="text-xs mt-1" style={{ color: '#9EAFC0' }}>{t(lang, 'resolve.commentRequired')}</p>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#DEE5EC] flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] transition-colors text-[#4A5A6E]"
                >
                  {t(lang, 'btn.close')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={comment.trim() === ''}
                  className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  style={{
                    background: comment.trim() ? '#004F7C' : '#C5CFDB',
                    color: comment.trim() ? '#fff' : '#9EAFC0',
                    cursor: comment.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <IconCheck /> {t(lang, 'resolve.submitBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
