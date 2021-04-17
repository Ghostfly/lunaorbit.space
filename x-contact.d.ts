import { LitElement } from 'lit-element';
/**
 * Contact component
 */
export declare class XContact extends LitElement {
    contactForm: HTMLFormElement;
    status: HTMLParagraphElement;
    createRenderRoot(): this;
    firstUpdated(): void;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'x-contact': XContact;
    }
}
//# sourceMappingURL=x-contact.d.ts.map