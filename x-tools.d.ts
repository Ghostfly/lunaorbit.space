import { LitElement, TemplateResult } from 'lit-element';
declare enum Tools {
    Airdrop = "airdrop",
    Staking = "staking",
    Exchange = "exchange",
    Various = "various",
    USTSupply = "ust-supply",
    MIRVolume = "mirror-volume",
    ValidatorPerformance = "validator-perf"
}
interface ToolSection {
    id: Tools;
    name: string;
    explain: string;
    links: {
        href: string;
        name: string;
    }[];
}
/**
 * Tools component
 */
export declare class XTools extends LitElement {
    createRenderRoot(): this;
    private sections;
    sectionForTools(toolsSection: Tools): ToolSection | undefined;
    private _sectionTemplate;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'x-tools': XTools;
    }
}
export {};
//# sourceMappingURL=x-tools.d.ts.map