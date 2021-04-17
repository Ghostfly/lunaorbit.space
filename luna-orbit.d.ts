import { LitElement } from 'lit-element';
import { Router, RouterLocation } from '@vaadin/router';
import './x-pages';
/**
 * Luna-orbit
 *
 * @slot - This element has a slot
 */
export declare class LunaOrbit extends LitElement {
    private mobileMenu;
    private mobileMenuToggle;
    private closeBanner;
    static APIValidatorURL: string;
    private validatorInformation?;
    private _commission;
    router: Router;
    location: RouterLocation;
    static get styles(): import("lit-element").CSSResult;
    constructor();
    createRenderRoot(): ShadowRoot;
    firstUpdated(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    private _handleMobileMenu;
    private _retrieveCommission;
    private _routerLocationChanged;
}
declare global {
    interface HTMLElementTagNameMap {
        'luna-orbit': LunaOrbit;
    }
}
//# sourceMappingURL=luna-orbit.d.ts.map