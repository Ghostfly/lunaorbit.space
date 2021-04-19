import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

@customElement('website-setting')
export class WebsiteSettings extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Settings')}
        </h1>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-3 sm:col-span-2">
                  <label for="company_website" class="block text-sm font-medium text-gray-700">
                    ${msg('Website')}
                  </label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      ${msg('https://')}
                    </span>
                    <input type="text" name="company_website" id="company_website" class="p-2 border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <label for="about" class="block text-sm font-medium text-gray-700">
                  ${msg('Announcement')}
                </label>
                <div class="mt-1">
                  <textarea id="Announcement" name="announcement" rows="3" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"></textarea>
                </div>
              </div>

              <div>
                <label for="about" class="block text-sm font-medium text-gray-700">
                  ${msg('Description')}
                </label>
                <div class="mt-1">
                  <textarea id="about" name="about" rows="3" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"></textarea>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  ${msg('Open graph')}
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>${msg('Upload a file')}</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only">
                      </label>
                      <p class="pl-1">${msg('or drag and drop')}</p>
                    </div>
                    <p class="text-xs text-gray-500">
                      ${msg('PNG, JPG, GIF up to 25MB')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white terra-bg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ${msg('Save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-setting': WebsiteSettings;
  }
}
