import {Extension, SyncTxBroadcastResult} from '@terra-money/terra.js';

export type Result = SyncTxBroadcastResult.Data;
export interface PostResponse {
  id: number;
  origin: string;
  success: boolean;
  result?: Result;
  error?: {code: number; message?: string};
}

interface ExtNetworkConfig {
  name: string;
  chainID: string;
  lcd: string;
}

interface ConnectResponse {
  address: string;
}

const ext = new Extension();
class ExtensionSingleton {
  get init() {
    return !!ext.isAvailable;
  }

  async info(): Promise<ExtNetworkConfig> {
    const res = await ext.request('info');
    return res.payload as ExtNetworkConfig;
  }

  async connect(): Promise<{address: string}> {
    const res = await ext.request('connect');
    return res.payload as ConnectResponse;
  }
}

export default new ExtensionSingleton();
