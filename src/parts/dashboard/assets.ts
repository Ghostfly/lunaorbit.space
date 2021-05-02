import {
  html,
  customElement,
  TemplateResult,
  property,
  state,
  LitElement,
} from 'lit-element';

import {msg} from '@lit/localize';
import {retrieveSupabase} from '../../luna-orbit';

import {Dialog} from '@material/mwc-dialog';

import {FileObject, SupabaseStorageClient} from '@supabase/storage-js';
import {StorageFileApi} from '@supabase/storage-js/dist/main/lib/StorageFileApi';

/**
 * Assets component
 */
@customElement('website-assets')
export class WebsiteAssets extends LitElement {
  static ASSETS_SUBPATH = '/assets';

  @property({type: Array})
  public files: FileObject[] = [];

  @state()
  private _storageClient!: SupabaseStorageClient;
  @state()
  private _assetsRef!: StorageFileApi;
  @state()
  private currentFile: FileObject | null = null;
  @state()
  private currentLink: string | null = null;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    this._storageClient = retrieveSupabase().storage;
    this._assetsRef = this._storageClient.from('assets');

    await this.updateFiles();
  }

  async updateFiles(): Promise<void> {
    const filesList = (await this._assetsRef.list(undefined)).data;
    if (!filesList) {
      return;
    }

    this.files = [];
    for (const file of filesList) {
      this.files = [...this.files, file];
    }
  }

  private async _onLinkRequest(_e: Event, file: FileObject) {
    const signedURL = await this._assetsRef.createSignedUrl(file.name, 12000);

    const fileHolder = document.createElement('img');
    fileHolder.src = signedURL.signedURL ?? '';

    this.currentLink = signedURL.signedURL;
    this.currentFile = file;
    await this.updateComplete;

    const linkDialog = this.querySelector(`#dialog-show-link`) as Dialog;
    linkDialog.open = true;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 items-center">
          <h1 class="text-xl">
            ${msg('Assets')}
          </h1>
          <div class="overflow-hidden relative justify-end">
            <mwc-fab icon="upload" mini @click=${(e: Event) => {
              const clicked = e.currentTarget;
              ((clicked as HTMLElement)
                .nextElementSibling as HTMLInputElement).click();
            }}></mwc-fab>    
            <input class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file" name="files" @change=${async (
              event: Event
            ) => {
              const target = event.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                const maxAllowedSize = 25 * 1024 * 1024;
                const file = target.files[0];

                if (file.size > maxAllowedSize) {
                  document
                    .querySelector('x-admin')
                    ?.showSnack('File is too big.');
                  target.value = '';
                } else {
                  await this._assetsRef.upload(file.name, file);
                  await this.updateFiles();
                }
              }
            }}>
          </div>
        </div>
        <div class="m-4 gallery-anchor">
            <h1 class="text-xl mt-10">
              ${msg('Gallery')}
            </h1>
              ${
                this.files.length === 0
                  ? html`${msg('No files to show')}`
                  : html`
                      <div class="flex flex-wrap mb-8 mt-6">
                        ${this.files.map((file) => {
                          return html`
                            <div
                              class="w-full md:w-1/2 lg:w-1/4 px-2 mb-4 file-holder"
                            >
                              <div
                                class="border h-12 text-sm text-grey-dark flex items-center justify-center flex flex-col h-24 gap-4 shadow-sm hover:shadow-md"
                              >
                                <p>${file.name}</p>
                                <div class="flex justify-evenly w-full">
                                  <svg
                                    class="h-6 w-6 cursor-pointer"
                                    @click=${(e: Event) =>
                                      this._onLinkRequest(e, file)}
                                    class="h-6 w-6 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>
                                  <svg
                                    class="h-6 w-6 cursor-pointer"
                                    @click=${(_e: Event) =>
                                      this._onDeleteFile(file)}
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          `;
                        })}
                      </div>
                    `
              }
              </div>
        </div>
        ${
          this.currentFile
            ? html`
                <mwc-dialog id="dialog-${this.currentFile.id}">
                  <div class="break-words">
                    ${msg('Delete file?')} ${this.currentFile.name}
                  </div>
                  <mwc-button
                    @click=${async () => {
                      if (!this.currentFile) {
                        return;
                      }
                      await this._assetsRef.remove([this.currentFile.name]);
                      document
                        .querySelector('x-admin')
                        ?.showSnack(`Deleted ${this.currentFile.name}`);
                      this.currentFile = null;
                      await this.updateFiles();
                    }}
                    slot="primaryAction"
                    dialogAction="delete"
                  >
                    ${msg('Delete')}
                  </mwc-button>
                </mwc-dialog>
              `
            : ''
        }

        ${
          this.currentLink && this.currentFile
            ? html`
                <mwc-dialog id="dialog-show-link">
                  <h1 class="mt-4 mb-4">${msg('Share link :')}</h1>
                  ${this.currentFile.name.endsWith('png')
                    ? html`
                        <img
                          src="${this.currentLink}"
                          alt=${this.currentFile.name}
                        />
                      `
                    : ''}
                  <input
                    id="showLink"
                    type="text"
                    name="showLink"
                    class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"
                    .value=${this.currentLink}
                  />
                  <mwc-button slot="primaryAction" dialogAction="delete">
                    ${msg('Ok')}
                  </mwc-button>
                </mwc-dialog>
              `
            : ''
        }
    `;
  }

  private async _onDeleteFile(file: FileObject) {
    this.currentFile = file;
    await this.updateComplete;
    const deleteDialog = this.querySelector(
      `#dialog-${this.currentFile.id}`
    ) as Dialog;
    deleteDialog.open = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-assets': WebsiteAssets;
  }
}
