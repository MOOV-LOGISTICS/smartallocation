import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { Lang, PO } from '../../App';
import { t } from '../../i18n';

interface BookingExceptionDashboardProps {
  lang: Lang;
  exceptionPOs: PO[];
  openDrawer: (po: PO) => void;
  onResolve: (po: PO) => void;
}

export function BookingExceptionDashboard({ lang, exceptionPOs, openDrawer, onResolve }: BookingExceptionDashboardProps) {
  const stats = {
    todayNew: exceptionPOs.filter(p => p.exceptionAtStep && p.exceptionAtStep > 0).length,
    totalPending: exceptionPOs.length,
    avgResolution: 4.2,
    highPriority: exceptionPOs.filter(p => p.priority && p.priority >= 2).length,
  };

  return (
    <div className="page" style={{ paddingTop: '24px' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: '#0F2A3F' }}>{t(lang, 'nav.exception')}</h1>
        <p className="text-sm mt-1" style={{ color: '#3D6480' }}>Handle carrier booking exceptions and blocked lots</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="stat-card"
          style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#E6F0F7' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#004F7C' }} />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold" style={{ color: '#0F2A3F' }}>{stats.todayNew}</p>
              <p className="text-xs" style={{ color: '#3D6480' }}>{lang === 'zh' ? '今日新增' : "Today's New"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
          style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#B45309' }} />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold" style={{ color: '#0F2A3F' }}>{stats.totalPending}</p>
              <p className="text-xs" style={{ color: '#3D6480' }}>{lang === 'zh' ? '待处理' : 'Total Pending'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
          style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#E6F5F7' }}>
              <Clock className="w-5 h-5" style={{ color: '#007A8C' }} />
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold" style={{ color: '#0F2A3F' }}>{stats.avgResolution}h</p>
              <p className="text-xs" style={{ color: '#3D6480' }}>{lang === 'zh' ? '平均处理' : 'Avg Resolution'}</p>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PO No</th>
              <th>Lot</th>
              <th>Article</th>
              <th>Status</th>
              <th>Exception Step</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exceptionPOs.length === 0 ? (
              <tr><td colSpan={6} className="empty">No exception POs</td></tr>
            ) : (
              exceptionPOs.map(po => (
                <tr key={po.id} onClick={() => openDrawer(po)}>
                  <td className="mono">{po.poNo}</td>
                  <td className="mono">{po.lot}</td>
                  <td>{po.article}</td>
                  <td>
                    <span className="pill pill-exception">EXCEPTION</span>
                  </td>
                  <td className="mono">Step {po.exceptionAtStep || '-'}</td>
                  <td onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '12px' }}>
                    <button className="row-trigger danger" onClick={() => openDrawer(po)}>Review</button>
                    <button className="row-trigger primary" onClick={() => onResolve(po)}>Resolve</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
