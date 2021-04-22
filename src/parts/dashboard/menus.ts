import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element';

import {smoothDnD} from 'smooth-dnd';
import { loadMenu, MenuItem } from '../../backend';

/**
 * Admin menu component
 */
@customElement('admin-menu')
export class AdminMenu extends Localized(LitElement) {
  @internalProperty()
  private _systemPages: MenuItem[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const base = document.querySelector('x-admin')?.supabase;
    if (base) {
      const menuItems = await loadMenu(base);
      if (menuItems) {
        this._systemPages = menuItems;
      }
    }

    await this.updateComplete;

    const sortableHolders = this.querySelectorAll('.sortable-holder') as NodeListOf<HTMLDivElement>;
    if (sortableHolders.length) {
      for (const holder of sortableHolders) {
        smoothDnD(holder, {
          /*onDragStart: () => {
            console.warn('drag start');
          },
          onDragEnd: () => {
            console.warn('drag end');
           },
          onDrop: () => {
            console.warn('drop');
          },
          onDropReady: () => {
            console.warn('drop-ready');
          },
          onDragEnter: () => {
            console.warn('drag-enter');
          },
          onDragLeave: () => {
            console.warn('drag-leave');
          }*/
        });
      }
    }
  }

  render(): TemplateResult {
    return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Menus')}
        </h1>
        <div class="m-4">
        <div class="w-full max-w-screen-xl mx-auto px-6">
        <div class="flex justify-center p-4 px-3 py-10">
            <div class="w-full max-w-lg">
              ${this._systemPages ? html`
              <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4 grid grid-cols-2">
                    <div class="py-3 text-sm">
                      <h1 class="font-semibold m-4">Available</h1>
                      <div class="sortable-holder">
                        ${this._systemPages.map((page) => {
                          return html`
                            <div class="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                <div class="flex-grow font-medium px-2">${page.name}</div>
                            </div>
                            `;
                          })}
                      </div>
                    </div>
                    <div class="py-3 text-sm opacity-75 select-none">
                      <h1 class="font-semibold m-4">Published</h1>
                      <div class="sortable-holder">
                        ${this._systemPages.map((page) => {
                          return html`
                            <div class="flex justify-start text-gray-700 rounded-md px-2 py-2 my-2">
                                <div class="flex-grow font-medium px-2">${page.name}</div>
                                <a class="cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </a>
                            </div>
                            `;
                          })}
                      </div>
                    </div>
                    <div class="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg flex justify-end">
                        <button class="terra-bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                          <span class="text-sm">Save</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                        </button>
                    </div>
                </div>
              ` : html`
              <div class="loading flex w-full justify-center p-6">
                <mwc-circular-progress indeterminate></mwc-circular-progress>
              </div>
              `}
            </div>
        </div>
    </div>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'admin-menu': AdminMenu;
  }
}
