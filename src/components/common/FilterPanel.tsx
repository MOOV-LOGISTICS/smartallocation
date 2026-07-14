import React, { useState } from 'react';
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

interface FilterPanelProps {
  lang: Lang;
  value: AttributeFilters;
  onChange: (f: AttributeFilters) => void;
  fieldOptions: FieldOptions;
  onClose: () => void;
  onSaveView: (name: string) => void;
}

const FIELD_DEFS: { key: keyof FieldOptions; labelKey: string }[] = [
  { key: 'carriers', labelKey: 'filterPanel.carrier' },
  { key: 'pols', labelKey: 'filterPanel.pol' },
  { key: 'pods', labelKey: 'filterPanel.pod' },
  { key: 'vessels', labelKey: 'filterPanel.vessel' },
  { key: 'suppliers', labelKey: 'filterPanel.supplier' },
];

export function FilterPanel({ lang, value, onChange, fieldOptions, onClose, onSaveView }: FilterPanelProps) {
  const [viewName, setViewName] = useState('');

  const toggleValue = (key: keyof FieldOptions, option: string) => {
    const current = value[key] || [];
    const next = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    onChange({ ...value, [key]: next });
  };

  const clearAll = () => {
    onChange({ carriers: [], pols: [], pods: [], vessels: [], suppliers: [], teuMin: undefined, teuMax: undefined });
  };

  const handleSave = () => {
    if (!viewName.trim()) return;
    onSaveView(viewName.trim());
    setViewName('');
  };

  return (
    <div className="filter-panel" onClick={e => e.stopPropagation()}>
      <div className="filter-panel-header">
        <span>{t(lang, 'filterPanel.title')}</span>
        <button className="filter-panel-close" onClick={onClose}><IconClose /></button>
      </div>
      <div className="filter-panel-body">
        {FIELD_DEFS.map(fd => (
          <div className="filter-panel-section" key={fd.key}>
            <div className="filter-panel-section-title">{t(lang, fd.labelKey)}</div>
            <div className="filter-panel-options">
              {fieldOptions[fd.key].length === 0 && (
                <span className="filter-panel-empty">—</span>
              )}
              {fieldOptions[fd.key].map(opt => (
                <label className="filter-panel-checkbox" key={opt}>
                  <input
                    type="checkbox"
                    checked={value[fd.key]?.includes(opt) || false}
                    onChange={() => toggleValue(fd.key, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="filter-panel-section">
          <div className="filter-panel-section-title">{t(lang, 'filterPanel.teu')}</div>
          <div className="filter-panel-teu-range">
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
      </div>
      <div className="filter-panel-footer">
        <button className="filter-panel-clear" onClick={clearAll}>{t(lang, 'filterPanel.clearAll')}</button>
        <div className="filter-panel-save">
          <input
            type="text"
            placeholder={t(lang, 'filterPanel.saveViewPlaceholder')}
            value={viewName}
            onChange={e => setViewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          />
          <button className="filter-panel-save-btn" onClick={handleSave} disabled={!viewName.trim()}>
            {t(lang, 'filterPanel.saveView')}
          </button>
        </div>
      </div>
    </div>
  );
}
