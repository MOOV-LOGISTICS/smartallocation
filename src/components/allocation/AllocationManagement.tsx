import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, History } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Lang } from '../App';
import { t } from '../i18n';
import { VersionHistory } from './VersionHistory';

interface BookingMatrixRecord {
  id: string;
  originArea: string;
  originCountry: string;
  polCode: string;
  pol: string;
  destinationArea: string;
  podCode: string;
  pod: string;
  delCode: string;
  delCountry: string;
  delName: string;
  service: string;
  carrier: string;
  mot: string;
  serviceName: string;
  tsPort: string;
  transitTime: number;
  ctrType: string;
  award: number;
  assignment: number;
  keyLane: string;
  keyLaneType: string;
  keyLaneCtrSize: string;
  prio: number;
}

interface FNDRule {
  carrier: string;
  dwh: string;
  pod: string;
  fnd: string;
}

interface AllocationManagementProps {
  lang: Lang;
  bookingMatrixVersions: any[];
  setBookingMatrixVersions: (data: any[]) => void;
  fndRulesVersions: any[];
  setFndRulesVersions: (data: any[]) => void;
  earlyShipmentVersions: any[];
  setEarlyShipmentVersions: (data: any[]) => void;
  allocationUsage: Record<string, { preassign: number; booked: number }>;
  initialAllocation: Record<string, number>;
}

const tradeLanes = ['FEWB', 'TP', 'Short Sea', 'Export EU', 'Latam'];

