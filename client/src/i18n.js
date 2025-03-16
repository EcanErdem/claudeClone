import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json'; 
import trTranslation from './locales/tr.json'; 

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    tr: { translation: trTranslation },
  },
  lng: 'en', // Varsayılan dil
  fallbackLng: 'en', // Eğer seçilen dilde çeviri bulunmazsa
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
