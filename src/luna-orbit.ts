import {
  html,
  customElement,
  internalProperty,
  LitElement,
  css,
  property,
} from 'lit-element';
import {Validator} from './terra-min';
import {Router, RouterLocation} from '@vaadin/router';

import './x-pages';

import config from './config';

import {LOCALE_STATUS_EVENT} from '@lit/localize';

/**
 * Luna-orbit
 *
 * @slot - This element has a slot
 */
@customElement('luna-orbit')
export class LunaOrbit extends LitElement {
  private mobileMenu!: HTMLDivElement | null;
  private mobileMenuToggle!: HTMLButtonElement | null;
  private closeBanner!: HTMLButtonElement | null;

  static APIValidatorURL = 'https://lcd.terra.dev/staking/validators/';

  @internalProperty()
  private validatorInformation?: Validator;
  @internalProperty()
  private _commission = 0;

  public router: Router = new Router(document.querySelector('.content'));
  @property({type: Object})
  location = this.router.location;

  static get styles() {
    return css`
      .dynamic-head {
        display: flex;
        justify-content: space-between;
        margin: 2em;
      }
    `;
  }

  constructor() {
    super();
    this.mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    this.mobileMenu = document.querySelector('#mobile-menu');

    this.router.setRoutes([
      {
        path: '',
        component: 'x-home',
      },
      {path: '/', component: 'x-home'},
      {path: '/home', component: 'x-home'},
      {path: '/how-to', component: 'x-how-to'},
      {path: '/tools', component: 'x-tools'},
      {path: '/contact', component: 'x-contact'},
    ]);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );

    this.closeBanner = document.querySelector(
      '#close-banner'
    ) as HTMLButtonElement;
    const banner = this.closeBanner.parentElement?.parentElement?.parentElement;
    if (this.closeBanner && banner) {
      if (sessionStorage.getItem('lunaorbit-banner-hide')) {
        banner.parentElement?.removeChild(banner);
      }

      this.closeBanner.addEventListener('click', () => {
        banner.parentElement?.removeChild(banner);
        sessionStorage.setItem('lunaorbit-banner-hide', 'true');
      });
    }
  }

  createRenderRoot() {
    return this.attachShadow({mode: 'open'});
  }

  async firstUpdated() {
    // Display a spinner whenever a new locale is loading.
    window.addEventListener(LOCALE_STATUS_EVENT, ({detail}) => {
      if (detail.status === 'loading') {
        console.log(`Loading new locale: ${detail.loadingLocale}`);
        // spinner.removeAttribute('hidden');
      } else if (detail.status === 'ready') {
        console.log(`Loaded new locale: ${detail.readyLocale}`);
        // spinner.setAttribute('hidden', '');
      } else if (detail.status === 'error') {
        console.error(
          `Error loading locale ${detail.errorLocale}: ` + detail.errorMessage
        );
        // spinner.setAttribute('hidden', '');
      }
    });

    this._handleMobileMenu();
    await this._retrieveCommission();
  }

  render() {
    return html`
      <slot name="header-banner"></slot>
      <slot name="nav"></slot>
      <slot name="content"></slot>
      <slot name="equation"></slot>
      <slot name="divider"></slot>
      <slot name="footer"></slot>
    `;
  }

  private _handleMobileMenu() {
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

  private async _retrieveCommission() {
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
  ) {
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'luna-orbit': LunaOrbit;
  }
}
