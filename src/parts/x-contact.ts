import {
  html,
  customElement,
  query,
  TemplateResult,
  state,
  LitElement,
} from 'lit-element';

import {msg} from '@lit/localize';
import {retrieveSupabase} from '../luna-orbit';
import {WebsiteSettingsDB} from './dashboard/settings';

/**
 * Contact component
 */
@customElement('x-contact')
export class XContact extends LitElement {
  @query('#contact-form')
  public contactForm!: HTMLFormElement;

  @query('#status')
  public status!: HTMLParagraphElement;
  @state()
  private _twitter: WebsiteSettingsDB | undefined;
  @state()
  private _telegram: WebsiteSettingsDB | undefined;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const queryBuilder = retrieveSupabase().from<WebsiteSettingsDB>('settings');
    const query = queryBuilder.select('name, value, type');

    const settings = (await query).data;
    if (settings) {
      this._telegram = settings.find((setting) => setting.name === 'telegram');
      this._twitter = settings.find((setting) => setting.name === 'twitter');
    }
  }

  render(): TemplateResult {
    return html`
      <section class="text-gray-600 body-font relative">
        <div class="absolute inset-0 bg-gray-300">
          <img
            class="w-full h-full object-cover"
            src="assets/moon.jpeg"
            alt="Moon"
            width="600"
            height="292"
          />
        </div>
        <div class="container px-5 py-24 mx-auto flex">
          <div
            class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md"
          >
            <h2 class="text-gray-900 text-lg mb-6 font-medium title-font">
              ${msg('Find us on')}
            </h2>
            <p class="text-md mt-3 flex flex-row">
              <a
                href="http://t.me/${this._telegram?.value.replace('@', '')}"
                target="_blank"
                rel="noopener"
                title="Telegram"
                class="text-gray-500 hover:text-indigo-500"
                >
                <svg style="height: 100px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><linearGradient id="a" x1=".667" x2=".417" y1=".167" y2=".75"><stop offset="0" stop-color="#37aee2"/><stop offset="1" stop-color="#1e96c8"/></linearGradient><linearGradient id="b" x1=".66" x2=".851" y1=".437" y2=".802"><stop offset="0" stop-color="#eff7fc"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><circle cx="120" cy="120" r="120" fill="url(#a)"/><path fill="#c8daea" d="M98 175c-3.888 0-3.227-1.468-4.568-5.17L82 132.207 170 80"/><path fill="#a9c9dd" d="M98 175c3 0 4.325-1.372 6-3l16-15.558-19.958-12.035"/><path fill="url(#b)" d="M100.04 144.41l48.36 35.729c5.519 3.045 9.501 1.468 10.876-5.123l19.685-92.763c2.015-8.08-3.08-11.746-8.36-9.349l-115.59 44.571c-7.89 3.165-7.843 7.567-1.438 9.528l29.663 9.259 68.673-43.325c3.242-1.966 6.218-.91 3.776 1.258"/></svg>
              </a>
              <a
                class="text-gray-500 hover:text-indigo-500"
                href="https://twitter.com/${this._twitter?.value}"
                target="_blank"
                rel="noopener"
                title="Twitter"
                ><svg style="height: 100px" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg3626" viewBox="0 0 300.00006 244.18703" height="244.18703" width="300.00006">
                <defs id="defs3628"/>
                <metadata id="metadata3631">
                  <rdf:RDF>
                    <cc:Work rdf:about="">
                      <dc:format>image/svg+xml</dc:format>
                      <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
                      <dc:title/>
                    </cc:Work>
                  </rdf:RDF>
                </metadata>
                <g transform="translate(-539.17946,-568.85777)" id="layer1">
                  <path id="path3611" style="fill:#1da1f2;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 633.89823,812.04479 c 112.46038,0 173.95627,-93.16765 173.95627,-173.95625 0,-2.64628 -0.0539,-5.28062 -0.1726,-7.90305 11.93799,-8.63016 22.31446,-19.39999 30.49762,-31.65984 -10.95459,4.86937 -22.74358,8.14741 -35.11071,9.62551 12.62341,-7.56929 22.31446,-19.54304 26.88583,-33.81739 -11.81284,7.00307 -24.89517,12.09297 -38.82383,14.84055 -11.15723,-11.88436 -27.04079,-19.31655 -44.62892,-19.31655 -33.76374,0 -61.14426,27.38052 -61.14426,61.13233 0,4.79784 0.5364,9.46458 1.58538,13.94057 -50.81546,-2.55686 -95.87353,-26.88582 -126.02546,-63.87991 -5.25082,9.03545 -8.27852,19.53111 -8.27852,30.73006 0,21.21186 10.79366,39.93837 27.20766,50.89296 -10.03077,-0.30992 -19.45363,-3.06348 -27.69044,-7.64676 -0.009,0.25652 -0.009,0.50661 -0.009,0.78077 0,29.60957 21.07478,54.3319 49.0513,59.93435 -5.13757,1.40062 -10.54335,2.15158 -16.12196,2.15158 -3.93364,0 -7.76596,-0.38716 -11.49099,-1.1026 7.78383,24.2932 30.35457,41.97073 57.11525,42.46543 -20.92578,16.40207 -47.28712,26.17062 -75.93712,26.17062 -4.92898,0 -9.79834,-0.28036 -14.58427,-0.84634 27.05868,17.34379 59.18936,27.46396 93.72193,27.46396"/>
                </g>
              </svg></a
              >.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-contact': XContact;
  }
}
