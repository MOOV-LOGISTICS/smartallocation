import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PO, Lang } from '../../App';
import { IconSparkle } from '../icons/index';

interface AgentPromptProps {
  type: 'crdLaterThanFob' | 'tooEarly';
  po: PO;
  lang: Lang;
  onModifyAndRun: (newCrd: string) => void;
  onProceedAsIs: () => void;
  onCancel: () => void;
  onEmailSent?: (poId: number, action: string, recipient: string) => void;
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

function buildOwimEmailBody(po: PO): string {
  const lot = po.moovRef || po.lot;
  return `Dear OWIM Team,

We would like to request your instructions on the following LOT which is scheduled earlier than the confirmed FOB window.

LOT: ${lot} | Batch: ${po.batch}
FOB Week: ${weekLabel(po.fobWeek)} | CRD Week: ${weekLabel(po.crdWeek)}
Supplier: ${po.supplier} | Lane: ${po.pol} → ${po.pod}

The CRD is more than 4 weeks ahead of FOB and the LOT is not in the Early Shipment List.

Please confirm: Proceed with early shipment / Place on hold?

Best regards,
z.dorothy | MOOV Logistics`;
}

function buildVddlEmailBody(po: PO): string {
  const lot = po.moovRef || po.lot;
  return `Dear Team,

Please add the following LOT to VDDL for further handling.

LOT: ${lot} | Batch: ${po.batch}
CRD Week: ${weekLabel(po.crdWeek)} | FOB Week: ${weekLabel(po.fobWeek)}
Supplier: ${po.supplier} | Lane: ${po.pol} → ${po.pod}

CRD falls after FOB — cargo will not be ready before vessel departure.
Vessel scheduling is not possible until the dates are corrected.

Please advise on next steps.

Best regards,
z.dorothy | MOOV Logistics`;
}

// Compact inline email composer embedded in the agent bubble
function InlineEmailComposer({
  defaultTo, defaultSubject, defaultBody, onSend, onCancel,
}: {
  defaultTo: string;
  defaultSubject: string;
  defaultBody: string;
  onSend: (to: string) => void;
  onCancel: () => void;
}) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [sending, setSending] = useState(false);

