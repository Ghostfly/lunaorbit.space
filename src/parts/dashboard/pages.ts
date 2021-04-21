import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

import { systemPages } from './menus';

/**
 * Pages component
 */
@customElement('website-pages')
export class WebsitePages extends Localized(LitElement) {
  @property({ type: String })
  public lang = 'en';

  @property({ type: String })
  public page = 'staking';

  @internalProperty()
  private _files: { name: string; url: string; }[] = [];

  createRenderRoot(): this {
    return this;
  }

  async loadFiles(): Promise<void> {
    this._files = systemPages;
  }

  async firstUpdated(): Promise<void> {
    await this.loadFiles();
  }

  public get editedPage(): string {
    return `page-${this.page}-${this.lang}.json`;
  }

  private async _savePage() {
    console.warn('TODO : not saved');
  }

  render(): TemplateResult {
    const languages = ['en', 'fr'];

    return html`
        <div class="flex justify-between ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Pages')}
          </h1>
          <div class="flex justify-between gap-2">
            <div class="relative">
              <select
                  @change=${async (event: Event) => {
                    this.lang = (event.target as HTMLSelectElement).value;
                  }}
                  class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
                >
                  ${languages.map((lang) => {
                    return html`
                      <option value="${lang}">${lang.toUpperCase()}</option>
                    `;
                  })}
              </select>
              <select
                @change=${async (event: Event) => {
                  this.page = (event.target as HTMLSelectElement).value;
                }}
                class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
              >
                ${this._files.map(file => {
                  return html`
                    <option value="${file.url}">${file.name}</option>
                  `;
                })}
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
            <button @click=${this._savePage} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button @click=${async () => {
              console.warn('not deleted.');
              await this.loadFiles();
            }} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div id="holder" class="w-full p-4"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-pages': WebsitePages;
  }
}
