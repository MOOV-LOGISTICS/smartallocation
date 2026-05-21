import React from 'react';
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

export function POTable({
  lang,
  filtered,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  openDrawer,
  runPreAssignLive
}: POTableProps) {
  const eligibleIds = filtered.filter(p => p.status === 'NOT_STARTED').map(p => p.id);
  const allSelected = eligibleIds.length > 0 && selectedIds.size === eligibleIds.length;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th className="col-check">
              <span
                className={`checkbox ${allSelected ? 'checked' : ''}`}
                onClick={toggleSelectAll}
              />
            </th>
            <th>{t(lang, 'table.moovRef')}</th>
            <th>{t(lang, 'table.article')}</th>
            <th>{t(lang, 'table.pol')}</th>
            <th>{t(lang, 'table.pod')}</th>
            <th>{t(lang, 'table.teu')}</th>
            <th>{t(lang, 'table.ctrType')}</th>
            <th>{t(lang, 'table.crdFob')}</th>
            <th>{t(lang, 'table.carrier')}</th>
            <th>{t(lang, 'table.etdEta')}</th>
            <th>{t(lang, 'table.status')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={12} className="empty">
                {t(lang, 'table.empty')}
              </td>
            </tr>
          ) : (
            filtered.map(po => (
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
                {/* MOOV's Ref + LOT merged */}
                <td>
                  <div className="po-id" style={{ fontSize: 11 }}>{po.moovRef || '—'}</div>
                  <div className="po-sub font-mono font-semibold" style={{ color: 'var(--text1)', marginTop: 1 }}>{po.lot}</div>
                </td>
                {/* Article */}
                <td style={{ maxWidth: 220 }}>
                  <div className="article-name">{po.article}</div>
                  <div className="po-sub">
                    {t(lang, 'table.ianSupplier', { ian: po.ian, supplier: po.supplier })}
                  </div>
                </td>
                {/* POL — separate column */}
                <td>
                  <div className="lane"><span>{po.pol}</span></div>
                </td>
                {/* POD — separate column */}
                <td>
                  <div className="lane"><span>{po.pod}</span></div>
                </td>
                {/* Planned TEU */}
                <td className="mono" style={{ textAlign: 'right' }}>
                  <span className="ctr-badge">{po.teu}</span>
                </td>
                {/* Ctr Type */}
                <td>
                  <span className="ctr-badge">{po.ctrType || po.ctr}</span>
                </td>
                {/* CRD · FOB · LDD */}
                <td className="mono" style={{ fontSize: 11 }}>
                  <div>CRD {dateWithWeek(po.crd)}</div>
                  <div style={{ color: 'var(--text3)' }}>FOB {weekWithDate(po.fobWeek)}</div>
                  <div style={{ color: 'var(--text3)' }}>LDD {dateWithWeek(po.ldd)}</div>
                </td>
                {/* Carrier / Vessel / Voyage */}
                <td>
                  {po.carrier ? (
                    <>
                      <div className="carrier-name">
                        {po.carrier} <span>· {po.service}</span>
                      </div>
                      <div className="po-sub">{po.vessel} · {po.voyage}</div>
                    </>
                  ) : (
                    <span className="no-carrier">{t(lang, 'table.noCarrier')}</span>
                  )}
                </td>
                {/* ETD / ETA / PETA */}
                <td className="mono" style={{ fontSize: 11 }}>
                  {po.etd ? (
                    <>
                      <div>ETD {dateWithWeek(po.etd)}</div>
                      <div style={{ color: 'var(--text3)' }}>ETA {dateWithWeek(po.eta)}</div>
                      {po.peta && <div style={{ color: 'var(--text3)' }}>PETA {dateWithWeek(po.peta)}</div>}
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
  );
}
