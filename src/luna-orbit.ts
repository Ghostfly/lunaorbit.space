
import "./locale-picker";import {
  html,
  customElement,
  internalProperty,
  LitElement,
  css,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import {Validator} from './terra-min';
import {Router, RouterLocation} from '@vaadin/router';

import './x-home';
import './x-how-to';
import './x-tools';
import './x-contact';

import config from './config';
import { setLocaleFromUrl } from './localization';
import { Localized } from "@lit/localize/localized-element";
import { msg } from "@lit/localize";
/**
 * Luna-orbit
 *
 * @slot - This element has a slot
 */
@customElement('luna-orbit')
export class LunaOrbit extends Localized(LitElement) {
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

  static get styles(): CSSResult {
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

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({mode: 'open'});
  }

  async firstUpdated(): Promise<void> {
    await setLocaleFromUrl();

    this._handleMobileMenu();
    await this._retrieveCommission();
  }

  render(): TemplateResult {
    return html`
      <locale-picker></locale-picker>
      <slot name="header-banner"></slot>
      <slot name="nav"></slot>
      <slot name="content"></slot>
      <slot name="equation"></slot>
      <slot name="divider"></slot>
      <slot name="footer"></slot>
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

  private async _retrieveCommission(): Promise<void> {
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

    const bannerMessage = msg('0% commissions until May 10th 2021');
    const bannerNode = document.querySelector(
      '#banner-message'
    ) as HTMLElement;
    bannerNode.innerText = bannerMessage;
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'luna-orbit': LunaOrbit;
  }
}