  const canSend = to.trim().length > 0 && !sending;

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSend(to);
    }, 650);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-3 border-t border-[#DEE5EC] pt-3 space-y-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#004F7C" strokeWidth="2.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span className="text-[10px] font-semibold text-[#004F7C] uppercase tracking-wider">Draft Email</span>
          <span className="text-[10px] text-[#8A98AB] ml-1">via Outlook · z.dorothy@moovlogistics.com</span>
        </div>

        {/* To */}
        <div>
          <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">To</label>
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full px-2.5 py-1.5 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent bg-white"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent bg-white"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-[10px] font-semibold text-[#4A5A6E] uppercase tracking-wider mb-1">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={7}
            className="w-full px-2.5 py-1.5 border border-[#C5CFDB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent font-mono leading-relaxed resize-none bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] text-[#4A5A6E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-white flex items-center justify-center gap-1.5 transition-all"
            style={{ background: canSend ? '#004F7C' : '#C5CFDB', cursor: canSend ? 'pointer' : 'not-allowed' }}
          >
            {sending ? (
              <>
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Sending…
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send via Outlook
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function AgentPrompt({ type, po, lang, onModifyAndRun, onProceedAsIs, onCancel, onEmailSent }: AgentPromptProps) {
  const fobMonday = weekMonday(po.fobWeek);
  const today = new Date().toISOString().slice(0, 10);
  const [newCrd, setNewCrd] = useState(fobMonday);
  const [showVddlEmail, setShowVddlEmail] = useState(false);
  const [showOwimEmail, setShowOwimEmail] = useState(false);
  const bufferW = parseInt(po.fobWeek.split('/')[0]) - parseInt(po.crdWeek.split('/')[0]);
  const crdValid = !!newCrd && newCrd >= today && newCrd <= fobMonday;

  const lot = po.moovRef || po.lot;

  return (
    <motion.div
      className="mt-5 flex gap-3"
      initial={{ opacity: 0, y: 10 }}
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
          <span className="text-[#8A98AB] font-normal normal-case tracking-normal">Pre-Assign Engine paused — input required</span>
        </div>

        <div className="bg-white border border-[#DEE5EC] rounded-xl rounded-tl-sm p-4 shadow-sm">
          {type === 'crdLaterThanFob' ? (
            <>
              <p className="text-sm text-[#0F2A3F] leading-relaxed mb-3">
                I detected a scheduling conflict on{' '}
                <span className="font-mono font-semibold">{lot}</span>. The CRD{' '}
                <span className="font-mono font-semibold text-red-500">{formatDMY(po.crd)}</span>{' '}
                falls after the FOB window{' '}
                <span className="font-mono font-semibold">{weekLabel(po.fobWeek)} · {formatDMY(fobMonday)}</span>.
                {' '}Pre-assign cannot proceed — please advise.
              </p>

              {!showVddlEmail ? (
                <>
                  <div className="bg-[#F8FAFC] border border-[#DEE5EC] rounded-lg p-3 mb-3">
                    <label className="block text-xs font-medium text-[#4A5A6E] mb-1.5">
                      Update CRD to a date on or before {weekLabel(po.fobWeek)}:
                    </label>
                    <input
                      type="date"
                      value={newCrd}
                      min={today}
                      max={fobMonday}
                      onChange={e => setNewCrd(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#C5CFDB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004F7C] focus:border-transparent bg-white"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowVddlEmail(true)}
                      className="px-3 py-1.5 text-xs font-medium border border-[#FCD34D] text-[#92400E] bg-[#FFFBEB] rounded-lg hover:bg-[#FEF3C7] transition-colors flex items-center gap-1.5"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send to VDDL
                    </button>
                    <button
                      onClick={onProceedAsIs}
                      className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] text-[#4A5A6E] transition-colors"
                    >
                      Keep original (Exception)
                    </button>
                    <button
                      onClick={() => crdValid && onModifyAndRun(newCrd)}
                      disabled={!crdValid}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                      style={{ background: crdValid ? '#004F7C' : '#C5CFDB', cursor: crdValid ? 'pointer' : 'not-allowed' }}
                    >
                      Modify CRD & Continue
                    </button>
                  </div>
                </>
              ) : (
                <InlineEmailComposer
                  defaultTo=""
                  defaultSubject={`VDDL Entry Request – ${lot} Batch ${po.batch}`}
                  defaultBody={buildVddlEmailBody(po)}
                  onSend={(to) => {
                    setShowVddlEmail(false);
                    onEmailSent?.(po.id, 'vddl', to);
                    onProceedAsIs();
                  }}
                  onCancel={() => setShowVddlEmail(false)}
                />
              )}
            </>
          ) : (
            /* tooEarly — requestTooEarly ON_HOLD */
            <>
              <p className="text-sm text-[#0F2A3F] leading-relaxed mb-3">
                <span className="font-mono font-semibold">{lot}</span> is{' '}
                <span className="font-semibold text-blue-600">{bufferW} weeks ahead</span>{' '}
                of FOB (CRD: <span className="font-mono">{weekLabel(po.crdWeek)}</span>, FOB:{' '}
                <span className="font-mono">{weekLabel(po.fobWeek)}</span>). This LOT is{' '}
                <span className="font-semibold text-red-500">not in the Early Shipment List</span> —
                OWIM approval is required before we can proceed.
              </p>

              {!showOwimEmail ? (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowOwimEmail(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#004F7C] hover:bg-[#337296] transition-colors flex items-center gap-1.5"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send to OWIM for approval
                  </button>
                  <button
                    onClick={onProceedAsIs}
                    className="px-3 py-1.5 text-xs font-medium border border-[#C5CFDB] rounded-lg hover:bg-[#F8FAFC] text-[#4A5A6E] transition-colors"
                  >
                    Keep ON_HOLD
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-xs font-medium text-[#8A98AB] hover:text-[#4A5A6E] transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              ) : (
                <InlineEmailComposer
                  defaultTo="OWIM_Ware_Zulauf@lidl.com"
                  defaultSubject={`Early Shipment Approval Request – ${lot} Batch ${po.batch}`}
                  defaultBody={buildOwimEmailBody(po)}
                  onSend={(to) => {
                    setShowOwimEmail(false);
                    onEmailSent?.(po.id, 'owim', to);
                    onProceedAsIs();
                  }}
                  onCancel={() => setShowOwimEmail(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
