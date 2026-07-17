import React, { useState, useMemo, useEffect } from 'react';
import { TopNav } from './components/common/TopNav';
import { PageHeader } from './components/common/PageHeader';
import { StatsGrid } from './components/common/StatsGrid';
import { BookingStatsGrid } from './components/common/BookingStatsGrid';
import { Toolbar } from './components/common/Toolbar';
import { ViewTabs } from './components/common/ViewTabs';
import { POTable } from './components/preassign/POTable';
import { Drawer } from './components/preassign/Drawer';
import { BookingTable } from './components/carrierbooking/BookingTable';
import { BookingDrawer } from './components/carrierbooking/BookingDrawer';
import { BookingExceptionDashboard } from './components/carrierbooking/BookingExceptionDashboard';
import { BookingResolveModal } from './components/carrierbooking/BookingResolveModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AllocationManagement } from './components/allocation/AllocationManagement';
import { ExceptionDashboard } from './components/exception/ExceptionDashboard';
import { ResolveModal } from './components/exception/ResolveModal';
import { BatchResolveModal } from './components/exception/BatchResolveModal';
import { RescheduleModal, RescheduleTarget } from './components/preassign/RescheduleModal';
import { MOCK_POS, BOOKING_MOCK_POS, DEMO_ALLOCATION_USAGE } from './data/mockData';
import { INITIAL_ALLOCATION, EARLY_SHIPMENT_LOTS, BOOKING_MATRIX, VESSEL_SCHEDULES, FND_RULES } from './data/referenceData';
import { I18N, t } from './i18n';

const CARRIER_TO_CODE: Record<string, string> = {
  'Hapag-Lloyd': 'HLCU',
  'CMA CGM': 'CMDU',
  'Tailwind': 'TSHG',
  'MSC': 'MSCU',
  'Maersk': 'MAEU',
  'COSCO': 'COSU',
};

