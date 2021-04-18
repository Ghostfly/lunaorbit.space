/*
  i18n tools
*/

import { configureLocalization } from '@lit/localize';
import {sourceLocale, targetLocales} from './locale-codes';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => import(`./locales/${locale}`),
});

export const setLocaleFromUrl = async (): Promise<void> => {
  const url = new URL(window.location.href);
  const locale = url.searchParams.get('locale') || sourceLocale;
  await setLocale(locale);
};
