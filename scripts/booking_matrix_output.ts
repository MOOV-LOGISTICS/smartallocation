// Auto-generated from carrier_booking_matrix_copy.xlsx (FEWB sheet)
// POL mapping: CNNGB→CNNBO, CNQDG→CNTAO, CNXMG→CNXMN
// CNSHA and CNSWA entries are maintained manually in referenceData.ts
// Paste the entries below into the BOOKING_MATRIX array in src/data/referenceData.ts

// ===== XLSX-DERIVED ENTRIES (replace existing non-CNSHA/CNSWA entries) =====
  // BDCGP → BEANR (P1 first)
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'BEANR', podRegion: 'NEU', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX/DEX', transitDays: 35 },

  // BDCGP → ESBCN (P1 first)
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'MEDEX', transitDays: 55 },
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },

  // BDCGP → NLRTM (P1 first)
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'FAL3', transitDays: 46 },
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC', carrierCode: 'MSCU', service: 'CHITTAGONG FEEDER', transitDays: 42 },

  // BDCGP → SIKOP (P1 first)
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'BEX2', transitDays: 46 },
  { polCode: 'BDCGP', polRegion: 'BD', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },

  // CNNBO → ESBCN (P1 first)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'MEX', transitDays: 38 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE2', transitDays: 45 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'MSC', carrierCode: 'MSCU', service: 'LYNX', transitDays: 45 },

  // CNNBO → NLRTM (P1 first)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'FAL3', transitDays: 39 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'NE3', transitDays: 42 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC', carrierCode: 'MSCU', service: 'SILK SERVICE', transitDays: 45 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'COSCO', carrierCode: 'COSU', service: 'AEU3', transitDays: 35 },

  // CNNBO → SIKOP (P1 first)
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'BEX2', transitDays: 41 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNNBO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE1', transitDays: 50 },

  // CNTAO → ESBCN (P1 first)
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'MEX', transitDays: 48 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'MSC', carrierCode: 'MSCU', service: 'JADE SERVICE', transitDays: 56 },

  // CNTAO → NLRTM (P1 first)
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'FAL3', transitDays: 43 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'NE4', transitDays: 55 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC', carrierCode: 'MSCU', service: 'CONDOR SERVICE', transitDays: 48 },

  // CNTAO → SIKOP (P1 first)
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'BEX2', transitDays: 47 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNTAO', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE1', transitDays: 58 },

  // CNXMN → ESBCN (P1 first)
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'MEX', transitDays: 36 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE2', transitDays: 41 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'MSC', carrierCode: 'MSCU', service: 'CONDOR SERVICE', transitDays: 40 },

  // CNXMN → NLRTM (P1 first)
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'FAL3', transitDays: 42 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'NE3', transitDays: 43 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC', carrierCode: 'MSCU', service: 'CONDOR SERVICE', transitDays: 39 },

  // CNXMN → SIKOP (P1 first)
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'BEX2', transitDays: 38 },
  { polCode: 'CNXMN', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE1', transitDays: 53 },

  // CNYTN → ESBCN (P1 first)
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'MEX', transitDays: 35 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'SE2', transitDays: 37 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'ESBCN', podRegion: 'MED', carrier: 'MSC', carrierCode: 'MSCU', service: 'JADE SERVICE', transitDays: 37 },

  // CNYTN → NLRTM (P1 first)
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'FAL3', transitDays: 35 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'Hapag-Lloyd', carrierCode: 'HLCU', service: 'NE2', transitDays: 38 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'MSC', carrierCode: 'MSCU', service: 'SWAN', transitDays: 41 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'NLRTM', podRegion: 'NEU', carrier: 'COSCO', carrierCode: 'COSU', service: 'AEU5', transitDays: 35 },

  // CNYTN → SIKOP (P1 first)
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'CMA CGM', carrierCode: 'CMDU', service: 'BEX2', transitDays: 38 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'Tailwind', carrierCode: 'TSHG', service: 'PAX', transitDays: 35 },
  { polCode: 'CNYTN', polRegion: 'FAR EAST', podCode: 'SIKOP', podRegion: 'MED', carrier: 'MSC', carrierCode: 'MSCU', service: 'DRAGON', transitDays: 47 },
