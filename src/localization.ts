import {configureLocalization, LocaleStatusEventDetail} from '@lit/localize';
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

// Re-render the application every time a new locale successfully loads.
export const listenerForLanguageChange = (event: CustomEvent<LocaleStatusEventDetail>): void => {
  if (event.detail.status === 'loading') {
    console.log(`Loading new locale: ${event.detail.loadingLocale}`);
  } else if (event.detail.status === 'ready') {
    console.log(`Loaded new locale: ${event.detail.readyLocale}`);
  } else if (event.detail.status === 'error') {
    console.error(
      `Error loading locale ${event.detail.errorLocale}: ` +
        event.detail.errorMessage
    );
  }
}