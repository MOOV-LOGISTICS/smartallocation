import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PO, Lang } from '../../App';
import { t } from '../../i18n';
import { buildTraceLog } from '../../utils/traceBuilder';
import { StatusPill } from '../common/StatusPill';
import { BookingTraceStep } from './BookingTraceStep';
import { BOOKING_MATRIX, VESSEL_SCHEDULES } from '../../data/referenceData';
import { IconClose, IconRefresh, IconSparkle, IconAlert, IconEdit } from '../icons/index';

interface BookingDrawerProps {
  po: PO | null;
  open: boolean;
  onClose: () => void;
  runningStep: number | null;
  isLiveRun: boolean;
  onRerun: () => void;
  lang: Lang;
  onGoToException?: () => void;
  onOverride?: (data: { carrier: string; service: string; vessel: string; voyage: string; etd: string; eta: string }) => void;
  allPos?: PO[];
  onDisplace?: (current: PO, displaced: PO) => void;
}

export function BookingDrawer({ po, open, onClose, runningStep, isLiveRun, onRerun, lang, onGoToException, onOverride, allPos, onDisplace }: BookingDrawerProps) {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'run'>('run');
  const trace = useMemo(() => po ? buildTraceLog(po, lang) : [], [po, lang]);
  const isLive = isLiveRun && runningStep !== null;

  const isBooked = po?.status === 'BOOKED_EXACT' || po?.status === 'BOOKED_UPDATED' || po?.status === 'ASSIGNED' || po?.status === 'MANUALLY_OVERRIDDEN';
  const progressPct = isLive
    ? Math.min(100, (runningStep - 1) / 5 * 100)
    : po
      ? (isBooked ? 100 : po.status === 'ON_HOLD' ? (2 / 5 * 100) : ((Math.min(po.exceptionAtStep || 1, 4) - 1) / 5 * 100))
      : 0;

  if (!po) return null;

  const snap = po.preassignSnapshot;
  const hasSnapshot = !!snap;

  const tabs = [
    ...(hasSnapshot ? [{ key: 'snapshot' as const, label: 'Pre-assign Snapshot' }] : []),
    { key: 'run' as const, label: 'Current Booking Run' },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,79,124,0.18)] backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 right-0 bottom-0 w-[620px] max-w-full bg-[#F8FAFC] z-[51] flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.1)]"
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DEE5EC] bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider text-[#8A98AB] font-semibold">Carrier Booking Trace</span>
            <button onClick={onClose} className="p-1 hover:bg-[#F8FAFC] rounded text-[#4A5A6E] transition-colors">
              <IconClose />
            </button>
          </div>
          <div className="text-[10px] text-[#8A98AB] font-mono mb-0.5">{po.moovRef || po.poNo}</div>
          <div className="text-lg font-semibold tracking-tight font-mono text-[#004F7C]">{po.lot}</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#4A5A6E]">
            <StatusPill status={isLive ? 'RUNNING' : po.status} lang={lang} isBooking />
            <span className="truncate flex-1">{po.article}</span>
            {po.srd && (
              <span className="flex-shrink-0 text-[10px] font-mono bg-[#F0F4F8] px-2 py-0.5 rounded text-[#4A5A6E]">
                SRD {po.srd}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-dashed border-[#DEE5EC]">
            <MetaItem label="Lane" value={`${po.pol} → ${po.pod}`} />
            <MetaItem label="Planned TEU" value={`${po.teu} × ${po.ctr}`} />
            <MetaItem label="CRD / FOB" value={`${po.crdWeek} / ${po.fobWeek}`} />
            <MetaItem label="LDD" value={po.ldd} />
          </div>
        </div>

        {/* Tab switcher */}
        {tabs.length > 1 && (
          <div className="flex border-b border-[#DEE5EC] bg-white flex-shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-[#004F7C] text-[#004F7C]'
                    : 'border-transparent text-[#8A98AB] hover:text-[#4A5A6E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'snapshot' && snap && (
            <SnapshotTab snap={snap} po={po} />
          )}

          {activeTab === 'run' && (
            <>
              {/* Comparison bar — only when there was a pre-assign */}
              {hasSnapshot && snap && isBooked && !isLive && (
                <ComparisonBar po={po} snap={snap} />
              )}

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold tracking-tight text-[#0F1E2E]">5-Step Booking Run</h3>
                <span className="text-xs text-[#4A5A6E] font-mono font-medium">
                  {isLive
                    ? `Step ${runningStep}/5 · ${Math.round(progressPct)}%`
                    : isBooked ? '5/5 · 100%' : ''}
                </span>
              </div>

              <div className="h-1 bg-[#E6EBF0] rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#004F7C] to-[#337296] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>

              {trace.map(entry => (
                <React.Fragment key={entry.step}>
                  <BookingTraceStep entry={entry} currentStep={isLive ? runningStep : null} lang={lang} />
                  {!isLive && po.status === 'EXCEPTION' && po.exceptionAtStep === entry.step && allPos && onDisplace && (
                    <SlotDisplacementAgent po={po} allPos={allPos} onDisplace={onDisplace} lang={lang} />
                  )}
                </React.Fragment>
              ))}

              {!isLive && po.status === 'BOOKED_EXACT' && <ResultCardBooked po={po} exact lang={lang} onOverride={onOverride} />}
              {!isLive && po.status === 'BOOKED_UPDATED' && <ResultCardBooked po={po} exact={false} lang={lang} onOverride={onOverride} />}
              {!isLive && po.status === 'ASSIGNED' && <ResultCardBooked po={po} exact={false} lang={lang} onOverride={onOverride} />}
              {!isLive && po.status === 'MANUALLY_OVERRIDDEN' && <ResultCardBookingOverridden po={po} />}
              {!isLive && po.status === 'ON_HOLD' && <ResultCardOnHold po={po} lang={lang} />}
              {!isLive && po.status === 'EXCEPTION' && <ResultCardException po={po} lang={lang} />}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DEE5EC] bg-white flex-shrink-0 flex gap-2 justify-end">
          {po.status === 'EXCEPTION' && onGoToException && (
            <button
              onClick={onGoToException}
              className="px-3 py-1.5 text-xs font-medium bg-[#004F7C] text-white rounded hover:bg-[#337296] transition-colors"
            >
              Resolve
            </button>
          )}
          {po.status === 'NOT_STARTED' && (
            <button
              onClick={onRerun}
              className="px-3 py-1.5 text-xs font-medium bg-[#004F7C] text-white rounded hover:bg-[#337296] transition-colors flex items-center gap-1"
            >
              Run Booking
            </button>
          )}
          {po.status === 'MANUALLY_OVERRIDDEN' && (
            <button onClick={onRerun}
              className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded hover:bg-[#F8FAFC] transition-colors flex items-center gap-1">
              <IconRefresh /> Re-run AI Booking
            </button>
          )}
          {(po.status === 'BOOKED_EXACT' || po.status === 'BOOKED_UPDATED' || po.status === 'ASSIGNED') && (
            <button
              onClick={onRerun}
              className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded hover:bg-[#F8FAFC] transition-colors flex items-center gap-1"
            >
              <IconRefresh /> Re-run
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded hover:bg-[#F8FAFC] transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs">
      <div className="text-[#8A98AB] uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-[#0F1E2E] mt-0.5 font-mono text-xs font-medium">{value}</div>
    </div>
  );
}

function SnapshotTab({ snap, po }: { snap: NonNullable<PO['preassignSnapshot']>; po: PO }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#8A98AB]" />
        <span className="text-xs text-[#8A98AB] font-mono">Pre-assign executed {snap.executedAt}</span>
      </div>
      <div className="bg-white border border-[#DEE5EC] rounded-xl p-5 mb-4">
        <h4 className="text-xs font-semibold text-[#8A98AB] uppercase tracking-wider mb-3">Pre-assigned Result</h4>
        <div className="grid grid-cols-2 gap-4">
          <SnapItem label="Carrier" value={snap.carrier} />
          <SnapItem label="Service" value={snap.service} />
          <div className="col-span-2">
            <SnapItem label="Vessel / Voyage" value={`${snap.vessel} · ${snap.voyage}`} />
          </div>
          <SnapItem label="ETD" value={snap.etd} />
          <SnapItem label="ETA" value={snap.eta} />
        </div>
      </div>
      <div className="bg-[#F8FAFC] border border-dashed border-[#DEE5EC] rounded-lg px-4 py-3 text-xs text-[#8A98AB] leading-relaxed">
        This is a frozen snapshot of the pre-assign result at the time it was committed. The Current Booking Run tab shows whether this result was re-validated after SRD was received.
      </div>
    </div>
  );
}

function SnapItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#8A98AB] uppercase tracking-wider font-semibold mb-0.5">{label}</div>
      <div className="text-sm font-mono text-[#0F1E2E] font-medium">{value}</div>
    </div>
  );
}

function ComparisonBar({ po, snap }: { po: PO; snap: NonNullable<PO['preassignSnapshot']> }) {
  const isExact = po.status === 'BOOKED_EXACT';

  const fields = [
    { label: 'Carrier', before: snap.carrier, after: po.carrier || '—' },
    { label: 'Vessel', before: snap.vessel, after: po.vessel || '—' },
    { label: 'Voyage', before: snap.voyage, after: po.voyage || '—' },
    { label: 'ETD', before: snap.etd, after: po.etd || '—' },
  ];

  return (
    <div className={`rounded-xl border px-4 py-3 mb-5 text-xs ${
      isExact
        ? 'bg-[#f0fdf4] border-[#bbf7d0]'
        : 'bg-[#eff6ff] border-[#bfdbfe]'
    }`}>
      <div className="flex items-center gap-1.5 mb-3">
        {isExact
          ? <span className="text-[#047857] font-semibold">✓ Pre-assign Exact Match — vessel and dates confirmed unchanged</span>
          : <span className="text-[#1D4ED8] font-semibold">↻ Pre-assign Updated — original vessel sailed, re-allocated to new voyage</span>
        }
      </div>
      <div className="grid grid-cols-4 gap-3">
        {fields.map(f => {
          const changed = f.before !== f.after;
          return (
            <div key={f.label}>
              <div className="text-[10px] text-[#8A98AB] uppercase tracking-wider font-semibold mb-1">{f.label}</div>
              {isExact || !changed ? (
                <div className="font-mono text-[#047857] font-medium">{f.after} <span className="text-[10px]">✓</span></div>
              ) : (
                <div>
                  <div className="font-mono text-[#8A98AB] line-through text-[10px]">{f.before}</div>
                  <div className="font-mono text-[#1D4ED8] font-medium">{f.after} <span className="text-[10px]">↻</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultCardBooked({ po, exact, lang, onOverride }: {
  po: PO; exact: boolean; lang: Lang;
  onOverride?: (data: { carrier: string; service: string; vessel: string; voyage: string; etd: string; eta: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [service, setService] = useState('');
  const [vessel, setVessel] = useState('');
  const [voyage, setVoyage] = useState('');
  const [etd, setEtd] = useState('');
  const [eta, setEta] = useState('');

  useEffect(() => { setEditing(false); }, [po.id]);

  // Carriers serving this lane (Booking Matrix), and their scheduled voyages (Vessel Schedules)
  const laneEntries = useMemo(
    () => BOOKING_MATRIX.filter(e => e.polCode === po.pol && e.podCode === po.pod),
    [po.pol, po.pod]
  );
  const carriers = useMemo(() => Array.from(new Set(laneEntries.map(e => e.carrier))), [laneEntries]);
  const carrierCode = laneEntries.find(e => e.carrier === carrier)?.carrierCode;
  const schedules = useMemo(
    () => VESSEL_SCHEDULES.filter(v => v.carrierCode === carrierCode && v.polCode === po.pol && v.podCode === po.pod),
    [carrierCode, po.pol, po.pod]
  );
  const vessels = useMemo(() => Array.from(new Set(schedules.map(s => s.vessel))), [schedules]);
  const voyages = schedules.filter(s => s.vessel === vessel);

  const startEdit = () => {
    setCarrier(po.carrier || '');
    setService(po.service || '');
    setVessel(po.vessel || '');
    setVoyage(po.voyage || '');
    setEtd(po.etd || '');
    setEta(po.eta || '');
    setEditing(true);
  };

  const handleCarrierChange = (c: string) => {
    setCarrier(c);
    setService(laneEntries.find(e => e.carrier === c)?.service || '');
    setVessel('');
    setVoyage('');
    setEtd('');
    setEta('');
  };

  const handleVesselChange = (v: string) => {
    setVessel(v);
    setVoyage('');
    setEtd('');
    setEta('');
  };

  const handleVoyageChange = (vy: string) => {
    setVoyage(vy);
    const s = schedules.find(s => s.vessel === vessel && s.voyage === vy);
    if (s) { setEtd(s.etd); setEta(s.eta); }
  };

  const isValid = !!(carrier && service && vessel && voyage && etd && eta);

  const handleConfirm = () => {
    if (!isValid || !onOverride) return;
    onOverride({ carrier, service, vessel, voyage, etd, eta });
    setEditing(false);
  };

  const selectCls = 'w-full px-2.5 py-1.5 border border-[#C5CFDB] rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent disabled:bg-[#F8FAFC] disabled:text-[#9EAFC0]';

  return (
    <motion.div
      className={`border rounded-lg p-4 mt-5 ${editing ? 'bg-[#F5F3FF] border-[#E9D5FF]' : exact ? 'bg-[#f0fdf4] border-[#bbf7d0]' : 'bg-[#eff6ff] border-[#bfdbfe]'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <IconSparkle />
        <h4 className={`text-sm font-bold ${editing ? 'text-[#6D28D9]' : 'text-[#0F1E2E]'}`}>
          {editing ? 'Manual Override' : exact ? 'Booked · Exact Match' : 'Booked · Updated Voyage'}
        </h4>
        {!editing && onOverride && (
          <button
            onClick={startEdit}
            className="ml-auto px-2.5 py-1 text-[11px] font-medium border border-[#E9D5FF] text-[#6D28D9] rounded-lg hover:bg-[#F5F3FF] transition-colors flex items-center gap-1"
          >
            <IconEdit /> Override
          </button>
        )}
        {editing && (
          <span className="ml-auto text-[10px] text-[#8A98AB]">logged as z.dorothy</span>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-2.5">
          <ResultItem label="Carrier" value={po.carrier || ''} />
          <ResultItem label="Service" value={po.service || ''} />
          <ResultItem label="Vessel" value={po.vessel || ''} />
          <ResultItem label="Voyage" value={po.voyage || ''} />
          <ResultItem label="ETD" value={po.etd || ''} />
          <ResultItem label="ETA" value={po.eta || ''} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Carrier</label>
              <select value={carrier} onChange={e => handleCarrierChange(e.target.value)} className={selectCls}>
                {!carriers.includes(carrier) && carrier && <option value={carrier}>{carrier}</option>}
                {carriers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Service</label>
              <input type="text" value={service} readOnly className={selectCls} style={{ background: '#F8FAFC', color: '#4A5A6E' }} title="Service follows the carrier (Booking Matrix)" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Vessel</label>
              <select value={vessel} onChange={e => handleVesselChange(e.target.value)} className={selectCls} disabled={vessels.length === 0}>
                <option value="">{vessels.length > 0 ? 'Select vessel…' : 'No scheduled vessels for this carrier'}</option>
                {!vessels.includes(vessel) && vessel && <option value={vessel}>{vessel}</option>}
                {vessels.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Voyage</label>
              <select value={voyage} onChange={e => handleVoyageChange(e.target.value)} className={selectCls} disabled={!vessel}>
                <option value="">{vessel ? 'Select voyage…' : 'Select vessel first'}</option>
                {vessel && !voyages.some(s => s.voyage === voyage) && voyage && <option value={voyage}>{voyage}</option>}
                {voyages.map(s => (
                  <option key={s.voyage} value={s.voyage}>
                    {s.voyage} — ETD {s.etd} · ETA {s.eta} · {s.availableTeu} TEU
                  </option>
                ))}
              </select>
            </div>
            <ResultItem label="ETD" value={etd || '—'} />
            <ResultItem label="ETA" value={eta || '—'} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-white text-[#4A5A6E] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValid}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
              style={{ background: isValid ? '#7C3AED' : '#C5CFDB', cursor: isValid ? 'pointer' : 'not-allowed' }}
            >
              Confirm Override
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

function ResultCardOnHold({ po, lang }: { po: PO; lang: Lang }) {
  return (
    <motion.div
      className="bg-[#FEF1E7] border border-[#FED8C0] rounded-lg p-4 mt-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <IconAlert />
        <h4 className="text-sm font-bold text-[#FE5000]">{t(lang, 'result.onHoldTitle')}</h4>
      </div>
      <div className="text-xs text-[#0F1E2E] leading-relaxed">
        {t(lang, 'onHoldReasons.' + (po.onHoldKey || 'crdLater'))}
      </div>
    </motion.div>
  );
}

function ResultCardException({ po, lang }: { po: PO; lang: Lang }) {
  return (
    <motion.div
      className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4 mt-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <IconAlert />
        <h4 className="text-sm font-bold text-[#dc2626]">{t(lang, 'result.exceptionTitle')}</h4>
      </div>
      <div className="text-xs text-[#0F1E2E] leading-relaxed">
        <strong>{t(lang, 'result.failedAtStep', { n: po.exceptionAtStep || 1 })}</strong>
        {t(lang, 'exceptionReasons.' + (po.exceptionKey || 'noSpace'))}
      </div>
    </motion.div>
  );
}

function ResultCardBookingOverridden({ po }: { po: PO }) {
  const ts = po.overriddenAt
    ? new Date(po.overriddenAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <motion.div
      className="bg-[#F5F3FF] border border-[#E9D5FF] rounded-lg p-4 mt-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <IconEdit />
        <h4 className="text-sm font-bold text-[#6D28D9]">Manually Booked</h4>
        {po.overriddenBy && (
          <span className="ml-auto text-[10px] text-[#8A98AB] font-mono">{po.overriddenBy} · {ts}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <ResultItem label="Carrier" value={po.carrier || ''} />
        <ResultItem label="Service" value={po.service || ''} />
        <div className="col-span-2">
          <ResultItem label="Vessel / Voyage" value={`${po.vessel} · ${po.voyage}`} />
        </div>
        <ResultItem label="ETD" value={po.etd || ''} />
        <ResultItem label="ETA" value={po.eta || ''} />
      </div>
    </motion.div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#8A98AB] uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-sm font-mono mt-0.5 text-[#0F1E2E] font-medium">{value}</div>
    </div>
  );
}

// ── Slot Displacement Agent ───────────────────────────────────────────────────

function crdBufferDays(crd: string, ldd: string) {
  return Math.floor((new Date(ldd).getTime() - new Date(crd).getTime()) / 86400000);
}

function SlotDisplacementAgent({
  po, allPos, onDisplace,
}: {
  po: PO; allPos: PO[]; onDisplace: (current: PO, displaced: PO) => void; lang: Lang;
}) {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [confirming, setConfirming] = React.useState(false);

  // Only pre-assigned LOTs are displaceable — carrier-booked LOTs are never offered
  // (cancelling a confirmed booking is out of scope for slot displacement).
  const isEligible = (p: PO) =>
    p.id !== po.id &&
    p.pol === po.pol &&
    p.pod === po.pod &&
    p.status === 'ASSIGNED' &&
    !!p.ldd && !!p.crd &&
    crdBufferDays(p.crd, p.ldd) >= 20;

  // Longest buffer first — the safest LOT to displace tops the list
  const candidates = useMemo(
    () => allPos.filter(isEligible).sort((a, b) => crdBufferDays(b.crd, b.ldd) - crdBufferDays(a.crd, a.ldd)),
    [allPos, po]
  );
  const preassignList = candidates.slice(0, 4);

  if (preassignList.length === 0) return null;

  const selectedPo = candidates.find(p => p.id === selectedId);

  const handleConfirm = () => {
    if (!selectedPo) return;
    onDisplace(po, selectedPo);
    setConfirming(false);
  };

  return (
    <motion.div
      className="mt-5 flex gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#004F7C] flex items-center justify-center text-white mt-0.5">
        <IconSparkle />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-[#004F7C] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <span>AI Agent</span>
          <span className="text-[#C5CFDB]">·</span>
          <span className="text-[#8A98AB] font-normal normal-case tracking-normal">Slot Displacement</span>
        </div>
        <div className="bg-white border border-[#DEE5EC] rounded-xl rounded-tl-sm p-4 shadow-sm">
          {confirming && selectedPo ? (
            <div>
              <p className="text-sm font-semibold text-[#0F1E2E] mb-1">Confirm Override</p>
              <p className="text-xs text-[#4A5A6E] mb-4 leading-relaxed">
                <span className="font-mono font-semibold">{selectedPo.moovRef}</span> ({selectedPo.lot}) is <span className="text-[#D97706] font-semibold">pre-assigned only</span> — displacing will release its vessel slot with no carrier impact.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors bg-[#004F7C] hover:bg-[#337296]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#0F1E2E] leading-relaxed mb-3">
                Allocation week <span className="font-mono font-semibold">{po.crdWeek}</span> is fully booked on{' '}
                <span className="font-mono font-semibold">{po.pol} → {po.pod}</span>.
                Found <span className="font-semibold">{candidates.length} LOT{candidates.length !== 1 ? 's' : ''}</span> with CRD buffer ≥ 20 days that can be override:
              </p>

              {preassignList.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] flex-shrink-0" />
                    <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider">Pre-assigned · Not yet carrier-booked</span>
                  </div>
                  <div className="space-y-1.5">
                    {preassignList.map(p => (
                      <DisplacementCard key={p.id} p={p} selected={selectedId === p.id} onSelect={() => setSelectedId(selectedId === p.id ? null : p.id)} tier="preassign" />
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!selectedId}
                onClick={() => setConfirming(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#004F7C] hover:bg-[#337296] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Override
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DisplacementCard({ p, selected, onSelect, tier }: {
  p: PO; selected: boolean; onSelect: () => void; tier: 'preassign' | 'booked';
}) {
  const buffer = p.ldd && p.crd ? crdBufferDays(p.crd, p.ldd) : 0;
  const hasK = p.kpFlag === 'K' || p.kpFlag === 'KP';
  const hasP = p.kpFlag === 'P' || p.kpFlag === 'KP';
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-xs select-none ${
        selected
          ? 'border-[#004F7C] bg-[#EFF6FF] shadow-sm'
          : tier === 'preassign'
            ? 'border-[#FDE68A] bg-[#FFFBEB] hover:border-[#F59E0B]'
            : 'border-[#FECACA] bg-[#FFF5F5] hover:border-[#EF4444]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="font-semibold font-mono text-[#0F1E2E]">{p.moovRef}</span>
          <span className="text-[#8A98AB] ml-1.5 text-[11px]">{p.lot}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {hasK && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3]" title="Kaufland LOT">K</span>
          )}
          {hasP && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D]" title="PEPCO LOT">P</span>
          )}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            tier === 'preassign' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#FEE2E2] text-[#991B1B]'
          }`}>
            {tier === 'preassign' ? '🟡 Pre-assigned' : '🔴 Carrier Booked'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[11px] text-[#4A5A6E] mb-1">
        <div><span className="text-[#8A98AB]">CRD: </span><span className="font-mono">{p.crdWeek}</span></div>
        <div><span className="text-[#8A98AB]">FOB: </span><span className="font-mono">{p.fobWeek}</span></div>
        <div>
          <span className="text-[#8A98AB]">Buffer: </span>
          <span className={`font-semibold ${buffer >= 50 ? 'text-[#047857]' : 'text-[#D97706]'}`}>{buffer}d</span>
        </div>
        <div><span className="text-[#8A98AB]">ETD: </span><span className="font-mono">{p.etd || '—'}</span></div>
        <div><span className="text-[#8A98AB]">ETA: </span><span className="font-mono">{p.eta || '—'}</span></div>
        <div><span className="text-[#8A98AB]">LDD: </span><span className="font-mono">{p.ldd || '—'}</span></div>
      </div>
      {(p.vessel || p.carrier) && (
        <div className="text-[11px] text-[#4A5A6E]">
          <span className="text-[#8A98AB]">Vessel: </span>
          <span className="font-mono">{p.vessel} / {p.voyage}</span>
        </div>
      )}
    </div>
  );
}
