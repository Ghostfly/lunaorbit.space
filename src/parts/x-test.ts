import { LitElement, html, TemplateResult, customElement, property } from 'lit-element';
import { Localized } from '@lit/localize/localized-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

/**
 * Test component
 *
 */
@customElement('x-test')
export class XTest extends Localized(LitElement) {
  @property({type: String})
  public html!: string;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    /*const fileContents = await getFileContents('page-staking-en.json', '', undefined, undefined, true);
    const parser = new edjsParser({
      image: {
        use: "figure",
        imgClass: "img",
        figureClass: "fig-img",
        figCapClass: "fig-cap",
        path: "absolute",
      },
      paragraph: {
        pClass: "paragraph",
      },
      code: {
        codeBlockClass: "code-block",
      },
      embed: {
        useProvidedLength: false,
      },
      quote: {
        applyAlignment: false,
      },
    });

    if (fileContents) {
      const markup = parser.parse(JSON.parse(fileContents as string));
      this.html = markup;
    }*/
  }

  render(): TemplateResult {
    return html`
      <div>
        ${unsafeHTML(this.html)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-test': XTest;
  }
}
