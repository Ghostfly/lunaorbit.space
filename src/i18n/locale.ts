import {configureTransformLocalization} from '@lit/localize';

const sourceLocale = 'en';

export const {getLocale} = configureTransformLocalization({
  sourceLocale,
});
