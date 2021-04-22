import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element.js';
import { capitalizeFirstLetter } from '../../lib/strings';

export type WebsiteSettingsDB = {
  id: number;
  name: string;
  value: string;
  type: 'textarea' | 'image' | 'text';
}
/**
 * Website settings component
 */
@customElement('website-setting')
export class WebsiteSettings extends Localized(LitElement) {
  @internalProperty()
  private _settings: WebsiteSettingsDB[] | null = null;
  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const database = document.querySelector('x-admin')?.supabase;
    if (!database) {
      return;
    }

    const queryBuilder = database.from<WebsiteSettingsDB>('settings');
    const query = queryBuilder.select('name, value, type');

    const settings = (await query).data;
    this._settings = settings;
  }

  render(): TemplateResult {
    return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Settings')}
        </h1>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">

              ${this._settings?.map(setting => {
                switch (setting.type) {
                  case 'textarea':
                    return html`
                      <div>
                        <label for="${setting.name}" class="block text-sm font-medium text-gray-700">
                          ${capitalizeFirstLetter(setting.name)}
                        </label>
                        <div class="mt-1">
                          <textarea id="${setting.name}" name="${setting.name}" rows="3" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md" .value=${setting.value}></textarea>
                        </div>
                      </div>
                    `;
                  case 'text':
                    return html`
                    <div>
                        <label for="${setting.name}" class="block text-sm font-medium text-gray-700">
                          ${capitalizeFirstLetter(setting.name)}
                        </label>
                        <div class="mt-1">
                          <input id=${setting.name} type="text" id="${setting.name}" name="${setting.name}" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md" .value=${setting.value} />
                        </div>
                      </div>
                    `;
                  case 'image':
                    return html`
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        ${setting.name}
                      </label>
                      <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <div class="flex text-sm text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>${msg('Upload a file')}</span>
                              <input id=${setting.name} name="file-upload" type="file" class="sr-only">
                            </label>
                            <p class="pl-1">${msg('or drag and drop')}</p>
                          </div>
                          <p class="text-xs text-gray-500">
                            ${msg('PNG, JPG, GIF up to 25MB')}
                          </p>
                        </div>
                      </div>
                    </div>
                    `;
                }
              })}
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button @click=${this._onSave} class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white terra-bg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ${msg('Save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private async _onSave() {
    const database = document.querySelector('x-admin')?.supabase;
    if (!database || !this._settings) {
      return;
    }

    for (const setting of this._settings) {
      const component = document.querySelector('#' + setting.name) as HTMLInputElement;
      if (component && component.value !== setting.value) {
        const queryBuilder = database.from<WebsiteSettingsDB>('settings');
        const { error } = await queryBuilder.update({
          value: component.value
        }).match({
          name: setting.name
        });
        
        if (error) {
          document.querySelector('x-admin')?.showSnack('Error while updating data');
        }

        document.querySelector('x-admin')?.showSnack('Updated.');

        document.querySelector('luna-orbit')?.updateBannerMessage();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-setting': WebsiteSettings;
  }
}
