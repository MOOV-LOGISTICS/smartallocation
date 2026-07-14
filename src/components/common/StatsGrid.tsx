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
    needs_action: number;
    done: number;
  };
  filter: string;
  subFilter: string;
  setFilter: (filter: string, sub?: string) => void;
  isBooking?: boolean;
}

const STAT_DEFS = [
  { tone: 'total', countKey: 'total', labelKey: 'total', activeFilter: 'ALL', activeSub: 'ALL' },
  { tone: 'not_started', countKey: 'not_started', labelKey: 'not_started', activeFilter: 'NOT_STARTED', activeSub: 'ALL' },
  { tone: 'exception', countKey: 'needs_action', labelKey: 'needs_action', activeFilter: 'NEEDS_ACTION', activeSub: 'ALL' },
  { tone: 'assigned', countKey: 'done', labelKey: 'done', activeFilter: 'DONE', activeSub: 'ALL' },
] as const;

export function StatsGrid({ lang, counts, filter, subFilter, setFilter, isBooking }: StatsGridProps) {
  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {STAT_DEFS.map(s => {
        const trendKey = (isBooking ? 'bookingStats.trend.' : 'stats.trend.') + s.labelKey;
        const mainValue = counts[s.countKey as keyof typeof counts];
        const trendText = t(lang, trendKey);
        const isActive = filter === s.activeFilter && subFilter === s.activeSub && filter !== 'ALL';
        return (
          <div
            key={s.labelKey}
            data-tone={s.tone}
            className={`stat-card ${isActive ? 'active' : ''}`}
            onClick={() => isActive ? setFilter('ALL') : setFilter(s.activeFilter, s.activeSub)}
          >
            <div className="stat-value">{mainValue}</div>
            <div className="stat-label">{t(lang, (isBooking ? 'bookingStats.' : 'stats.') + s.labelKey)}</div>
            <div className="stat-trend">{trendText}</div>
          </div>
        );
      })}
    </div>
  );
}
