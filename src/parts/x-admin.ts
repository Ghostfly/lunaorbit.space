import {
  html,
  TemplateResult,
  customElement,
  query,
  state,
  LitElement,
} from 'lit-element';

import {AdminNav, DashboardPages} from './dashboard/nav';

import ExtensionSingleton from '../terra/terra-connect';

import './dashboard/settings';
import './dashboard/assets';
import './dashboard/nav';
import './dashboard/home';
import './dashboard/tools';
import './dashboard/how-to';

import '../components/sign-in-terra';

import '@material/mwc-snackbar';
import '@material/mwc-fab';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-switch';

import {Snackbar} from '@material/mwc-snackbar';

import {SupabaseClient} from '@supabase/supabase-js';
import {retrieveSupabase} from '../luna-orbit';
import {loader} from './dashboard/home';

type AdminUser = {
  id: number;
  terraAddress: string;
  token: string;
};

/**
 * XAdmin component
 */
@customElement('x-admin')
export class XAdmin extends LitElement {
  static APPDomain = 'http://localhost:3000';
  static LOCAL_ADMIN_KEY = 'admin-terra-address';
  static LOGGED_IN_AT_KEY = 'logged-in-at';
  static TOKEN_DURATION = 60000;

  @state()
  private _signedIn = false;

  @state()
  private _page: DashboardPages = DashboardPages.strengths;

  @state()
  private _savedAddress: string | null = null;

  public supabase!: SupabaseClient;

  @state()
  private _isChecking = false;

  @query('mwc-snackbar')
  public snackbar!: Snackbar;

  createRenderRoot(): this {
    return this;
  }

  constructor() {
    super();
    this.supabase = retrieveSupabase();
  }

  private async _isAllowed(terraAddress: string) {
    const queryBuilder = this.supabase.from<AdminUser>('terraLogin');
    const query = queryBuilder
      .select('terraAddress, token')
      .eq('terraAddress', terraAddress);
    const allowedAddresses = (await query).data;
    const isAllowed = allowedAddresses?.length;

    if (allowedAddresses && allowedAddresses.length > 0) {
      this.supabase = retrieveSupabase(allowedAddresses[0].token);
    }

    return isAllowed;
  }

  public showSnack(message: string): void {
    this.snackbar.labelText = message;
    this.snackbar.show();
  }

  private async _loginUsing(terraAddress: string): Promise<boolean> {
    this._isChecking = true;
    if (!(await this._needsLogin())) {
      this._signedIn = true;
      this._savedAddress = terraAddress;
      this._isChecking = false;
      return true;
    }

    if (terraAddress.indexOf('@') !== -1) {
      const expiresIn = await this.supabase.auth.session()?.expires_in;
      if (expiresIn && expiresIn > 4) {
        this._signedIn = true;
        this._savedAddress = terraAddress;
        this._isChecking = false;
        return true;
      }
    }

    const isAllowed = await this._isAllowed(terraAddress);
    if (isAllowed) {
      localStorage.setItem(XAdmin.LOCAL_ADMIN_KEY, terraAddress);
      localStorage.setItem(
        XAdmin.LOGGED_IN_AT_KEY,
        new Date().getTime().toString()
      );

      this._savedAddress = terraAddress;
      this._signedIn = true;
      this._isChecking = false;
      return true;
    } else {
      localStorage.removeItem(XAdmin.LOCAL_ADMIN_KEY);
      localStorage.removeItem(XAdmin.LOGGED_IN_AT_KEY);

      alert("This address isn't allowed.");

      this._savedAddress = null;
      this._signedIn = false;
    }

    this._isChecking = false;

    return false;
  }

  private async _needsLogin() {
    const terraAddress = localStorage.getItem(XAdmin.LOCAL_ADMIN_KEY);
    const loggedAtKey = localStorage.getItem(XAdmin.LOGGED_IN_AT_KEY);
    if (!terraAddress) {
      return true;
    }

    if (loggedAtKey) {
      const isAllowed = await this._isAllowed(terraAddress);

      if (isAllowed) {
        const loggedAt = parseInt(loggedAtKey, 10);
        const isExpired =
          new Date(loggedAt) > new Date(loggedAt + XAdmin.TOKEN_DURATION);

        return isExpired;
      } else {
        return true;
      }
    }

    return true;
  }

