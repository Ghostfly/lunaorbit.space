import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { userSession } from '../../auth';
import { Person } from '@stacks/profile';

export enum DashboardPages {
  cockpit = '/cockpit',
  pages = 'pages',
  settings = 'settings',
  assets = 'assets',
  translate = 'translate',
  menus = 'menus',
}

/**
 * Admin nav component
 */
@customElement('admin-nav')
export class AdminNav extends Localized(LitElement) {
  static MainPathPrefix = '/cockpit'

  @property({type: Object})
  public person!: Person | null;

  @property({type: String})
  public page!: DashboardPages;

  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <div class="flex flex-col items-center mt-3">
        ${this.person ? html`
          <img class="h-10 w-10 bg-white rounded-full" src="https://avatars.dicebear.com/api/bottts/${this.person?.profile().stxAddress.mainnet}.svg" />
        ` : html``}
        <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this.page === DashboardPages.pages ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${AdminNav.MainPathPrefix}/${DashboardPages.pages}" title="${msg('Pages')}">
          <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </a>
        <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this.page === DashboardPages.menus ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${AdminNav.MainPathPrefix}/${DashboardPages.menus}" title="${msg('Menus')}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </a>
      </div>
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this.page === DashboardPages.translate ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${AdminNav.MainPathPrefix}/${DashboardPages.translate}" title="${msg('Translate')}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </a>
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this.page === DashboardPages.assets ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${AdminNav.MainPathPrefix}/${DashboardPages.assets}" title="${msg('Assets')}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </a>
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this.page === DashboardPages.settings ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${AdminNav.MainPathPrefix}/${DashboardPages.settings}" title="${msg('Settings')}">
        <svg class="w-6 h-6 stroke-current"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </a>
      <a title="${msg('Logout')}" @click=${() => {
          userSession?.signUserOut();
        }} class="flex items-center justify-center w-12 h-12 mt-2 rounded cursor-pointer hover:bg-blue-700 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'admin-nav': AdminNav;
  }
}
