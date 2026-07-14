import React, { useEffect, useRef, useState } from 'react';
import { Lang, AttributeFilters, SavedView } from '../../App';
import { t } from '../../i18n';
import { IconSearch, IconPlay, IconClose, IconFilter, IconStar } from '../icons/index';
import { FilterPanel } from './FilterPanel';

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
  handleBatchResolve?: () => void;
  handleBatchRerun?: () => void;
  attributeFilters?: AttributeFilters;
  setAttributeFilters?: (f: AttributeFilters) => void;
  fieldOptions?: FieldOptions;
  savedViews?: SavedView[];
  onSaveView?: (name: string) => void;
  onApplyView?: (view: SavedView) => void;
  onDeleteView?: (id: string) => void;
  isBooking?: boolean;
}

const RESOLVABLE_REASONS = ['SCHEDULE', 'NO_VESSEL', 'NO_SPACE'];

const FIELD_LABEL_KEYS: { key: keyof FieldOptions; labelKey: string }[] = [
  { key: 'carriers', labelKey: 'filterPanel.carrier' },
  { key: 'pols', labelKey: 'filterPanel.pol' },
  { key: 'pods', labelKey: 'filterPanel.pod' },
  { key: 'vessels', labelKey: 'filterPanel.vessel' },
  { key: 'suppliers', labelKey: 'filterPanel.supplier' },
];

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
  handleBatchResolve,
  handleBatchRerun,
  attributeFilters,
  setAttributeFilters,
  fieldOptions,
  savedViews,
  onSaveView,
  onApplyView,
  onDeleteView,
  isBooking
}: ToolbarProps) {
  const subFilters = isBooking
    ? ['ALL', 'NO_SPACE', 'SUPPLIER']
    : ['ALL', 'SCHEDULE', 'NO_VESSEL', 'NO_SPACE', 'SUPPLIER', 'RESOLVED'];

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const filterWrapRef = useRef<HTMLDivElement>(null);

  const hasAttributeFilters = !!attributeFilters && !!setAttributeFilters && !!fieldOptions;

  const activeFieldCount = hasAttributeFilters
    ? FIELD_LABEL_KEYS.filter(fd => (attributeFilters![fd.key] || []).length > 0).length
      + (attributeFilters!.teuMin !== undefined || attributeFilters!.teuMax !== undefined ? 1 : 0)
    : 0;

  useEffect(() => {
    if (!filterPanelOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [filterPanelOpen]);

  const clearField = (key: keyof FieldOptions) => {
    if (!attributeFilters || !setAttributeFilters) return;
    setAttributeFilters({ ...attributeFilters, [key]: [] });
  };

  const clearTeu = () => {
    if (!attributeFilters || !setAttributeFilters) return;
    setAttributeFilters({ ...attributeFilters, teuMin: undefined, teuMax: undefined });
  };

  return (
    <>
      {savedViews && savedViews.length > 0 && onApplyView && onDeleteView && (
        <div className="views-bar">
          {savedViews.map(v => (
            <div key={v.id} className="view-chip" onClick={() => onApplyView(v)}>
              <IconStar />
              {v.name}
              <button
                className="view-chip-delete"
                onClick={(e) => { e.stopPropagation(); onDeleteView(v.id); }}
                title={t(lang, 'filterPanel.deleteView')}
              >
                <IconClose />
              </button>
            </div>
          ))}
        </div>
      )}
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
            <div className="filters-btn-wrap" ref={filterWrapRef}>
              <button
                type="button"
                className={`filters-btn ${activeFieldCount > 0 ? 'active' : ''}`}
                onClick={() => setFilterPanelOpen(o => !o)}
              >
                <IconFilter />
                {t(lang, 'filterPanel.button')}
                {activeFieldCount > 0 && <span className="filter-count-badge">{activeFieldCount}</span>}
              </button>
              {filterPanelOpen && (
                <FilterPanel
                  lang={lang}
                  value={attributeFilters!}
                  onChange={setAttributeFilters!}
                  fieldOptions={fieldOptions!}
                  onClose={() => setFilterPanelOpen(false)}
                  onSaveView={(name) => { onSaveView && onSaveView(name); setFilterPanelOpen(false); }}
                />
              )}
            </div>
          )}
          {hasAttributeFilters && FIELD_LABEL_KEYS.map(fd => (
            (attributeFilters![fd.key] || []).length > 0 && (
              <span className="applied-filter-chip" key={fd.key}>
                {t(lang, fd.labelKey)}: {attributeFilters![fd.key].join(', ')}
                <button onClick={() => clearField(fd.key)}><IconClose /></button>
              </span>
            )
          ))}
          {hasAttributeFilters && (attributeFilters!.teuMin !== undefined || attributeFilters!.teuMax !== undefined) && (
            <span className="applied-filter-chip">
              {t(lang, 'filterPanel.teu')}: {attributeFilters!.teuMin ?? 0}–{attributeFilters!.teuMax ?? '∞'}
              <button onClick={clearTeu}><IconClose /></button>
            </span>
          )}
          {filter === 'NEEDS_ACTION' && (
            <div className="subfilter-inline">
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
          {selectedIds.size > 0 && (
            <span className="selection-info">
              <b>{t(lang, 'selection', { n: selectedIds.size })}</b>
            </span>
          )}
        </div>
        {filter === 'DONE' && !isBooking && handleSendToSmartMoov ? (
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
    </>
  );
}