  private async handleAuth(): Promise<void> {
    const savedAddress = localStorage.getItem(XAdmin.LOCAL_ADMIN_KEY);
    this._savedAddress = savedAddress;

    if (savedAddress) {
      // eslint-disable-next-line no-debugger
      debugger;
      await this._loginUsing(savedAddress);
    }
  }

  async firstUpdated(): Promise<void> {
    const orbit = document.querySelector('luna-orbit');
    this._page = orbit?.router.location.pathname.replace(
      AdminNav.MainPathPrefix + '/',
      ''
    ) as DashboardPages;

    await this.handleAuth();
  }

  async connect(): Promise<boolean> {
    const terraAdr = await ExtensionSingleton.connect();

    if (terraAdr.address) {
      await this._loginUsing(terraAdr.address);
    }

    return this._signedIn;
  }

  _connectButton(): TemplateResult {
    return html`

      <form @submit=${async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const email = (form.querySelector('#email') as HTMLInputElement).value;
      const password = (form.querySelector('#password') as HTMLInputElement).value;
      if (email && password) {
        const { error } = await this.supabase.auth.signIn({
          email,
          password
        });
    
        if (error) {
          this.showSnack(error.message);
        } else {
          localStorage.setItem(XAdmin.LOCAL_ADMIN_KEY, email);
          localStorage.setItem(
            XAdmin.LOGGED_IN_AT_KEY,
            new Date().getTime().toString()
          );

          this._savedAddress = email;

          this.showSnack('Logged in !');

          this._signedIn = true;
          this._isChecking = false;
        }
      } else {
        this.showSnack('Please fill every fields');
      }

      }}>
      <div class="relative mb-4">
        <label for="email" class="leading-7 text-sm text-gray-600"
          >${'Email'}</label
        >
        <input
          autocomplete="username"
          type="email"
          id="email"
          name="email"
          class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div class="relative mb-4">
        <label for="password" class="leading-7 text-sm text-gray-600"
          >${'Password'}</label
        >
        <input
          autocomplete="current-password"
          type="password"
          id="password"
          name="password"
          class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <button
        type="submit"
        class="text-white terra-bg border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
      >
        ${'Login'}
      </button>
      </form>

      <sign-in-terra
        .onLogin=${async () => {
          await this.connect();
        }}
      ></sign-in-terra>
    `;
  }

  private _adminContent(): TemplateResult {
    return html`
      <div class="flex">
        <div class="px-4 py-6 h-screen w-full">
          ${this._isChecking
            ? loader()
            : html`
                ${this._signedIn
                  ? html` ${this._pageForTitle(this._page)} `
                  : html` ${this._connectButton()} `}
              `}
        </div>
        <div
          class="flex flex-col items-center w-16 h-100 overflow-hidden text-indigo-300 terra-bg rounded-br-lg"
        >
          <admin-nav
            .address=${this._savedAddress}
            .disabled=${!this._signedIn}
          ></admin-nav>
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
      <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
      ${this._adminContent()}
      <mwc-snackbar></mwc-snackbar>
    `;
  }

  public logout(): void {
    localStorage.removeItem(XAdmin.LOGGED_IN_AT_KEY);
    localStorage.removeItem(XAdmin.LOCAL_ADMIN_KEY);
    this._savedAddress = null;
    this._signedIn = false;
    this._isChecking = false;
  }

  private _pageForTitle(page: DashboardPages): TemplateResult {
    switch (page) {
      case DashboardPages.cockpit:
        return html` <website-home></website-home> `;
      case DashboardPages.strengths:
        return html` <website-home></website-home> `;
      case DashboardPages.howTo:
        return html` <website-how-to></website-how-to> `;
      case DashboardPages.tools:
        return html` <website-tools></website-tools> `;
      case DashboardPages.settings:
        return html` <website-setting></website-setting> `;
      case DashboardPages.assets:
        return html` <website-assets></website-assets> `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
  }
}
