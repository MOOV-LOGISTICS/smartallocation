import { Lang, t } from '../../i18n';

interface PageHeaderProps {
  lang: Lang;
  titleKey?: string;
  subtitleKey?: string;
}

export function PageHeader({ lang, titleKey = 'page.title', subtitleKey = 'page.subtitle' }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-title">{t(lang, titleKey)}</h1>
      <div className="page-subtitle">{t(lang, subtitleKey)}</div>
    </div>
  );
}