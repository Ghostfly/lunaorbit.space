import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { deleteFile, listFiles, putFile } from '../../storage';

/**
 * Assets component
 */
@customElement('website-assets')
export class WebsiteAssets extends Localized(LitElement) {

  @property({ type: Array })
  public files: { name: string; url: string; }[] = []

  createRenderRoot(): this {
    return this;
  }
  
  async firstUpdated(): Promise<void> {
    await this.updateFiles();
  }

  async updateFiles(): Promise<void> {
    const filesList = await listFiles();
    if (Array.isArray(filesList)) {
      this.files = filesList.filter(file => !file.name.startsWith('page-'));
    } else {
      this.files = [];
    }
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
            <input class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file" name="files" @change=${async (event: Event) => {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                  const maxAllowedSize = 25 * 1024 * 1024;
                  const file = target.files[0];

                  if (file.size > maxAllowedSize) {
                    // TODO : replace by alert.
                    alert(msg('File is too big.'));
                    target.value = '';
                  } else {
                    console.warn('will upload', file);
                    const fileLink = await putFile(file.name, file, { encrypt: false });
                    console.warn('uploaded', fileLink);
                    await this.updateFiles();
                  }
              }
            }}>
          </div>
        </div>
        <div class="m-4">
            <h1 class="text-xl mt-10">
              ${msg('Gallery')}
              <div class="grid lg:grid-cols-3 sm:justify-items-start lg:justify-items-center m-4">
                ${this.files.length === 0 ? html`
                No files to show
                ` : html``}
                ${this.files.map((file) => {
                  return html`
                  <div class="flex flex-col justify-center items-end p-4 m-4 bg-gray-100 border border-gray-200">
                    ${file.name}
                    <div class="flex justify-between">
                      <svg @click=${() => {
                        console.warn(file.url);
                      }} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <svg @click=${async () => {
                        await deleteFile(file.name);
                        console.warn('deleted');
                        await this.updateFiles();
                      }} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </div>
                  `;
                })}
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
