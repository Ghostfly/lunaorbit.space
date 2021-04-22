import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element.js';

import SmoothDnD from 'smooth-dnd';


export interface MenuItem {
  url: string;
  name: string;
}

export const systemPages = [
  { url: 'staking', name: 'Staking' },
  { url: 'how-to', name: 'How to' },
  { url: 'tools', name: 'Tools' },
  { url: 'contact', name: 'Contact' },
  { url: 'airdrops', name: 'Airdrops' }
];

/**
 * Admin menu component
 */
@customElement('admin-menu')
export class AdminMenu extends Localized(LitElement) {
  public systemPages: MenuItem[] = systemPages;

  createRenderRoot(): this {
    return this;
  }

  firstUpdated(): void {
    const sortableHolders = this.querySelectorAll('.sortable-holder') as NodeListOf<HTMLDivElement>;
    if (sortableHolders.length) {
      for (const holder of sortableHolders) {
        SmoothDnD(holder);
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
                <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4 grid grid-cols-2">
                    <div class="py-3 text-sm">
                      <h1 class="font-semibold m-4">Available</h1>
                      <div class="sortable-holder">
                        ${this.systemPages.map((page) => {
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
                      <div>
                        ${this.systemPages.map((page) => {
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
                    <div class="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                        <button class="terra-bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            ${msg('Save')}
                        </button>
                    </div>
                </div>
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
