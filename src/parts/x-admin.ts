import {LitElement, html, TemplateResult, customElement, internalProperty} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import { msg } from '@lit/localize';

import '@material/mwc-button';

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
      // eslint-disable-next-line no-debugger
      debugger;
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

      // eslint-disable-next-line no-debugger
      debugger;

      sessionStorage.setItem('lunaorbit-response-token', this._userSession.getAuthResponseToken());
      this._signedIn = true;
    });
  }

  render(): TemplateResult {
    return html`
      <div class="container  mx-auto py-12 px-6">
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('If you know, you know.')}
        </h1>

        ${!this._signedIn ? html`
        <mwc-button @click=${() => {
          this.connect();
        }} raised label="${msg('Connect')}"></mwc-button>
        ` : html``}


        ${this._signedIn ? html`
        ${this._person ? html`
        ${this._person.profile().stxAddress.mainnet}
        ` : html``}
        <mwc-button @click=${() => {
          this._userSession?.signUserOut();
          this._signedIn = false;
        }} raised label="${msg('Logout')}"></mwc-button>
        ` : html``}

      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
