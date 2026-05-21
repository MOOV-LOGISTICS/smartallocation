import { PO, Lang } from '../App';
import { t } from '../i18n';
import { EARLY_SHIPMENT_LOTS } from '../data/referenceData';

export interface TraceEntry {
  step: number;
  title: string;
  duration: number;
  result: 'PASS' | 'FAIL' | 'SKIPPED' | 'ON_HOLD';
  reason: string;
  rule: string;
  input: Record<string, string>;
  output: Record<string, string>;
}

export function buildTraceLog(po: PO, lang: Lang): TraceEntry[] {
  const exAt = po.exceptionAtStep || 999;
  const isOnHold = po.status === 'ON_HOLD';
  const isAssigned = po.status === 'ASSIGNED' || po.status === 'BOOKED_EXACT' || po.status === 'BOOKED_UPDATED';
  const r = (key: string, params?: Record<string, string | number>) => t(lang, 'step.reasons.' + key, params);
  const title = (n: number) => t(lang, 'step.titles.' + n);
  const rule = (n: number) => t(lang, 'step.rules.' + n);

  const effectiveExAt = exAt;

  // Step order: 1=Filter PO, 2=Match Carrier, 3=Match Available Carrier, 4=Match Vessel, 5=Auto Assign
  const s1FilterResult: TraceEntry['result'] = isOnHold ? 'ON_HOLD' : (effectiveExAt > 1 ? 'PASS' : 'FAIL');
  const s1Pass = !isOnHold && effectiveExAt > 1;
  const s2Pass = s1Pass && effectiveExAt > 2;
  const s3Pass = s2Pass && effectiveExAt > 3;
  const s4Pass = s3Pass && effectiveExAt > 4;
  const s5Pass = isAssigned;

  const carriersForLane = po.pol === 'EGDAM'
    ? '[]'
    : po.pol === 'CNSHA' && po.pod === 'ESBCN'
      ? 'CMA CGM (FAL3), Maersk (AEX)'
      : po.pol === 'CNSWA'
        ? 'Tailwind (PAX), Hapag-Lloyd (NE2)'
        : po.pol === 'BDCGP'
          ? 'Tailwind (SILK), Hapag-Lloyd (NE2)'
          : po.pol === 'CNXMN'
            ? 'Hapag-Lloyd (NE2), CMA CGM (FAL3)'
            : po.pod === 'SIKOP'
              ? 'Tailwind (PAX/DEX) P1, Hapag-Lloyd (NE2) P1'
              : po.pod === 'BEANR'
                ? 'CMA CGM (FAL3) P1, Hapag-Lloyd (NE2) P1, MSC (SILKWAY) P2'
                : 'Hapag-Lloyd (NE2) P1, CMA CGM (FAL3) P1, Tailwind (AEX) P2';

  // Allocation week = ISO week of estimated ETD (CRD + 12~20 days)
  const etdEarlyDate = po.crd ? addDays(po.crd, 12) : '';
  const etdLateDate  = po.crd ? addDays(po.crd, 20) : '';
  const allocationWeekEarly = etdEarlyDate ? dateToISOWeek(etdEarlyDate) : po.crdWeek;
  const allocationWeekLate  = etdLateDate  ? dateToISOWeek(etdLateDate)  : po.crdWeek;
  const allocationWeekDisplay = allocationWeekEarly === allocationWeekLate
    ? allocationWeekEarly
    : `${allocationWeekEarly} ~ ${allocationWeekLate}`;
  const regionKey = `${po.polRegion ?? 'FAR EAST'} → ${po.podRegion ?? 'NEU'}`;

  const carriersWithQuota = po.exceptionAtStep === 3
    ? 'HAPL: 20 TEU (required: 26), CMA: 15 TEU (required: 26), TSHG: 10 TEU (required: 26)'
    : po.pod === 'SIKOP' && po.pol === 'BDCGP'
      ? 'TSHG: 25 TEU ✓, HAPL: 20 TEU ✓'
      : po.pod === 'SIKOP'
        ? 'TSHG: 20 TEU ✓, HAPL: 28 TEU ✓'
        : 'HAPL: 68 TEU ✓, CMA: 42 TEU ✓, TSHG: 35 TEU ✓';

  const bufferWeeks = (() => {
    const crdW = parseInt(po.crdWeek.split('/')[0]);
    const fobW = parseInt(po.fobWeek.split('/')[0]);
    return fobW - crdW;
  })();

  const etdWindowStart = po.crd ? addDays(po.crd, 12) : '—';
  const etdWindowEnd   = po.crd ? addDays(po.crd, 20) : '—';
  const lane = `${po.pol} → ${po.pod}`;

  // Determine voyage result text for step 4
  const isTie = po.exceptionKey === 'voyageTie';
  const isNoVoyage = po.exceptionKey === 'noVoyage';
  const voyagesFound = isNoVoyage
    ? 'none — no vessel scheduled on CNSHA→ESBCN in window'
    : isTie
      ? 'PANDA 002 / PD2620W (ETD 2026-05-28 ETA 2026-07-02), MAERSK ESSEX / ME619W (ETD 2026-05-28 ETA 2026-07-02)'
      : isAssigned
        ? `${po.vessel} / ${po.voyage} + 2 alternatives`
        : '3 voyages in window';

  const fndResult = po.del || 'NLMOE';

  return [
    // ── Step 1: Filter Available PO ────────────────────────────────────────
    {
      step: 1,
      title: title(1),
      duration: 56,
      result: s1FilterResult,
      reason: (() => {
        if (po.exceptionKey === 'crdLaterThanFob') return r('s3ExceptionCrdLater', { crdWeek: po.crdWeek, fobWeek: po.fobWeek });
        if (isOnHold) return po.onHoldKey === 'requestTooEarly'
          ? r('s3OnHoldTooEarly', { buffer: bufferWeeks, crdWeek: po.crdWeek, fobWeek: po.fobWeek })
          : r('s3OnHold', { buffer: bufferWeeks, crdWeek: po.crdWeek, fobWeek: po.fobWeek });
        if (bufferWeeks > 4) return r('s3PassEarlyShipment', { buffer: bufferWeeks });
        return r('s3Pass', { buffer: bufferWeeks });
      })(),
      rule: rule(1),
      input: {
        'CRD Week': po.crdWeek,
        'FOB Week': po.fobWeek,
        'Buffer': bufferWeeks >= 0 ? `${bufferWeeks} weeks` : `${bufferWeeks} weeks (CRD after FOB)`,
        'Allowed Range': '0 – 4 weeks  |  > 4 weeks → Early Shipment List check',
        ...(bufferWeeks > 4 ? {
          'Early Shipment Check': EARLY_SHIPMENT_LOTS.has(po.lot.trim())
            ? '✓ LOT found in Early Shipment List'
            : '✗ LOT not found in Early Shipment List'
        } : {})
      },
      output: (() => {
        if (po.exceptionKey === 'crdLaterThanFob')
          return { 'Status': 'EXCEPTION', 'Error': `CRD week (${po.crdWeek}) is after FOB week (${po.fobWeek})` };
        if (isOnHold && po.onHoldKey === 'requestTooEarly')
          return { 'Status': 'ON_HOLD', 'Reason': `Buffer ${bufferWeeks} wk exceeds 4 wk maximum`, 'Early Shipment Check': 'LOT not found in list', 'Action': 'Request early shipment approval' };
        if (isOnHold)
          return { 'Status': 'ON_HOLD', 'Buffer': `${bufferWeeks} wk`, 'Action': 'Push CRD or request early shipment approval' };
        if (bufferWeeks > 4)
          return { 'Status': 'ELIGIBLE', 'Buffer': `${bufferWeeks} weeks (>4)`, 'Early Shipment Check': 'LOT approved in Early Shipment List' };
        return { 'Status': 'ELIGIBLE', 'Buffer': `${bufferWeeks} weeks (within 0–4 range)` };
      })()
    },

    // ── Step 2: Match Carrier (Initial) ────────────────────────────────────
    {
      step: 2,
      title: title(2),
      duration: 38,
      result: !s1Pass ? 'SKIPPED' : (s2Pass ? 'PASS' : 'FAIL'),
      reason: !s1Pass
        ? r('skipped')
        : s2Pass
          ? r('s1Pass', { lane, count: carriersForLane.split(',').length.toString() })
          : r('s1Fail', { pol: po.pol }),
      rule: rule(2),
      input: {
        'POL': po.pol,
        'POD': po.pod,
        'Planned TEU': String(po.teu),
      },
      output: s2Pass
        ? { 'Matched Carriers': carriersForLane, 'Pool Size': String(carriersForLane.split(',').length) }
        : s1Pass
          ? { 'Matched Carriers': '[]', 'Error': `No carrier registered for ${po.pol} → ${po.pod}` }
          : { '—': '—' }
    },

    // ── Step 3: Match Available Carrier ────────────────────────────────────
    {
      step: 3,
      title: title(3),
      duration: 124,
      result: !s2Pass ? 'SKIPPED' : (s3Pass ? 'PASS' : 'FAIL'),
      reason: !s2Pass
        ? r('skipped')
        : s3Pass
          ? r('s2Pass', { week: allocationWeekDisplay, region: regionKey })
          : r('s2Fail', { teu: po.teu, week: allocationWeekDisplay }),
      rule: rule(3),
      input: {
        'Candidate Carriers': s2Pass ? carriersForLane : '—',
        'CRD': po.crd || '—',
        'Est. ETD Window (CRD+12~20d)': `${etdEarlyDate} → ${etdLateDate}`,
        'Allocation Week': allocationWeekDisplay,
        'Required TEU': String(po.teu),
        'Lane': lane,
      },
      output: s2Pass
        ? { 'Carriers with Quota': s3Pass ? carriersWithQuota : 'None — all below ' + po.teu + ' TEU' }
        : { '—': '—' }
    },

    // ── Step 4: Match Vessel Voyage (find + rank + select) ─────────────────
    {
      step: 4,
      title: title(4),
      duration: 216,
      result: !s3Pass ? 'SKIPPED' : (s4Pass ? 'PASS' : 'FAIL'),
      reason: !s3Pass
        ? r('skipped')
        : s4Pass
          ? r('s4Pass')
          : isTie
            ? r('s4FailTie')
            : r('s4FailNoVoyage', { lane, start: etdWindowStart, end: etdWindowEnd }),
      rule: rule(4),
      input: {
        'Carrier Candidates': s3Pass ? carriersWithQuota : '—',
        'CRD': po.crd || '—',
        'ETD': s4Pass ? (po.etd || '—') : `${etdWindowStart} → ${etdWindowEnd}`,
        'ETA': s4Pass ? (po.eta || '—') : '—',
        'PETA': s4Pass ? (po.peta || '—') : '—',
        'LDD (ETA & PETA must ≤)': po.ldd,
        'Sort Rules': 'Priority asc → ETA asc → ETD desc'
      },
      output: s4Pass
        ? { 'Best Vessel': po.vessel || '', 'Best Voyage': po.voyage || '', 'ETD / ETA': `${po.etd} / ${po.eta}`, 'FND': fndResult }
        : isTie
          ? { 'Rank 1': 'PANDA 002/PD2620W — ETD 2026-05-28 ETA 2026-07-02', 'Rank 2': 'MAERSK ESSEX/ME619W — ETD 2026-05-28 ETA 2026-07-02', 'Result': 'TIE — cannot select unique best' }
          : isNoVoyage
            ? { 'Voyages Found': 'none', 'Error': `No vessel on ${lane} within ETD window` }
            : { '—': '—' }
    },

    // ── Step 5: Auto Pre-Assign ─────────────────────────────────────────────
    {
      step: 5,
      title: title(5),
      duration: 18,
      result: !s4Pass ? 'SKIPPED' : (s5Pass ? 'PASS' : 'SKIPPED'),
      reason: !s4Pass ? r('skipped') : s5Pass ? r('s5Pass') : r('skipped'),
      rule: rule(5),
      input: s5Pass
        ? { 'PO Ref': po.moovRef || String(po.id), 'Carrier': po.carrier || '', 'Vessel / Voyage': `${po.vessel} / ${po.voyage}`, 'FND': po.del || '—' }
        : { '—': '—' },
      output: s5Pass
        ? { 'Pre-Assign ID': `PA-${String(po.id).padStart(8, '0')}`, 'Status': 'ASSIGNED', 'Completed At': new Date().toISOString().slice(0, 19) + 'Z' }
        : { 'Status': isOnHold ? 'ON_HOLD' : 'EXCEPTION' }
    }
  ];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function dateToISOWeek(dateStr: string): string {
  const d = new Date(Date.UTC(
    parseInt(dateStr.slice(0, 4)),
    parseInt(dateStr.slice(5, 7)) - 1,
    parseInt(dateStr.slice(8, 10))
  ));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${String(week).padStart(2, '0')}/${String(d.getUTCFullYear()).slice(-2)}`;
}