export function AllocationManagement({
  lang,
  bookingMatrixVersions,
  setBookingMatrixVersions,
  fndRulesVersions,
  setFndRulesVersions,
  earlyShipmentVersions,
  setEarlyShipmentVersions,
  allocationUsage,
  initialAllocation
}: AllocationManagementProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'fnd' | 'quota' | 'early'>('quota');
  const [selectedLane, setSelectedLane] = useState<string>('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMatrix = bookingMatrixVersions.length > 0 ? bookingMatrixVersions[bookingMatrixVersions.length - 1].data : [];
  const currentFnd = fndRulesVersions.length > 0 ? fndRulesVersions[fndRulesVersions.length - 1].data : [];
  const currentEarly = earlyShipmentVersions.length > 0 ? earlyShipmentVersions[earlyShipmentVersions.length - 1].data : [];

  const tabs = [
    { key: 'quota', label: 'Allocation Available' },
    { key: 'matrix', label: 'Booking Matrix' },
    { key: 'fnd', label: 'FND Rules' },
    { key: 'early', label: 'Early Shipment' },
  ];

  const getQuotaColor = (value: number) => {
    if (value > 70) return { bg: '#D1FAE5', text: '#065F46' };
    if (value > 30) return { bg: '#FEF3C7', text: '#92400E' };
    return { bg: '#FEE2E2', text: '#991B1B' };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        if (jsonData.length < 2) {
          setUploadError('File is empty or invalid format.');
          return;
        }
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        const getValue = (row: any[], headerName: string) => {
          const index = headers.findIndex(h => h?.toString().trim() === headerName);
          return index >= 0 ? row[index] : undefined;
        };
        const records: BookingMatrixRecord[] = rows.slice(0, 100).map((row: any, index: number) => ({
          id: `bm-${Date.now()}-${index}`,
          originArea: getValue(row, 'Origin Area') || '',
          originCountry: getValue(row, 'Origin Country') || '',
          polCode: getValue(row, 'POL Code') || '',
          pol: getValue(row, 'POL') || '',
          destinationArea: getValue(row, 'Destination Area') || '',
          podCode: getValue(row, 'POD Code') || '',
          pod: getValue(row, 'POD') || '',
          delCode: getValue(row, 'DEL Code') || '',
          delCountry: getValue(row, 'DEL Country') || '',
          delName: getValue(row, 'DEL Name') || '',
          service: getValue(row, 'Service') || '',
          carrier: getValue(row, 'Carrier') || '',
          mot: getValue(row, 'MoT') || '',
          serviceName: getValue(row, 'Service Name') || '',
          tsPort: getValue(row, 'T/S Port') || '',
          transitTime: Number(getValue(row, 'Transit Time')) || 0,
          ctrType: getValue(row, 'Ctr Type') || '',
          award: Number(getValue(row, 'Award')) || 0,
          assignment: Number(getValue(row, 'Assignment')) || 0,
          keyLane: getValue(row, 'Key Lane') || '',
          keyLaneType: getValue(row, 'Key Lane + Type') || '',
          keyLaneCtrSize: getValue(row, 'Key Lane incl Ctr Size') || '',
          prio: Number(getValue(row, 'Prio')) || 0,
        }));
        const newVersion = {
          id: `v-${Date.now()}`,
          version: bookingMatrixVersions.length + 1,
          filename: file.name,
          uploader: 'z.dorothy',
          timestamp: new Date().toLocaleString(),
          data: records
        };
        setBookingMatrixVersions([...bookingMatrixVersions, newVersion]);
        setShowImportModal(false);
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setUploadError('Failed to parse Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFNDFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        if (jsonData.length < 2) {
          setUploadError('File is empty or invalid format.');
          return;
        }
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        const getValue = (row: any[], headerName: string) => {
          const index = headers.findIndex(h => h?.toString().trim() === headerName);
          return index >= 0 ? row[index] : undefined;
        };
        const records = rows.slice(0, 100).map((row: any) => ({
          carrier: getValue(row, 'CARRIER') || '',
          dwh: getValue(row, 'DWH') || '',
          pod: getValue(row, 'POD') || '',
          fnd: getValue(row, 'FND') || '',
        })).filter(r => r.carrier && r.dwh && r.pod && r.fnd);
        const newVersion = {
          id: `v-${Date.now()}`,
          version: fndRulesVersions.length + 1,
          filename: file.name,
          uploader: 'z.dorothy',
          timestamp: new Date().toLocaleString(),
          data: records
        };
        setFndRulesVersions([...fndRulesVersions, newVersion]);
        setShowImportModal(false);
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setUploadError('Failed to parse Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEarlyShipmentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        if (jsonData.length < 2) {
          setUploadError('File is empty or invalid format.');
          return;
        }
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        // Convert rows to array of objects for full rendering
        const fullData = rows.slice(0, 100).map((row: any) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        const newVersion = {
          id: `v-${Date.now()}`,
          version: earlyShipmentVersions.length + 1,
          filename: file.name,
          uploader: 'z.dorothy',
          timestamp: new Date().toLocaleString(),
          data: fullData
        };
        setEarlyShipmentVersions([...earlyShipmentVersions, newVersion]);
        setShowImportModal(false);
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setUploadError('Failed to parse Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === 'fnd') {
      handleFNDFileUpload(e);
    } else if (activeTab === 'early') {
      handleEarlyShipmentFileUpload(e);
    } else {
      handleFileUpload(e);
    }
  };

  const filteredMatrixData = useMemo(() => {
    if (selectedLane === 'All') return currentMatrix;
    return currentMatrix.filter(row => {
      const keyLaneUpper = row.keyLane?.toUpperCase() || '';
      if (selectedLane === 'FEWB') return keyLaneUpper.includes('FEWB') || keyLaneUpper.includes('CNSHA');
      if (selectedLane === 'TP') return keyLaneUpper.includes('TP') || keyLaneUpper.includes('LAX');
      if (selectedLane === 'Short Sea') return keyLaneUpper.includes('SHORT') || keyLaneUpper.includes('SIN');
      if (selectedLane === 'Export EU') return keyLaneUpper.includes('EU') || keyLaneUpper.includes('EXPORT');
      if (selectedLane === 'Latam') return keyLaneUpper.includes('LATAM') || keyLaneUpper.includes('BR');
      return true;
    });
  }, [currentMatrix, selectedLane]);

  return (
    <div className="page" style={{ paddingTop: '24px' }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Allocation Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Manage Booking Matrix, FND rules, allocation quotas</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'btn-primary'
                  : 'btn'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'matrix' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="btn flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setBookingMatrixVersions([])}
              className="btn"
            >
              Clear
            </button>
          </div>
        )}
        {activeTab === 'fnd' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import FND Rules
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="btn flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setFndRulesVersions([])}
              className="btn"
            >
              Clear
            </button>
          </div>
        )}
        {activeTab === 'early' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Early Shipment
            </button>
            <button
              onClick={() => setShowVersionHistory(true)}
              className="btn flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setEarlyShipmentVersions([])}
              className="btn"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {activeTab === 'matrix' && (
        <div className="table-wrap" style={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
          <div className="p-4 border-b flex gap-2" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setSelectedLane('All')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                selectedLane === 'All' ? 'btn-primary' : 'btn btn-sm'
              }`}
            >
              All
            </button>
            {tradeLanes.map(lane => (
              <button
                key={lane}
                onClick={() => setSelectedLane(lane)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  selectedLane === lane ? 'btn-primary' : 'btn btn-sm'
                }`}
              >
                {lane}
              </button>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>Origin Area</th>
                <th>Origin Country</th>
                <th>POL Code</th>
                <th>POL</th>
                <th>Destination Area</th>
                <th>POD Code</th>
                <th>POD</th>
                <th>Carrier</th>
                <th>Service</th>
                <th>MoT</th>
                <th>Ctr Type</th>
                <th>Award</th>
                <th>Assignment</th>
                <th>Key Lane</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrixData.length === 0 ? (
                <tr><td colSpan={14} className="empty">{currentMatrix.length === 0 ? 'No data imported' : 'No records match this trade lane'}</td></tr>
              ) : (
                filteredMatrixData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.originArea}</td>
                    <td>{row.originCountry}</td>
                    <td className="mono">{row.polCode}</td>
                    <td>{row.pol}</td>
                    <td>{row.destinationArea}</td>
                    <td className="mono">{row.podCode}</td>
                    <td>{row.pod}</td>
                    <td>{row.carrier}</td>
                    <td>{row.service}</td>
                    <td>{row.mot}</td>
                    <td>{row.ctrType}</td>
                    <td className="mono">{row.award}</td>
                    <td className="mono">{row.assignment}</td>
                    <td className="mono">{row.keyLane}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fnd' && (
        <div className="table-wrap" style={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>CARRIER</th>
                <th>DWH</th>
                <th>POD</th>
                <th>FND</th>
              </tr>
            </thead>
            <tbody>
              {currentFnd.length === 0 ? (
                <tr><td colSpan={4} className="empty">No FND rules imported</td></tr>
              ) : (
                currentFnd.map((rule, i) => (
                  <tr key={i}>
                    <td className="mono">{rule.carrier}</td>
                    <td className="mono">{rule.dwh}</td>
                    <td className="mono">{rule.pod}</td>
                    <td className="mono">{rule.fnd}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'quota' && (() => {
        const DISPLAY_WEEKS = ['20/26','21/26','22/26','23/26','24/26','25/26','26/26','27/26','28/26'];
        const CARRIER_LABEL: Record<string, string> = { HLCU: 'Hapag-Lloyd', CMDU: 'CMA CGM', TSHG: 'Tailwind', MSCU: 'MSC', MAEU: 'Maersk' };
        // Derive unique rows from INITIAL_ALLOCATION keys
        const rowSet = new Set<string>();
        Object.keys(initialAllocation).forEach(k => {
          const parts = k.split('|');
          if (parts.length === 4) rowSet.add(`${parts[0]}|${parts[1]}|${parts[2]}`);
        });
        const rows = Array.from(rowSet).sort();
        const getCell = (rowKey: string, week: string) => {
          const allocKey = `${rowKey}|${week}`;
          const initial = initialAllocation[allocKey] || 0;
          const usage = allocationUsage[allocKey] || { preassign: 0, booked: 0 };
          const consumed = usage.preassign + usage.booked;
          const available = Math.max(0, initial - consumed);
          return { initial, preassign: usage.preassign, booked: usage.booked, available };
        };
        const cellColor = (available: number, initial: number) => {
          if (initial === 0) return { bg: 'transparent', text: 'var(--text3)' };
          const pct = available / initial;
          if (pct >= 0.5) return { bg: '#D1FAE5', text: '#065F46' };
          if (pct >= 0.2) return { bg: '#FEF3C7', text: '#92400E' };
          return { bg: '#FEE2E2', text: '#991B1B' };
        };
        return (
          <div className="table-wrap" style={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>Carrier</th>
                  <th>POL Region</th>
                  <th>POD Region</th>
                  {DISPLAY_WEEKS.map(w => (
                    <th key={w} className="text-center" style={{ minWidth: 80 }}>W{w.split('/')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(rowKey => {
                  const [carrier, polReg, podReg] = rowKey.split('|');
                  return (
                    <tr key={rowKey}>
                      <td style={{ fontWeight: 500 }}>{CARRIER_LABEL[carrier] || carrier}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{polReg}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{podReg}</td>
                      {DISPLAY_WEEKS.map(w => {
                        const cell = getCell(rowKey, w);
                        const colors = cellColor(cell.available, cell.initial);
                        return (
                          <td key={w} style={{ padding: '4px 6px' }}>
                            {cell.initial > 0 ? (
                              <div
                                className="text-center rounded font-mono"
                                style={{ backgroundColor: colors.bg, color: colors.text, padding: '3px 6px', fontSize: 11, cursor: 'default' }}
                                title={`Initial: ${cell.initial} | Pre-assigned: ${cell.preassign} | Booked: ${cell.booked} | Available: ${cell.available}`}
                              >
                                {cell.available}
                                {cell.initial > 0 && <span style={{ opacity: 0.55, fontSize: 10 }}>/{cell.initial}</span>}
                              </div>
                            ) : (
                              <div className="text-center font-mono" style={{ color: 'var(--text3)', fontSize: 11 }}>—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}

      {activeTab === 'early' && (
        <div className="table-wrap" style={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
          <table>
            <thead>
              <tr>
                {currentEarly.length > 0 && Object.keys(currentEarly[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEarly.length === 0 ? (
                <tr><td colSpan={10} className="empty">No early shipment lots imported</td></tr>
              ) : (
                currentEarly.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="mono">{val}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-[500px] shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Import Excel File</h3>
              <button onClick={() => setShowImportModal(false)} style={{ color: 'var(--text2)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text3)' }} />
              <p className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Click to upload Excel file</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>Supports .xlsx format</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploadError && (
              <p className="text-sm mt-3 text-center" style={{ color: 'var(--danger)' }}>{uploadError}</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showVersionHistory && (
        <VersionHistory
          versions={
            activeTab === 'matrix' ? bookingMatrixVersions :
            activeTab === 'fnd' ? fndRulesVersions :
            earlyShipmentVersions
          }
          onClose={() => setShowVersionHistory(false)}
          onRestore={(version) => {
            if (activeTab === 'matrix') {
              setBookingMatrixVersions(prev => [...prev.filter(v => v.version <= version.version), version]);
            } else if (activeTab === 'fnd') {
              setFndRulesVersions(prev => [...prev.filter(v => v.version <= version.version), version]);
            } else {
              setEarlyShipmentVersions(prev => [...prev.filter(v => v.version <= version.version), version]);
            }
            setShowVersionHistory(false);
          }}
        />
      )}
    </div>
  );
}
