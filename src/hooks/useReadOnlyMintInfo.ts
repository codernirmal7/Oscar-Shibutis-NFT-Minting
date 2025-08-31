import { useState, useEffect, useCallback, useRef } from 'react';
import { Contract, JsonRpcProvider, formatEther } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import shibutisABI from '../ContractAbis/ShibutisABI.json';

export interface MintInfo {
  totalSupply: number;
  maxSupply: number;
  remainingSupply: number;
  mintProgress: number;
  salePhase: number;
  salePhaseText: string;
  mintPrice: string;
  presalePrice: string;
  maxPerWalletPublic: number;
  revealed: boolean;
  isPresaleActive: boolean;
  isPublicActive: boolean;
  isClosed: boolean;
}

const PHASE_NAMES = ['Closed', 'Presale', 'Public Sale'];

export const useReadOnlyMintInfo = () => {
  const [mintInfo, setMintInfo] = useState<MintInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent recreating objects
  const providerRef = useRef<JsonRpcProvider | null>(null);
  const contractRef = useRef<Contract | null>(null);
  const fetchingRef = useRef(false);
  const retryCountRef = useRef(0);

  // Initialize provider and contract only once
  const initializeContract = useCallback(() => {
    if (!providerRef.current) {
      providerRef.current = new JsonRpcProvider(
        // 'https://eth.llamarpc.com'
    "https://ethereum-sepolia-rpc.publicnode.com"
      );
    }
    
    if (!contractRef.current) {
      contractRef.current = new Contract(
        CONTRACT_ADDRESSES.SHIBUTIS,
        shibutisABI,
        providerRef.current
      );
    }
    
    return contractRef.current;
  }, []); // Empty deps - only initialize once

  // Memoized fetch function with stable reference
  const fetchMintInfo = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const contract = initializeContract();

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const contractCalls = Promise.all([
        contract.totalSupply(),
        contract.MAX_SUPPLY(),
        contract.mintPrice(),
        contract.presalePrice(),
        contract.maxPerWalletPublic(),
        contract.salePhase(),
        contract.revealed()
      ]);

      const [
        totalSupply,
        maxSupply,
        mintPrice,
        presalePrice,
        maxPerWalletPublic,
        salePhase,
        revealed
      ] = await Promise.race([contractCalls, timeout]) as any[];

      const totalSupplyNum = Number(totalSupply);
      const maxSupplyNum = Number(maxSupply);
      const salePhaseNum = Number(salePhase);
      const remainingSupply = maxSupplyNum - totalSupplyNum;
      const mintProgress = maxSupplyNum > 0 ? (totalSupplyNum / maxSupplyNum) * 100 : 0;

      const info: MintInfo = {
        totalSupply: totalSupplyNum,
        maxSupply: maxSupplyNum,
        remainingSupply,
        mintProgress,
        salePhase: salePhaseNum,
        salePhaseText: PHASE_NAMES[salePhaseNum] || 'Unknown',
        mintPrice: formatEther(mintPrice),
        presalePrice: formatEther(presalePrice),
        maxPerWalletPublic: Number(maxPerWalletPublic),
        revealed: Boolean(revealed),
        isPresaleActive: salePhaseNum === 1,
        isPublicActive: salePhaseNum === 2,
        isClosed: salePhaseNum === 0,
      };

      setMintInfo(info);
      retryCountRef.current = 0; // Reset retry count on success
      
    } catch (err: any) {
      console.error('Error fetching mint info:', err);
      setError(
        err.message.includes('fetch') || err.message.includes('timeout')
          ? 'Network connection failed. Please check your internet connection.' 
          : err.message || 'Failed to fetch mint information'
      );
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [initializeContract]); // Only depends on initializeContract (which has empty deps)

  // Manual refresh function with stable reference
  const refresh = useCallback(() => {
    retryCountRef.current = 0;
    fetchMintInfo();
  }, [fetchMintInfo]);

  // Initial fetch and interval setup
  useEffect(() => {
    // Fetch immediately on mount
    fetchMintInfo();
    
    // Set up interval for auto-refresh (30 seconds)
    const interval = setInterval(() => {
      if (!fetchingRef.current) { // Only fetch if not already fetching
        fetchMintInfo();
      }
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
      fetchingRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return {
    mintInfo,
    loading,
    error,
    refresh // This function has stable reference
  };
};
