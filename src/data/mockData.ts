import { PO, PreassignSnapshot } from '../App';

// 30 representative LOTs from batch 2601 (LOTlist-1.csv)
export const MOCK_POS: PO[] = [

  // ── ASSIGNED (4) — buffer = 4 weeks, CNNBO origin, already allocated ───────
  {
    id: 1, moovRef: 'PB26060100001',
    poNo: 'PO-2601-0001', lot: '518815-BCN-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ASSIGNED', carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
    etd: '2026-06-10', eta: '2026-07-08', peta: '2026-07-12', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 2, moovRef: 'PB26060100002',
    poNo: 'PO-2601-0002', lot: '518815-KOP-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ASSIGNED', carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW624N',
    etd: '2026-06-13', eta: '2026-07-18', peta: '2026-07-22', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 3, moovRef: 'PB26060100003',
    poNo: 'PO-2601-0003', lot: '518817-KOP-6', ian: '518817',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ASSIGNED', carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW624N',
    etd: '2026-06-13', eta: '2026-07-18', peta: '2026-07-22', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 4, moovRef: 'PB26060100004',
    poNo: 'PO-2601-0004', lot: '518815-RTM-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ASSIGNED', carrier: 'CMA CGM', service: 'FAL3',
    vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE2MA',
    etd: '2026-06-06', eta: '2026-07-05', peta: '2026-07-09', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },

  // ── ON_HOLD (8) — buffer > 4 weeks, not in Early Shipment List ──────────────
  {
    id: 5, moovRef: 'PB26060100005',
    poNo: 'PO-2601-0005', lot: '522437-RTM-2', ian: '522437',
    article: 'Fahrradhelm FHM CE Road Adult', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-04-06', crdWeek: '15/26', fobWeek: '22/26', ldd: '2026-07-19',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'CITYGATE24', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 6, moovRef: 'PB26060100006',
    poNo: 'PO-2601-0006', lot: '518817-KOP-7', ian: '518817',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-04', crdWeek: '19/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 7, moovRef: 'PB26060100007',
    poNo: 'PO-2601-0007', lot: '518815-KOP-7', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-04', crdWeek: '19/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 8, moovRef: 'PB26060100008',
    poNo: 'PO-2601-0008', lot: '521968-KOP-1', ian: '521968',
    article: 'H Winterjacke 3-in-1 DOWN/PES', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'LKCMB', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-04', crdWeek: '19/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'MIDDLE EAST', podRegion: 'MED'
  },
  {
    id: 9, moovRef: 'PB26060100009',
    poNo: 'PO-2601-0009', lot: '521968-RTM-1', ian: '521968',
    article: 'H Winterjacke 3-in-1 DOWN/PES', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'LKCMB', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-05-04', crdWeek: '19/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'MIDDLE EAST', podRegion: 'NEU'
  },
  {
    id: 10, moovRef: 'PB26060100010',
    poNo: 'PO-2601-0010', lot: '521968-BCN-1', ian: '521968',
    article: 'H Winterjacke 3-in-1 DOWN/PES', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'LKCMB', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-05-04', crdWeek: '19/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'MIDDLE EAST', podRegion: 'MED'
  },
  {
    id: 11, moovRef: 'PB26060100011',
    poNo: 'PO-2601-0011', lot: '540711-KOP-6', ian: '540711',
    article: 'Laufrad LFR 10 Balance Kids', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-04-27', crdWeek: '18/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 12, moovRef: 'PB26060100012',
    poNo: 'PO-2601-0012', lot: '540711-RTM-20', ian: '540711',
    article: 'Laufrad LFR 10 Balance Kids', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-04-27', crdWeek: '18/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'ON_HOLD', onHoldKey: 'requestTooEarly',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },

  // ── EXCEPTION (6) — step 1: no carrier registered for this POL→POD ─────────
  {
    id: 13, moovRef: 'PB26060100013',
    poNo: 'PO-2601-0013', lot: '544831-KOP-2', ian: '544831',
    article: 'Gartenbank GB 180 FSC Massiv', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNFOC', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 14, moovRef: 'PB26060100014',
    poNo: 'PO-2601-0014', lot: '522120-RTM-2', ian: '522120',
    article: 'Akku-Bohrschrauber ABS 18 Li D2', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNFOC', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 15, moovRef: 'PB26060100015',
    poNo: 'PO-2601-0015', lot: '521190-BCN-1', ian: '521190',
    article: 'Induktions-Kochset IKS 4-tlg A3', batch: '2601',
    teu: 9, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-12', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'MEISTER', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 16, moovRef: 'PB26060100016',
    poNo: 'PO-2601-0016', lot: '522428-RTM-1', ian: '522428',
    article: 'Standventilator SVT 40 D3 Timer', batch: '2601',
    teu: 7, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-03', crdWeek: '23/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'HABERMANN / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 17, moovRef: 'PB26060100017',
    poNo: 'PO-2601-0017', lot: '521969-ANR-1', ian: '521969',
    article: 'H Softshell-Funktionsjacke SSJ Pro', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'LKCMB', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-07', crdWeek: '23/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'MIDDLE EAST', podRegion: 'NEU'
  },
  {
    id: 18, moovRef: 'PB26060100018',
    poNo: 'PO-2601-0018', lot: '522432-ANR-1', ian: '522432',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 16, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'EXCEPTION', exceptionAtStep: 2, exceptionKey: 'noCarrier',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },

  // ── NOT_STARTED (12) — pending allocation run ───────────────────────────────
  {
    id: 19, moovRef: 'PB26060100019',
    poNo: 'PO-2601-0019', lot: '521129-BCN-1', ian: '521129',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'MED'
  },
  {
    id: 20, moovRef: 'PB26060100020',
    poNo: 'PO-2601-0020', lot: '521129-BCN-2', ian: '521129',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'MED'
  },
  {
    id: 21, moovRef: 'PB26060100021',
    poNo: 'PO-2601-0021', lot: '521129-RTM-1', ian: '521129',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'NEU'
  },
  {
    id: 22, moovRef: 'PB26060100022',
    poNo: 'PO-2601-0022', lot: '521170-BCN-1', ian: '521170',
    article: 'LED-Gartenleuchte GLS 80 Solar', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'MED'
  },
  {
    id: 23, moovRef: 'PB26060100023',
    poNo: 'PO-2601-0023', lot: '521957-ANR-1', ian: '521957',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-13', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'NEU'
  },
  {
    id: 24, moovRef: 'PB26060100024',
    poNo: 'PO-2601-0024', lot: '522432-RTM-1', ian: '522432',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 25, moovRef: 'PB26060100025',
    poNo: 'PO-2601-0025', lot: '522613-RTM-1', ian: '522613',
    article: 'Kaffeevollautomat KVA 1400 Classic', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-05', crdWeek: '23/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'CROWN', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 26, moovRef: 'PB26060100026',
    poNo: 'PO-2601-0026', lot: '524652-RTM-1', ian: '524652',
    article: 'Hochdruckreiniger HDR 130 Plus', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-15', crdWeek: '25/26', fobWeek: '25/26', ldd: '2026-08-23',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 27, moovRef: 'PB26060100027',
    poNo: 'PO-2601-0027', lot: '539982-KOP-2', ian: '539982',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 28, moovRef: 'PB26060100028',
    poNo: 'PO-2601-0028', lot: '547160-KOP-4', ian: '547160',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 29, moovRef: 'PB26060100029',
    poNo: 'PO-2601-0029', lot: '550930-ANR-1', ian: '550930',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 40, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 30, moovRef: 'PB26060100030',
    poNo: 'PO-2601-0030', lot: '522043-ANR-1', ian: '522043',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 10, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
];

// ── Carrier Booking Module ────────────────────────────────────────────────────
// SRD = Shipment Release Date — triggers entry into Carrier Booking
// preassignSnapshot = frozen record of what Pre-Assign committed to
export const BOOKING_MOCK_POS: PO[] = [

  // ── BOOKED_EXACT (3) — pre-assign vessel still valid, perfect match ─────────
  {
    id: 101, moovRef: 'PB26060100001', bookingRef: 'BK-20260527001',
    poNo: 'PO-2601-0001', lot: '518815-BCN-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-20',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
    etd: '2026-06-10', eta: '2026-07-08', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-10 09:14:22',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
      etd: '2026-06-10', eta: '2026-07-08'
    }
  },
  {
    id: 102, moovRef: 'PB26060100002', bookingRef: 'BK-20260527002',
    poNo: 'PO-2601-0002', lot: '518815-KOP-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-22',
    status: 'BOOKED_EXACT',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW624N',
    etd: '2026-06-13', eta: '2026-07-18', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-08 14:32:05',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW624N',
      etd: '2026-06-13', eta: '2026-07-18'
    }
  },
  {
    id: 103, moovRef: 'PB26060100003', bookingRef: 'BK-20260527003',
    poNo: 'PO-2601-0003', lot: '518817-KOP-6', ian: '518817',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-22',
    status: 'BOOKED_EXACT',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW624N',
    etd: '2026-06-13', eta: '2026-07-18', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-09 11:08:47',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW624N',
      etd: '2026-06-13', eta: '2026-07-18'
    }
  },

  // ── BOOKED_UPDATED (2) — pre-assign vessel sailed, re-allocated ─────────────
  {
    id: 104, moovRef: 'PB26060100004', bookingRef: 'BK-20260527004',
    poNo: 'PO-2601-0004', lot: '518815-RTM-6', ian: '518815',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-05-26', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-18',
    status: 'BOOKED_UPDATED',
    carrier: 'CMA CGM', service: 'FAL3',
    vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE1MA',
    etd: '2026-06-14', eta: '2026-07-13', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-05 16:20:11',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE2MA',
      etd: '2026-06-06', eta: '2026-07-05'
    }
  },
  {
    id: 105, moovRef: 'PB26060100025',
    poNo: 'PO-2601-0025', lot: '522613-RTM-1', ian: '522613',
    article: 'Kaffeevollautomat KVA 1400 Classic', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-05', crdWeek: '23/26', fobWeek: '25/26', ldd: '2026-08-23',
    srd: '2026-05-26',
    status: 'BOOKED_UPDATED',
    carrier: 'Hapag-Lloyd', service: 'NE2',
    vessel: 'MAERSK STOCKHOLM', voyage: 'MS622W',
    etd: '2026-06-22', eta: '2026-07-28', priority: 1,
    supplier: 'CROWN', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-12 10:45:33',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE2MA',
      etd: '2026-06-06', eta: '2026-07-05'
    }
  },

  // ── EXCEPTION (2) — re-run logic failed ─────────────────────────────────────
  {
    id: 106, moovRef: 'PB26060100029',
    poNo: 'PO-2601-0029', lot: '550930-ANR-1', ian: '550930',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 40, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-28',
    status: 'EXCEPTION', exceptionAtStep: 3, exceptionKey: 'noAllocation',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-14 08:55:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
      etd: '2026-06-20', eta: '2026-07-17'
    }
  },
  {
    id: 107, moovRef: 'PB26060100030',
    poNo: 'PO-2601-0030', lot: '522043-ANR-1', ian: '522043',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 10, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-29',
    status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'noVoyage',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },

  // ── NOT_STARTED (5) — SRD received, booking run not yet triggered ────────────
  {
    id: 108, moovRef: 'PB26060100019',
    poNo: 'PO-2601-0019', lot: '521129-BCN-1', ian: '521129',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-27',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-13 09:30:00',
      carrier: 'CMA CGM', service: 'CBS/MEDEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE2MA',
      etd: '2026-06-24', eta: '2026-07-29'
    }
  },
  {
    id: 109, moovRef: 'PB26060100021',
    poNo: 'PO-2601-0021', lot: '521129-RTM-1', ian: '521129',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    srd: '2026-05-28',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-14 11:10:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
      etd: '2026-06-20', eta: '2026-07-22'
    }
  },
  {
    id: 110, moovRef: 'PB26060100022',
    poNo: 'PO-2601-0022', lot: '521170-BCN-1', ian: '521170',
    article: 'LED-Gartenleuchte GLS 80 Solar', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-08', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    srd: '2026-05-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'MED'
  },
  {
    id: 111, moovRef: 'PB26060100023',
    poNo: 'PO-2601-0023', lot: '521957-ANR-1', ian: '521957',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'BDCGP', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-13', crdWeek: '24/26', fobWeek: '25/26', ldd: '2026-08-23',
    srd: '2026-05-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'BD', podRegion: 'NEU'
  },
  {
    id: 112, moovRef: 'PB26060100024',
    poNo: 'PO-2601-0024', lot: '522432-RTM-1', ian: '522432',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-25',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
];
