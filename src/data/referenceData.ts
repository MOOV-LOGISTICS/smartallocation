// Reference data tables used by the 6-step trace log engine

export interface FndRule {
  carrier: string;
  dwh: string;
  pod: string;
  fnd: string;
}

export interface BookingMatrixEntry {
  polCode: string;
  polRegion: string;
  podCode: string;
  podRegion: string;
  carrier: string;
  carrierCode: string;
  service: string;
  transitDays: number;
}

export interface AllocationEntry {
  carrierCode: string;
  carrier: string;
  polRegion: string;
  podRegion: string;
  week: string;
  allocationTeu: number;
  contractType: string;
}

export interface VesselSchedule {
  carrierCode: string;
  carrier: string;
  vessel: string;
  voyage: string;
  polCode: string;
  podCode: string;
  service: string;
  etd: string;
  eta: string;
  availableTeu: number;
  priority: number;
}

// 39 FND rules: carrier + DWH + POD → FND
export const FND_RULES: FndRule[] = [
  // TSHG (Tailwind)
  { carrier: 'TSHG', dwh: 'BCN',  pod: 'ESBCN', fnd: 'ESBCN' },
  { carrier: 'TSHG', dwh: 'WDF',  pod: 'SIKOP', fnd: 'SIKOP' },
  { carrier: 'TSHG', dwh: 'MOE',  pod: 'NLMOE', fnd: 'NLMOE' },
  { carrier: 'TSHG', dwh: 'LGG',  pod: 'NLMOE', fnd: 'BELGG' },
  { carrier: 'TSHG', dwh: 'OOS',  pod: 'NLMOE', fnd: 'NLOOS' },
  { carrier: 'TSHG', dwh: 'RTM',  pod: 'NLRTM', fnd: 'NLMOE' },
  { carrier: 'TSHG', dwh: 'ANR',  pod: 'BEANR', fnd: 'BEANR' },
  { carrier: 'TSHG', dwh: 'KOP',  pod: 'SIKOP', fnd: 'SIKOP' },
  // CMA CGM
  { carrier: 'CMA',  dwh: 'MOE',  pod: 'NLRTM', fnd: 'NLMOE' },
  { carrier: 'CMA',  dwh: 'WDF',  pod: 'NLRTM', fnd: 'NLRTM' },
  { carrier: 'CMA',  dwh: 'LGG',  pod: 'BEANR', fnd: 'BELGG' },
  { carrier: 'CMA',  dwh: 'BCN',  pod: 'ESBCN', fnd: 'ESBCN' },
  { carrier: 'CMA',  dwh: 'RTM',  pod: 'NLRTM', fnd: 'NLRTM' },
  { carrier: 'CMA',  dwh: 'ANR',  pod: 'BEANR', fnd: 'BEANR' },
  { carrier: 'CMA',  dwh: 'MOE',  pod: 'NLMOE', fnd: 'NLMOE' },
  { carrier: 'CMA',  dwh: 'OOS',  pod: 'NLRTM', fnd: 'NLOOS' },
  // Hapag-Lloyd
  { carrier: 'HAPL', dwh: 'MOE',  pod: 'NLRTM', fnd: 'NLMOE' },
  { carrier: 'HAPL', dwh: 'WDF',  pod: 'SIKOP', fnd: 'SIKOP' },
  { carrier: 'HAPL', dwh: 'BCN',  pod: 'ESBCN', fnd: 'ESBCN' },
  { carrier: 'HAPL', dwh: 'RTM',  pod: 'NLRTM', fnd: 'NLRTM' },
  { carrier: 'HAPL', dwh: 'ANR',  pod: 'BEANR', fnd: 'BEANR' },
  { carrier: 'HAPL', dwh: 'LGG',  pod: 'BEANR', fnd: 'BELGG' },
  { carrier: 'HAPL', dwh: 'MOE',  pod: 'NLMOE', fnd: 'NLMOE' },
  { carrier: 'HAPL', dwh: 'OOS',  pod: 'NLRTM', fnd: 'NLOOS' },
  { carrier: 'HAPL', dwh: 'KOP',  pod: 'SIKOP', fnd: 'SIKOP' },
  // MSC
  { carrier: 'MSC',  dwh: 'RTM',  pod: 'NLRTM', fnd: 'NLRTM' },
  { carrier: 'MSC',  dwh: 'MOE',  pod: 'NLRTM', fnd: 'NLMOE' },
  { carrier: 'MSC',  dwh: 'ANR',  pod: 'BEANR', fnd: 'BEANR' },
  { carrier: 'MSC',  dwh: 'LGG',  pod: 'BEANR', fnd: 'BELGG' },
  { carrier: 'MSC',  dwh: 'BCN',  pod: 'ESBCN', fnd: 'ESBCN' },
  { carrier: 'MSC',  dwh: 'WDF',  pod: 'SIKOP', fnd: 'SIKOP' },
  { carrier: 'MSC',  dwh: 'OOS',  pod: 'NLRTM', fnd: 'NLOOS' },
  // COSCO
  { carrier: 'COSCO',dwh: 'RTM',  pod: 'NLRTM', fnd: 'NLRTM' },
  { carrier: 'COSCO',dwh: 'MOE',  pod: 'NLRTM', fnd: 'NLMOE' },
  { carrier: 'COSCO',dwh: 'ANR',  pod: 'BEANR', fnd: 'BEANR' },
  { carrier: 'COSCO',dwh: 'BCN',  pod: 'ESBCN', fnd: 'ESBCN' },
  { carrier: 'COSCO',dwh: 'LGG',  pod: 'BEANR', fnd: 'BELGG' },
  { carrier: 'COSCO',dwh: 'WDF',  pod: 'SIKOP', fnd: 'SIKOP' },
  { carrier: 'COSCO',dwh: 'OOS',  pod: 'NLRTM', fnd: 'NLOOS' },
];

