import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import Storage from '@react-native-async-storage/async-storage';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import translations from '../constants/translations/';
import {ITranslate} from '../constants/types';

// Create a new i18n instance
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const TranslationContext = React.createContext({});

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState('en');

  // Set the locale for the i18n instance
  i18n.locale = locale;

  const t = useCallback(
    (scope: string | string[], options?: object) => {
      return i18n.translate(scope, {...options, locale});
    },
    [locale],
  );

  // get locale from storage
  const getLocale = useCallback(async () => {
    // get preferance gtom storage
    const localeJSON = await Storage.getItem('locale');

    // set Locale / compare if has updated
    setLocale(localeJSON !== null ? localeJSON : Localization.locale);
  }, [setLocale]);

  useEffect(() => {
    getLocale();
  }, [getLocale]);

  useEffect(() => {
    // save preferance to storage
    Storage.setItem('locale', locale);
  }, [locale]);

  const contextValue = {
    t,
    locale,
    setLocale,
    translate: t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

/*
 * useTranslation hook based on i18n-js
 * Source: https://github.com/fnando/i18n-js
 */
export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;
