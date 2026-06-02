import { Lang } from '../../App';
import { t } from '../../i18n';

interface StatsGridProps {
  lang: Lang;
  counts: {
    total: number;
    not_started: number;
    assigned: number;
    overridden: number;
    on_hold: number;
    exception: number;
  };
  filter: string;
  setFilter: (filter: string) => void;
  isBooking?: boolean;
}

const STAT_DEFS = [
  { tone: 'total', countKey: 'total', activeFilter: 'ALL' },
  { tone: 'not_started', countKey: 'not_started', activeFilter: 'NOT_STARTED' },
  { tone: 'assigned', countKey: 'assigned', activeFilter: 'ASSIGNED' },
  { tone: 'on_hold', countKey: 'on_hold', activeFilter: 'ON_HOLD' },
  { tone: 'exception', countKey: 'exception', activeFilter: 'EXCEPTION' },
  // { tone: 'overridden', countKey: 'overridden', activeFilter: 'MANUALLY_OVERRIDDEN' },  // override hidden
] as const;

export function StatsGrid({ lang, counts, filter, setFilter, isBooking }: StatsGridProps) {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {STAT_DEFS.map(s => {
        const trendKey = (isBooking ? 'bookingStats.trend.' : 'stats.trend.') + s.tone;
        const mainValue = counts[s.countKey as keyof typeof counts];
        const trendText = t(lang, trendKey);
        return (
          <div
            key={s.tone}
            data-tone={s.tone}
            className={`stat-card ${filter === s.activeFilter && filter !== 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter(filter === s.activeFilter ? 'ALL' : s.activeFilter)}
          >
            <div className="stat-value">{mainValue}</div>
            <div className="stat-label">{t(lang, (isBooking ? 'bookingStats.' : 'stats.') + s.tone)}</div>
            <div className="stat-trend">{trendText}</div>
          </div>
        );
      })}
    </div>
  );
}