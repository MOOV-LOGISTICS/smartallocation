import React, { useEffect, useRef, useState } from 'react';
import { Lang, SavedView } from '../../App';
import { t } from '../../i18n';
import { IconClose, IconStar } from '../icons/index';

interface ViewTabsProps {
  lang: Lang;
  savedViews: SavedView[];
  activeViewId: string | null;
  allActive: boolean;           // pristine state → All LOTs tab highlighted
  canSave: boolean;             // something is filtered → "+" can save
  onSelectAll: () => void;
  onSelectView: (view: SavedView) => void;
  onDeleteView: (id: string) => void;
  onSaveView: (name: string) => void;
}

export function ViewTabs({
  lang,
  savedViews,
  activeViewId,
  allActive,
  canSave,
  onSelectAll,
  onSelectView,
  onDeleteView,
  onSaveView,
}: ViewTabsProps) {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (naming) inputRef.current?.focus();
  }, [naming]);

  useEffect(() => {
    if (!naming) return;
    const onDocClick = (e: MouseEvent) => {
      if (nameWrapRef.current && !nameWrapRef.current.contains(e.target as Node)) {
        setNaming(false);
        setName('');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [naming]);

  const submit = () => {
    if (!name.trim()) return;
    onSaveView(name.trim());
    setNaming(false);
    setName('');
  };

  return (
    <div className="view-tabs">
      <button
        className={`view-tab ${allActive ? 'active' : ''}`}
        onClick={onSelectAll}
      >
        {t(lang, 'views.allLots')}
      </button>
      {savedViews.map(v => (
        <button
          key={v.id}
          className={`view-tab ${activeViewId === v.id ? 'active' : ''}`}
          onClick={() => onSelectView(v)}
        >
          <IconStar />
          {v.name}
          <span
            className="view-tab-delete"
            title={t(lang, 'filterPanel.deleteView')}
            onClick={(e) => { e.stopPropagation(); onDeleteView(v.id); }}
          >
            <IconClose />
          </span>
        </button>
      ))}
      <div className="view-tab-add-wrap" ref={nameWrapRef}>
        {naming ? (
          <div className="view-tab-name-input">
            <input
              ref={inputRef}
              type="text"
              value={name}
              placeholder={t(lang, 'filterPanel.saveViewPlaceholder')}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') { setNaming(false); setName(''); }
              }}
            />
            <button className="view-tab-name-save" onClick={submit} disabled={!name.trim()}>
              {t(lang, 'filterPanel.saveView')}
            </button>
          </div>
        ) : (
          <button
            className="view-tab view-tab-add"
            title={canSave ? t(lang, 'views.saveHint') : t(lang, 'views.saveDisabledHint')}
            disabled={!canSave}
            onClick={() => setNaming(true)}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
