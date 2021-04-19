import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element.js';

interface MenuItem {
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

  render(): TemplateResult {
    return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Menus')}
        </h1>
        <div class="m-4">
        <div class="w-full max-w-screen-xl mx-auto px-6">
        <div class="flex justify-center p-4 px-3 py-10">
            <div class="w-full max-w-md">
                <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                    <div class="py-3 text-sm">
                      <h1 class="font-semibold m-4">Menu items</h1>
                      ${this.systemPages.map((page) => {
                        return html`
                          <div class="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                              <div class="flex-grow font-medium px-2">${page.name}</div>
                          </div>
                          `;
                        })}
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