// Booking matrix: which carriers serve each POL→POD lane
// CNSHA→ESBCN intentionally has no vessels (causes EXCEPTION Step 4)
// EGDAM→NLRTM intentionally absent (causes EXCEPTION Step 1)
export const BOOKING_MATRIX: BookingMatrixEntry[] = [
  // CNTAO (Qingdao) → NLRTM (Rotterdam)
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 30 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMA',  service: 'FAL3',    transitDays: 29 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'AEX',     transitDays: 32 },
  // CNNBO (Ningbo) → NLRTM (Rotterdam)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 28 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMA',  service: 'FAL3',    transitDays: 29 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'AEX',     transitDays: 31 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Maersk',       carrierCode: 'MAEU', service: 'AE-1',    transitDays: 30 },
  // CNXMN (Xiamen) → NLRTM
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 30 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMA',  service: 'FAL3',    transitDays: 31 },
  // BDCGP (Chittagong) → SIKOP (Koprivnica)
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'SILK',    transitDays: 32 },
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 30 },
  // CNTAO → SIKOP
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'PAX/DEX', transitDays: 35 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 32 },
  // CNSWA (Shantou) → SIKOP — produces tied voyages → EXCEPTION Step 5
  { polCode: 'CNSWA', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'PAX',     transitDays: 36 },
  { polCode: 'CNSWA', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 33 },
  // CNSHA → BEANR (Antwerp)
  { polCode: 'CNSHA', polRegion: 'FAR EAST', podCode: 'BEANR', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMA',  service: 'FAL3',    transitDays: 27 },
  { polCode: 'CNSHA', polRegion: 'FAR EAST', podCode: 'BEANR', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HAPL', service: 'NE2',     transitDays: 28 },
  { polCode: 'CNSHA', polRegion: 'FAR EAST', podCode: 'BEANR', podRegion: 'NEU', carrier: 'MSC',          carrierCode: 'MSC',  service: 'SILKWAY', transitDays: 29 },
  // CNSHA → ESBCN — carriers exist but no vessel schedule → EXCEPTION Step 4
  { polCode: 'CNSHA', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM',      carrierCode: 'CMA',  service: 'FAL3',    transitDays: 27 },
  { polCode: 'CNSHA', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Maersk',       carrierCode: 'MAEU', service: 'AEX',     transitDays: 27 },
  // CNNBO → ESBCN (Barcelona)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'MEX',     transitDays: 28 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'PAX',     transitDays: 35 },
  // CNNBO → SIKOP (Koprivnica)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'BEX2',    transitDays: 32 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'PAX',     transitDays: 35 },
  // CNNBO → BEANR (Antwerp)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'BEANR', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'FAL3',    transitDays: 27 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'BEANR', podRegion: 'NEU', carrier: 'MSC',          carrierCode: 'MSCU', service: 'SILK SERVICE', transitDays: 28 },
  // BDCGP → ESBCN
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'CBS/MEDEX', transitDays: 35 },
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'TEX/PAX', transitDays: 38 },
  // BDCGP → NLRTM
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'FAL3',    transitDays: 32 },
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC',          carrierCode: 'MSCU', service: 'CHITTAGONG FEEDER', transitDays: 35 },
  // BDCGP → BEANR
  { polCode: 'BDCGP', polRegion: 'BD',       podCode: 'BEANR', podRegion: 'NEU', carrier: 'Tailwind',     carrierCode: 'TSHG', service: 'TEX/PAX', transitDays: 35 },
  // CNDAL → NLRTM (Dalian)
  { polCode: 'CNDAL', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'FAL3',    transitDays: 25 },
  { polCode: 'CNDAL', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HLCU', service: 'NE2',     transitDays: 26 },
  { polCode: 'CNDAL', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC',          carrierCode: 'MSCU', service: 'TIGER',   transitDays: 27 },
  // CNNGB → NLRTM (Ningbo)
  { polCode: 'CNNGB', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM',      carrierCode: 'CMDU', service: 'FAL3',    transitDays: 29 },
  { polCode: 'CNNGB', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd',  carrierCode: 'HLCU', service: 'NE3',     transitDays: 30 },
  { polCode: 'CNNGB', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC',          carrierCode: 'MSCU', service: 'SILK SERVICE', transitDays: 30 },
  // LKCMB → NLRTM (Colombo)
  { polCode: 'LKCMB', polRegion: 'MIDDLE EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC',       carrierCode: 'MSCU', service: 'AUSTRALIA EXPRESS', transitDays: 25 },
  // LKCMB → ESBCN
  { polCode: 'LKCMB', polRegion: 'MIDDLE EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind',  carrierCode: 'TSHG', service: 'TEX/PAX', transitDays: 28 },
  { polCode: 'LKCMB', polRegion: 'MIDDLE EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'MSC',       carrierCode: 'MSCU', service: 'HALDIA SHUTTLE', transitDays: 30 },
  // LKCMB → SIKOP
  { polCode: 'LKCMB', polRegion: 'MIDDLE EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind',  carrierCode: 'TSHG', service: 'TEX/PAX', transitDays: 30 },
  { polCode: 'LKCMB', polRegion: 'MIDDLE EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'MSC',       carrierCode: 'MSCU', service: 'HALDIA SHUTTLE', transitDays: 32 },
];

// Allocation data by carrier + FOB week
export const ALLOCATION_DATA: AllocationEntry[] = [
  // HAPL (Hapag-Lloyd) FAR EAST→NEU
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '18/26', allocationTeu: 80,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '19/26', allocationTeu: 72,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '20/26', allocationTeu: 68,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '21/26', allocationTeu: 75,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '22/26', allocationTeu: 80,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '23/26', allocationTeu: 60,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '24/26', allocationTeu: 55,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '25/26', allocationTeu: 70,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '26/26', allocationTeu: 20,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '27/26', allocationTeu: 65,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'NEU', week: '28/26', allocationTeu: 60,  contractType: 'SC' },
  // HAPL FAR EAST→MED
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'MED', week: '21/26', allocationTeu: 30,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'MED', week: '22/26', allocationTeu: 28,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'MED', week: '23/26', allocationTeu: 25,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',  polRegion: 'FAR EAST', podRegion: 'MED', week: '25/26', allocationTeu: 30,  contractType: 'SC' },
  // CMA CGM FAR EAST→NEU
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '18/26', allocationTeu: 60,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '19/26', allocationTeu: 55,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '20/26', allocationTeu: 50,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '21/26', allocationTeu: 55,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '22/26', allocationTeu: 48,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '23/26', allocationTeu: 42,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '24/26', allocationTeu: 45,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '25/26', allocationTeu: 50,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '26/26', allocationTeu: 15,  contractType: 'SC' },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '27/26', allocationTeu: 52,  contractType: 'SC' },
  // TSHG (Tailwind) FAR EAST→NEU
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '20/26', allocationTeu: 40,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '21/26', allocationTeu: 38,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '22/26', allocationTeu: 35,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '23/26', allocationTeu: 30,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '24/26', allocationTeu: 10,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '25/26', allocationTeu: 40,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'NEU', week: '26/26', allocationTeu: 10,  contractType: 'SC' },
  // TSHG FAR EAST→MED
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'MED', week: '22/26', allocationTeu: 20,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'FAR EAST', podRegion: 'MED', week: '25/26', allocationTeu: 18,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'BD',       podRegion: 'MED', week: '23/26', allocationTeu: 25,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'BD',       podRegion: 'MED', week: '24/26', allocationTeu: 20,  contractType: 'SC' },
  { carrierCode: 'TSHG', carrier: 'Tailwind',       polRegion: 'BD',       podRegion: 'MED', week: '30/26', allocationTeu: 22,  contractType: 'SC' },
  // HAPL BD→MED
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',   polRegion: 'BD',       podRegion: 'MED', week: '23/26', allocationTeu: 20,  contractType: 'SC' },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd',   polRegion: 'BD',       podRegion: 'MED', week: '30/26', allocationTeu: 18,  contractType: 'SC' },
];

// Vessel schedules — CNSHA→ESBCN intentionally empty; CNSWA→SIKOP has two tied voyages
export const VESSEL_SCHEDULES: VesselSchedule[] = [
  // CNTAO → NLRTM
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'AL ZUBARA',           voyage: 'AZ618W',    polCode: 'CNTAO', podCode: 'NLRTM', service: 'NE2',     etd: '2026-05-18', eta: '2026-06-23', availableTeu: 68, priority: 1 },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',     vessel: 'CMA CGM EIFFEL',       voyage: '0FGXPE1MA', polCode: 'CNTAO', podCode: 'NLRTM', service: 'FAL3',    etd: '2026-05-24', eta: '2026-06-29', availableTeu: 44, priority: 1 },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'MAERSK ESSEX',         voyage: 'ME620W',    polCode: 'CNTAO', podCode: 'NLRTM', service: 'NE2',     etd: '2026-06-01', eta: '2026-07-07', availableTeu: 55, priority: 1 },
  // CNNBO → NLRTM
  { carrierCode: 'CMA',  carrier: 'CMA CGM',     vessel: 'CMA CGM TROCADERO',    voyage: '0FFXPE2MA', polCode: 'CNNBO', podCode: 'NLRTM', service: 'FAL3',    etd: '2026-05-16', eta: '2026-06-22', availableTeu: 42, priority: 1 },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'MAERSK STOCKHOLM',     voyage: 'MS620W',    polCode: 'CNNBO', podCode: 'NLRTM', service: 'NE2',     etd: '2026-06-08', eta: '2026-07-15', availableTeu: 58, priority: 1 },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',     vessel: 'CMA CGM MONTMARTRE',   voyage: '0FFYPE2MA', polCode: 'CNNBO', podCode: 'NLRTM', service: 'FAL3',    etd: '2026-06-06', eta: '2026-07-13', availableTeu: 35, priority: 1 },
  { carrierCode: 'TSHG', carrier: 'Tailwind',    vessel: 'BUXWAVE',              voyage: 'BW622N',    polCode: 'CNNBO', podCode: 'NLRTM', service: 'AEX',     etd: '2026-06-15', eta: '2026-07-22', availableTeu: 28, priority: 2 },
  // CNXMN → NLRTM
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'BRUSSELS EXPRESS',     voyage: 'BX619W',    polCode: 'CNXMN', podCode: 'NLRTM', service: 'NE2',     etd: '2026-06-10', eta: '2026-07-16', availableTeu: 40, priority: 1 },
  { carrierCode: 'CMA',  carrier: 'CMA CGM',     vessel: 'CMA CGM TROCADERO',    voyage: '0FFXPE3MA', polCode: 'CNXMN', podCode: 'NLRTM', service: 'FAL3',    etd: '2026-06-12', eta: '2026-07-18', availableTeu: 30, priority: 1 },
  // CNTAO → SIKOP
  { carrierCode: 'TSHG', carrier: 'Tailwind',    vessel: 'TAILWIND PIONEER',     voyage: 'TW2620N',   polCode: 'CNTAO', podCode: 'SIKOP', service: 'PAX/DEX', etd: '2026-05-19', eta: '2026-06-30', availableTeu: 18, priority: 1 },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'BRUSSELS EXPRESS',     voyage: 'BX621W',    polCode: 'CNTAO', podCode: 'SIKOP', service: 'NE2',     etd: '2026-06-22', eta: '2026-08-01', availableTeu: 25, priority: 1 },
  // BDCGP → SIKOP
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'BRUSSELS EXPRESS',     voyage: 'AZ620W',    polCode: 'BDCGP', podCode: 'SIKOP', service: 'NE2',     etd: '2026-06-01', eta: '2026-07-10', availableTeu: 22, priority: 1 },
  { carrierCode: 'TSHG', carrier: 'Tailwind',    vessel: 'WIKING',               voyage: 'WK622W',    polCode: 'BDCGP', podCode: 'SIKOP', service: 'SILK',    etd: '2026-06-25', eta: '2026-08-05', availableTeu: 18, priority: 2 },
  // CNSWA → SIKOP — two voyages with identical ETD and ETA → EXCEPTION Step 5
  { carrierCode: 'TSHG', carrier: 'Tailwind',    vessel: 'PANDA 002',            voyage: 'PD2620W',   polCode: 'CNSWA', podCode: 'SIKOP', service: 'PAX',     etd: '2026-05-28', eta: '2026-07-02', availableTeu: 16, priority: 1 },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'MAERSK ESSEX',         voyage: 'ME619W',    polCode: 'CNSWA', podCode: 'SIKOP', service: 'NE2',     etd: '2026-05-28', eta: '2026-07-02', availableTeu: 20, priority: 1 },
  // CNSHA → BEANR (Antwerp)
  { carrierCode: 'CMA',  carrier: 'CMA CGM',     vessel: 'CMA CGM MONTMARTRE',   voyage: '0FFYPE3MA', polCode: 'CNSHA', podCode: 'BEANR', service: 'FAL3',    etd: '2026-06-15', eta: '2026-07-20', availableTeu: 38, priority: 1 },
  { carrierCode: 'HAPL', carrier: 'Hapag-Lloyd', vessel: 'MAERSK STOCKHOLM',     voyage: 'MS621W',    polCode: 'CNSHA', podCode: 'BEANR', service: 'NE2',     etd: '2026-06-18', eta: '2026-07-23', availableTeu: 45, priority: 1 },
  // CNSHA → ESBCN — no vessel records here → EXCEPTION Step 4 for 514440-BCN-1
];

