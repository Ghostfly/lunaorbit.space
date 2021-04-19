import {LitElement, html, TemplateResult, customElement, internalProperty} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import { msg } from '@lit/localize';

import { authenticate, getPerson, userSession } from '../auth';
import { UserSession } from '@stacks/auth';
import { Person } from '@stacks/profile';

import EditorJS, { LogLevels } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/simple-image'; 
import RawTool from '@editorjs/raw'; 
import Link from '@editorjs/link'; 
import Checklist from '@editorjs/checklist'; 
import NestedList from '@editorjs/nested-list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import AttachesTool from '@editorjs/attaches';

enum DashboardPages {
  home = 'home',
  pages = 'pages',
  settings = 'settings',
  reports = 'reports',
  assets = 'assets',
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
              class: NestedList, 
              inlineToolbar: true 
            },
            image: {
              class: Image,
            },
            raw: {
              class: RawTool
            },
            link: {
              class: Link,
            },
            checklist: {
              class: Checklist
            },
            marker: {
              class: Marker,
              shortcut: 'CMD+SHIFT+M',
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+O',
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              },
            },
            attaches: {
              class: AttachesTool,
              inlineToolbar: true,
              config: {
                endpoint: 'http://localhost:8008/uploadFile'
              }
            },
            delimiter: Delimiter,
          },
          autofocus: true,
          placeholder: 'Let`s write an awesome story!',
          logLevel: 'VERBOSE' as LogLevels,
          onReady: () => {
            console.log('Editor.js is ready to work!');
          },
          onChange: () => {
            console.log('Now I know that Editor\'s content changed!');
          },
          data: {
            time: 1552744582955,
            blocks: [],
            version: "2.11.10"
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
    <div class="flex">
        <div class="flex flex-col items-center w-16 h-screen overflow-hidden text-indigo-300 terra-bg">
          <div class="flex flex-col items-center mt-3">
            ${this._person ? html`
              <img class="h-10 w-10 bg-white rounded-lg" src="https://avatars.dicebear.com/api/bottts/${this._person?.profile().stxAddress.mainnet}.svg" />
            ` : html``}
            <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.home ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.home}" title="${msg('Dashboard')}">
              <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
            <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.pages ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.pages}" title="${msg('Dashboard')}">
              <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </a>
            <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.reports ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.reports}" title="${msg('Reports')}">
              <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
          <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.settings ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.settings}" title="${msg('Settings')}">
            <svg class="w-6 h-6 stroke-current"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </a>
          <a title="${msg('Logout')}" @click=${() => {
              this._userSession?.signUserOut();
              this._signedIn = false;
            }} class="flex items-center justify-center w-12 h-12 mt-2 rounded cursor-pointer hover:bg-blue-700 hover:text-white">
              <span class="flex items-center">
                <svg class="h-5 w-5 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
          </a>
        </div>
        <div class="container px-4 py-6 col-span-1">
          ${this._pageForTitle(this._page)}
        </div>
      </div>
    </div>
    `;
  }

  render(): TemplateResult {
    return html`	
    ${this._signedIn ? html`
      ${this._adminNav()}
    ` : html`
      ${this._connectButton()}
    `}
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
        `;
      case DashboardPages.assets:
        return html`
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('Assets')}
        </h1>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
