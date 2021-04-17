var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LunaOrbit_1;
import { html, customElement, internalProperty, LitElement, css, property, } from 'lit-element';
import { Router } from '@vaadin/router';
import './x-pages';
import config from './config';
/**
 * Luna-orbit
 *
 * @slot - This element has a slot
 */
let LunaOrbit = LunaOrbit_1 = class LunaOrbit extends LitElement {
    constructor() {
        var _a, _b, _c;
        super();
        this._commission = 0;
        this.router = new Router(document.querySelector('.content'));
        this.location = this.router.location;
        this.mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
        this.mobileMenu = document.querySelector('#mobile-menu');
        this.router.setRoutes([
            {
                path: '',
                component: 'x-home',
            },
            { path: '/', component: 'x-home' },
            { path: '/home', component: 'x-home' },
            { path: '/how-to', component: 'x-how-to' },
            { path: '/tools', component: 'x-tools' },
            { path: '/contact', component: 'x-contact' },
        ]);
        window.addEventListener('vaadin-router-location-changed', this._routerLocationChanged.bind(this));
        this.closeBanner = document.querySelector('#close-banner');
        const banner = (_b = (_a = this.closeBanner.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        if (this.closeBanner && banner) {
            if (sessionStorage.getItem('lunaorbit-banner-hide')) {
                (_c = banner.parentElement) === null || _c === void 0 ? void 0 : _c.removeChild(banner);
            }
            this.closeBanner.addEventListener('click', () => {
                var _a;
                (_a = banner.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(banner);
                sessionStorage.setItem('lunaorbit-banner-hide', 'true');
            });
        }
    }
    static get styles() {
        return css `
      .dynamic-head {
        display: flex;
        justify-content: space-between;
        margin: 2em;
      }
    `;
    }
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    async firstUpdated() {
        this._handleMobileMenu();
        await this._retrieveCommission();
    }
    render() {
        return html `
      <slot name="header-banner"></slot>
      <slot name="nav"></slot>
      <slot name="content"></slot>
      <slot name="equation"></slot>
      <slot name="divider"></slot>
      <slot name="footer"></slot>
    `;
    }
    _handleMobileMenu() {
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                var _a;
                if (((_a = this.mobileMenu) === null || _a === void 0 ? void 0 : _a.style.display) == 'none') {
                    this.mobileMenu.style.display = 'block';
                }
                else if (this.mobileMenu) {
                    this.mobileMenu.style.display = 'none';
                }
            });
        }
    }
    async _retrieveCommission() {
        const validatorQuery = await fetch(LunaOrbit_1.APIValidatorURL + config.address);
        this.validatorInformation = await validatorQuery.json();
        if (this.validatorInformation) {
            this._commission = parseInt(this.validatorInformation.result.commission.commission_rates.rate, 10);
            const commissionNode = document.querySelector('#commission');
            commissionNode.innerText = this._commission + '%';
        }
    }
    _routerLocationChanged(event) {
        var _a;
        const page = (_a = event.detail.location.route) === null || _a === void 0 ? void 0 : _a.path.replace('/', '');
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
};
LunaOrbit.APIValidatorURL = 'https://lcd.terra.dev/staking/validators/';
__decorate([
    internalProperty()
], LunaOrbit.prototype, "validatorInformation", void 0);
__decorate([
    internalProperty()
], LunaOrbit.prototype, "_commission", void 0);
__decorate([
    property({ type: Object })
], LunaOrbit.prototype, "location", void 0);
LunaOrbit = LunaOrbit_1 = __decorate([
    customElement('luna-orbit')
], LunaOrbit);
export { LunaOrbit };
//# sourceMappingURL=luna-orbit.js.map