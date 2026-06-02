import React, { useState, useEffect } from 'react';
import { PO, Lang } from '../../App';
import { t } from '../../i18n';
import { StatusPill } from '../common/StatusPill';
import { IconPlay, IconAlert, IconList } from '../icons/index';
import { dateWithWeek, weekWithDate } from '../../utils/dateFormat';

interface POTableProps {
  lang: Lang;
  filtered: PO[];
  selectedIds: Set<number>;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  openDrawer: (po: PO) => void;
  runPreAssignLive: (po: PO) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function POTable({
  lang,
  filtered,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  openDrawer,
  runPreAssignLive
}: POTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, filtered.length);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const eligibleIds = filtered.filter(p => p.status === 'NOT_STARTED').map(p => p.id);
  const allSelected = eligibleIds.length > 0 && selectedIds.size === eligibleIds.length;

  function pageButtons() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '…', totalPages];
    if (currentPage >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  }

  return (
    <div>
      <div className="table-wrap">
        <table>
          <colgroup>
            <col style={{ width: 36 }} />   {/* checkbox */}
            <col style={{ width: 138 }} />  {/* moovRef / LOT / supplier */}
            <col style={{ width: 106 }} />  {/* LANE */}
            <col style={{ width: 72 }} />   {/* TEU / CTR */}
            <col style={{ width: 140 }} />  {/* CRD·FOB·LDD */}
            <col style={{ width: 174 }} />  {/* CARRIER+VESSEL+DATES */}
            <col style={{ width: 88 }} />   {/* STATUS */}
            <col style={{ width: 48 }} />   {/* actions */}
          </colgroup>
          <thead>
            <tr>
              <th className="col-check">
                <span
                  className={`checkbox ${allSelected ? 'checked' : ''}`}
                  onClick={toggleSelectAll}
                />
              </th>
              <th>{t(lang, 'table.moovRef')}</th>
              <th>{t(lang, 'table.lane')}</th>
              <th><div>{t(lang, 'table.teu')}</div><div style={{ fontWeight: 400, color: 'var(--text3)', marginTop: 1 }}>{t(lang, 'table.ctrType')}</div></th>
              <th>{t(lang, 'table.crdFob')}</th>
              <th>{t(lang, 'table.vesselDates')}</th>
              <th>{t(lang, 'table.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">
                  {t(lang, 'table.empty')}
                </td>
              </tr>
            ) : (
              paginated.map(po => (
                <tr
                  key={po.id}
                  className={selectedIds.has(po.id) ? 'selected' : ''}
                >
                  <td className="col-check">
                    {po.status === 'NOT_STARTED' && (
                      <span
                        className={`checkbox ${selectedIds.has(po.id) ? 'checked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleSelect(po.id); }}
                      />
                    )}
                  </td>
                  {/* MOOV's Ref + LOT + Supplier */}
                  <td>
                    <div className="po-id" style={{ fontSize: 11 }}>{po.moovRef || '—'}</div>
                    <div className="po-sub font-mono font-semibold" style={{ color: 'var(--text1)', marginTop: 1 }}>{po.lot}</div>
                  </td>
                  {/* LANE — POL → POD combined */}
                  <td>
                    <div className="lane" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span>{po.pol}</span>
                      <span style={{ color: 'var(--text3)', fontSize: 10 }}>→</span>
                      <span>{po.pod}</span>
                    </div>
                  </td>
                  {/* TEU + CTR stacked — two lines, no operator */}
                  <td>
                    <div><span className="ctr-badge">{po.teu}</span><span className="po-sub" style={{ marginLeft: 3 }}>TEU</span></div>
                    <div style={{ marginTop: 2 }}><span className="ctr-badge">{po.ctrType || po.ctr}</span></div>
                  </td>
                  {/* CRD · FOB · LDD */}
                  <td className="mono" style={{ fontSize: 11 }}>
                    <div>CRD {dateWithWeek(po.crd)}</div>
                    <div style={{ color: 'var(--text3)' }}>FOB {weekWithDate(po.fobWeek)}</div>
                    <div style={{ color: 'var(--text3)' }}>LDD {dateWithWeek(po.ldd)}</div>
                  </td>
                  {/* VESSEL + DATES — carrier/vessel/voyage + ETD/ETA/PETA combined */}
                  <td>
                    {po.carrier ? (
                      <>
                        <div className="carrier-name">
                          {po.carrier} <span>· {po.service}</span>
                        </div>
                        <div className="po-sub">{po.vessel} · {po.voyage}</div>
                        {po.etd && (
                          <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                            ETD {po.etd}{po.eta ? `  ETA ${po.eta}` : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="no-carrier">{t(lang, 'table.noCarrier')}</span>
                    )}
                  </td>
                  <td>
                    <StatusPill status={po.status} lang={lang} isBooking={false} />
                  </td>
                  <td className="row-actions">
                    {po.status === 'NOT_STARTED' && (
                      <button
                        className="row-trigger primary"
                        onClick={() => runPreAssignLive(po)}
                      >
                        <IconPlay /> {t(lang, 'btn.runSingle')}
                      </button>
                    )}
                    {po.status === 'EXCEPTION' && (
                      <button
                        className="row-trigger danger"
                        onClick={() => openDrawer(po)}
                      >
                        <IconAlert /> {t(lang, 'btn.review')}
                      </button>
                    )}
                    {(po.status === 'ASSIGNED' || po.status === 'ON_HOLD') && (
                      <button
                        className="row-trigger"
                        onClick={() => openDrawer(po)}
                      >
                        <IconList /> {t(lang, 'btn.trace')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      {filtered.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-left">
            <select
              className="pagination-select"
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <option key={n} value={n}>
                  {t(lang, 'pagination.perPage', { n })}
                </option>
              ))}
            </select>
          </div>
          <div className="pagination-center">
            {t(lang, 'pagination.showing', { from, to, total: filtered.length })}
          </div>
          <div className="pagination-right">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >‹</button>
            {pageButtons().map((btn, i) =>
              btn === '…'
                ? <span key={`e${i}`} className="page-ellipsis">…</span>
                : <button
                    key={btn}
                    className={`page-btn${currentPage === btn ? ' active' : ''}`}
                    onClick={() => setCurrentPage(btn as number)}
                  >{btn}</button>
            )}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >›</button>
          </div>
        </div>
      )}
    </div>
  );
}
