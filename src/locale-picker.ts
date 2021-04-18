import {LitElement, html, TemplateResult, customElement} from 'lit-element';
import {getLocale, setLocale} from './localization';
import {allLocales} from './locale-codes';
import {Localized} from '@lit/localize/localized-element';

@customElement('locale-picker')
export class LocalePicker extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <div class="relative">
        <select
          @change=${this.localeChanged}
          class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
        >
          ${[...new Set(allLocales)].map(
            (locale) =>
              html`<option value=${locale} ?selected=${locale === getLocale()}>
                ${locale}
              </option>`
          )}
        </select>
        <span
          class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </div>
    `;
  }

  async localeChanged(event: Event): Promise<void> {
    const newLocale = (event.target as HTMLSelectElement).value;

    await setLocale(newLocale);

    document.querySelector('luna-orbit')?.refreshI18n();

    const url = new URL(document.location.href);
    url.searchParams.set('locale', newLocale);

    // Avoid refresh by using replaceState.
    window.history.replaceState({}, 'Luna Orbit | Staking', url.toString());

    document.documentElement.lang = newLocale;
  }
}
