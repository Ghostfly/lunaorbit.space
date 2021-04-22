import {
  LitElement,
  html,
  TemplateResult,
  customElement,
  property,
} from 'lit-element';

/**
 * Hero with CTA component
 */
@customElement('cta-hero')
export class CTAHero extends LitElement {
  @property({type: String})
  public title!: string;

  @property({type: String})
  public href!: string;

  @property({type: String})
  public ctaText!: string;

  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2
          class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
        >
          <span class="block terra-color">${this.title}</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a
              href="${this.href}"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
            >
              ${this.ctaText}
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cta-hero': CTAHero;
  }
}
