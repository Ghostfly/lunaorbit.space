import {LitElement, html, TemplateResult} from 'lit-element';
import {getLocale, setLocale} from './localization';
import {allLocales} from './locale-codes';
import {Localized} from '@lit/localize/localized-element';

export class LocalePicker extends Localized(LitElement) {
  render(): TemplateResult {
    return html`
      <select @change=${this.localeChanged}>
        ${allLocales.map(
          (locale) =>
            html`<option value=${locale} ?selected=${locale === getLocale()}>
              ${locale}
            </option>`
        )}
      </select>
    `;
  }

  async localeChanged(event: Event): Promise<void> {
    const newLocale = (event.target as HTMLSelectElement).value;

    await setLocale(newLocale);
    console.warn('changed locale', newLocale);
  }
}
customElements.define('locale-picker', LocalePicker);