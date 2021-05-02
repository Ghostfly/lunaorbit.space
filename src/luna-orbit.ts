import {
  html,
  customElement,
  property,
  TemplateResult,
  state,
  LitElement,
} from 'lit-element';
import {LunaPriceResponse, Validator} from './terra/terra-min';
import {Router, RouterLocation} from '@vaadin/router';

import './styles.css';

import '@material/mwc-circular-progress';

import './components/x-components';
import './parts/x-parts';

import {setLocaleFromUrl} from './localization';
import {BannerMessage} from './components/banner-message';

import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {WebsiteSettingsDB} from './parts/dashboard/settings';
import {loadMenu} from './backend';

export function retrieveSupabase(
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODk5MDIyNywiZXhwIjoxOTM0NTY2MjI3fQ.Nf1C2uRIocHV2bmfvbUxPGE8MTbRjbB9Kvft4V0dUaI'
): SupabaseClient {
  const supabaseUrl = 'https://ylqcozoikxxipzbvueua.supabase.co';

  return createClient(supabaseUrl, token);
}

/**
 * Luna-orbit
 *
 * @slot - This element has slots
 */
@customElement('luna-orbit')
export class LunaOrbit extends LitElement {
  private mobileMenu!: HTMLDivElement | null;
  private mobileMenuToggle!: HTMLButtonElement | null;

  static APIValidatorURL = 'https://lcd.terra.dev/staking/validators/';
  static APILunaPrice =
    'https://fcd.terra.dev/v1/market/price?denom=uusd&interval=1m';

  @state()
  private validatorInformation?: Validator;
  @state()
  private _commission = 0;

  public router: Router = new Router(document.querySelector('.content'));
  @property({type: Object})
  location = this.router.location;
  @state()
  private _bannerMessage!: BannerMessage;
  @state()
  private _price = 0;

