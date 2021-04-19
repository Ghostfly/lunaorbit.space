import {LitElement, html, TemplateResult, customElement, internalProperty} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import { msg } from '@lit/localize';

import { authenticate, getPerson, userSession } from '../auth';
import { UserSession } from '@stacks/auth';
import { Person } from '@stacks/profile';

import EditorJS, { LogLevels } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list'; 

enum DashboardPages {
  home = 'home',
  pages = 'pages',
  settings = 'settings',
  reports = 'reports',
}

/**
 * XAdmin component
 *
 */
@customElement('x-admin')
export class XAdmin extends Localized(LitElement) {
  static APPDomain = 'http://localhost:3000';
  static RedirectURI = 'http://localhost:3000/panel';
  static ManifestURI = 'http://localhost:3000/manifest.json';
  static MainPathPrefix = '/cockpit'

  @internalProperty()
  private _signedIn = false;
  private _userSession: UserSession | null = userSession;

  @internalProperty()
  private _person: Person | null = null;
  @internalProperty()
  private _page: DashboardPages = DashboardPages.home;

  constructor() {
    super();
  }

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const orbit = document.querySelector('luna-orbit');
    this._page = orbit?.router.location.pathname.replace(XAdmin.MainPathPrefix + '/', '') as DashboardPages ?? 'home';

    if (this._userSession?.isSignInPending()) {
      const responseToken = localStorage.getItem('lunaorbit-response-token');
      if (responseToken) {
        await this._userSession.handlePendingSignIn(responseToken);
      } else {
        await this._userSession.handlePendingSignIn();
      }
    }

    if (this._userSession?.isUserSignedIn()) {
      this._person = getPerson();
      this._signedIn = true;
    } else {
      this._signedIn = false;
    }

    if (this._page === DashboardPages.pages) {
      await this.updateComplete;
      const editorHolder = this.querySelector('#holder') as HTMLDivElement;
      if (editorHolder) {
        const editor = new EditorJS({
          holder: editorHolder,
          tools: { 
            header: {
              class: Header,
              inlineToolbar: ['link'] 
            }, 
            list: { 
              class: List, 
              inlineToolbar: true 
            },
          },
          autofocus: true,
          placeholder: 'Let`s write an awesome story!',
          logLevel: 'VERBOSE' as LogLevels,
          onReady: () => {
            console.log('Editor.js is ready to work!');
          },
          onChange: () => {
            console.log('Now I know that Editor\'s content changed!');
          }
        });
        console.warn(editor);
      }
    }
  }

  connect(): void {
    authenticate(() => {
      console.warn('canceled');
      this._signedIn = false;
    }, (payload) => {
      this._userSession = payload.userSession;
      this._person = getPerson();

      sessionStorage.setItem('lunaorbit-response-token', this._userSession.getAuthResponseToken());
      this._signedIn = true;
    });
  }

  _connectButton(): TemplateResult {
    return html`
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <button @click=${() => {
            this.connect();
          }} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            ${msg('Sign in')}
          </button>
        </div>
      </div>
    </div>
    `;
  }

  private _adminNav(): TemplateResult {
    return html`
    <nav class="bg-gray-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-flow-col grid-col-2 p-2">
          <div class="ml-10 flex space-x-4 items-center">
            <a href="${XAdmin.MainPathPrefix}/${DashboardPages.home}" class="px-3 py-2 rounded-md text-sm font-medium ${this._page === DashboardPages.home ? 'bg-gray-900 text-white' : 'text-gray-300'}">${msg('Dashboard')}</a>
            <a href="${XAdmin.MainPathPrefix}/${DashboardPages.pages}" class="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${this._page === DashboardPages.pages ? 'bg-gray-900 text-white' : 'text-gray-300'}">${msg('Pages')}</a>
            <a href="${XAdmin.MainPathPrefix}/${DashboardPages.settings}" class="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${this._page === DashboardPages.settings ? 'bg-gray-900 text-white' : 'text-gray-300'}">${msg('Settings')}</a>
            <a href="${XAdmin.MainPathPrefix}/${DashboardPages.reports}" class="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${this._page === DashboardPages.reports ? 'bg-gray-900 text-white' : 'text-gray-300'}">${msg('Reports')}</a>
          </div>
          <div class="grid grid-flow-col grid-col-2 gap-4 justify-center">
            ${this._person ? html`
            <img class="h-10 w-10 bg-white rounded-lg" src="https://avatars.dicebear.com/api/bottts/${this._person?.profile().stxAddress.mainnet}.svg" />
            ` : html``}
            <a title="${msg('Logout')}" @click=${() => {
                this._userSession?.signUserOut();
                this._signedIn = false;
              }} class="group cursor-pointer relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white terra-bg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="flex items-center">
                  <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
    `;
  }

  render(): TemplateResult {
    return html`

    ${this._signedIn ? html`
    ${this._adminNav()}
    ` : html``}

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="rounded-lg h-96">
            ${this._pageForTitle(this._page)}

            ${!this._signedIn ? html`
            ${this._connectButton()}
            ` : html``}
          </div>
        </div>
      </div>
    </main>
    `;
  }

  private _pageForTitle(page: DashboardPages): TemplateResult {
    switch (page) {
      case DashboardPages.home:
        return html`
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('If you know, you know.')}
        </h1>`;
      case DashboardPages.pages:
        return html`
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('Pages')}
        </h1>
        <div id="holder" class="w-full p-4 border-4 rounded-sm"></div>
        `;
      case DashboardPages.reports:
        return html`
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('Reports')}
        </h1>
        `;
      case DashboardPages.settings:
        return html`
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('Settings')}
        </h1>
        `
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
