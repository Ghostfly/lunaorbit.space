import {
  LitElement,
  html,
  TemplateResult,
  customElement,
  property,
  css,
} from 'lit-element';

/**
 * Luna orbit loader
 */
@customElement('lunaorbit-loader')
export class LunaOrbitLoader extends LitElement {
  @property({type: Boolean})
  public loading = false;

  static styles = css`
  .loader {
    position: fixed;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 999;
    transition: opacity .5s ease-in-out;
  }

  .loader.hidden {
    opacity: 0;
    pointer-events: none;
  }

  svg {
    width: 500px;
  }
  `;

  render(): TemplateResult {
    return html`
      <div
        class="loader w-screen ${this.loading ? 'shown' : 'hidden'}"
      >
      ${this.loading ? html`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 642.1 646.6">
          <g id="moon">
            <circle fill="#93959E" cx="305.5" cy="350.4" r="135.7" />
            <circle fill="#D2D3D4" cx="291.1" cy="333.7" r="105.4" />
            <circle opacity=".52" fill="#D2D3D4" cx="374.5" cy="437.2" r="12.4" />
          </g>
          <g id="astronaut">
            <ellipse opacity=".19" fill="#1A222D" cx="297.7" cy="225.2" rx="40.7" ry="10" />
            <circle fill="#9B835C" cx="270.1" cy="179.8" r="4.8" />
            <circle fill="#9B835C" cx="318.9" cy="202" r="4.8" />
            <path fill="#86878E" d="M321 184.5c-.7-6.4-10.6-8.2-10.6-8.2s-11.1 1.1-18.1.7c-6.7-.4-9.7 5.5-10 6.1-5 2.9-7.9-4.9-7.9-4.9l-7.9 7.8c6.7 7.9 6.4 10.2 11.1 11.8 2 .7 4.6-.4 7-1.9l.2.9.2 5.7 1.6 17.4h11.6l2.6-15 1.9 15h9.9l3.3-17 7.9-2.2c0 .1-2.1-9.8-2.8-16.2z"
            />
            <circle id="head" class="drop" fill="#93959E" cx="300.9" cy="158.7" r="20.2" />
            <path id="mask" opacity=".57" fill="#1A222D" d="M310.7 169.7c.5-1.4.8-3 .8-4.6 0-7.3-5.9-13.3-13.3-13.3s-13.3 5.9-13.3 13.3c0 1.5.3 3 .7 4.3 4 1.9 13.2 5 25.1.3z" />
            <g fill="#575C66">
              <path d="M286.9 217c-2.3.8-3.9 2.4-3.9 4.1 0 2.7 3.5 4.8 7.7 4.8 4.3 0 7.7-2.1 7.7-4.8 0-.7-.3-1.4-.7-2-5.7 2.3-10.8-2.1-10.8-2.1zM313.2 216.3c-2.3 3-8 2.9-10.3 2.7-.3.5-.4 1-.4 1.6 0 2.7 3.3 4.8 7.4 4.8s7.4-2.1 7.4-4.8c0-1.9-1.7-3.5-4.1-4.3zM286.1 217zM313.3 216.2h-.1c-.1.1 0 .1.1 0-.1 0-.1 0 0 0z"
              />
            </g>
            <ellipse fill="#93959E" cx="300.5" cy="190.6" rx="11.1" ry="8.8" />
          </g>
          <g id="stars" opacity=".31" fill="#D2D3D4">
            <circle cx="71" cy="74.4" r="6" />
            <circle cx="503" cy="175.4" r="6" />
            <circle opacity=".49" cx="461" cy="38.4" r="6" />
            <circle cx="65" cy="579.4" r="6" />
          </g>
        </svg>
      ` : html``}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lunaorbit-loader': LunaOrbitLoader;
  }
}
