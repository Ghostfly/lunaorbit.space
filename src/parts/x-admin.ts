import {LitElement, html, TemplateResult, customElement, property} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import { msg } from '@lit/localize';

import 'wired-elements/lib/wired-elements';

import { WiredButton, WiredInput } from 'wired-elements/lib/wired-elements';

import IPFS from 'ipfs';

import uint8ArrayConcat from 'uint8arrays/concat';
import uint8ArrayToString from 'uint8arrays/to-string';

const stringToUse = 'hello world from webpacked IPFS';

/**
 * XAdmin component
 *
 */
@customElement('x-admin')
export class XAdmin extends Localized(LitElement) {
  @property({type: Number})
  public price = 0;

  @property({type: String})
  protocolVersion = '';
  @property({type: String})
  agentVersion = '';
  @property({type: String})
  addedFileHash = '';
  @property({type: String})
  addedFileContents = '';

  createRenderRoot(): this {
    return this;
  }

  async ops (): Promise<void> {
    const node = await IPFS.create({ repo: String(Math.random() + Date.now()) })

    console.log('IPFS node is ready');

    const { id, agentVersion, protocolVersion } = await node.id();

    this.id = id;
    this.agentVersion = agentVersion;
    this.protocolVersion = protocolVersion;

    const { cid } = await node.add(stringToUse);
    this.addedFileHash = cid.toString();

    const bufs = []

    for await (const buf of node.cat(cid)) {
      bufs.push(buf)
    }

    const data = uint8ArrayConcat(bufs)
    this.addedFileContents = uint8ArrayToString(data);
  }

  async firstUpdated(): Promise<void> {
    this.ops();
  }

  render(): TemplateResult {
    return html`
      <div class="container  mx-auto py-12 px-6">
        <h2 class="font-semibold">If you know, you know.</h2>
        <wired-input type="password" class="m-4" placeholder="Password"></wired-input>
        <wired-button elevation="2">${msg('Connect')}</wired-button>

        <div>
        <h1>Everything is working!</h1>
        <p>Your ID is <strong>${this.id}</strong></p>
        <p>Your IPFS version is <strong>${this.agentVersion}</strong></p>
        <p>Your IPFS protocol version is <strong>${this.protocolVersion}</strong></p>
        <hr />
        <div>
          Added a file! <br />
          ${this.addedFileHash}
        </div>
        <br />
        <br />
        <p>
          Contents of this file: <br />
          ${this.addedFileContents}
        </p>
      </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-admin': XAdmin;
    'wired-button': WiredButton;
    'wired-input': WiredInput;
  }
}
