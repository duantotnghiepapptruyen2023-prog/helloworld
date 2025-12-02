import React, { createContext, useState, useEffect } from 'react';
import i18n from './i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('language') || 'vi');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cập nhật ngôn ngữ trong i18n
    setCurrentLang(lng);
    localStorage.setItem('language', lng); // Lưu vào localStorage
  };

  useEffect(() => {
    i18n.changeLanguage(currentLang); // Đồng bộ i18n với currentLang khi tải
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};