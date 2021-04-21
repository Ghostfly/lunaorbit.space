import {
  html,
  customElement,
  internalProperty,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import {LunaPriceResponse, Validator} from './terra/terra-min';
import {Router, RouterLocation} from '@vaadin/router';

import './styles.css';

import '@material/mwc-circular-progress';

import './components/x-components';
import './parts/x-parts';

// Todo: lazy import
import './parts/x-admin';

import config from './config';
import {setLocaleFromUrl} from './localization';
import {Localized} from '@lit/localize/localized-element';
import {msg} from '@lit/localize';
import { BannerMessage } from './components/banner-message';

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { WebsiteSettingsDB } from './parts/dashboard/settings';

export function retrieveSupabase(): SupabaseClient {
  const supabaseUrl = 'https://ylqcozoikxxipzbvueua.supabase.co'
  return createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODk5MDIyNywiZXhwIjoxOTM0NTY2MjI3fQ.Nf1C2uRIocHV2bmfvbUxPGE8MTbRjbB9Kvft4V0dUaI');
}

/**
 * Luna-orbit
 *
 * @slot - This element has slots
 */
@customElement('luna-orbit')
export class LunaOrbit extends Localized(LitElement) {
  private mobileMenu!: HTMLDivElement | null;
  private mobileMenuToggle!: HTMLButtonElement | null;

  static APIValidatorURL = 'https://lcd.terra.dev/staking/validators/';
  static APILunaPrice = 'https://fcd.terra.dev/v1/market/price?denom=uusd&interval=15m';

  @internalProperty()
  private validatorInformation?: Validator;
  @internalProperty()
  private _commission = 0;

  public router: Router = new Router(document.querySelector('.content'));
  @property({type: Object})
  location = this.router.location;
  @internalProperty()
  private _bannerMessage!: BannerMessage;
  @internalProperty()
  private _price = 0;

  @internalProperty()
  private _supabase: SupabaseClient;

  constructor() {
    super();
    
    this._supabase = retrieveSupabase();
    this.mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    this.mobileMenu = document.querySelector('#mobile-menu');

    this.router.setRoutes([
      {
        path: '',
        component: 'x-home',
      },
      { path: '/', component: 'x-home' },
      { path: '/home', component: 'x-home' },
      { path: '/test', component: 'x-test' },
      { path: '/how-to', component: 'x-how-to' },
      { path: '/tools', component: 'x-tools'},
      { path: '/contact', component: 'x-contact' },
      { path: '/airdrops', component: 'airdrop-dialog' },
      { path: '/cockpit', component: 'x-admin' },
      { path: '/cockpit/:page', component: 'x-admin' },
      { path: '(.*)',       component: 'x-404' }
    ]);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );
  }

  public showAirdropDialog(): void {
    document.body.appendChild(document.createElement('airdrop-dialog'));
  }

  private async _updateBannerMessage(): Promise<void> {
    if (sessionStorage.getItem('lunaorbit-banner-hide')) {
      return;
    }

    const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
    const query = queryBuilder.select('name, value, type').eq('name', 'announcement');

    const settings = (await query).data;

    if (settings?.length) {
      const banners = document.querySelectorAll('banner-message');
      for (const banner of banners) {
        banner.parentElement?.removeChild(banner);
      }
  
      const bannerNode = document.createElement('banner-message');
      bannerNode.message = settings[0].value;
  
      bannerNode.addEventListener('click', function () {
        bannerNode.parentElement?.removeChild(bannerNode);
        sessionStorage.setItem('lunaorbit-banner-hide', 'true');
      });
  
      document.body.insertBefore(bannerNode, document.body.firstChild);
    }
  }

  private _showAirdropToast() {
    const hasToast = this.shadowRoot?.querySelector('airdrop-toast');
    if (hasToast) {
      hasToast.parentElement?.removeChild(hasToast);
    }

    if (!sessionStorage.getItem('lunaorbit-airdrops-hide')) {
      this.shadowRoot?.appendChild(document.createElement('airdrop-toast'));
    }
  }

  async firstUpdated(): Promise<void> {
    await setLocaleFromUrl();

    this._showAirdropToast();
    await this._updateBannerMessage();
    this._setupMenus();
    this._handleMobileMenu();

    await this._retrieveCommissionAndPrice();
  }

  private _setupMenus() {
    const menuHolders = document.querySelectorAll('.menu-holder');

    const links = [
      {
        href: '/home',
        class:
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium',
        value: msg('Staking'),
      },
      {
        href: '/how-to',
        class:
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium',
        value: msg('How to'),
      },
      {
        href: '/tools',
        class:
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium',
        value: msg('Tools'),
      },
      {
        href: '/contact',
        class:
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium',
        value: msg('Contact'),
      },
      {
        href: '/airdrops',
        class:
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium',
        value: msg('Airdrops'),
      },
    ];

    for (const menuHolder of menuHolders) {
      for (const link of links) {
        const elem = document.createElement('a');
        elem.href = link.href;
        elem.className = link.class;
        elem.innerText = link.value;
        menuHolder.appendChild(elem);
      }
    }
  }

  render(): TemplateResult {
    const isAdmin = this.router.location.pathname.indexOf('cockpit') === -1;

    return html`
      ${this._bannerMessage}
      <slot name="nav"></slot>
      <slot name="content"></slot>
      ${isAdmin ? html`
      <slot name="equation"></slot>
      <slot name="divider"></slot>
      <slot name="footer"></slot>
      ` : html``}
    `;
  }

  private _handleMobileMenu(): void {
    if (this.mobileMenuToggle && this.mobileMenu) {
      this.mobileMenuToggle.addEventListener('click', () => {
        if (this.mobileMenu?.style.display == 'none') {
          this.mobileMenu.style.display = 'block';
        } else if (this.mobileMenu) {
          this.mobileMenu.style.display = 'none';
        }
      });
    }
  }

  private async _retrieveCommissionAndPrice(): Promise<void> {
    const priceQuery = await fetch(LunaOrbit.APILunaPrice);
    const price = await priceQuery.json() as LunaPriceResponse;
    this._price = price.lastPrice;

    const equation = document.querySelector('x-equation');
    if (equation) {
      equation.price = this._price;
    }

    const validatorQuery = await fetch(
      LunaOrbit.APIValidatorURL + config.address
    );
    this.validatorInformation = await validatorQuery.json();

    if (this.validatorInformation) {
      this._commission = parseInt(
        this.validatorInformation.result.commission.commission_rates.rate,
        10
      );

      const commissionNode = document.querySelector(
        '#commission'
      ) as HTMLElement;
      commissionNode.innerText = this._commission + '%';
    }
  }

  private _routerLocationChanged(
    event: CustomEvent<{
      router: Router;
      location: RouterLocation;
    }>
  ): void {
    const page = event.detail.location.route?.path.replace('/', '');
    const selector = `[href='${page}']`;
    const activeLinks = document.querySelectorAll(`a${selector}`);
    const current = document.querySelectorAll('[aria-current=page]');
    for (const currentActive of current) {
      currentActive.classList.remove('text-white');
      currentActive.classList.add('text-gray-300');
      currentActive.removeAttribute('aria-current');
    }

    for (const activeLink of Array.from(activeLinks)) {
      activeLink.setAttribute('aria-current', 'page');
      activeLink.classList.remove('text-gray-300');
      activeLink.classList.add('text-white');
    }

    if (this.mobileMenu) {
      this.mobileMenu.style.display = 'none';
    }

    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'luna-orbit': LunaOrbit;
  }
}
