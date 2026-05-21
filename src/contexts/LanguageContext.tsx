import React, { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'zh';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'nav.allocation': 'Allocation Management',
    'nav.preAssign': 'Pre-Assign',
    'nav.exception': 'Exception',
    'nav.carrierBooking': 'Carrier Booking',
    'btn.import': 'Import',
    'modal.import.title': 'Import Data',
    'user.name': 'Zhang Wei',
    'user.email': 'zhang.wei@moov.com',
    'misc.langLabel': 'EN',
  },
  zh: {
    'nav.allocation': '配额管理',
    'nav.preAssign': '预分配',
    'nav.exception': '异常',
    'nav.carrierBooking': '承运商订舱',
    'btn.import': '导入',
    'modal.import.title': '导入数据',
    'user.name': '张伟',
    'user.email': 'zhang.wei@moov.com',
    'misc.langLabel': '中文',
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
