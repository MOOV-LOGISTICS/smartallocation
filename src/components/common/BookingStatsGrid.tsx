import React from 'react';
import { Lang } from '../../App';
import { t } from '../../i18n';

interface BookingCounts {
  total: number;
  not_started: number;
  booked: number;
  overridden: number;
  exception: number;
  needs_action: number;
  accuracy: number;
}

interface BookingStatsGridProps {
  lang: Lang;
  counts: BookingCounts;
  filter: string;
  subFilter: string;
  setFilter: (f: string, sub?: string) => void;
}

export function BookingStatsGrid({ lang, counts, filter, subFilter, setFilter }: BookingStatsGridProps) {
  const cards = [
    { key: 'total',        filter: 'ALL',          sub: 'ALL', value: counts.total,        tone: 'total' },
    { key: 'not_started',  filter: 'NOT_STARTED',  sub: 'ALL', value: counts.not_started,  tone: 'not_started' },
    { key: 'needs_action', filter: 'NEEDS_ACTION', sub: 'ALL', value: counts.needs_action, tone: 'exception' },
    { key: 'booked',       filter: 'DONE',         sub: 'ALL', value: counts.booked,       tone: 'assigned' },
  ];

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {cards.map(c => {
        const isActive = filter === c.filter && subFilter === c.sub && c.filter !== 'ALL';
        return (
        <div
          key={c.key}
          data-tone={c.tone}
          className={`stat-card ${isActive ? 'active' : ''}`}
          onClick={() => isActive ? setFilter('ALL') : setFilter(c.filter, c.sub)}
        >
          <div className="stat-value">{c.value}</div>
          <div className="stat-label">{t(lang, 'bookingStats.' + c.key)}</div>
          <div className="stat-trend">{t(lang, 'bookingStats.trend.' + c.key)}</div>
        </div>
      );})}

      {/* Overridden card hidden — override feature deferred
      <div data-tone="overridden" className={`stat-card ${filter === 'MANUALLY_OVERRIDDEN' ? 'active' : ''}`}
        onClick={() => setFilter(filter === 'MANUALLY_OVERRIDDEN' ? 'ALL' : 'MANUALLY_OVERRIDDEN')}>
        <div className="stat-value">{overrideRate}%</div>
        <div className="stat-label">{t(lang, 'bookingStats.overridden')}</div>
        <div className="stat-trend">{t(lang, 'bookingStats.trend.overridden', { count: counts.overridden, total: counts.booked })}</div>
      </div> */}

      {/* Pre-assign Accuracy — display only, no filter */}
      <div data-tone="accuracy" className="stat-card stat-card-accuracy">
        <div className="stat-value" style={{ color: 'var(--accent)' }}>
          {counts.accuracy}<span style={{ fontSize: '0.6em', marginLeft: 1 }}>%</span>
        </div>
        <div className="stat-label">{t(lang, 'bookingStats.accuracy')}</div>
        <div className="stat-trend">{t(lang, 'bookingStats.trend.accuracy')}</div>
      </div>
    </div>
  );
}
