"""
Rebuild BOOKING_MATRIX from carrier_booking_matrix_copy.xlsx (FEWB sheet).
Outputs TypeScript BookingMatrixEntry[] constant to booking_matrix_output.ts.

POL mapping: CNNGB→CNNBO, CNQDG→CNTAO, CNXMG→CNXMN (xlsx → internal LOT codes)
"""
import pandas as pd
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
XLSX_PATH = os.path.join(SCRIPT_DIR, 'carrier_booking_matrix_copy.xlsx')
OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'booking_matrix_output.ts')

# POL code mapping: xlsx codes → internal LOT codes
POL_CODE_MAP = {
    'CNNGB': 'CNNBO',
    'CNQDG': 'CNTAO',
    'CNXMG': 'CNXMN',
    'CNYTN': 'CNYTN',
    'BDCGP': 'BDCGP',
    'CNSHA': 'CNSHA',
}

# POL region
POL_REGION_MAP = {
    'CNNBO': 'FAR EAST',
    'CNTAO': 'FAR EAST',
    'CNXMN': 'FAR EAST',
    'CNYTN': 'FAR EAST',
    'CNSHA': 'FAR EAST',
    'BDCGP': 'BD',
}

# POD region
POD_REGION_MAP = {
    'NLRTM': 'NEU',
    'BEANR': 'NEU',
    'SIKOP': 'MED',
    'ESBCN': 'MED',
}

# Carrier display name → SCAC
CARRIER_TO_SCAC = {
    'CMA CGM':     'CMDU',
    'Hapag-Lloyd': 'HLCU',
    'MSC':         'MSCU',
    'Tailwind':    'TSHG',
    'COSCO':       'COSU',
    'Maersk':      'MAEU',
}

# Source POLs to include (xlsx codes)
SOURCE_POLS = {'BDCGP', 'CNNGB', 'CNQDG', 'CNXMG', 'CNYTN'}
TARGET_PODS = {'NLRTM', 'BEANR', 'SIKOP', 'ESBCN'}


def clean_service(raw: str) -> str:
    """Normalise service name from xlsx."""
    if not isinstance(raw, str):
        return ''
    s = raw.strip()
    # Feeder + SERVICE → SERVICE
    s = re.sub(r'(?i)feeder\s*\+\s*', '', s).strip()
    # Strip trailing slashes, dashes, spaces
    s = re.sub(r'[-/\s]+$', '', s).strip()
    # BBX3NCMA-FAL3-- → FAL3  (take last meaningful part after known prefix pattern)
    m = re.match(r'^[A-Z0-9]+[-/]([A-Z0-9/]+)[-/]*$', s)
    if m:
        s = m.group(1).rstrip('/-')
    return s


def main():
    df = pd.read_excel(XLSX_PATH, sheet_name='FEWB')

    # Filter to our POLs and PODs
    mask = df['POL Code'].isin(SOURCE_POLS) & df['POD Code'].isin(TARGET_PODS)
    sub = df[mask].copy()

    # Map POL code
    sub['MappedPOL'] = sub['POL Code'].map(POL_CODE_MAP)

    # Deduplicate: one entry per (MappedPOL, POD Code, Carrier, Prio)
    # Take first occurrence (sorted by Prio then carrier)
    sub_sorted = sub.sort_values(['MappedPOL', 'POD Code', 'Prio', 'Carrier'])
    deduped = sub_sorted.drop_duplicates(subset=['MappedPOL', 'POD Code', 'Carrier', 'Prio'])

    # Sort: POL, POD, Prio, Carrier
    deduped = deduped.sort_values(['MappedPOL', 'POD Code', 'Prio', 'Carrier']).reset_index(drop=True)

    # Build TypeScript entries
    lines = []
    current_lane = None

    for _, row in deduped.iterrows():
        pol = row['MappedPOL']
        pod = row['POD Code']
        carrier = row['Carrier']
        prio = int(row['Prio'])
        svc_raw = row['Service Name']
        tt = row['Transit Time']
        transit = int(round(tt)) if pd.notna(tt) else 35

        pol_region = POL_REGION_MAP.get(pol, 'FAR EAST')
        pod_region = POD_REGION_MAP.get(pod, 'NEU')
        carrier_code = CARRIER_TO_SCAC.get(carrier, carrier.upper()[:4])
        service = clean_service(svc_raw)

        lane = (pol, pod)
        if lane != current_lane:
            if current_lane is not None:
                lines.append('')
            lines.append(f'  // {pol} → {pod} (P{prio} first)')
            current_lane = lane

        line = (
            f"  {{ polCode: '{pol}', polRegion: '{pol_region}', "
            f"podCode: '{pod}', podRegion: '{pod_region}', "
            f"carrier: '{carrier}', carrierCode: '{carrier_code}', "
            f"service: '{service}', transitDays: {transit} }},"
        )
        lines.append(line)

    ts_content = '// Auto-generated from carrier_booking_matrix_copy.xlsx (FEWB sheet)\n'
    ts_content += '// POL mapping: CNNGB→CNNBO, CNQDG→CNTAO, CNXMG→CNXMN\n'
    ts_content += '// CNSHA and CNSWA entries are maintained manually in referenceData.ts\n'
    ts_content += '// Paste the entries below into the BOOKING_MATRIX array in src/data/referenceData.ts\n\n'
    ts_content += '// ===== XLSX-DERIVED ENTRIES (replace existing non-CNSHA/CNSWA entries) =====\n'
    ts_content += '\n'.join(lines)
    ts_content += '\n'

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f'Written {len(deduped)} entries to {OUTPUT_PATH}')
    print()
    # Print summary
    for (pol, pod), grp in deduped.groupby(['MappedPOL', 'POD Code']):
        carriers = ', '.join(f'P{int(r.Prio)} {r.Carrier}' for _, r in grp.iterrows())
        print(f'  {pol} → {pod}: {carriers}')


if __name__ == '__main__':
    main()
