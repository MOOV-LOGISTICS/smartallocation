import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PO, Lang } from '../../App';
import { IconClose } from '../icons/index';

interface Props {
  type: 'crdLaterThanFob' | 'tooEarly';
  po: PO;
  lang: Lang;
  onModifyAndRun: (newCrd: string) => void;
  onProceedAsIs: () => void;
  onCancel: () => void;
}

function formatDMY(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

function weekMonday(weekStr: string): string {
  const [w, y] = weekStr.split('/').map(Number);
  const year = 2000 + y;
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dow = jan4.getUTCDay() || 7;
  const mon = new Date(jan4);
  mon.setUTCDate(jan4.getUTCDate() - dow + 1 + (w - 1) * 7);
  return mon.toISOString().slice(0, 10);
}

function weekLabel(weekStr: string): string {
  const [w, y] = weekStr.split('/');
  return `W${w} / 20${y}`;
}

export function PreAssignInterceptModal({
  type, po, lang, onModifyAndRun, onProceedAsIs, onCancel
}: Props) {
  const fobMonday = weekMonday(po.fobWeek);
  const [newCrd, setNewCrd] = useState(fobMonday);
  const bufferW = parseInt(po.fobWeek.split('/')[0]) - parseInt(po.crdWeek.split('/')[0]);
  const crdValid = !!newCrd && newCrd <= fobMonday;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-[rgba(0,79,124,0.18)] backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCancel}
      />

      <motion.div
        className="relative w-[520px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl flex flex-col z-10"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {type === 'crdLaterThanFob' ? (
          <>
            <div className="px-6 py-4 border-b border-[#DEE5EC] flex items-center gap-3">
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0F2A3F] text-sm">Pre-Assign Conflict</div>
                <div className="text-xs text-[#4A5A6E] mt-0.5">{po.moovRef || po.lot}</div>
              </div>
              <button onClick={onCancel} className="p-1 rounded hover:bg-[#F8FAFC] text-[#4A5A6E] shrink-0">
                <IconClose />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5A6E]">Current CRD</span>
                  <span className="font-mono font-semibold text-red-500">{formatDMY(po.crd)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5A6E]">FOB Window</span>
                  <span className="font-mono font-semibold text-[#0F2A3F]">
                    {weekLabel(po.fobWeek)} · {formatDMY(fobMonday)}
                  </span>
                </div>
                <p className="text-xs text-amber-700 border-t border-amber-200 pt-2 leading-relaxed">
                  CRD is after the FOB shipment window. Pre-assign cannot proceed unless CRD is brought forward.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F2A3F] mb-1.5">
                  New CRD date
                </label>
                <input
                  type="date"
                  value={newCrd}
                  max={fobMonday}
                  onChange={e => setNewCrd(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent"
                />
                <p className="text-xs text-[#9EAFC0] mt-1">
                  Must be on or before {weekLabel(po.fobWeek)} ({formatDMY(fobMonday)})
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#DEE5EC] flex gap-3 justify-end">
              <button
                onClick={onProceedAsIs}
                className="px-4 py-2 text-sm font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] text-[#4A5A6E] transition-colors"
              >
                Keep original (Exception)
              </button>
              <button
                onClick={() => crdValid && onModifyAndRun(newCrd)}
                disabled={!crdValid}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
                style={{
                  background: crdValid ? '#004F7C' : '#C5CFDB',
                  cursor: crdValid ? 'pointer' : 'not-allowed',
                }}
              >
                Modify CRD & Run
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-[#DEE5EC] flex items-center gap-3">
              <span style={{ fontSize: 20 }}>⏳</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0F2A3F] text-sm">Early Schedule Notice</div>
                <div className="text-xs text-[#4A5A6E] mt-0.5">{po.moovRef || po.lot}</div>
              </div>
              <button onClick={onCancel} className="p-1 rounded hover:bg-[#F8FAFC] text-[#4A5A6E] shrink-0">
                <IconClose />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5A6E]">CRD Week</span>
                  <span className="font-mono font-semibold text-[#0F2A3F]">{weekLabel(po.crdWeek)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5A6E]">FOB Week</span>
                  <span className="font-mono font-semibold text-[#0F2A3F]">{weekLabel(po.fobWeek)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5A6E]">Buffer</span>
                  <span className="font-mono font-semibold text-blue-600">{bufferW} weeks ahead of FOB</span>
                </div>
                <p className="text-xs text-blue-700 border-t border-blue-200 pt-2 leading-relaxed">
                  Scheduling more than 4 weeks before FOB. Vessel schedules this far ahead may not be confirmed —
                  this LOT will be placed <strong>ON_HOLD</strong>.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#DEE5EC] flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] text-[#4A5A6E] transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={onProceedAsIs}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
                style={{ background: '#004F7C', cursor: 'pointer' }}
              >
                Proceed (mark ON_HOLD)
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