// Initial allocation budget by carrier + polRegion + podRegion + ETD week
// Key: "${carrierCode}|${polRegion}|${podRegion}|${week}" (week = "XX/26")
// Values sourced from allocation.csv, weeks 20–28 of 2026
export const INITIAL_ALLOCATION: Record<string, number> = {
  // HLCU (Hapag-Lloyd) — FAR EAST → NEU
  'HLCU|FAR EAST|NEU|20/26': 334, 'HLCU|FAR EAST|NEU|21/26': 334,
  'HLCU|FAR EAST|NEU|22/26': 333, 'HLCU|FAR EAST|NEU|23/26': 345,
  'HLCU|FAR EAST|NEU|24/26': 345, 'HLCU|FAR EAST|NEU|25/26': 334,
  'HLCU|FAR EAST|NEU|26/26': 334, 'HLCU|FAR EAST|NEU|27/26': 279,
  'HLCU|FAR EAST|NEU|28/26': 279,
  // HLCU — FAR EAST → MED
  'HLCU|FAR EAST|MED|20/26': 102, 'HLCU|FAR EAST|MED|22/26': 68,
  'HLCU|FAR EAST|MED|24/26': 210, 'HLCU|FAR EAST|MED|26/26': 210,
  'HLCU|FAR EAST|MED|27/26': 176, 'HLCU|FAR EAST|MED|28/26': 176,
  // HLCU — BD → MED
  'HLCU|BD|MED|23/26': 20, 'HLCU|BD|MED|30/26': 18,
  // TSHG (Tailwind) — FAR EAST → NEU
  'TSHG|FAR EAST|NEU|20/26': 960, 'TSHG|FAR EAST|NEU|22/26': 1662,
  'TSHG|FAR EAST|NEU|24/26': 1475, 'TSHG|FAR EAST|NEU|26/26': 1475,
  'TSHG|FAR EAST|NEU|28/26': 1570,
  // TSHG — FAR EAST → MED
  'TSHG|FAR EAST|MED|20/26': 940, 'TSHG|FAR EAST|MED|22/26': 1663,
  'TSHG|FAR EAST|MED|24/26': 1375, 'TSHG|FAR EAST|MED|26/26': 1425,
  'TSHG|FAR EAST|MED|28/26': 1590,
  // TSHG — BD → NEU
  'TSHG|BD|NEU|20/26': 400, 'TSHG|BD|NEU|22/26': 400,
  'TSHG|BD|NEU|24/26': 400, 'TSHG|BD|NEU|26/26': 400,
  'TSHG|BD|NEU|28/26': 310,
  // TSHG — BD → MED
  'TSHG|BD|MED|22/26': 400, 'TSHG|BD|MED|24/26': 400,
  'TSHG|BD|MED|26/26': 400, 'TSHG|BD|MED|28/26': 310,
  // CMDU (CMA CGM) — FAR EAST → NEU
  'CMDU|FAR EAST|NEU|20/26': 450, 'CMDU|FAR EAST|NEU|21/26': 350,
  'CMDU|FAR EAST|NEU|22/26': 567, 'CMDU|FAR EAST|NEU|23/26': 400,
  'CMDU|FAR EAST|NEU|24/26': 450, 'CMDU|FAR EAST|NEU|25/26': 350,
  'CMDU|FAR EAST|NEU|26/26': 300, 'CMDU|FAR EAST|NEU|27/26': 400,
  'CMDU|FAR EAST|NEU|28/26': 350,
  // CMDU — FAR EAST → MED
  'CMDU|FAR EAST|MED|20/26': 216, 'CMDU|FAR EAST|MED|22/26': 242,
  'CMDU|FAR EAST|MED|24/26': 557, 'CMDU|FAR EAST|MED|26/26': 400,
  'CMDU|FAR EAST|MED|28/26': 350,
  // CMDU — BD → NEU
  'CMDU|BD|NEU|22/26': 120, 'CMDU|BD|NEU|24/26': 120,
  'CMDU|BD|NEU|26/26': 120, 'CMDU|BD|NEU|28/26': 100,
  // MSCU (MSC) — FAR EAST → NEU
  'MSCU|FAR EAST|NEU|20/26': 504, 'MSCU|FAR EAST|NEU|22/26': 420,
  'MSCU|FAR EAST|NEU|24/26': 688, 'MSCU|FAR EAST|NEU|26/26': 504,
  'MSCU|FAR EAST|NEU|28/26': 420,
  // MSCU — FAR EAST → MED
  'MSCU|FAR EAST|MED|22/26': 180, 'MSCU|FAR EAST|MED|24/26': 240,
  'MSCU|FAR EAST|MED|26/26': 200, 'MSCU|FAR EAST|MED|28/26': 180,
  // MSCU — MIDDLE EAST → NEU
  'MSCU|MIDDLE EAST|NEU|22/26': 150, 'MSCU|MIDDLE EAST|NEU|24/26': 150,
  'MSCU|MIDDLE EAST|NEU|26/26': 120, 'MSCU|MIDDLE EAST|NEU|28/26': 120,
  // MSCU — MIDDLE EAST → MED
  'MSCU|MIDDLE EAST|MED|22/26': 100, 'MSCU|MIDDLE EAST|MED|24/26': 120,
  'MSCU|MIDDLE EAST|MED|26/26': 100, 'MSCU|MIDDLE EAST|MED|28/26': 80,
};

