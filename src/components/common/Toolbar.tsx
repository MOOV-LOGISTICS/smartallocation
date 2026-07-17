import React from 'react';
import { Lang, AttributeFilters } from '../../App';
import { t } from '../../i18n';
import { IconSearch, IconPlay, IconClose } from '../icons/index';
import { FilterBar } from './FilterBar';

interface FieldOptions {
  carriers: string[];
  pols: string[];
  pods: string[];
  vessels: string[];
  suppliers: string[];
}

interface ToolbarProps {
  lang: Lang;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filter: string;
  setFilter: (f: string, sub?: string) => void;
  subFilter: string;
  setSubFilter: (s: string) => void;
  subCounts: Record<string, number>;
  selectedIds: Set<number>;
  batchRunning: boolean;
  handleBatchRun: () => void;
  handleSendToSmartMoov?: () => void;
  handleReschedule?: () => void;
  handleBatchResolve?: () => void;
  handleBatchRerun?: () => void;
  attributeFilters?: AttributeFilters;
  setAttributeFilters?: (f: AttributeFilters) => void;
  fieldOptions?: FieldOptions;
  optionCounts?: { [K in keyof FieldOptions]: Record<string, number> };
  isBooking?: boolean;
}

const RESOLVABLE_REASONS = ['SCHEDULE', 'NO_VESSEL', 'NO_SPACE'];

export function Toolbar({
  lang,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  subFilter,
  setSubFilter,
  subCounts,
  selectedIds,
  batchRunning,
  handleBatchRun,
  handleSendToSmartMoov,
  handleReschedule,
  handleBatchResolve,
  handleBatchRerun,
  attributeFilters,
  setAttributeFilters,
  fieldOptions,
  optionCounts,
  isBooking
}: ToolbarProps) {
  const subFilters = isBooking
    ? ['ALL', 'NO_SPACE', 'SUPPLIER']
    : ['ALL', 'SCHEDULE', 'NO_VESSEL', 'NO_SPACE', 'SUPPLIER', 'RESOLVED'];

  const hasAttributeFilters = !!attributeFilters && !!setAttributeFilters && !!fieldOptions;

  return (
    <>
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-search">
          <IconSearch className="search-icon" />
          <input
            type="text"
            placeholder={t(lang, 'search.placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
              }}
              title="Clear search"
            >
              <IconClose />
            </button>
          )}
        </div>
        {hasAttributeFilters && (
          <FilterBar
            lang={lang}
            value={attributeFilters!}
            onChange={setAttributeFilters!}
            fieldOptions={fieldOptions!}
            optionCounts={optionCounts}
          />
        )}
        {selectedIds.size > 0 && (
          <span className="selection-info">
            <b>{t(lang, 'selection', { n: selectedIds.size })}</b>
          </span>
        )}
      </div>
      {filter === 'DONE' && !isBooking && handleSendToSmartMoov ? (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {handleReschedule && (
            <button
              className="btn"
              onClick={handleReschedule}
              disabled={selectedIds.size === 0}
              style={selectedIds.size === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>
              </svg>
              {selectedIds.size > 0
                ? t(lang, 'btn.rescheduleN', { n: selectedIds.size })
                : t(lang, 'btn.reschedule')}
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSendToSmartMoov}
            disabled={selectedIds.size === 0}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
            {selectedIds.size > 0
              ? t(lang, 'btn.sendToSmartMoovN', { n: selectedIds.size })
              : t(lang, 'btn.sendToSmartMoov')}
          </button>
        </div>
      ) : filter === 'NEEDS_ACTION' && !isBooking && subFilter === 'RESOLVED' && handleBatchRerun ? (
        <button
          className="btn btn-primary"
          onClick={handleBatchRerun}
          disabled={selectedIds.size === 0 || batchRunning}
        >
          <IconPlay />
          {batchRunning
            ? t(lang, 'btn.running')
            : t(lang, 'btn.rerunSelected', { n: selectedIds.size })}
        </button>
      ) : filter === 'NEEDS_ACTION' && !isBooking && RESOLVABLE_REASONS.includes(subFilter) && handleBatchResolve ? (
        <button
          className="btn btn-primary"
          onClick={handleBatchResolve}
          disabled={selectedIds.size === 0}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {t(lang, 'btn.resolveSelected', { n: selectedIds.size })}
        </button>
      ) : filter !== 'NEEDS_ACTION' && (
        <button
          className="btn btn-orange"
          onClick={handleBatchRun}
          disabled={batchRunning}
        >
          <IconPlay />
          {batchRunning
            ? t(lang, 'btn.running')
            : selectedIds.size > 0
              ? t(lang, 'btn.runSelected', { n: selectedIds.size })
              : t(lang, 'btn.runAll')}
        </button>
      )}
    </div>
    {filter === 'NEEDS_ACTION' && (
      <div className="issue-type-bar">
        <span className="subfilter-label">{t(lang, 'excFilter.label')}</span>
        {subFilters.map(s => (
          <button
            key={s}
            className={`subfilter-chip ${subFilter === s ? 'active' : ''}`}
            onClick={() => setSubFilter(s)}
          >
            {t(lang, 'excFilter.' + s)}
            <span className="subfilter-count">{subCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>
    )}
    </>
  );
}
