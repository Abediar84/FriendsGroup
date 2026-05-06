import { useState, useEffect, createContext, useContext } from 'react';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';

const LanguageContext = createContext();

const translations = { en, ar };

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('lang', language);
    }, [language]);

    const t = (key, options) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        if (value === undefined || value === null) {
            if (options && typeof options === 'object' && options.defaultValue !== undefined) {
                return options.defaultValue;
            }
            if (typeof options === 'string') {
                return options;
            }
            return key;
        }
        if (options && typeof options === 'object') {
            let valStr = String(value);
            for (const [optKey, optVal] of Object.entries(options)) {
                valStr = valStr.replace(new RegExp(`{{\\s*${optKey}\\s*}}`, 'g'), optVal);
            }
            return valStr;
        }
        return value;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
