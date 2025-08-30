import { useState, useEffect, useCallback, useRef } from 'react';
import { formatEther } from 'ethers';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useEthersSigner } from './useEthersSigner';
import { useContracts } from './useContracts';
import { useToast } from './use-toast';
import { SUPPORTED_CHAIN_ID } from '../config/chainId';
import getErrorMessage from '../config/CustomError';
import { ShibutisConfig, UserMintInfo } from '../config/contracts';
import { getAllowlistEntry } from '../config/allowlist';

export const useMinting = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const signer = useEthersSigner();
  const { contracts, initializeContracts } = useContracts();
  const { toast } = useToast();

  // Use ref to track initialization to prevent loops
  const isInitialized = useRef(false);
  const contractsInitialized = useRef(false);

  const [config, setConfig] = useState<ShibutisConfig>({
    maxSupply: 0n,
    mintPrice: 0n,
    presalePrice: 0n,
    maxPerWalletPublic: 0n,
    salePhase: 0,
    totalSupply: 0n,
    revealed: false,
    baseURI: '',
    hiddenURI: '',
    merkleRoot: '',
  });

  const [userInfo, setUserInfo] = useState<UserMintInfo>({
    address: '',
    presaleMinted: 0n,
    publicMinted: 0n,
  });

  const [loading, setLoading] = useState({
    contract: false,
    minting: false,
    switchingChain: false,
  });

  const isCorrectChain = chainId === SUPPORTED_CHAIN_ID;

  // Initialize contracts only once
  useEffect(() => {
    if (signer && isCorrectChain && !contractsInitialized.current) {
      contractsInitialized.current = true;
      initializeContracts(signer);
    }
  }, [signer, isCorrectChain, initializeContracts]);

  // Fetch contract configuration
  const fetchConfig = useCallback(async () => {
    if (!contracts?.shibutisContract || loading.contract) return;

    setLoading(prev => ({ ...prev, contract: true }));

    try {
      const contract = contracts.shibutisContract;

      const [
        maxSupply,
        mintPrice,
        presalePrice,
        maxPerWalletPublic,
        salePhase,
        totalSupply,
        revealed,
        merkleRoot
      ] = await Promise.all([
        contract.MAX_SUPPLY(),
        contract.mintPrice(),
        contract.presalePrice(),
        contract.maxPerWalletPublic(),
        contract.salePhase(),
        contract.totalSupply(),
        contract.revealed(),
        contract.merkleRoot(),
      ]);

      setConfig({
        maxSupply: BigInt(maxSupply.toString()),
        mintPrice: BigInt(mintPrice.toString()),
        presalePrice: BigInt(presalePrice.toString()),
        maxPerWalletPublic: BigInt(maxPerWalletPublic.toString()),
        salePhase: Number(salePhase),
        totalSupply: BigInt(totalSupply.toString()),
        revealed,
        baseURI: '',
        hiddenURI: '',
        merkleRoot,
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contract information',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, contract: false }));
    }
  }, [contracts?.shibutisContract, loading.contract, toast]);

  // Fetch user-specific information
  const fetchUserInfo = useCallback(async () => {
    if (!contracts?.shibutisContract || !address) return;

    try {
      const contract = contracts.shibutisContract;

      const [presaleMinted, publicMinted] = await Promise.all([
        contract.presaleMinted(address),
        contract.publicMinted(address),
      ]);

      setUserInfo({
        address,
        presaleMinted: BigInt(presaleMinted.toString()),
        publicMinted: BigInt(publicMinted.toString()),
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, [contracts?.shibutisContract, address]);

  // Initialize data fetching only once when contracts are ready
  useEffect(() => {
    if (contracts?.shibutisContract && !isInitialized.current) {
      isInitialized.current = true;
      fetchConfig();
      if (address) {
        fetchUserInfo();
      }
    }
  }, [contracts?.shibutisContract]);

  // Update user info when address changes (but don't fetch config again)
  useEffect(() => {
    if (contracts?.shibutisContract && address && isInitialized.current) {
      fetchUserInfo();
    }
  }, [address]);

  // Switch to correct chain
  const handleSwitchChain = useCallback(async () => {
    if (!switchChain) return;

    setLoading(prev => ({ ...prev, switchingChain: true }));

    try {
      await switchChain({ chainId: SUPPORTED_CHAIN_ID });
      toast({
        title: 'Success',
        description: 'Switched to Ethereum mainnet',

      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to switch chain',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, switchingChain: false }));
    }
  }, [switchChain, toast]);

  const checkAllowlist = useCallback((userAddress: string): {
    proof: string[],
    isAllowlisted: boolean,
    allowance: number
  } => {
    const entry = getAllowlistEntry(userAddress);

    if (entry) {
      return {
        proof: entry.proof,
        isAllowlisted: true,
        allowance: entry.allowance
      };
    }

    return {
      proof: [],
      isAllowlisted: false,
      allowance: 0
    };
  }, []);

  // Presale mint function
  const presaleMint = useCallback(async (quantity: number, allowance: number, proof: string[]) => {
    if (!contracts?.shibutisContract || !address) return;

    setLoading(prev => ({ ...prev, minting: true }));

    try {
      const contract = contracts.shibutisContract;
      const value = config.presalePrice * BigInt(quantity);

      const tx = await contract.whitelistMint(quantity, allowance, proof, {
        value: value.toString(),
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Your mint transaction has been submitted',
        variant: 'default',
      });

      await tx.wait();

      toast({
        title: 'Mint Successful!',
        description: `Successfully minted ${quantity} Shibutis NFT${quantity > 1 ? 's' : ''}`,

      });

      // Manually refresh data after successful mint
      await fetchConfig();
      await fetchUserInfo();

    } catch (error: any) {
      console.error('Presale mint error:', error);
      toast({
        title: 'Mint Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, minting: false }));
    }
  }, [contracts?.shibutisContract, address, config.presalePrice, toast, fetchConfig, fetchUserInfo]);

  // Public mint function
  const publicMint = useCallback(async (quantity: number) => {
    if (!contracts?.shibutisContract || !address) return;

    setLoading(prev => ({ ...prev, minting: true }));

    try {
      const contract = contracts.shibutisContract;
      const value = config.mintPrice * BigInt(quantity);

      const tx = await contract.publicMint(quantity, {
        value: value.toString(),
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Your mint transaction has been submitted',
        variant: 'default',
      });

      await tx.wait();

      toast({
        title: 'Mint Successful!',
        description: `Successfully minted ${quantity} Shibutis NFT${quantity > 1 ? 's' : ''}`,

      });

      // Manually refresh data after successful mint
      await fetchConfig();
      await fetchUserInfo();

    } catch (error: any) {
      console.error('Public mint error:', error);
      toast({
        title: 'Mint Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, minting: false }));
    }
  }, [contracts?.shibutisContract, address, config.mintPrice, toast, fetchConfig, fetchUserInfo]);

  return {
    // State
    config,
    userInfo,
    loading,
    isConnected,
    isCorrectChain,

    // Actions
    presaleMint,
    publicMint,
    handleSwitchChain,
    checkAllowlist,
    fetchConfig,
    fetchUserInfo,

    // Computed values
    isPresale: config.salePhase === 1,
    isPublic: config.salePhase === 2,
    isClosed: config.salePhase === 0,
    totalMinted: Number(config.totalSupply),
    maxSupply: Number(config.maxSupply),
    mintPriceEth: Number(formatEther(config.mintPrice)),
    presalePriceEth: Number(formatEther(config.presalePrice)),
  };
};
