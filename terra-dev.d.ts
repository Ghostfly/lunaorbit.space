export interface Description {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
}
export interface CommissionRates {
    rate: string;
    max_rate: string;
    max_change_rate: string;
}
export interface Commission {
    commission_rates: CommissionRates;
    update_time: string;
}
export interface Result {
    operator_address: string;
    consensus_pubkey: string;
    jailed: boolean;
    status: number;
    tokens: string;
    delegator_shares: string;
    description: Description;
    unbonding_height: string;
    unbonding_time: Date;
    commission: Commission;
    min_self_delegation: string;
}
export interface RootObject {
    height: string;
    result: Result;
}
//# sourceMappingURL=terra-dev.d.ts.map