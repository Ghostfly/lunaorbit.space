import { LitElement, html, TemplateResult, customElement, internalProperty } from 'lit-element';
import { Localized } from '@lit/localize/localized-element';
import { msg } from '@lit/localize';
import { UserSession } from '@stacks/auth';
import { Person } from '@stacks/profile';

import { IXliffSource, IXliffTarget, XliffParser } from '@vtabary/xliff2js';
import FRTranslation from '../assets/xliff/fr.xlf?raw';

import { authenticate, getPerson, userSession } from '../auth';

import { AdminNav, DashboardPages } from './dashboard/nav';

import './dashboard/settings';
import './dashboard/assets';
import './dashboard/translate';
import './dashboard/pages';
import './dashboard/menus';
import './dashboard/nav';

/**
 * XAdmin component
 */
@customElement('x-admin')
export class XAdmin extends Localized(LitElement) {
  static APPDomain = 'http://localhost:3000';
  static RedirectURI = 'http://localhost:3000/panel';
  static ManifestURI = 'http://localhost:3000/manifest.json';

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

  private async handleAuth(): Promise<void> {
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
  }

  async firstUpdated(): Promise<void> {
    const orbit = document.querySelector('luna-orbit');
    this._page = orbit?.router.location.pathname.replace(AdminNav.MainPathPrefix + '/', '') as DashboardPages;

    await this.handleAuth();
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
            <admin-nav .person=${this._person} .page=${this._page}></admin-nav>
          </div>
          <div class="px-4 py-6 h-screen w-full">
            ${this._pageForTitle(this._page)}
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
        <website-pages></website-pages>
        `;
      case DashboardPages.settings:
        return html`
        <website-setting></website-setting>
        `;
      case DashboardPages.menus:
        return html`
        <admin-menu></admin-menu>
        `;
      case DashboardPages.assets:
        return html`
        <website-assets></website-assets>
        `;
      case DashboardPages.translate:
        return html`
        <website-translate .strings=${this._strings}></website-translate>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
