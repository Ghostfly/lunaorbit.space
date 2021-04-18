import { LitElement, TemplateResult } from 'lit-element';
import { TerraQuery } from './terra-min';
declare const AirdropDialog_base: typeof LitElement;
/**
 * Airdrop dialog component
 */
export declare class AirdropDialog extends AirdropDialog_base {
    static ANCAirdropCheckingURL: string;
    static MIRAirdropCheckingURL: string;
    terraAddress: string;
    message: string;
    dialog: HTMLDivElement;
    showANC: boolean;
    showMIR: boolean;
    loading: boolean;
    close(): void;
    createRenderRoot(): this;
    checkAnchor(): Promise<void>;
    checkMIR(): Promise<void>;
    protected _mirAirdropCheckParams(): TerraQuery;
    protected _ancAirdropCheckParams(): TerraQuery;
    private _checkAirdrops;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'airdrop-dialog': AirdropDialog;
    }
}
export {};
//# sourceMappingURL=airdrop-dialog.d.ts.map