import { LitElement, TemplateResult, CSSResult } from 'lit-element';
declare const AirdropToast_base: typeof LitElement;
/**
 * Banner message component
 */
export declare class AirdropToast extends AirdropToast_base {
    toast: HTMLDivElement;
    close(): void;
    static get styles(): CSSResult;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'airdrop-toast': AirdropToast;
    }
}
export {};
//# sourceMappingURL=airdrop-toast.d.ts.map