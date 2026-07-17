import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PO, Lang, etdToAllocWeek } from '../../App';
import { t } from '../../i18n';
import { BOOKING_MATRIX, VESSEL_SCHEDULES, INITIAL_ALLOCATION } from '../../data/referenceData';
import { IconClose, IconCheck, IconRefresh } from '../icons/index';

export interface RescheduleTarget {
  carrier: string;
  carrierCode: string;
  service: string;
  vessel: string;
  voyage: string;
  etd: string;
  eta: string;
  peta?: string;
}

interface RescheduleModalProps {
  open: boolean;
  lots: PO[];                       // current selection (may span lanes)
  lang: Lang;
  allocationUsage: Record<string, { preassign: number; booked: number }>;
  onClose: () => void;
  onConfirm: (lotIds: number[], target: RescheduleTarget) => void;
}

export function RescheduleModal({ open, lots, lang, allocationUsage, onClose, onConfirm }: RescheduleModalProps) {
  // Group the selection by lane — vessels/voyages are lane-specific,
  // so one reschedule run always applies to a single POL→POD lane.
  const lanes = useMemo(() => {
    const map = new Map<string, PO[]>();
    lots.forEach(p => {
      const key = `${p.pol}|${p.pod}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([key, ls]) => ({ key, pol: ls[0].pol, pod: ls[0].pod, lots: ls }));
  }, [lots]);

  const [laneKey, setLaneKey] = useState<string | null>(null);
  const [carrierPick, setCarrierPick] = useState<string>(''); // `${carrier}|${service}`
  const [voyagePick, setVoyagePick] = useState<string>('');   // `${vessel}|${voyage}`
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  // Reset on open / selection change
  useEffect(() => {
    if (!open) return;
    setLaneKey(lanes.length === 1 ? lanes[0].key : null);
    setCarrierPick('');
    setVoyagePick('');
    setCheckedIds(new Set());
  }, [open, lanes]);

  const activeLane = lanes.find(l => l.key === laneKey) || null;

  // ① Carrier options — carriers serving this lane per the Booking Matrix
  const carrierOptions = useMemo(() => {
    if (!activeLane) return [];
    const seen = new Set<string>();
    return BOOKING_MATRIX
      .filter(e => e.polCode === activeLane.pol && e.podCode === activeLane.pod)
      .filter(e => {
        const k = `${e.carrier}|${e.service}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .map(e => ({ carrier: e.carrier, carrierCode: e.carrierCode, service: e.service }));
  }, [activeLane]);

  const pickedCarrier = carrierOptions.find(c => `${c.carrier}|${c.service}` === carrierPick) || null;

  // ② Voyage options — schedules for this carrier on this lane
  const voyageOptions = useMemo(() => {
    if (!activeLane || !pickedCarrier) return [];
    return VESSEL_SCHEDULES
      .filter(v => v.carrierCode === pickedCarrier.carrierCode && v.polCode === activeLane.pol && v.podCode === activeLane.pod)
      .sort((a, b) => a.etd.localeCompare(b.etd));
  }, [activeLane, pickedCarrier]);

  const pickedVoyage = voyageOptions.find(v => `${v.vessel}|${v.voyage}` === voyagePick) || null;

  // Fits nothing at all → grey the option in the dropdown list
  const latestLdd = activeLane ? activeLane.lots.reduce((m, p) => p.ldd > m ? p.ldd : m, '') : '';

  // Auto-(un)check preview rows whenever the voyage changes
  useEffect(() => {
    if (!activeLane || !pickedVoyage) { setCheckedIds(new Set()); return; }
    const ok = activeLane.lots.filter(p => pickedVoyage.eta <= p.ldd).map(p => p.id);
    setCheckedIds(new Set(ok));
  }, [pickedVoyage, activeLane]);

  const toggleRow = (id: number) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ③ Allocation preview for the target carrier|lane|week bucket
  const allocationWarning = useMemo(() => {
    if (!activeLane || !pickedCarrier || !pickedVoyage) return null;
    const sample = activeLane.lots[0];
    if (!sample.polRegion || !sample.podRegion) return null;
    const week = etdToAllocWeek(pickedVoyage.etd);
    const key = `${pickedCarrier.carrierCode}|${sample.polRegion}|${sample.podRegion}|${week}`;
    const initial = INITIAL_ALLOCATION[key] || 0;
    if (initial === 0) return null;
    const usage = allocationUsage[key] || { preassign: 0, booked: 0 };
    const used = usage.preassign + usage.booked;
    const adding = activeLane.lots.filter(p => checkedIds.has(p.id)).reduce((s, p) => s + p.teu, 0);
    const afterPct = Math.round(((used + adding) / initial) * 100);
    return {
      week,
      initial,
      used,
      adding,
      remaining: initial - used,
      overcommit: used + adding > initial,
      afterPct,
    };
  }, [activeLane, pickedCarrier, pickedVoyage, checkedIds, allocationUsage]);

  const canConfirm = !!pickedVoyage && checkedIds.size > 0;

  const handleConfirm = () => {
    if (!pickedCarrier || !pickedVoyage || checkedIds.size === 0) return;
    onConfirm(Array.from(checkedIds), {
      carrier: pickedVoyage.carrier,
      carrierCode: pickedVoyage.carrierCode,
      service: pickedVoyage.service,
      vessel: pickedVoyage.vessel,
      voyage: pickedVoyage.voyage,
      etd: pickedVoyage.etd,
      eta: pickedVoyage.eta,
      peta: pickedVoyage.peta,
    });
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
              className="w-[620px] max-w-full max-h-[86vh] bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#DEE5EC] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F2A3F] flex items-center gap-2">
                  <IconRefresh />
                  {activeLane
                    ? t(lang, 'reschedule.title', { n: activeLane.lots.length, lane: `${activeLane.pol} → ${activeLane.pod}` })
                    : t(lang, 'reschedule.titleGeneric')}
                </h2>
                <button onClick={onClose} className="p-1 hover:bg-[#F8FAFC] rounded text-[#4A5A6E] transition-colors">
                  <IconClose />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">

                {/* Lane picker — shown when the selection spans multiple lanes */}
                {!activeLane && (
                  <div>
                    <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-3 mb-4 text-xs text-[#9A3412]">
                      {t(lang, 'reschedule.multiLaneHint', { n: lanes.length })}
                    </div>
                    <div className="space-y-2">
                      {lanes.map(l => (
                        <button
                          key={l.key}
                          onClick={() => setLaneKey(l.key)}
                          className="w-full flex items-center justify-between px-4 py-3 border border-[#C5CFDB] rounded-lg hover:border-[#004F7C] hover:bg-[#F8FAFC] transition-colors text-sm"
                        >
                          <span className="font-mono font-semibold text-[#0F2A3F]">{l.pol} → {l.pod}</span>
                          <span className="text-xs text-[#4A5A6E]">{t(lang, 'reschedule.laneCount', { n: l.lots.length })}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeLane && (
                  <>
                    {/* ① Carrier */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F2A3F] mb-2">
                        1. {t(lang, 'reschedule.carrierLabel')}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#004F7C]"
                        value={carrierPick}
                        onChange={e => { setCarrierPick(e.target.value); setVoyagePick(''); }}
                      >
                        <option value="">{t(lang, 'reschedule.carrierPlaceholder')}</option>
                        {carrierOptions.map(c => (
                          <option key={`${c.carrier}|${c.service}`} value={`${c.carrier}|${c.service}`}>
                            {c.carrier} · {c.service}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] mt-1 text-[#8A98AB]">{t(lang, 'reschedule.carrierHint')}</p>
                    </div>

                    {/* ② Vessel / Voyage */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F2A3F] mb-2">
                        2. {t(lang, 'reschedule.voyageLabel')}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-[#C5CFDB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#004F7C] disabled:bg-[#F8FAFC] disabled:text-[#9EAFC0]"
                        value={voyagePick}
                        onChange={e => setVoyagePick(e.target.value)}
                        disabled={!pickedCarrier}
                      >
                        <option value="">
                          {pickedCarrier
                            ? (voyageOptions.length > 0 ? t(lang, 'reschedule.voyagePlaceholder') : t(lang, 'reschedule.noVoyages'))
                            : t(lang, 'reschedule.pickCarrierFirst')}
                        </option>
                        {voyageOptions.map(v => {
                          const useless = v.eta > latestLdd; // fails every selected LOT
                          return (
                            <option key={`${v.vessel}|${v.voyage}`} value={`${v.vessel}|${v.voyage}`} disabled={useless}>
                              {v.vessel} · {v.voyage} — ETD {v.etd} · ETA {v.eta} · {v.availableTeu} TEU{useless ? ` (${t(lang, 'reschedule.etaTooLate')})` : ''}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-[11px] mt-1 text-[#8A98AB]">{t(lang, 'reschedule.voyageHint')}</p>
                    </div>

                    {/* ③ Per-LOT preview */}
                    {pickedVoyage && (
                      <div>
                        <label className="block text-sm font-medium text-[#0F2A3F] mb-2">
                          3. {t(lang, 'reschedule.previewLabel')}
                        </label>
                        <div className="border border-[#DEE5EC] rounded-lg divide-y divide-[#EEF2F6] max-h-[220px] overflow-y-auto">
                          {activeLane.lots.map(p => {
                            const etaOk = pickedVoyage.eta <= p.ldd;
                            const checked = checkedIds.has(p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-[#F8FAFC]">
                                <input type="checkbox" checked={checked} onChange={() => toggleRow(p.id)} />
                                <span className="font-mono font-semibold text-[#0F2A3F] w-[120px] flex-shrink-0">{p.lot}</span>
                                <span className="text-[#8A98AB] flex-1 truncate">
                                  {p.carrier || '—'} {p.vessel ? `· ${p.vessel}` : ''}
                                  <span className="mx-1 text-[#C5CFDB]">→</span>
                                  {pickedVoyage.carrier} · {pickedVoyage.vessel}
                                </span>
                                <span className="font-mono text-[#4A5A6E] flex-shrink-0">{p.teu} TEU</span>
                                {etaOk ? (
                                  <span className="text-[#065F46] flex-shrink-0">✓ ETA OK</span>
                                ) : (
                                  <span className="text-[#B91C1C] flex-shrink-0" title={`ETA ${pickedVoyage.eta} > LDD ${p.ldd}`}>⚠ ETA &gt; LDD</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Allocation preview */}
                    {allocationWarning && (
                      <div
                        className="rounded-lg p-3 text-xs border"
                        style={allocationWarning.overcommit
                          ? { background: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' }
                          : { background: '#F0FDF4', borderColor: '#BBF7D0', color: '#166534' }}
                      >
                        {allocationWarning.overcommit
                          ? t(lang, 'reschedule.allocOvercommit', {
                              carrier: pickedVoyage!.carrier, week: allocationWarning.week,
                              remaining: allocationWarning.remaining, adding: allocationWarning.adding, pct: allocationWarning.afterPct,
                            })
                          : t(lang, 'reschedule.allocOk', {
                              carrier: pickedVoyage!.carrier, week: allocationWarning.week,
                              remaining: allocationWarning.remaining, adding: allocationWarning.adding,
                            })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#DEE5EC] flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] transition-colors text-[#4A5A6E]"
                >
                  {t(lang, 'btn.close')}
                </button>
                {activeLane && (
                  <button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                    style={{
                      background: canConfirm ? '#004F7C' : '#C5CFDB',
                      color: canConfirm ? '#fff' : '#9EAFC0',
                      cursor: canConfirm ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <IconCheck /> {t(lang, 'reschedule.confirmBtn', { n: checkedIds.size })}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
