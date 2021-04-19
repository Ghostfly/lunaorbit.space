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

import { IXliffSource, IXliffTarget, XliffParser } from '@vtabary/xliff2js';

// import ENGTranslation from '../assets/xliff/en.xlf?raw';
import FRTranslation from '../assets/xliff/fr.xlf?raw';

enum DashboardPages {
  cockpit = '/cockpit',
  pages = 'pages',
  settings = 'settings',
  assets = 'assets',
  translate = 'translate',
  menus = 'menus',
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
  private _page: DashboardPages = DashboardPages.pages;

  @internalProperty()
  private _strings: { source: IXliffSource, target: IXliffTarget }[] = [];

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const orbit = document.querySelector('luna-orbit');
    this._page = orbit?.router.location.pathname.replace(XAdmin.MainPathPrefix + '/', '') as DashboardPages;

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

    if (this._page === DashboardPages.translate) {
      const parser = new XliffParser();

      // const english = parser.parse(ENGTranslation)?.children[0].children;
      const french = parser.parse(FRTranslation)?.children[0].children[0].children;

      if (french) {
        for (const transUnits of french) {
          const [source, target] = transUnits.children;
          const sourceDescriptor = source as IXliffSource;
          const targetDescriptor = target as IXliffTarget;
          this._strings.push({
            source: sourceDescriptor,
            target: targetDescriptor,
          });
        }
      }
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
          }} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white terra-bg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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
        <div class="flex flex-col items-center w-16 h-100 overflow-hidden text-indigo-300 terra-bg">
          <div class="flex flex-col items-center mt-3">
            ${this._person ? html`
              <img class="h-10 w-10 bg-white rounded-full" src="https://avatars.dicebear.com/api/bottts/${this._person?.profile().stxAddress.mainnet}.svg" />
            ` : html``}
            <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.pages ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.pages}" title="${msg('Pages')}">
              <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </a>
            <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.menus ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.menus}" title="${msg('Menus')}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </a>
          </div>
          <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.translate ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.translate}" title="${msg('Translate')}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </a>
          <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.assets ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.assets}" title="${msg('Assets')}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
          <a class="flex items-center justify-center w-12 h-12 mt-2 rounded ${this._page === DashboardPages.settings ? 'text-indigo-100 bg-blue-700' : 'hover:bg-blue-700 hover:text-white'}" href="${XAdmin.MainPathPrefix}/${DashboardPages.settings}" title="${msg('Settings')}">
            <svg class="w-6 h-6 stroke-current"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </a>
          <a title="${msg('Logout')}" @click=${() => {
              this._userSession?.signUserOut();
              this._signedIn = false;
            }} class="flex items-center justify-center w-12 h-12 mt-2 rounded cursor-pointer hover:bg-blue-700 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </a>
        </div>
        <div class="container px-4 py-6 h-screen">
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
      case DashboardPages.cockpit:
        return html`
        <div class="flex justify-between ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Home')}
          </h1>
        </div>
        `;
      case DashboardPages.pages:
        return html`
        <div class="flex justify-between ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Pages')}
          </h1>
          <div class="flex justify-between gap-2">
            <div class="relative">
              <select
                class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
              >
                <option>Staking</option>
                <option>How to</option>
                <option>Tools</option>
                <option>Contact</option>
              </select>
              <span
                class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
            <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div id="holder" class="w-full p-4 border-4 rounded-sm"></div>
        `;
      case DashboardPages.settings:
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
                    Website
                  </label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://
                    </span>
                    <input type="text" name="company_website" id="company_website" class="p-2 border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <label for="about" class="block text-sm font-medium text-gray-700">
                  Announcement
                </label>
                <div class="mt-1">
                  <textarea id="Announcement" name="announcement" rows="3" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"></textarea>
                </div>
              </div>

              <div>
                <label for="about" class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div class="mt-1">
                  <textarea id="about" name="about" rows="3" class="p-2 shadow-sm border-2 border-gray-300 border-dashed focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"></textarea>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Open graph
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only">
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">
                      PNG, JPG, GIF up to 25MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white terra-bg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
        `;
      case DashboardPages.menus:
        return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Menus')}
        </h1>
        <div class="m-4">
          TODO : Form to manage website menus
        </div>
        `;
      case DashboardPages.assets:
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
                <span class="ml-2">Upload file</span>
            </button>
            <input class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file" name="vacancyImageFiles" @change=${(change: Event) => {
              console.warn(change);
            }} multiple>
          </div>
        </div>
        <div class="m-4">
            <h1 class="text-xl mt-10">
              ${msg('Gallery')}
              <div class="grid sm: grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-items-center">
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
                <div class="h-24 w-24 p-4 m-4 bg-gray-100 border border-gray-200"></div>
              </div>
            </h1>
        </div>
        `;
      case DashboardPages.translate:
        return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Translate')}
          </h1>
          <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
        </div>
        <div class="m-4">
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th>
                  Source
                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1">
                    EN
                  </span>
                </th>
                <th>
                  Target
                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1">
                    FR
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              ${this._strings.map(translatable => {
                return html`
                <tr>
                    <td>
                      <div class="m-3 pt-0">
                        <input readonly type="text" .value=${translatable.source.children[0] as unknown as string} class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                    </td>
                    <td>
                      <div class="m-3 pt-0">
                        <input type="text" .value=${translatable.target?.children[0] as unknown as string ?? ''} class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                    </td>
                </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