export function etdToAllocWeek(etd: string): string {
  const d = new Date(Date.UTC(
    parseInt(etd.slice(0, 4)),
    parseInt(etd.slice(5, 7)) - 1,
    parseInt(etd.slice(8, 10))
  ));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${String(week).padStart(2, '0')}/${String(d.getUTCFullYear()).slice(-2)}`;
}

function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const CARRIER_TO_FND_CODE_APP: Record<string, string> = {
  'Hapag-Lloyd': 'HAPL',
  'CMA CGM':     'CMA',
  'Tailwind':    'TSHG',
  'MSC':         'MSC',
  'COSCO':       'COSCO',
  'Maersk':      'MAEU',
};

function computeAssignment(po: PO): PO {
  // Step 1: date buffer check
  const fobW = parseInt(po.fobWeek.split('/')[0]);
  const crdW = parseInt(po.crdWeek.split('/')[0]);
  const bufferWeeks = fobW - crdW;
  if (bufferWeeks < 0)
    return { ...po, status: 'EXCEPTION', exceptionAtStep: 1, exceptionKey: 'crdLaterThanFob' };
  if (bufferWeeks > 4 && !EARLY_SHIPMENT_LOTS.has(po.lot.trim()))
    return { ...po, status: 'ON_HOLD', onHoldKey: 'requestTooEarly' };

  // Step 2: booking matrix lookup
  const laneEntries = BOOKING_MATRIX.filter(e => e.polCode === po.pol && e.podCode === po.pod);
  if (laneEntries.length === 0)
    return { ...po, status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier' };

  // Step 3: pre-assign allows overcommit — all carriers pass through

  // Step 4: vessel schedule lookup
  const etdEarly = addDaysStr(po.crd, 12);
  const etdLate  = addDaysStr(po.crd, 20);
  // Carrier rank from BOOKING_MATRIX order: P1=0, P2=1, P3=2...
  const carrierRank = new Map(laneEntries.map((e, i) => [e.carrierCode, i]));

  const candidates = VESSEL_SCHEDULES.filter(v =>
    v.polCode === po.pol &&
    v.podCode === po.pod &&
    carrierRank.has(v.carrierCode) &&
    v.etd >= etdEarly && v.etd <= etdLate &&
    v.eta <= po.ldd &&
    v.peta <= po.ldd
  ).sort((a, b) => {
    const ra = carrierRank.get(a.carrierCode)!;
    const rb = carrierRank.get(b.carrierCode)!;
    if (ra !== rb) return ra - rb;
    return a.eta.localeCompare(b.eta) || b.etd.localeCompare(a.etd);
  });

  if (candidates.length === 0)
    return { ...po, status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'noVoyage' };
  if (candidates.length >= 2 &&
      candidates[0].etd === candidates[1].etd &&
      candidates[0].eta === candidates[1].eta)
    return { ...po, status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'voyageTie' };

  // Step 5: assign best vessel + FND lookup
  const best = candidates[0];
  const fndCode = CARRIER_TO_FND_CODE_APP[best.carrier];
  const fndRule = fndCode && po.dwh
    ? FND_RULES.find(r => r.carrier === fndCode && r.dwh === po.dwh.toUpperCase() && r.pod === po.pod)
    : null;

  return {
    ...po,
    status: 'ASSIGNED',
    carrier: best.carrier,
    service: best.service,
    vessel: best.vessel,
    voyage: best.voyage,
    etd: best.etd,
    eta: best.eta,
    peta: best.peta,
    del: fndRule?.fnd ?? po.del,
    priority: best.priority,
  };
}

import './styles/index.css';

export type Lang = 'en' | 'zh' | 'de';
export type POStatus = 'ASSIGNED' | 'NOT_STARTED' | 'ON_HOLD' | 'EXCEPTION' | 'RESOLVED_PENDING_RERUN' | 'RUNNING' | 'BOOKED_EXACT' | 'BOOKED_UPDATED' | 'MANUALLY_OVERRIDDEN';

export interface ResolutionNote {
  comment: string;
  resolvedAt: string;
}

export interface AttributeFilters {
  carriers: string[];
  pols: string[];
  pods: string[];
  vessels: string[];
  suppliers: string[];
  teuMin?: number;
  teuMax?: number;
}

export interface SavedView {
  id: string;
  name: string;
  filter: string;
  subFilter: string;
  attributeFilters: AttributeFilters;
  createdAt: string;
}

export const EMPTY_ATTRIBUTE_FILTERS: AttributeFilters = { carriers: [], pols: [], pods: [], vessels: [], suppliers: [] };

export function isAttributeFiltersEmpty(f: AttributeFilters): boolean {
  return f.carriers.length === 0 && f.pols.length === 0 && f.pods.length === 0 &&
    f.vessels.length === 0 && f.suppliers.length === 0 &&
    f.teuMin === undefined && f.teuMax === undefined;
}

export function matchAttributeFilters(po: PO, f: AttributeFilters): boolean {
  if (f.carriers.length && !(po.carrier && f.carriers.includes(po.carrier))) return false;
  if (f.pols.length && !f.pols.includes(po.pol)) return false;
  if (f.pods.length && !f.pods.includes(po.pod)) return false;
  if (f.vessels.length && !(po.vessel && f.vessels.includes(po.vessel))) return false;
  if (f.suppliers.length && !(po.supplier && f.suppliers.includes(po.supplier))) return false;
  if (f.teuMin !== undefined && po.teu < f.teuMin) return false;
  if (f.teuMax !== undefined && po.teu > f.teuMax) return false;
  return true;
}

const SAVED_VIEWS_STORAGE_KEY = 'smartAllocation.savedViews.preassign';
const BOOKING_SAVED_VIEWS_STORAGE_KEY = 'smartAllocation.savedViews.booking';

export interface PreassignSnapshot {
  executedAt: string;
  carrier: string;
  service: string;
  vessel: string;
  voyage: string;
  etd: string;
  eta: string;
}

export interface PO {
  id: number;
  moovRef?: string;
  bookingRef?: string;
  poNo?: string;
  lot: string;
  ian: string;
  article: string;
  batch: string;
  teu: number;
  ctr: string;
  ctrType?: string;
  pol: string;
  pod: string;
  por?: string;
  fnd?: string;
  del: string;
  dwh: string;
  crd: string;
  crdWeek: string;
  fobWeek: string;
  ldd: string;
  srd?: string;
  status: POStatus;
  carrier?: string;
  service?: string;
  vessel?: string;
  voyage?: string;
  etd?: string;
  eta?: string;
  peta?: string;
  priority?: number;
  supplier: string;
  onHoldKey?: string;
  exceptionAtStep?: number;
  exceptionKey?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  polRegion?: string;
  podRegion?: string;
  preassignSnapshot?: PreassignSnapshot;
  pendingAction?: string;
  sentToSmartMoov?: boolean;
  resolutionNotes?: ResolutionNote[];
}

export interface Toast {
  id: number;
  msg: string;
  kind?: string;
}

// Exception reason categories for the Needs Action sub-filter.
// Categories other than SUPPLIER/RESOLVED only match still-open EXCEPTION rows —
// once a LOT is marked resolved it moves to the RESOLVED bucket instead.
export function matchExcCategory(po: PO, cat: string): boolean {
  switch (cat) {
    case 'SCHEDULE':  return po.status === 'EXCEPTION' && po.exceptionKey === 'crdLaterThanFob';
    case 'NO_VESSEL': return po.status === 'EXCEPTION' && ['noCarrier', 'noVoyage', 'voyageTie', 'batchNoVoyage'].includes(po.exceptionKey || '');
    case 'NO_SPACE':  return po.status === 'EXCEPTION' && ['noSpace', 'noAllocation'].includes(po.exceptionKey || '');
    case 'SUPPLIER':  return po.status === 'ON_HOLD';
    case 'RESOLVED':  return po.status === 'RESOLVED_PENDING_RERUN';
    default: return true;
  }
}

const NEEDS_ACTION_STATUSES = ['EXCEPTION', 'ON_HOLD', 'RESOLVED_PENDING_RERUN'];

// Does the PO fall inside the current status tab (+ reason sub-filter)?
// doneStatuses differs between pre-assign and carrier booking.
function matchStatusScope(p: PO, filter: string, subFilter: string, doneStatuses: string[]): boolean {
  if (filter === 'NEEDS_ACTION') {
    if (!NEEDS_ACTION_STATUSES.includes(p.status)) return false;
    if (subFilter !== 'ALL' && !matchExcCategory(p, subFilter)) return false;
    return true;
  }
  if (filter === 'DONE' || filter === 'BOOKED') return doneStatuses.includes(p.status);
  if (filter !== 'ALL') return p.status === filter;
  return true;
}

// Per-option match counts for each facet, scoped to the current status tab and the
// OTHER facets' selections (own facet excluded so multi-select stays additive).
function buildFacetOptionCounts(
  list: PO[],
  filter: string,
  subFilter: string,
  doneStatuses: string[],
  attrs: AttributeFilters
) {
  const statusScoped = list.filter(p => matchStatusScope(p, filter, subFilter, doneStatuses));
  const countFor = (excludeKey: keyof AttributeFilters, getVal: (p: PO) => string | undefined) => {
    const rest = { ...attrs, [excludeKey]: [] } as AttributeFilters;
    const m: Record<string, number> = {};
    statusScoped.filter(p => matchAttributeFilters(p, rest)).forEach(p => {
      const v = getVal(p);
      if (v) m[v] = (m[v] || 0) + 1;
    });
    return m;
  };
  return {
    carriers: countFor('carriers', p => p.carrier),
    pols: countFor('pols', p => p.pol),
    pods: countFor('pods', p => p.pod),
    vessels: countFor('vessels', p => p.vessel),
    suppliers: countFor('suppliers', p => p.supplier),
  };
}

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<'preassign' | 'allocation' | 'booking'>('preassign');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'exception'>('all');

  // Pre-Assign State
  const [pos, setPos] = useState<PO[]>(MOCK_POS);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>('ALL');
  const [subFilter, setSubFilter] = useState<string>('ALL');
  const [attributeFilters, setAttributeFilters] = useState<AttributeFilters>(EMPTY_ATTRIBUTE_FILTERS);
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_VIEWS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  // Which saved-view tab is active; null = All LOTs (pristine) or an unsaved custom state
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerPo, setDrawerPo] = useState<PO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [runningStep, setRunningStep] = useState<number | null>(null);
  const [isLiveRun, setIsLiveRun] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [resolvePo, setResolvePo] = useState<PO | null>(null);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [interceptModal, setInterceptModal] = useState<{
    type: 'crdLaterThanFob' | 'tooEarly';
    po: PO;
    computedResult: PO;
  } | null>(null);

  // Carrier Booking State
  const [bookingPos, setBookingPos] = useState<PO[]>(BOOKING_MOCK_POS);
  const [bookingSelectedIds, setBookingSelectedIds] = useState<Set<number>>(new Set());
  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [bookingSubFilter, setBookingSubFilter] = useState<string>('ALL');
  const [bookingAttributeFilters, setBookingAttributeFilters] = useState<AttributeFilters>(EMPTY_ATTRIBUTE_FILTERS);
  const [bookingSavedViews, setBookingSavedViews] = useState<SavedView[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKING_SAVED_VIEWS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [bookingActiveViewId, setBookingActiveViewId] = useState<string | null>(null);
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingDrawerPo, setBookingDrawerPo] = useState<PO | null>(null);
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [bookingRunningStep, setBookingRunningStep] = useState<number | null>(null);
  const [bookingIsLiveRun, setBookingIsLiveRun] = useState(false);
  const [bookingBatchRunning, setBookingBatchRunning] = useState(false);
  const [bookingResolvePo, setBookingResolvePo] = useState<PO | null>(null);
  const [bookingResolveOpen, setBookingResolveOpen] = useState(false);

  // Allocation Management State
  interface VersionRecord {
    id: string;
    version: number;
    uploader: string;
    timestamp: string;
    data: any[];
  }
  const [bookingMatrixVersions, setBookingMatrixVersions] = useState<VersionRecord[]>([]);
  const [fndRulesVersions, setFndRulesVersions] = useState<VersionRecord[]>([]);
  const [earlyShipmentVersions, setEarlyShipmentVersions] = useState<VersionRecord[]>([]);

  // Pre-Assign Logic
  const counts = useMemo(() => ({
    total: pos.length,
    not_started: pos.filter(p => p.status === 'NOT_STARTED').length,
    assigned: pos.filter(p => p.status === 'ASSIGNED').length,
    overridden: pos.filter(p => p.status === 'MANUALLY_OVERRIDDEN').length,
    on_hold: pos.filter(p => p.status === 'ON_HOLD').length,
    exception: pos.filter(p => p.status === 'EXCEPTION').length,
    needs_action: pos.filter(p => NEEDS_ACTION_STATUSES.includes(p.status)).length,
    done: pos.filter(p => p.status === 'ASSIGNED' || p.status === 'MANUALLY_OVERRIDDEN').length
  }), [pos]);

  // Reason-chip counts respect the active attribute filters so chips and table stay in sync
  const subCounts = useMemo(() => {
    const na = pos.filter(p =>
      NEEDS_ACTION_STATUSES.includes(p.status) &&
      (isAttributeFiltersEmpty(attributeFilters) || matchAttributeFilters(p, attributeFilters))
    );
    return {
      ALL: na.length,
      SCHEDULE: na.filter(p => matchExcCategory(p, 'SCHEDULE')).length,
      NO_VESSEL: na.filter(p => matchExcCategory(p, 'NO_VESSEL')).length,
      NO_SPACE: na.filter(p => matchExcCategory(p, 'NO_SPACE')).length,
      SUPPLIER: na.filter(p => matchExcCategory(p, 'SUPPLIER')).length,
      RESOLVED: na.filter(p => matchExcCategory(p, 'RESOLVED')).length,
    };
  }, [pos, attributeFilters]);

  const facetOptionCounts = useMemo(
    () => buildFacetOptionCounts(pos, filter, subFilter, ['ASSIGNED', 'MANUALLY_OVERRIDDEN'], attributeFilters),
    [pos, filter, subFilter, attributeFilters]
  );

  const changeFilter = (f: string, sub: string = 'ALL') => {
    setFilter(f);
    setSubFilter(sub);
    setSelectedIds(new Set()); // selection semantics differ per tab (run vs send)
    setActiveViewId(null);     // manual change leaves the saved-view state
  };

  const changeSubFilter = (s: string) => {
    setSubFilter(s);
    setActiveViewId(null);
  };

  const updateAttributeFilters = (f: AttributeFilters) => {
    setAttributeFilters(f);
    setActiveViewId(null);
  };

  // Distinct values across all LOTs, used to populate the attribute filter panel
  const fieldOptions = useMemo(() => ({
    carriers: Array.from(new Set(pos.map(p => p.carrier).filter(Boolean))).sort() as string[],
    pols: Array.from(new Set(pos.map(p => p.pol).filter(Boolean))).sort() as string[],
    pods: Array.from(new Set(pos.map(p => p.pod).filter(Boolean))).sort() as string[],
    vessels: Array.from(new Set(pos.map(p => p.vessel).filter(Boolean))).sort() as string[],
    suppliers: Array.from(new Set(pos.map(p => p.supplier).filter(Boolean))).sort() as string[],
  }), [pos]);

  useEffect(() => {
    try { localStorage.setItem(SAVED_VIEWS_STORAGE_KEY, JSON.stringify(savedViews)); } catch {}
  }, [savedViews]);

  const saveCurrentAsView = (name: string) => {
    const view: SavedView = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      filter,
      subFilter,
      attributeFilters,
      createdAt: new Date().toISOString(),
    };
    setSavedViews(prev => [...prev, view]);
    setActiveViewId(view.id); // saving lands the user on the new view tab
    showToast(t(lang, 'views.saved', { name }), 'success');
  };

  const applySavedView = (view: SavedView) => {
    setFilter(view.filter);
    setSubFilter(view.subFilter);
    setAttributeFilters(view.attributeFilters);
    setSelectedIds(new Set());
    setActiveViewId(view.id);
  };

  const deleteSavedView = (id: string) => {
    setSavedViews(prev => prev.filter(v => v.id !== id));
    if (activeViewId === id) resetToAllView();
  };

  // "All LOTs" tab: pristine state, no filters of any kind
  const resetToAllView = () => {
    setFilter('ALL');
    setSubFilter('ALL');
    setAttributeFilters(EMPTY_ATTRIBUTE_FILTERS);
    setSelectedIds(new Set());
    setActiveViewId(null);
  };

  const isPristine = filter === 'ALL' && subFilter === 'ALL' && isAttributeFiltersEmpty(attributeFilters);

  const filtered = useMemo(() => {
    let list = pos;
    if (filter === 'NEEDS_ACTION') {
      list = list.filter(p => NEEDS_ACTION_STATUSES.includes(p.status));
      if (subFilter !== 'ALL') list = list.filter(p => matchExcCategory(p, subFilter));
    } else if (filter === 'DONE') {
      list = list.filter(p => p.status === 'ASSIGNED' || p.status === 'MANUALLY_OVERRIDDEN');
    } else if (filter !== 'ALL') {
      list = list.filter(p => p.status === filter);
    }
    if (!isAttributeFiltersEmpty(attributeFilters)) {
      list = list.filter(p => matchAttributeFilters(p, attributeFilters));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.poNo || '').toLowerCase().includes(q) ||
        (p.moovRef || '').toLowerCase().includes(q) ||
        p.lot.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q) ||
        (p.pol || '').toLowerCase().includes(q) ||
        (p.pod || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [pos, filter, subFilter, attributeFilters, searchQuery]);

  const showToast = (msg: string, kind?: string) => {
    const id = Date.now() + Math.random();
    setToasts(arr => [...arr, { id, msg, kind }]);
    setTimeout(() => setToasts(arr => arr.filter(x => x.id !== id)), 3500);
  };

  const openDrawer = (po: PO) => {
    setDrawerPo(po);
    setIsLiveRun(false);
    setRunningStep(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setInterceptModal(null);
    setTimeout(() => {
      setDrawerPo(null);
      setIsLiveRun(false);
      setRunningStep(null);
    }, 300);
  };

  const runPreAssignLive = (po: PO) => {
    const updated = computeAssignment(po);

    const failStep = updated.status === 'ON_HOLD' ? 1
      : updated.status === 'EXCEPTION' ? (updated.exceptionAtStep ?? 4)
      : 5;

    // Determine if Step 1 failure is user-fixable (intercept mid-animation)
    const interceptType: 'crdLaterThanFob' | 'tooEarly' | null =
      updated.exceptionKey === 'crdLaterThanFob' ? 'crdLaterThanFob'
      : (updated.status === 'ON_HOLD' && updated.onHoldKey === 'requestTooEarly') ? 'tooEarly'
      : null;

    setDrawerPo(updated);
    setDrawerOpen(true);
    setIsLiveRun(true);
    setRunningStep(1);

    let cur = 1;
    const interval = setInterval(() => {
      cur++;
      // Step 1 animation just finished — pause and ask user if interceptable
      if (cur === 2 && interceptType) {
        clearInterval(interval);
        setRunningStep(null);
        setIsLiveRun(false);
        setInterceptModal({ type: interceptType, po, computedResult: updated });
        return;
      }
      if (cur > failStep) {
        clearInterval(interval);
        setRunningStep(null);
        setIsLiveRun(false);
        setPos(prev => prev.map(p => p.id === po.id ? updated : p));
        const label = po.moovRef || po.lot;
        if (updated.status === 'ASSIGNED') {
          showToast(t(lang, 'toast.singleDone', { po: label }), 'success');
        } else if (updated.status === 'ON_HOLD') {
          showToast(t(lang, 'toast.singleOnHold', { po: label }), 'warning');
        } else {
          showToast(t(lang, 'toast.singleException', { po: label, n: updated.exceptionAtStep ?? 1 }), 'error');
        }
      } else {
        setRunningStep(cur);
      }
    }, 800);
  };

  const handleRunPreAssign = (po: PO) => runPreAssignLive(po);

  const handleOverride = (data: { carrier: string; service: string; vessel: string; voyage: string; etd: string; eta: string }) => {
    if (!drawerPo) return;
    const overridden: PO = {
      ...drawerPo,
      status: 'MANUALLY_OVERRIDDEN',
      carrier: data.carrier,
      service: data.service,
      vessel: data.vessel,
      voyage: data.voyage,
      etd: data.etd,
      eta: data.eta,
      overriddenBy: 'z.dorothy',
      overriddenAt: new Date().toISOString(),
      exceptionAtStep: undefined,
      exceptionKey: undefined,
      onHoldKey: undefined,
    };
    setPos(prev => prev.map(p => p.id === overridden.id ? overridden : p));
    setDrawerPo(overridden);
    showToast(`${overridden.moovRef || overridden.lot} manually overridden by z.dorothy`, 'warning');
  };

  const handleBookingOverride = (data: { carrier: string; service: string; vessel: string; voyage: string; etd: string; eta: string }) => {
    if (!bookingDrawerPo) return;
    const overridden: PO = {
      ...bookingDrawerPo,
      status: 'MANUALLY_OVERRIDDEN',
      carrier: data.carrier,
      service: data.service,
      vessel: data.vessel,
      voyage: data.voyage,
      etd: data.etd,
      eta: data.eta,
      overriddenBy: 'z.dorothy',
      overriddenAt: new Date().toISOString(),
      exceptionAtStep: undefined,
      exceptionKey: undefined,
      onHoldKey: undefined,
    };
    setBookingPos(prev => prev.map(p => p.id === overridden.id ? overridden : p));
    setBookingDrawerPo(overridden);
    showToast(`${overridden.moovRef || overridden.lot} booking manually overridden by z.dorothy`, 'warning');
  };

  const handleBookingDisplace = (currentPo: PO, displacedPo: PO) => {
    const wasBooked = displacedPo.status === 'BOOKED_EXACT' || displacedPo.status === 'BOOKED_UPDATED';
    const updated: PO = {
      ...currentPo,
      status: 'BOOKED_EXACT',
      carrier: displacedPo.carrier,
      service: displacedPo.service,
      vessel: displacedPo.vessel,
      voyage: displacedPo.voyage,
      etd: displacedPo.etd,
      eta: displacedPo.eta,
      peta: displacedPo.peta,
      exceptionAtStep: undefined,
      exceptionKey: undefined,
      onHoldKey: undefined,
    };
    const reset: PO = {
      ...displacedPo,
      status: 'NOT_STARTED',
      carrier: undefined,
      service: undefined,
      vessel: undefined,
      voyage: undefined,
      etd: undefined,
      eta: undefined,
      peta: undefined,
      pendingAction: wasBooked ? 'cancellation_required' : undefined,
    };
    setBookingPos(prev => prev.map(p =>
      p.id === currentPo.id ? updated :
      p.id === displacedPo.id ? reset : p
    ));
    setBookingDrawerPo(updated);
    showToast(
      wasBooked
        ? `⚠️ ${currentPo.moovRef || currentPo.lot} booked via displacement · ${displacedPo.moovRef || displacedPo.lot} reset — cancellation required`
        : `✅ ${currentPo.moovRef || currentPo.lot} booked via slot displacement · ${displacedPo.moovRef || displacedPo.lot} released`,
      wasBooked ? 'warning' : 'success'
    );
  };

  const handleEmailSent = (poId: number, action: string, recipient: string) => {
    setPos(prev => prev.map(p => p.id === poId ? { ...p, pendingAction: action } : p));
    setDrawerPo(prev => prev?.id === poId ? { ...prev, pendingAction: action } : prev);
    const label = recipient.length > 30 ? recipient.slice(0, 30) + '…' : recipient;
    showToast(`✅ Email sent to ${label}`, 'success');
  };

  const handleRerunWithNewCrd = (newCrd: string) => {
    if (!drawerPo) return;
    const newCrdWeek = etdToAllocWeek(newCrd);
    const modifiedPo = { ...drawerPo, crd: newCrd, crdWeek: newCrdWeek, exceptionAtStep: undefined, exceptionKey: undefined, onHoldKey: undefined };
    setPos(prev => prev.map(p => p.id === modifiedPo.id ? modifiedPo : p));
    runPreAssignLive(modifiedPo);
  };

  const handleDisplace = (targetPo: PO, displacedPo: PO) => {
    const assignedTarget: PO = {
      ...targetPo,
      status: 'ASSIGNED',
      carrier: displacedPo.carrier,
      service: displacedPo.service,
      vessel: displacedPo.vessel,
      voyage: displacedPo.voyage,
      etd: displacedPo.etd,
      eta: displacedPo.eta,
      peta: displacedPo.peta,
      exceptionAtStep: undefined,
      exceptionKey: undefined,
      onHoldKey: undefined,
      pendingAction: undefined,
    };
    const resetDisplaced: PO = {
      ...displacedPo,
      status: 'NOT_STARTED',
      carrier: undefined,
      service: undefined,
      vessel: undefined,
      voyage: undefined,
      etd: undefined,
      eta: undefined,
      peta: undefined,
      priority: undefined,
    };
    setPos(prev => prev.map(p =>
      p.id === targetPo.id ? assignedTarget :
      p.id === displacedPo.id ? resetDisplaced : p
    ));
    setDrawerPo(assignedTarget);
    showToast(
      `✅ ${targetPo.moovRef || targetPo.lot} allocated · ${displacedPo.moovRef || displacedPo.lot} reset to NOT_STARTED`,
      'warning'
    );
  };

  const handleBatchRun = () => {
    const targets = selectedIds.size > 0
      ? pos.filter(p => selectedIds.has(p.id) && p.status === 'NOT_STARTED')
      : pos.filter(p => p.status === 'NOT_STARTED');

    if (targets.length === 0) {
      showToast(t(lang, 'toast.noEligible'));
      return;
    }

    setBatchRunning(true);
    showToast(t(lang, 'toast.batchStart', { n: targets.length }));

    targets.forEach((po, idx) => {
      setTimeout(() => {
        const updated = computeAssignment(po);

        setPos(prev => prev.map(p => p.id === po.id ? updated : p));

        if (idx === targets.length - 1) {
          setBatchRunning(false);
          showToast(t(lang, 'toast.batchDone', { n: targets.length }), 'success');
          setSelectedIds(new Set());
        }
      }, (idx + 1) * 400);
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Checkbox selection semantics differ per tab:
  // - Completed: select assigned LOTs (for Send to SmartMOOV)
  // - Needs Action, narrowed to one open reason (Schedule/No Vessel/No Space):
  //   select still-open EXCEPTION rows in that category (for batch Resolve)
  // - Needs Action, narrowed to Resolved: select resolved rows (for batch Re-run)
  // - Needs Action with All Reasons / Awaiting Supplier: nothing selectable —
  //   must narrow to a single reason first (On Hold batch flow deferred)
  // - everywhere else: select not-started LOTs (for batch run)
  const isPoSelectable = (po: PO): boolean => {
    if (filter === 'DONE') return (po.status === 'ASSIGNED' || po.status === 'MANUALLY_OVERRIDDEN') && !po.sentToSmartMoov;
    if (filter === 'NEEDS_ACTION') {
      if (subFilter === 'RESOLVED') return po.status === 'RESOLVED_PENDING_RERUN';
      if (subFilter === 'ALL' || subFilter === 'SUPPLIER') return false;
      return matchExcCategory(po, subFilter);
    }
    return po.status === 'NOT_STARTED';
  };

  const toggleSelectAll = () => {
    const eligibleIds = filtered.filter(isPoSelectable).map(p => p.id);
    if (selectedIds.size === eligibleIds.length && eligibleIds.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligibleIds));
    }
  };

  const handleSendToSmartMoov = () => {
    if (selectedIds.size === 0) return;
    const n = selectedIds.size;
    setPos(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, sentToSmartMoov: true } : p));
    setSelectedIds(new Set());
    showToast(`✅ ${n} LOT${n > 1 ? 's' : ''} sent to SmartMOOV`, 'success');
  };

  // Batch reschedule: move selected assigned LOTs onto a new carrier/voyage.
  // Original assignment is preserved in preassignSnapshot; status becomes
  // MANUALLY_OVERRIDDEN so rescheduled LOTs stay auditable and distinct from AI picks.
  const handleBatchReschedule = (lotIds: number[], target: RescheduleTarget) => {
    const ids = new Set(lotIds);
    const ts = new Date().toISOString();
    setPos(prev => prev.map(p => {
      if (!ids.has(p.id)) return p;
      return {
        ...p,
        preassignSnapshot: p.carrier ? {
          executedAt: p.overriddenAt || ts,
          carrier: p.carrier,
          service: p.service || '',
          vessel: p.vessel || '',
          voyage: p.voyage || '',
          etd: p.etd || '',
          eta: p.eta || '',
        } : p.preassignSnapshot,
        carrier: target.carrier,
        service: target.service,
        vessel: target.vessel,
        voyage: target.voyage,
        etd: target.etd,
        eta: target.eta,
        peta: target.peta,
        status: 'MANUALLY_OVERRIDDEN',
        overriddenBy: 'z.dorothy',
        overriddenAt: ts,
      };
    }));
    setSelectedIds(new Set());
    showToast(t(lang, 'reschedule.toast', { n: lotIds.length, carrier: target.carrier, vessel: target.vessel }), 'success');
  };

  const [batchResolveOpen, setBatchResolveOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const handleBatchResolve = (comment: string) => {
    const n = selectedIds.size;
    const ts = new Date().toISOString();
    setPos(prev => prev.map(p =>
      selectedIds.has(p.id) && p.status === 'EXCEPTION'
        ? { ...p, status: 'RESOLVED_PENDING_RERUN', resolutionNotes: [...(p.resolutionNotes || []), { comment, resolvedAt: ts }] }
        : p
    ));
    setSelectedIds(new Set());
    setBatchResolveOpen(false);
    showToast(`✅ ${n} LOT${n > 1 ? 's' : ''} resolved — ready to re-run`, 'success');
  };

  const handleBatchRerun = () => {
    const targets = pos.filter(p => selectedIds.has(p.id) && p.status === 'RESOLVED_PENDING_RERUN');
    if (targets.length === 0) return;

    setBatchRunning(true);
    showToast(t(lang, 'toast.batchStart', { n: targets.length }));

    targets.forEach((po, idx) => {
      setTimeout(() => {
        const updated = computeAssignment(po);
        setPos(prev => prev.map(p => p.id === po.id ? { ...updated, resolutionNotes: po.resolutionNotes } : p));

        if (idx === targets.length - 1) {
          setBatchRunning(false);
          showToast(t(lang, 'toast.batchDone', { n: targets.length }), 'success');
          setSelectedIds(new Set());
        }
      }, (idx + 1) * 400);
    });
  };

  // Carrier Booking Logic
  const BOOKED_STATUSES: POStatus[] = ['BOOKED_EXACT', 'BOOKED_UPDATED', 'ASSIGNED', 'MANUALLY_OVERRIDDEN'];

  const bookingCounts = useMemo(() => {
    const exactMatch = bookingPos.filter(p => p.status === 'BOOKED_EXACT').length;
    const bookedTotal = bookingPos.filter(
      p => p.status === 'BOOKED_EXACT' || p.status === 'BOOKED_UPDATED'
    ).length;
    return {
      total: bookingPos.length,
      not_started: bookingPos.filter(p => p.status === 'NOT_STARTED').length,
      booked: bookingPos.filter(p => BOOKED_STATUSES.includes(p.status as POStatus)).length,
      overridden: bookingPos.filter(p => p.status === 'MANUALLY_OVERRIDDEN').length,
      exception: bookingPos.filter(p => p.status === 'EXCEPTION').length,
      needs_action: bookingPos.filter(p => NEEDS_ACTION_STATUSES.includes(p.status)).length,
      exactMatch,
      withSnapshot: bookedTotal,
      accuracy: bookedTotal > 0 ? Math.round(exactMatch / bookedTotal * 100) : 0,
    };
  }, [bookingPos]);

  const allocationUsage = useMemo(() => {
    const usage: Record<string, { preassign: number; booked: number }> = {};
    // Merge demo seed baseline
    for (const [k, v] of Object.entries(DEMO_ALLOCATION_USAGE)) {
      usage[k] = { preassign: v.preassign, booked: v.booked };
    }
    const accumulate = (p: PO, type: 'preassign' | 'booked') => {
      if (!p.etd || !p.carrier || !p.polRegion || !p.podRegion) return;
      const code = CARRIER_TO_CODE[p.carrier];
      if (!code) return;
      const week = etdToAllocWeek(p.etd);
      const key = `${code}|${p.polRegion}|${p.podRegion}|${week}`;
      if (!usage[key]) usage[key] = { preassign: 0, booked: 0 };
      usage[key][type] += p.teu;
    };
    pos.filter(p => p.status === 'ASSIGNED' || p.status === 'MANUALLY_OVERRIDDEN').forEach(p => accumulate(p, 'preassign'));
    bookingPos.filter(p => p.status === 'BOOKED_EXACT' || p.status === 'BOOKED_UPDATED' || p.status === 'MANUALLY_OVERRIDDEN').forEach(p => accumulate(p, 'booked'));
    return usage;
  }, [pos, bookingPos]);

  const bookingSubCounts = useMemo(() => {
    const na = bookingPos.filter(p =>
      NEEDS_ACTION_STATUSES.includes(p.status) &&
      (isAttributeFiltersEmpty(bookingAttributeFilters) || matchAttributeFilters(p, bookingAttributeFilters))
    );
    return {
      ALL: na.length,
      SCHEDULE: na.filter(p => matchExcCategory(p, 'SCHEDULE')).length,
      NO_VESSEL: na.filter(p => matchExcCategory(p, 'NO_VESSEL')).length,
      NO_SPACE: na.filter(p => matchExcCategory(p, 'NO_SPACE')).length,
      SUPPLIER: na.filter(p => matchExcCategory(p, 'SUPPLIER')).length,
    };
  }, [bookingPos, bookingAttributeFilters]);

  const bookingFacetOptionCounts = useMemo(
    () => buildFacetOptionCounts(bookingPos, bookingFilter, bookingSubFilter, BOOKED_STATUSES, bookingAttributeFilters),
    [bookingPos, bookingFilter, bookingSubFilter, bookingAttributeFilters]
  );

  const changeBookingFilter = (f: string, sub: string = 'ALL') => {
    setBookingFilter(f);
    setBookingSubFilter(sub);
    setBookingActiveViewId(null);
  };

  const changeBookingSubFilter = (s: string) => {
    setBookingSubFilter(s);
    setBookingActiveViewId(null);
  };

  const updateBookingAttributeFilters = (f: AttributeFilters) => {
    setBookingAttributeFilters(f);
    setBookingActiveViewId(null);
  };

  const bookingFieldOptions = useMemo(() => ({
    carriers: Array.from(new Set(bookingPos.map(p => p.carrier).filter(Boolean))).sort() as string[],
    pols: Array.from(new Set(bookingPos.map(p => p.pol).filter(Boolean))).sort() as string[],
    pods: Array.from(new Set(bookingPos.map(p => p.pod).filter(Boolean))).sort() as string[],
    vessels: Array.from(new Set(bookingPos.map(p => p.vessel).filter(Boolean))).sort() as string[],
    suppliers: Array.from(new Set(bookingPos.map(p => p.supplier).filter(Boolean))).sort() as string[],
  }), [bookingPos]);

  useEffect(() => {
    try { localStorage.setItem(BOOKING_SAVED_VIEWS_STORAGE_KEY, JSON.stringify(bookingSavedViews)); } catch {}
  }, [bookingSavedViews]);

  const saveBookingViewAs = (name: string) => {
    const view: SavedView = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      filter: bookingFilter,
      subFilter: bookingSubFilter,
      attributeFilters: bookingAttributeFilters,
      createdAt: new Date().toISOString(),
    };
    setBookingSavedViews(prev => [...prev, view]);
    setBookingActiveViewId(view.id);
    showToast(t(lang, 'views.saved', { name }), 'success');
  };

  const applyBookingSavedView = (view: SavedView) => {
    setBookingFilter(view.filter);
    setBookingSubFilter(view.subFilter);
    setBookingAttributeFilters(view.attributeFilters);
    setBookingSelectedIds(new Set());
    setBookingActiveViewId(view.id);
  };

  const deleteBookingSavedView = (id: string) => {
    setBookingSavedViews(prev => prev.filter(v => v.id !== id));
    if (bookingActiveViewId === id) resetToAllBookingView();
  };

  const resetToAllBookingView = () => {
    setBookingFilter('ALL');
    setBookingSubFilter('ALL');
    setBookingAttributeFilters(EMPTY_ATTRIBUTE_FILTERS);
    setBookingSelectedIds(new Set());
    setBookingActiveViewId(null);
  };

  const isBookingPristine = bookingFilter === 'ALL' && bookingSubFilter === 'ALL' && isAttributeFiltersEmpty(bookingAttributeFilters);

  const bookingFiltered = useMemo(() => {
    let list = bookingPos;
    if (bookingFilter === 'NEEDS_ACTION') {
      list = list.filter(p => NEEDS_ACTION_STATUSES.includes(p.status));
      if (bookingSubFilter !== 'ALL') list = list.filter(p => matchExcCategory(p, bookingSubFilter));
    } else if (bookingFilter === 'BOOKED' || bookingFilter === 'DONE') {
      list = list.filter(p => BOOKED_STATUSES.includes(p.status as POStatus));
    } else if (bookingFilter !== 'ALL') {
      list = list.filter(p => p.status === bookingFilter);
    }
    if (!isAttributeFiltersEmpty(bookingAttributeFilters)) {
      list = list.filter(p => matchAttributeFilters(p, bookingAttributeFilters));
    }
    if (bookingSearchQuery) {
      const q = bookingSearchQuery.toLowerCase();
      list = list.filter(p =>
        (p.poNo || '').toLowerCase().includes(q) ||
        (p.moovRef || '').toLowerCase().includes(q) ||
        p.lot.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q) ||
        (p.pol || '').toLowerCase().includes(q) ||
        (p.pod || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookingPos, bookingFilter, bookingSubFilter, bookingAttributeFilters, bookingSearchQuery]);

  const openBookingDrawer = (po: PO) => {
    setBookingDrawerPo(po);
    setBookingIsLiveRun(false);
    setBookingRunningStep(null);
    setBookingDrawerOpen(true);
  };

  const closeBookingDrawer = () => {
    setBookingDrawerOpen(false);
    setTimeout(() => {
      setBookingDrawerPo(null);
      setBookingIsLiveRun(false);
      setBookingRunningStep(null);
    }, 300);
  };

  const runBookingLive = (po: PO) => {
    setBookingDrawerPo(po);
    setBookingDrawerOpen(true);
    setBookingIsLiveRun(true);
    setBookingRunningStep(1);
    let cur = 1;
    const interval = setInterval(() => {
      cur++;
      if (cur > 5) {
        clearInterval(interval);
        setBookingRunningStep(null);
        setBookingIsLiveRun(false);
        const hasSnapshot = !!po.preassignSnapshot;
        const updated: PO = {
          ...po,
          status: hasSnapshot ? 'BOOKED_EXACT' : 'BOOKED_UPDATED',
          carrier: 'Hapag-Lloyd',
          service: 'NE2',
          vessel: hasSnapshot && po.preassignSnapshot!.vessel === 'MAERSK STOCKHOLM'
            ? 'MAERSK STOCKHOLM' : 'AL ZUBARA',
          voyage: 'AZ622W',
          etd: '2026-06-08',
          eta: '2026-07-15',
          priority: 1
        };
        setBookingPos(prev => prev.map(p => p.id === po.id ? updated : p));
        setBookingDrawerPo(updated);
        showToast(t(lang, 'toast.singleDone', { po: po.moovRef || po.lot}), 'success');
      } else {
        setBookingRunningStep(cur);
      }
    }, 800);
  };

  const handleBookingBatchRun = () => {
    const targets = bookingSelectedIds.size > 0
      ? bookingPos.filter(p => bookingSelectedIds.has(p.id) && p.status === 'NOT_STARTED')
      : bookingPos.filter(p => p.status === 'NOT_STARTED');

    if (targets.length === 0) {
      showToast(t(lang, 'toast.noEligible'));
      return;
    }

    setBookingBatchRunning(true);
    showToast(t(lang, 'toast.batchStart', { n: targets.length }));

    targets.forEach((po, idx) => {
      setTimeout(() => {
        const rand = Math.random();
        let extras: Partial<PO> = {};

        if (rand < 0.7) {
          const choices = [
            { c: 'CMA CGM', s: 'FAL3', v: 'CMA CGM CHRISTOPHE COLOMB', vo: '0FAYPE1MA' },
            { c: 'Hapag-Lloyd', s: 'NE2', v: 'AL ZUBARA', vo: 'AZ618W' },
            { c: 'MSC', s: 'SILK SERVICE', v: 'MSC GULSUN', vo: 'FW618R' },
            { c: 'Tailwind', s: 'PAX', v: 'TAILWIND HARMONY', vo: 'TW2618N' }
          ];
          const p = choices[Math.floor(Math.random() * choices.length)];
          extras = {
            status: 'ASSIGNED',
            carrier: p.c,
            service: p.s,
            vessel: p.v,
            voyage: p.vo,
            etd: '2026-05-' + String(2 + Math.floor(Math.random() * 10)).padStart(2, '0'),
            eta: '2026-06-' + String(10 + Math.floor(Math.random() * 10)).padStart(2, '0'),
            priority: 1
          };
        } else if (rand < 0.85) {
          extras = { status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'batchNoVoyage' };
        } else {
          extras = { status: 'ON_HOLD', onHoldKey: 'batchCheck' };
        }

        setBookingPos(prev => prev.map(p => p.id === po.id ? { ...p, ...extras } : p));

        if (idx === targets.length - 1) {
          setBookingBatchRunning(false);
          showToast(t(lang, 'toast.batchDone', { n: targets.length }), 'success');
          setBookingSelectedIds(new Set());
        }
      }, (idx + 1) * 400);
    });
  };

  const toggleBookingSelect = (id: number) => {
    setBookingSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookingSelectAll = () => {
    const eligibleIds = bookingFiltered.filter(p => p.status === 'NOT_STARTED').map(p => p.id);
    if (bookingSelectedIds.size === eligibleIds.length && eligibleIds.length > 0) {
      setBookingSelectedIds(new Set());
    } else {
      setBookingSelectedIds(new Set(eligibleIds));
    }
  };

  return (
    <>
      <TopNav
        lang={lang}
        counts={counts}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      {activeTab === 'preassign' && activeSubTab !== 'exception' && (
        <>
          <PageHeader lang={lang} />
          <div className="page">
            <StatsGrid
              lang={lang}
              counts={counts}
              filter={filter}
              subFilter={subFilter}
              setFilter={changeFilter}
            />
            <ViewTabs
              lang={lang}
              savedViews={savedViews}
              activeViewId={activeViewId}
              allActive={activeViewId === null && isPristine}
              canSave={!isPristine}
              onSelectAll={resetToAllView}
              onSelectView={applySavedView}
              onDeleteView={deleteSavedView}
              onSaveView={saveCurrentAsView}
            />
            <Toolbar
              lang={lang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={changeFilter}
              subFilter={subFilter}
              setSubFilter={changeSubFilter}
              subCounts={subCounts}
              selectedIds={selectedIds}
              batchRunning={batchRunning}
              handleBatchRun={handleBatchRun}
              handleSendToSmartMoov={handleSendToSmartMoov}
              handleReschedule={() => setRescheduleOpen(true)}
              handleBatchResolve={() => setBatchResolveOpen(true)}
              handleBatchRerun={handleBatchRerun}
              attributeFilters={attributeFilters}
              setAttributeFilters={updateAttributeFilters}
              fieldOptions={fieldOptions}
              optionCounts={facetOptionCounts}
            />
            <POTable
              lang={lang}
              filtered={filtered}
              filter={filter}
              isSelectable={isPoSelectable}
              selectedIds={selectedIds}
              toggleSelect={toggleSelect}
              toggleSelectAll={toggleSelectAll}
              openDrawer={openDrawer}
              runPreAssignLive={handleRunPreAssign}
            />
          </div>
        </>
      )}
      {activeTab === 'preassign' && activeSubTab === 'exception' && (
        <ExceptionDashboard
          lang={lang}
          exceptionPOs={pos.filter(p => p.status === 'EXCEPTION')}
          openDrawer={openDrawer}
          onResolve={(po) => {
            setResolvePo(po);
            setResolveOpen(true);
          }}
        />
      )}
      {activeTab === 'booking' && activeSubTab !== 'exception' && (
        <>
          <PageHeader lang={lang} titleKey="bookingPage.title" subtitleKey="bookingPage.subtitle" />
          <div className="page">
            <BookingStatsGrid
              lang={lang}
              counts={bookingCounts}
              filter={bookingFilter}
              subFilter={bookingSubFilter}
              setFilter={changeBookingFilter}
            />
            <ViewTabs
              lang={lang}
              savedViews={bookingSavedViews}
              activeViewId={bookingActiveViewId}
              allActive={bookingActiveViewId === null && isBookingPristine}
              canSave={!isBookingPristine}
              onSelectAll={resetToAllBookingView}
              onSelectView={applyBookingSavedView}
              onDeleteView={deleteBookingSavedView}
              onSaveView={saveBookingViewAs}
            />
            <Toolbar
              lang={lang}
              searchQuery={bookingSearchQuery}
              setSearchQuery={setBookingSearchQuery}
              filter={bookingFilter}
              setFilter={changeBookingFilter}
              subFilter={bookingSubFilter}
              setSubFilter={changeBookingSubFilter}
              subCounts={bookingSubCounts}
              selectedIds={bookingSelectedIds}
              batchRunning={bookingBatchRunning}
              handleBatchRun={handleBookingBatchRun}
              attributeFilters={bookingAttributeFilters}
              setAttributeFilters={updateBookingAttributeFilters}
              fieldOptions={bookingFieldOptions}
              optionCounts={bookingFacetOptionCounts}
              isBooking
            />
            <BookingTable
              lang={lang}
              filtered={bookingFiltered}
              selectedIds={bookingSelectedIds}
              toggleSelect={toggleBookingSelect}
              toggleSelectAll={toggleBookingSelectAll}
              openDrawer={openBookingDrawer}
              runBookingLive={runBookingLive}
            />
          </div>
        </>
      )}
      {activeTab === 'booking' && activeSubTab === 'exception' && (
        <BookingExceptionDashboard
          lang={lang}
          exceptionPOs={bookingPos.filter(p => p.status === 'EXCEPTION')}
          openDrawer={openBookingDrawer}
          onResolve={(po) => {
            setBookingResolvePo(po);
            setBookingResolveOpen(true);
          }}
        />
      )}
      {activeTab === 'allocation' && (
        <AllocationManagement
          lang={lang}
          bookingMatrixVersions={bookingMatrixVersions}
          setBookingMatrixVersions={setBookingMatrixVersions}
          fndRulesVersions={fndRulesVersions}
          setFndRulesVersions={setFndRulesVersions}
          earlyShipmentVersions={earlyShipmentVersions}
          setEarlyShipmentVersions={setEarlyShipmentVersions}
          allocationUsage={allocationUsage}
          initialAllocation={INITIAL_ALLOCATION}
        />
      )}

      {/* Pre-Assign Modals */}
      <Drawer
        po={drawerPo}
        open={drawerOpen}
        onClose={closeDrawer}
        runningStep={runningStep}
        isLiveRun={isLiveRun}
        onRerun={() => drawerPo && runPreAssignLive(drawerPo)}
        lang={lang}
        onGoToException={() => {
          closeDrawer();
          setResolvePo(drawerPo);
          setResolveOpen(true);
        }}
        allocationUsage={allocationUsage}
        initialAllocation={INITIAL_ALLOCATION}
        onOverride={handleOverride}
        allPOs={pos}
        onEmailSent={handleEmailSent}
        onDisplace={handleDisplace}
        onRerunWithNewCrd={handleRerunWithNewCrd}
        agentIntercept={interceptModal ? {
          type: interceptModal.type,
          po: interceptModal.po,
          onModifyAndRun: (newCrd) => {
            const newCrdWeek = etdToAllocWeek(newCrd);
            const modifiedPo = { ...interceptModal.po, crd: newCrd, crdWeek: newCrdWeek };
            setInterceptModal(null);
            runPreAssignLive(modifiedPo);
          },
          onProceedAsIs: () => {
            const result = interceptModal.computedResult;
            setInterceptModal(null);
            setPos(prev => prev.map(p => p.id === result.id ? result : p));
            const label = result.moovRef || result.lot;
            if (result.status === 'ON_HOLD') {
              showToast(t(lang, 'toast.singleOnHold', { po: label }), 'warning');
            } else {
              showToast(t(lang, 'toast.singleException', { po: label, n: result.exceptionAtStep ?? 1 }), 'error');
            }
          },
          onCancel: () => {
            setInterceptModal(null);
            closeDrawer();
          },
          onEmailSent: handleEmailSent,
        } : null}
      />
      <ResolveModal
        po={resolvePo}
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        onSubmit={(comment) => {
          if (resolvePo) {
            setPos(prev => prev.map(p =>
              p.id === resolvePo.id
                ? { ...p, status: 'NOT_STARTED', exceptionAtStep: undefined, exceptionKey: undefined }
                : p
            ));
            showToast(t(lang, 'toast.resolveSuccess', { po: resolvePo.moovRef || resolvePo.lot }), 'success');
          }
        }}
        lang={lang}
      />
      <BatchResolveModal
        open={batchResolveOpen}
        count={selectedIds.size}
        onClose={() => setBatchResolveOpen(false)}
        onSubmit={handleBatchResolve}
        lang={lang}
      />
      <RescheduleModal
        open={rescheduleOpen}
        lots={pos.filter(p => selectedIds.has(p.id))}
        lang={lang}
        allocationUsage={allocationUsage}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={handleBatchReschedule}
      />

      {/* Carrier Booking Modals */}
      <BookingDrawer
        po={bookingDrawerPo}
        open={bookingDrawerOpen}
        onClose={closeBookingDrawer}
        runningStep={bookingRunningStep}
        isLiveRun={bookingIsLiveRun}
        onRerun={() => bookingDrawerPo && runBookingLive(bookingDrawerPo)}
        lang={lang}
        onGoToException={() => {
          closeBookingDrawer();
          setBookingResolvePo(bookingDrawerPo);
          setBookingResolveOpen(true);
        }}
        onOverride={handleBookingOverride}
        allPos={bookingPos}
        onDisplace={handleBookingDisplace}
      />
      <BookingResolveModal
        po={bookingResolvePo}
        open={bookingResolveOpen}
        onClose={() => setBookingResolveOpen(false)}
        onSubmit={(comment) => {
          if (bookingResolvePo) {
            setBookingPos(prev => prev.map(p =>
              p.id === bookingResolvePo.id
                ? { ...p, status: 'NOT_STARTED', exceptionAtStep: undefined, exceptionKey: undefined }
                : p
            ));
            showToast(t(lang, 'toast.resolveSuccess', { po: bookingResolvePo.moovRef || bookingResolvePo.lot }), 'success');
          }
        }}
        lang={lang}
      />

      <ToastContainer toasts={toasts} />
    </>
  );
}

export default App;
