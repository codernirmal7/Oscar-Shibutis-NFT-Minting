export interface AllowlistEntry {
  address: string;
  allowance: number;
  proof: string[];
}

export const ALLOWLIST_DATA: AllowlistEntry[] = [
  {
    address: '0x0Ac2b95aB3C988f413fA90D1bea5e7a1028d0540',
    allowance: 20,
    proof: [
      '0xa4a4b78e87a2728592663d3b2a370767e3e8af1c4d311f0afe8688d92ce38c3d',
      '0x0355b764c18fe52902d77b525bc0d6c41f5c13eb56355180b85f4d7aa9d6e77d'
    ]
  },
  {
    address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    allowance: 5,
    proof: [
      '0x034b5f995576c2c7e48d0e263b1fa6c1611a7181edde28c417e6ca82f6d3f75b',
      '0x0355b764c18fe52902d77b525bc0d6c41f5c13eb56355180b85f4d7aa9d6e77d'
    ]
  },
  {
    address: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    allowance: 3,
    proof: [
      '0xbcbfcade519d8e05213b379ed08db14c76aa6038a2794522e942ee0ecc128417',
      '0xa6df2708dd3622bd6fe2c8eb0e64779d40d63f29e13316819c7bf0e1ad3a122a'
    ]
  },
  {
    address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    allowance: 2,
    proof: [
      '0xa8f57c8594a07d2f8805664ba6e4335a11a490cefbf7be4307cc406d4ad3d071',
      '0xa6df2708dd3622bd6fe2c8eb0e64779d40d63f29e13316819c7bf0e1ad3a122a'
    ]
  }
];

// Helper function to get allowlist entry by address
export const getAllowlistEntry = (address: string): AllowlistEntry | null => {
  const normalizedAddress = address.toLowerCase();
  return ALLOWLIST_DATA.find(entry => 
    entry.address.toLowerCase() === normalizedAddress
  ) || null;
};

// Helper function to check if address is allowlisted
export const isAddressAllowlisted = (address: string): boolean => {
  return getAllowlistEntry(address) !== null;
};