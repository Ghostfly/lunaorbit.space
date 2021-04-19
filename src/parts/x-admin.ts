import {LitElement, html, TemplateResult, customElement, internalProperty} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import { msg } from '@lit/localize';

import { authenticate, getPerson, userSession } from '../auth';
import { UserSession } from '@stacks/auth';
import { Person } from '@stacks/profile';

/**
 * XAdmin component
 *
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

  constructor() {
    super();
  }

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
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

  _logoutButton(): TemplateResult {
    return html`
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div class="m-4">
        ${this._person ? html`
        <div class="p-4">
          <span class="text-sm font-semibold">
            ${this._person.profile().stxAddress.mainnet}
          </span>
        </div>

        ` : html``}
        </div>
      </div>
    </div>
    `;
  }

  private _adminNav(): TemplateResult {
    return html`
    <nav class="bg-gray-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="/cockpit/home" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              <a href="/cockpit/pages" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pages</a>
              <a href="/cockpit/settings" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Settings</a>
              <a href="/cockpit/reports" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Reports</a>
              <button @click=${() => {
                this._userSession?.signUserOut();
                this._signedIn = false;
              }} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ${msg('Logout')}
              </button>
            </div>
          </div>
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
            <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
              ${msg('If you know, you know.')}
            </h1>

            ${!this._signedIn ? html`
            ${this._connectButton()}
            ` : html``}

            ${this._signedIn ? html`
            ${this._logoutButton()}
            ` : html``}
          </div>
        </div>
      </div>
    </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
