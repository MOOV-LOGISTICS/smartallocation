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
  {
    id: 31, moovRef: 'PB26060100031',
    poNo: 'PO-2601-0031', lot: '518820-BCN-1', ian: '518820',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 32, moovRef: 'PB26060100032',
    poNo: 'PO-2601-0032', lot: '521130-RTM-2', ian: '521130',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 33, moovRef: 'PB26060100033',
    poNo: 'PO-2601-0033', lot: '539984-KOP-1', ian: '539984',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 34, moovRef: 'PB26060100034',
    poNo: 'PO-2601-0034', lot: '547161-ANR-1', ian: '547161',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '26/26', ldd: '2026-08-30',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 35, moovRef: 'PB26060100035',
    poNo: 'PO-2601-0035', lot: '550931-HAM-1', ian: '550931',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 5, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 36, moovRef: 'PB26060100036',
    poNo: 'PO-2601-0036', lot: '522044-RTM-1', ian: '522044',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 37, moovRef: 'PB26060100037',
    poNo: 'PO-2601-0037', lot: '518821-KOP-1', ian: '518821',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 38, moovRef: 'PB26060100038',
    poNo: 'PO-2601-0038', lot: '521958-BCN-1', ian: '521958',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 39, moovRef: 'PB26060100039',
    poNo: 'PO-2601-0039', lot: '522433-ANR-1', ian: '522433',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '28/26', ldd: '2026-09-13',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 40, moovRef: 'PB26060100040',
    poNo: 'PO-2601-0040', lot: '539985-RTM-1', ian: '539985',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '28/26', ldd: '2026-09-13',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 41, moovRef: 'PB26060100041',
    poNo: 'PO-2601-0041', lot: '518822-HAM-1', ian: '518822',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '28/26', ldd: '2026-09-13',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 42, moovRef: 'PB26060100042',
    poNo: 'PO-2601-0042', lot: '547162-KOP-1', ian: '547162',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '28/26', ldd: '2026-09-13',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 43, moovRef: 'PB26060100043',
    poNo: 'PO-2601-0043', lot: '550932-BCN-1', ian: '550932',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-28', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 44, moovRef: 'PB26060100044',
    poNo: 'PO-2601-0044', lot: '521959-RTM-1', ian: '521959',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 5, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-28', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 45, moovRef: 'PB26060100045',
    poNo: 'PO-2601-0045', lot: '522045-KOP-1', ian: '522045',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-28', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 46, moovRef: 'PB26060100046',
    poNo: 'PO-2601-0046', lot: '518823-HAM-1', ian: '518823',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-07-02', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 47, moovRef: 'PB26060100047',
    poNo: 'PO-2601-0047', lot: '539986-ANR-1', ian: '539986',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-07-02', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 48, moovRef: 'PB26060100048',
    poNo: 'PO-2601-0048', lot: '522434-BCN-1', ian: '522434',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-07-02', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 49, moovRef: 'PB26060100049',
    poNo: 'PO-2601-0049', lot: '550933-RTM-1', ian: '550933',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-07-05', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },
  {
    id: 50, moovRef: 'PB26060100050',
    poNo: 'PO-2601-0050', lot: '547163-HAM-1', ian: '547163',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-07-05', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
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

  // ── BOOKED_EXACT (IDs 113–127) ───────────────────────────────────────────────
  {
    id: 113, moovRef: 'PB26060100051', bookingRef: 'BK-20260527013',
    poNo: 'PO-2601-0051', lot: '518824-BCN-1', ian: '518824',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-05-28', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-21',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
    etd: '2026-06-10', eta: '2026-07-08', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-11 08:20:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
      etd: '2026-06-10', eta: '2026-07-08'
    }
  },
  {
    id: 114, moovRef: 'PB26060100052', bookingRef: 'BK-20260527014',
    poNo: 'PO-2601-0052', lot: '521131-KOP-1', ian: '521131',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-05-28', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-21',
    status: 'BOOKED_EXACT',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW624N',
    etd: '2026-06-13', eta: '2026-07-18', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-11 09:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW624N',
      etd: '2026-06-13', eta: '2026-07-18'
    }
  },
  {
    id: 115, moovRef: 'PB26060100053', bookingRef: 'BK-20260527015',
    poNo: 'PO-2601-0053', lot: '539987-RTM-1', ian: '539987',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-05-30', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-22',
    status: 'BOOKED_EXACT',
    carrier: 'Hapag-Lloyd', service: 'NE2',
    vessel: 'MAERSK STOCKHOLM', voyage: 'MS622W',
    etd: '2026-06-16', eta: '2026-07-22', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-12 10:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'MAERSK STOCKHOLM', voyage: 'MS622W',
      etd: '2026-06-16', eta: '2026-07-22'
    }
  },
  {
    id: 116, moovRef: 'PB26060100054', bookingRef: 'BK-20260527016',
    poNo: 'PO-2601-0054', lot: '547164-ANR-1', ian: '547164',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-05-30', crdWeek: '22/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-22',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'FAL3',
    vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
    etd: '2026-06-20', eta: '2026-07-17', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-13 14:30:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
      etd: '2026-06-20', eta: '2026-07-17'
    }
  },
  {
    id: 117, moovRef: 'PB26060100055', bookingRef: 'BK-20260527017',
    poNo: 'PO-2601-0055', lot: '550934-HAM-1', ian: '550934',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-01', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-23',
    status: 'BOOKED_EXACT',
    carrier: 'MSC', service: 'SHOGUN',
    vessel: 'MSC NINA', voyage: 'SH624E',
    etd: '2026-06-18', eta: '2026-07-25', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-13 15:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC NINA', voyage: 'SH624E',
      etd: '2026-06-18', eta: '2026-07-25'
    }
  },
  {
    id: 118, moovRef: 'PB26060100056', bookingRef: 'BK-20260527018',
    poNo: 'PO-2601-0056', lot: '518825-BCN-1', ian: '518825',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-01', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-24',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE2MA',
    etd: '2026-06-24', eta: '2026-07-22', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-14 09:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE2MA',
      etd: '2026-06-24', eta: '2026-07-22'
    }
  },
  {
    id: 119, moovRef: 'PB26060100057', bookingRef: 'BK-20260527019',
    poNo: 'PO-2601-0057', lot: '522044-KOP-1', ian: '522044',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-03', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-25',
    status: 'BOOKED_EXACT',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXWAVE', voyage: 'BW626N',
    etd: '2026-06-27', eta: '2026-08-01', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-14 11:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW626N',
      etd: '2026-06-27', eta: '2026-08-01'
    }
  },
  {
    id: 120, moovRef: 'PB26060100058', bookingRef: 'BK-20260527020',
    poNo: 'PO-2601-0058', lot: '521959-BCN-1', ian: '521959',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-03', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-26',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE2MA',
    etd: '2026-06-24', eta: '2026-07-22', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-15 08:30:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE2MA',
      etd: '2026-06-24', eta: '2026-07-22'
    }
  },
  {
    id: 121, moovRef: 'PB26060100059', bookingRef: 'BK-20260527021',
    poNo: 'PO-2601-0059', lot: '539988-ANR-1', ian: '539988',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 5, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-05', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-27',
    status: 'BOOKED_EXACT',
    carrier: 'MSC', service: 'SHOGUN',
    vessel: 'MSC NINA', voyage: 'SH626E',
    etd: '2026-07-02', eta: '2026-08-08', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-15 10:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC NINA', voyage: 'SH626E',
      etd: '2026-07-02', eta: '2026-08-08'
    }
  },
  {
    id: 122, moovRef: 'PB26060100060', bookingRef: 'BK-20260527022',
    poNo: 'PO-2601-0060', lot: '522435-RTM-1', ian: '522435',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-05', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-27',
    status: 'BOOKED_EXACT',
    carrier: 'Hapag-Lloyd', service: 'NE2',
    vessel: 'MAERSK STOCKHOLM', voyage: 'MS624W',
    etd: '2026-06-30', eta: '2026-08-05', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-16 09:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'MAERSK STOCKHOLM', voyage: 'MS624W',
      etd: '2026-06-30', eta: '2026-08-05'
    }
  },
  {
    id: 123, moovRef: 'PB26060100061', bookingRef: 'BK-20260527023',
    poNo: 'PO-2601-0061', lot: '518826-HAM-1', ian: '518826',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-07', crdWeek: '23/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-28',
    status: 'BOOKED_EXACT',
    carrier: 'MSC', service: 'SHOGUN',
    vessel: 'MSC GAIA', voyage: 'SH624W',
    etd: '2026-07-05', eta: '2026-08-12', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-16 11:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC GAIA', voyage: 'SH624W',
      etd: '2026-07-05', eta: '2026-08-12'
    }
  },
  {
    id: 124, moovRef: 'PB26060100062', bookingRef: 'BK-20260527024',
    poNo: 'PO-2601-0062', lot: '550935-BCN-1', ian: '550935',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-07', crdWeek: '23/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-28',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM PICASSO', voyage: '0MCXPE1MA',
    etd: '2026-07-08', eta: '2026-08-05', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-17 08:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM PICASSO', voyage: '0MCXPE1MA',
      etd: '2026-07-08', eta: '2026-08-05'
    }
  },
  {
    id: 125, moovRef: 'PB26060100063', bookingRef: 'BK-20260527025',
    poNo: 'PO-2601-0063', lot: '521960-KOP-1', ian: '521960',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-09', crdWeek: '24/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-29',
    status: 'BOOKED_EXACT',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXHANSA', voyage: 'BH624N',
    etd: '2026-07-10', eta: '2026-08-15', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-17 10:30:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXHANSA', voyage: 'BH624N',
      etd: '2026-07-10', eta: '2026-08-15'
    }
  },
  {
    id: 126, moovRef: 'PB26060100064', bookingRef: 'BK-20260527026',
    poNo: 'PO-2601-0064', lot: '539989-RTM-1', ian: '539989',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-09', crdWeek: '24/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-30',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'FAL3',
    vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE2MA',
    etd: '2026-07-12', eta: '2026-08-10', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-18 09:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE2MA',
      etd: '2026-07-12', eta: '2026-08-10'
    }
  },
  {
    id: 127, moovRef: 'PB26060100065', bookingRef: 'BK-20260527027',
    poNo: 'PO-2601-0065', lot: '547165-BCN-1', ian: '547165',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-10', crdWeek: '24/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-30',
    status: 'BOOKED_EXACT',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM PICASSO', voyage: '0MCXPE1MA',
    etd: '2026-07-08', eta: '2026-08-05', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-18 11:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM PICASSO', voyage: '0MCXPE1MA',
      etd: '2026-07-08', eta: '2026-08-05'
    }
  },

  // ── BOOKED_UPDATED (IDs 128–134) — vessel changed post pre-assign ────────────
  {
    id: 128, moovRef: 'PB26060100066', bookingRef: 'BK-20260527028',
    poNo: 'PO-2601-0066', lot: '522436-ANR-1', ian: '522436',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-01', crdWeek: '23/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-20',
    status: 'BOOKED_UPDATED',
    carrier: 'Hapag-Lloyd', service: 'NE2',
    vessel: 'BERLIN EXPRESS', voyage: 'BE624E',
    etd: '2026-06-28', eta: '2026-08-03', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-10 10:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE2MA',
      etd: '2026-06-06', eta: '2026-07-05'
    }
  },
  {
    id: 129, moovRef: 'PB26060100067', bookingRef: 'BK-20260527029',
    poNo: 'PO-2601-0067', lot: '518827-HAM-1', ian: '518827',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-03', crdWeek: '23/26', fobWeek: '26/26', ldd: '2026-08-30',
    srd: '2026-05-21',
    status: 'BOOKED_UPDATED',
    carrier: 'MSC', service: 'SHOGUN',
    vessel: 'MSC GAIA', voyage: 'SH626W',
    etd: '2026-07-12', eta: '2026-08-19', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-11 14:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC NINA', voyage: 'SH624E',
      etd: '2026-06-18', eta: '2026-07-25'
    }
  },
  {
    id: 130, moovRef: 'PB26060100068', bookingRef: 'BK-20260527030',
    poNo: 'PO-2601-0068', lot: '550936-RTM-1', ian: '550936',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 5, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-05', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-22',
    status: 'BOOKED_UPDATED',
    carrier: 'CMA CGM', service: 'FAL3',
    vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE3MA',
    etd: '2026-07-05', eta: '2026-08-03', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-12 08:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
      etd: '2026-06-20', eta: '2026-07-17'
    }
  },
  {
    id: 131, moovRef: 'PB26060100069', bookingRef: 'BK-20260527031',
    poNo: 'PO-2601-0069', lot: '539990-BCN-1', ian: '539990',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-07', crdWeek: '23/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-23',
    status: 'BOOKED_UPDATED',
    carrier: 'CMA CGM', service: 'MEX',
    vessel: 'CMA CGM PICASSO', voyage: '0MCXPE2MA',
    etd: '2026-07-22', eta: '2026-08-19', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-13 09:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM ROSSINI', voyage: '0GCXPE1MA',
      etd: '2026-06-10', eta: '2026-07-08'
    }
  },
  {
    id: 132, moovRef: 'PB26060100070', bookingRef: 'BK-20260527032',
    poNo: 'PO-2601-0070', lot: '522046-ANR-1', ian: '522046',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-09', crdWeek: '24/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-24',
    status: 'BOOKED_UPDATED',
    carrier: 'Hapag-Lloyd', service: 'NE2',
    vessel: 'BERLIN EXPRESS', voyage: 'BE626E',
    etd: '2026-07-12', eta: '2026-08-17', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-14 13:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'MAERSK STOCKHOLM', voyage: 'MS622W',
      etd: '2026-06-16', eta: '2026-07-22'
    }
  },
  {
    id: 133, moovRef: 'PB26060100071', bookingRef: 'BK-20260527033',
    poNo: 'PO-2601-0071', lot: '547166-HAM-1', ian: '547166',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-10', crdWeek: '24/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-05-25',
    status: 'BOOKED_UPDATED',
    carrier: 'MSC', service: 'SHOGUN',
    vessel: 'MSC GAIA', voyage: 'SH628W',
    etd: '2026-07-26', eta: '2026-09-02', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-15 09:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC NINA', voyage: 'SH624E',
      etd: '2026-06-18', eta: '2026-07-25'
    }
  },
  {
    id: 134, moovRef: 'PB26060100072', bookingRef: 'BK-20260527034',
    poNo: 'PO-2601-0072', lot: '521132-KOP-1', ian: '521132',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-12', crdWeek: '24/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-05-26',
    status: 'BOOKED_UPDATED',
    carrier: 'Tailwind', service: 'PAX',
    vessel: 'BUXHANSA', voyage: 'BH626N',
    etd: '2026-07-24', eta: '2026-08-29', priority: 1,
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-15 14:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW624N',
      etd: '2026-06-13', eta: '2026-07-18'
    }
  },

  // ── EXCEPTION (IDs 135–139) ───────────────────────────────────────────────────
  {
    id: 135, moovRef: 'PB26060100073',
    poNo: 'PO-2601-0073', lot: '522437-HAM-1', ian: '522437',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 8, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-10', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-27',
    status: 'EXCEPTION', exceptionAtStep: 3, exceptionKey: 'noAllocation',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-15 16:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'MAERSK STOCKHOLM', voyage: 'MS622W',
      etd: '2026-06-16', eta: '2026-07-22'
    }
  },
  {
    id: 136, moovRef: 'PB26060100074',
    poNo: 'PO-2601-0074', lot: '550937-BCN-1', ian: '550937',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 12, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-12', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-28',
    status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'noVoyage',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED'
  },
  {
    id: 137, moovRef: 'PB26060100075',
    poNo: 'PO-2601-0075', lot: '518828-RTM-1', ian: '518828',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 6, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-28',
    status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'voyageTie',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-16 08:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM MONTMARTRE', voyage: '0FFYPE3MA',
      etd: '2026-06-20', eta: '2026-07-17'
    }
  },
  {
    id: 138, moovRef: 'PB26060100076',
    poNo: 'PO-2601-0076', lot: '539991-KOP-1', ian: '539991',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-14', crdWeek: '24/26', fobWeek: '24/26', ldd: '2026-08-16',
    srd: '2026-05-29',
    status: 'EXCEPTION', exceptionAtStep: 3, exceptionKey: 'noAllocation',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-16 10:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXWAVE', voyage: 'BW624N',
      etd: '2026-06-13', eta: '2026-07-18'
    }
  },
  {
    id: 139, moovRef: 'PB26060100077',
    poNo: 'PO-2601-0077', lot: '522047-ANR-1', ian: '522047',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-15', crdWeek: '25/26', fobWeek: '25/26', ldd: '2026-08-23',
    srd: '2026-05-30',
    status: 'EXCEPTION', exceptionAtStep: 4, exceptionKey: 'noVoyage',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU'
  },

  // ── NOT_STARTED (IDs 140–150) — SRD received, awaiting booking run ───────────
  {
    id: 140, moovRef: 'PB26060100078',
    poNo: 'PO-2601-0078', lot: '521133-BCN-1', ian: '521133',
    article: 'Akku-Heckenschere AHS 36 Li D1', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-06-01',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-18 09:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM PICASSO', voyage: '0MCXPE1MA',
      etd: '2026-07-08', eta: '2026-08-05'
    }
  },
  {
    id: 141, moovRef: 'PB26060100079',
    poNo: 'PO-2601-0079', lot: '547167-RTM-1', ian: '547167',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-18', crdWeek: '25/26', fobWeek: '27/26', ldd: '2026-09-06',
    srd: '2026-06-02',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-19 08:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE2MA',
      etd: '2026-07-12', eta: '2026-08-10'
    }
  },
  {
    id: 142, moovRef: 'PB26060100080',
    poNo: 'PO-2601-0080', lot: '550938-KOP-1', ian: '550938',
    article: 'LED-Stripe LST 5m RGB+W Smart', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNXMN', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-06-02',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-19 10:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXHANSA', voyage: 'BH626N',
      etd: '2026-07-24', eta: '2026-08-29'
    }
  },
  {
    id: 143, moovRef: 'PB26060100081',
    poNo: 'PO-2601-0081', lot: '518829-ANR-1', ian: '518829',
    article: 'Dampfbügeleisen DBE 2800 A2 Ceramic', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNGDZ', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-21', crdWeek: '25/26', fobWeek: '28/26', ldd: '2026-09-13',
    srd: '2026-06-03',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-20 09:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC GAIA', voyage: 'SH628W',
      etd: '2026-07-26', eta: '2026-09-02'
    }
  },
  {
    id: 144, moovRef: 'PB26060100082',
    poNo: 'PO-2601-0082', lot: '522438-HAM-1', ian: '522438',
    article: 'Balkontisch BT 90 Alu Klapp', batch: '2601',
    teu: 5, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-23', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    srd: '2026-06-04',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-20 11:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'BERLIN EXPRESS', voyage: 'BE626E',
      etd: '2026-07-12', eta: '2026-08-17'
    }
  },
  {
    id: 145, moovRef: 'PB26060100083',
    poNo: 'PO-2601-0083', lot: '539992-BCN-1', ian: '539992',
    article: 'Campingklappstuhl CKS 200 Comfort', batch: '2601',
    teu: 1, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-06-23', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    srd: '2026-06-04',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-21 08:00:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM PICASSO', voyage: '0MCXPE2MA',
      etd: '2026-07-22', eta: '2026-08-19'
    }
  },
  {
    id: 146, moovRef: 'PB26060100084',
    poNo: 'PO-2601-0084', lot: '521961-RTM-1', ian: '521961',
    article: 'D Steppjacke DOWN Slim Fit', batch: '2601',
    teu: 3, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNDAL', pod: 'NLRTM', del: 'NLMOE', dwh: 'MOE',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '29/26', ldd: '2026-09-20',
    srd: '2026-06-05',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-21 10:00:00',
      carrier: 'CMA CGM', service: 'FAL3',
      vessel: 'CMA CGM CHRISTOPHE COLOMB', voyage: '0FAYPE3MA',
      etd: '2026-07-05', eta: '2026-08-03'
    }
  },
  {
    id: 147, moovRef: 'PB26060100085',
    poNo: 'PO-2601-0085', lot: '547168-ANR-1', ian: '547168',
    article: 'Bambus-Badset BDS 5-tlg Organic', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNTAO', pod: 'BEANR', del: 'BEANR', dwh: 'ANR',
    crd: '2026-06-25', crdWeek: '26/26', fobWeek: '30/26', ldd: '2026-09-27',
    srd: '2026-06-06',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-21 14:00:00',
      carrier: 'MSC', service: 'SHOGUN',
      vessel: 'MSC NINA', voyage: 'SH626E',
      etd: '2026-07-02', eta: '2026-08-08'
    }
  },
  {
    id: 148, moovRef: 'PB26060100086',
    poNo: 'PO-2601-0086', lot: '550939-KOP-1', ian: '550939',
    article: 'LED-Gartenleuchte GLS 80 Solar', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNGB', pod: 'SIKOP', del: 'SIKOP', dwh: 'KOP',
    crd: '2026-06-28', crdWeek: '26/26', fobWeek: '30/26', ldd: '2026-09-27',
    srd: '2026-06-07',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-21 15:00:00',
      carrier: 'Tailwind', service: 'PAX',
      vessel: 'BUXHANSA', voyage: 'BH628N',
      etd: '2026-08-07', eta: '2026-09-11'
    }
  },
  {
    id: 149, moovRef: 'PB26060100087',
    poNo: 'PO-2601-0087', lot: '522048-HAM-1', ian: '522048',
    article: 'Wanderrucksack WRS 30L Pro', batch: '2601',
    teu: 4, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNNBO', pod: 'DEHAM', del: 'DEHAM', dwh: 'HAM',
    crd: '2026-06-28', crdWeek: '26/26', fobWeek: '30/26', ldd: '2026-09-27',
    srd: '2026-06-08',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'NEU',
    preassignSnapshot: {
      executedAt: '2026-05-21 16:00:00',
      carrier: 'Hapag-Lloyd', service: 'NE2',
      vessel: 'BERLIN EXPRESS', voyage: 'BE628E',
      etd: '2026-07-26', eta: '2026-08-31'
    }
  },
  {
    id: 150, moovRef: 'PB26060100088',
    poNo: 'PO-2601-0088', lot: '518830-BCN-1', ian: '518830',
    article: 'Trocken-/Nasshaarschneidemaschine HKM 600', batch: '2601',
    teu: 2, ctr: '40 HC', ctrType: '40 HC',
    pol: 'CNSHA', pod: 'ESBCN', del: 'ESBCN', dwh: 'BCN',
    crd: '2026-07-02', crdWeek: '27/26', fobWeek: '30/26', ldd: '2026-09-27',
    srd: '2026-06-08',
    status: 'NOT_STARTED',
    supplier: 'LIDL & KL ASIA_IC / OWIM', polRegion: 'FAR EAST', podRegion: 'MED',
    preassignSnapshot: {
      executedAt: '2026-05-21 16:30:00',
      carrier: 'CMA CGM', service: 'MEX',
      vessel: 'CMA CGM PICASSO', voyage: '0MCXPE2MA',
      etd: '2026-07-22', eta: '2026-08-19'
    }
  },
];