  @state()
  private _supabase: SupabaseClient;
  private _priceInterval: number | null = null;
  private _isRefreshStopped = false;

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
      {path: '/', component: 'x-home'},
      {path: '/home', component: 'x-home'},
      {path: '/test', component: 'x-test'},
      {path: '/how-to', component: 'x-how-to'},
      {path: '/tools', component: 'x-tools'},
      {path: '/contact', component: 'x-contact'},
      {path: '/airdrops', component: 'airdrop-dialog'},
      {path: '/bluna', component: 'x-bluna'},
      {path: '/cockpit', component: 'x-admin'},
      {path: '/cockpit/:page', component: 'x-admin'},
      {path: '(.*)', component: 'x-404'},
    ]);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );
  }

  public async showAirdropDialog(): Promise<void> {
    document.body.appendChild(document.createElement('airdrop-dialog'));
  }

  public async updateBannerMessage(): Promise<void> {
    if (sessionStorage.getItem('lunaorbit-banner-hide')) {
      return;
    }

    const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
    const enabledReq = queryBuilder
      .select('name, value, type')
      .eq('name', 'announcement-visible');
    const settings = (await enabledReq).data;

    if (settings && settings[0].value == 'true') {
      const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
      const query = queryBuilder
        .select('name, value, type')
        .eq('name', 'announcement');

      const settingDetail = (await query).data;
      if (!settingDetail) {
        return;
      }

      const banners = document.querySelectorAll('banner-message');
      for (const banner of banners) {
        banner.parentElement?.removeChild(banner);
      }

      const bannerNode = document.createElement('banner-message');
      bannerNode.message = settingDetail[0].value;

      bannerNode.addEventListener('click', function () {
        bannerNode.parentElement?.removeChild(bannerNode);
        sessionStorage.setItem('lunaorbit-banner-hide', 'true');
      });

      document.body.insertBefore(bannerNode, document.body.firstChild);
    }
  }

  private async _showAirdropToast() {
    if (sessionStorage.getItem('lunaorbit-airdrops-hide')) {
      return;
    }

    const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
    const enabledReq = queryBuilder
      .select('name, value, type')
      .eq('name', 'airdrop-balloon-visible');
    const settings = (await enabledReq).data;
    if (settings && settings[0].value == 'true') {
      const hasToast = this.shadowRoot?.querySelector('airdrop-toast');
      if (hasToast) {
        hasToast.parentElement?.removeChild(hasToast);
      }

      this.shadowRoot?.appendChild(document.createElement('airdrop-toast'));
    }
  }

  async firstUpdated(): Promise<void> {
    await Promise.all([
      setLocaleFromUrl(),
      this._setupMenus(),
      this.updateBannerMessage(),
      this._showAirdropToast(),
      this._retrieveCommissionAndPrice()
    ]);

    this._handleMobileMenu();
  }

  private async _setupMenus() {
    const menuHolders = document.querySelectorAll('.menu-holder');

    const menuItems = await loadMenu(this._supabase);
    const links = [];
    if (menuItems) {
      for (const menuItem of menuItems) {
        links.push(menuItem);
      }
    }

    for (const menuHolder of menuHolders) {
      for (const link of links) {
        const elem = document.createElement('a');
        elem.href = link.url;
        elem.className =
          link.class ??
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium';
        elem.innerText = link.name;
        menuHolder.appendChild(elem);
      }

      const elem = document.createElement('a');
      elem.target = "_blank";
      elem.href = 'https://station.terra.money/validator/terravaloper1p94a6vwl9dkd98cyrlmzf6ydjdgfvamyhu33fa';
      elem.className ='text-gray-300 hover:text-white block px-3 py-2 text-base font-medium';
      elem.innerText = 'Delegate'
      menuHolder.appendChild(elem);
    }
  }

  render(): TemplateResult {
    const isWebsite = this.router.location.pathname.indexOf('cockpit') === -1;

    return html`
      ${this._bannerMessage}
      <slot name="nav"></slot>
      <slot name="content"></slot>
      ${isWebsite
        ? html`
            <slot name="equation"></slot>
            <slot name="divider"></slot>
            <slot name="footer"></slot>
          `
        : html``}
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
    const operatorAddressQuery = retrieveSupabase().from('settings').select('name, value').eq('name', 'operator-address');
    const operatorSetting = (await operatorAddressQuery).data;
    let operatorAddress = '';
    if (operatorSetting) {
      operatorAddress = operatorSetting[0].value;
    }
    const [priceQuery, validatorQuery] = await Promise.all([
      fetch(LunaOrbit.APILunaPrice),
      fetch(
        LunaOrbit.APIValidatorURL + operatorAddress
      ),
    ]);

    const price = (await priceQuery.json()) as LunaPriceResponse;
    this._price = price.lastPrice;

    const equation = document.querySelector('x-equation');
    if (equation) {
      equation.price = this._price;
    }

    this.validatorInformation = await validatorQuery.json();

    if (this.validatorInformation) {
      this._commission = parseInt(
        this.validatorInformation.result.commission.commission_rates.rate,
        10
      );

      const footer = document.querySelector('website-footer');
      if (footer) {
        footer.commission = this._commission + '%';
      }
    }

    if (this._isRefreshStopped) {
      return;
    }

    const priceCheck = window.setInterval(async () => {
      const priceReq = await fetch(LunaOrbit.APILunaPrice);
      const price = (await priceReq.json()) as LunaPriceResponse;
      if (this._price == price.lastPrice) { return; }

      this._price = price.lastPrice;
      const equation = document.querySelector('x-equation');
      if (equation) {
        equation.price = this._price;
      }
    }, 60000);

    this._priceInterval = priceCheck;
  }

  public stopPriceRefesh(): void {
    this._isRefreshStopped = true;
    if (this._priceInterval) {
      window.clearInterval(this._priceInterval);
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

    if (page?.indexOf('cockpit') !== -1) {
      import('./parts/x-admin').then(() => {
        this.requestUpdate();
      });
    }

    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'luna-orbit': LunaOrbit;
  }
}
