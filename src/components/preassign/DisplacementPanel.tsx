import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PO, Lang } from '../../App';

interface DisplacementPanelProps {
  po: PO;
  candidatePOs: PO[];
  onConfirm: (displacedPo: PO) => void;
  onCancel: () => void;
  lang: Lang;
}

export function DisplacementPanel({ po, candidatePOs, onConfirm, onCancel }: DisplacementPanelProps) {
  const [selected, setSelected] = useState<PO | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (confirming && selected) {
    return (
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-[#FEF1E7] border border-[#FED8C0] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8650A" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span className="text-xs font-semibold text-[#0F1E2E]">Confirm Displacement</span>
          </div>
          <p className="text-xs text-[#4A5A6E] mb-1 leading-relaxed">
            The slot of{' '}
            <span className="font-mono font-semibold text-[#0F1E2E]">{selected.moovRef || selected.lot}</span>
            {' '}({selected.carrier} · ETD {selected.etd}) will be transferred to{' '}
            <span className="font-mono font-semibold text-[#0F1E2E]">{po.moovRef || po.lot}</span>.
          </p>
          <p className="text-xs text-[#E8650A] font-medium mb-3">
            ⚠ {selected.moovRef || selected.lot} will be reset to NOT_STARTED and must be re-assigned.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => onConfirm(selected)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-[#E8650A] hover:bg-[#CF5508] transition-colors"
            >
              Confirm Displacement
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-[10px] font-semibold text-[#E8650A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
        <span>Slot Displacement</span>
        <span className="text-[#C5CFDB]">·</span>
        <span className="text-[#8A98AB] font-normal normal-case tracking-normal">Free up allocation on {po.pol}→{po.pod}</span>
      </div>

      <div className="bg-white border border-[#FED8C0] rounded-xl p-4 shadow-sm">
        <p className="text-xs text-[#4A5A6E] mb-3 leading-relaxed">
          No available allocation found for{' '}
          <span className="font-mono font-semibold">{po.moovRef || po.lot}</span>.
          Select a pre-assigned LOT on the same lane (less urgent) to displace — its slot will be transferred here.
        </p>

        {candidatePOs.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-[#8A98AB] italic">No displaceable LOTs found on {po.pol}→{po.pod}.</p>
            <p className="text-[10px] text-[#C5CFDB] mt-1">All pre-assigned LOTs have an earlier or equal CRD.</p>
          </div>
        ) : (
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {candidatePOs.map(candidate => (
              <label
                key={candidate.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selected?.id === candidate.id
                    ? 'border-[#004F7C] bg-[#EEF4F8]'
                    : 'border-[#DEE5EC] hover:border-[#8AABB8] hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="radio"
                  name="displacement-candidate"
                  checked={selected?.id === candidate.id}
                  onChange={() => setSelected(candidate)}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-semibold text-[#0F1E2E]">{candidate.moovRef || candidate.lot}</span>
                    <span className="text-[10px] bg-[#F0F4F8] text-[#4A5A6E] px-1.5 py-0.5 rounded font-medium">CRD {candidate.crdWeek}</span>
                  </div>
                  <div className="text-[10px] text-[#8A98AB] font-mono">
                    {candidate.carrier} · {candidate.vessel} · ETD {candidate.etd} · ETA {candidate.eta}
                  </div>
                </div>
                {selected?.id === candidate.id && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#004F7C" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && setConfirming(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
            style={{ background: selected ? '#E8650A' : '#C5CFDB', cursor: selected ? 'pointer' : 'not-allowed' }}
          >
            Displace Selected LOT
          </button>
        </div>
      </div>
    </motion.div>
  );
}
