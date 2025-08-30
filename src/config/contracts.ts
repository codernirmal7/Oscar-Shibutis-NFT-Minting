import { Contract } from 'ethers';

export const CONTRACT_ADDRESSES = {
  SHIBUTIS: '0xd72347C5535AdbD241d176867b1BE8a893822e85',
} as const;


export interface ShibutisConfig {
  maxSupply: bigint;         
  mintPrice: bigint;          // Public mint price (wei)
  presalePrice: bigint;       // Presale mint price (wei)
  maxPerWalletPublic: bigint; 
  salePhase: number;         
  totalSupply: bigint;     
  revealed: boolean;        
  baseURI: string;            
  hiddenURI: string;          
  merkleRoot: string;       
}

export interface UserMintInfo {
  address: string;        
  presaleMinted: bigint; 
  publicMinted: bigint;   
}


export interface ContractInstance {
  shibutisContract: Contract;
}