/*
  i18n tools
*/

import {configureLocalization} from '@lit/localize';
import {sourceLocale, targetLocales} from './locale-codes';

import getUserLocale from 'get-user-locale';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => import(`./locales/${locale}`),
});

export const setLocaleFromUrl = async (): Promise<void> => {
  const navigatorLanguage = getUserLocale();

  const deducedLanguage = navigatorLanguage.split('-')[0];
  const url = new URL(window.location.href);
  const locale =
    url.searchParams.get('locale') || sourceLocale || deducedLanguage;

  await setLocale(locale);
};
