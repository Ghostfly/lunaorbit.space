import { LitElement, TemplateResult } from 'lit-element';
declare const BannerMessage_base: typeof LitElement;
export declare class BannerMessage extends BannerMessage_base {
    message: string;
    createRenderRoot(): this;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'banner-message': BannerMessage;
    }
}
export {};
//# sourceMappingURL=banner-message.d.ts.map