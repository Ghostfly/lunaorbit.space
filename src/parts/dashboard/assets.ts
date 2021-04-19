import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

/**
 * 404 component
 */
@customElement('website-assets')
export class WebsiteAssets extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 items-center">
          <h1 class="text-xl">
            ${msg('Assets')}
          </h1>
          <div class="overflow-hidden relative w-40">
            <button class="terra-bg hover:bg-blue-700 text-white py-2 px-4 w-full inline-flex items-center rounded-md" @click=${(e:Event) => {
              const clicked = e.currentTarget;
              ((clicked as HTMLElement).nextElementSibling as HTMLInputElement).click();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span class="ml-2">${msg('Upload file')}</span>
            </button>
            <input class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file" name="files" @change=${(change: Event) => {
              console.warn(change);
            }} multiple>
          </div>
        </div>
        <div class="m-4">
            <h1 class="text-xl mt-10">
              ${msg('Gallery')}
              <div class="grid sm: grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-items-center">
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
              </div>
            </h1>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-assets': WebsiteAssets;
  }
}
