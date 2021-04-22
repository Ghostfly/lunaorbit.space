/**
 * Terra LCD
 */
export interface Validator {
  block: string;
  result: {
    commission: {
      commission_rates: {
        rate: string;
      };
    };
  };
}

export interface TerraQuery {
  operationName: string;
  variables: {
    network?: string;
    address?: string;
    airdropContract?: string;
    isClaimedQuery?: string;
  };
  query: string;
}

export interface AnchorClaimResponse {
  data: {
    isClaimed: {
      Result: string;
    };
  };
}

export interface MIRAirdrop {
  address: string;
  amount: string;
  claimable: boolean;
  createdAt: string; // Date ISO
  id: number;
  merkleRoot: string;
  network: 'TERRA';
  proof: string;
  rate: string; // contains number
  stage: number;
  staked: string; // Contains number
  total: string; // Contains number
}

export interface LunaPriceResponse {
  lastPrice: number;
  oneDayVariation: string;
  oneDayVariationRate: string;
  prices: {
    datetime: number; // Timestamp
    denom: string;
    price: number;
  }[];
}
