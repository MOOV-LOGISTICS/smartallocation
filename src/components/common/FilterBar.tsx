import React, { useEffect, useRef, useState } from 'react';
import { Lang, AttributeFilters } from '../../App';
import { t } from '../../i18n';
import { IconClose } from '../icons/index';

interface FieldOptions {
  carriers: string[];
  pols: string[];
  pods: string[];
  vessels: string[];
  suppliers: string[];
}

interface FilterBarProps {
  lang: Lang;
  value: AttributeFilters;
  onChange: (f: AttributeFilters) => void;
  fieldOptions: FieldOptions;
}

const FACETS: { key: keyof FieldOptions; labelKey: string }[] = [
  { key: 'carriers', labelKey: 'filterPanel.carrier' },
  { key: 'pols', labelKey: 'filterPanel.pol' },
  { key: 'pods', labelKey: 'filterPanel.pod' },
  { key: 'vessels', labelKey: 'filterPanel.vessel' },
  { key: 'suppliers', labelKey: 'filterPanel.supplier' },
];

export function FilterBar({ lang, value, onChange, fieldOptions }: FilterBarProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openKey) return;
    const onDocClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openKey]);

  const toggleValue = (key: keyof FieldOptions, option: string) => {
    const current = value[key] || [];
    const next = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    onChange({ ...value, [key]: next });
  };

  const teuActive = value.teuMin !== undefined || value.teuMax !== undefined;
  const anyActive = FACETS.some(f => (value[f.key] || []).length > 0) || teuActive;

  const clearAll = () => {
    onChange({ carriers: [], pols: [], pods: [], vessels: [], suppliers: [], teuMin: undefined, teuMax: undefined });
    setOpenKey(null);
  };

  return (
    <div className="facet-bar" ref={barRef}>
      {FACETS.map(f => {
        const count = (value[f.key] || []).length;
        return (
          <FacetDropdown
            key={f.key}
            label={t(lang, f.labelKey)}
            count={count}
            open={openKey === f.key}
            onToggleOpen={() => setOpenKey(openKey === f.key ? null : f.key)}
            options={fieldOptions[f.key]}
            selected={value[f.key] || []}
            onToggleValue={(opt) => toggleValue(f.key, opt)}
            searchPlaceholder={t(lang, 'filterPanel.search')}
          />
        );
      })}

      {/* TEU range facet */}
      <div className="facet-wrap">
        <button
          className={`facet-pill ${teuActive ? 'active' : ''}`}
          onClick={() => setOpenKey(openKey === 'teu' ? null : 'teu')}
        >
          {t(lang, 'filterPanel.teu')}
          {teuActive && <span className="facet-count">{value.teuMin ?? 0}–{value.teuMax ?? '∞'}</span>}
          <span className="facet-chevron">▾</span>
        </button>
        {openKey === 'teu' && (
          <div className="facet-pop">
            <div className="facet-teu-range">
              <input
                type="number"
                min={0}
                placeholder={t(lang, 'filterPanel.teuMin')}
                value={value.teuMin ?? ''}
                onChange={e => onChange({ ...value, teuMin: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
              <span>–</span>
              <input
                type="number"
                min={0}
                placeholder={t(lang, 'filterPanel.teuMax')}
                value={value.teuMax ?? ''}
                onChange={e => onChange({ ...value, teuMax: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
            </div>
          </div>
        )}
      </div>

      {anyActive && (
        <button className="facet-clear" onClick={clearAll}>
          <IconClose /> {t(lang, 'filterPanel.clearAll')}
        </button>
      )}
    </div>
  );
}

interface FacetDropdownProps {
  label: string;
  count: number;
  open: boolean;
  onToggleOpen: () => void;
  options: string[];
  selected: string[];
  onToggleValue: (option: string) => void;
  searchPlaceholder: string;
}

function FacetDropdown({
  label,
  count,
  open,
  onToggleOpen,
  options,
  selected,
  onToggleValue,
  searchPlaceholder,
}: FacetDropdownProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      inputRef.current?.focus();
    }
  }, [open]);

  const visible = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="facet-wrap">
      <button className={`facet-pill ${count > 0 ? 'active' : ''}`} onClick={onToggleOpen}>
        {label}
        {count > 0 && <span className="facet-count">{count}</span>}
        <span className="facet-chevron">▾</span>
      </button>
      {open && (
        <div className="facet-pop">
          {options.length > 6 && (
            <input
              ref={inputRef}
              type="text"
              className="facet-search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          )}
          <div className="facet-options">
            {visible.length === 0 && <span className="facet-empty">—</span>}
            {visible.map(opt => (
              <label className="facet-option" key={opt}>
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onToggleValue(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
