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