// LOT identifiers approved for early shipment (buffer > 4 weeks still allowed)
export const EARLY_SHIPMENT_LOTS: Set<string> = new Set([
  '508826-KOP-2','494644-RTM-3','520545-BCN-2','520545-KOP-3','520545-RTM-6',
  '520545-RTM-7','539652-BCN-1','539652-KOP-4','539652-RTM-1','486031-RTM-7',
  '486031-RTM-8','486033-RTM-8','547366-NOR-1','547367-NOR-1','515342-ANR-1',
  '515342-RTM-1','502294-RTM-6','500524-BCN-2','500524-KOP-7','500524-RTM-6',
  '495524-RTM-6','515327-ANR-1','515327-BCN-2','515327-KOP-1','515327-RTM-1',
  '500526-BCN-3','500526-KOP-5','500526-RTM-6','500526-RTM-7','514780-ANR-1',
  '514780-BCN-1','514780-KOP-1','514780-RTM-1','551163-BCN-1','495857-RTM-3',
  '495857-KOP-7','496459-RTM-3','504703-RTM-3','507533-RTM-2','507537-RTM-3',
  '507542-RTM-3','508081-RTM-4','507554-RTM-2','494802-RTM-5','494815-RTM-3',
  '516958-BCN-2','516958-KOP-3','506774-RTM-2','514681-BCN-1','514681-KOP-1',
  '528469-ANR-1','508418-ANR-2','508418-BCN-4','508418-KOP-4','528500-ANR-1',
  '528500-BCN-2','528500-KOP-1','508402-ANR-2','508402-BCN-4','508402-KOP-4',
  '508402-RTM-6','496286-RTM-6','494210-RTM-5','515578-BCN-1','515578-KOP-1',
  '515578-RTM-1','494222-RTM-4','496192-BCN-7','496192-KOP-8','496461-RTM-3',
  '513993-BCN-1','513993-KOP-1','508413-BCN-4','508413-KOP-4','508413-RTM-5',
  '508413-ANR-2','508247-RTM-2','509738-RTM-3','509740-RTM-5','509752-RTM-5',
  '513269-RTM-3','472140-RTM-3','472140-ANR-3','506379-RTM-4','506389-RTM-5',
  '514435-KOP-1','514435-RTM-1','514435-KOP-2','514448-KOP-1','514448-RTM-1',
  '514448-KOP-2','540710-KOP-1','540710-RTM-1','540710-RTM-2','495193-BCN-4',
  '495193-KOP-3','495193-RTM-3','514436-BCN-1','514436-KOP-1','514436-RTM-1',
  '514436-RTM-2','514439-BCN-1','514439-KOP-1','514439-RTM-1','514439-RTM-2',
  '537604-RTM-3','506695-KOP-3','508113-RTM-4','508293-RTM-3','508296-RTM-3',
  '508300-RTM-3','506404-RTM-4','539753-RTM-2','495855-RTM-5','520619-RTM-2',
  '494218-RTM-8','494214-RTM-11','496471-RTM-8','494638-RTM-4','514864-RTM-2',
  '495694-RTM-7','540842-RTM-2','516200-RTM-1','515571-RTM-1','532536-RTM-3',
  '532536-RTM-4','494681-RTM-4','494712-RTM-4','494712-KOP-4','494712-BCN-4',
  '517296-BCN-1','517296-KOP-3','517296-RTM-1','517296-BCN-2','517296-KOP-1',
  '517296-KOP-2','496869-RTM-5','500199-RTM-4','514817-RTM-1','514817-KOP-1',
  '514817-BCN-1','522851-RTM-1','522170-RTM-1','522170-RTM-2','515210-BCN-1',
  '515210-RTM-1','515257-BCN-1','515383-BCN-2','515383-KOP-2','515383-RTM-3',
  '515385-BCN-1','515385-KOP-1','515385-RTM-1','515383-BCN-1','515383-KOP-1',
  '515383-RTM-2','515383-KOP-3','515383-RTM-1','514001-KOP-2','514001-RTM-2',
  '514001-RTM-3','514001-KOP-1','514001-RTM-1','514260-KOP-2','546435-KOP-2',
  '514001-BCN-1','514001-KOP-3','514224-KOP-2','514234-BCN-1','494924-RTM-7',
  '504796-BCN-2','504796-KOP-5','504796-RTM-6','504796-RTM-8','504805-KOP-4',
  '504805-RTM-4','511324-KOP-3','511324-RTM-4','518863-BCN-5','518863-KOP-5',
  '518863-RTM-5','519509-KOP-3','519509-RTM-6','526647-KOP-3','526654-KOP-3',
  '526657-KOP-3','528981-KOP-4','528982-KOP-4','530969-KOP-2','530971-KOP-2',
  '530974-KOP-2','537161-KOP-3','537161-RTM-5','496381-RTM-3','515862-RTM-1',
  '525566-BCN-2','525566-KOP-4','525566-RTM-2','494846-KOP-3','494846-RTM-3',
  '494848-KOP-4','494848-RTM-7','494850-BCN-2','494850-KOP-6','494850-RTM-4',
  '497051-BCN-2','497051-KOP-4','497051-RTM-5','500552-BCN-2','500552-KOP-8',
  '500552-RTM-10','500552-RTM-11','500577-BCN-2','500577-KOP-4','500577-RTM-4',
  '507050-RTM-4','507050-RTM-5','507974-RTM-4','511324-BCN-2','511324-KOP-2',
  '536793-BCN-1','536793-KOP-2','536793-RTM-1','500096-RTM-10','494848-BCN-2',
  '496180-BCN-2','496180-KOP-3','496180-RTM-5','496180-RTM-7','508652-RTM-2',
  '500552-RTM-8','516901-KOP-1','516901-RTM-3','494829-RTM-5','504796-RTM-7',
  '511324-RTM-3','512396-BCN-4','512396-KOP-5','512396-RTM-6','514717-KOP-1',
  '514717-RTM-1','516497-KOP-1','516497-RTM-2','525566-KOP-2','537161-RTM-4',
  '539948-BCN-1','539948-KOP-1','539948-RTM-1','528025-RTM-2','495957-BCN-3',
  '495957-KOP-4','495957-RTM-3','509087-RTM-3','509369-RTM-3','513957-BCN-1',
  '513957-KOP-1','513957-RTM-1','515409-RTM-2','518249-KOP-2','519275-RTM-5',
  '520425-KOP-4','520432-KOP-4','525271-RTM-5','500553-BCN-3','500553-KOP-3',
  '500553-RTM-4','528862-RTM-2','532064-RTM-2','532065-RTM-2','500553-KOP-4',
  '500553-RTM-5','513957-KOP-2','494264-RTM-4','516623-RTM-1','500553-BCN-4',
  '512396-RTM-5','516623-RTM-4','516549-RTM-1','516549-BCN-1','518949-RTM-3',
  '516549-KOP-1','540509-BCN-1','517522-RTM-1','515607-RTM-1','515607-KOP-1',
  '515608-RTM-1','515608-KOP-1','519692-KOP-1','519692-RTM-1','515668-RTM-1',
  '515668-RTM-2','515668-KOP-1','515668-KOP-2','540521-RTM-1','540521-KOP-1',
  '540521-RTM-2','540521-KOP-2','540521-BCN-2','540521-BCN-1','540521-KOP-3',
  '540522-RTM-1','540522-KOP-1','540522-RTM-2','540522-KOP-2','540522-BCN-1',
  '540522-KOP-3','518805-BCN-1','518807-BCN-1','516018-RTM-1','516018-RTM-2',
  '516018-KOP-1','507704-BCN-4','507704-KOP-5','507705-BCN-4','507705-KOP-5',
  '507662-RTM-3','500552-RTM-9','515509-RTM-2','515862-RTM-4','540509-KOP-1',
  '540509-RTM-1','525144-RTM-2','532224-KOP-1','532224-RTM-1','532224-RTM-2',
  '515403-KOP-1','515400-KOP-1','515770-RTM-1','515771-RTM-1','500528-RTM-6',
  '500528-KOP-4','517374-RTM-1','515465-KOP-3','514140-KOP-1','515511-KOP-2',
  '544948-RTM-3','515465-RTM-2','495955-RTM-4','520365-KOP-4','520374-KOP-4',
  '525154-KOP-4','525154-RTM-6','525154-KOP-6','525154-RTM-7','495957-KOP-5',
  '493738-RTM-3','525154-RTM-9','525154-RTM-10','483902-KOP-4','487907-KOP-6',
  '487907-ANR-3','487907-KOP-5','487907-RTM-5','514889-KOP-1','514890-KOP-1',
  '514891-KOP-1','517016-KOP-1','517016-RTM-1','519895-KOP-3','519895-RTM-3',
  '540463-ANR-1','540463-KOP-1','540463-RTM-1','486232-ANR-3','486232-KOP-11',
  '486232-RTM-8','487754-KOP-9','487754-RTM-8','487754-ANR-3','487754-KOP-10',
  '487754-KOP-7','487754-KOP-8','487754-RTM-10','494215-ANR-2','494215-KOP-7',
  '494215-RTM-4','494215-KOP-8','494215-RTM-5','494817-KOP-4','494817-RTM-4',
  '495140-KOP-3','495140-RTM-3','496229-RTM-5','496229-KOP-5','496229-RTM-4',
  '496229-KOP-4','496278-KOP-4','496278-RTM-3','496278-KOP-3','514450-KOP-1',
  '514450-KOP-2','514450-RTM-1','515640-RTM-2','515640-KOP-2','515640-RTM-1',
  '515640-KOP-1','515671-KOP-2','515671-KOP-1','515671-RTM-1','515872-KOP-1',
  '515872-RTM-1','516653-KOP-2','516653-RTM-2','516653-ANR-1','516653-KOP-1',
  '516653-RTM-1','517291-KOP-4','517291-RTM-2','517291-ANR-1','517291-KOP-3',
  '517291-RTM-1','517291-KOP-1','517291-KOP-2','518478-KOP-4','518478-KOP-3',
  '518478-RTM-1','518478-RTM-3','518478-ANR-1','518478-KOP-2','518478-RTM-2',
  '518478-KOP-1','525250-ANR-1','525250-KOP-4','525250-RTM-4','525254-KOP-2',
  '525254-KOP-3','525254-KOP-4','525254-RTM-4','528628-KOP-2','528630-KOP-2',
  '528632-KOP-2','528634-KOP-2','528636-KOP-2','540711-RTM-5','540711-RTM-18',
  '540711-KOP-4','490511-RTM-7','490511-KOP-5','493803-ANR-2','493814-ANR-2',
  '493814-KOP-7','495037-ANR-2','495037-KOP-2','495037-KOP-3','495037-RTM-2',
  '495037-RTM-3','510963-KOP-1','510963-RTM-1','510968-RTM-1','510968-KOP-1',
  '514014-KOP-2','514014-RTM-1','514014-KOP-1','514225-ANR-1','514225-KOP-1',
  '514225-RTM-1','514340-KOP-1','514340-RTM-1','514340-KOP-2','514347-KOP-2',
  '514347-RTM-1','514347-KOP-1','514849-KOP-1','514849-RTM-2','514849-ANR-1',
  '514849-RTM-1','514849-KOP-2','515380-ANR-1','515380-RTM-1','515380-KOP-1',
  '516084-KOP-1','516084-RTM-1','516189-KOP-1','516189-RTM-1','514239-RTM-1',
  '516086-RTM-2','516086-RTM-1','522191-RTM-1','516856-RTM-1','516856-RTM 2',
  '516199-ANR-1','516199-KOP-1','516199-KOP-2','516199-RTM-1','516202-KOP-1',
  '516202-RTM-1','516218-KOP-1','516218-RTM-1','518716-RTM-1','518716-KOP-1',
  '515138-KOP-1','515139-KOP-1','515140-KOP-1','515141-KOP-1','515142-KOP-1',
  '515142-RTM-1','515143-KOP-1','514440-KOP-1','514440-KOP-2','514440-RTM-1',
  '514444-KOP-1','514444-KOP-2','514444-KOP-3','514444-KOP-4','514444-RTM-1',
  '516199-RTM-2','541068-KOP-2','541068-RTM-3','514445-KOP-1','514445-KOP-2',
  '514445-RTM-1','514446-KOP-1','514446-KOP-2','514446-RTM-1','514447-KOP-1',
  '514447-KOP-2','514447-RTM-1','514447-RTM-2','525414-KOP-2','525414-KOP-3',
  '525414-RTM-2','529446-KOP-1','529447-KOP-1','516478-KOP-1','516478-RTM-1',
  '516478-RTM-2','516608-ANR-1','516608-KOP-1','516608-KOP-2','516608-RTM-1',
  '515060-ANR-1','515060-KOP-1','515060-KOP-2','515060-RTM-1','515061-ANR-1',
  '515061-KOP-1','515061-KOP-2','515061-RTM-1','515062-ANR-1','515062-KOP-1',
  '515062-KOP-2','515062-RTM-1','515063-ANR-1','515063-RTM-1','515064-ANR-1',
  '515064-KOP-1','515064-KOP-2','515064-RTM-1','515065-ANR-1','515065-KOP-1',
  '515065-KOP-2','515065-RTM-1','515071-ANR-1','515071-KOP-1','515071-RTM-1',
  '515072-ANR-1','515072-KOP-1','515072-KOP-2','515072-RTM-1','525160-RTM-5',
  '525160-ANR-2','525160-KOP-4','525160-KOP-5','497001-KOP-4','497001-KOP-5',
  '497001-RTM-3','500555-KOP-1','500555-RTM-2','500555-RTM-3','500563-KOP-2',
  '500563-RTM-2','505245-KOP-4','505245-KOP-5','505245-RTM-3','505245-RTM-4',
  '500086-RTM-2','510976-KOP-2','510977-KOP-2','510978-KOP-2','510979-KOP-2',
  '510980-KOP-2','510981-KOP-2','523316-KOP-1','523316-RTM-1','523316-RTM-2',
  '525584-KOP-2','525584-KOP-3','525584-RTM-6','546416-KOP-1','546416-RTM-1',
  '520792-KOP-8','520792-KOP-9','520792-RTM-6','520792-RTM-7','518745-ANR-2',
  '518745-KOP-3','518745-KOP-4','518745-KOP-5','518745-RTM-4','518745-RTM-5',
  '524947-KOP-1','524947-RTM-1','524947-RTM-2','525769-KOP-6','525769-KOP-7',
  '525769-RTM-4','495820-KOP-5','495820-KOP-6','495820-RTM-8',
].map(s => s.trim()));
